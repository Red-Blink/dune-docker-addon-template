# Permissions

Server owners review addon permissions before installing an addon. Keep permissions narrow and easy to understand.

## Supported Permission Keys

| Permission | Allows |
| --- | --- |
| `players:read` | Read player summaries, identities and supported progression data. |
| `ops:read` | Read operations, activity, economy and container-health summaries. |
| `database:read` | Run read-only database queries through the console bridge. |
| `database:write` | Run write database statements through the console bridge. The console creates a database backup first. |
| `server:status` | Read hardware telemetry through `server.hardware.status`. |
| `server:restart` | Reserved for restarting services. |
| `files:addon-data` | Read and write persistent JSON scoped to the addon ID. |
| `rewards:grant` | Queue and inspect supported rewards through the Console's delivery service. |
| `players:message` | Queue and inspect private messages to individual players. |
| `admin:grant-items` | Deliver items through the Console's validated item-grant action. |
| `broadcast:send` | Reserved for sending in-game broadcasts. |
| `scheduler:server` | Legacy scheduler permission; not a general addon scheduling API. |

Declaring a permission does not implement an action or approve access. The owner
must approve requested permissions when installing or updating. Prefer typed
player, storage and reward actions to SQL or a separate privileged companion.

The current action contracts and payload limits are documented in the Console's
[Addon Runtime API](https://github.com/Red-Blink/dune-awakening-selfhost-docker/blob/main/docs/addons/addon-runtime-api.md),
[Hardware Status API](https://github.com/Red-Blink/dune-awakening-selfhost-docker/blob/main/docs/addons/hardware-status.md)
and [Item Grants API](https://github.com/Red-Blink/dune-awakening-selfhost-docker/blob/main/docs/addons/addon-item-grants.md).

## Examples

Read players only:

```json
"permissions": {
  "players": ["read"]
}
```

Read database only:

```json
"permissions": {
  "database": ["read"]
}
```

Read and write database:

```json
"permissions": {
  "database": ["read", "write"]
}
```
