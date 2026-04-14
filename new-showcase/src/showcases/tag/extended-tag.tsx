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

import { Icon, Tag, TagGroup } from "@com.mgmtp.a12.widgets/widgets-core";

export function ExtendedTagShowcase(): ReactElement {
	return (
		<TagGroup>
			<Tag icon={<Icon>touch_app</Icon>}>Touch</Tag>
			<Tag icon={<Icon>keyboard</Icon>}>
				Steam Punk Gaming Mechanical Keyboard Round Retro Keycap Backlit Wired Keyboards
			</Tag>
			<Tag icon={<Icon>mouse</Icon>}>Mouse</Tag>
			<Tag icon={<Icon>phone_android</Icon>} color="#2e1561">
				Android phone
			</Tag>
			<Tag color="#2e1561">BlackBerry phone</Tag>
			<Tag icon={<Icon>phone_iphone</Icon>} color="#2e1561">
				iOS phone
			</Tag>
			<Tag color="#2e1561">Windows phone</Tag>
			<Tag color="#d9a518">Linux desktop</Tag>
			<Tag icon={<Icon>desktop_mac</Icon>} color="#d9a518">
				macOS desktop
			</Tag>
			<Tag icon={<Icon>desktop_windows</Icon>} color="#d9a518">
				Windows desktop
			</Tag>
		</TagGroup>
	);
}
