# oxlint-plugin

Local [oxlint JS plugin](https://oxc.rs/docs/guide/usage/linter/js-plugins.html), wired up through
`jsPlugins` in `.oxlintrc.json`. Rule ids are prefixed with the plugin name, e.g.
`widgets/no-hooks-in-styled-callback`.

## `widgets/no-hooks-in-styled-callback`

Forbids React hook calls inside styled-components style callbacks and style template
interpolations. styled-components invokes those from the styled component's render, but not
necessarily on every render, so a hook there makes the hook count differ between renders: React
logs "change in the order of Hooks" and eventually crashes with "Rendered fewer hooks than
expected" (A12W-11532). `react/rules-of-hooks` does not detect the pattern
(styled-components#3478).

Fix by reading the value in the _rendering component_ and forwarding it as a transient prop:

```ts
// bad
const Styled = styled.div(({ theme }) => {
	const { embedded } = useContext(ContentBoxContext);
	...
});

// good
const Styled = styled.div<{ $embedded?: boolean }>(({ theme, $embedded }) => { ... });
```

### Reported shapes

- call form: `styled.div(fn)`, `styled(X)(fn)`, `styled.div.withConfig({...})(fn)`, `styled.div.attrs(fn)`
- tagged-template form, for every function interpolation: ``styled.div`color: ${fn}` `` and the same through
  `styled(X)` / `.withConfig(...)`
- style helpers with function interpolations: ``css`...` ``, ``keyframes`...` ``, ``createGlobalStyle`...` ``

### Known gaps

- A hook called from a helper function _declared_ inside the callback is not reported — the rule
  stops at nested function scopes, since it cannot tell statically whether the helper runs during
  style generation.
- A style callback assigned to a variable first and passed by reference
  (`const styles = () => { useX(); }; styled.div(styles)`) is not reported.
