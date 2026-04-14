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

You can also use [nvm](https://github.com/creationix/nvm) to install Node.js.

```shell
nvm install 24
```

#### Install IDE

There are several IDEs you can use to work with React/TypeScript. In this tutorial we will
use [Visual Studio Code](https://code.visualstudio.com/download) (VS Code) because it's a great free code editor.

## Hello world project with Widgets

### Create a React and TypeScript project

We will use [Vite](https://vite.dev/guide/#scaffolding-your-first-vite-project) to create a sample project which is already configured
with React and TypeScript and ready to run.

Open your terminal and cd to anywhere you want to save the project directory then run this command to create a new project named "hello-widgets":

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
│  └─ ...
├─ package.json -> contains our dependencies...
└─ tsconfig.json -> contains TypeScript-specific options for your project
```

To run this project:

```shell
cd hello-widgets
npm run dev
```

After that, your browser will open a new tab and you'll see a **Welcome to React** page., you can also do it manually by
opening this address _http://localhost:5173_

### Install Widgets and required dependencies

Follow these commands to install the Widgets package to your project.

```shell
npm install @com.mgmtp.a12.widgets/widgets-core
```

Widgets styling is built with styled-components, so they are needed as well:

```shell
npm install styled-components @types/styled-components
```

You can see these packages already in the **package.json** file:

```json
{
	"dependencies": {
		"@com.mgmtp.a12.widgets/widgets-core": "^38.0.0",
		"react": "^19.x.x",
		"react-dom": "^19.x.x",
		"styled-components": "^6.x.x"
	}
}
```

### Polyfills

Some of our Widgets' code and dependencies make use of ES2015 language features. We expect your browser supports these
APIs natively or with the assistance of a polyfill.

### Use Widgets components

Import directly to the components you need:

```tsx
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/button-group";
```

There is an example about how to use Widgets button component instead of the normal button tag, modify the **App.tsx**
like this:

```typescript jsx
import React from "react";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";

export default function App() {
    return <Button label="This is a button from widgets" primary={true} />;
}

```

Wait a moment then you will see some compilation errors being thrown. This is because Widgets requires a theme to run. To fix
this, adapt the code and add a ThemeProvider, as well as GlobalStyles provided from Widgets:

```typescript jsx
import React from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";

import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";

export function App() {
  return (
    <ThemeProvider theme={flatTheme}>
        <GlobalStyles />
        <Button label="This is a button from widgets" primary={true} />
    </ThemeProvider>
  );
}

```

There are many components from simple to complex such as button, icon, textline to tree, table, editor... You can see
more [here](/#/widgets).

## Sample application uses Application Frame

Application Frame Widget uses the A12 plasma-design and makes its html and css class-structures transparent to the user,
so the user does not have to deal with it. This layout should be responsive and is mainly focusing on the desktop,
tablet and smartphone devices.

### Application Frame with dummy texts

In example below, we will use `ApplicationFrame` widget to show a simple web application with three areas are header (
top), sidebar (left) and content (center).

```typescript jsx
import React from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";

import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/application-frame";

export default function App() {
  return (
  <ThemeProvider theme={flatTheme}>
    <GlobalStyles />
    <ApplicationFrame
    main={<div>Header</div>}
    sub={<div>SideBar</div>}
    content={<div>MainContent</div>}
    />
  </ThemeProvider>
  );
}


```

As you can see, there are three dummy texts which help you determine where it is. In our next example, we will use real
components instead of some dummy texts. Now we will create each component for each area and then reuse it in the
main `App` component step by step.

### Implement a header

Let's create a header containing a title and a main menu. Create a new file name **Header.tsx** with below content.

```
hello-widgets/
...
├─ src/
│  ├─ App.tsx
│  └─ Header.tsx
...
```

```typescript jsx
import React from "react";
import { ApplicationHeader } from "@com.mgmtp.a12.widgets/widgets-core/lib/application-header";
import { FlyoutMenu, MenuItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";

export interface HeaderProps {
  items: MenuItem[];
}

export function Header(props: HeaderProps): React.ReactElement<HeaderProps> {
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

In this example, we already create new component name `Header` with the _input_ (props) is a list of menu items which
will be shown in the menu. You can read more about these
things [here](https://reactjs.org/docs/components-and-props.html). Basically, a component is just a small piece of UI
which is simple and also reusable.

### Implement a sidebar

A sidebar just a vertical flyout menu. Create a new file name **Sidebar.tsx** and copy&paste below content.

```
hello-widgets/
...
├─ src/
│  ├─ App.tsx
│  ├─ Header.tsx
│  └─ Sidebar.tsx
...
```

```typescript jsx
import React from "react";
import { FlyoutMenu, MenuItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";

export interface SidebarProps {
  items: MenuItem[];
}

export function Sidebar(props: SidebarProps): React.ReactElement<SidebarProps> {
  return <FlyoutMenu type="vertical" items={props.items} />;
}

```

### Implement a content area

Content area will be a content box which uses `ActionContentbox` component. Create a new file name **Content.tsx** and
copy&paste below content.

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

```typescript jsx
import React from "react";
import { ActionContentbox, ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox";

export interface ContentProps {
  title: string;
  text: string;
}

export function Content(props: ContentProps): React.ReactElement<ContentProps> {
  return (
	<ActionContentbox
	  headingElements={<ContentBoxElements.Title text={props.title} />}
	>
	  {props.text}
	</ActionContentbox>
  );
}

```

Content box widget is used to structure content as well as actions in a consistent way. It also has responsive behavior
on mobile devices.

### Use header, sidebar, and content

Just replace the dummy texts in **App.tsx** with our new components, then you can see our UI looks beautiful now.

```typescript jsx
import React from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";

import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/application-frame";
// import our components
import { Content } from "./Content";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const items = [
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" }
];

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

Next step we will handle events to change the UI, ex: click on the menu item then change the content which is shown in
the center.
Modify **App.tsx** file like below:

```typescript jsx
import React from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";

import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/application-frame";
import { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";

// import your components
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Content } from "./Content";

const menuItems = [{ label: "Quote" }, { label: "About us" }];

const sidebarItems = [
  {
	name: "Quote 1",
	quote: "Life is short, smile while you still have teeth."
  },
  {
	name: "Quote 2",
	quote: "If two wrongs don't make a right, try three."
  },
  {
	name: "Quote 3",
	quote: "I am not lazy, I am on energy saving mode."
  }
];

export default function App() {
  const [menuIndex, setMenuIndex] = React.useState(0);
  const [sidebarIndex, setSidebarIndex] = React.useState(0);

  const getMenuItems = React.useCallback((): MenuItem[] => {
    return menuItems.map((item, index) => ({
       ...item,
       selected: menuIndex === index,
       onClick: () => setMenuIndex(index)
    }));
  }, [menuIndex])

  const getSidebarItems = React.useCallback((): MenuItem[] => {
    return sidebarItems.map((item, index) => ({
       label: item.name,
       selected: sidebarIndex === index,
       onClick: () => setSidebarIndex(index)
    }));
  }, [sidebarIndex])

  const selectedSidebarItem = sidebarItems[sidebarIndex];
  const content = menuIndex === 0 ? selectedSidebarItem.quote : "About page without sidebar";

  return (
    <ThemeProvider theme={flatTheme}>
       <GlobalStyles />
       <ApplicationFrame
           main={<Header items={getMenuItems()} />}
           sub={menuIndex === 0 ? <Sidebar items={getSidebarItems()} /> : undefined}
           content={<Content title={menuIndex === 0 ? selectedSidebarItem.name : "About"} text={content} />}
           subExpanded={true}
       />
    </ThemeProvider>
  );
}
```

Now the content of the center area will change if we click on a menu item or sidebar item. You will see the something
like this:

![Sample application](images/sample-application-preview.png)

That's it for the start. Happy coding!
