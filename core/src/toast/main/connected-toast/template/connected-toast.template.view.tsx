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

import type { Orientation } from "../../../../common/main/alignment.js";
import { addPrefix, joinClassNames } from "../../../../common/main/utils.js";
import { renderIcon } from "../../common/toast.internal.js";
import { toastColorState, StyledToastWrapper, StyledToastGraphic, StyledToastBody } from "../../common/toast.styled.js";
import type { Variant } from "../../common/toast.common.api.js";
import { basePortalArrow } from "../../../../theme/base/mixins/_portal-arrow.js";
import { HiddenText } from "../../../../common/main/hidden-text/hidden-text.view.js";
import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { ConnectedToastTemplateProps } from "./connected-toast.template.api.js";

const baseClassName = addPrefix("toast");

const StyledConnectedToastContent = styled.div(({ theme }) => {
	const { content } = theme.components.connectedToast;

	return css`
		font-family: ${content.fontFamily};
		font-size: ${content.fontSize};
		padding: ${content.padding};
	`;
});

const StyledConnectedToastWrapper = styled(StyledToastWrapper)<{ toastOrientation?: Orientation; variant?: Variant }>(({
	theme,
	toastOrientation = "bottom-start",
	variant = "info"
}) => {
	const {
		spacing: { verticalSpacing, horizontalSpacing, spacing }
	} = theme;
	const margin = {
		"top-start": `${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingxs}px ${verticalSpacing.vertWhiteSpacingxs}px 0`,
		"top-end": `${verticalSpacing.vertWhiteSpacingsm}px 0 ${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px`,
		top: `${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingxs}px ${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px`,
		"bottom-start": `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px ${verticalSpacing.vertWhiteSpacingsm}px 0`,
		"bottom-end": `${verticalSpacing.vertWhiteSpacingxs}px 0 ${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingxs}px`,
		bottom: `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px ${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingxs}px`,
		"left-start": `0 ${horizontalSpacing.horizWhiteSpacingxs}px ${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingsm}px`,
		"left-end": `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px 0 ${horizontalSpacing.horizWhiteSpacingsm}px`,
		left: `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px ${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingsm}px`,
		"right-start": `0 ${horizontalSpacing.horizWhiteSpacingsm}px ${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px`,
		"right-end": `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingsm}px 0 ${horizontalSpacing.horizWhiteSpacingxs}px`,
		right: `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingsm}px ${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px`
	};
	const stateColor = toastColorState(theme, variant);
	const arrow = {
		...theme.components.connectedToast.arrow,
		size: spacing.spacingXs,
		border: `1px solid ${stateColor}`,
		background: ["right-start", "right-end", "right", "top-start", "bottom-start"].includes(toastOrientation)
			? stateColor
			: theme.components.connectedToast.arrow.background
	};

	return css`
		position: relative;
		${basePortalArrow({ orientation: toastOrientation, arrow })}

		&& {
			margin: ${margin[toastOrientation]};
		}
	`;
});

const StyledRightConnectedToastWrapper = styled(StyledToastBody)`
	justify-content: center;
`;

export function ConnectedToastTemplate(props: ConnectedToastTemplateProps): ReactElement {
	const { connectedToastTitles } = useContext(A11YLanguageContext);

	const { variant = "info", message, className, icon, wrapperRef, toastOrientation, ...rest } = props;
	const wrapperClassName = joinClassNames(
		`${baseClassName} ${baseClassName}--connected ${baseClassName}--${variant}`,
		className
	);

	return (
		<StyledConnectedToastWrapper
			variant={variant}
			toastOrientation={toastOrientation}
			tabIndex={-1}
			className={wrapperClassName}
			ref={wrapperRef}
			data-role={DataRoles.Toast}
			{...rest}
		>
			<StyledToastGraphic variant={variant} className={`${baseClassName}__left`} data-role={DataRoles.Toast.Left}>
				{icon || renderIcon(variant)}
			</StyledToastGraphic>
			<StyledRightConnectedToastWrapper
				variant={variant}
				className={`${baseClassName}__right`}
				data-role={DataRoles.Toast.Right}
			>
				<StyledConnectedToastContent className={`${baseClassName}__content`} data-role={DataRoles.Toast.Content}>
					<div className={`${baseClassName}__message`} data-role={DataRoles.Toast.Message}>
						{message}
						{connectedToastTitles && <HiddenText>{connectedToastTitles.connectedToast}</HiddenText>}
					</div>
				</StyledConnectedToastContent>
			</StyledRightConnectedToastWrapper>
		</StyledConnectedToastWrapper>
	);
}

ConnectedToastTemplate.displayName = "ConnectedToastTemplate";
