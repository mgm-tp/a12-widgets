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
import { useState } from "react";

import type { MessagePosition, TooltipLineBreak } from "@com.mgmtp.a12.widgets/widgets-core";
import { HintTooltip, Select } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../../helpers/configuration-view.js";

const id = "select-message-position";

type Element = "message" | "tooltip";

const ELEMENT_ITEMS = [
	{ value: "message", label: "Message box" },
	{ value: "tooltip", label: "Tooltip" }
];

const MESSAGE_POSITION_ITEMS = [
	{ value: "above", label: "above" },
	{ value: "below", label: "below" }
];

const TOOLTIP_POSITION_ITEMS = [
	{ value: "beside", label: "beside" },
	{ value: "above", label: "above" },
	{ value: "below", label: "below" }
];

const TOOLTIP_LINE_BREAKS: Record<string, TooltipLineBreak> = {
	beside: false,
	above: "above",
	below: "below"
};

const MESSAGE_TEXT = "This field is required";

const SELECT_ITEMS = [
	{ value: "1", label: "Option 1" },
	{ value: "2", label: "Option 2" },
	{ value: "3", label: "Option 3" }
];

export function MessagePosition(): ReactElement {
	const [element, setElement] = useState<Element>("message");
	const [messagePosition, setMessagePosition] = useState("above");
	const [tooltipPosition, setTooltipPosition] = useState("above");
	const [value, setValue] = useState<string | undefined>();

	const showsMessage = element === "message";

	const breakTooltipsToNewLine: TooltipLineBreak = TOOLTIP_LINE_BREAKS[tooltipPosition];

	return (
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-col -u-width-full" style={{ gap: 16 }}>
					<Select
						id={`${id}-element`}
						label="Element to position"
						items={ELEMENT_ITEMS}
						value={element}
						onValueChanged={(next) => setElement(next as Element)}
						fitToParent={false}
					/>
					{showsMessage ? (
						<Select
							id={`${id}-message-position`}
							label="messagePosition"
							items={MESSAGE_POSITION_ITEMS}
							value={messagePosition}
							onValueChanged={setMessagePosition}
							fitToParent={false}
						/>
					) : (
						<Select
							id={`${id}-tooltip-position`}
							label="breakTooltipsToNewLine"
							items={TOOLTIP_POSITION_ITEMS}
							value={tooltipPosition}
							onValueChanged={setTooltipPosition}
							fitToParent={false}
						/>
					)}
				</div>
			}
		>
			<div className="-u-width-full">
				<Select
					id={id}
					items={SELECT_ITEMS}
					value={value}
					onValueChanged={setValue}
					placeholder="Please choose..."
					label="Label"
					helperText="Helper text explaining the field"
					messagePosition={messagePosition as MessagePosition}
					breakTooltipsToNewLine={breakTooltipsToNewLine}
					errorMessage={showsMessage ? MESSAGE_TEXT : undefined}
					tooltips={showsMessage ? undefined : <HintTooltip text="This is a hint" id={`${id}-hint`} key="hint" />}
					ariaDescribedby={showsMessage ? undefined : `${id}-hint`}
				/>
			</div>
		</ConfigurationView>
	);
}
