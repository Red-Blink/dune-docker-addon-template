const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
test('downloaded archive and checksum can be verified together without the source tree',()=>{
  const result=spawnSync('bash',[path.join(root,'scripts/package.sh')],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'addon.json'),'utf8'));
  const name=`${manifest.id}-${manifest.version}.zip`;
  const digest=createHash('sha256').update(fs.readFileSync(path.join(root,'dist',name))).digest('hex');
  assert.equal(fs.readFileSync(path.join(root,'dist',name+'.sha256'),'utf8').trim(),`${digest}  ${name}`);
});
