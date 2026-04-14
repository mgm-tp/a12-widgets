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

import { styled, css } from "styled-components";
import { TransitionGroup } from "react-transition-group";

import { fadeIn, fadeOut, slideUpAndHide } from "../../theme/base/mixins/_animation.js";
import { addPrefix } from "../../common/main/utils.js";
import { hover } from "../../theme/base/mixins/_interaction.js";
import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";

import { StyledToastBody, StyledToastGraphic, StyledToastWrapper } from "./common/toast.styled.js";
import type { ToastGroupProps } from "./toast-group.api.js";

const baseClassName = addPrefix("toast");

export const StyledToastGroupWrapper = styled.div.withConfig({ displayName: "StyledToastGroupWrapper-sc-" })<{
	isMobile?: boolean;
	$stackable?: boolean;
	$stacking?: boolean;
	$direction?: ToastGroupProps.Direction;
}>(({ isMobile, theme, $stackable, $stacking, $direction }) => {
	const toastGroup = theme.components.toastGroup;
	const isTopDown = $direction === "top-down";

	return css`
		box-sizing: border-box;
		position: fixed;
		padding: ${toastGroup.padding};
		outline: none;
		width: ${toastGroup.width};
		max-width: ${toastGroup.maxWidth};
		isolation: isolate;

		${StyledToastWrapper} {
			margin: ${toastGroup.childrenMargin};
			pointer-events: auto;
			width: 100%;
		}

		${StyledToastBody} {
			flex: 1;
		}

		${isMobile &&
		css`
			max-width: none;
			margin: ${toastGroup.mobile.margin};
			width: auto;

			${StyledToastWrapper} {
				bottom: 0;
				opacity: 1;
				left: 0;
				position: ${!$stacking && "absolute"};
				visibility: visible;
			}
		`}
		${!isMobile &&
		css`
			max-height: 100%;
			overflow-y: auto;
		`}
		${$stackable &&
		css`
			${StyledToastBody} {
				max-width: none;
			}
		`}
		${$stacking &&
		css`
			${StyledToastAnimation} {
				${isTopDown &&
				css`
					margin-bottom: calc(${toastGroup.stacked.toastBoxShadow.thickness}*2);
				`}
				${!isTopDown &&
				css`
					margin: calc(${toastGroup.stacked.toastBoxShadow.thickness}*2) 0;
				`}
			}
			${StyledToastAnimation}, ${StyledToastWrapper} {
				margin-top: 0;
			}
			${StyledToastGraphic} {
				box-shadow:
					${toastGroup.stacked.toastBoxShadow.level1Background} 15px
						${isTopDown
							? toastGroup.stacked.toastBoxShadow.thickness
							: `-${toastGroup.stacked.toastBoxShadow.thickness}`},
					${toastGroup.stacked.toastBoxShadow.level2Background} 30px
						${isTopDown
							? `calc(${toastGroup.stacked.toastBoxShadow.thickness}*2)`
							: `calc(-${toastGroup.stacked.toastBoxShadow.thickness}*2)`};
				transition: ease-in 0.2s;
				${createPseudoElement(
					":before",
					css`
						z-index: -1;
					`
				)}
				${createPseudoElement(
					":after",
					css`
						z-index: -1;
					`
				)}
			}
			${StyledToastBody} {
				box-shadow:
					${toastGroup.stacked.toastBoxShadow.level1Background} ${toastGroup.stacked.toastBoxShadow.thickness}
						${isTopDown
							? toastGroup.stacked.toastBoxShadow.thickness
							: `-${toastGroup.stacked.toastBoxShadow.thickness}`},
					${toastGroup.stacked.toastBoxShadow.level2Background} calc(${toastGroup.stacked.toastBoxShadow.thickness}*2)
						${isTopDown
							? `calc(${toastGroup.stacked.toastBoxShadow.thickness}*2)`
							: `calc(-${toastGroup.stacked.toastBoxShadow.thickness}*2)`};
				margin-right: calc(${toastGroup.stacked.toastBoxShadow.thickness}*2);
				transition: ease-in 0.2s;
				${createPseudoElement(
					":before",
					css`
						z-index: -1;
					`
				)}
				${createPseudoElement(
					":after",
					css`
						z-index: -1;
					`
				)}
			}
			${hover(css`
				${StyledToastGraphic}, ${StyledToastBody} {
					box-shadow: none;
					transition: ease-in-out 0.2s;
					position: relative;
				}
				${StyledToastGraphic}:before {
					box-shadow: 15px ${toastGroup.stacked.toastBoxShadow.thickness}
						${toastGroup.stacked.toastBoxShadow.level1Background};
					transition: ease-in 0.2s;
				}
				${StyledToastBody}:before {
					box-shadow: 15px calc(${toastGroup.stacked.toastBoxShadow.thickness} + 1px)
						${toastGroup.stacked.toastBoxShadow.level1Background};
					transition: ease-in 0.2s;
					width: calc(100% - 30px);
					z-index: -1;
				}
				${StyledToastGraphic}:after {
					box-shadow: 30px calc(${toastGroup.stacked.toastBoxShadow.thickness}*2)
						${toastGroup.stacked.toastBoxShadow.level2Background};
					transition: ease-in 0.2s;
					z-index: -2;
				}
				${StyledToastBody}:after {
					box-shadow: 30px calc(${toastGroup.stacked.toastBoxShadow.thickness}*2 + 1px)
						${toastGroup.stacked.toastBoxShadow.level2Background};
					transition: ease-in 0.2s;
					width: calc(100% - 60px);
					z-index: -2;
				}
			`)}
		`}
	`;
});

export const StyledTransitionGroup = styled(TransitionGroup).withConfig({ displayName: "StyledTransitionGroup-sc-" })<{
	$isMobile?: boolean;
}>(({ theme, $isMobile }) => {
	const { toastGroup } = theme.components;

	return css`
		display: flex;
		flex-direction: column;

		.${baseClassName}-enter {
			animation: ${fadeIn()} ${toastGroup.duration};
		}
		.${baseClassName}-stacked-enter {
			animation: ${fadeIn()} 0.5s;
		}
		${$isMobile &&
		css`
			.${baseClassName}-exit {
				animation: ${fadeOut()} ${toastGroup.hideDuration};
				opacity: 0;
				transition-delay: ${toastGroup.hideDuration};
				visibility: hidden;
				&:not(:last-child) {
					animation: none;
				}
			}
		`}
		${!$isMobile &&
		css`
			.${baseClassName}-exit {
				border: none;
				overflow: hidden;
				margin: 0;
				transition: all ${toastGroup.moveUpDuration};
				transition-delay: ${toastGroup.delayDuration};

				* {
					margin: 0;
					padding: 0;
					transition:
						margin ${toastGroup.duration},
						padding ${toastGroup.duration};
					transition-delay: ${toastGroup.delayDuration};
				}
			}
			.${baseClassName}-stacked-exit {
				border: none;
				overflow: hidden;
				margin: 0;
				transition: all ${toastGroup.moveUpDuration};
				transition-delay: ${toastGroup.delayDuration};

				* {
					margin: 0;
					padding: 0;
					transition:
						margin 0.5s,
						padding 0.5s;
					transition-delay: ${toastGroup.delayDuration};
				}
			}

			.${baseClassName}-exit-active {
				animation: ${slideUpAndHide} ${toastGroup.hideDuration};
				animation-fill-mode: forwards;
			}

			.${baseClassName}-stacked-exit-active {
				animation: ${slideUpAndHide} 0s;
				animation-fill-mode: forwards;
			}
		`}
	`;
});

export const StyledToastAnimation = styled.div.withConfig({ displayName: "StyledToastAnimation-sc-" })`
	&:nth-last-child(2):not(.${baseClassName}-exit) {
		transition: ${(props) =>
			`visibility 0s linear ${props.theme.components.toastGroup.hideDuration}, opacity ${props.theme.components.toastGroup.hideDuration}`};
	}
`;

export const StyledToastGroupToolbar = styled.div.withConfig({ displayName: "StyledToastGroupToolbar-sc-" })<{
	$stacking?: boolean;
}>(({ theme, $stacking }) => {
	const { toolbar, toastBoxShadow } = theme.components.toastGroup.stacked;

	return css`
		align-items: center;
		background: ${toolbar.background};
		border-top-left-radius: ${toolbar.borderRadius};
		border-top-right-radius: ${toolbar.borderRadius};
		box-shadow: ${toolbar.boxShadow};
		display: flex;
		justify-content: space-between;
		margin-right: ${$stacking && `calc(${toastBoxShadow.thickness}*2)`};
		padding: ${toolbar.padding};
		position: sticky;
		top: 0;
		transition: ease-in-out 0.2s;
		z-index: 1;
		&:focus {
			outline: none;
		}
	`;
});

export const StyledToastGroupToolbarTitle = styled.div.withConfig({ displayName: "StyledToastGroupToolbarTitle-sc-" })(
	({ theme }) => {
		const { title } = theme.components.toastGroup.stacked.toolbar;

		return css`
			color: ${title.color};
			font-family: ${title.fontFamily};
			font-size: ${title.fontSize};
			font-weight: ${title.fontWeight};
			line-height: 1.45;
		`;
	}
);
