# `@com.mgmtp.a12.widgets/widgets-utils`

> **Deprecated since 39.1.0.** This package will be removed in a future major version.

The components in this package were written to build the A12 Widgets showcase, not as product widgets. They are outside
the breaking change management that applies to `@com.mgmtp.a12.widgets/widgets-core`, and they have no theme
configuration, tests or documentation of their own.

Nothing stops working in 39.x: every export is still there and still behaves as before, but each one now carries a
`@deprecated` note naming what to use instead.

| Export                                               | What to use instead                                                                                        |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `AnimationWrapper`                                   | Render the child conditionally, or drive the transition with an animation library such as Motion.          |
| `CodeExample`, `SourceCodeSection`, `LICENSE_HEADER` | Use `react-syntax-highlighter` (or any other highlighter) directly. `widgets-core` has no code viewer.     |
| `NewsBox`                                            | Compose the same layout from `LayoutGrid`, `CssEllipsis` and `ResponsiveImageContainer` in `widgets-core`. |

Where no replacement fits, copy the source into your own project — it ships in this package's `src` folder under the
same dual license as the rest of A12 Widgets.

See _Get Started > Migration Instructions > Migration Notes_ in the A12 Widgets documentation for details.
