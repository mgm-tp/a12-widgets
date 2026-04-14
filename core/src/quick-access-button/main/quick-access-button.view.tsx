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

import type { ReactElement, ReactNode } from "react";
import { useContext, useState, useCallback, isValidElement, cloneElement } from "react";

import { provider } from "../../common/main/device-detector.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import type { ButtonProps } from "../../button/main/button.api.js";
import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { PopUpMenu } from "../../pop-up-menu/main/pop-up-menu.view.js";
import { List } from "../../list/main/list.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { QuickAccessButtonProps } from "./quick-access-button.api.js";
import {
	StyledQuickAccessButton,
	StyledQuickAccessButtonDivider,
	StyledQuickAccessButtonTriggerElement
} from "./quick-access-button.styled.js";

const baseClassName = addPrefix("quick-access-button");

export const QuickAccessButton = (props: QuickAccessButtonProps): ReactElement<QuickAccessButtonProps> => {
	const quickAccessButtonTitles = useContext<A11yDefinition>(A11YLanguageContext).quickAccessButtonTitles;
	const [isPopupVisible, setPopupVisible] = useState(false);
	const {
		className,
		children,
		mainAction,
		style,
		id,
		menuTriggerIcon,
		destructive,
		disabled,
		invert,
		primary,
		secondary,
		onVisibilityChange,
		actionItems,
		focusOnTriggerElementAfterClose = true,
		triggerElementButtonRef,
		preserveMainActionStyles
	} = props;

	const isMobile = !provider.isDesktop();

	const handleOnVisibilityChange = useCallback(
		(isPopupVisible: boolean): void => {
			setPopupVisible(isPopupVisible);
			onVisibilityChange?.(isPopupVisible);
		},
		[onVisibilityChange]
	);

	const renderTriggerElement = useCallback((): ReactElement => {
		const icon = menuTriggerIcon ?? <Icon>{isPopupVisible ? "arrow_drop_up" : "arrow_drop_down"}</Icon>;
		const { triggerOpen, triggerClose } = quickAccessButtonTitles ?? {};

		return (
			<StyledQuickAccessButtonTriggerElement
				className={isPopupVisible ? `${baseClassName}__popup-opened` : undefined}
				destructive={destructive}
				disabled={disabled}
				invert={invert}
				primary={primary}
				secondary={secondary}
				icon={icon}
				title={isPopupVisible ? triggerClose : triggerOpen}
				dataRole={DataRoles.QuickAccessButton.TriggerElement}
				$open={isPopupVisible}
				tabIndex={0} // Fix CSS focus does not work on Safari
				$isMobile={isMobile}
				buttonRef={triggerElementButtonRef}
			/>
		);
	}, [
		menuTriggerIcon,
		isPopupVisible,
		quickAccessButtonTitles,
		destructive,
		disabled,
		invert,
		primary,
		secondary,
		isMobile,
		triggerElementButtonRef
	]);

	const renderActionItems = useCallback((): ReactNode | undefined => {
		return actionItems?.map((itemProps, index) => (
			<List.Item {...itemProps} key={itemProps.id ?? index} preserveMainActionStyles={preserveMainActionStyles} />
		));
	}, [actionItems, preserveMainActionStyles]);

	const classNames = joinClassNames(
		baseClassName,
		{ [`${baseClassName}--touch`]: provider.hasTouch() },
		{ [`${baseClassName}--disabled`]: disabled },
		{ [`${baseClassName}--destructive`]: destructive },
		{
			[`${baseClassName}--secondary`]: secondary || !primary
		},
		{ [`${baseClassName}--primary`]: primary },
		{ [`${baseClassName}--invert`]: primary && invert },
		className
	);

	return (
		<StyledQuickAccessButton
			className={classNames}
			style={style}
			id={id}
			data-role={DataRoles.QuickAccessButton}
			$primary={primary}
			$secondary={secondary}
			$invert={invert}
			$disabled={disabled}
			$touch={provider.hasTouch()}
			$isMobile={isMobile}
		>
			{isValidElement<ButtonProps>(mainAction) && mainAction.type === Button
				? cloneElement(mainAction, { dataRole: DataRoles.QuickAccessButton.MainAction, tabIndex: 0 })
				: mainAction}
			<StyledQuickAccessButtonDivider
				className={`${baseClassName}__divider`}
				data-role={DataRoles.QuickAccessButton.Divider}
				$primary={primary}
				$secondary={secondary}
				$destructive={destructive}
				$disabled={disabled}
				$invert={invert}
			/>
			<PopUpMenu
				className={`${baseClassName}__popup`}
				dataRole={DataRoles.QuickAccessButton.Popup}
				disabled={disabled}
				triggerElement={renderTriggerElement()}
				onVisibilityChange={handleOnVisibilityChange}
				focusOnTriggerElementAfterClose={focusOnTriggerElementAfterClose}
				headerTitle={quickAccessButtonTitles?.popupMenuTitle}
			>
				{actionItems ? <List>{renderActionItems()}</List> : children}
			</PopUpMenu>
		</StyledQuickAccessButton>
	);
};

QuickAccessButton.displayName = "QuickAccessButton";
