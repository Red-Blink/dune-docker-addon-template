const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
function fixture(t,change=()=>{}){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'addon-validation-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  fs.mkdirSync(path.join(dir,'scripts'));fs.mkdirSync(path.join(dir,'web'));
  fs.copyFileSync(path.join(root,'scripts/validate.js'),path.join(dir,'scripts/validate.js'));
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'addon.json'),'utf8'));change(manifest);
  fs.writeFileSync(path.join(dir,'addon.json'),JSON.stringify(manifest));fs.writeFileSync(path.join(dir,'web/index.html'),`<html data-addon-id="${manifest.id}"></html>`);
  return {dir,run:()=>spawnSync(process.execPath,[path.join(dir,'scripts/validate.js')],{encoding:'utf8'})};
}
test('current player, operations, storage, hardware, reward and message permissions validate',t=>{
  const {run}=fixture(t,m=>{m.permissions={players:['read','message'],ops:['read'],files:['addon-data'],server:['status'],rewards:['grant'],admin:['grant-items']};});
  const result=run();assert.equal(result.status,0,result.stderr);
});
test('unknown permissions and unsafe package versions fail validation',t=>{
  for(const change of [m=>m.permissions=['host:exec'],m=>m.version='../../other',m=>m.version='1.0']){const {run}=fixture(t,change);assert.notEqual(run().status,0);}
});
test('relative entry paths cannot escape through traversal or symlinks',t=>{
  const {run}=fixture(t,m=>m.entry.path='../outside.html');assert.notEqual(run().status,0);
  const linked=fixture(t);fs.unlinkSync(path.join(linked.dir,'web/index.html'));fs.symlinkSync(__filename,path.join(linked.dir,'web/index.html'));assert.notEqual(linked.run().status,0);
});
test('entry must be a file and its bridge identity must match the manifest',t=>{
  const directory=fixture(t,m=>m.entry.path='web');assert.notEqual(directory.run().status,0);
  const mismatch=fixture(t);fs.writeFileSync(path.join(mismatch.dir,'web/index.html'),'<html data-addon-id="wrong-addon"></html>');assert.notEqual(mismatch.run().status,0);
});
