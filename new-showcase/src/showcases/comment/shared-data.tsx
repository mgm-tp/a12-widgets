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

import { faker as Faker } from "@faker-js/faker/locale/en";

import type { CommentMeta, CommentProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Icon, Range } from "@com.mgmtp.a12.widgets/widgets-core";

import { createCard } from "../../helpers/faker.js";
import type { Card } from "../../helpers/definitions.js";

export const comments = [1, 2, 3, 4].map((i) => {
	const card = createCard();

	return {
		commentMeta: {
			avatar: <Icon>account_circle</Icon>,
			author: card.name,
			action: "wrote",
			date: card.accountHistory[0]
		},
		children: card.posts[1].paragraph,
		key: i
	};
});

export function getComments(count: number): CommentProps[] {
	return Array.from(new Range(count)).map((i) => {
		const card = createCard();
		const post = card.posts[i <= 2 ? i : i % 2];

		return {
			commentMeta: getCommentMeta(card, undefined, i),
			children: i % 3 === 0 ? post.paragraph : post.sentences,
			key: i
		};
	});
}

export function getCommentMeta(initCard?: Card, action?: string, index?: number): CommentMeta {
	const card = { ...createCard(), ...initCard };
	Faker.seed(index ?? 2);

	return {
		avatar: <Icon>account_circle</Icon>,
		author: Faker.person.fullName(),
		action: action || "wrote",
		date: card.accountHistory[0]
	};
}
