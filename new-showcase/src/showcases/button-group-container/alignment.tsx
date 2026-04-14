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

import { Button, ButtonGroup, ButtonGroupContainer } from "@com.mgmtp.a12.widgets/widgets-core";

export function AlignmentShowcase(): ReactElement {
	return (
		<div className="-u-width-full">
			<p>
				By providing an <code>alignment</code> property for ButtonGroup, you can align it to <code>left</code> or{" "}
				<code>right</code>.
			</p>
			<ButtonGroupContainer>
				<ButtonGroup alignment="left">
					<Button label="Default" />
					<Button label="Destructive" destructive />
					<Button label="Disabled" disabled />
				</ButtonGroup>
				<ButtonGroup alignment="right">
					<Button label="Primary" primary />
					<Button label="Destructive" primary destructive />
					<Button label="Disabled" primary disabled />
				</ButtonGroup>
			</ButtonGroupContainer>
			<br />
			<p>
				An example of <code>alignment="left"</code> for a single ButtonGroup.
			</p>
			<ButtonGroupContainer>
				<ButtonGroup alignment="left">
					<Button label="Primary" primary />
					<Button label="Destructive" primary destructive />
					<Button label="Disabled" primary disabled />
				</ButtonGroup>
			</ButtonGroupContainer>
			<br />
			<p>
				An example of <code>alignment="right"</code> for a single ButtonGroup.
			</p>
			<ButtonGroupContainer>
				<ButtonGroup alignment="right">
					<Button label="Primary" primary />
					<Button label="Destructive" primary destructive />
					<Button label="Disabled" primary disabled />
				</ButtonGroup>
			</ButtonGroupContainer>
		</div>
	);
}
