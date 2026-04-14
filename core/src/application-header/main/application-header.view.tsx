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
import { Children } from "react";
import { styled, css } from "styled-components";

import { breakWord } from "../../theme/base/mixins/_break-word.js";
import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { StyledButton } from "../../button/main/button.styled.js";
import { StyledBadgeWrapper, StyledTinyBadgeWrapper } from "../../badge/main/badge.view.js";

import type { ApplicationHeaderProps } from "./application-header.api.js";

const baseClassName = addPrefix("applicationHeader");

export const StyledApplicationHeaderWrapper = styled.div.withConfig({
	displayName: "StyledApplicationHeaderWrapper-sc-"
})(({ theme }) => {
	return css`
		background-color: ${theme.components.applicationHeader.backgroundColor};
		border-bottom: ${theme.components.applicationHeader.borderBottom};
		border-top: ${theme.components.applicationHeader.borderTop};
		display: flex;
		flex-direction: column;
	`;
});
export const StyledApplicationHeaderContent = styled.div.withConfig({
	displayName: "StyledApplicationHeaderContent-sc-"
})(({ theme }) => {
	const { fontSize, fontFamily, minHeight, padding } = theme.components.applicationHeader;

	return css`
		box-sizing: border-box;
		display: flex;
		font-family: ${fontFamily};
		font-size: ${fontSize};
		justify-content: space-between;
		min-height: ${minHeight};
		padding: ${padding};
		${breakWord}
	`;
});
export const StyledApplicationHeaderSlot = styled.div.withConfig({ displayName: "StyledApplicationHeaderSlot-sc-" })(
	({ theme }) => {
		return css`
			color: ${theme.components.applicationHeader.slot.color};
			display: inline-flex;
			margin-right: ${theme.components.applicationHeader.slot.marginRight};
		`;
	}
);
export const StyledApplicationHeaderSlotWrapper = styled.div.withConfig({
	displayName: "StyledApplicationHeaderSlotWrapper-sc-"
})<{ slotPosition: "left" | "right" | "center" }>(({ slotPosition, theme }) => {
	const {
		menu: { triggerButton },
		badge
	} = theme.components;

	return css`
		display: flex;
		align-items: center;
		${StyledBadgeWrapper}:not(${StyledTinyBadgeWrapper}) {
			top: calc(${badge.height} * -0.5);
		}

		// HAMBURGER TRIGGER BUTTON IN MOBILE
		${StyledButton}.${addPrefix("nav__trigger")} {
			color: ${triggerButton.iconColor};
			font-size: ${triggerButton.iconFontSize};

			${StyledBadgeWrapper} {
				top: ${triggerButton.badgeTopPos};
				right: ${triggerButton.badgeRightPos};
			}
			${StyledTinyBadgeWrapper} {
				top: 0;
				right: 0;
			}
		}

		${slotPosition === "right" &&
		css`
			${StyledApplicationHeaderSlot} {
				min-width: 0;
				&:last-child {
					margin-right: 0;
				}
			}
		`}
	`;
});

export function ApplicationHeader(props: ApplicationHeaderProps) {
	function renderSlots(slots: ReactNode): ReactNode {
		return Children.toArray(slots).map((slot, index) => {
			return (
				<StyledApplicationHeaderSlot
					className={`${baseClassName}__contentSlot`}
					key={index}
					data-role={DataRoles.ApplicationHeader.Content.Slot}
				>
					{slot}
				</StyledApplicationHeaderSlot>
			);
		});
	}

	return (
		<StyledApplicationHeaderWrapper
			className={joinClassNames(baseClassName, props.className)}
			id={props.id}
			role="banner"
			style={props.style}
			data-role={DataRoles.ApplicationHeader}
		>
			<StyledApplicationHeaderContent
				className={`${baseClassName}__content`}
				data-role={DataRoles.ApplicationHeader.Content}
			>
				{props.leftSlots && (
					<StyledApplicationHeaderSlotWrapper
						slotPosition="left"
						className={`${baseClassName}__contentSlotWrapper ${baseClassName}__contentSlotWrapper--left`}
					>
						{renderSlots(props.leftSlots)}
					</StyledApplicationHeaderSlotWrapper>
				)}

				{props.rightSlots && (
					<StyledApplicationHeaderSlotWrapper
						slotPosition="right"
						className={`${baseClassName}__contentSlotWrapper ${baseClassName}__contentSlotWrapper--right`}
					>
						{renderSlots(props.rightSlots)}
					</StyledApplicationHeaderSlotWrapper>
				)}
			</StyledApplicationHeaderContent>
		</StyledApplicationHeaderWrapper>
	);
}

ApplicationHeader.displayName = "ApplicationHeader";
