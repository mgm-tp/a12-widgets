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

import type { ReactNode } from "react";
import { createElement, isValidElement, cloneElement } from "react";

import { QuickAccessButton } from "../../../quick-access-button/main/quick-access-button.view.js";
import type { ButtonProps } from "../../../button/main/button.api.js";
import { Button } from "../../../button/main/button.view.js";
import { List } from "../../../list/main/list.view.js";

import { ButtonGroupContainerProps } from "./button-group-container.api.js";

/** @internal */
export function createButtons(params: {
	containerButtonProps: ButtonGroupContainerProps.ButtonProps[];
	isInPopUp?: boolean;
	startCreateAt?: number;
	withProps?: boolean;
	preserveSemanticStyles?: boolean;
	lastLeftSlotIndex?: number;
}): ReactNode[] {
	const {
		containerButtonProps,
		isInPopUp = false,
		startCreateAt = 0,
		withProps = true,
		preserveSemanticStyles = false,
		lastLeftSlotIndex
	} = params;

	return containerButtonProps.slice(startCreateAt).map((buttonProps, buttonIndex) => {
		if (isInPopUp) {
			return createListItems({
				buttonProps,
				nextButtonProps: containerButtonProps[buttonIndex + 1],
				key: buttonIndex,
				preserveSemanticStyles,
				isLastLeftSlot: lastLeftSlotIndex === buttonIndex
			});
		}

		if (ButtonGroupContainerProps.ButtonProps.isQuickAccessButton(buttonProps)) {
			return createElement(QuickAccessButton, {
				...buttonProps,
				key: buttonIndex,
				id: withProps ? buttonProps.id : undefined
			});
		} else {
			return createElement(Button, {
				...buttonProps,
				key: buttonIndex,
				id: withProps ? buttonProps.id : undefined,
				buttonRef: withProps ? buttonProps.buttonRef : undefined
			});
		}
	});
}

/** @internal */
function createListItems(params: {
	buttonProps: ButtonGroupContainerProps.ButtonProps;
	nextButtonProps: ButtonGroupContainerProps.ButtonProps | undefined;
	key: number;
	preserveSemanticStyles?: boolean;
	isLastLeftSlot?: boolean;
}): ReactNode[] {
	const { buttonProps, nextButtonProps, key, preserveSemanticStyles = false, isLastLeftSlot } = params;

	if (ButtonGroupContainerProps.ButtonProps.isQuickAccessButton(buttonProps)) {
		const { actionItems = [] } = buttonProps;

		return actionItems.map((actionItemProps, actionItemIndex) => {
			const isLastItemInQuickAccess = actionItemIndex === actionItems.length - 1;
			const isNotLastButton = !!nextButtonProps;

			let dividerType: "light" | "dark" | boolean;

			if (preserveSemanticStyles) {
				if (isLastItemInQuickAccess && isNotLastButton) {
					dividerType = "dark";
				} else {
					dividerType = "light";
				}
			} else {
				dividerType = isLastItemInQuickAccess && isNotLastButton;
			}

			const buttonSemantics = preserveSemanticStyles
				? {
						primary: buttonProps.primary,
						secondary: buttonProps.secondary,
						destructive: buttonProps.destructive,
						active: false,
						iconOnly: false
					}
				: undefined;

			// Remove meta property when QuickAccessButton action items are displayed in ButtonGroupContainer popup menu
			const { meta, ...actionItemPropsWithoutMeta } = actionItemProps;

			return createElement(List.Item, {
				...actionItemPropsWithoutMeta,
				key: actionItemIndex,
				divider: dividerType,
				buttonSemantics
			});
		});
	} else {
		const { buttonAttributes } = buttonProps;
		let dividerType: "light" | "dark" | boolean;

		if (preserveSemanticStyles) {
			// Dark divider for last button in left slot (between slots)
			if (
				isLastLeftSlot ||
				(nextButtonProps && ButtonGroupContainerProps.ButtonProps.isQuickAccessButton(nextButtonProps))
			) {
				dividerType = "dark";
			} else {
				dividerType = "light";
			}
		} else {
			dividerType = true;
		}

		// Only apply button semantics in ButtonGroupContainer context
		const buttonSemantics = preserveSemanticStyles
			? {
					primary: buttonProps.primary,
					secondary: buttonProps.secondary,
					destructive: buttonProps.destructive,
					active: buttonProps.active,
					iconOnly: !buttonProps.label && !!buttonProps.icon
				}
			: undefined;

		return [
			createElement(List.Item, {
				...buttonProps,
				key,
				text: buttonProps.label ?? buttonProps.title,
				graphic: buttonProps.icon,
				divider: dividerType,
				ariaLabel: buttonAttributes?.["aria-label"],
				buttonSemantics
			})
		];
	}
}

/** @internal */
export function cloneButtonsWithKeys(params: {
	buttons: ReactNode[];
	rootKey: string;
	startCloneAt?: number;
	withProps?: boolean;
}): ReactNode[] {
	const { buttons, rootKey, startCloneAt = 0, withProps = true } = params;

	return buttons.slice(startCloneAt).map((button, index) => {
		if (!isValidElement<ButtonProps>(button)) {
			return button;
		}

		const isInPopup = rootKey === "popup";

		return cloneElement(
			button,
			withProps
				? {
						key: button.key || `${rootKey}-${index}`,
						label: isInPopup ? (button.props.label ?? button.props.title) : button.props.label
					}
				: { key: index, buttonRef: undefined, id: undefined }
		);
	});
}
