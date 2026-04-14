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

import type { Card, UserCard, ContextualCard, Transaction } from "./definitions.js";

export function createCard(): Card {
	return {
		name: Faker.person.fullName(),
		username: Faker.internet.username(),
		email: Faker.internet.email(),
		address: {
			streetA: Faker.location.street(),
			streetB: Faker.location.street(),
			streetC: Faker.location.street(),
			streetD: Faker.location.street(),
			city: Faker.location.city(),
			state: Faker.location.state(),
			county: Faker.location.county(),
			zipcode: Faker.location.zipCode(),
			geo: {
				lat: Faker.location.latitude(),
				lng: Faker.location.longitude()
			}
		},
		phone: Faker.phone.number(),
		website: Faker.internet.url(),
		company: {
			name: Faker.company.name(),
			catchPhrase: Faker.company.catchPhrase(),
			bs: Faker.company.buzzPhrase()
		},
		posts: [
			{
				words: Faker.lorem.words(),
				sentence: Faker.lorem.sentence(),
				sentences: Faker.lorem.sentences(),
				paragraph: Faker.lorem.paragraph()
			},
			{
				words: Faker.lorem.words(),
				sentence: Faker.lorem.sentence(),
				sentences: Faker.lorem.sentences(),
				paragraph: Faker.lorem.paragraph()
			},
			{
				words: Faker.lorem.words(),
				sentence: Faker.lorem.sentence(),
				sentences: Faker.lorem.sentences(),
				paragraph: Faker.lorem.paragraph()
			}
		],

		accountHistory: [Faker.date.anytime().toDateString()]
	};
}

export function createUserCard(): UserCard {
	return {
		name: Faker.person.fullName(),
		username: Faker.internet.username(),
		email: Faker.internet.email(),
		address: {
			street: Faker.location.street(),
			suite: Faker.location.buildingNumber(),
			city: Faker.location.city(),
			state: Faker.location.state(),
			zipcode: Faker.location.zipCode(),
			geo: {
				lat: Faker.location.latitude(),
				lng: Faker.location.longitude()
			}
		},
		phone: Faker.phone.number(),
		website: Faker.internet.url(),
		company: {
			name: Faker.company.name(),
			catchPhrase: Faker.company.catchPhrase(),
			bs: Faker.company.buzzPhrase()
		}
	};
}

export function contextualCard(): ContextualCard {
	return {
		name: Faker.person.fullName(),
		username: Faker.internet.username(),
		avatar: Faker.image.avatar(),
		email: Faker.internet.email(),
		dob: Faker.date.birthdate().toDateString(),
		phone: Faker.phone.number(),
		address: {
			street: Faker.location.street(),
			suite: Faker.location.buildingNumber(),
			city: Faker.location.city(),
			state: Faker.location.state(),
			zipcode: Faker.location.zipCode(),
			geo: {
				lat: Faker.location.latitude(),
				lng: Faker.location.longitude()
			}
		},
		website: Faker.internet.url(),
		company: {
			name: Faker.company.name(),
			catchPhrase: Faker.company.catchPhrase(),
			bs: Faker.company.buzzPhrase()
		}
	};
}

export function createTransaction(): Transaction {
	return {
		amount: Faker.finance.amount(),
		date: Faker.date.recent({ days: 10 }).toDateString(),
		business: Faker.company.catchPhrase(),
		name: Faker.finance.accountName(),
		type: Faker.finance.transactionType(),
		account: Faker.finance.accountNumber()
	};
}
