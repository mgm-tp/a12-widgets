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

import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../../../common/main/hidden-text/hidden-text.view.js";
import { joinClassNames } from "../../../../common/main/utils.js";
import { provider } from "../../../../common/main/device-detector.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { ContentBoxProps } from "../contentbox.tpl.api.js";
import { StyledContentBoxFooter } from "../contentbox.tpl.styled.js";

import { BASE_CONTENTBOX_CLASS_NAME } from "./config.js";

export function FooterTpl(props: ContentBoxProps.FooterProps): ReactElement<ContentBoxProps.FooterProps> {
	const { contentboxTitles } = useContext(A11YLanguageContext);
	const className = joinClassNames(`${BASE_CONTENTBOX_CLASS_NAME}__footer`, props.className);

	return (
		<StyledContentBoxFooter
			className={className}
			style={props.style}
			id={props.id}
			data-role={DataRoles.Contentbox.Footer}
		>
			{props.children && provider.isDesktop() && (
				<HiddenText role="heading" ariaLevel={props.ariaLevel || 2}>
					{props.headingTitle ?? contentboxTitles?.footerTitle}
				</HiddenText>
			)}
			{props.children}
		</StyledContentBoxFooter>
	);
}

FooterTpl.displayName = "FooterTpl";
