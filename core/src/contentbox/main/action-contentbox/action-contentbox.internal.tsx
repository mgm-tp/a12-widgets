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

import type { ReactNode, ReactElement } from "react";
import { useContext, isValidElement } from "react";

import { ButtonGroup } from "../../../button-group/main/button-group.view.js";
import type { Identifiable, Styleable } from "../../../common/main/base-props.js";
import { PopUpMenu } from "../../../pop-up-menu/main/pop-up-menu.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { LayoutGrid } from "../../../layout/layout-grid/main/layout-grid.view.js";
import { ButtonGroupContainer } from "../../../layout/button-group-container/main/button-group-container.view.js";
import { ContentBoxElements } from "../../main/template/contentbox.tpl.view.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";

import type { ActionContentboxProps } from "./action-contentbox.api.js";

export interface HeadingProps extends Styleable, Identifiable {
	buttons?: ActionContentboxProps.Buttons;
	compact?: boolean;
	headingElements: ReactNode;
	headingPrefixes?: ReactNode;
	headingButtons?: ReactNode;
}

export function Heading(props: HeadingProps): ReactElement<HeadingProps> {
	const a11yTitles = useContext(A11YLanguageContext).contentboxTitles;

	return (
		<ContentBoxElements.Heading
			id={props.id}
			key={props.id}
			style={props.style}
			className={props.className}
			prefixes={props.headingPrefixes && <>{props.headingPrefixes}</>}
			suffixes={
				((props.compact && props.buttons) || props.headingButtons) && (
					<>
						{props.headingButtons}
						{props.compact && props.buttons && (
							<ContentBoxElements.HeadingAddon>
								<PopUpMenu
									headerTitle={a11yTitles?.combinationMenuTitle}
									triggerButtonTitle={a11yTitles?.combinationMenuTriggerOpen}
									triggerButtonCloseTitle={a11yTitles?.combinationMenuTriggerClose}
									triggerElement={<ContentBoxElements.ActionButton icon={<Icon>more_vert</Icon>} />}
								>
									{props.buttons instanceof Array ? props.buttons.map((item) => item.button) : props.buttons}
								</PopUpMenu>
							</ContentBoxElements.HeadingAddon>
						)}
					</>
				)
			}
		>
			{props.headingElements}
		</ContentBoxElements.Heading>
	);
}

Heading.displayName = "Heading";

export interface SubHeadingProps extends Styleable, Identifiable {
	breadcrumbs?: ReactNode;
	buttons?: ActionContentboxProps.Buttons;
	compact?: boolean;
	navigation?: ReactNode;
	subActionBar?: ReactNode;
}

export function SubHeading(props: SubHeadingProps): ReactElement<SubHeadingProps> {
	return (
		<ContentBoxElements.SubHeading id={props.id} key={props.id} style={props.style} className={props.className}>
			{props.navigation}
			{!props.compact && props.buttons && <ActionBar buttons={props.buttons} />}
			{props.subActionBar}
			{props.breadcrumbs}
		</ContentBoxElements.SubHeading>
	);
}

SubHeading.displayName = "SubHeading";

export interface ActionBarProps extends Identifiable, Styleable {
	buttons: ActionContentboxProps.Buttons;
}

export function ActionBar(props: ActionBarProps): ReactElement<ActionBarProps> | null {
	if (props.buttons instanceof Array && props.buttons.length > 0) {
		const leftButtons = [];
		const rightButtons = [];

		for (const button of props.buttons) {
			if (button.align === "left") {
				leftButtons.push(button.button);
			} else {
				rightButtons.push(button.button);
			}
		}

		return (
			<ContentBoxElements.ActionBar id={props.id} style={props.style} className={props.className}>
				<ButtonGroupContainer>
					{leftButtons.length > 0 && <ButtonGroup alignment="left">{leftButtons}</ButtonGroup>}
					{rightButtons.length > 0 && <ButtonGroup alignment="right">{rightButtons}</ButtonGroup>}
				</ButtonGroupContainer>
			</ContentBoxElements.ActionBar>
		);
	} else if (isValidElement(props.buttons)) {
		return (
			<ContentBoxElements.ActionBar className={props.className} style={props.style} id={props.id}>
				<LayoutGrid.Grid>{props.buttons}</LayoutGrid.Grid>
			</ContentBoxElements.ActionBar>
		);
	}

	return null;
}

ActionBar.displayName = "ActionBar";
