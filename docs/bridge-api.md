# Bridge API

Addons run inside an iframe. They call back into Dune Docker Console through the bridge helper in `web/dune-addon-bridge.js`.

Use it like this:

```js
const result = await window.DuneAddon.request("leadership.players.list");
```

## Available Actions

| Action | Required permission | Purpose |
| --- | --- | --- |
| `leadership.players.list` | `players:read` | Read player summary data exposed by the console. |
| `database.query` | `database:read` | Run read-only SQL. |
| `database.execute` | `database:write` | Run write SQL. The console creates a database backup first. |

Keep bridge calls small and explicit. Ask only for the permissions your addon actually uses.
