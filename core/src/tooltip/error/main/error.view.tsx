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
import { useContext } from "react";

import { Icon } from "../../../icon/main/icon.view.js";
import { Button } from "../../../button/main/button.view.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { provider } from "../../../common/main/device-detector.js";
import { Tooltip } from "../../main/tooltip.view.js";

import type { ErrorTooltipProps } from "./error.api.js";

/**
 * This is a convenience wrapper of the tooltip that can be used to show a error.
 */
export function ErrorTooltip(props: ErrorTooltipProps): ReactElement<ErrorTooltipProps> {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const a11yTriggerTitle = provider.isPhone()
		? languageContext.tooltipTitles?.errorTrigger
		: `${languageContext.tooltipTitles?.errorTrigger}: ${languageContext.tooltipTitles?.triggerElement}`;

	return (
		<Tooltip
			variant="error"
			text={props.text}
			disabled={props.disabled}
			className={props.className}
			style={props.style}
			id={props.id}
			dataRole={props.dataRole || "tooltip-error"}
			useDesktopView={props.useDesktopView}
		>
			<Button
				invert={props.invert}
				disabled={props.disabled}
				icon={
					<Icon
						iconTheme="custom"
						variant={props.invert ? undefined : "error"}
						showTitleAsTooltip={false}
						title={a11yTriggerTitle}
					>
						error
					</Icon>
				}
			/>
		</Tooltip>
	);
}

ErrorTooltip.displayName = "ErrorTooltip";
