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

/**
 * The Autocomplete state machine. The reducer is pure: it never touches the DOM, focus, or
 * consumer callbacks — the {@link useAutocomplete} hook performs those side effects after
 * dispatching. Every field below corresponds to a piece of UI state that affects rendering.
 * @module
 */

import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import { getDropDownItemsLength } from "../../../dropdown/main/template/dropdown.utils.js";

export interface AutocompleteState {
	/** Text rendered in the field (may include the highlighted inline-completion tail). */
	inputText: string;

	/** Text used for filtering. Diverges from {@link inputText} while the tail is highlighted. */
	searchText: string;

	/** Measured width of the input wrapper, forwarded to the dropdown so it aligns. */
	inputWidth: number;

	/** Whether the dropdown popup is open. */
	showPortal: boolean;

	/** When true the full (unfiltered) list is shown regardless of {@link searchText}. */
	showFullList?: boolean;

	/** The currently highlighted option (drives `aria-activedescendant`). */
	preselectedItem?: DropDownItem;

	/** The committed selection. */
	selectedItem?: DropDownItem;

	/** Normalized items currently backing the list. */
	items: DropDownItem[];

	/** Count of top-level items, used for the hint total. */
	totalItems: number;

	/** Highlighted link index when navigating the `links` region. */
	preselectedLinkIndex?: number;
}

export type AutocompleteAction =
	| { type: "PORTAL_VISIBILITY"; isVisible: boolean }
	| { type: "PROCESS_ON_CLOSED" }
	| {
			type: "FOCUS_OPEN";
			inputText: string;
			preselectedItem?: DropDownItem;
	  }
	| { type: "FOCUS_SHOW_FULL_LIST" }
	| { type: "SHOW_DROPDOWN" }
	| { type: "TOGGLE_PORTAL"; showPortal: boolean }
	| { type: "SELECT_ITEM"; item: DropDownItem }
	| { type: "PRESELECT_ITEM"; item?: DropDownItem; keepInputText: boolean }
	| { type: "PRESELECT_LINK"; index?: number }
	| { type: "DELETE_KEY"; inputText: string }
	| {
			type: "ENTER_COMMIT";
			inputText: string;
			selectedItem?: DropDownItem;
			preselectedItem?: DropDownItem;
	  }
	| {
			type: "DROPDOWN_CLOSE";
			inputText: string;
			searchText: string;
			selectedItem?: DropDownItem;
			preselectedItem?: DropDownItem;
	  }
	| {
			type: "RESET_OPTION";
	  }
	| { type: "CLEAR" }
	| { type: "INPUT_ASYNC"; value: string }
	| {
			type: "INPUT_LOCAL";
			searchText: string;
			showFullList: boolean;
			preselectedItem?: DropDownItem;
			showPortal: boolean;
	  }
	| { type: "SET_INPUT_WIDTH"; width: number }
	| {
			type: "SYNC_VALUE";
			inputText: string;
			item?: DropDownItem;
	  }
	| {
			type: "SYNC_ITEMS";
			items: DropDownItem[];
			totalItems: number;
	  }
	| { type: "HIDE_PORTAL" };

export function createInitialState(args: {
	inputText: string;
	showPortal: boolean;
	items: DropDownItem[];
	initialItem?: DropDownItem;
}): AutocompleteState {
	return {
		inputText: args.inputText,
		searchText: args.inputText,
		showPortal: args.showPortal,
		inputWidth: 0,
		items: args.items,
		// The options themselves, as `count` counts them: a grouped list would otherwise be described
		// as "4 of 2 options shown", because its groups are what `items` holds.
		totalItems: getDropDownItemsLength(args.items),
		preselectedItem: args.initialItem,
		selectedItem: args.initialItem
	};
}

// eslint-disable-next-line complexity -- exhaustive transition table; each case is a single assignment
export function autocompleteReducer(state: AutocompleteState, action: AutocompleteAction): AutocompleteState {
	switch (action.type) {
		case "PORTAL_VISIBILITY":
			return { ...state, showPortal: action.isVisible };

		case "PROCESS_ON_CLOSED":
			return {
				...state,
				showPortal: false,
				preselectedLinkIndex: undefined
			};

		case "FOCUS_OPEN":
			return {
				...state,
				showPortal: true,
				showFullList: true,
				inputText: action.inputText,
				preselectedItem: action.preselectedItem
			};

		case "FOCUS_SHOW_FULL_LIST":
			return { ...state, showFullList: true };

		case "SHOW_DROPDOWN":
			return { ...state, showPortal: true, showFullList: true };

		case "TOGGLE_PORTAL":
			return { ...state, showPortal: action.showPortal };

		case "SELECT_ITEM":
			return {
				...state,
				showPortal: false,
				inputText: action.item.label,
				preselectedItem: action.item,
				selectedItem: action.item
			};

		case "PRESELECT_ITEM":
			return action.keepInputText
				? { ...state, preselectedItem: action.item }
				: { ...state, preselectedItem: action.item, inputText: action.item?.label || "" };

		case "PRESELECT_LINK":
			return { ...state, preselectedLinkIndex: action.index };

		case "DELETE_KEY":
			return { ...state, preselectedItem: undefined, inputText: action.inputText, showPortal: true };

		case "ENTER_COMMIT":
			return {
				...state,
				showPortal: false,
				inputText: action.inputText,
				selectedItem: action.selectedItem,
				preselectedItem: action.preselectedItem ?? state.preselectedItem
			};

		case "DROPDOWN_CLOSE":
			return {
				...state,
				showPortal: false,
				showFullList: true,
				inputText: action.inputText,
				searchText: action.searchText,
				selectedItem: action.selectedItem,
				preselectedItem: action.preselectedItem
			};

		case "RESET_OPTION":
			return {
				...state,
				showPortal: false,
				inputText: state.selectedItem?.label ?? "",
				searchText: state.selectedItem?.label ?? "",
				preselectedItem: state.selectedItem,
				showFullList: true
			};

		case "CLEAR":
			return {
				...state,
				inputText: "",
				searchText: "",
				preselectedItem: undefined,
				selectedItem: undefined,
				showFullList: true
			};

		case "INPUT_ASYNC":
			return {
				...state,
				searchText: action.value,
				inputText: action.value,
				showPortal: true
			};

		case "INPUT_LOCAL":
			return {
				...state,
				searchText: action.searchText,
				showFullList: action.showFullList,
				inputText: action.searchText,
				preselectedItem: action.preselectedItem,
				showPortal: action.showPortal
			};

		case "SET_INPUT_WIDTH":
			return { ...state, inputWidth: action.width };

		case "SYNC_VALUE":
			return {
				...state,
				inputText: action.inputText,
				searchText: action.inputText,
				preselectedItem: action.item,
				selectedItem: action.item
			};

		case "SYNC_ITEMS":
			return { ...state, items: action.items, totalItems: action.totalItems };

		case "HIDE_PORTAL":
			return { ...state, showPortal: false };

		default:
			return state;
	}
}
