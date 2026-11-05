## Installation

### Setup environment and tools

#### Install Node.js and npm

In this tutorial we will use **Node.js 24.x** and **npm 11.x**, you can download Node.js (npm is included in Node.js
installer) at: [Node.js.org](https://nodejs.org/en)

To check your Node.js and npm version:

```shell
node -v
# v24.x
npm -v
# 11.x
```

You can also use [nvm](https://github.com/nvm-sh/nvm) to install Node.js.

```shell
nvm install 24
```

#### Install IDE

There are several IDEs you can use to work with React/TypeScript. In this tutorial we will
use [Visual Studio Code](https://code.visualstudio.com/download) (VS Code) because it's a great free code editor.

## Hello world project with Widgets

### Create a React and TypeScript project

We will use [Vite](https://vite.dev/guide/#scaffolding-your-first-vite-project) to create a sample project which is
already configured with React and TypeScript and ready to run.

Open your terminal and cd to anywhere you want to save the project directory then run this command to create a new
project named "hello-widgets":

```shell
npm create vite@latest hello-widgets -- --template react-ts
```

A new directory will be created which has the same name as the new project, which in this case is **hello-widgets**
directory.

At this point, your project layout should look like the following:

```
hello-widgets/
├─ public/
├─ src/ -> contains our TypeScript and CSS code
│  ├─ App.tsx -> the root component
│  ├─ main.tsx -> mounts the App component into the page
│  └─ ...
├─ index.html
├─ package.json -> contains our dependencies...
├─ tsconfig.json -> TypeScript project references
├─ tsconfig.app.json -> TypeScript options for the application code
└─ vite.config.ts
```

Install the dependencies and start the dev server:

```shell
cd hello-widgets
npm install
npm run dev
```

Open _http://localhost:5173_ in your browser and you'll see the Vite + React starter page.

### Install Widgets and required dependencies

Run this command to install the Widgets package to your project:

```shell
npm install @com.mgmtp.a12.widgets/widgets-core
```

Widgets styling is built with [styled-components](https://styled-components.com/), so it is needed as well.
styled-components 6 ships its own TypeScript types, no `@types/styled-components` package is required.

```shell
npm install styled-components
```

You can see these packages in the **package.json** file now:

```json
{
	"dependencies": {
		"@com.mgmtp.a12.widgets/widgets-core": "^39.0.0",
		"react": "^19.x.x",
		"react-dom": "^19.x.x",
		"styled-components": "^6.x.x"
	}
}
```

**Note:** Widgets declares `react`, `react-dom`, `styled-components` and `react-dnd` as peer dependencies. npm 7 and
newer installs missing peer dependencies automatically, so nothing else needs to be added by hand.

### Browser support

Widgets supports the last two versions of Chrome, Edge, Firefox (plus Firefox ESR), Safari, iOS Safari and Chrome for
Android. No polyfills are required for these browsers.

### Set up the application root

Widgets components need three things at the root of your React tree:

1. A styled-components `ThemeProvider` with one of the Widgets themes, e.g. `flatTheme`. Every component reads its
   colors, spacing and typography from this theme.
2. `GlobalStyles`, which applies the base styles of the theme to the page.
3. `WidgetsRoot`, which provides a mount point for overlays such as flyouts, dialogs and tooltips.

Widgets also ships its fonts as a separate CSS entry point. Import it once at your application root, this registers
the text and icon fonts, so your text displays in the correct font family and icons display correctly.

Finally, wrap everything in a `StyleSheetManager` with the `shouldForwardProp` function exported by Widgets. Without
it styled-components 6 forwards every prop to the DOM and React logs "unknown prop" errors in the console.

Replace the content of **src/main.tsx** with the following:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyleSheetManager, ThemeProvider } from "styled-components";

import { flatTheme, GlobalStyles, shouldForwardProp, WidgetsRoot } from "@com.mgmtp.a12.widgets/widgets-core";
import "@com.mgmtp.a12.widgets/widgets-core/styles/basic.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<StyleSheetManager shouldForwardProp={shouldForwardProp}>
			<ThemeProvider theme={flatTheme}>
				<GlobalStyles />
				<WidgetsRoot>
					<App />
				</WidgetsRoot>
			</ThemeProvider>
		</StyleSheetManager>
	</StrictMode>
);
```

The Vite starter also ships its own stylesheets, **src/index.css** and **src/App.css**. They restrict the width of the
page and center all text, which gets in the way of the Widgets layout. Delete both files; the `import "./index.css"`
line was already dropped from **main.tsx** above, and **App.tsx** is rewritten in the next step.

**Note:** If you skip the `ThemeProvider`, the project still compiles but the page stays blank and the browser console
shows an error like `Cannot destructure property 'button' of 'theme.components' as it is undefined`. Widgets requires a
theme to run.

### Use Widgets components

Import the components you need:

```tsx
import { Button, ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core";
```

Here is an example about how to use the Widgets button component instead of the normal button tag. Replace the content
of **src/App.tsx** with this:

```tsx
import { Button } from "@com.mgmtp.a12.widgets/widgets-core";

export default function App() {
	return <Button label="This is a button from widgets" primary={true} />;
}
```

Two things to note about the code style used in this tutorial:

- The Vite template uses the modern JSX transform, so there is no `import React from "react"` at the top of the files.
  With `noUnusedLocals` enabled in the template's **tsconfig.app.json**, an unused `React` import is a compile error.
- The template enables `verbatimModuleSyntax`. Types such as `MenuItem` must therefore be imported with
  `import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core"`. A plain `import { MenuItem }` fails both the
  type check and the Vite build, because `MenuItem` does not exist at runtime.

There are many components from simple to complex such as button, icon, textline to tree, table, editor... You can see
more [here](#/widgets).

## Sample application uses Application Frame

Application Frame Widget uses the A12 plasma-design and makes its html and css class-structures transparent to the user,
so the user does not have to deal with it. This layout should be responsive and is mainly focusing on the desktop,
tablet and smartphone devices.

### Application Frame with dummy texts

In the example below, we will use the `ApplicationFrame` widget to show a simple web application with three areas: header
(top), sidebar (left) and content (center). Since the theme and global styles already live in **main.tsx**, **App.tsx**
only needs to render the frame.

```tsx
import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core";

export default function App() {
	return <ApplicationFrame main={<div>Header</div>} sub={<div>SideBar</div>} content={<div>MainContent</div>} />;
}
```

As you can see, there are three dummy texts which help you determine where it is. In our next example, we will use real
components instead of some dummy texts. Now we will create each component for each area and then reuse it in the
main `App` component step by step.

### Implement a header

Let's create a header containing a title and a main menu. Create a new file named **Header.tsx** with the content
below.

```
hello-widgets/
...
├─ src/
│  ├─ App.tsx
│  └─ Header.tsx
...
```

```tsx
import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { ApplicationHeader, FlyoutMenu } from "@com.mgmtp.a12.widgets/widgets-core";

export interface HeaderProps {
	items: MenuItem[];
}

export function Header(props: HeaderProps) {
	return (
		<div>
			<ApplicationHeader leftSlots="Hello Widgets" />
			<FlyoutMenu type="horizontal" items={props.items} />
		</div>
	);
}
```

1. `ApplicationHeader`: useful for displaying information like application logo, application name, version or user
   information on top of the page.
2. `FlyoutMenu`: vertical/horizontal menu which will show sub-menu items when the mouse's hovering.

In this example, we already created a new component named `Header` whose _input_ (props) is a list of menu items which
will be shown in the menu. You can read more about these
things [here](https://react.dev/learn/passing-props-to-a-component). Basically, a component is just a small piece of UI
which is simple and also reusable.

### Implement a sidebar

A sidebar is just a vertical flyout menu. Create a new file named **Sidebar.tsx** and copy&paste the content below.

```
hello-widgets/
...
├─ src/
│  ├─ App.tsx
│  ├─ Header.tsx
│  └─ Sidebar.tsx
...
```

```tsx
import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { FlyoutMenu } from "@com.mgmtp.a12.widgets/widgets-core";

export interface SidebarProps {
	items: MenuItem[];
}

export function Sidebar(props: SidebarProps) {
	return <FlyoutMenu type="vertical" items={props.items} />;
}
```

### Implement a content area

The content area will be a content box which uses the `ActionContentbox` component. Create a new file named
**Content.tsx** and copy&paste the content below.

```
hello-widgets/
...
├─ src/
│  ├─ App.tsx
│  ├─ Header.tsx
│  ├─ Sidebar.tsx
│  └─ Content.tsx
...
```

```tsx
import { ActionContentbox, ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core";

export interface ContentProps {
	title: string;
	text: string;
}

export function Content(props: ContentProps) {
	return (
		<ActionContentbox headingElements={<ContentBoxElements.Title text={props.title} />}>{props.text}</ActionContentbox>
	);
}
```

The content box widget is used to structure content as well as actions in a consistent way. It also has responsive
behavior on mobile devices.

### Use header, sidebar, and content

Just replace the dummy texts in **App.tsx** with our new components, then you can see our UI looks beautiful now.

```tsx
import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core";

// import our components
import { Content } from "./Content";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const items: MenuItem[] = [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }];

export default function App() {
	return (
		<ApplicationFrame
			main={<Header items={items} />}
			sub={<Sidebar items={items} />}
			content={<Content title="Title here" text="Content text here" />}
		/>
	);
}
```

In the next step we will handle events to change the UI, e.g. click on a menu item to change the content which is shown
in the center. Modify the **App.tsx** file like below:

```tsx
import { useState } from "react";

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core";

// import our components
import { Content } from "./Content";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const menuItems = [{ label: "Quote" }, { label: "About us" }];

const sidebarItems = [
	{ name: "Quote 1", quote: "Life is short, smile while you still have teeth." },
	{ name: "Quote 2", quote: "If two wrongs don't make a right, try three." },
	{ name: "Quote 3", quote: "I am not lazy, I am on energy saving mode." }
];

export default function App() {
	const [menuIndex, setMenuIndex] = useState(0);
	const [sidebarIndex, setSidebarIndex] = useState(0);

	const headerItems: MenuItem[] = menuItems.map((item, index) => ({
		...item,
		selected: menuIndex === index,
		onClick: () => setMenuIndex(index)
	}));

	const sidebarMenuItems: MenuItem[] = sidebarItems.map((item, index) => ({
		label: item.name,
		selected: sidebarIndex === index,
		onClick: () => setSidebarIndex(index)
	}));

	const selectedSidebarItem = sidebarItems[sidebarIndex];
	const showSidebar = menuIndex === 0;

	return (
		<ApplicationFrame
			main={<Header items={headerItems} />}
			sub={showSidebar ? <Sidebar items={sidebarMenuItems} /> : undefined}
			content={
				<Content
					title={showSidebar ? selectedSidebarItem.name : "About"}
					text={showSidebar ? selectedSidebarItem.quote : "About page without sidebar"}
				/>
			}
			subExpanded={true}
		/>
	);
}
```

Now the content of the center area will change if we click on a menu item or sidebar item. You will see something
like this:

![Sample application](images/sample-application-preview.png)

That's it for the start. Happy coding!
