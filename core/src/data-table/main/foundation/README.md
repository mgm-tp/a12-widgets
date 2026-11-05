# `data-table/main/foundation/`

The contract `DataTable` shares with the production `Table` — column definitions,
row/cell styling, drag-and-drop options, drag payload shapes.

**These files are a deliberate fork of `core/src/table/main/`, not a shared module.**
`DataTable` must be able to evolve the column and row contracts without changing
the production `Table`'s public API, and the two components are published from
different entry points (`.` vs `./experimental`). Copying was the cheaper of the
two ways to get that; the cost is that the copies can drift silently, which is
what the guard below exists to prevent.

## What is forked, and what was trimmed

| File                     | Forked from                         | Relationship                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `column.api.ts`          | `table/main/column.api.ts`          | **Near-verbatim copy.** Same declarations, same order. Guarded by `__tests__/foundation.fork-drift.test.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `table.api.ts`           | `table/main/table.api.ts`           | **Subset + additions.** Keeps the value-level contracts (`RowKeyGetter`, `RowEventHandlers`, `RowStyles`, `CellStyles`, `TableDragDropOptions`, the resize handler types). Drops every legacy _component prop_ type — `BaseTableProps`, `TableProps`, `TableContextType`, `SortOptions`, `SortState`, `VirtualScrollOptions`, `InfiniteScrollTableProps`, `ColumnResizingOptions`, `RowSegments` — because `DataTable` declares its own in `../data-table.api.ts`. Adds `ColumnResizeDragEvent` / `ColumnResizeDragData`, which exist so the resize callbacks stay structurally assignable from handlers written against the legacy `Table` without this package depending on the react-draggable types. |
| `table-renderer.api.ts`  | `table/main/table-renderer.api.ts`  | **Subset.** Keeps only `TableScrollToNodeHandler` and the drag payload shapes (`DragObject`, `HoveredObject`, `DropResult`). Every renderer-props type is dropped; `DataTable` declares its own in `../data-table-renderer.api.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `infinite-scroll.api.ts` | `table/main/infinite-scroll.api.ts` | **Subset.** Keeps `RowLoadingStatus` only; `InfiniteScrollOptions` lives in `../data-table-infinite-scroll.api.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `table-row-group.api.ts` | —                                   | No legacy counterpart. Owned here.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `utils.ts`               | —                                   | No legacy counterpart. Owned here.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Known, intentional divergences

These are pinned in the drift guard rather than exempted from it — the guard
asserts the weaker property that still has to hold.

| Declaration                                     | Divergence                                                                           | What is still asserted                                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `RowKeyGetter` (`table.api.ts`)                 | The fork's params carry an optional `rowIndex`; the legacy `Table` never passes one. | Mutual assignability — a `rowKey` getter written for either component keeps working in the other. |
| `BaseColumnType.actionColumn` (`column.api.ts`) | Doc-only: the fork mentions the `actionColumnAutoSize` prop.                         | Structural equality (a doc comment does not affect the type).                                     |

## Changing these files

Divergence is allowed — that is the point of the fork — but it must be
deliberate:

1. `../../__tests__/foundation.fork-drift.test.ts` asserts that the shared
   declarations stay structurally identical to the legacy ones. It is a
   _type-level_ guard — it fails `pnpm exec tsc --noEmit` and `pnpm lint`, not the
   test run. If your change is intentional, weaken or move the relevant assertion
   **in the same commit** and add a row to the table above, so the divergence
   shows up in review rather than being discovered later.
2. Both copies are public. `pnpm test:api` diffs `index.api.md` (the package root,
   legacy `Table`) and `experimental.api.md` (the `./experimental` entry,
   `DataTable`) — a change here moves the second one.

## When `DataTable` graduates out of `./experimental`

Two same-named public types in one package is a problem to solve at that point,
not before. The seam is already half-built: `../columns.ts` declares
`DataTableColumn extends BaseColumnType` and holds everything `DataTable` adds
(`renderCell`, `cellSpan`, `renderHeader`, `renderFooter`, `renderFilter`, `id`),
so the shared base and the new surface are already separate. The remaining
decision is whether to promote this folder to a package-level shared module both
tables consume, or to rename the experimental types outright.
