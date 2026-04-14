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

import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";
import "./roboto.css";

import { useState, useMemo, StrictMode } from "react";
import { DndProvider } from "react-dnd";
import { Redirect, Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { StyleSheetManager, ThemeProvider as ShowcaseThemeProvider } from "styled-components";

import {
	DragAndDropUtils,
	GlobalStyles,
	WidgetsRoot,
	shouldForwardProp,
	createTheme,
	getDefaultTheme
} from "@com.mgmtp.a12.widgets/widgets-core";

import { App } from "./app.js";
import { Home } from "./showcases/home-page/home.js";
import type { ThemeType } from "./helpers/theme-selector.js";
import { CustomThemeContext, getCurrentTheme, ThemeContext, ThemeSelector } from "./helpers/theme-selector.js";
import { ShowcaseStyles } from "./helpers/showcase-styles.js";
import { LayoutShowcaseContentBox } from "./helpers/view.js";
import { NotFound } from "./helpers/not-found.js";
import type { SiteMapMenuItem } from "./routes.js";
import { ListOfPathsArray, SiteMap, Utils } from "./routes.js";
import { getLocalStorage, setLocalStorage } from "./helpers/utils.js";
import { showcaseTheme } from "./helpers/showcase-theme.js";

function buildRoute(item: SiteMapMenuItem, basePath = "", redirectToFirstChild = false) {
	const path = basePath + item.path;

	if (Utils.isSection(item)) {
		return (
			<Route path={path} key={path}>
				<Switch>
					{redirectToFirstChild ? (
						<Route exact key="redirect" path={path} render={() => <Redirect to={basePath + item.children[0].path} />} />
					) : undefined}
					{item.children.map((child) => buildRoute(child, basePath, redirectToFirstChild))}
				</Switch>
			</Route>
		);
	} else {
		let Component = item.component;

		if (typeof Component === "object") {
			const data: any = item.component;
			Component = (props: any) => (
				<LayoutShowcaseContentBox
					label={data.label}
					showcases={data.structure}
					route={props}
					widgetInfo={data.widgetInfo}
					useFullPageLayout={data.useFullPageLayout}
					useLargeView={data.useLargeView}
					useFullLayoutWithoutRightNav={data.useFullLayoutWithoutRightNav}
				/>
			);
		}

		return <Route path={path} component={Component} key={path} />;
	}
}

export function Root() {
	const [theme, setTheme] = useState<ThemeType>(getCurrentTheme());
	const [customTheme, setCustomTheme] = useState(() => {
		const custom = getLocalStorage("custom-theme");

		if (custom) {
			return createTheme(JSON.parse(custom));
		}

		return getDefaultTheme();
	});

	const setLocalTheme = (theme: ThemeType): void => {
		setLocalStorage("theme", theme);
		setTheme(theme);
	};

	const normalRoutes = useMemo(() => SiteMap.map((item) => buildRoute(item, "", true)), []);

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
									<HashRouter>
										<Switch>
											<Route path="/fullscreen" render={() => <div>Hello</div>} />
											<Route
												path="/"
												render={(props) => {
													if (props.location.pathname.includes("component-widgets")) {
														window.location.replace(
															`#${props.location.pathname.replace("component-widgets", "widgets")}`
														);

														return;
													}

													const _renderRoute =
														props.location.pathname === "/" ? (
															<Route component={Home} />
														) : ListOfPathsArray.includes(props.location.pathname) ? (
															normalRoutes
														) : (
															<Route component={NotFound} />
														);

													return <App {...props}>{_renderRoute}</App>;
												}}
											/>
										</Switch>
									</HashRouter>
								</DndProvider>
							</WidgetsRoot>
						</ShowcaseThemeProvider>
					</CustomThemeContext.Provider>
				</ThemeContext.Provider>
			</StyleSheetManager>
		</StrictMode>
	);
}
