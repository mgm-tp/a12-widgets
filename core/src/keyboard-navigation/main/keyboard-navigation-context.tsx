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

import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import merge from "deepmerge";

import type { Container } from "../../common/main/base-props.js";

import type {
	KeyboardNavigationBaseConfig,
	KeyboardNavigationComponentConfig,
	KeyboardNavigationComponentKey,
	KeyboardNavigationMode
} from "./keyboard-navigation.api.js";

export interface KeyboardNavigationConfigContextProps {
	/**
	 * The keyboard navigation mode applied application-wide.
	 * @default "default"
	 */
	mode?: KeyboardNavigationMode;

	/**
	 * Component-specific configuration for keyboard navigation.
	 */
	componentConfigs?: KeyboardNavigationComponentConfig;
}

/** @internal */
export const DEFAULT_KEYBOARD_NAV_CONTEXT_VALUE: KeyboardNavigationConfigContextProps = {
	mode: "default"
};

/** @internal */
export const KeyboardNavigationContext = createContext<KeyboardNavigationConfigContextProps>(
	DEFAULT_KEYBOARD_NAV_CONTEXT_VALUE
);
KeyboardNavigationContext.displayName = "KeyboardNavigationContext";

export const KeyboardNavigationConfigProvider = (
	props: KeyboardNavigationConfigContextProps & Container
): ReactNode => {
	const { children, mode, componentConfigs } = props;

	const contextValue = useMemo(
		() => merge(DEFAULT_KEYBOARD_NAV_CONTEXT_VALUE, { mode, componentConfigs }),
		[mode, componentConfigs]
	);

	return <KeyboardNavigationContext.Provider value={contextValue}>{children}</KeyboardNavigationContext.Provider>;
};

KeyboardNavigationConfigProvider.displayName = "KeyboardNavigationConfigProvider";

/** @internal */
export function resolveKeyboardNavConfig(
	context: KeyboardNavigationConfigContextProps,
	componentKey?: KeyboardNavigationComponentKey
): KeyboardNavigationBaseConfig {
	const baseConfig: KeyboardNavigationBaseConfig = {
		mode: context.mode
	};

	if (!componentKey) {
		return baseConfig;
	}

	const componentConfig = context.componentConfigs?.[componentKey];

	if (componentConfig === undefined) {
		return baseConfig;
	}

	if (typeof componentConfig === "string") {
		return merge(baseConfig, { mode: componentConfig });
	}

	return merge(baseConfig, componentConfig);
}

/**
 * Returns the configured keyboard navigation mode.
 * Falls back to `"default"` when no provider is present or when the provider does not specify a mode.
 *
 * - `"default"`: both Tab and arrows navigate within the component.
 * - `"arrow-only"`: only arrows navigate; Tab exits to the next component.
 * @internal
 */
export const useKeyboardNavigationMode = (componentKey?: KeyboardNavigationComponentKey): KeyboardNavigationMode => {
	const context = useContext(KeyboardNavigationContext);
	const config = resolveKeyboardNavConfig(context, componentKey);

	return config.mode ?? "default";
};
