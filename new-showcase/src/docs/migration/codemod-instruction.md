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

## Recipes

The sections below document each recipe and the exact change categories it applies, with one before/after example per category. Use them as a reference when reviewing a codemod diff — every hunk a recipe produces should map to one of its listed categories.

### Recipe: enforce-top-level-exports

Supported versions: `^39.0.0`. Migrates deep `lib/` imports to the top-level barrel, moves CSS imports to `./styles/`, and applies the `TextLine` → `TextField` rename and the removed-alias renames.

```bash
npx @com.mgmtp.a12.widgets/widgets-codemod@latest enforce-top-level-exports ./tsconfig.json
```

#### Rewrite import paths

Any deep `lib/**` import of `widgets-core` or `widgets-utils` collapses to the package root.

```typescript
// Before
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
import { SourceCodeSection } from "@com.mgmtp.a12.widgets/widgets-utils/lib/code-example/index.js";

// After
import { Button } from "@com.mgmtp.a12.widgets/widgets-core";
import { SourceCodeSection } from "@com.mgmtp.a12.widgets/widgets-utils";
```

#### Rewrite CSS import paths

The two CSS entry points move from `lib/` to `styles/`.

| Before                                                                 | After                                        |
| ---------------------------------------------------------------------- | -------------------------------------------- |
| `…/widgets-core/lib/theme/basic.css`                                   | `…/widgets-core/styles/basic.css`            |
| `…/widgets-core/lib/rich-text-editor/main/themes/rich-text-editor.css` | `…/widgets-core/styles/rich-text-editor.css` |

#### Rename symbols

The removed deprecated aliases are rewritten to their replacements throughout your code.

| Renamed export (before) | Replacement (after)                | What this export is                                                 |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `IconPicker`            | `IconPickerTitles`                 | the a11y localization key for the icon picker, not the component    |
| `Tooltip`               | `TooltipPlugin`                    | the Rich Text Editor tooltip plugin, not the general Tooltip widget |
| `TooltipProps`          | `TooltipPluginProps`               | props for the Rich Text Editor tooltip plugin                       |
| `TooltipWrapperProps`   | `TooltipPluginWrapperProps`        | wrapper props for the Rich Text Editor tooltip plugin               |
| `commonTileConfigs`     | `commonInteractiveTileFlatConfigs` | the shared interactive-tile config in the flat theme                |
| `BodyCell`              | `TreeTableBodyCell`                | the tree-table body cell component                                  |
| `BodyContent`           | `TreeTableBodyContent`             | the tree-table body content component                               |
| `walk`                  | `walkTreeNode`                     | the tree-node traversal helper                                      |

#### Rename TextLine to TextField

The `TextLine` naming is dropped in favour of `TextField`. The recipe applies plain text rewrites, so the rules below match by name pattern rather than by usage — review the diff for false positives (see the note after the table).

| Rewrite (before)                 | Replacement (after)   | What is matched                                                                                                                                   |
| -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TextLineStateless`              | `TextField`           | the component export — in imports and JSX                                                                                                         |
| `TextLineStatelessProps`         | `TextFieldProps`      | the props interface — in type annotations                                                                                                         |
| `DataRoles.Textline`             | `DataRoles.TextField` | the `DataRoles.Textline` property access                                                                                                          |
| `TextLineConfigType`             | `TextFieldConfigType` | the theme config type                                                                                                                             |
| `textLineConfig`                 | `textFieldConfig`     | the theme config object                                                                                                                           |
| any `"textline…"` string literal | `"text-field…"`       | **any** string/template literal starting with `textline` — `data-role` values in markup, tests, and CSS selectors, but also any other such string |
| any `textLine` identifier        | `textField`           | **any** identifier named `textLine` — the theme config key, destructured names, `createTheme` overrides, and anything else by that name           |

> The last two rules are pattern-based and intentionally broad — a literal beginning with `textline` or an identifier named `textLine` is rewritten regardless of whether it is widgets-related. Review the diff for unintended matches in your own code (e.g. unrelated strings or variables).

#### Not covered

The type-augmentation path move (`lib/@types/*` → `types/*`) is **not** rewritten correctly by this recipe and must be updated by hand.

### Recipe: prefer-top-level-imports

Supported versions: `^38.2.0`. Migrates deep `widgets-core` imports to the top-level barrel and renames the entities that were deprecated to avoid duplicate export names.

```bash
npx @com.mgmtp.a12.widgets/widgets-codemod@latest prefer-top-level-imports ./tsconfig.json
```

#### Rewrite import paths

Any deep `widgets-core/lib/**` import collapses to the package root.

```typescript
// Before
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";

// After
import { Button } from "@com.mgmtp.a12.widgets/widgets-core";
```

#### Rename symbols

The deprecated entities are rewritten to their replacements.

| Renamed export (before) | Replacement (after)                | What this export is                                                 |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `ResizeEventHandler`    | `ColumnResizeEventHandler`         | the column-resize event handler in the table new API                |
| `IconPicker`            | `IconPickerTitles`                 | the a11y localization key for the icon picker, not the component    |
| `Tooltip`               | `TooltipPlugin`                    | the Rich Text Editor tooltip plugin, not the general Tooltip widget |
| `TooltipProps`          | `TooltipPluginProps`               | props for the Rich Text Editor tooltip plugin                       |
| `TooltipWrapperProps`   | `TooltipPluginWrapperProps`        | wrapper props for the Rich Text Editor tooltip plugin               |
| `commonTileConfigs`     | `commonInteractiveTileFlatConfigs` | the shared interactive-tile config in the flat theme                |
| `BodyCell`              | `TreeTableBodyCell`                | the tree-table body cell component                                  |
| `BodyContent`           | `TreeTableBodyContent`             | the tree-table body content component                               |
| `walk`                  | `walkTreeNode`                     | the tree-node traversal helper                                      |
