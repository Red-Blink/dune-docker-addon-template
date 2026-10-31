// Supply a reviewed SQL statement for a disposable test database. The bridge
// does not bind a params array; never interpolate untrusted values into SQL.
// Prefer typed reward/storage actions for new addon features.
async function writeWithBackup(reviewedSql) {
  return window.DuneAddon.request("database.execute", {
    query: reviewedSql
  });
}
