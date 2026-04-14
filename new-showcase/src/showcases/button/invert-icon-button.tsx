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
import { styled } from "styled-components";

import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { DarkBackgroundContainer } from "../../helpers/showcase-wrapper.js";

const customClasses = "-u-flex -u-justify-center -u-padding-xs";

const StyledWrapper = styled.div`
	display: flex;
	align-items: center;
	> * {
		flex: 1;
	}
`;

export function InvertIconButtonShowcase(): ReactElement {
	return (
		<div className="-u-width-48">
			<StyledWrapper>
				<p>Regular</p>
				<DarkBackgroundContainer className={customClasses}>
					<Button invert icon={<Icon>fullscreen_exit</Icon>} title="Minimize" id="regular-invert-icon-button" />
				</DarkBackgroundContainer>
			</StyledWrapper>

			<StyledWrapper>
				<p>Primary</p>
				<DarkBackgroundContainer className={customClasses}>
					<Button invert primary icon={<Icon>get_app</Icon>} title="Download" id="primary-invert-icon-button" />
				</DarkBackgroundContainer>
			</StyledWrapper>

			<StyledWrapper>
				<p>Secondary</p>
				<DarkBackgroundContainer className={customClasses}>
					<Button invert secondary icon={<Icon>search</Icon>} title="Search" id="secondary-invert-icon-button" />
				</DarkBackgroundContainer>
			</StyledWrapper>

			<StyledWrapper>
				<p>Activated</p>
				<DarkBackgroundContainer className={customClasses}>
					<Button invert active icon={<Icon>visibility</Icon>} title="Watching" id="active-invert-icon-button" />
				</DarkBackgroundContainer>
			</StyledWrapper>
		</div>
	);
}
