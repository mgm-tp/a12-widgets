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

/**
 * Controls how keyboard navigation works within components.
 *
 * - `"default"`: Both Tab and arrow keys navigate within a component.
 * - `"arrow-only"`: Only arrow keys navigate within a component; Tab moves focus to the next component.
 */
export type KeyboardNavigationMode = "default" | "arrow-only";

export interface KeyboardNavigationBaseConfig {
	/**
	 * The keyboard navigation mode for this component.
	 * @default "default"
	 */
	mode?: KeyboardNavigationMode;
}

export type KeyboardNavigationComponentConfigMap = {
	popUpMenu: KeyboardNavigationBaseConfig;
	buttonGroupContainer: KeyboardNavigationBaseConfig;
	quickAccessButton: KeyboardNavigationBaseConfig;
	fileUpload: KeyboardNavigationBaseConfig;
	richTextEditor: KeyboardNavigationBaseConfig;
	typography: KeyboardNavigationBaseConfig;
	comment: KeyboardNavigationBaseConfig;
	validationBar: KeyboardNavigationBaseConfig;
	horizontalFlyoutMenu: KeyboardNavigationBaseConfig;
	verticalFlyoutMenu: KeyboardNavigationBaseConfig;
	slidingMenu: KeyboardNavigationBaseConfig;
	tree: KeyboardNavigationBaseConfig;
	tabPanelSubTablist: KeyboardNavigationBaseConfig;
};

export type KeyboardNavigationComponentKey = keyof KeyboardNavigationComponentConfigMap;

/**
 * Component-specific configuration for keyboard navigation.
 */
export type KeyboardNavigationComponentConfig = {
	[K in KeyboardNavigationComponentKey]?: KeyboardNavigationMode | KeyboardNavigationComponentConfigMap[K];
};
