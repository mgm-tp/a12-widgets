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
import { Children, isValidElement, cloneElement } from "react";
import { styled, css } from "styled-components";

import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import {
	InputElements,
	StyledFieldLabel,
	StyledFieldLabelWrapper,
	StyledFieldMessageWrapper
} from "../../input/base/template/base.tpl.view.js";
import type { TooltipProps } from "../../tooltip/main/tooltip.api.js";
import { StyledBulletList } from "../../bullet-list/main/bullet-list.view.js";
import { StyledTooltipTriggerWrapper } from "../../tooltip/main/tooltip.styled.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";

import type { TextOutputProps } from "./text-output.api.js";

const baseClassName = addPrefix("text-output");
const baseFieldClassName = addPrefix("field");

const sharedIconStyle = css`
	> ${StyledIconWrapper}, > span:first-child > ${StyledIconWrapper} {
		vertical-align: middle;

		// Trick to make sure icons are aligned with the first line of content in Text Output.
		transform: translateY(-5%);
	}
`;

export const StyledTextOutputContent = styled.div.withConfig({ displayName: "StyledTextOutputContent-sc-" })<{
	$noData?: boolean;
}>(({ theme, $noData }) => {
	const { content } = theme.components.textOutput;

	return css`
		color: ${$noData ? content.noDataColor : content.color};
		display: flex;
		font-family: ${content.fontFamily};
		font-size: ${content.fontSize};
		font-style: ${$noData && "italic"};
	`;
});

export const StyledTextOutputText = styled.div.withConfig({ displayName: "StyledTextOutputText-sc-" })<{
	$noData?: boolean;
}>(({ $noData }) => {
	return css`
		display: ${$noData && "flex"};
		overflow: hidden;
		> p:first-child,
		> div:first-child > p:first-child {
			margin-top: 0;
		}
		${sharedIconStyle}
	`;
});

export const StyledTextOutputAddons = styled.div.withConfig({ displayName: "StyledTextOutputAddons-sc-" })`
	display: flex;
	flex-shrink: 0;
	height: 100%;
`;

export const StyledTextOutputFieldAddon = styled(StyledBaseInput.StyledFieldAddon).withConfig({
	displayName: "StyledTextOutputFieldAddon-sc-"
})`
	align-items: flex-start;
	height: auto;

	${StyledTooltipTriggerWrapper} {
		// Trick to make sure Tooltips are aligned with the first line of content in Text Output
		margin-top: -4px;
	}
`;

export const StyledTextOutputWrapper = styled(StyledBaseInput.StyledFieldWrapper).withConfig({
	displayName: "StyledTextOutputWrapper-sc-"
})<{
	alignment: TextOutputProps["alignment"];
}>(
	({ alignment }) => css`
		flex-direction: row;
		text-align: ${alignment === "right" || alignment === "center" ? alignment : "initial"};
		${StyledTextOutputContent} {
			justify-content: ${alignment === "right" ? "flex-end" : alignment === "center" ? "center" : "initial"};
		}
	`
);

export const StyledTextOutputParagraph = styled.p.withConfig({ displayName: "StyledTextOutputParagraph-sc-" })`
	margin: 0;
	${sharedIconStyle}
`;

export const StyledTextOutput = styled.div.withConfig({ displayName: "StyledTextOutput-sc-" })<{
	numberAddons?: number;
	hasTooltip: boolean;
}>(({ theme, numberAddons, hasTooltip }) => {
	const { baseInput } = theme.components;
	const marginRight = `calc(${baseInput.field.tooltipWidth} * ${numberAddons})`;

	return css`
		width: 100%;
		${StyledBulletList} {
			margin: 0;

			&[class*="bullet-list--no-indent"] {
				padding-left: 2ch;
			}
			li::marker {
				font-family: monospace;
				font-variant-numeric: tabular-nums;
			}

			&[class*="bullet-list--disc"] {
				li {
					list-style-type: "• ";
				}
			}

			&[class*="bullet-list--square"] {
				li {
					list-style-type: "▪ ";
				}
			}

			&[class*="bullet-list--circle"] {
				li {
					list-style-type: "⚬ ";
					font-weight: lighter;
				}
			}
		}
		> ${StyledTooltipTriggerWrapper} {
			margin: 0 0 4px 4px;
		}

		${numberAddons &&
		css`
			${!hasTooltip &&
			css`
				> ${StyledFieldLabelWrapper}, > ${StyledFieldLabel} {
					margin-right: ${marginRight};
				}
			`}

			> ${StyledTooltipTriggerWrapper}:last-of-type,
				> ${StyledFieldMessageWrapper} {
				margin-right: ${marginRight};
			}
		`}
	`;
});

export function TextOutput(props: TextOutputProps): ReactElement<TextOutputProps> {
	const addonAfterRefs: (HTMLElement | null)[] = [];

	const tooltips =
		props.tooltips &&
		Children.map(props.tooltips, (element, index) => {
			return (
				isValidElement<TooltipProps>(element) &&
				cloneElement(element, {
					key: "tooltip-" + index,
					className: joinClassNames(element.props.className, `${baseClassName}__tooltip`)
				})
			);
		});

	const addonAfters =
		props.addonAfter &&
		Children.map(props.addonAfter, (addon, index) => (
			<StyledTextOutputFieldAddon
				$position="after"
				key={`addon-${index}`}
				className={`${baseFieldClassName}-addon ${baseFieldClassName}-addon--text-output ${baseFieldClassName}-addon--after`}
				ref={(ref) => {
					addonAfterRefs.push(ref);
				}}
			>
				{addon}
			</StyledTextOutputFieldAddon>
		));

	const className = joinClassNames(
		`${baseFieldClassName}-wrapper`,
		`${baseFieldClassName}-wrapper--block`,
		{
			[`${baseClassName}-wrapper--${props.alignment}`]: props.alignment === "center" || props.alignment === "right"
		},
		{ [`${baseFieldClassName}-wrapper--addons-${addonAfters && Object.keys(addonAfters).length}`]: addonAfters },
		{ [`${baseFieldClassName}-wrapper--tooltips`]: tooltips },
		props.className
	);

	const renderContent = (content: ReactNode): ReactNode => {
		return props.disableParagraphWrapping ? (
			content
		) : (
			<StyledTextOutputParagraph data-role={DataRoles.TextOutput.Paragraph}>{content}</StyledTextOutputParagraph>
		);
	};

	return (
		<StyledTextOutputWrapper
			className={className}
			id={props.id}
			style={props.style}
			data-role={DataRoles.TextOutput}
			alignment={props.alignment}
			$block
		>
			<StyledTextOutput
				className={baseClassName}
				hasTooltip={!!tooltips}
				numberAddons={Object.keys(addonAfters ?? {}).length}
			>
				{props.label && <InputElements.Label label={props.label} id={props.id} />}
				{tooltips}
				{props.errorMessage && (
					<InputElements.Error
						className={`${baseFieldClassName}__message`}
						id={props.id}
						errorMessage={props.errorMessage}
					/>
				)}
				{props.warningMessage && (
					<InputElements.Warning
						className={`${baseFieldClassName}__message`}
						id={props.id}
						warningMessage={props.warningMessage}
					/>
				)}
				{props.infoMessage && (
					<InputElements.Info
						className={`${baseFieldClassName}__message`}
						id={props.id}
						infoMessage={props.infoMessage}
					/>
				)}
				<StyledTextOutputContent
					className={joinClassNames(`${baseClassName}__content`, {
						[`${baseClassName}__content--no-data`]: props.noData
					})}
					data-role={DataRoles.TextOutput.Content}
					$noData={props.noData}
				>
					<StyledTextOutputText
						className={`${baseClassName}__text`}
						data-role={DataRoles.TextOutput.Text}
						$noData={props.noData}
					>
						{props.noData
							? renderContent(<>&ndash;&nbsp;{props.children}&nbsp;&ndash;</>)
							: renderContent(props.children)}
					</StyledTextOutputText>
					{addonAfters && (
						<StyledTextOutputAddons className={`${baseClassName}__addons`} data-role={DataRoles.TextOutput.Addons}>
							{addonAfters}
						</StyledTextOutputAddons>
					)}
				</StyledTextOutputContent>
			</StyledTextOutput>
		</StyledTextOutputWrapper>
	);
}

TextOutput.displayName = "TextOutput";
