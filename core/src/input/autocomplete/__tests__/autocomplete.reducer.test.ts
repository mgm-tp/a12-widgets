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

import { describe, expect, test } from "vitest";

import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import { autocompleteReducer, createInitialState, type AutocompleteState } from "../main/autocomplete.reducer.js";

const item = (label: string): DropDownItem => ({ label, id: label });

function makeState(overrides: Partial<AutocompleteState> = {}): AutocompleteState {
	return {
		...createInitialState({ inputText: "", showPortal: false, items: [] }),
		...overrides
	};
}

describe("autocompleteReducer", () => {
	test("createInitialState seeds from the provided value", () => {
		const state = createInitialState({
			inputText: "Berlin",
			showPortal: true,
			items: [item("Berlin")],
			initialItem: item("Berlin")
		});

		expect(state.inputText).toBe("Berlin");
		expect(state.searchText).toBe("Berlin");
		expect(state.selectedItem).toEqual(item("Berlin"));
		expect(state.totalItems).toBe(1);
	});

	test("SELECT_ITEM commits the item and closes the popup", () => {
		const next = autocompleteReducer(makeState({ showPortal: true }), { type: "SELECT_ITEM", item: item("Paris") });

		expect(next.showPortal).toBe(false);
		expect(next.inputText).toBe("Paris");
		expect(next.selectedItem).toEqual(item("Paris"));
		expect(next.preselectedItem).toEqual(item("Paris"));
	});

	test("CLEAR resets text and selection", () => {
		const next = autocompleteReducer(
			makeState({ inputText: "Paris", selectedItem: item("Paris"), preselectedItem: item("Paris") }),
			{ type: "CLEAR" }
		);

		expect(next.inputText).toBe("");
		expect(next.searchText).toBe("");
		expect(next.selectedItem).toBeUndefined();
		expect(next.preselectedItem).toBeUndefined();
	});

	test("INPUT_ASYNC opens the popup and mirrors the typed value", () => {
		const next = autocompleteReducer(makeState(), { type: "INPUT_ASYNC", value: "Lon" });

		expect(next.showPortal).toBe(true);
		expect(next.inputText).toBe("Lon");
		expect(next.searchText).toBe("Lon");
	});

	test("PRESELECT_ITEM keeps the typed text when keepInputText is set (links mode)", () => {
		const withKeep = autocompleteReducer(makeState({ inputText: "Lo" }), {
			type: "PRESELECT_ITEM",
			item: item("London"),
			keepInputText: true
		});
		expect(withKeep.inputText).toBe("Lo");
		expect(withKeep.preselectedItem).toEqual(item("London"));

		const withoutKeep = autocompleteReducer(makeState({ inputText: "Lo" }), {
			type: "PRESELECT_ITEM",
			item: item("London"),
			keepInputText: false
		});
		expect(withoutKeep.inputText).toBe("London");
	});

	test("DROPDOWN_CLOSE applies the resolved text and selection", () => {
		const next = autocompleteReducer(makeState({ showPortal: true, inputText: "Ber" }), {
			type: "DROPDOWN_CLOSE",
			inputText: "Berlin",
			searchText: "Berlin",
			selectedItem: item("Berlin"),
			preselectedItem: item("Berlin")
		});

		expect(next.showPortal).toBe(false);
		expect(next.inputText).toBe("Berlin");
		expect(next.selectedItem).toEqual(item("Berlin"));
	});

	test("SYNC_VALUE mirrors an externally controlled value", () => {
		const next = autocompleteReducer(makeState({ inputText: "old" }), {
			type: "SYNC_VALUE",
			inputText: "New York",
			item: item("New York")
		});

		expect(next.inputText).toBe("New York");
		expect(next.searchText).toBe("New York");
		expect(next.selectedItem).toEqual(item("New York"));
		expect(next.preselectedItem).toEqual(item("New York"));
	});

	test("RESET_OPTION restores the input to the committed selection", () => {
		const next = autocompleteReducer(makeState({ inputText: "typing", selectedItem: item("Madrid") }), {
			type: "RESET_OPTION"
		});

		expect(next.showPortal).toBe(false);
		expect(next.inputText).toBe("Madrid");
		expect(next.preselectedItem).toEqual(item("Madrid"));
	});
});
