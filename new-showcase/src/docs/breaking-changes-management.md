This page provides Widgets-specific aspects of the breaking change definition.

The following definition of breaking changes only applies to **specified functionality** of **libraries** that we provide.

Furthermore, any change is only guaranteed to be non-breaking if all artifacts of a product are used in exactly the same version.

## Definition of Version

The Widgets product consists of the following npm artifacts:

- `@com.mgmtp.a12.widgets/widgets-core` — The main component library containing all widgets, their properties, interfaces, hooks, utilities, and theme system
- `@com.mgmtp.a12.widgets/widgets-json-api` — JSON files generated from TypeScript typings of the core
- `@com.mgmtp.a12.widgets/widgets-utils` — Utility components for showcase purposes
- `@com.mgmtp.a12.widgets/widgets-showcase-redesign` — The showcase application demonstrating widgets usage, examples, and documentation

## Definition of Library

The Widgets library (e.g. the `widgets-core` package) consists of:

- The **`lib/`** folder which contains compiled JavaScript artifacts together with TypeScript definitions
- The **`src/`** folder which contains TypeScript source, useful for source maps

**Note:** The following breaking change management is only applied to the **`widgets-core`** package.

**Excluded:** Modules in the `experimental/` folder are **not** subject to breaking change management.

## Widgets-Specific Interpretation

### Public API

| Breaking ❌                                                     | Non-breaking ✅                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Incompatible change of API signatures that cause compile errors | Adding a new widget                                                             |
| Removal or rename of a widget's properties                      | Adding new optional properties to a widget                                      |
| Adding required properties to a widget                          | All changes in the `experimental/` folder (even if public and documented)       |
| Rename of a widget component                                    | Compatible change of API signatures                                             |
| Extraction or move of public helper functions                   | Correction of functionality that does not fulfill the specification (bug fixes) |
| Removal or rename of a theming variable                         |                                                                                 |

### Internal

| Breaking ❌ | Non-breaking ✅                                                              |
| ----------- | ---------------------------------------------------------------------------- |
| —           | Everything not covered by the Public API points above is considered internal |
|             | HTML markup inside a widget is considered internal                           |
|             | CSS classes are legacy and considered internal                               |
|             | All internal aspects are always considered non-breaking                      |

### Dependencies

| Breaking ❌                           | Non-breaking ✅                                          |
| ------------------------------------- | -------------------------------------------------------- |
| Change of TypeScript version          | Update of 3rd-party dev dependencies                     |
| Change of React version               | Update of 3rd-party libraries used internally by Widgets |
| Change of any peer dependency (range) |                                                          |

### Data-role for Automated Testing

| Breaking ❌                                  | Non-breaking ✅                                                                                                                         |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Removal or rename of a `data-role` attribute | Adding a `data-role` (or alternative attributes for automated testing)                                                                  |
|                                              | Changing the relative location of `data-role` to interactive elements (the relative location is internal, just like the HTML structure) |

## Considerations about HTML and CSS Being Internal

Some customer projects have raised concerns about HTML and CSS structures being treated as _internal_.

Since we want to limit the amount of breaking changes and manage necessary changes properly, evolving Widgets at a healthy pace would become significantly slower and require considerably more effort if HTML and CSS were treated as public API.

Therefore, we are committed to keeping HTML and CSS internal. The following sections clarify how we acknowledge the needs of customer projects within this agreement.

### Re-Automated Testing

#### data-role (and other attributes such as title, label, aria-label)

---

`data-role` is the specific attribute that allows addressing particular elements directly inside a specific widget instance. A widget instance can be identified by specifying its `id` attribute. **IDs and `data-role` are considered public API.**

- IDs and specific attributes are primarily supported by widgets that provide methods to set the ID and guarantee that the appearance of the ID in the HTML markup is stable.
- Engines use this widget API and set IDs or attributes that are usually bound to their model — they keep these stable as well.

### Re-Styling

#### Theming

---

Widgets defines and implements a theming concept based on a structure of variables (see [Theming](#/basics/theme/theming)).

The theme defines a set of fundamental default and semantic aspects in variables — e.g. base font, color palette, or styling for selection, focus, hover, and destructive states.

**These variables are public API.** Changing their values allows you to adjust certain aspects of the appearance consistently and easily.

If you find a feature missing — let's [get in touch](mailto:a12-widgets-team@mgm-tp.com).

#### Customizing CSS

---

Adding custom CSS on top is technically possible and may be required in some cases — for example, as a temporary solution until A12 has improved theming capabilities.

Since breaking change management does **not** apply to HTML and CSS, there is a risk that an A12 upgrade breaks your custom styling. Therefore, if you do this, please keep track of such cases so that you can perform focused regression tests after each upgrade.

See [Use and Configure Widgets Style](#/get-started/use-and-configure-widgets-style), section **Global style override (NOT RECOMMENDED)**.

#### Customizing Markup

---

Various widgets provide extension points to inject custom render code — for example, the Table widget allows hooking in custom code to render the header.

**These extension points are public API** and are provided precisely to enable reliable customization. The responsibility for the extension is of course on customer project side.

### Custom Widgets

A12 Widgets are React components — you can combine A12 widgets with your own widgets or with 3rd-party React components.

In many cases you may create higher-level custom widgets from lower-level A12 widgets. This is an intended and supported approach. If you run into problems — for example, styling side-effects within A12 widgets due to particular combinations — please let us know.

#### Theming for Custom Markup and Custom Widgets

---

To align the styling of custom extensions or your own widgets with the A12 theme, you can hook into the theming concept. For example, if your custom widget has a notion of "selection", you can use the selection colour variable defined semantically in the theme.

**Since theming variables are public API, this is a valid approach.** Doing so makes your project's theme easier to evolve and makes your custom widget a stronger candidate to eventually become an official A12 widget.
