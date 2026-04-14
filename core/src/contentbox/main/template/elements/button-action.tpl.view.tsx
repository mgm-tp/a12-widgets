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

import type { ReactElement } from "react";
import { useContext } from "react";
import { styled, css } from "styled-components";

import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import type { ButtonProps } from "../../../../button/main/button.api.js";
import { Button } from "../../../../button/main/button.view.js";
import { Icon } from "../../../../icon/main/icon.view.js";
import { getBaseButtonVariantStyles } from "../../../../button/main/button.styled.js";

import type { ContentBoxProps } from "../contentbox.tpl.api.js";

import { HeadingAddonTpl } from "./heading.tpl.view.js";

export const StyledHeadingActionButton = styled(Button).withConfig({ displayName: "StyledHeadingActionButton-sc-" })(
	({ theme, active }) => {
		const { headingActionButton } = theme.components.contentBox;

		return css`
			&& {
				${getBaseButtonVariantStyles(active ? headingActionButton.activated : headingActionButton)}

				${active &&
				css`
					border-radius: ${headingActionButton.activated.borderRadius};
				`}
			}
		`;
	}
);

/**
 * A common button which is recommended to use in Content Box's Header. Its appearance will be adapted according to themes:
 * - DEFAULT theme: inverted style, which similar to the inverted icon button.
 * - FLAT theme: regular style, which similar to the default icon button.
 */
export function ActionButtonTpl(props: ButtonProps): ReactElement {
	return <StyledHeadingActionButton {...props} />;
}

ActionButtonTpl.displayName = "ActionButtonTpl";

export function HeadingActionButtonTpl(props: ButtonProps): ReactElement {
	return (
		<HeadingAddonTpl>
			<StyledHeadingActionButton {...props} />
		</HeadingAddonTpl>
	);
}

HeadingActionButtonTpl.displayName = "HeadingActionButtonTpl";

export function BackButtonTpl(props: ContentBoxProps.BackButtonProps): ReactElement<ContentBoxProps.FooterProps> {
	const { contentboxTitles } = useContext(A11YLanguageContext);
	const { onBackButtonClicked, onClick, ...rest } = props;

	return (
		<HeadingActionButtonTpl
			title={contentboxTitles?.backButtonTitle}
			icon={<Icon>chevron_left</Icon>}
			onClick={onBackButtonClicked || onClick}
			{...rest}
		/>
	);
}

BackButtonTpl.displayName = "BackButtonTpl";

export function CloseButtonTpl(props: ContentBoxProps.CloseButtonProps): ReactElement {
	const { contentboxTitles } = useContext(A11YLanguageContext);
	const { onCloseButtonClicked, onClick, ...rest } = props;

	return (
		<HeadingActionButtonTpl
			title={contentboxTitles?.closeButtonTitle}
			icon={<Icon>close</Icon>}
			onClick={onCloseButtonClicked || onClick}
			{...rest}
		/>
	);
}

CloseButtonTpl.displayName = "CloseButtonTpl";
