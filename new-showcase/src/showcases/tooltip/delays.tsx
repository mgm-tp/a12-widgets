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

import { Button, Icon, Tooltip, TooltipConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

const Row = styled.div`
	display: flex;
	gap: 8px;
`;

export function TooltipDelaysShowcase(): ReactElement {
	return (
		<Row>
			{/* Instance-level timing. */}
			<Tooltip text="Appears almost at once (showDelay 50ms)" showDelay={50}>
				<Button label="Snappy" />
			</Tooltip>
			<Tooltip text="Waits a second before appearing (showDelay 1000ms)" showDelay={1000}>
				<Button label="Slow to appear" />
			</Tooltip>
			<Tooltip text="Stays for a second after you leave (hideDelay 1000ms)" hideDelay={1000}>
				<Button label="Slow to hide" />
			</Tooltip>

			{/* Subtree-level timing: applies to every tooltip inside, including variants. */}
			<TooltipConfigProvider showDelay={50} hideDelay={50}>
				<Tooltip text="Configured by TooltipConfigProvider">
					<Button
						icon={
							<Icon title="Configured by provider" showTitleAsTooltip={false}>
								settings
							</Icon>
						}
					/>
				</Tooltip>
			</TooltipConfigProvider>
		</Row>
	);
}
