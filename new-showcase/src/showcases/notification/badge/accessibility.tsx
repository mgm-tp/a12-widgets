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

import type { FC } from "react";

import { Button, ButtonGroup, Icon, Badge } from "@com.mgmtp.a12.widgets/widgets-core";

export const AccessibilityBadgeShowcase: FC = () => {
	return (
		<div className="-u-width-full">
			<ButtonGroup className="-u-margin-b-md">
				<Button label="Info" badge={<Badge count={50} />} />
				<Button label="Success" badge={<Badge variant="success" count={50} />} />
				<Button label="Warning" badge={<Badge variant="warning" count={50} />} />
				<Button label="Error" badge={<Badge variant="error" count={50} />} />
				<Button label="Custom Title" badge={<Badge variant="error" count={50} title="Badge with Custom Title" />} />
				<Button
					title="Email, 50 Info notifications"
					labelHidden
					icon={<Icon>mail_outline</Icon>}
					badge={<Badge count={50} />}
				/>
			</ButtonGroup>

			<ButtonGroup>
				<Button icon={<Icon>search</Icon>} title="Default" badge={<Badge tiny />} />
				<Button icon={<Icon>mail_outline</Icon>} title="Success" badge={<Badge tiny variant="success" />} />
				<Button destructive icon={<Icon>delete</Icon>} title="Destructive" badge={<Badge tiny variant="warning" />} />
				<Button disabled icon={<Icon>get_app</Icon>} title="Disabled" badge={<Badge tiny variant="error" />} />
				<Button
					title="Default, Info notifications available"
					icon={<Icon>import_contacts</Icon>}
					badge={<Badge tiny />}
				/>
			</ButtonGroup>
		</div>
	);
};
