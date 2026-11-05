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

import type { FocusEvent, KeyboardEvent, RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { Key } from "ts-key-enum";

export interface ToolbarNavigation {
	onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
	onFocus: (event: FocusEvent<HTMLElement>) => void;
}

/**
 * Roving-tabindex keyboard navigation for the formatting toolbar,
 * mirroring the RichTextEditor toolbar (ARIA "toolbar" pattern):
 * the whole toolbar is a single Tab stop, and Left/Right — plus Home/End —
 * move focus between the enabled controls, wrapping around at the ends.
 * Only one control is tabbable at a time; the rest carry `tabindex="-1"`.
 *
 * The toolbar re-renders on every selection change (controls enable/disable),
 * so the tabbable control is re-asserted after each render to keep exactly
 * one Tab stop even as the set of enabled buttons changes.
 */
export function useToolbarNavigation(toolbarRef: RefObject<HTMLElement | null>): ToolbarNavigation {
	const getButtons = useCallback((): HTMLButtonElement[] => {
		const toolbar = toolbarRef.current;

		return toolbar ? Array.from(toolbar.querySelectorAll<HTMLButtonElement>("button")) : [];
	}, [toolbarRef]);

	// The button the user last focused — not whichever one is tabbable right now.
	// Reading it back from the DOM would also pick up the fallback below,
	// and on the first render that fallback lands on whatever happens to be enabled.
	// The Tab stop would then stay stuck there.
	const focusedRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const buttons = getButtons();
		const enabledButtons = buttons.filter((button) => !button.disabled);

		if (enabledButtons.length === 0) {
			return;
		}

		// Stay where the user left off while that control still works;
		// otherwise Tab enters at the first control that does.
		const focused = focusedRef.current;
		const active = focused && enabledButtons.includes(focused) ? focused : enabledButtons[0];

		for (const button of buttons) {
			button.tabIndex = button === active ? 0 : -1;
		}
	});

	const onFocus = useCallback(
		(event: FocusEvent<HTMLElement>): void => {
			const { target } = event;
			const buttons = getButtons();

			// Menu popups render into a portal but stay React children of the toolbar, so
			// their focus events bubble through here too. Those buttons are not ours.
			if (!(target instanceof HTMLButtonElement) || target.disabled || !buttons.includes(target)) {
				return;
			}

			focusedRef.current = target;

			for (const button of buttons) {
				button.tabIndex = button === target ? 0 : -1;
			}
		},
		[getButtons]
	);

	const onKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			if (
				event.key !== Key.ArrowLeft &&
				event.key !== Key.ArrowRight &&
				event.key !== Key.Home &&
				event.key !== Key.End
			) {
				return;
			}

			const enabledButtons = getButtons().filter((button) => !button.disabled);
			const currentIndex = enabledButtons.indexOf(document.activeElement as HTMLButtonElement);

			if (currentIndex === -1) {
				return;
			}

			event.preventDefault();

			const lastIndex = enabledButtons.length - 1;
			let nextIndex: number;

			switch (event.key) {
				case Key.Home:
					nextIndex = 0;
					break;
				case Key.End:
					nextIndex = lastIndex;
					break;
				case Key.ArrowRight:
					nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
					break;
				default:
					nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
			}

			enabledButtons[nextIndex]?.focus();
		},
		[getButtons]
	);

	return { onKeyDown, onFocus };
}
