A command-line tool for running automated code transformations (**codemods**) on TypeScript projects.  
Codemods assist with codebase migrations by automatically applying breaking changes, deprecations, and API updates—reducing manual effort and minimizing human error during upgrades.

## Usage

The codemod supports two primary modes of operation:

1. **Recipe-based execution** — Run a specific codemod recipe by its identifier
2. **Version-based migration** — Run all applicable recipes for a target library version

Run the codemod using either `npx` or `pnpm dlx`:

```bash
npx @com.mgmtp.a12.widgets/widgets-codemod@latest <recipe-id-or-version> <tsconfig-path> [options]
```

```bash
pnpm dlx @com.mgmtp.a12.widgets/widgets-codemod@latest <recipe-id-or-version> <tsconfig-path> [options]
```

### Running a Specific Recipe

To execute a single codemod recipe, provide the recipe identifier and the path to your TypeScript configuration:

```bash
npx @com.mgmtp.a12.widgets/widgets-codemod@latest prefer-top-level-imports ./tsconfig.json
```

### Migrating to a Target Version

To run all codemods applicable for migrating to a specific library version, provide the target version number instead of a recipe identifier:

```bash
npx @com.mgmtp.a12.widgets/widgets-codemod@latest 38.0.0 ./tsconfig.json
```

The tool automatically identifies and executes all recipes whose supported version range includes the specified target version.

### Interactive Mode

For guided execution, use interactive mode to select recipes or specify the target version through prompts:

```bash
npx @com.mgmtp.a12.widgets/widgets-codemod@latest --interactive
```

## Arguments

- **`<recipe-id-or-version>`**

  Either the identifier of a specific codemod recipe to execute, or a target version number (e.g., `1.2.0`, `38.0.0`) to run all applicable recipes. Use `--list` to view available recipes and their supported versions.

- **`<tsconfig-path>`**

  Path to a `tsconfig.json` file or a directory containing one. Accepts both absolute and relative paths (relative to the current working directory).

## Options

- **`--list`, `-l`** _(default: `false`)_

  List all available codemod recipes along with their supported version ranges and descriptions.

  ```bash
  npx @com.mgmtp.a12.widgets/widgets-codemod@latest --list
  ```

- **`--interactive`, `-i`** _(default: `false`)_

  Run in interactive mode, allowing you to select a recipe or specify a target version through guided prompts.

  ```bash
  npx @com.mgmtp.a12.widgets/widgets-codemod@latest -i
  ```

- **`--git-check`** _(default: `true`)_

  Verify that the git working directory is clean before execution. If uncommitted changes are detected, you will be prompted to confirm before proceeding. Use `--no-git-check` to disable this check.

  ```bash
  npx @com.mgmtp.a12.widgets/widgets-codemod@latest 38.0.0 ./tsconfig.json --no-git-check
  ```

- **`--help`**

  Display CLI help information including usage syntax, available options, and examples.

  ```bash
  npx @com.mgmtp.a12.widgets/widgets-codemod@latest --help
  ```

## Post-Execution Recommendations

After running codemods, it is recommended to:

1. **Review the changes** — Codemods apply transformations based on pattern matching and may not cover all edge cases. Carefully review the generated diff before committing.
2. **Run linters and formatters** — Codemods do not automatically apply code formatting. Run your project's linter (e.g., ESLint) and formatter (e.g., Prettier) to ensure code style consistency.
3. **Execute tests** — Run your test suite to verify that the transformations did not introduce regressions.
4. **Commit incrementally** — If running multiple recipes or migrating across versions, consider committing after each successful transformation for easier rollback if issues arise.
