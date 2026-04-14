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

import type { ContextType, ReactElement, ReactNode } from "react";
import { Component } from "react";

import { provider } from "../../common/main/device-detector.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { bindMethods, addPrefix, joinClassNames } from "../../common/main/utils.js";
import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { PopUpMenu } from "../../pop-up-menu/main/pop-up-menu.view.js";
import { DataRoles } from "../../common/index.js";

import type { QuickAccessMenuProps } from "./quick-access-menu.api.js";

const baseClassName = addPrefix("quick-access-menu");
const baseDataRole = DataRoles.QuickAccessMenu;

export interface QuickAccessMenuState {
	isPopupVisible: boolean;
}

/**
 * @deprecated from 32.5.0. Use QuickAccessButton instead.
 */
export class QuickAccessMenu extends Component<QuickAccessMenuProps, QuickAccessMenuState> {
	static displayName: string;

	declare context: ContextType<typeof A11YLanguageContext>;
	constructor(props: QuickAccessMenuProps) {
		super(props);
		this.state = { isPopupVisible: false };

		bindMethods(this);
	}

	private renderTriggerElement(): ReactElement {
		const a11yTitles = this.context.quickAccessMenuTitles;
		const icon = this.props.menuTriggerIcon ? (
			this.props.menuTriggerIcon
		) : (
			<Icon>{this.state.isPopupVisible ? "arrow_drop_up" : "arrow_drop_down"}</Icon>
		);

		return (
			<Button
				disabled={this.props.disabled}
				icon={icon}
				title={this.state.isPopupVisible ? a11yTitles?.quickMenuTriggerClose : a11yTitles?.quickMenuTriggerOpen}
			/>
		);
	}

	private handleOnVisibilityChange(isPopupVisible: boolean): void {
		this.setState({ isPopupVisible }, () => {
			if (this.props.onVisibilityChange) {
				this.props.onVisibilityChange(isPopupVisible);
			}
		});
	}

	render(): ReactNode {
		const { className, children, activeElement, style, id, disabled } = this.props;
		const classNames = joinClassNames(baseClassName, { [`${baseClassName}--touch`]: provider.hasTouch() }, className);

		return (
			<div className={classNames} style={style} id={id} data-role={baseDataRole}>
				{activeElement && <div data-role={`${baseDataRole}-active-action`}>{activeElement}</div>}
				<PopUpMenu
					className={`${baseClassName}__popup`}
					dataRole={`${baseDataRole}-popup`}
					disabled={disabled}
					triggerElement={this.renderTriggerElement()}
					onVisibilityChange={this.handleOnVisibilityChange}
					headerTitle={this.context.quickAccessButtonTitles?.popupMenuTitle}
				>
					{children}
				</PopUpMenu>
			</div>
		);
	}
}

QuickAccessMenu.contextType = A11YLanguageContext;

QuickAccessMenu.displayName = "QuickAccessMenu";
