/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import "@com.mgmtp.a12.widgets/widgets-core/styles/basic.css";
import "./roboto.css";

import { useState, StrictMode, Suspense } from "react";
import { DndProvider } from "react-dnd";
import type { RouteObject } from "react-router";
import { createHashRouter, Navigate, RouterProvider, useLocation } from "react-router";
import { StyleSheetManager, ThemeProvider as ShowcaseThemeProvider } from "styled-components";

import {
	DragAndDropUtils,
	GlobalStyles,
	WidgetsRoot,
	shouldForwardProp,
	createTheme,
	getBaseTheme
} from "@com.mgmtp.a12.widgets/widgets-core";

import { App } from "./app.js";
import { Home } from "./showcases/home-page/home.js";
import type { ThemeType } from "./helpers/theme-selector.js";
import { CustomThemeContext, getCurrentTheme, ThemeContext, ThemeSelector } from "./helpers/theme-selector.js";
import { ShowcaseStyles } from "./helpers/showcase-styles.js";
import type { WidgetInfo } from "./helpers/definitions.js";
import { LayoutShowcaseContentBox } from "./helpers/view.js";
import { NotFound } from "./helpers/not-found.js";
import { ShowcaseErrorBoundary } from "./helpers/showcase-error-boundary.js";
import type { IndexMenuItem, SiteMapMenuItem } from "./routes.js";
import { SiteMap, Utils } from "./routes.js";
import { getLocalStorage, setLocalStorage } from "./helpers/utils.js";
import { showcaseTheme } from "./helpers/showcase-theme.js";

function renderShowcase(module: IndexMenuItem.ShowcaseModule, basePath: string) {
	return (
		<LayoutShowcaseContentBox
			// All showcase routes render this same component type at the same tree position,
			// so without a key React would reuse the mounted instance across navigation
			// e.g. a "Show code" panel opened on one page would appear already open on the next page at the same section position.
			// Keying by showcase path makes React remount on navigation, so each page starts with fresh state.
			// See https://react.dev/learn/preserving-and-resetting-state#same-component-at-the-same-position-preserves-state
			key={basePath}
			label={module.label}
			showcases={module.structure}
			basePath={basePath}
			widgetInfo={module.widgetInfo as WidgetInfo | undefined}
			useFullPageLayout={module.useFullPageLayout}
			useLargeView={module.useLargeView ?? false}
			useFullLayoutWithoutRightNav={module.useFullLayoutWithoutRightNav ?? false}
		/>
	);
}

function getFirstLeafPath(item: SiteMapMenuItem): string {
	return Utils.isSection(item) ? getFirstLeafPath(item.children[0]) : item.path;
}

function buildRouteObjects(items: SiteMapMenuItem[]): RouteObject[] {
	const routes: RouteObject[] = [];

	for (const item of items) {
		if (Utils.isSection(item)) {
			routes.push({
				path: item.path,
				element: <Navigate to={getFirstLeafPath(item.children[0])} replace />
			});
			routes.push(...buildRouteObjects(item.children));
		} else {
			const basePath = item.path;

			routes.push({
				path: `${basePath}/*`,
				element: renderShowcase(item.component, basePath),
				ErrorBoundary: ShowcaseErrorBoundary
			});
		}
	}

	return routes;
}

function collectLeavesByPath(items: SiteMapMenuItem[]): Map<string, SiteMapMenuItem.Showcase> {
	const map = new Map<string, SiteMapMenuItem.Showcase>();
	const walk = (list: SiteMapMenuItem[]): void => {
		for (const item of list) {
			if (Utils.isSection(item)) {
				walk(item.children);
			} else {
				map.set(item.path, item);
			}
		}
	};

	walk(items);

	return map;
}

const leafByPath = collectLeavesByPath(SiteMap);

function Fullscreen() {
	const { pathname } = useLocation();
	const rest = pathname.replace(/^\/fullscreen/, "");
	const leaf = leafByPath.get(rest);

	if (!leaf) {
		return <NotFound />;
	}

	return renderShowcase(leaf.component, leaf.path);
}

function ComponentWidgetsRedirect() {
	const location = useLocation();
	const newPath = location.pathname.replace("component-widgets", "widgets");

	return <Navigate to={newPath} replace />;
}

const showcaseRoutes = buildRouteObjects(SiteMap);

const router = createHashRouter([
	{ path: "/fullscreen/*", element: <Fullscreen /> },
	{ path: "/component-widgets/*", element: <ComponentWidgetsRedirect /> },
	{
		path: "/",
		element: <App />,
		children: [{ index: true, element: <Home /> }, ...showcaseRoutes, { path: "*", element: <NotFound /> }]
	}
]);

export function Root() {
	const [theme, setTheme] = useState<ThemeType>(getCurrentTheme());
	const [customTheme, setCustomTheme] = useState(() => {
		const custom = getLocalStorage("custom-theme");

		if (custom) {
			return createTheme(JSON.parse(custom));
		}

		return getBaseTheme({ spacing: { base: 16 } });
	});

	const setLocalTheme = (theme: ThemeType): void => {
		setLocalStorage("theme", theme);
		setTheme(theme);
	};

	return (
		<StrictMode>
			<StyleSheetManager shouldForwardProp={shouldForwardProp}>
				<ThemeContext.Provider value={{ theme, setTheme: setLocalTheme }}>
					<CustomThemeContext.Provider value={{ theme: customTheme, setTheme: setCustomTheme }}>
						<ShowcaseThemeProvider theme={showcaseTheme}>
							<ThemeSelector>
								<GlobalStyles />
							</ThemeSelector>
							<ShowcaseStyles />
							<WidgetsRoot>
								<DndProvider
									backend={DragAndDropUtils.DefaultDndBackend}
									options={DragAndDropUtils.DefaultDndBackendOptions}
								>
									<Suspense fallback={null}>
										<RouterProvider router={router} />
									</Suspense>
								</DndProvider>
							</WidgetsRoot>
						</ShowcaseThemeProvider>
					</CustomThemeContext.Provider>
				</ThemeContext.Provider>
			</StyleSheetManager>
		</StrictMode>
	);
}
