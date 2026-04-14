## Why patching is needed

Some third-party packages may not work correctly due to missing files, incorrect types/import statements, or other minor issues.
While waiting for the maintainers to release a fixed version, applying patch files is a way to keep the project stable and unblocked,
avoiding forking and making it easy to remove the patch once the official fix becomes available.

Therefore, our published artifacts may include patch files when necessary.
These patches will be removed once we upgrade to a version that includes the official fix.

## Available patch file

Below is the patch file included in the published artifact, which can be applied to temporarily fix known issues in a specific third-party package.

| Artifact                            | Third-party package |
| ----------------------------------- | ------------------- |
| @com.mgmtp.a12.widgets/widgets-core | react-dnd           |

## How to apply patch files

For each of our published package, if patches are needed, a `patches` folder will be present at the same level as the `package.json` file.

Inside this folder, there are **two versions** of each patch: one in the `pnpm` subfolder for native [pnpm](https://pnpm.io/) patching feature,
and one in the `npm` subfolder for projects that do not use pnpm, for example:

```bash
/node_modules
    /@com.mgmtp.a12.widgets
      /widgets-core
        package.json
        /patches
          /npm    ← for npm (or yarn) + patch-package users
          /pnpm   ← for pnpm users (native support)
```

Each patch file is named based on the tool that created it, following the general format:
`<package-name><separator><version>.patch`. The separator is `@` for patches created by pnpm,
and `+` for those created by other tools like [patch-package](https://www.npmjs.com/package/patch-package).

The following section explains how projects can apply our patch files depending on the package manager in use.

### For projects using `pnpm`

1. Copy the patch from its location inside the Widgets package to the root-level `patches` folder (create the folder if it doesn’t exist).
   **Example:**
   To patch `react-dnd`, copy the patch file from:

   ```bash
   <project-root>/node_modules/@com.mgmtp.a12.widgets/widgets-core/patches/pnpm/react-dnd@16.0.1.patch
   ```

   to your root-level `patches` folder:

   ```bash
   <project-root>/patches/react-dnd@16.0.1.patch
   ```

2. Add to your **package.json** located at the root level (the same level as `pnpm-workspace.yaml`):

   ```json
   {
   	"pnpm": {
   		"patchedDependencies": {
   			"<package-name>@<version>": "<relative-path-to-patch-file>"
   		}
   	}
   }
   ```

   **Important:**
   - The `<relative-path-to-patch-file>` must be relative to the project root and should point to the patch file inside the `patches` folder at the root.
   - Replace `<package-name>@<version>` with the actual package name and version.

   **Example:**
   To patch `react-dnd`, add this section to the project root `package.json` file:

   ```json
   {
   	"pnpm": {
   		"patchedDependencies": {
   			"react-dnd@16.0.1": "./patches/react-dnd@16.0.1.patch"
   		}
   	}
   }
   ```

3. Reinstall dependencies

   ```bash
   pnpm install
   ```

   The patch will be applied automatically.

### For projects using `npm` or `yarn`

1. Install the [patch-package](https://www.npmjs.com/package/patch-package) package as a development dependency:

   ```bash
   npm install patch-package --save-dev
   ```

2. Add the following script to the project root `package.json` file (the one has the same level as `package-lock.json`):

   ```json
   {
   	"scripts": {
   		"postinstall": "patch-package"
   	}
   }
   ```

3. Copy the patch from its location inside the Widgets package to the root-level `patches` folder (create the folder if it doesn’t exist).

   **Example:**
   To patch `react-dnd`, copy the patch file from:

   ```bash
   <project-root>/node_modules/@com.mgmtp.a12.widgets/widgets-core/patches/npm/react-dnd+16.0.1.patch
   ```

   to your root-level `patches` folder:

   ```bash
   <project-root>/patches/react-dnd+16.0.1.patch
   ```

4. Reinstall dependencies

   ```bash
   npm install
   ```

   The patch will be applied automatically after installation.
