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
import { useContext, useMemo, createContext } from "react";

import type { Container } from "../../../common/main/base-props.js";

import type { FieldDefaultConfigProps } from "./field-default-config.api.js";

/** @internal */
export const EMPTY_FIELD_DEFAULT_CONFIG: FieldDefaultConfigProps = {};

export const FieldDefaultConfigContext = createContext<FieldDefaultConfigProps>(EMPTY_FIELD_DEFAULT_CONFIG);
FieldDefaultConfigContext.displayName = "FieldDefaultConfigContext";

/**
 * Configures where fields place their message boxes and their tooltips, for a whole subtree. It covers
 * the data entry widgets and Text Output, so a form lays out its inputs and its read-only fields alike.
 * Properties set on a single widget instance take precedence, and a widget's own default applies where
 * neither is set.
 *
 * ```tsx
 * <FieldDefaultConfigProvider messagePosition="below" tooltipPosition="below">
 *     <MyForm />
 * </FieldDefaultConfigProvider>
 * ```
 */
export const FieldDefaultConfigProvider = (props: FieldDefaultConfigProps & Container): ReactNode => {
	const { children, messagePosition, tooltipPosition } = props;

	const inheritedConfig = useContext(FieldDefaultConfigContext);

	const contextValue = useMemo(
		() => ({
			...inheritedConfig,
			...(messagePosition !== undefined && { messagePosition }),
			...(tooltipPosition !== undefined && { tooltipPosition })
		}),
		[inheritedConfig, messagePosition, tooltipPosition]
	);

	return <FieldDefaultConfigContext.Provider value={contextValue}>{children}</FieldDefaultConfigContext.Provider>;
};

FieldDefaultConfigProvider.displayName = "FieldDefaultConfigProvider";

/**
 * Reads the field configuration of the nearest {@link FieldDefaultConfigProvider}, merged across nested
 * providers. Returns an empty object when no provider is mounted.
 */
export function useFieldDefaultConfig(): FieldDefaultConfigProps {
	return useContext(FieldDefaultConfigContext);
}
