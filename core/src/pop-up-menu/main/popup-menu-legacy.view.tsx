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

import type { FC, ReactNode } from "react";
import { Children, isValidElement } from "react";

import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import type { ButtonProps } from "../../button/main/button.api.js";
import { Button } from "../../button/main/button.view.js";
import { ButtonConfigContext } from "../../button/main/button-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { StyledPopupMenuItem } from "./popup-menu.styled.js";

const baseClassName = addPrefix("popup");

interface PopupMenuLegacyButtonsProps {
	children: ReactNode;
	isInResponsiveGroupButton?: boolean;
}

/**
 * @deprecated This component provides legacy support for Button components as direct children of PopUpMenu.
 * This pattern was deprecated in v27.1.0. New implementations should use the List component instead.
 *
 * This component is maintained for backward compatibility with existing implementations.
 * It will be removed in a future major version.
 */
export const PopupMenuLegacyButtons: FC<PopupMenuLegacyButtonsProps> = ({ children, isInResponsiveGroupButton }) => {
	const childrenArray = Children.toArray(children);

	// Check whether children has Icon Button
	// If there is at least 1 icon button, other buttons without icon will have additional padding
	const hasIconButton = childrenArray.find(
		(item) => !!(isValidElement<ButtonProps>(item) && item.type === Button && item.props.icon)
	);

	const menuItems = childrenArray.map((child, index) => {
		const classNames = joinClassNames(`${baseClassName}__item`, {
			[`${baseClassName}__item--withPadding`]: isValidElement<ButtonProps>(child) && hasIconButton && !child.props.icon
		});

		return (
			<StyledPopupMenuItem
				className={classNames}
				key={index}
				data-role={DataRoles.Popup.Item}
				$withPadding={!!(isValidElement<ButtonProps>(child) && hasIconButton && !child.props.icon)}
				hasLoadingButton={!!(isValidElement<ButtonProps>(child) && child.type === Button && child.props.loading)}
				$isInResponsiveGroupButton={isInResponsiveGroupButton}
			>
				{child}
			</StyledPopupMenuItem>
		);
	});

	return <ButtonConfigContext.Provider value={{ labelHidden: false }}>{menuItems}</ButtonConfigContext.Provider>;
};

PopupMenuLegacyButtons.displayName = "PopupMenuLegacyButtons";
