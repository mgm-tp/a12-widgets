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

import { loremIpsum } from "lorem-ipsum";
import type { ReactElement } from "react";

import { Comment, Tag, TagGroup, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { fixedRandomNumber } from "../../../helpers/utils.js";

import { getComments } from "../shared-data.js";

const comment = getComments(1)[0];
const longText = loremIpsum({ units: "sentences", count: 3, random: fixedRandomNumber() });

export function CommentTag(): ReactElement {
	return (
		<Comment
			className="-u-background-white"
			commentMeta={comment.commentMeta}
			commentTags={
				<TagGroup>
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
					<Tag>{longText}</Tag>
				</TagGroup>
			}
		>
			{comment.children}
		</Comment>
	);
}
