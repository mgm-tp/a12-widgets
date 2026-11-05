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

import { renderHook } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";

import { defaultTheme } from "../../../theme/default/index.js";
import { useMasterDetailAnimationConfig } from "../main/master-detail.hook.internal.js";

const wrapper = ({ children }: { children: ReactNode }): ReactElement => (
	<ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
);

describe("useMasterDetailAnimationConfig", () => {
	it("returns identical variant state names for resizable and non-resizable non-small views", () => {
		const { result: resizable } = renderHook(
			() =>
				useMasterDetailAnimationConfig({
					numOfColumns: 4,
					isResizable: true
				}),
			{ wrapper }
		);

		const { result: nonResizable } = renderHook(
			() =>
				useMasterDetailAnimationConfig({
					numOfColumns: 4,
					isResizable: false
				}),
			{ wrapper }
		);

		expect(Object.keys(resizable.current.paneVariants).sort()).toEqual(
			Object.keys(nonResizable.current.paneVariants).sort()
		);
		expect(resizable.current.MDAnimationStates).toEqual(nonResizable.current.MDAnimationStates);
	});

	it("non-resizable visible variant animates flexGrow to numOfColumns", () => {
		const { result } = renderHook(
			() =>
				useMasterDetailAnimationConfig({
					numOfColumns: 6,
					isResizable: false
				}),
			{ wrapper }
		);

		const visible = result.current.paneVariants.visible as Record<string, unknown>;
		expect(visible.flexGrow).toBe(6);
		expect(visible.scaleX).toBe(1);
		expect(visible.opacity).toBe(1);
	});

	it("resizable hidden and exit variants do not animate width", () => {
		const { result } = renderHook(
			() =>
				useMasterDetailAnimationConfig({
					numOfColumns: 4,
					isResizable: true
				}),
			{ wrapper }
		);

		const hidden = result.current.paneVariants.hidden as Record<string, unknown>;
		const exit = result.current.paneVariants.exit as Record<string, unknown>;
		expect("width" in hidden).toBe(false);
		expect("width" in exit).toBe(false);
	});

	it("single-pane LTR: variants do not set order (order is managed via inline style)", () => {
		const { result } = renderHook(
			() =>
				useMasterDetailAnimationConfig({
					numOfColumns: 12,
					isSinglePane: true
				}),
			{ wrapper }
		);

		const hidden = result.current.paneVariants.hidden as Record<string, unknown>;
		const visible = result.current.paneVariants.visible as Record<string, unknown>;
		expect("order" in hidden).toBe(false);
		expect("transitionEnd" in visible).toBe(false);
	});

	it("single-pane RTL: variants do not set order (order is managed via inline style)", () => {
		const { result } = renderHook(
			() =>
				useMasterDetailAnimationConfig({
					numOfColumns: 12,
					isSinglePane: true
				}),
			{ wrapper }
		);

		const hidden = result.current.paneVariants.hidden as Record<string, unknown>;
		const visible = result.current.paneVariants.visible as Record<string, unknown>;
		expect("order" in hidden).toBe(false);
		expect("transitionEnd" in visible).toBe(false);
	});

	it("multi-pane: hidden and visible do not set order", () => {
		const { result } = renderHook(
			() =>
				useMasterDetailAnimationConfig({
					numOfColumns: 4,
					isSinglePane: false
				}),
			{ wrapper }
		);

		const hidden = result.current.paneVariants.hidden as Record<string, unknown>;
		const visible = result.current.paneVariants.visible as Record<string, unknown>;
		expect("order" in hidden).toBe(false);
		expect("transitionEnd" in visible).toBe(false);
	});
});
