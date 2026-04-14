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

import { Button, ButtonGroup, generateUid, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

export function IconButtonShowcase(): ReactElement {
	return (
		<div>
			<p>Icon buttons</p>
			<ButtonGroup>
				<Button icon={<Icon>search</Icon>} title="Default" id={generateUid()} />
				<Button active icon={<Icon>visibility</Icon>} title="Active" id={generateUid()} />
				<Button destructive icon={<Icon>delete</Icon>} title="Destructive" id={generateUid()} />
				<Button disabled icon={<Icon>get_app</Icon>} title="Disabled" id={generateUid()} />
			</ButtonGroup>
			<p>Secondary icon buttons</p>
			<ButtonGroup>
				<Button secondary icon={<Icon>search</Icon>} title="Secondary icon button" id={generateUid()} />
				<Button
					secondary
					icon={<Icon>visibility</Icon>}
					title="Secondary active icon button"
					active
					id={generateUid()}
				/>
				<Button
					destructive
					secondary
					icon={<Icon>delete</Icon>}
					title="Secondary destructive icon button"
					id={generateUid()}
				/>
				<Button
					secondary
					disabled
					icon={<Icon>get_app</Icon>}
					title="Secondary disabled icon button"
					id={generateUid()}
				/>
			</ButtonGroup>
			<p>Primary icon buttons</p>
			<ButtonGroup>
				<Button primary icon={<Icon>search</Icon>} title="Primary icon button" id={generateUid()} />
				<Button primary icon={<Icon>visibility</Icon>} title="Primary active icon button" active id={generateUid()} />
				<Button
					destructive
					primary
					icon={<Icon>delete</Icon>}
					title="Primary destructive icon button"
					id={generateUid()}
				/>
				<Button primary disabled icon={<Icon>get_app</Icon>} title="Primary disabled icon button" id={generateUid()} />
			</ButtonGroup>
		</div>
	);
}
