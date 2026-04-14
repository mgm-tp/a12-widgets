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

import type { ReactNode, ReactElement } from "react";
import { useContext, useState } from "react";

import { provider as DeviceDetector, HeaderTrigger, Icon, List, PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core";

import { ShowcaseThemes } from "../themes/themes.js";

import { getLocalStorage } from "./utils.js";
import { ThemeContext } from "./theme-selector.js";

const { Item } = List;
export function ThemeSelectorHeader(props: { isSmallView?: boolean }): ReactElement {
	const { isSmallView } = props;
	const { theme, setTheme } = useContext(ThemeContext);
	const [isPopupButtonActive, setPopupButtonActive] = useState(false);
	const isPhone = DeviceDetector.isPhone();
	const isDevelopmentMode = getLocalStorage("mode") === "development";
	const hasCustomTheme = !!getLocalStorage("custom-theme");
	const showcaseThemes = ShowcaseThemes.getThemes();

	const renderedThemeOptions = (): ReactNode => {
		return showcaseThemes.map((showcaseTheme) => (
			<Item
				key={showcaseTheme.name}
				text={showcaseTheme.label ?? showcaseTheme.name}
				meta={theme === showcaseTheme.name && <Icon>check</Icon>}
				selected={theme === showcaseTheme.name}
				onClick={() => setTheme(showcaseTheme.name)}
			/>
		));
	};

	return (
		<PopUpMenu
			key="version"
			headerTitle="Theme"
			triggerElement={
				<HeaderTrigger
					text={!isSmallView ? "Theme Selector" : undefined}
					graphic={isSmallView ? "palette" : undefined}
					active={isPopupButtonActive}
					meta={!isPhone && !isSmallView ? "keyboard_arrow_down" : undefined}
				/>
			}
			triggerButtonTitle="Open theme menu"
			triggerButtonCloseTitle="Close theme menu"
			onVisibilityChange={setPopupButtonActive}
		>
			<List paddedRight>
				{renderedThemeOptions()}
				{isDevelopmentMode && hasCustomTheme && (
					<Item
						text="Custom"
						meta={theme === "custom" && <Icon>check</Icon>}
						selected={theme === "custom"}
						onClick={() => setTheme("custom")}
					/>
				)}
			</List>
		</PopUpMenu>
	);
}
