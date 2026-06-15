# Dune Docker Addon Template

Starter template for building community addons for Dune Docker Console.

Addons run inside the console as iframe pages and talk to the console through a permissioned bridge. Server owners review requested permissions when installing an addon.

## How This Works

There are three repositories involved:

- This template repo: start here when building a new addon.
- Your addon repo: this is where your addon code and GitHub Releases live.
- The community addon index: submit a pull request here when your addon is ready.

Community addon index:

```text
https://github.com/Red-Blink/dune-docker-addons
```

## Create Your Addon

1. Click **Use this template** on GitHub.
2. Rename the addon fields in `addon.json`.
3. Build your UI in `web/`.
4. Run validation:

   ```bash
   node scripts/validate.js
   ```

5. Commit and push your addon.
6. Create a version tag that matches `addon.json`:

   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

7. GitHub Actions will validate, package, create the GitHub Release, and upload:

   ```text
   my-dune-addon-0.1.0.zip
   my-dune-addon-0.1.0.zip.sha256
   ```

8. Add your addon entry to the community addons index. The index points server owners to your reviewed release package.

For local testing only, you can still run:

```bash
bash scripts/package.sh
```

## Submit Your Addon

When your addon is ready, open a pull request to:

```text
https://github.com/Red-Blink/dune-docker-addons
```

Your pull request should change exactly these files:

```text
addons/my-dune-addon.json
index.json
```

Use your real addon ID in the filename. For example, if your addon ID is `server-notes`, add:

```text
addons/server-notes.json
```

Then add one short entry for it in `index.json`.

Do not put your addon source code in `dune-docker-addons`. Your addon code stays in your own addon repository. The `dune-docker-addons` repo only lists reviewed addon releases.

## Addon Package Rules

The `.zip` file must contain:

- `addon.json` at the root of the archive.
- The UI entry file referenced by `addon.json`, usually `web/index.html`.
- Any static assets used by the addon.

Do not include secrets, private tokens, database dumps, or machine-specific files.

## `addon.json`

```json
{
  "schemaVersion": 1,
  "id": "my-dune-addon",
  "name": "My Dune Addon",
  "description": "A starter addon for Dune Docker Console.",
  "author": "Your Name",
  "version": "0.1.0",
  "type": "ui",
  "entry": {
    "navigation": "My Addon",
    "path": "web/index.html"
  },
  "permissions": {
    "players": ["read"],
    "database": ["read"]
  }
}
```

Use a unique lowercase `id`, for example `server-notes`, `player-inspector`, or `landsraad-helper`.

## Supported Bridge Actions

These bridge actions are currently available:

| Action | Required permission | Notes |
| --- | --- | --- |
| `leadership.players.list` | `players:read` | Reads player summary data exposed by the console. |
| `database.query` | `database:read` | Runs read-only SQL only. |
| `database.execute` | `database:write` | Runs write SQL. The console creates a database backup first. |

## Permissions

Current permission keys:

| Permission | Allows |
| --- | --- |
| `players:read` | Read player summary data exposed by the console. |
| `database:read` | Run read-only database queries through the console bridge. |
| `database:write` | Run write database statements through the console bridge. The console creates a database backup first. |
| `server:status` | Reserved for reading server status data. |
| `server:restart` | Reserved for restarting services. |
| `files:addon-data` | Reserved for storing addon-owned data. |
| `broadcast:send` | Reserved for sending in-game broadcasts. |

Request only the permissions your addon actually needs.

## Bridge Requests

The helper in `web/src/addon.js` sends bridge requests to the console:

```js
const players = await DuneAddon.request("leadership.players.list");

const rows = await DuneAddon.request("database.query", {
  query: "select player_id, player_name from dune.players limit 10"
});
```

Read-only SQL should use `database.query`. Write SQL must use `database.execute` and requires `database:write`.

## Community Index Entry

After the GitHub release workflow creates your `.zip`, add a manifest file for your addon release, then add a short index entry that points to that manifest. The console reads the index first, then reads the manifest for install details.

Add this to `dune-docker-addons/index.json`:

```json
{
  "id": "my-dune-addon",
  "name": "My Dune Addon",
  "description": "A starter addon for Dune Docker Console.",
  "author": "Your Name",
  "version": "0.1.0",
  "manifestUrl": "https://raw.githubusercontent.com/Red-Blink/dune-docker-addons/main/addons/my-dune-addon.json"
}
```

Then create `dune-docker-addons/addons/my-dune-addon.json` with the install details:

```json
{
  "schemaVersion": 1,
  "id": "my-dune-addon",
  "name": "My Dune Addon",
  "description": "A starter addon for Dune Docker Console.",
  "author": "Your Name",
  "version": "0.1.0",
  "type": "ui",
  "sourceUrl": "https://github.com/YourName/my-dune-addon",
  "downloadUrl": "https://github.com/YourName/my-dune-addon/releases/download/v0.1.0/my-dune-addon-0.1.0.zip",
  "sha256": "replace-with-package-sha256",
  "permissions": {
    "players": ["read"],
    "database": ["read"]
  }
}
```

`scripts/package.sh` and the release workflow both create a `.sha256` file. Use that value for `sha256`.

## Release Workflow

The official release path is GitHub Actions:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The tag version must match the `version` field in `addon.json`. For example:

```json
"version": "0.1.0"
```

must be released with:

```text
v0.1.0
```

The workflow creates the GitHub Release and uploads the addon zip plus its SHA-256 checksum.

## Local Preview

You can open `web/index.html` directly in a browser for layout work. Bridge requests only work when the addon is installed and opened inside Dune Docker Console.
