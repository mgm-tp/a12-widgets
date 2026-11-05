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
 * Headless core of the Autocomplete widget. Owns the state machine, refs and side effects,
 * exposing a flat set of handlers, refs and derived render data for the (presentational) view.
 * Device-agnostic: the same popup dropdown is used on desktop and touch.
 * @module
 */

import type { HTMLProps, InputEvent, KeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useLayoutEffect, useMemo, useReducer, useRef } from "react";
import { Key } from "ts-key-enum";

import { provider as DeviceDetector } from "../../../common/main/device-detector.js";
import type { ResizePayload } from "../../../common/main/resize-observer/resize-observer.api.js";
import {
	getAllFocusableElements,
	hasGotFocus,
	joinClassNames,
	Key as CustomKey,
	StringUtils
} from "../../../common/main/utils.js";
import { isEmptyString } from "../../../common/main/utils/string-utils.js";
import type { DropDownItem, DropdownNavigationHandle } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import { getDropDownItemsLength } from "../../../dropdown/main/template/dropdown.utils.js";
import { useDropdownNavigation } from "../../../dropdown/main/template/use-dropdown-navigation.js";

import type { AutocompleteProps } from "./autocomplete.api.js";
import { autocompleteReducer, createInitialState } from "./autocomplete.reducer.js";
import {
	filterDropDownItems,
	getNewSelectedItem,
	getSelectedItem,
	isItemEmpty,
	toDropDownItem,
	toDropDownItems
} from "./autocomplete.utils.js";

/**
 * How long the page keeps being put back where it stood after the dialog closes. It covers the
 * resize the on-screen keyboard causes as it hides, which arrives shortly after the dialog is gone.
 */
const KEYBOARD_HIDE_TIMEOUT = 500;

export interface UseAutocomplete {
	// derived render data
	inputValue: string;
	matchedItems: DropDownItem[];
	selectedMatchedItem: DropDownItem | undefined;
	preselectedLinkId: string | undefined;
	hint: string | undefined;

	/** Whether the list itself has something to show — options, a hint or links. Drives the ARIA. */
	shouldShowDropDown: boolean;

	/**
	 * Whether the popup is to be mounted at all, which also covers the loading overlay: an async
	 * search in flight has no options to list yet, but still shows its progress indicator.
	 */
	shouldShowPopup: boolean;
	showPortal: boolean;
	inputWidth: number;
	liveMessage: string;
	inputAriaProps: HTMLProps<HTMLInputElement>;

	/**
	 * Attached presentation: ARIA for the element wrapping the input and its suffixes, which is what
	 * places the portalled option list in the accessibility tree.
	 */
	inputWrapperAriaProps: HTMLProps<HTMLDivElement>;
	dropdownAriaLabelledby: string | undefined;

	/** True when the options are presented in a fullscreen dialog rather than an attached dropdown. */
	isModalMode: boolean;

	/** Dialog presentation: the committed label shown by the trigger while the dialog holds the draft. */
	committedValue: string;

	/** Dialog presentation: ARIA for the trigger, which is a combobox that opens a dialog. */
	triggerAriaProps: HTMLProps<HTMLInputElement>;
	dialogId: string | undefined;
	// refs / instances
	inputWrapperElement: HTMLElement | null;
	inputLabelElement: HTMLElement | null;
	helperTextElement: HTMLElement | null;

	/** The active option of the dropdown, to be handed to it as its `navigation` prop. */
	navigation: DropdownNavigationHandle;
	// ref setters
	setInputRef(ref: HTMLInputElement | null): void;
	setWrapperRef(ref: HTMLDivElement | null): void;
	setInputLabelRef(ref: HTMLLabelElement | null): void;
	setHelperTextRef(ref: HTMLElement | null): void;
	setInputWrapperRef(ref: HTMLElement | null): void;
	setClearButtonRef(ref: HTMLElement | null): void;
	setUpdateElementPositionHandler(handler: () => void): void;
	setTriggerRef(ref: HTMLElement | null): void;
	wrapperRef: React.RefObject<HTMLDivElement | null>;
	// handlers
	handleInputChange(event: InputEvent<HTMLInputElement>): void;
	handleInputKeyDown(event: KeyboardEvent<HTMLElement>): void;
	handleWrapperKeyDown(event: KeyboardEvent<HTMLElement>): void;
	handleInputFocus(): void;
	handleInputBlur(): void;
	handleInputClick(): void;
	handleInputWrapperClick(): void;
	handleDropdownIconClick(): void;
	handleClearButtonClick(): void;
	handleClearButtonMouseDown(event: ReactMouseEvent<HTMLElement>): void;
	handleHelperElementFocus(): void;
	handleSelectedItemChange(item: DropDownItem): void;
	handlePreselectedItemChange(item: DropDownItem): void;
	handlePreselectedLinkChange(index: number | undefined): void;
	handlePortalVisibilityChange(isVisible: boolean): void;
	handleClickOutside(): void;
	updateInputWidth(params: ResizePayload): void;
	handleTriggerClick(): void;
	handleTriggerFocus(): void;
	handleTriggerKeyDown(event: KeyboardEvent<HTMLElement>): void;
	handleDialogClose(): void;
	handleDialogSelectedItemChange(item: DropDownItem): void;
	handleListScroll(): void;
}

export function useAutocomplete(props: AutocompleteProps): UseAutocomplete {
	const { onSearch, caseSensitive, links, hintTemplate, id } = props;

	// --- initial state (constructor equivalent) ---
	const initial = useRef<ReturnType<typeof buildInitialState> | null>(null);

	if (initial.current === null) {
		initial.current = buildInitialState(props);
	}

	const [state, dispatch] = useReducer(autocompleteReducer, initial.current.state);

	// --- mutable refs (former instance fields) ---
	const inputElement = useRef<HTMLInputElement | null>(null);
	const inputLabelElement = useRef<HTMLElement | null>(null);
	const helperTextElement = useRef<HTMLElement | null>(null);
	const inputWrapperElement = useRef<HTMLElement | null>(null);
	const clearButtonRef = useRef<HTMLElement | null>(null);
	const updateElementPosition = useRef<(() => void) | undefined>(undefined);
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const previousSelectedItem = useRef<DropDownItem | undefined>(initial.current.initialItem);
	const isDeletePressed = useRef(false);
	const outsideClick = useRef(false);
	const preventShowingDropdownAfterSelectItem = useRef(false);
	const shouldIgnoreFocusEvent = useRef(false);

	// --- dialog presentation ---
	const triggerElement = useRef<HTMLElement | null>(null);
	// Focus returns to the trigger when the dialog closes, which must not re-open it right away.
	const suppressTriggerOpen = useRef(false);
	// The on-screen keyboard appearing resizes the viewport, which fires a scroll event. That first
	// scroll is not the user scrolling the list, so it must not dismiss the keyboard again.
	const viewportResized = useRef(false);
	// Where the page stood when the dialog opened. Focusing the dialog's field brings up the on-screen
	// keyboard, and a phone browser scrolls the document to keep that field in the shrunken viewport —
	// which leaves the page somewhere else entirely once the dialog is gone.
	const pageScroll = useRef<{ x: number; y: number } | undefined>(undefined);
	const cancelScrollRestore = useRef<(() => void) | undefined>(undefined);

	// --- post-commit effect queue (former setState callbacks) ---
	const effectQueue = useRef<Array<() => void>>([]);
	const enqueue = useCallback((fn: () => void) => effectQueue.current.push(fn), []);

	// keep a live handle on latest props/state for effects and stable callbacks
	const propsRef = useRef(props);
	propsRef.current = props;
	const stateRef = useRef(state);
	stateRef.current = state;

	// --- derived render values ---
	const matchedItems = useMemo(
		() =>
			onSearch || state.showFullList ? state.items : filterDropDownItems(state.items, state.searchText, caseSensitive),
		[onSearch, state.showFullList, state.items, state.searchText, caseSensitive]
	);
	const selectedMatchedItem = useMemo(
		() => getSelectedItem(state.preselectedItem, matchedItems),
		[state.preselectedItem, matchedItems]
	);

	// The active option lives here rather than inside the rendered list, so that key handling reaches
	// it without a reference to the list itself.
	const navigation = useDropdownNavigation({ items: matchedItems });

	const hint = hintTemplate
		? StringUtils.format(hintTemplate, { count: getDropDownItemsLength(matchedItems), total: state.totalItems })
		: undefined;

	const shouldShowDropDown = state.showPortal && !!(matchedItems.length > 0 || hint || links);
	// The popup also carries the loading overlay, so an async search that has not produced its items
	// yet still has something to show — without this the field looks unresponsive while it runs.
	const shouldShowPopup = shouldShowDropDown || (state.showPortal && !!props.loading);
	const preselectedLinkId =
		state.preselectedLinkIndex !== undefined && id ? `${id}-dropdown--link-${state.preselectedLinkIndex}` : undefined;

	const inputValue = getInputValueToDisplay({
		props,
		state,
		matchedItems,
		selectedMatchedItem,
		previousSelectedItem: previousSelectedItem.current
	});

	// On a phone an attached dropdown competes with the on-screen keyboard, so the options are
	// presented in a fullscreen dialog unless the caller pins the presentation explicitly.
	const isModalMode = props.mobileModal ?? DeviceDetector.isPhone();
	const isModalModeRef = useRef(isModalMode);
	isModalModeRef.current = isModalMode;
	// Scrolling the option list hides the on-screen keyboard, so that more options stay visible — but
	// only where there is one to hide: in the dialog, and on a touch device whose caller pinned the
	// attached presentation instead. On a desktop the same scroll comes from the wheel, and taking the
	// focus off the field there would end keyboard navigation mid-list.
	const dismissesKeyboardOnListScroll = isModalMode || DeviceDetector.hasTouch();
	const dismissesKeyboardOnListScrollRef = useRef(dismissesKeyboardOnListScroll);
	dismissesKeyboardOnListScrollRef.current = dismissesKeyboardOnListScroll;
	// The trigger shows the committed selection; the dialog's own field holds the in-progress draft.
	const committedValue = previousSelectedItem.current?.label ?? "";

	// --- side-effect helpers ---
	const triggerOnValueChange = useCallback((item: DropDownItem): void => {
		const p = propsRef.current;
		const prev = previousSelectedItem.current;
		const isItemSelected = item.value ? item.value === prev?.value : item.label === prev?.label && item.id === prev?.id;

		if (p.onValueChange && p.items && !isItemSelected) {
			const isArrayOfString = Array.isArray(p.items) && p.items.length > 0 && typeof p.items[0] === "string";
			p.onValueChange(isArrayOfString ? item.label : item);
			previousSelectedItem.current = item.label ? item : undefined;
		}
	}, []);

	const saveSelectedItem = useCallback((): void => {
		const p = propsRef.current;
		const s = stateRef.current;
		let newItem: DropDownItem | undefined;

		if (isEmptyString(s.inputText) && !isItemEmpty(s.selectedItem) && !s.preselectedItem) {
			newItem = toDropDownItem("");
		} else {
			const trimmedInputText = s.inputText.trim();

			if (p.allowAddingNewItem && trimmedInputText) {
				newItem = toDropDownItem(s.preselectedItem || trimmedInputText);
			} else if (s.preselectedItem) {
				newItem = toDropDownItem(s.preselectedItem);
			}
		}

		if (newItem) {
			triggerOnValueChange(newItem);
		}
	}, [triggerOnValueChange]);

	const hasLink = useCallback((): boolean => !!propsRef.current.links, []);

	const showDropdown = useCallback((): void => {
		if (!stateRef.current.showPortal) {
			dispatch({ type: "SHOW_DROPDOWN" });
			propsRef.current.onSearch?.("");
		}
	}, []);

	const updateSelectionRange = useCallback(
		(newMatchedItems: DropDownItem[], searchText: string): void => {
			const p = propsRef.current;
			const s = stateRef.current;
			const newSelectedItem = getNewSelectedItem(newMatchedItems, searchText, s.preselectedItem, p.caseSensitive);
			const grew = s.inputText.length <= searchText.length;

			dispatch({
				type: "INPUT_LOCAL",
				searchText,
				showFullList: searchText === "" || !!p.onSearch,
				preselectedItem: newSelectedItem !== undefined && grew ? newSelectedItem : undefined,
				showPortal: p.onSearch ? s.showPortal : true
			});

			enqueue(() => {
				if (
					!isDeletePressed.current &&
					inputElement.current &&
					newSelectedItem !== undefined &&
					grew &&
					searchText.toLowerCase() !== newSelectedItem.label.toLowerCase()
				) {
					inputElement.current.setSelectionRange(searchText.length, newSelectedItem.label.length);
				}
			});
		},
		[enqueue]
	);

	// --- handlers ---
	const handleInputChange = useCallback(
		(event: InputEvent<HTMLInputElement>): void => {
			const value = (event.target as HTMLInputElement).value;
			const p = propsRef.current;

			if (p.onSearch) {
				dispatch({ type: "INPUT_ASYNC", value });
				p.onSearch(value);

				return;
			}

			const newMatchedItems = filterDropDownItems(stateRef.current.items, value, p.caseSensitive);
			updateSelectionRange(newMatchedItems, value);
		},
		[updateSelectionRange]
	);

	const handleDeleteKey = useCallback((event: KeyboardEvent<HTMLElement>): void => {
		const input = inputElement.current;
		let textAfterDelete = input?.value ?? stateRef.current.inputText;

		if (input && input.selectionStart !== null && input.selectionEnd !== null) {
			const selectedLength = input.selectionEnd - input.selectionStart;

			if (selectedLength > 0) {
				event.preventDefault();
			}

			textAfterDelete = input.value.substring(0, input.selectionStart) + input.value.substring(input.selectionEnd);
		}

		dispatch({ type: "DELETE_KEY", inputText: textAfterDelete });
	}, []);

	const handleArrowKey = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			if (!stateRef.current.showPortal) {
				showDropdown();

				return;
			}

			if (!propsRef.current.loading) {
				navigation.handleKeyDown(event);
			}
		},
		[navigation, showDropdown]
	);

	const handleEnterKey = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			const p = propsRef.current;
			const s = stateRef.current;
			const trimmedInputText = s.inputText.trim();

			if (p.loading) {
				return;
			}

			if (hasLink() && (!s.preselectedItem || s.preselectedItem.label === "") && s.showPortal) {
				navigation.handleKeyDown(event);

				return;
			}

			if ((!s.showPortal || !trimmedInputText) && !(s.showPortal && s.preselectedItem?.label)) {
				showDropdown();

				return;
			}

			let selectionText = "";

			if (s.preselectedItem !== undefined || trimmedInputText === "") {
				selectionText = s.preselectedItem?.label || "";
				dispatch({ type: "ENTER_COMMIT", inputText: selectionText, selectedItem: s.preselectedItem });
			} else if (p.allowAddingNewItem && trimmedInputText !== "") {
				selectionText = trimmedInputText;
				const selectedItem = toDropDownItem(trimmedInputText);
				dispatch({ type: "ENTER_COMMIT", inputText: selectionText, selectedItem, preselectedItem: selectedItem });
			}

			if (selectionText) {
				enqueue(() => inputElement.current?.setSelectionRange(selectionText.length, selectionText.length));
			}

			saveSelectedItem();
		},
		[enqueue, hasLink, navigation, saveSelectedItem, showDropdown]
	);

	const handleInputKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			const p = propsRef.current;

			if (p.readonly || p.disabled) {
				return;
			}

			isDeletePressed.current = false;

			switch (event.key) {
				case Key.Backspace:
				case Key.Delete:
					isDeletePressed.current = true;
					handleDeleteKey(event);
					break;
				case Key.ArrowUp:
				case Key.ArrowDown:
					event.preventDefault();
					handleArrowKey(event);
					break;
				case Key.Enter:
					handleEnterKey(event);
					break;
				default:
					return;
			}
		},
		[handleArrowKey, handleDeleteKey, handleEnterKey]
	);

	const handleDropDownClose = useCallback((): void => {
		const p = propsRef.current;
		const s = stateRef.current;
		const { selectedItem, preselectedItem } = s;

		let newInputText = "";
		let newSelectedItem: DropDownItem | undefined;
		let newPreSelectedItem: DropDownItem | undefined;

		if (!isEmptyString(s.inputText)) {
			if (p.allowAddingNewItem) {
				newInputText = s.inputText;
				newSelectedItem = preselectedItem;
				newPreSelectedItem = preselectedItem;
			} else if (hasLink()) {
				newInputText = selectedItem?.label ?? "";
				newSelectedItem = selectedItem;
				newPreSelectedItem = selectedItem;
			} else {
				newInputText = preselectedItem?.label ?? selectedItem?.label ?? "";
				newSelectedItem = preselectedItem ?? selectedItem;
				newPreSelectedItem = preselectedItem ?? selectedItem;
			}
		}

		dispatch({
			type: "DROPDOWN_CLOSE",
			inputText: newInputText,
			searchText: newInputText,
			selectedItem: newSelectedItem,
			preselectedItem: newPreSelectedItem
		});

		if (!hasLink() || isEmptyString(newInputText)) {
			saveSelectedItem();
		}
	}, [hasLink, saveSelectedItem]);

	const processOnClosed = useCallback((): void => {
		dispatch({ type: "PROCESS_ON_CLOSED" });
	}, []);

	const handleWrapperKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			const s = stateRef.current;

			if (s.showPortal && event.key === Key.Escape) {
				event.stopPropagation();
				handleDropDownClose();
			}

			if (hasGotFocus(clearButtonRef.current) && event.key !== Key.Enter && event.key !== Key.Tab) {
				event.preventDefault();

				return;
			}

			if (event.key === Key.Tab && inputWrapperElement.current) {
				const allFocusableElements = Array.from(getAllFocusableElements(inputWrapperElement.current));
				let nextFocusableElement;
				allFocusableElements.forEach((node, index) => {
					if (node === event.target) {
						nextFocusableElement = allFocusableElements[event.shiftKey ? index - 1 : index + 1];

						return;
					}
				});

				if (!nextFocusableElement && allFocusableElements.some((node) => node === event.target)) {
					handleDropDownClose();
					setTimeout(processOnClosed);
				}
			}
		},
		[handleDropDownClose, processOnClosed]
	);

	const handleInputFocus = useCallback((): void => {
		if (shouldIgnoreFocusEvent.current) {
			shouldIgnoreFocusEvent.current = false;

			return;
		}

		const p = propsRef.current;
		const s = stateRef.current;
		const openOnFocus = p.openOnFocus ?? true;

		if (s.showPortal || p.readonly || p.disabled || preventShowingDropdownAfterSelectItem.current || !openOnFocus) {
			preventShowingDropdownAfterSelectItem.current = false;

			if (!openOnFocus) {
				dispatch({ type: "FOCUS_SHOW_FULL_LIST" });
			}

			return;
		}

		dispatch({
			type: "FOCUS_OPEN",
			inputText: previousSelectedItem.current?.label ?? s.inputText.trim(),
			preselectedItem: previousSelectedItem.current
		});
		enqueue(() => propsRef.current.onSearch?.(""));
	}, [enqueue]);

	const handleInputBlur = useCallback((): void => {
		preventShowingDropdownAfterSelectItem.current = false;
	}, []);

	const handleInputWrapperClick = useCallback((): void => {
		const p = propsRef.current;
		const openOnFocus = p.openOnFocus ?? true;

		if (!openOnFocus && !stateRef.current.showPortal) {
			p.onSearch?.(stateRef.current.inputText);
		}

		inputElement.current?.focus();
	}, []);

	const handleInputClick = useCallback((): void => {
		showDropdown();
	}, [showDropdown]);

	const handleDropdownIconClick = useCallback((): void => {
		const p = propsRef.current;

		if (!p.disabled && !p.readonly) {
			const nextShowPortal = !stateRef.current.showPortal;
			dispatch({ type: "TOGGLE_PORTAL", showPortal: nextShowPortal });
			enqueue(() => {
				if (!hasLink() && !nextShowPortal) {
					saveSelectedItem();
				}
			});
		}
	}, [enqueue, hasLink, saveSelectedItem]);

	const handleSelectedItemChange = useCallback(
		(item: DropDownItem): void => {
			preventShowingDropdownAfterSelectItem.current = true;
			dispatch({ type: "SELECT_ITEM", item });
			enqueue(() => {
				inputElement.current?.focus();
				inputElement.current?.setSelectionRange(item?.label.length ?? 0, item?.label.length ?? 0);
			});
			triggerOnValueChange(item);
		},
		[enqueue, triggerOnValueChange]
	);

	const handlePreselectedItemChange = useCallback(
		(preselectedItem: DropDownItem): void => {
			const s = stateRef.current;

			if (hasLink()) {
				if (s.inputText && s.searchText.length === s.inputText.length) {
					const range = s.inputText.length;
					enqueue(() => inputElement.current?.setSelectionRange(range, range));
				}

				dispatch({ type: "PRESELECT_ITEM", item: preselectedItem, keepInputText: true });
			} else {
				dispatch({ type: "PRESELECT_ITEM", item: preselectedItem, keepInputText: false });
			}
		},
		[enqueue, hasLink]
	);

	const handlePreselectedLinkChange = useCallback((index: number | undefined): void => {
		dispatch({ type: "PRESELECT_LINK", index });
	}, []);

	const handleClearButtonClick = useCallback((): void => {
		// setTimeout preserves the ordering the input update relies on for assistive tech.
		setTimeout(() => {
			dispatch({ type: "CLEAR" });

			// Clearing does not move focus to the field, so no focus event opens the list afterwards.
			// Unless the caller pinned `openOnFocus` itself, the cleared field therefore opens the full
			// list on its own — otherwise the user would have to click the field again to pick a
			// replacement value.
			if (!propsRef.current.openOnFocus) {
				dispatch({ type: "TOGGLE_PORTAL", showPortal: true });
			}

			enqueue(() => {
				propsRef.current.onSearch?.("");

				// The dialog stays open with its own field cleared, so focus returns to that field —
				// unless it never left, which is the normal case on a phone: `handleClearButtonMouseDown`
				// keeps it there so that the on-screen keyboard does not close and reopen.
				if (isModalModeRef.current && document.activeElement !== inputElement.current) {
					inputElement.current?.focus({ preventScroll: true });
				}
			});
			triggerOnValueChange(toDropDownItem(""));
		});
	}, [enqueue, triggerOnValueChange]);

	const handleClearButtonMouseDown = useCallback((event: ReactMouseEvent<HTMLElement>): void => {
		// A tap on the clear button would otherwise take focus off the dialog's field, which closes the
		// on-screen keyboard — and reopening it as focus comes back shifts the dialog under the user's
		// finger. Keeping the focus where it is keeps the keyboard up and the dialog still.
		if (isModalModeRef.current) {
			event.preventDefault();
		}
	}, []);

	// NVDA's browse-mode cursor focuses this without a Tab keypress; close the list as if it had.
	const handleHelperElementFocus = useCallback((): void => {
		handleDropDownClose();
	}, [handleDropDownClose]);

	const handlePortalVisibilityChange = useCallback(
		(isVisible: boolean): void => {
			dispatch({ type: "PORTAL_VISIBILITY", isVisible });

			// A popup closed by an outside click is finalized by handleClickOutside, so it is skipped here.
			if (!isVisible && !outsideClick.current) {
				// The popup closed without an outside click (e.g. the input was blurred). If the field
				// was cleared while a selection is still committed, commit the empty value so the closed
				// input reflects the cleared state rather than reverting to the stale selection.
				const s = stateRef.current;

				if (isEmptyString(s.inputText) && !isItemEmpty(s.selectedItem) && !s.preselectedItem) {
					triggerOnValueChange(toDropDownItem(""));
				}

				processOnClosed();
			}

			outsideClick.current = false;
		},
		[processOnClosed, triggerOnValueChange]
	);

	const handleClickOutside = useCallback((): void => {
		outsideClick.current = true;
		handleDropDownClose();
	}, [handleDropDownClose]);

	// --- dialog presentation: trigger and dialog lifecycle ---
	// Opening puts the committed selection into the draft field and highlights it, so the dialog starts
	// from what the field currently shows rather than from a stale in-progress search.
	const openDialog = useCallback((): void => {
		const p = propsRef.current;
		const s = stateRef.current;
		const committedItem = previousSelectedItem.current ?? s.selectedItem;

		p.onSearch?.("");
		dispatch({
			type: "FOCUS_OPEN",
			inputText: committedItem?.label ?? "",
			preselectedItem: committedItem
		});
		pageScroll.current = { x: window.scrollX, y: window.scrollY };
		enqueue(() => {
			const input = inputElement.current;

			if (input) {
				// The dialog covers the viewport, so the field is on screen wherever the page stands —
				// scrolling to it would only move the page behind the dialog.
				input.focus({ preventScroll: true });
				// Put the caret behind the text instead of selecting it, so typing appends by default.
				input.setSelectionRange(input.value.length, input.value.length);
			}
		});
	}, [enqueue]);

	// `initiallyExpanded` opens the dialog from initial state, bypassing `openDialog()` above.
	// Therefore, focus the field and capture the scroll position here instead.
	useLayoutEffect(() => {
		if (isModalMode && state.showPortal) {
			pageScroll.current = { x: window.scrollX, y: window.scrollY };
			inputElement.current?.focus({ preventScroll: true });
		}
		// oxlint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// The page is put back where it stood before the dialog took over the screen. Once right away, and
	// once more on the resize the on-screen keyboard causes as it hides — that hiding happens after the
	// dialog is gone, and the browser scrolls the document again as it goes.
	const restorePageScroll = useCallback((): void => {
		const target = pageScroll.current;

		if (!target) {
			return;
		}

		pageScroll.current = undefined;
		// Cancel any restore session still in flight, or its listener leaks and its timer fires on the wrong one.
		cancelScrollRestore.current?.();

		const scrollBack = (): void => window.scrollTo({ left: target.x, top: target.y, behavior: "instant" });

		scrollBack();
		window.addEventListener("resize", scrollBack, { once: true });

		// Past that, a resize is the user rotating the phone or the browser chrome collapsing, and the
		// page belongs to them again.
		const timer = setTimeout(() => cancelScrollRestore.current?.(), KEYBOARD_HIDE_TIMEOUT);

		cancelScrollRestore.current = (): void => {
			clearTimeout(timer);
			window.removeEventListener("resize", scrollBack);
			cancelScrollRestore.current = undefined;
		};
	}, []);

	// Nothing may still be waiting to scroll a page this widget is no longer part of.
	useLayoutEffect(() => () => cancelScrollRestore.current?.(), []);

	const canOpenDialog = useCallback((): boolean => {
		const p = propsRef.current;

		return !p.readonly && !p.disabled && !stateRef.current.showPortal;
	}, []);

	const handleTriggerClick = useCallback((): void => {
		if (canOpenDialog()) {
			openDialog();
		}
	}, [canOpenDialog, openDialog]);

	const handleTriggerFocus = useCallback((): void => {
		if (suppressTriggerOpen.current) {
			suppressTriggerOpen.current = false;

			return;
		}

		if (shouldIgnoreFocusEvent.current) {
			shouldIgnoreFocusEvent.current = false;

			return;
		}

		if ((propsRef.current.openOnFocus ?? true) && canOpenDialog()) {
			openDialog();
		}
	}, [canOpenDialog, openDialog]);

	const handleTriggerKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			const opensDialog =
				event.key === Key.Enter ||
				event.key === CustomKey.Space ||
				event.key === Key.ArrowDown ||
				event.key === Key.ArrowUp;

			if (opensDialog && canOpenDialog()) {
				event.preventDefault();
				openDialog();
			}
		},
		[canOpenDialog, openDialog]
	);

	const handleDialogClose = useCallback((): void => {
		handleDropDownClose();
		processOnClosed();
	}, [handleDropDownClose, processOnClosed]);

	// The shared handler focuses the field it selected from, which in the dialog is about to unmount —
	// the focus-restoring effect below puts focus back on the trigger instead.
	const handleDialogSelectedItemChange = useCallback(
		(item: DropDownItem): void => {
			dispatch({ type: "SELECT_ITEM", item });
			triggerOnValueChange(item);
		},
		[triggerOnValueChange]
	);

	const handleListScroll = useCallback((): void => {
		if (!dismissesKeyboardOnListScrollRef.current) {
			return;
		}

		if (viewportResized.current) {
			viewportResized.current = false;

			return;
		}

		inputElement.current?.blur();
	}, []);

	const updateInputWidth = useCallback((params: ResizePayload): void => {
		if (inputWrapperElement.current) {
			const width = params.width || 0;

			if (stateRef.current.inputWidth !== width) {
				dispatch({ type: "SET_INPUT_WIDTH", width });
			}
		}
	}, []);

	// --- closeAndResetOption (exposed to consumer via prop) ---
	const closeAndResetOption = useCallback((): void => {
		preventShowingDropdownAfterSelectItem.current = true;
		dispatch({ type: "RESET_OPTION" });
		enqueue(() => inputElement.current?.focus());
	}, [enqueue]);

	// Register the close-and-reset handle with the consumer once, after mount. Invoking the consumer
	// callback here (rather than in the render body) keeps render pure — a StrictMode double-render or
	// a discarded concurrent render must not hand the consumer a handler as a side effect.
	useLayoutEffect(() => {
		propsRef.current.closeAndResetOption?.(() => closeAndResetOption());
	}, [closeAndResetOption]);

	// --- ref setters ---
	const setInputRef = useCallback((ref: HTMLInputElement | null): void => {
		inputElement.current = ref;

		// In the dialog presentation the consumer's `inputRef` gets the trigger instead: it is the field
		// that is always mounted and the one a consumer would focus or measure.
		if (!isModalModeRef.current) {
			propsRef.current.inputRef?.(ref);
		}
	}, []);
	const setWrapperRef = useCallback((ref: HTMLDivElement | null): void => {
		propsRef.current.wrapperRef?.(ref);
		wrapperRef.current = ref;
	}, []);
	const setInputLabelRef = useCallback((ref: HTMLLabelElement | null): void => {
		inputLabelElement.current = ref;
	}, []);
	const setHelperTextRef = useCallback((ref: HTMLElement | null): void => {
		helperTextElement.current = ref;
	}, []);
	const setInputWrapperRef = useCallback((ref: HTMLElement | null): void => {
		inputWrapperElement.current = ref;
	}, []);
	const setClearButtonRef = useCallback((ref: HTMLElement | null): void => {
		clearButtonRef.current = ref;
	}, []);
	const setUpdateElementPositionHandler = useCallback((handler: () => void): void => {
		updateElementPosition.current = handler;
	}, []);
	const setTriggerRef = useCallback((ref: HTMLElement | null): void => {
		triggerElement.current = ref;
		propsRef.current.inputRef?.(ref as HTMLInputElement | null);
	}, []);

	// --- post-commit effect queue drain (former setState callbacks) ---
	useLayoutEffect(() => {
		const queued = effectQueue.current;
		effectQueue.current = [];
		queued.forEach((fn) => fn());
	});

	// --- componentDidUpdate equivalent ---
	const prev = useRef({
		value: props.value,
		items: props.items,
		showPortal: state.showPortal,
		preselectedItem: state.preselectedItem
	});

	// Mirrors the class `componentDidUpdate`: runs after every commit and reacts to prop/state
	// diffs. Each dispatch is guarded by a comparison against `prev.current`, which is updated at
	// the end, so it converges (no dependency array by design).
	// oxlint-disable-next-line react-hooks/exhaustive-deps
	useLayoutEffect(() => {
		const p = propsRef.current;
		const s = stateRef.current;

		updateElementPosition.current?.();

		if (!isSameValue(prev.current.value, p.value)) {
			const newValueItem = p.value ? toDropDownItem(p.value) : undefined;
			previousSelectedItem.current = newValueItem;
			dispatch({ type: "SYNC_VALUE", inputText: newValueItem?.label ?? "", item: newValueItem });
		}

		if (p.items !== prev.current.items && !p.loading) {
			const newItems = toDropDownItems(p.items);
			dispatch({ type: "SYNC_ITEMS", items: newItems, totalItems: getDropDownItemsLength(newItems) });

			if (!isDeletePressed.current && s.inputText && s.showPortal) {
				updateSelectionRange(newItems, s.inputText);
			}
		}

		// With link options: set selection range when navigating to the matched item while searching
		if (
			hasLink() &&
			s.inputText &&
			s.preselectedItem &&
			inputElement.current &&
			s.preselectedItem !== prev.current.preselectedItem &&
			s.inputText !== s.preselectedItem.label &&
			s.preselectedItem.label.toLowerCase().startsWith(s.inputText.toLowerCase())
		) {
			inputElement.current.setSelectionRange(s.inputText.length, s.preselectedItem.label.length);
		}

		if (prev.current.showPortal && !s.showPortal) {
			p.onDropdownClose?.();
		}

		prev.current = {
			value: p.value,
			items: p.items,
			showPortal: s.showPortal,
			preselectedItem: s.preselectedItem
		};
	});

	// --- leaving the page -> ignore the refocus that fires when it comes back ---
	// A browser restores focus to the element that held it, which fires a focus event the widget must
	// not read as the user reaching for the field — otherwise returning from the app switcher, the home
	// screen or another tab opens the list or the dialog on its own.
	useLayoutEffect(() => {
		const holdsFocus = (): boolean =>
			document.activeElement !== null &&
			(document.activeElement === inputElement.current ||
				document.activeElement === inputWrapperElement.current ||
				// In the dialog presentation it is the trigger that focus returns to when the dialog
				// closes, so it is the trigger that gets refocused when the page comes back.
				document.activeElement === triggerElement.current);

		const handlePageLeft = (): void => {
			shouldIgnoreFocusEvent.current = holdsFocus();
		};

		// The flag is dropped again once the page is back and the restored focus event has been
		// delivered, so that it can never swallow a later, deliberate focus.
		const handlePageReturned = (): void => {
			setTimeout(() => {
				shouldIgnoreFocusEvent.current = false;
			});
		};

		const handleVisibilityChange = (): void => {
			// A phone reports a switch to another app as a visibility change; a desktop browser reports
			// a switch to another window as a window blur. Both end up here.
			if (document.hidden) {
				handlePageLeft();
			} else {
				handlePageReturned();
			}
		};

		window.addEventListener("blur", handlePageLeft);
		window.addEventListener("focus", handlePageReturned);
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return (): void => {
			window.removeEventListener("blur", handlePageLeft);
			window.removeEventListener("focus", handlePageReturned);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	// --- dialog presentation: focus returns to the trigger on every close path ---
	// Selecting an option, Enter, Escape, the close button and an outside click all end up here, so the
	// dialog can never leave focus on a detached node.
	const wasDialogOpen = useRef(state.showPortal);

	useLayoutEffect(() => {
		if (isModalMode && wasDialogOpen.current && !state.showPortal) {
			suppressTriggerOpen.current = true;
			// `preventScroll`, and the scroll position taken when the dialog opened, together keep the
			// page where the user left it: the browser would otherwise scroll the trigger into view over
			// whatever the on-screen keyboard did to the document while the dialog was up.
			triggerElement.current?.focus({ preventScroll: true });
			restorePageScroll();
		}

		wasDialogOpen.current = state.showPortal;
	}, [isModalMode, restorePageScroll, state.showPortal]);

	// --- swallow the scroll caused by the on-screen keyboard opening ---
	// `handleListScroll` reads a scrolled option list as the user's wish to get the keyboard out of the
	// way. The keyboard opening scrolls that list itself, as it shrinks the viewport, and that one must
	// not count.
	useLayoutEffect(() => {
		if (!dismissesKeyboardOnListScroll || !state.showPortal) {
			return;
		}

		const handleViewportResize = (): void => {
			viewportResized.current = true;
		};

		window.addEventListener("resize", handleViewportResize);

		return (): void => {
			viewportResized.current = false;
			window.removeEventListener("resize", handleViewportResize);
		};
	}, [dismissesKeyboardOnListScroll, state.showPortal]);

	// --- ARIA (WAI-ARIA APG: combobox with listbox popup) ---
	const unavailableInput = props.readonly || props.disabled;
	const inputAriaProps: HTMLProps<HTMLInputElement> = {
		...props.inputProps,
		role: unavailableInput ? undefined : "combobox",
		"aria-haspopup": unavailableInput ? undefined : "listbox",
		"aria-expanded": unavailableInput ? undefined : shouldShowDropDown,
		"aria-autocomplete": unavailableInput ? undefined : "both",
		"aria-controls": shouldShowDropDown && id ? `${id}-dropdown` : undefined,
		"aria-activedescendant": shouldShowDropDown ? (selectedMatchedItem?.id ?? preselectedLinkId) : undefined
	};

	// The attached list is rendered through a portal at the end of the document, so `aria-controls`
	// alone leaves it nowhere near the field in the accessibility tree: a screen reader moving through
	// the field by swipe or in browse mode walks straight into the rest of the page, and reaches the
	// options only at the very end of the document. `aria-owns` re-parents the list into the field,
	// right behind the input and its clear button, which is the order the options are meant to be read
	// in. It sits on the wrapper rather than on the input — an `<input>` is a leaf in the accessibility
	// tree and can own nothing, which is why the attribute had no such effect where the previous
	// implementation put it. The dialog presentation needs none of this: its list already follows its
	// field in the DOM.
	const inputWrapperAriaProps: HTMLProps<HTMLDivElement> = {
		"aria-owns": !isModalMode && shouldShowDropDown && id ? `${id}-dropdown` : undefined
	};

	const dropdownAriaLabelledby = joinClassNames(
		{ [`${id}-info`]: !!(id && props.infoMessage) },
		{ [`${id}-warning`]: !!(id && props.warningMessage) },
		{ [`${id}-error`]: !!(id && props.errorMessage) },
		// `ariaLabelledby` is deprecated in favor of `ariaDescribedby`, but still honored as a fallback
		// for callers that have not migrated.
		props.ariaDescribedby ?? props.ariaLabelledby,
		{ [`${id}-label`]: !!id }
	);

	// The trigger is a combobox whose popup is a dialog (WAI-ARIA APG: combobox with a dialog popup).
	// It is genuinely read-only — editing happens on the combobox inside the dialog — so there is no
	// second editable combobox in the tree and nothing has to be hidden from assistive technology.
	const dialogId = id ? `${id}-dialog` : undefined;
	const triggerAriaProps: HTMLProps<HTMLInputElement> = {
		...props.inputProps,
		readOnly: true,
		role: unavailableInput ? undefined : "combobox",
		"aria-haspopup": unavailableInput ? undefined : "dialog",
		"aria-expanded": unavailableInput ? undefined : state.showPortal,
		"aria-controls": state.showPortal ? dialogId : undefined
	};

	const liveMessage = shouldShowDropDown && hint ? hint : "";

	return {
		inputValue,
		matchedItems,
		selectedMatchedItem,
		preselectedLinkId,
		hint,
		shouldShowDropDown,
		shouldShowPopup,
		showPortal: state.showPortal,
		inputWidth: state.inputWidth,
		liveMessage,
		inputAriaProps,
		inputWrapperAriaProps,
		dropdownAriaLabelledby,
		isModalMode,
		committedValue,
		triggerAriaProps,
		dialogId,
		inputWrapperElement: inputWrapperElement.current,
		inputLabelElement: inputLabelElement.current,
		helperTextElement: helperTextElement.current,
		setInputRef,
		setWrapperRef,
		setInputLabelRef,
		setHelperTextRef,
		setInputWrapperRef,
		setClearButtonRef,
		navigation,
		setUpdateElementPositionHandler,
		setTriggerRef,
		wrapperRef,
		handleInputChange,
		handleInputKeyDown,
		handleWrapperKeyDown,
		handleInputFocus,
		handleInputBlur,
		handleInputClick,
		handleInputWrapperClick,
		handleDropdownIconClick,
		handleClearButtonClick,
		handleClearButtonMouseDown,
		handleHelperElementFocus,
		handleSelectedItemChange,
		handlePreselectedItemChange,
		handlePreselectedLinkChange,
		handlePortalVisibilityChange,
		handleClickOutside,
		updateInputWidth,
		handleTriggerClick,
		handleTriggerFocus,
		handleTriggerKeyDown,
		handleDialogClose,
		handleDialogSelectedItemChange,
		handleListScroll
	};
}

/**
 * Compares two `value` props by what they denote rather than by identity. A caller that rebuilds the
 * item on every render (`value={{ ...selection }}`) must not read as a new value, or every commit
 * would push the committed selection back into the field and undo what the user just typed.
 */
function isSameValue(a: string | DropDownItem | undefined, b: string | DropDownItem | undefined): boolean {
	if (a === b) {
		return true;
	}

	if (a === undefined || b === undefined) {
		return false;
	}

	const itemA = toDropDownItem(a);
	const itemB = toDropDownItem(b);

	return itemA.label === itemB.label && itemA.value === itemB.value && itemA.id === itemB.id;
}

function buildInitialState(props: AutocompleteProps): {
	state: ReturnType<typeof createInitialState>;
	initialItem?: DropDownItem;
} {
	const initialValue = props.initialValue || props.value;
	const initialItem = initialValue ? toDropDownItem(initialValue) : undefined;
	const initialText = initialItem?.label ?? "";
	const initialItems = toDropDownItems(props.items);

	return {
		initialItem,
		state: createInitialState({
			inputText: initialText,
			showPortal: (props.initiallyExpanded && (props.items.length > 0 || props.hintTemplate !== "")) || false,
			items: initialItems,
			initialItem
		})
	};
}

function getInputValueToDisplay(args: {
	props: AutocompleteProps;
	state: { inputText: string; selectedItem?: DropDownItem; showPortal: boolean };
	matchedItems: DropDownItem[];
	selectedMatchedItem: DropDownItem | undefined;
	previousSelectedItem: DropDownItem | undefined;
}): string {
	const { props, state, selectedMatchedItem, previousSelectedItem } = args;
	const { links, loading } = props;
	const { inputText, selectedItem, showPortal } = state;

	let inputValue: string;

	if (links) {
		if (inputText === selectedItem?.label) {
			inputValue = inputText;
		} else if (selectedMatchedItem?.label.toLowerCase().startsWith(inputText.toLowerCase()) && inputText.length) {
			inputValue = inputText + (selectedMatchedItem?.label.substring(inputText.length) ?? "");
		} else {
			inputValue = inputText;
		}
	} else {
		inputValue = inputText + (selectedMatchedItem?.label.substring(inputText.length) ?? "");
	}

	if (loading) {
		inputValue = inputText || selectedMatchedItem?.label || "";
	}

	if (!showPortal) {
		inputValue = previousSelectedItem?.label ?? "";
	}

	return inputValue;
}
