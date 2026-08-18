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

import type { RuleSet } from "styled-components";
import { styled, css } from "styled-components";
import { linearGradient, rgba, setLightness } from "polished";

import { StyledButton } from "../../button/main/button.styled.js";
import { Icon, StyledIconWrapper } from "../../icon/main/icon.view.js";
import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { Link, StyledLink } from "../../link/main/link/link.view.js";
import { StyledPopup } from "../../pop-up-menu/main/popup-menu.styled.js";
import {
	StyledLoadingInnerOverlay,
	StyledLoadingLabel
} from "../../progress-indicator/main/progress-indicator.styled.js";
import { StyledTextOutputText } from "../../text-output/main/text-output.view.js";
import { active, activeAndHover, hover, inputDarkFocus } from "../../theme/base/mixins/_interaction.js";
import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";
import { unseenButRead } from "../../theme/base/mixins/_unseenButRead.js";
import { StyledTooltipWrapper } from "../../tooltip/main/tooltip.styled.js";
import type { DefaultThemeType } from "../../theme/schema.js";
import { createBorder } from "../../theme/base/mixins/_borderEffects.js";
import { DataRoles } from "../../common/main/data-roles.js";

const uploadState = (params: {
	color: string;
	background?: string;
	iconColor?: string;
	inactive?: boolean;
	shouldUsePointerCursor?: boolean;
}) => {
	const { color, iconColor, background = "unset", inactive = false, shouldUsePointerCursor = false } = params;

	return css`
		border-color: ${color};

		${StyledFileUpload.StyledUploadIcon}, ${StyledFileUpload.StyledUploadText} {
			color: ${iconColor || color};
		}

		${inactive &&
		css`
			background-color: ${background};
			border-style: solid;
			cursor: ${shouldUsePointerCursor ? "pointer" : "default"};

			> ${StyledFileUpload.StyledUploadDescriptionText} {
				color: ${color};
			}
		`}
	`;
};

const uploadVariantState = (params: {
	variant: "info" | "error" | "warning";
	theme: DefaultThemeType;
	uploaded?: boolean;
}) => {
	const { variant, uploaded = false, theme } = params;
	const { fileUpload } = theme.components;

	return css`
		${uploadState({
			color: uploaded ? fileUpload.content.uploaded.borderColor[variant] : fileUpload[`${variant}Color`],
			iconColor: fileUpload.icon.variant[variant]
		})}
	`;
};

const boxShadowPin = (color: string, arg: number[]) => css`
	box-shadow:
		0 -10px 0 0 ${rgba(color, arg[0])},
		7px -7px 0 0 ${rgba(color, arg[1])},
		10px 0 0 0 ${rgba(color, arg[2])},
		7px 7px 0 0 ${rgba(color, arg[3])},
		0 10px 0 0 ${rgba(color, arg[4])},
		-7px 7px 0 0 ${rgba(color, arg[5])},
		-10px 0 0 0 ${rgba(color, arg[6])},
		-7px -7px 0 0 ${rgba(color, arg[7])};
`;

const loader = (color: string, name = "loader") => css`
	@keyframes ${name} {
		0%,
		100% {
			${boxShadowPin(color, [1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.5, 0.7])}
		}
		12.5% {
			${boxShadowPin(color, [0.7, 1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.5])}
		}
		25% {
			${boxShadowPin(color, [0.5, 0.7, 1, 0.2, 0.2, 0.2, 0.2, 0.2])}
		}
		37.5% {
			${boxShadowPin(color, [0.2, 0.5, 0.7, 1, 0.2, 0.2, 0.2, 0.2])}
		}
		50% {
			${boxShadowPin(color, [0.2, 0.2, 0.5, 0.7, 1, 0.2, 0.2, 0.2])}
		}
		62.5% {
			${boxShadowPin(color, [0.2, 0.2, 0.2, 0.5, 0.7, 1, 0.2, 0.2])}
		}
		75% {
			${boxShadowPin(color, [0.2, 0.2, 0.2, 0.2, 0.5, 0.7, 1, 0.2])}
		}
		87.5% {
			${boxShadowPin(color, [0.2, 0.2, 0.2, 0.2, 0.2, 0.5, 0.7, 1])}
		}
	}
`;

export namespace StyledFileUpload {
	export const StyledUploadWrapper = styled.div.withConfig({ displayName: "StyledUploadWrapper-sc-" })<{
		$uploadAreaSize?: {
			height?: number | string;
			width?: number | string;
			maxWidth?: number | string;
			maxHeight?: number | string;
		};
		$compact?: boolean;
		$textOnlyDisplay?: boolean;
		$hasActionItem?: boolean;
	}>(({ theme, $uploadAreaSize, $compact, $textOnlyDisplay, $hasActionItem }) => {
		const { fileUpload } = theme.components;
		const { input } = theme.applicationStyles;
		const { height, width, maxHeight, maxWidth } = $uploadAreaSize || {};

		return css`
			display: flex;
			min-height: ${fileUpload.content.minHeight};
			min-width: 48px;
			position: relative;
			width: 100%;
			height: 100%;

			${$compact &&
			css`
				align-items: center;
				flex: 1;
				min-height: ${input.height};

				${!$textOnlyDisplay &&
				css`
					height: ${input.height};
				`}

				${$hasActionItem &&
				css`
					${StyledPopup} {
						display: block;
					}

					${StyledButton} {
						height: ${input.height};
						width: ${input.height};
					}
				`}
			`}

			${$uploadAreaSize &&
			css`
				height: ${typeof height === "number" ? height + "px" : height};
				max-height: ${typeof maxHeight === "number" ? maxHeight + "px" : maxHeight};
				max-width: ${typeof maxWidth === "number" ? maxWidth + "px" : maxWidth};
				width: ${typeof width === "number" ? width + "px" : width};
			`}
		`;
	});

	export const StyledUploadText = styled.span.withConfig({ displayName: "StyledUploadText-sc-" })<{
		$hidden?: boolean;
	}>(({ theme, $hidden }) => {
		const { text } = theme.components.fileUpload;

		return css`
			color: ${text.color};
			font-family: ${text.fontFamily};
			font-size: ${text.fontSize};
			font-weight: ${text.fontWeight};
			text-transform: uppercase;

			${$hidden && unseenButRead}
		`;
	});

	export const StyledUploadDescriptionText = styled.span.withConfig({
		displayName: "StyledUploadDescriptionText-sc-"
	})<{
		desktop?: boolean;
		$hidden?: boolean;
	}>(({ theme, desktop, $hidden }) => {
		const { descriptionText } = theme.components.fileUpload;

		return css`
			color: ${descriptionText.color};
			font-size: ${descriptionText.fontSize};
			display: ${!desktop && "none"};
			margin-right: ${descriptionText.marginRight};

			${$hidden && unseenButRead}
		`;
	});

	export const StyledUploadSvgIcon = styled.svg.withConfig({ displayName: "StyledUploadSvgIcon-sc-" })<{
		preview?: boolean;
		$disabled?: boolean;
	}>(({ theme, preview, $disabled }) => {
		return css`
			max-height: inherit; // To ensure the icon is not larger than the upload area
			fill: ${preview && theme.components.fileUpload.placeholder.previewColor};
			${$disabled &&
			css`
				fill: ${preview
					? theme.components.fileUpload.disabled.color
					: theme.components.fileUpload.placeholder.disabledColor};
			`}
		`;
	});

	export const StyledUploadIcon = styled(Icon).withConfig({ displayName: "StyledUploadIcon-sc-" })<{
		$withPlaceholder?: boolean;
		$compact?: boolean;
	}>(({ theme, $withPlaceholder, $compact }) => {
		const { icon, fileNamePreview } = theme.components.fileUpload;

		return css`
			color: ${icon.color};
			font-size: ${$compact ? fileNamePreview.uploadIcon.fontSize : icon.fontSize};
			${$withPlaceholder &&
			css`
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				pointer-events: none;
			`}
		`;
	});

	export const StyledUploadActions = styled.div.withConfig({ displayName: "StyledUploadActions-sc-" })<{
		$cancelable?: boolean;
		$unavailable?: boolean;
		$fileNamePreview?: boolean;
	}>(({ theme, $cancelable, $unavailable, $fileNamePreview }) => {
		const { actionsMargin, content } = theme.components.fileUpload;

		return css`
			${!$fileNamePreview &&
			css`
				bottom: 0;
				margin: ${actionsMargin};
				position: absolute;
				right: 0;
			`}

			${$fileNamePreview &&
			css`
				${StyledButton} {
					border-radius: 0;
					border-top-right-radius: ${content.borderRadius};
					border-bottom-right-radius: ${content.borderRadius};

					${StyledIconWrapper} {
						font-size: inherit;
					}
				}
			`}

			${$cancelable &&
			!$fileNamePreview &&
			css`
				${StyledButton} {
					border-width: 1px;
				}

				${!$unavailable &&
				css`
					${StyledButton}:focus {
						outline: none !important; // Fix bug in A12W-7287
					}
				`}
			`}
		`;
	});

	export const StyledUploadInput = styled.input.withConfig({ displayName: "StyledUploadInput-sc-" })`
		display: none;
	`;

	const commonFileUploadInteractiveStyles = (state: "hover" | "focus" | "active", interactiveReadonly = false) => css`
		${({ theme }) => {
			let borderStyle: RuleSet<object> = css`
				&:before {
					border: ${theme.components.fileUpload[state].border};
				}
			`;

			if (state === "focus" && theme.components.fileUpload.focus.customBorder) {
				borderStyle = createBorder(theme.components.fileUpload.focus.customBorder, true);
			}

			return css`
				${borderStyle}

				${!interactiveReadonly &&
				css`
					${StyledUploadIcon}, ${StyledUploadText} {
						color: ${theme.components.fileUpload[state].color};
					}
				`}
			`;
		}}
	`;

	export const StyledUploadContent = styled.div.withConfig({ displayName: "StyledUploadContent-sc-" })<{
		$hasChild?: boolean;
		$loading?: boolean;
		$error?: boolean;
		$warning?: boolean;
		$info?: boolean;
		$disabled?: boolean;
		$readonly?: boolean;
		$interactiveReadonly?: boolean;
		$dragOver?: boolean;
		$withPlaceholder?: boolean;
		$cancelable?: boolean;
		$compact?: boolean;
		$hasActionItem?: boolean;
		$textOnlyDisplay?: boolean;
		$hasLoadingLabel?: boolean;
		$interactiveFileName?: boolean;
		$shouldBeInteractiveInReadonly?: boolean;
		$uploaded?: boolean;
	}>(
		({
			theme,
			$hasChild,
			$loading,
			$error,
			$warning,
			$info,
			$disabled,
			$readonly,
			$interactiveReadonly,
			$dragOver,
			$withPlaceholder,
			$cancelable,
			$compact,
			$hasActionItem,
			$textOnlyDisplay,
			$hasLoadingLabel,
			$interactiveFileName,
			$shouldBeInteractiveInReadonly,
			$uploaded
		}) => {
			const { fileUpload, button, progressIndicator, link } = theme.components;
			const { input } = theme.applicationStyles;
			const contentWidth = `calc(100% - ${fileUpload.fileNamePreview.divider.width} - ${button.iconButton.size})`;
			const progressIndicatorPadding = progressIndicator.innerOverlay.padding.split(" ");
			const innerLeftPadding =
				progressIndicatorPadding.length === 4
					? progressIndicatorPadding[3]
					: progressIndicatorPadding[
							progressIndicatorPadding.length === 2 || progressIndicatorPadding.length === 3 ? 1 : 0
						];
			const simplifiedContentPadding = fileUpload.fileNamePreview.content.padding.split(" ");
			const simplifiedContentLeftPadding =
				simplifiedContentPadding.length === 4
					? simplifiedContentPadding[3]
					: simplifiedContentPadding[
							simplifiedContentPadding.length === 2 || simplifiedContentPadding.length === 3 ? 1 : 0
						];
			const $fileNameDisplay = $compact && $hasActionItem;

			return css`
				box-sizing: border-box;
				background: ${fileUpload.content.background};
				border: ${fileUpload.content.border};
				border-radius: ${fileUpload.content.borderRadius};
				cursor: pointer;
				min-height: ${fileUpload.content.minHeight};
				outline: none;
				padding: ${fileUpload.content.padding};

				&,
				& [data-role="${DataRoles.FileUpload.Content.Inner}"] {
					align-items: center;
					display: flex;
					justify-content: center;
					height: 100%;
					max-height: inherit;
					max-width: ${$hasChild && "inherit"};
					width: 100%;
				}

				& {
					width: ${$fileNameDisplay ? contentWidth : "100%"};
				}

				& [data-role="${DataRoles.FileUpload.Content.Inner}"] {
					pointer-events: none;
				}

				${$compact &&
				css`
					min-height: ${input.height};
					padding: ${fileUpload.fileNamePreview.content.padding};
					width: ${$fileNameDisplay && contentWidth};

					& {
						justify-content: flex-start;
					}

					${!$disabled &&
					css`
						${hover(css`
							${StyledFieldUploadFileNameLink} {
								background-position: left bottom;
								transition: background-position ${link.transitionTiming};
								background-image: ${linearGradient({
									colorStops: [link.color, link.color]
								})};
								color: ${link.color};
							}
						`)}
					`}

					${$hasActionItem &&
					css`
						background-color: ${fileUpload.fileNamePreview.content.backgroundColor};
						border: ${fileUpload.fileNamePreview.content.border};
						border-bottom-right-radius: 0;
						border-top-right-radius: 0;
					`}

					${$hasLoadingLabel &&
					css`
						${StyledLoadingInnerOverlay} {
							left: calc(
								${progressIndicator.circle.size.small} + ${innerLeftPadding} + ${simplifiedContentLeftPadding}
							);
						}

						${StyledLoadingLabel} {
							cursor: pointer;
						}
					`}

          			${$textOnlyDisplay &&
					css`
						background-color: transparent;
						padding-left: 0;
						padding-right: 0;

						${StyledTextOutputText} {
							overflow: inherit;
						}
					`}
				`}

				${$loading &&
				!$compact &&
				css`
					background-color: transparent;
					border: ${fileUpload.content.loadingBorder};

					> div ${StyledUploadIcon} {
						${loader(fileUpload.icon.loading.color)}
						animation: loader 1.1s infinite ease;
						border-radius: 50%;
						font-size: ${fileUpload.icon.fontSize};
						height: ${fileUpload.icon.loading.size};
						text-indent: -9999px;
						transform: translateZ(0);
						width: ${fileUpload.icon.loading.size};
					}
				`}
				
        	${$loading &&
				$compact &&
				css`
					cursor: default;
				`}

				${$hasChild &&
				css`
					background-color: transparent;
					border: ${fileUpload.content.childBorder};
					border-radius: 0;
					overflow: hidden;
					padding: 0;
				`}

       	 	${$withPlaceholder &&
				css`
					background-color: ${fileUpload.placeholder.contentBG};
				`}

				${$info && uploadVariantState({ variant: "info", uploaded: $uploaded, theme })}
				${$warning && uploadVariantState({ variant: "warning", uploaded: $uploaded, theme })}
				${$error && uploadVariantState({ variant: "error", uploaded: $uploaded, theme })}

       		 ${$dragOver &&
				css`
					${uploadState({ color: fileUpload.hover.color })}
					background-color: ${setLightness(0.95, theme.colors.interaction.draggable.color)};
					border-color: transparent;
				`}
				
				${$readonly &&
				css`
					${uploadState({
						color: $withPlaceholder ? "transparent" : fileUpload.readonly.color,
						background: fileUpload.readonly.background,
						inactive: true,
						shouldUsePointerCursor: $shouldBeInteractiveInReadonly
					})}
					border-color: transparent;
					& svg {
						fill: ${fileUpload.placeholder.readonlyColor};
					}

					${$compact &&
					css`
						background-color: ${$textOnlyDisplay ? "transparent" : fileUpload.fileNamePreview.content.backgroundColor};
						cursor: ${$interactiveFileName ? "pointer" : "default"};
					`}
				`}
				
        	${$disabled &&
				css`
					${uploadState({
						color: fileUpload.disabled.color,
						background: fileUpload.disabled.background,
						inactive: true
					})}

					${$compact &&
					css`
						background-color: ${fileUpload.fileNamePreview.content.backgroundColor};
						border-color: transparent;
						${StyledLink} {
							color: ${fileUpload.disabled.color};
							cursor: default;
							pointer-events: none;
						}
					`}
				`}
				
				${!$disabled &&
				(!$readonly || $interactiveReadonly) &&
				css`
					${$dragOver &&
					!$loading &&
					css`
						+ ${StyledUploadActions} ${StyledButton} {
							color: ${fileUpload.hover.color};
						}

						img,
						${StyledUploadSvgIcon}[data-role="${DataRoles.FileUpload.PreviewIcon}"] {
							opacity: 0.3;
						}

						${StyledLink} {
							pointer-events: none;
						}
					`}
					svg {
						pointer-events: none; // prevent drag events being called for upload icon and preview icon
					}

					${(!$compact || ($compact && !$hasActionItem)) &&
					css`
						${activeAndHover(
							createPseudoElement(
								":before",
								css`
									border-radius: inherit;
									width: 100%;
								`
							)
						)}

						&:focus {
							${createPseudoElement(
								":before",
								css`
									${inputDarkFocus};
									border-radius: inherit;
								`
							)};

							${commonFileUploadInteractiveStyles("focus", $interactiveReadonly)}
						}
					`}

					${active(css`
						${commonFileUploadInteractiveStyles("active", $interactiveReadonly)}
					`)}
					
					${hover(css`
						${commonFileUploadInteractiveStyles("hover", $interactiveReadonly)}
					`)}
					
					${$dragOver &&
					css`
						${createPseudoElement(
							":before",
							css`
								border: ${fileUpload.hover.border};
								border-radius: inherit;
								width: ${$fileNameDisplay && !$loading ? contentWidth : "100%"};

								${StyledUploadIcon}, ${StyledUploadText}, ${StyledLink} {
									color: ${fileUpload.hover.color};
								}
							`
						)}
					`}
	
					${$cancelable &&
					css`
						${active(css`
							+ ${StyledUploadActions} ${StyledButton} {
								border: ${fileUpload.active.border};
								color: ${fileUpload.active.color};
							}
						`)}
						${hover(css`
							&:before {
								border: ${fileUpload.hover.border};
							}

							+ ${StyledUploadActions} ${StyledButton} {
								border: ${fileUpload.hover.border};
								color: ${fileUpload.hover.color};
							}
						`)}
					  	${$dragOver &&
						css`
							&:before {
								border: ${fileUpload.hover.border};
							}

							& + ${StyledUploadActions} ${StyledButton} {
								border: ${fileUpload.hover.border};
								color: ${fileUpload.hover.color};
							}
						`}
						&:focus {
							&:before {
								border: ${fileUpload.focus.border};
							}

							+ ${StyledUploadActions} ${StyledButton} {
								border: ${fileUpload.focus.border};
								color: ${fileUpload.focus.color};
							}
						}
					`}
				`}
			`;
		}
	);

	export const StyledFieldUploadWrapper = styled(StyledBaseInput.StyledField).withConfig({
		displayName: "StyledFieldUploadWrapper-sc-"
	})<{
		$horizFit?: boolean;
		$vertFit?: boolean;
		$compact?: boolean;

		/** @deprecated since 39.0.0. No longer in used. */
		$fileUploadSize?: { width: string; height: string };
	}>(({ theme, $horizFit, $vertFit, $compact, $fileUploadSize }) => {
		return css`
			${($horizFit || $vertFit) &&
			css`
				display: flex;
				flex-direction: column;

				> ${StyledUploadWrapper} {
					flex: ${!$compact ? 1 : 0};
				}
			`}

			${$vertFit &&
			css`
				height: 100%;
			`}
			
			${$horizFit &&
			css`
				width: 100%;
			`}

			${$fileUploadSize &&
			css`
				width: ${$fileUploadSize.width};
				height: ${$fileUploadSize.height};
			`}
			
			${StyledTooltipWrapper} {
				margin: ${theme.components.baseInput.input.tooltipInNewLineMargin};
			}
		`;
	});

	export const StyledFieldUploadFileNameLink = styled(Link).withConfig({
		displayName: "StyledFieldUploadFileNameLink-sc-"
	})(({ theme }) => {
		const { link, fileUpload } = theme.components;

		return css`
			background-size: ${fileUpload.fileNamePreview.content.link.backgroundSize};
			font-weight: ${fileUpload.fileNamePreview.content.fontWeight};

			${StyledIconWrapper} {
				font-size: ${fileUpload.fileNamePreview.content.iconSize};
			}

			${activeAndHover(css`
				background-image: ${linearGradient({
					colorStops: [link.color, link.color]
				})};
				color: ${link.color};
			`)}
		`;
	});

	export const StyledFieldUploadFileNameDivider = styled.div.withConfig({
		displayName: "StyledFieldUploadFileNameDivider-sc-"
	})(({ theme }) => {
		return css`
			align-items: stretch;
			width: ${theme.components.fileUpload.fileNamePreview.divider.width};
		`;
	});

	export const StyledFieldUploadInlineWrapper = styled.div.withConfig({
		displayName: "StyledFieldUploadInlineWrapper-sc-"
	})`
		display: flex;
		align-items: center;

		${StyledUploadWrapper} {
			flex: 1;
		}

		> ${StyledTooltipWrapper} {
			margin: 0;
		}
	`;
}
