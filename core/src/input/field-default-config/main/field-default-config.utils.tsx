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
import { useMemo } from "react";

import type { TooltipLineBreak } from "../../base/template/base.tpl.api.js";

import type { FieldDefaultConfigProps, FieldOverrideProps, TooltipPosition } from "./field-default-config.api.js";
import { useFieldDefaultConfig } from "./field-default-config.context.js";

/**
 * Translates the provider vocabulary into the one the `breakTooltipsToNewLine` property uses.
 * `"beside"` is the named equivalent of that property's `false`.
 * @internal
 */
function toTooltipLineBreak(tooltipPosition: TooltipPosition): TooltipLineBreak {
	return tooltipPosition === "beside" ? false : tooltipPosition;
}

/**
 * Translates the `breakTooltipsToNewLine` vocabulary into the provider's. `true` and `"above"` name
 * the same layout, so both map onto `"above"`.
 * @internal
 */
function toTooltipPosition(breakTooltipsToNewLine: TooltipLineBreak): TooltipPosition {
	if (breakTooltipsToNewLine === false) {
		return "beside";
	}

	return breakTooltipsToNewLine === true ? "above" : breakTooltipsToNewLine;
}

/**
 * Resolves the positions a widget renders with: an explicit property wins over the nearest
 * {@link FieldDefaultConfigProvider}, which wins over the widget's own default.
 *
 * `tooltipFallback` is the layout the widget used before the position became configurable, so that a
 * widget without a provider above it behaves exactly as it did before.
 * @internal
 */
export function useFieldPositions(
	props: FieldDefaultConfigProps,
	tooltipFallback: TooltipPosition
): Required<FieldDefaultConfigProps> {
	const { messagePosition, tooltipPosition } = useFieldDefaultConfig();
	const ownMessagePosition = props.messagePosition;
	const ownTooltipPosition = props.tooltipPosition;

	return useMemo(
		() => ({
			messagePosition: ownMessagePosition ?? messagePosition ?? "above",
			tooltipPosition: ownTooltipPosition ?? tooltipPosition ?? tooltipFallback
		}),
		[ownMessagePosition, ownTooltipPosition, messagePosition, tooltipPosition, tooltipFallback]
	);
}

/**
 * {@link useFieldPositions} in the vocabulary the `breakTooltipsToNewLine` property uses, for the
 * data entry widgets that carry it. A value the widget was given itself is handed back untouched.
 * @internal
 */
export function useFieldDefaultsConfig(
	props: FieldOverrideProps,
	tooltipFallback: TooltipLineBreak
): Required<FieldOverrideProps> {
	const ownTooltipLineBreak = props.breakTooltipsToNewLine;
	const { messagePosition, tooltipPosition } = useFieldPositions(
		{
			messagePosition: props.messagePosition,
			tooltipPosition: ownTooltipLineBreak === undefined ? undefined : toTooltipPosition(ownTooltipLineBreak)
		},
		toTooltipPosition(tooltipFallback)
	);

	return useMemo(
		() => ({
			messagePosition,
			breakTooltipsToNewLine: ownTooltipLineBreak ?? toTooltipLineBreak(tooltipPosition)
		}),
		[messagePosition, ownTooltipLineBreak, tooltipPosition]
	);
}

/**
 * Render-prop equivalent of {@link useFieldDefaultsConfig}, for the class components that cannot call a hook.
 * @internal
 */
export function FieldDefaultsConfig(props: {
	inputProps: FieldOverrideProps;
	tooltipFallback: TooltipLineBreak;
	children: (resolved: Required<FieldOverrideProps>) => ReactNode;
}): ReactNode {
	const resolved = useFieldDefaultsConfig(props.inputProps, props.tooltipFallback);

	return props.children(resolved);
}

FieldDefaultsConfig.displayName = "FieldDefaultsConfig";
