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

## DataTable

`DataTable` renders a native `<table>` driven by a headless model, with components-as-`slots` customization and per-column render hooks. The subsections below cover where it differs from the production `Table`.

### Action columns are no longer auto-sized to their content

The production `Table` measured action cells in JS (`synchronizeActionCellsWidth`) and sized each action column to fit its buttons in every layout, including under virtualization. `DataTable` uses a native `<table>` and does **no** such measurement.

Under the default `table-layout: fixed` — and always under virtualization — a width-less `actionColumn` now falls back to a fixed `150px` track. This may waste space when a column has a single button, or truncate (`overflow: hidden`) when it has several.

**When adopting `DataTable`**, only tables that relied on the implicit auto-sizing need a change: give the action column an explicit width (works in every mode, incl. virtualized):

```tsx
{ label: "", actionColumn: true, pinning: "right", width: 0.7, fixedWidth: true }
```

### Virtual scrolling: new engine, dynamic row heights, `listRef` replacement

`DataTable` virtualizes with `@tanstack/react-virtual` instead of `react-virtualized`. The engine is internal — `virtualScrollOptions` no longer accepts the `Partial<ListProps>` pass-through.

**Row heights** keep the production `Table`'s semantics:

- `virtualScrollOptions: { rowHeight: 40 }` — fixed height, no measurement (fast path).
- `virtualScrollOptions: {}` or `virtualScrollOptions: true` — **dynamic row heights**: each rendered row is measured from the DOM and re-measured on content-driven resize (the old `CellMeasurer` behaviour, without the `deferredMeasurementCache` plumbing). `estimatedRowHeight` (default `50`, matching `CellMeasurerCache`'s `defaultHeight`) sizes rows that haven't been measured yet — set it close to your median row height to minimize scrollbar jitter.

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
  | `additionalContentRenderer` + `additionalContentPredicate`                                                | the `rowExpansion` prop (`{ render, predicate }`)                  |

  Slot components receive fully resolved props and the pre-built subtree as `children` (for container slots). They can use hooks — including `useDataTableContext` — and compose the exported self-wiring primitives (`DataTable.Head`, `DataTable.Row`, `DataTable.Cell`, …), which keep sorting, resizing, pinning, keyboard navigation and context menus intact. **Slot identities must be stable across renders** — declare slot components at module scope (or memoize them); an inline `slots={{ row: (p) => … }}` recreates the component type every render and remounts the subtree.

- **Column-level render hooks** — for per-column content, prefer `renderCell` / `renderHeader` / `renderFooter` / `renderFilter` on the column definition (`DataTableColumn`) over a global content slot that switches on `dataKey`. Providing `renderFooter`/`renderFilter` on any column activates the footer / header filter row.

**Suppression:** there are no `null` sentinels. To suppress a structural element, render nothing from its slot (a component returning `null`) or use the dedicated `hideHeader` prop.

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
- **Drag-and-drop reparenting** is opt-in via **`dragDropOptions`** — note the name differs from `TreeView`'s `dragDrop`. Positions are `before` / `after` / `inside`; the wrapper paints the drop indicator and guards against dropping a node into its own subtree. `onDrop({ source, target, position })` reports the resolved move and you mutate your own tree:

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

`DataTreeTable` re-exposes the `DataTable` props it makes sense to (it `Omit`s the ones it owns: `data`, `columns`, `rowKey`, `dragDropOptions`, `scrollToNode`, `gridRole`, `rowExpansion`). For non-hierarchical needs, prefer `DataTable` directly.

## TreeView

`TreeView` (also `@experimental`) is the modern replacement for the legacy `Tree` template and its behavior-HOC composition. Instead of stacking `Selectable(Collapsible(DragDrop(TreeAdapter(Tree))))` and mapping a `TreeNodeModel` through a template, `TreeView` is a single component driven by a headless model: pass your own row type and either a nested `tree` (+ `getChildren`) or a flat `data` list (+ `getParentId`), plus a required `rowKey`. Expansion and selection are controlled or uncontrolled, keyboard navigation follows the WAI-ARIA tree pattern, and drag-and-drop reparenting uses pragmatic-drag-and-drop (`before` / `after` / `inside`).

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
import { TreeView } from "@com.mgmtp.a12.widgets/widgets-core";

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
