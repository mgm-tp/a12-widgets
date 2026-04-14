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
import { styled, css } from "styled-components";

import {
	Button,
	ErrorTooltip,
	HintTooltip,
	SuccessTooltip,
	Tooltip,
	WarningTooltip,
	Icon,
	provider as DeviceDetector
} from "@com.mgmtp.a12.widgets/widgets-core";

const DarkBackgroundContainer = styled.div(({ theme }) => {
	return css`
		background: ${theme.colors.variant.infoColor};
		display: flex;
		padding: 10px;
		border-radius: 4px;
		gap: 4px;
	`;
});

export function InvertTooltipShowcase(): ReactElement {
	const hasTouch = DeviceDetector.hasTouch();

	return (
		<DarkBackgroundContainer>
			<Tooltip text={hasTouch ? <p>An Invert Tooltip</p> : "An Invert Tooltip"}>
				<Button
					invert
					icon={
						<Icon title="Invert tooltip" showTitleAsTooltip={false}>
							edit
						</Icon>
					}
				/>
			</Tooltip>
			<HintTooltip invert text={hasTouch ? <p>An Invert Hint Tooltip</p> : "An Invert Hint Tooltip"} />
			<SuccessTooltip invert text={hasTouch ? <p>An Invert Success Tooltip</p> : "An Invert Success Tooltip"} />
			<WarningTooltip invert text={hasTouch ? <p>An Invert Warning Tooltip</p> : "An Invert Warning Tooltip"} />
			<ErrorTooltip invert text={hasTouch ? <p>An Invert Error Tooltip</p> : "An Invert Error Tooltip"} />
		</DarkBackgroundContainer>
	);
}
