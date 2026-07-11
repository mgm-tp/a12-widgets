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

import { describe, test, expect } from "vitest";

import { DataRoles, initialize } from "../main/data-roles.js";

function flattenDataRoles(obj: any, path: string[] = []): Record<string, string> {
	let result: Record<string, string> = {};

	Object.keys(obj).forEach((key) => {
		const currentPath = [...path, key];
		const value = obj[key];
		result[currentPath.join(".")] = String(value);

		if (typeof value === "object") {
			result = { ...result, ...flattenDataRoles(value, currentPath) };
		}
	});

	return result;
}

describe("DataRoles", () => {
	test("should recursively initialize nested objects", () => {
		const proxy: any = initialize({
			Table: {
				Header: { Row: { SegmentLeft: "-left" } },
				Column: { ResizeHandler: "", RightResizeHandler: "", LeftResizeHandler: "" }
			}
		});
		expect(proxy.Table.toString()).toBe("table");
		expect(proxy.Table.Header.Row.SegmentLeft).toBe("table-header-row--left");
		expect(proxy.Table.Column.LeftResizeHandler).toBe("table-column-left-resize-handler");
	});

	test("should throw an error for unexpected types", () => {
		const invalidObj = { Button: 42 };
		const proxy: any = initialize(invalidObj);

		expect(() => proxy.Button).toThrow("Unexpected type");
	});

	test("DataRoles Snapshots", () => {
		expect(flattenDataRoles(DataRoles)).toMatchSnapshot();
	});

	test("should return undefined for `suggest` on a subtree proxy", () => {
		const proxy: any = initialize({
			MasterDetail: { Layout: { Pane: { Content: "" } } }
		});

		const pane = proxy.MasterDetail.Layout.Pane;

		expect(pane.Content).toBe("master-detail-layout-pane-content");
		expect(pane.suggest).toBeUndefined();
	});

	test("subtree proxies stringify to their kebab-cased path", () => {
		const proxy: any = initialize({
			MasterDetail: { Layout: { Pane: { Content: "" } } }
		});

		const pane = proxy.MasterDetail.Layout.Pane;

		expect(`${pane}`).toBe("master-detail-layout-pane");
		expect(String(pane)).toBe("master-detail-layout-pane");
		expect(pane.toString()).toBe("master-detail-layout-pane");
	});
});
