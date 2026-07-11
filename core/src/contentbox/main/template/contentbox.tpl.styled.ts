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

import { useContext } from "react";
import { styled, css } from "styled-components";

import { Icon } from "../../../icon/main/icon.view.js";
import { breakWord } from "../../../theme/base/mixins/_break-word.js";
import { darkFocus } from "../../../theme/base/mixins/_interaction.js";
import { StyledPopup } from "../../../pop-up-menu/main/popup-menu.styled.js";
import { StyledButton } from "../../../button/main/button.styled.js";
import { StyledMessageBoxMainContainer } from "../../../message-box/main/message-box.styled.js";
import { StyledMasterDetailLayoutView } from "../../../layout/master-detail/main/master-detail.styled.js";
import type { SupportingPanesLayoutProps } from "../../../layout/supporting-panes-layout/index.js";
import { SupportingPanesLayoutComponents } from "../../../layout/supporting-panes-layout/index.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { ContentBoxSidePanelMode } from "./contentbox.tpl.api.js";
import { StyledContentBoxContext } from "./contentbox.context.js";

import PrimaryPane = SupportingPanesLayoutComponents.PrimaryPane;
import SecondaryPane = SupportingPanesLayoutComponents.SecondaryPane;
import SupportingPanesLayout = SupportingPanesLayoutComponents.SupportingPanesLayout;

export const StyledContentBoxHeading = styled.div.withConfig({ displayName: "StyledContentBoxHeading-sc-" })<{
	variantColor?: string;
}>(({ theme, variantColor }) => {
	const {
		contentBox: { heading, contentBoxHeaderMinHeight }
	} = theme.components;
	const { fontSize } = theme.typography;
	const { lineHeight } = theme.baseInputStyles;
	const { embedded } = useContext(StyledContentBoxContext);

	return css`
		align-items: center;
		background-color: ${heading.background};
		box-sizing: border-box;
		border-bottom: ${heading.borderBottom};
		border-top: ${heading.borderTop};
		display: flex;
		font-size: ${fontSize.mediumFontSize};
		line-height: ${lineHeight};
		min-height: ${contentBoxHeaderMinHeight};
		padding: ${heading.paddingTop} ${heading.paddingRight} ${heading.paddingBottom} ${heading.paddingLeft};
		position: relative;
		border-radius: ${heading.borderRadius};
		gap: ${heading.gap};

		${variantColor &&
		css`
			&&& {
				border-bottom-color: ${variantColor};
			}
		`}

		${embedded
			? css`
					background-color: inherit;
					border: none;
					min-height: 0;
					padding: ${theme.components.contentBox.embedded.heading.padding};
				`
			: css`
					${StyledMasterDetailLayoutView} && {
						padding: ${theme.components.masterDetailLayout.contentBoxHeaderPadding};
					}
				`}
	`;
});

export const StyledHeadingIcon = styled(Icon).withConfig({ displayName: "StyledHeadingIcon-sc-" })<{
	variantColor?: string;
}>`
	${(props) =>
		props.variantColor &&
		css`
			&&& {
				background-color: ${props.variantColor};
			}
		`}
`;

export const StyledContentBoxFooter = styled.div.withConfig({ displayName: "StyledContentBoxFooter-sc-" })(
	({ theme }) => {
		const { footer } = theme.components.contentBox;
		const { embedded } = useContext(StyledContentBoxContext);

		return css`
			align-items: center;
			box-sizing: border-box;
			background-color: ${footer.background};
			border-bottom: ${footer.borderBottom};
			border-radius: ${footer.borderRadius};
			border-top: ${footer.borderTop};
			display: flex;
			flex-shrink: 0;
			gap: ${footer.gap};
			min-height: ${footer.minHeight};
			padding: ${footer.padding};
			${embedded &&
			css`
				background-color: inherit;
				border: none;
				box-shadow: none;
				flex-shrink: 0;
				min-height: ${theme.components.contentBox.embedded.footer.minHeight};
				padding: 0;
			`}
		`;
	}
);

export const StyledContentBoxHeader = styled.div.withConfig({ displayName: "StyledContentBoxHeader-sc-" })<{
	$noGrow?: boolean;
}>(({ theme, $noGrow }) => {
	const { contentBox } = theme.components;

	return css`
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		flex: ${$noGrow ? "0 0 auto" : "1 0 auto"};
		${StyledMessageBoxMainContainer} {
			padding-left: calc(${contentBox.contentBoxHorizontalPadding} - 4px);
			padding-right: ${contentBox.contentBoxHorizontalPadding};
		}
	`;
});

export const StyledContentBoxDetailPanelHeader = styled(StyledContentBoxHeader).attrs({ $noGrow: true }).withConfig({
	displayName: "StyledContentBoxDetailPanelHeader-sc-"
})``;

export const StyledContentBoxTitleWrapper = styled.div.withConfig({ displayName: "StyledContentBoxTitleWrapper-sc-" })(
	({ theme }) => {
		const { title } = theme.components.contentBox;
		const { embedded } = useContext(StyledContentBoxContext);

		return css`
			align-items: center;
			cursor: default;
			display: flex;
			flex: 1;
			padding: 0;
			font-family: ${title.fontFamily};
			color: ${title.color};
			font-size: ${title.fontSize};
			font-weight: ${title.fontWeight};
			line-height: ${title.lineHeight};
			text-transform: none;
			${breakWord}
			${embedded &&
			css`
				color: ${theme.components.contentBox.embedded.title.color};
				font-size: ${theme.components.contentBox.embedded.title.fontSize};
				font-weight: ${theme.components.contentBox.embedded.title.fontWeight};
			`}
		`;
	}
);

export const StyledContentBoxSubtitle = styled.div.withConfig({ displayName: "StyledContentBoxSubtitle-sc-" })(
	({ theme }) => {
		const { title, subTitle } = theme.components.contentBox;
		const { embedded } = useContext(StyledContentBoxContext);

		return css`
			color: ${title.color};
			cursor: default;
			font-size: ${subTitle.fontSize};
			${breakWord}
			${embedded &&
			css`
				color: ${theme.components.contentBox.embedded.title.color};
			`}
		`;
	}
);

export const StyledContentBox = styled.div.withConfig({ displayName: "StyledContentBox-sc-" })<{
	$boxShadow?: "always" | "none" | "default";
}>(({ theme, $boxShadow }) => {
	const { components, applicationStyles } = theme;
	const { contentBox } = components;
	const { embedded } = useContext(StyledContentBoxContext);

	return css`
		background-color: ${contentBox.contentBoxBG};
		border-radius: ${contentBox.contentBoxBorderRadius};
		color: ${applicationStyles.color};
		display: flex;
		font-family: ${applicationStyles.fontFamily};
		font-size: ${applicationStyles.fontSize};
		font-family: ${contentBox.contentBoxFontFamily};
		flex-direction: column;
		flex: 1 1 100%;
		height: 100%;
		line-height: 1.45;
		max-width: 100%;
		min-height: 0;
		outline: 1px solid transparent;
		padding: 0;

		${$boxShadow === "always"
			? css`
					box-shadow: ${applicationStyles.boxShadow};
				`
			: css`
					box-shadow: ${$boxShadow === "default" ? contentBox.contentBoxBoxShadow : "none"};
				`}

		${embedded &&
		css`
			box-shadow: none;
			background-color: transparent;
			padding: ${contentBox.embedded.padding};
		`}
	`;
});

export const StyledContentBoxContent = styled.div.withConfig({ displayName: "StyledContentBoxContent-sc-" })<{
	padding?: number | string | boolean;
	$nonFooter?: boolean;
}>(({ theme, padding, $nonFooter }) => {
	const { contentBox, modalOverlay, filterSelector } = theme.components;

	return css`
		box-sizing: border-box;
		${$nonFooter &&
		css`
			border-radius: ${contentBox.content.borderRadius};
		`}
		color: ${contentBox.content.color};
		font-size: ${contentBox.content.fontSize};
		flex: 1 1 100%;
		min-height: ${contentBox.content.minHeight};
		overflow-x: hidden;
		overflow-y: auto;
		background-color: ${contentBox.content.background};
		padding: ${padding ? `${contentBox.content.padding}` : 0};

		&:focus {
			${darkFocus}
		}

		&& {
			${padding === true &&
			css`
				[data-role="${DataRoles.Modal.OverlayContent}"] & {
					padding: ${modalOverlay.contentBoxContentPadding};
				}
				[data-role="${DataRoles.Modal.OverlayContent}"] [data-role="${DataRoles.FilterSelector.Content.Secondary}"] & {
					padding: ${filterSelector.content.secondary.contentBoxContent.padding};
				}
			`}
		}
	`;
});

export const StyledContentBoxAddOn = styled.div.withConfig({ displayName: "StyledContentBoxAddOn-sc-" })(
	({ theme }) => {
		const { contentBox } = theme.components;

		return css`
			${StyledPopup} {
				${StyledButton} {
					color: ${contentBox.headingAddon.navButtonColor};

					&:focus {
						${darkFocus};
					}
				}
			}
		`;
	}
);

export const StyledSupportingPanesLayoutWrapper = styled(SupportingPanesLayout)(() => {
	return css`
		min-height: 0;
		overflow: hidden;
	`;
});

export const StyledContentBoxDetailPanel = styled(PrimaryPane)(() => {
	return css`
		border-radius: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		padding: 0;
	`;
});

export const StyledContentBoxSidePanel = styled(SecondaryPane)<
	SupportingPanesLayoutProps.SecondaryPaneProps & { $mode?: ContentBoxSidePanelMode }
>(({ theme, position, $mode }) => {
	const isOverlay = $mode === "overlay";
	const {
		contentBox: { sidePanels }
	} = theme.components;

	return css`
		border-radius: 0;
		margin-left: 0;

		${position === "right"
			? css`
					border-left: ${sidePanels.border};
					${isOverlay &&
					css`
						box-shadow: ${sidePanels.overlay?.boxShadow};
						position: absolute;
						top: 0;
						right: 0;
						height: 100%;
					`}
				`
			: css`
					border-right: ${sidePanels.border};
				`}
	`;
});

export const StyledContentBoxWizardBar = styled.div.withConfig({ displayName: "StyledContentBoxWizardBar-sc-" })<{
	collapsed?: boolean;
}>(({ theme, collapsed }) => {
	const { contentBox } = theme.components;

	return css`
		display: flex;
		flex-direction: column;
		overflow: hidden;
		max-height: 200px;
		transition: max-height 0.6s ease-in-out;
		border-bottom: ${contentBox.wizardBar.borderBottom};
		${collapsed &&
		css`
			max-height: 0;
			transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
		`}
	`;
});
