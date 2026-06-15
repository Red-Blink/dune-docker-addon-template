# Publishing

Addon code stays in your addon repository. The community index only points server owners to reviewed release packages.

## Release Your Addon

1. Make sure `addon.json.version` is correct.
2. Create and push a matching tag:

   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

3. GitHub Actions validates the addon, creates the release package, and uploads:

   ```text
   my-dune-addon-0.1.0.zip
   my-dune-addon-0.1.0.zip.sha256
   ```

## Submit To The Community Index

Open a pull request to:

```text
https://github.com/Red-Blink/dune-docker-addons
```

Your pull request should update exactly these files:

```text
addons/my-dune-addon.json
index.json
```

Use your real addon ID in the filename. The `addons/*.json` file contains the install details, including `downloadUrl` and `sha256`. The `index.json` file contains the short listing shown in Dune Docker Console.
