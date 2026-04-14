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

import type { SortOrder, RowLoadingStatus } from "@com.mgmtp.a12.widgets/widgets-core";
import { getDataByKey, Range } from "@com.mgmtp.a12.widgets/widgets-core";

import { createUserCard, contextualCard, createTransaction } from "../../helpers/faker.js";
import type { ContextualCard, Transaction } from "../../helpers/definitions.js";

export namespace Utils {
	export interface Vehicle {
		vehicle: string;
		manufacturer: string;
		model: string;
		type: string;
		fuel: string;
		color: string;
	}
	export type CompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number;

	export function generateVehicleData(rowCount: number): Vehicle[] {
		return Array.from(new Range(rowCount)).map((index) => {
			Faker.seed(index);

			return {
				vehicle: Faker.vehicle.vehicle(),
				manufacturer: Faker.vehicle.manufacturer(),
				model: Faker.vehicle.model(),
				type: Faker.vehicle.type(),
				fuel: Faker.vehicle.fuel(),
				color: Faker.vehicle.color()
			};
		});
	}

	export function generateUserCardData(rowCount: number) {
		return Array.from(new Range(rowCount)).map((index) => {
			Faker.seed(index);

			return createUserCard();
		});
	}

	export function generateContextualCardData(rowCount: number): ContextualCard[] {
		return Array.from(new Range(rowCount)).map((index) => {
			Faker.seed(index);

			return contextualCard();
		});
	}

	export function generateTransactionData(rowCount: number): Transaction[] {
		return Array.from(new Range(rowCount)).map((index) => {
			Faker.seed(index);

			return createTransaction();
		});
	}

	export function getDefaultComparator<RowType>(
		dataKey: string | number,
		order?: SortOrder
	): CompareFn<RowType> | undefined {
		if (order == undefined) {
			return undefined;
		} else {
			const direction = order === "asc" ? 1 : -1;

			return (r1, r2) => {
				const r1Value = getDataByKey(r1, dataKey) ?? 0;
				const r2Value = getDataByKey(r2, dataKey) ?? 0;

				return r1Value < r2Value ? -direction : r1Value > r2Value ? direction : 0;
			};
		}
	}

	export function updateRowLoadingStatusMap(
		map: Record<number, RowLoadingStatus>,
		range: { startIndex: number; stopIndex: number },
		status: RowLoadingStatus
	): Record<number, RowLoadingStatus> {
		const newMap = { ...map };

		for (let i = range.startIndex; i <= range.stopIndex; i++) {
			newMap[i] = status;
		}

		return newMap;
	}
}
