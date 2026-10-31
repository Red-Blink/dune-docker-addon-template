# Bridge API

Addons run inside an iframe. They call back into Dune Docker Console through the bridge helper in `web/dune-addon-bridge.js`.

Use it like this:

```js
const result = await window.DuneAddon.request("players.summary.list");
const players = result.rows;
```

## Available Actions

| Action | Required permission | Purpose |
| --- | --- | --- |
| `leadership.players.list` | `players:read` | Read player summary data exposed by the console. |
| `players.summary.list` | `players:read` | Preferred player-summary action; returns `{ capabilities, rows }`. |
| `players.identity.list` | `players:read` | Read player identity data. |
| `players.progression.get` | `players:read` | Read supported progression for one `playerId`. |
| `addon.storage.get`, `.list`, `.put`, `.delete` | `files:addon-data` | Persistent addon-owned JSON with optional version checks. |
| `rewards.deliver`, `.status`, `.list` | `rewards:grant` | Durable reward requests and delivery status. |
| `players.message.send`, `.status`, `.list` | `players:message` | Private player messages and delivery status. |
| `admin.items.grant` | `admin:grant-items` | Validated, retry-safe item delivery. |
| `server.hardware.status` | `server:status` | Read-only hardware telemetry. |
| `ops.health.summary`, `ops.health.summary.v2`, `ops.health.players`, `ops.health.farms`, `ops.health.containers` | `ops:read` | Operations health snapshots. |
| `ops.activity.summary`, `ops.resources.summary`, `ops.combat.deaths`, `ops.economy.summary` | `ops:read` | Read-only operations summaries. |
| `database.query` | `database:read` | Run read-only SQL. |
| `database.execute` | `database:write` | Run write SQL. The console creates a database backup first. |

Keep bridge calls small and explicit. Ask only for the permissions your addon actually uses.

See the Console's [Addon Runtime API](https://github.com/Red-Blink/dune-awakening-selfhost-docker/blob/main/docs/addons/addon-runtime-api.md)
for request/response shapes, limits and capability flags. Reuse a deterministic
delivery `requestId` when retrying a reward or message; do not generate a new ID
for each retry. Storage belongs to the addon and is removed on uninstall.

The SQL bridge accepts `query` text; it does **not** bind a `params` array.
Do not interpolate untrusted values into SQL. Prefer the typed actions above.

## Sandbox

Addon pages run in a sandbox without direct Console REST access, browser
storage, external network fetches or extra iframe privileges. Bundle the runtime
assets your addon needs and use the bridge for supported data and storage.
An API key does not bypass the sandbox. Do not require server owners to weaken
it or grant a companion Docker/host access to replace a supported bridge action.

## Local Development

The real bridge exists only when your addon is opened inside Dune Docker Console.
If you open `web/index.html` directly in a browser, use mock data for local UI
work.

Example:

```js
async function getPlayers() {
  if (window.parent === window) {
    return [
      {
        name: "Local Test Player",
        level: 42,
        faction: "Atreides",
        guild: "Dev Guild",
        status: "Online",
        map: "Survival_1"
      }
    ];
  }

  const result = await window.DuneAddon.request("players.summary.list");
  return result.rows || result.players || (Array.isArray(result) ? result : []);
}
```

For testing real bridge calls before publishing, install the addon into your own
local Dune Docker Console instance. See [Local Development](local-development.md).
