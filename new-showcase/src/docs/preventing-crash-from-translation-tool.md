This page explains what browser translation is, the problem it causes with React, what Widgets does about it, what to expect and where the limits are — so your project can decide how far to rely on it.

### What is browser translation?

Most modern browsers can translate a whole web page into another language for the user, without the site doing anything. The best-known example is **Google Translate**, built into **Chrome** as the "Translate this page" option; **Edge**, **Firefox** and **Safari** offer similar features.

The user picks a target language and the browser rewrites the visible text in place — the page's address stays the same, but the words change. It is a convenience feature that works especially well for static content (articles, blogs, documents), but can be more problematic for interactive applications.

### The problem

A user opens your app in **Chrome or Edge** (or another Chromium-based browser) and turns on the built-in "Translate this page" feature. Then one of two things happens:

- **The app crashes.** A screen goes blank or an error boundary is triggered, often with an error in the console like:

  > `NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.`

- **Text stops updating.** The page keeps working, but values that should change — a counter, a status, a live message — get stuck showing their old (translated) text and never update again.

### Why it happens

When translation is turned on, the tool reads the text on the page, translates it and swaps the original words for the translated ones. To do this it may **move or replace the original text and insert its own elements** — Google Translate, for example, has used `<font>` tags around translated content.

React assumes the page looks exactly the way it drew it. Once the translation tool has quietly rearranged the text, React gets confused the next time it tries to update or remove it:

- It tries to remove text that the translation tool already took away → **crash**.
- It thinks it is updating the original text, but the user is looking at the translation tool's copy → **frozen text**.

This is a well-known, long-standing problem between React and browser translation — not something specific to Widgets. It is tracked on both sides:

- [Chromium issue #41407169](https://issues.chromium.org/issues/41407169) — the Chrome/Google Translate side of the bug.
- [React issue #11538](https://github.com/facebook/react/issues/11538) — the React side.
- [Everything about Google Translate crashing React](https://martijnhols.nl/blog/everything-about-google-translate-crashing-react) — a detailed write-up of the causes and the trade-offs of each workaround.

### What Widgets does about it

Widgets does two things to make translation safer:

1. **Stops the known crashes.** When you wrap your app in `WidgetsRoot`, Widgets installs a small safety net (a "monkey patch" over the browser's own `removeChild` and `insertBefore` methods). If React performs a DOM operation that is no longer valid because the translation tool has changed the DOM, Widgets prevents it from throwing instead of letting the app crash.

2. **Protects the icons.** Icons are drawn using special characters (for example Material Symbols). If a translation tool "translated" those characters, the icons would turn into random words. Widgets marks all icons as _do-not-translate_ so they always render correctly.

### What to expect

- **The known React DOM crashes are avoided.** With `WidgetsRoot` in place, the `removeChild` and `insertBefore` crashes caused by browser translation are prevented.
- **Static text gets translated** and stays readable.
- **Icons stay as icons** — they are never translated.

### Known limitations

The crash guard is a **damage-control measure, not a full fix.** It trades a hard crash for softer, quieter problems. Be aware of these:

- **Dynamic content may not update correctly.** After translation, values that change on the page — counters, live statuses, notifications, … can get stuck showing old text, or content React added or removed may not reflect on screen. This is a display glitch, not a crash.
- **The safety net is global and lasts the whole session.** It switches on the first time `WidgetsRoot` loads and stays on until the page is reloaded. It cannot be turned off or scoped to part of the page.

There is **no known way** to make browser translation work flawlessly with a React app. If translation quality is critical for your users, the most reliable option is still **built-in localization** rather than relying on the browser to translate for you.

### Recommendations for your project

- **Use a single `WidgetsRoot`** and mount it as early as possible, so the safety net is active before the user starts translating.
- **Test your important screens with Google Translate turned on** (in Chrome or Edge). Pay special attention to content that changes without reloading the page — counters, live status badges, notification counts, search-as-you-type results — since that is where the "frozen text" glitch shows up.
- **Mark anything that must never be translated** — code snippets, IDs, product names — with `translate="no"` and `class="notranslate"`:

  ```html
  <span translate="no" class="notranslate">Order Number</span>
  <span translate="no" class="notranslate">product-name</span>
  ```

- **For business-critical multilingual apps, prefer real localization** over browser translation.
