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

import { GlobalMessageBox, Icon, Button, ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core";

function renderActions(): ReactElement {
	return (
		<ButtonGroup>
			<Button primary invert label="Primary" />
			<Button secondary invert icon={<Icon>refresh</Icon>} title="Refresh" />
		</ButtonGroup>
	);
}

export function GlobalMessageBoxVariantShowcase(): ReactElement {
	return (
		<div>
			<div className="-u-margin-b-sm">
				<GlobalMessageBox
					variant="info"
					content="This is an information message!"
					actions={renderActions()}
					focusOnMount={false}
				/>
			</div>
			<div className="-u-margin-b-sm">
				<GlobalMessageBox
					variant="success"
					content="This is a success message!"
					actions={renderActions()}
					focusOnMount={false}
				/>
			</div>
			<div className="-u-margin-b-sm">
				<GlobalMessageBox
					variant="warning"
					content="This is a warning message!"
					actions={renderActions()}
					focusOnMount={false}
				/>
			</div>
			<div>
				<GlobalMessageBox
					variant="error"
					content="This is an error message!"
					actions={renderActions()}
					focusOnMount={false}
				/>
			</div>
		</div>
	);
}
