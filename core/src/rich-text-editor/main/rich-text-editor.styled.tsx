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
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { List } from "../../list/main/list.view.js";
import { StyledListItemContent, StyledListItemMeta, StyledListItemText } from "../../list/main/list.styled.js";
import { Button } from "../../button/main/button.view.js";
import { active, activeAndHover, darkFocus, hover, inputDarkFocus } from "../../theme/base/mixins/_interaction.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { PopUpMenu } from "../../pop-up-menu/main/pop-up-menu.view.js";
import { basePortalArrow } from "../../theme/base/mixins/_portal-arrow.js";
import { breakWord } from "../../theme/base/mixins/_break-word.js";

export const StyledEditorMain = styled(StyledBaseInput.StyledFieldMain).withConfig({
	displayName: "StyledEditorMain-sc-"
})<{
	$autoExpand?: boolean;
	$withInitialHeight?: boolean;
}>`
	min-height: ${({ theme, $autoExpand, $withInitialHeight }) =>
		($autoExpand || $withInitialHeight) && theme.applicationStyles.input.height};

	> ${StyledBaseInput.StyledField} {
		min-width: 0;
	}
`;

export const StyledEditorContentWrapper = styled.div.withConfig({ displayName: "StyledEditorContentWrapper-sc-" })`
	max-height: inherit;
	min-height: inherit;
`;

export const StyledEditorInput = styled(ContentEditable).withConfig({ displayName: "StyledEditorInput-sc-" })<{
	$hasFocus?: boolean;
}>(({ theme, $hasFocus }) => {
	const { baseInput } = theme.components;

	return css`
		${$hasFocus &&
		css`
			outline-offset: ${baseInput.input.outlineOffset};
			${inputDarkFocus}
		`}
	`;
});

export const StyledEditorInputWrapper = styled(StyledBaseInput.StyledFieldInput).withConfig({
	displayName: "StyledEditorInputWrapper-sc-"
})<{
	$focused?: boolean;
	$autoExpand?: boolean;
	$withInitialHeight?: boolean;
	$singleLine?: boolean;
	$minHeight?: string | number;
	$maxHeight?: string | number;
}>(
	({
		theme,
		$disabled,
		$readonly,
		$focused,
		$error,
		$warning,
		$info,
		$autoExpand,
		$withInitialHeight,
		$singleLine,
		$minHeight,
		$maxHeight
	}) => {
		const { applicationStyles } = theme;
		const { textArea, baseInput, editor } = theme.components;
		const variant = $error ? "error" : $warning ? "warning" : $info ? "info" : undefined;
		const maxHeightValue = typeof $maxHeight === "number" ? `${$maxHeight}px` : $maxHeight;
		const minHeightValue = typeof $minHeight === "number" ? `${$minHeight}px` : $maxHeight;

		return css`
			display: block;
			height: auto;
			position: relative;
			isolation: isolate;
			max-height: ${maxHeightValue};
			min-height: ${minHeightValue};

			${breakWord}
			.tree-view-output {
				border-radius: 0 0 ${applicationStyles.input.borderRadius} ${applicationStyles.input.borderRadius};
			}
			${StyledEditorInput} {
				background-color: inherit;
				border: ${baseInput.input.border};
				border-radius: ${applicationStyles.input.borderRadius};
				color: ${applicationStyles.input.fontColor};
				font-family: ${applicationStyles.input.fontFamily};
				font-size: ${applicationStyles.input.fontSize};
				font-weight: ${applicationStyles.input.fontWeight};
				height: ${textArea.height};
				overflow: auto;
				padding: ${textArea.padding};
				position: relative;
				text-align: inherit;
				vertical-align: top;
				width: 100%;

				p:first-child,
				h1:first-child,
				h2:first-child {
					margin: 0;
				}

				${$focused &&
				css`
					box-shadow: ${variant ? baseInput.input[variant].focusBoxShadow : baseInput.input.focusBoxShadow};
					outline-offset: ${baseInput.input.outlineOffset};
					${darkFocus}
				`}
				${$disabled &&
				css`
					background: ${baseInput.input.disabled.background};
					box-shadow: ${baseInput.input.disabled.boxShadow};
					color: ${baseInput.input.disabled.color};
				`}
				${$readonly &&
				css`
					background: ${baseInput.input.readonly.background};
					box-shadow: none;
				`}
				${($disabled || $readonly) &&
				css`
					:focus-visible {
						outline: none;
					}
				`}
				${($autoExpand || $withInitialHeight || $singleLine) &&
				css`
					height: auto;
				`}
				${($autoExpand || $withInitialHeight) &&
				css`
					min-height: inherit;
					max-height: inherit;
				`}
				${$singleLine &&
				css`
					margin: ${editor.singleLine.contentMargin};
					min-height: ${applicationStyles.input.height};
					overflow-x: auto;
					padding: ${textArea.padding};
				`}
			}
		`;
	}
);

export const StyledEditorPlaceholder = styled.div.withConfig({ displayName: "StyledEditorPlaceholder-sc-" })(
	({ theme }) => {
		const { colors } = theme;

		return css`
			color: ${colors.text.secondaryColorDark};
			left: 0;
			padding: ${theme.components.textArea.padding};
			position: absolute;
			top: 0;
			user-select: none;
			pointer-events: none;
		`;
	}
);

export const StyledEditorAddon = styled(StyledBaseInput.StyledFieldAddon).withConfig({
	displayName: "StyledEditorAddon-sc-"
})<{ notSingleLine?: boolean }>`
	align-items: ${({ notSingleLine }) => notSingleLine && "flex-start"};
`;

export const StyledEditorToolbar = styled(List).withConfig({ displayName: "StyledEditorToolbar-sc-" })(({ theme }) => {
	const { toolbar } = theme.components.richTextEditor;

	return css`
		align-items: center;
		background-color: ${toolbar.background};
		border-radius: ${toolbar.borderRadius};
		box-shadow: ${toolbar.boxShadow};
		display: flex;
		flex-wrap: wrap;
		min-height: ${toolbar.minHeight};
		padding: ${toolbar.padding};

		${StyledIconWrapper} {
			color: inherit;
			font-size: ${toolbar.item.icon.fontSize};
			padding: ${toolbar.item.icon.padding};
		}
	`;
});

export const StyledEditorButtonGroupTrigger = styled(Button).withConfig({
	displayName: "StyledEditorButtonGroupTrigger-sc-"
})<{ $active?: boolean }>(({ theme, $active }) => {
	const { toolbar } = theme.components.richTextEditor;

	return css`
		border-radius: inherit;
		color: ${toolbar.item.icon.color};
		font-size: ${toolbar.item.icon.fontSize};
		gap: 0;
		position: relative;
		width: 100%;
		border: none;

		&:before {
			border-radius: inherit;
			bottom: 0;
			content: "";
			left: 0;
			right: 0;
			position: absolute;
			top: 0;
		}

		&:after {
			color: inherit;
			content: "\\e5c5";
			cursor: default;
			direction: rtl;
			font-family: "Material Icons";
			font-size: ${toolbar.item.dropdownIcon.fontSize};
			margin-right: 2px;
			overflow-wrap: normal;
			pointer-events: none;
			position: relative;
			text-align: center;
			text-transform: none;
			width: ${toolbar.item.dropdownIcon.width};
			word-break: normal;
		}

		${StyledIconWrapper} {
			padding: ${toolbar.item.groupIconPadding};
		}

		${activeAndHover(css`
			&:not(:disabled) {
				background-color: transparent;
				border: none;
			}

			&:before {
				transform: scale(0.95);
			}
		`)}
		${active(css`
			&:before {
				background-color: ${toolbar.item.icon.active.selector.background};
				border: ${toolbar.item.icon.active.border};
			}
		`)}
     	 ${hover(css`
			&:before {
				background-color: ${toolbar.item.icon.hover.background};
				border: ${toolbar.item.icon.hover.border};
			}
		`)}
      	&:focus {
			&:not(:disabled) {
				border: none;
			}

			&:before {
				background-color: ${toolbar.item.icon.focus.background};
				border: ${toolbar.item.icon.focus.border};
				${darkFocus};
				transform: none;
			}
		}

		${$active &&
		css`
			color: ${toolbar.item.icon.active.color};

			&:before {
				background-color: ${toolbar.item.icon.active.background};
				transition: transform 0.1s cubic-bezier(0.71, 0.26, 1, 1);
			}

			${active(css`
				&:not(:disabled) {
					color: ${toolbar.item.icon.active.color};
				}

				&:before {
					background-color: ${toolbar.item.icon.active.activeBG};
				}
			`)}
			${hover(css`
				&:not(:disabled) {
					color: ${toolbar.item.icon.active.color};
				}

				&:before {
					background-color: ${toolbar.item.icon.active.hoverBG};
				}
			`)}
        	&:focus {
				&:not(:disabled) {
					color: ${toolbar.item.icon.active.color};
				}

				&:before {
					background-color: ${toolbar.item.icon.active.focusBG};
				}
			}
		`}
	`;
});

export const StyledEditorButtonGroup = styled(PopUpMenu).withConfig({ displayName: "StyledEditorButtonGroup-sc-" })(
	({ theme }) => {
		const { toolbar } = theme.components.richTextEditor;

		return css`
			align-items: center;
			border-radius: ${toolbar.item.borderRadius};
			display: flex;
			height: ${toolbar.item.height};
			justify-content: center;
			min-width: ${toolbar.item.width};
			padding: ${toolbar.item.padding};
		`;
	}
);

export const StyledEditorButton = styled(List.Item).withConfig({ displayName: "StyledEditorButton-sc-" })<{
	isActive?: boolean;
}>(({ theme, disabled, isActive }) => {
	const { toolbar } = theme.components.richTextEditor;
	const { iconButton } = theme.components.button;

	return css`
		${StyledEditorToolbar} > && {
			background-color: transparent;
			border-radius: ${toolbar.item.borderRadius};
			display: flex;
			height: ${toolbar.item.height};
			justify-content: center;
			min-width: ${toolbar.item.width};
			padding: ${toolbar.item.padding};

			${StyledListItemContent} {
				border-radius: inherit;
				color: ${disabled ? "inherit" : toolbar.item.icon.color};
				flex: none;
				font-size: ${toolbar.item.icon.fontSize};
				height: ${iconButton.size};
				min-height: 0;
				padding: 0;
				position: relative;
				width: ${iconButton.size};

				&:before {
					border-radius: inherit;
				}

				${StyledListItemMeta} {
					display: none;
				}

				${StyledListItemText} {
					align-items: center;
					position: relative;
				}

				${!disabled &&
				css`
					${active(css`
						color: ${toolbar.item.icon.active.selector.color};

						&:before {
							background-color: ${toolbar.item.icon.active.selector.background};
							transform: scale(0.95);
						}
					`)}
					${hover(css`
						color: ${toolbar.item.icon.hover.color};

						&:before {
							background-color: ${toolbar.item.icon.hover.background};
							transform: scale(0.95);
						}
					`)}
            		&:focus {
						color: ${!isActive && toolbar.item.icon.focus.color};

						&:before {
							background-color: ${toolbar.item.icon.focus.background};
							${darkFocus};
							transform: none;
						}
					}

					${isActive &&
					css`
						color: ${toolbar.item.icon.active.color};

						&:before {
							background-color: ${toolbar.item.icon.active.background};
							transition: transform 0.1s cubic-bezier(0.71, 0.26, 1, 1);
						}

						${active(css`
							color: ${toolbar.item.icon.active.color};

							&:before {
								background-color: ${toolbar.item.icon.active.activeBG};
							}
						`)}
						${hover(css`
							color: ${toolbar.item.icon.active.color};

							&:before {
								background-color: ${toolbar.item.icon.active.hoverBG};
							}
						`)}
              			&:focus:before {
							background-color: ${toolbar.item.icon.active.focusBG};
						}
					`}
				`}
			}
		}

		ul:not([role="toolbar"]) && ${StyledListItemText} ${StyledIconWrapper} {
			font-size: ${toolbar.item.icon.fontSize};
			color: ${!disabled && toolbar.item.icon.color};
		}
	`;
});

export const StyledEditorSeparator = styled(List.Item).withConfig({ displayName: "StyledEditorSeparator-sc-" })(
	({ theme }) => {
		const { separator } = theme.components.richTextEditor.toolbar;

		return css`
			background-color: ${separator.background};
			height: ${separator.height};
			margin: ${separator.margin};
			width: ${separator.width};
		`;
	}
);

export const StyledEditorMentionSuggestion = styled.div.withConfig({
	displayName: "StyledEditorMentionSuggestion-sc-"
})(({ theme }) => {
	const { mention } = theme.components.richTextEditor;

	return css`
		background: ${mention.suggestions.background};
		border: ${mention.suggestions.border};
		border-radius: ${mention.suggestions.borderRadius};
		box-shadow: ${mention.suggestions.boxShadow};
		cursor: pointer;
		display: flex;
		flex-direction: column;
		max-width: ${mention.suggestions.maxWidth};
		min-width: ${mention.suggestions.minWidth};
	`;
});

export const StyledEditorMentionSuggestionItem = styled.div<{ focused?: boolean }>(({ theme, focused }) => {
	const { mention } = theme.components.richTextEditor;

	return css`
		background-color: ${focused && mention.suggestionItem.focusBG};
		padding: ${mention.suggestionItem.padding};
		transition: background-color 0.4s cubic-bezier(0.27, 1.27, 0.48, 0.56);

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		&:active {
			background-color: ${mention.suggestionItem.activeBG};
		}
	`;
});

export const StyledEditorTooltipArrow = styled.div.withConfig({ displayName: "StyledEditorTooltipArrow-sc-" })``; //Used in calculating the position of hoverable-tooltip

export const StyledEditorTooltipWrapper = styled.div.withConfig({ displayName: "StyledEditorTooltipWrapper-sc-" })(
	({ theme }) => {
		const { tooltip } = theme.components.richTextEditor;

		return css`
			background-color: ${tooltip.background};
			border: ${tooltip.border};
			border-radius: ${tooltip.borderRadius};
			box-shadow: ${tooltip.boxShadow};
			left: 50%;
			padding: ${theme.components.tooltip.content.padding};
			position: absolute;
			transform: scale(1);
			${basePortalArrow({
				orientation: "top",
				arrow: { ...tooltip, size: tooltip.arrowSize },
				selector: StyledEditorTooltipArrow
			})};

			&:after {
				content: "";
				position: absolute;
				display: block;
				width: 100%;
				height: ${tooltip.arrowSize}px;
				bottom: -${tooltip.arrowSize}px;
				left: 0;
			}
		`;
	}
);
