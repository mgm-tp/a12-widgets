Since version 34.0.0, Widgets has switched to [styled-components](https://styled-components.com/) as our styling solution (replacing Stylus). Some benefits that styled-components bring are:

### Instant theme switching

Since styling code is now bundled with React code, there is no longer a need to download a separate CSS file for each theme. Themes are just JavaScript variables and switching themes simply means changing the value of these variables. Because of this, switching themes can now be done instantaneously.

### No class name conflicts

CSS classes are hashed based on the content of the CSS code. You no longer need to worry about the class names of your components clashing.

### Existing class names still remain for easier migration

Old class names are kept to help make migrations easier. Old CSS/Stylus code that targets specific CSS classes will still work, though going forward this approach is no longer recommended.

### Easier dead code detection

Styling code that doesn't belong to a component can be detected much easier now.

### Better developer experience

Suggestions in IDE are now component bound, which helps you realize what is possible with a component much easier. It's also easier to onboard people since significantly more engineers are familiar with styled-components than with Stylus.

### Theme nesting

It's now possible to have multiple themes on the same page, or even nested themes. This can be seen in some of our examples, e.g. [List](#/widgets/data-display/list#combination) or [Tree](#/examples/styling-in-tree). Our showcase is also built with this technique. You can switch the theme but that's only for the example box. Our showcase theme is made differently.

### Override Styles

When you need to override Widgets styles, we recommend following these approaches **in order of preference**:

1. **Theme variables:** Use theme configuration to customize styles when possible. This ensures consistency and leverages the theming system.

2. **Data-role selectors:** Use `[data-role="..."]` attribute selectors for specific overrides when theme variables aren't available. It is specifically designed for targeting elements for styling and testing purposes, providing a stable API that won't change when internal styled-component implementations are updated.

   ```tsx
   const StyledWrapper = styled.div`
   	[data-role="application-frame-content"] {
   		background-color: green;
   	}
   `;
   ```

3. **CSS custom properties:** Define custom properties that can be overridden for more flexible styling. Please check out [Using custom props](https://styled-components.com/docs/api#using-custom-props).

4. **Direct styled selectors:** Selectors like `${StyledComponent.StyledChild}` should be **avoided** as they can break when the library updates its internal structure. These selectors are fragile because:
   - They depend on internal component implementation details that may change.
   - They may stop working after library updates without warning.

   ```tsx
   // Avoid - Direct styled component targeting
   import { StyledApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core";

   const BadExample = styled(MyComponent)`
   	${StyledApplicationFrame.StyledContent} {
   		background-color: red;
   	}
   `;
   ```

## What do I need to do now?

We've written [migration instructions](#/get-started/migration-instructions/migration-to-styled-components) to help you migrate your existing codebase to the new styling approach.

## Need help?

Migrating to a new styling solution has the potential for complexities, so in case you have comments/questions during your migration, we'd love to hear from you. You can reach out by sending an email to the [a12-widgets-team](mailto:a12-widgets-team@mgm-tp.com).
