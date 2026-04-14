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
import { styled, css } from "styled-components";

import { FlyoutMenu, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../../helpers/configuration-view.js";

import { items } from "../menu.setup.js";

export const StyledMenuShowcaseWrapper = styled.div<{ $collapsed?: boolean }>(
	({ $collapsed }) => css`
		width: ${$collapsed ? "fit-content" : "300px"};
	`
);
export function VerticalMenu(): ReactElement {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<ConfigurationView
			configuration={
				<div>
					<Checkbox checked={collapsed} onChange={setCollapsed} label="Collapsed" title="Collapse Menu" />
				</div>
			}
		>
			<StyledMenuShowcaseWrapper $collapsed={collapsed}>
				<FlyoutMenu type="vertical" items={items} collapsed={collapsed} id="basic-vertical-menu" />
			</StyledMenuShowcaseWrapper>
		</ConfigurationView>
	);
}
