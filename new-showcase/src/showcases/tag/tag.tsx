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

import { Tag, TagGroup, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { fixedRandomNumber } from "../../helpers/utils.js";

const shortText = "Tag";
const reallyLongText =
	"Tag with really long text. " +
	loremIpsum({
		count: 25,
		units: "words",
		random: fixedRandomNumber()
	});

export function DefaultTagShowcase() {
	return (
		<TagGroup>
			<Tag>{shortText}</Tag>
			<Tag>
				<a href={window.location.href}>Tag linked with a long link</a>
			</Tag>
			<Tag>{reallyLongText}</Tag>
			<Tag>
				<div className="-sc-color-error">Tag with a div</div>
			</Tag>
			<Tag style={{ gap: "2px" }}>
				Tag with an Icon <Icon style={{ fontSize: "0.875rem" }}>delete</Icon>
			</Tag>
		</TagGroup>
	);
}
