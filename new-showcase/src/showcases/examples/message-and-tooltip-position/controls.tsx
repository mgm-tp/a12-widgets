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

import type { ReactElement } from "react";

import type { MessagePosition, TooltipLineBreak, TooltipPosition } from "@com.mgmtp.a12.widgets/widgets-core";
import { Checkbox, Select } from "@com.mgmtp.a12.widgets/widgets-core";

export type LayoutKey =
	| "message-above"
	| "message-below"
	| "message-default"
	| "tooltip-beside"
	| "tooltip-below"
	| "tooltip-above"
	| "tooltip-default";

export interface Layout {
	label: string;

	/**
	 * The element the option positions. Only that one is rendered: picking a message option hides the
	 * tooltips, and picking a tooltip option hides the message box, so what moved is never in doubt.
	 */
	demonstrates: "message" | "tooltip";

	/** Left out by the default options, so the Widget applies whatever default it carries itself. */
	breakTooltipsToNewLine?: TooltipLineBreak;

	/**
	 * The same position in the vocabulary Text Output uses. Left out by the default options, so the
	 * Widget applies whatever default it carries itself.
	 */
	tooltipPosition?: TooltipPosition;

	/** Left out by the default options, so the Widget applies whatever default it carries itself. */
	messagePosition?: MessagePosition;
}

/**
 * Each option positions either the message boxes or the tooltips and leaves the other property at its
 * default, which is why the message options all pair with the beside tooltip layout and the tooltip
 * options with `messagePosition: "above"`. The two default options instead omit the property they
 * demonstrate, which is how they show what a Widget falls back to when it is not given one. A dropdown
 * item can only carry a string, and `breakTooltipsToNewLine` needs `false` as well as its two string
 * literals.
 *
 * Each tooltip layout is carried twice, because the two properties that set it are spelled differently:
 * the data entry widgets take `breakTooltipsToNewLine`, and Text Output takes `tooltipPosition`, whose
 * `"beside"` is the other property's `false`.
 */
export const LAYOUTS: Record<LayoutKey, Layout> = {
	"message-above": {
		label: "Message box above control",
		demonstrates: "message",
		breakTooltipsToNewLine: false,
		tooltipPosition: "beside",
		messagePosition: "above"
	},
	"message-below": {
		label: "Message box below control",
		demonstrates: "message",
		breakTooltipsToNewLine: false,
		tooltipPosition: "beside",
		messagePosition: "below"
	},
	"message-default": {
		label: "Message box default position",
		demonstrates: "message",
		breakTooltipsToNewLine: false,
		tooltipPosition: "beside"
		// `messagePosition` omitted on purpose — this option shows where the message box lands without it.
	},
	"tooltip-beside": {
		label: "Tooltip beside control",
		demonstrates: "tooltip",
		breakTooltipsToNewLine: false,
		tooltipPosition: "beside",
		messagePosition: "above"
	},
	"tooltip-below": {
		label: "Tooltip below control",
		demonstrates: "tooltip",
		breakTooltipsToNewLine: "below",
		tooltipPosition: "below",
		messagePosition: "above"
	},
	"tooltip-above": {
		label: "Tooltip above control",
		demonstrates: "tooltip",
		breakTooltipsToNewLine: "above",
		tooltipPosition: "above",
		messagePosition: "above"
	},
	"tooltip-default": {
		label: "Tooltip default position",
		demonstrates: "tooltip",
		messagePosition: "above"
		// `breakTooltipsToNewLine` and `tooltipPosition` omitted on purpose — this option shows where the
		// tooltip lands without them.
	}
};

const LAYOUT_ITEMS = Object.entries(LAYOUTS).map(([value, layout]) => ({ value, label: layout.label }));

export type Status = "error" | "warning" | "info";

/** The text each status carries in the message layouts, so every Widget shows the same wording. */
export const STATUS_TEXTS: Record<Status, string> = {
	error: "This field is required",
	warning: "Please double-check this value",
	info: "This field is optional"
};

const STATUS_ITEMS = [
	{ value: "error", label: "Error" },
	{ value: "warning", label: "Warning" },
	{ value: "info", label: "Info" }
];

export interface PositionControlsProps {
	layout: LayoutKey;
	onLayoutChange: (layout: LayoutKey) => void;
	status: Status;
	onStatusChange: (status: Status) => void;
	showLabel: boolean;
	onShowLabelChange: (show: boolean) => void;
	showHelperText: boolean;
	onShowHelperTextChange: (show: boolean) => void;
	showTooltip: boolean;
	onShowTooltipChange: (show: boolean) => void;
}

export function PositionControls(props: PositionControlsProps): ReactElement {
	return (
		<div className="-u-flex -u-flex-col -u-width-full" style={{ gap: 16 }}>
			<Select
				id="mtp-layout"
				label="Position (breakTooltipsToNewLine / tooltipPosition / messagePosition)"
				items={LAYOUT_ITEMS}
				value={props.layout}
				onValueChanged={(value) => props.onLayoutChange(value as LayoutKey)}
				fitToParent={false}
			/>
			<Select
				id="mtp-status"
				label="Status"
				items={STATUS_ITEMS}
				value={props.status}
				onValueChanged={(value) => props.onStatusChange(value as Status)}
				helperText="Rendered as a message box in the message layouts, and as the matching error / warning / info prop in the tooltip layouts."
				fitToParent={false}
			/>
			<div className="-u-flex -u-items-center -u-flex-wrap" style={{ gap: 16 }}>
				<Checkbox
					checked={props.showLabel}
					onChange={props.onShowLabelChange}
					label="Label"
					title="Label"
					fitToParent={false}
				/>
				<Checkbox
					checked={props.showHelperText}
					onChange={props.onShowHelperTextChange}
					label="Helper text"
					title="Helper text"
					fitToParent={false}
				/>
				<Checkbox
					checked={props.showTooltip}
					onChange={props.onShowTooltipChange}
					label="Tooltip"
					title="Tooltip"
					fitToParent={false}
				/>
			</div>
		</div>
	);
}
