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
import { loremIpsum } from "lorem-ipsum";
import { styled, css } from "styled-components";

import { Typography, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { fixedRandomNumber } from "../../helpers/utils.js";

const { Body, Headline, Section } = Typography;

const headlineTitle = `Collapsible Headline ${loremIpsum({ units: "word", count: 3 })}`;
const subInfoTitle1 = `Collapsible Headline ${loremIpsum({ units: "word", count: 1 })}`;
const subInfoTitle2 = `Collapsible Headline ${loremIpsum({ units: "word", count: 4 })}`;
const bodyContent = loremIpsum({ units: "sentences", count: 10, random: fixedRandomNumber() });

const StyledIconSC = styled(Icon)`
	margin-right: ${({ theme }) => `${theme.spacing.horizontalSpacing.horizWhiteSpacingxs}px`};
`;

const StyledHeadlineSC = styled(Headline)(({ theme }) => {
	return css`
		&:hover,
		&:active,
		&:focus-within {
			${StyledIconSC} {
				color: ${theme.colors.text.invertedColor};
			}
		}
	`;
});

export function CustomAddonPosition(): ReactElement {
	const [collapsed, setCollapsed] = useState(true);

	const handleCollapsingChange = (): void => {
		setCollapsed((prevCollapsed) => !prevCollapsed);
	};

	return (
		<Section>
			<StyledHeadlineSC
				level={4}
				ariaLevel={4}
				divider
				collapsible
				collapsed={collapsed}
				onCollapsingChange={handleCollapsingChange}
				addons={<StyledIconSC iconTheme="outlined">home_work</StyledIconSC>}
				swapAddonsPosition
				iconVerticalAlignment="middle"
			>
				<div>
					<p>
						<strong>{headlineTitle}</strong>
					</p>
					<p className="-u-text-sm">
						<em className="-u-margin-r-lg">200$ {subInfoTitle1}</em>
						<em>1265,30$ {subInfoTitle2}</em>
					</p>
				</div>
			</StyledHeadlineSC>
			{!collapsed && <Body>{bodyContent}</Body>}
		</Section>
	);
}
