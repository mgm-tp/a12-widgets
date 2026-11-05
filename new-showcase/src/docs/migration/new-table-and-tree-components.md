## Overview

39.0.0 introduces three new components built on a shared headless model: **`DataTable`**, **`DataTreeTable`**, and **`TreeView`**.

**They are additive and `@experimental` — nothing you have today breaks, and no migration is required.** If your existing tables and trees work, you can ignore this page entirely. Treat what follows as an **adoption guide** for teams who want to opt in, one component at a time.

What is and isn't affected:

- The production **`Table`** and **`TreeTable`** are **not deprecated** and remain fully supported (39.0.0 even adds `enableColumnGroupA11y` to both). Stay on them with no action.
- `DataTable` does **not** yet cover every `Table` feature. The sections below document the **supported subset** and how each relevant `Table` API maps onto it.
- Only the legacy **`Tree` template and its behavior HOCs** are deprecated (since 39.0.0) — see [TreeView](#/widgets/data-display/treeview) below. The low-level template primitives (`TreeContainer`, `TreeNode`, `ArrowButton`) are **not** deprecated; they remain the shared building blocks used by `TreeTable` and `DataTreeTable`.

| Component       | Replaces / relates to           | Status of the old one       |
| --------------- | ------------------------------- | --------------------------- |
| `DataTable`     | `Table`                         | not deprecated              |
| `DataTreeTable` | `TreeTable`                     | not deprecated              |
| `TreeView`      | `Tree` template + behavior HOCs | **deprecated** since 39.0.0 |

### Importing

Since 39.0.1 all three components (and their related types and helpers) live on the dedicated **`/experimental`** entry point — they are **not** exported from the package root:

```tsx
import { DataTable, DataTreeTable, TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
```

Every example on this page assumes this import.

## DataTable

`DataTable` renders a native `<table>` driven by a headless model, with components-as-`slots` customization and per-column render hooks. The subsections below cover where it differs from the production `Table`.

### Action columns auto-size to their content (with caveats)

The production `Table` measured action cells in JS (`synchronizeActionCellsWidth`) and sized each action column to fit its buttons in every layout, including under virtualization. `DataTable` restores this behavior on its native `<table>` (`table-layout: fixed`) architecture: a width-less, non-`fixedWidth` `actionColumn` is measured (its buttons plus a labelled header) and the fitted width is written into the same `--a12-col-N-width` channel column resizing uses. This is **on by default** — no migration change is needed for tables that relied on the implicit auto-sizing.

Two things differ from the legacy behavior:

- **Under virtualization**, only the action cells currently rendered in the DOM are measured. The width re-measures when the data, theme, or web fonts change — but not on scroll — so it fits the visible rows rather than the global maximum. This is normally invisible for uniform action buttons, but a column whose button set varies by row may be sized from whichever rows happened to be on screen.
- A column the user **manually resizes** keeps its dragged width; auto-size leaves it alone.

To opt out, give the column an explicit `width` / `fixedWidth` as you would on the production `Table`, or set `actionColumnAutoSize={false}` on the table.

Prefer auto-sizing over a small `width` for icon-only and checkbox columns. A non-`fixedWidth` `width` is a share of the table with `width × 150` pixels as its floor, and that floor is the whole cell including its padding: at `width: 0.2` the 30px cell is all padding and the checkbox inside it is clipped to nothing, in the static and the infinite-scroll body alike.

### Virtual scrolling: new engine, dynamic row heights, `listRef` replacement

`DataTable` virtualizes with `@tanstack/react-virtual` instead of `react-virtualized`. The engine is internal — `virtualScrollOptions` no longer accepts the `Partial<ListProps>` pass-through.

**Row heights** keep the production `Table`'s semantics:

- `virtualScrollOptions: { rowHeight: 40 }` — fixed height, no measurement (fast path).
- `virtualScrollOptions: {}` or `virtualScrollOptions: true` — **dynamic row heights**: each rendered row is measured from the DOM and re-measured on content-driven resize (the old `CellMeasurer` behaviour, without the `deferredMeasurementCache` plumbing). `estimatedRowHeight` (default `50`, matching `CellMeasurerCache`'s `defaultHeight`) sizes rows that haven't been measured yet — set it close to your median row height to minimize scrollbar jitter.

**Constraints** a migrator must know (the production `Table` had none of these):

- Virtualization (and infinite scroll) **requires `maxHeight`** — without a bounded viewport nothing is windowed.
- `infiniteScrollOptions` and `virtualScrollOptions` are mutually exclusive; **infinite scroll wins** when both are set.
- **Row groups** (`DataTableRowsGroup`) are not supported under virtualization or infinite scroll — enabling either silently disables grouping.
- **`rowExpansion`** (the `additionalContentRenderer` replacement) renders under virtualization only with **dynamic row heights** (omit `rowHeight`); a fixed `rowHeight` — and infinite scroll — suppress the expansion panels.
- `infiniteScrollOptions` keeps the legacy core shape (`rowHeight` / `rowCount` / `rowLoadingStatus` / `loadData` / `threshold` / `minimumBatchSize`), but the react-virtualized escape hatches `loaderRef` and `overrideListProps` are **dropped with no replacement** — use `virtualizerRef` (below) for imperative access.

**Imperative access** moves from the leaked `react-virtualized` `List` instance to an engine-agnostic handle. Pass `virtualizerRef` inside `virtualScrollOptions` (or `infiniteScrollOptions`) to receive a `DataTableVirtualizerHandle`:

```tsx
const virtualizer = useRef<DataTableVirtualizerHandle | null>(null);

<DataTable data={rows} columns={columns} maxHeight={500} virtualScrollOptions={{ virtualizerRef: virtualizer }} />;

// Later:
virtualizer.current?.scrollToIndex(250, { align: "center" });
```

| react-virtualized (`listRef` / props)        | DataTable replacement                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `listRef.scrollToRow(i)`                     | `handle.scrollToIndex(i, { align })`                                                                                |
| `listRef.scrollToPosition(px)`               | `handle.scrollToOffset(px, { align })`                                                                              |
| `scrollToAlignment` prop                     | per-call `align` option on the handle methods                                                                       |
| `listRef.recomputeRowHeights()`              | `handle.measure()` — usually unnecessary: rows are observed with `ResizeObserver`, so content resizes are automatic |
| `listRef.measureAllRows()`                   | not needed — measurement is lazy and cached                                                                         |
| `deferredMeasurementCache` / `CellMeasurer`  | not needed — omit `rowHeight` (see above)                                                                           |
| `onRowsRendered` prop                        | `handle.getVirtualIndexes()` (poll) — no callback equivalent; open an issue if you depend on one                    |
| other `ListProps` (`style`, `onScroll`, ...) | no equivalent — the engine is internal by design                                                                    |

### Customization: component `slots` and column render hooks instead of `componentRenderers`

DataTable does **not** have the production `Table`'s `componentRenderers` function map. Customization is layered instead:

- **`slots`** — components instead of render functions, passed as `slots={{ row: MyRow, headCell: MyHeadCell }}`. When migrating a `Table` with `componentRenderers`, each `xRenderer` function maps 1:1 to a slot component with the same props (minus `key`, which React manages):

  | `Table` `componentRenderers`                                                                              | DataTable `slots`                                                  |
  | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
  | `headRenderer` / `headRowRenderer` / `headCellRenderer` / `headCellGroupRenderer` / `headContentRenderer` | `head` / `headRow` / `headCell` / `headCellGroup` / `headContent`  |
  | `headFilterRowRenderer` / `headFilterCellRenderer` / `headFilterContentRenderer`                          | `filterRow` / `filterCell` / `filterContent`                       |
  | `bodyRenderer` / `bodyRowRenderer` / `bodyCellRenderer` / `bodyContentRenderer`                           | `body` / `row` / `cell` / `cellContent`                            |
  | `virtualizedBodyRenderer` / `infiniteScrollBodyRenderer`                                                  | `virtualizedBody` / `infiniteScrollBody`                           |
  | `placeHolderBodyRowRenderer` / `placeHolderBodyCellRenderer` / `placeHolderBodyContentRenderer`           | `placeholderRow` / `placeholderCell` / `placeholderContent`        |
  | `footRenderer` / `footRowRenderer` / `footCellRenderer` / `footContentRenderer`                           | `foot` / `footRow` / `footCell` / `footContent`                    |
  | `contextMenuRenderer` / `headContextMenuRenderer`                                                         | `contextMenu` / `headContextMenu`                                  |
  | `rowGroupHeaderRenderer`                                                                                  | `rowGroupHeader`                                                   |
  | `dndBodyRowRenderer` / `dragPreviewRenderer`                                                              | `dndRow` / `dragPreview`                                           |
  | `dragSourceRenderer` / `dropTargetRenderer`                                                               | no slot equivalent — DataTable composes its drag wiring internally |
  | `additionalContentRenderer`                                                                               | the `rowExpansion` prop (`{ render, predicate }`)                  |

  Slot components receive fully resolved props and the pre-built subtree as `children` (for container slots). They can use hooks — including `useDataTableContext` — and compose the exported self-wiring primitives (`DataTable.Head`, `DataTable.Row`, `DataTable.Cell`, …), which keep sorting, resizing, pinning, keyboard navigation and context menus intact. **Slot identities must be stable across renders** — declare slot components at module scope (or memoize them); an inline `slots={{ row: (p) => … }}` recreates the component type every render and remounts the subtree.

- **Column-level render hooks** — for per-column content, prefer `renderCell` / `renderHeader` / `renderFooter` / `renderFilter` on the column definition (`DataTableColumn`) over a global content slot that switches on `dataKey`. Providing `renderFooter`/`renderFilter` on any column activates the footer / header filter row.

**Suppression:** there are no `null` sentinels. To suppress a structural element, render nothing from its slot (a component returning `null`) or use the dedicated `hideHeader` prop.

### Sorting: controlled and column-id-keyed

The `sortOptions` prop keeps its name but **not its shape** — this is the most invasive API change when migrating:

- The production `Table` keeps a single `{ column, order }` pair keyed by the **column object** and fires `onSort({ column, order })`.
- `DataTable` sort state is a fully controlled **array** of `{ columnId, order }` in priority order (index 0 = primary sort, mirroring TanStack's `SortingState`), and `onSort(next, toggled)` hands you the fully-computed next state — assign it straight to your state — plus `toggled` (`{ columnId, order }`, with `order: undefined` once a column cycles back to unsorted).
- A column's stable id resolves as explicit `id` → `dataKey` → string `label`. A **sortable column that resolves no unique id throws** at mount — give such columns an explicit `id`.

```tsx
// Before — production Table
const [sortState, setSortState] = useState<SortState<MyColumn>>({});
<Table sortOptions={{ sortState, onSort: ({ column, order }) => setSortState({ column, order }) }} />;

// After — DataTable
const [sortState, setSortState] = useState<DataTableSortState>([]);
<DataTable sortOptions={{ sortState, onSort: (next) => setSortState(next) }} />;
```

### Root `ref`, `onBlur`, and the DOM / test-selector contract

- **`ref` targets a different element**: the production `Table` exposes its root `<div>`; `DataTable`'s `ref` is a **callback ref to the `<table>` element** (object refs are not supported). DOM-measuring or focus code keyed on the old root must be re-pointed (the scroll viewport, when `maxHeight` is set, is `table.parentElement`).
- **`onBlur`** correspondingly receives a `FocusEvent<HTMLTableElement>`.
- **The rendered DOM is a native `<table>`**, not the production `Table`'s three-segment row layout. Consumer tests and styles keyed on the legacy segment `data-role`s (`…-row-segment-left/-scroll/-right`, the row `Scroller`) will not match — `DataTable` renders one `<tr>` per row with roles like `Table.Header.Row`, `Table.Body.Row`, and a `Table.Viewport` scroll container. Audit any `data-role`-based selectors as part of the migration.

### Other differences worth knowing

- **Column `id`** (optional) — stable identity for sort state; required in practice for sortable columns whose `dataKey`/`label` can't serve as one.
- **`rowKey`** is optional on flat `DataTable` but omitting it keys rows by index — reordering data then remounts row DOM; supply one when rows move.
- **`enableColumnGroupA11y` has no `DataTable` counterpart** — obsolete by construction: the header renders a native `colSpan`/`rowSpan` grid.
- **`columnResizingOptions`** keeps its option names, but the `event`/`data` payloads are structural types (`ColumnResizeDragEvent` / `ColumnResizeDragData`) instead of react-draggable's — legacy handlers remain assignable.
- **`DataTableRowsGroup`** is the `TableRowsGroup` counterpart (same `RowsGroup` data shape) but supports **no virtual scroll, infinite scroll, or drag-and-drop**.

## DataTreeTable

`DataTreeTable` is a hierarchical wrapper over `DataTable` — the rough counterpart to `TreeTable`, but driven by the same headless model and consumer-owned row type (no `TreeNodeModel` envelope). Your own row type flows straight through: columns (`dataKey` / `dataGetter` / `renderCell`), `rowStyling`, `slots`, sorting, resizing and virtualization all operate on `RowType` directly. The wrapper flattens the hierarchy, owns expand/collapse, decorates one column with an indent + chevron, and applies `treegrid` ARIA. It is `@experimental` and **additive** — `TreeTable` is not deprecated.

Supply the hierarchy one of two ways, plus a required stable `rowKey`:

```tsx
// Nested tree
<DataTreeTable tree={rows} getChildren={(r) => r.children} rowKey="id" columns={columns} />

// Flat adjacency list
<DataTreeTable data={rows} getParentId={(r) => r.parentId} rowKey="id" columns={columns} />
```

- **Expansion** is controlled or uncontrolled: `defaultExpandedKeys` (uncontrolled) or `expandedKeys` + `onExpandedChange` (controlled).
- **Lazy loading**: `loadChildren(row) => Promise<RowType[]>` populates a node's children on first expand. Mutually exclusive with the controlled-pagination props (`getPagination` / `onLoadMore` / `onLoadAll`).
- **Scroll-to-node** by key: pass `scrollToNode` to receive a `(rowKey, { autoFocus? }) => void` handle (a node inside a collapsed ancestor is not rendered, so the call is a no-op).
- **Drag-and-drop reparenting** is opt-in via **`dragDropOptions`** — note the name differs from `TreeView`'s `dragDrop`. Positions are `before` / `after` / `inside`; the wrapper paints the drop indicator and guards against dropping a node into its own subtree. `onDrop({ source, target, position })` reports the resolved move and you mutate your own tree. A drop onto the **empty area below the last row** (the legacy `hideRoot` "drop onto the body") is its own opt-in: provide `onDropToRoot({ source })` (and optionally `canDropToRoot`) and move the row to the top level there. The same moves are available from the keyboard (Space picks the focused row up, arrows and Home/End move or re-parent it, Space/Enter drop, Escape cancels) with screen-reader announcements — the legacy `TreeTable` had no keyboard path:

```tsx
<DataTreeTable
	tree={rows}
	getChildren={(r) => r.children}
	rowKey="id"
	columns={columns}
	dragDropOptions={{
		onDrop: ({ source, target, position }) => moveNode(source, target, position),
		canDrop: ({ source, target, position }) => /* … */ true,
		autoExpand: true // expand a collapsed target on hover so you can drop into it
	}}
/>
```

`DataTreeTable` re-exposes the `DataTable` props it makes sense to (it `Omit`s the ones it owns: `data`, `columns`, `rowKey`, `dragDropOptions`, `scrollToNode`, `gridRole`, `rowExpansion`, `cardView`). For non-hierarchical needs, prefer `DataTable` directly.

### Mapping from `TreeTable`

| `TreeTable`                                                               | `DataTreeTable`                                                                                                                                                                                      |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root` (a `TreeNodeModel`) + `hideRoot`                                   | `tree` is an **array** of top-level rows + `getChildren` — with `hideRoot` pass `root.children`, without it pass `[root]`                                                                            |
| `BaseTreeTableNode` envelope (`id` / `icon` / `data` / `children`)        | your own row type flows through; node `id` → the required `rowKey`, node `icon` → the `getIcon(row)` prop                                                                                            |
| column `hierarchical` flag (which column indents)                         | `treeColumnKey`                                                                                                                                                                                      |
| expansion via `rowStyling().collapsed` + `onArrowClick`                   | `defaultExpandedKeys` (uncontrolled) or `expandedKeys` + `onExpandedChange` (controlled); lazy `loadChildren`                                                                                        |
| a node with `children: []` that must still show a chevron                 | leave the children `undefined` ("not loaded yet") with `loadChildren`, or let `getPagination(key).hasMore` report the outstanding page; `isLeaf(row)` pins a definite leaf — no placeholder children |
| DnD callbacks receiving `{ dragItem, dropResult }`                        | `dragDropOptions.onDrop({ source, target, position })`                                                                                                                                               |
| DnD positions `TOP` / `BOTTOM` / `AS_CHILD`                               | `before` / `after` / `inside`                                                                                                                                                                        |
| `hideRoot` drop onto the empty body (`{ row: root, position: AS_CHILD }`) | `dragDropOptions.onDropToRoot({ source })`, gated by `canDropToRoot` — only armed when provided                                                                                                      |
| DnD `onHover`                                                             | `onDragEnter`                                                                                                                                                                                        |
| `areRowsEqual`                                                            | no equivalent — row identity is the required `rowKey`                                                                                                                                                |

## TreeView

`TreeView` (also `@experimental`) is the modern replacement for the legacy `Tree` template and its behavior-HOC composition. Instead of stacking `Selectable(Collapsible(DragDrop(TreeAdapter(Tree))))` and mapping a `TreeNodeModel` through a template, `TreeView` is a single component driven by a headless model: pass your own row type and either a nested `tree` (+ `getChildren`) or a flat `data` list (+ `getParentId`), plus a required `rowKey`. Expansion and selection are controlled or uncontrolled, keyboard navigation follows the WAI-ARIA tree pattern, and drag-and-drop reparenting uses pragmatic-drag-and-drop (`before` / `after` / `inside`), from the pointer or from the keyboard (Space picks a node up, arrows and Home/End move or re-parent it, Space/Enter drop, Escape cancels, each step announced).

Unlike `Table` / `TreeTable`, the legacy `Tree` template **and its behavior HOCs are deprecated since 39.0.0** (still functional; will be removed in a future release):

| Deprecated                        | Replacement                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| `Tree` (template) + `TreeAdapter` | `<TreeView>` (no template-mapping step)                                     |
| `Collapsible`                     | built-in expansion (`defaultExpandedKeys` / `expandedKeys`, `loadChildren`) |
| `Selectable`                      | `selectionMode` + `selectedKeys` / `onSelectionChange`                      |
| `DragDrop`, `DnDTree`             | `dragDrop={{ onDrop, canDrop, canDrag }}`                                   |
| `Insertable`, `InsertableTree`    | compose with `getActions` / `dragDrop` (no direct equivalent yet)           |

```tsx
// Before — behavior-HOC composition
const TreeComponent = Selectable(Collapsible(TreeAdapter(Tree)));
<TreeComponent root={rootNode} tplTreeNode={mapNode} onToggleSelection={handleSelect} />;

// After — one headless component
import { TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

<TreeView
	tree={nodes}
	getChildren={(n) => n.children}
	rowKey="id"
	getLabel={(n) => n.label}
	selectionMode="single"
	selectedKeys={selected}
	onSelectionChange={setSelected}
	defaultExpandedKeys={["root"]}
/>;
```

Note `TreeView` uses `dragDrop`, whereas `DataTreeTable` uses `dragDropOptions` — the option shapes are otherwise analogous. The low-level template primitives (`TreeContainer`, `TreeNode`, `ArrowButton`) are **not** deprecated — they remain the shared building blocks used by `TreeTable` and `DataTreeTable`.
