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

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { Icon, StyledIconWrapper } from "../../../icon/main/icon.view.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { unseenButRead } from "../../../theme/base/mixins/_unseenButRead.js";
import {
	StyledBulletList,
	StyledBulletListContent,
	StyledBulletListItem
} from "../../../bullet-list/main/bullet-list.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { ErrorProps, InfoProps, LabelProps, SelectionSuffixProps, WarningProps } from "./base.tpl.api.js";

const baseLabelClassName = addPrefix("label");
const baseMessageClassName = addPrefix("message");
const baseFieldClassName = addPrefix("field");

export const StyledFieldLabelGraphicWrapper = styled.div.withConfig({
	displayName: "StyledFieldLabelGraphicWrapper-sc-"
})<{
	$disabled?: boolean;
}>(({ theme, $disabled }) => {
	const { label } = theme.applicationStyles;

	return css`
		display: flex;
		cursor: default; // Ensure the cursor remains default, as the label graphic is a non-interactive element.
		user-select: none;

		* {
			color: ${$disabled ? label.disabledColor : label.fontColor};
		}
	`;
});

export const StyledFieldLabelWrapper = styled.div.withConfig({ displayName: "StyledFieldLabelWrapper-sc-" })<{
	$hidden?: boolean;
}>(({ theme, $hidden }) => {
	const { input } = theme.components.baseInput;

	return css`
		display: flex;
		gap: ${input.labelGap};

		${StyledFieldLabel} {
			margin: 0;
		}

		${!$hidden &&
		css`
			margin: ${input.labelMargin};
		`}
	`;
});

export const StyledFieldLabel = styled.label.withConfig({ displayName: "StyledFieldLabel-sc-" })<{
	$disabled?: boolean;
	$hidden?: boolean;
}>(({ theme, $disabled, $hidden }) => {
	const { label } = theme.applicationStyles;
	const { input } = theme.components.baseInput;
	const { lineHeight } = theme.baseInputStyles;

	return css`
		color: ${label.fontColor};
		display: inline-block;
		font-family: ${label.fontFamily};
		font-size: ${label.fontSize};
		font-weight: ${label.fontWeight};
		line-height: ${lineHeight};
		text-transform: ${label.textTransform};
		margin: ${input.labelMargin};
		align-self: center;

		${$disabled &&
		css`
			color: ${label.disabledColor};
		`}

		&:empty {
			display: none;
		}

		${$hidden && unseenButRead}
	`;
});

export const StyledFieldMessageWrapper = styled.div.withConfig({ displayName: "StyledFieldMessageWrapper-sc-" })<{
	$error?: boolean;
	$warning?: boolean;
	$info?: boolean;
}>(({ theme, $warning, $error, $info }) => {
	const { message, input } = theme.components.baseInput;

	return css`
		display: flex;
		font-family: ${message.fontFamily};
		font-size: ${message.fontSize};
		font-weight: ${message.fontWeight};
		margin: ${input.messageMargin};
		padding: ${message.padding};

		${StyledBulletList} > ${StyledBulletListItem},
      	${StyledBulletListContent} {
			color: inherit;
		}

		${$warning &&
		css`
			background: ${message.warning.background};
			color: ${message.warning.color};
		`}
		${$error &&
		css`
			background: ${message.error.background};
			color: ${message.error.color};
		`}
		${$info &&
		css`
			background: ${message.info.background};
			color: ${message.info.color};
		`}
	`;
});

const StyledFieldMessageIconWrapper = styled.div.withConfig({ displayName: "StyledFieldMessageIconWrapper-sc-" })(
	({ theme }) => {
		const { message } = theme.components.baseInput;

		return css`
			display: flex;
			margin-right: ${message.iconMarginRight};

			${StyledIconWrapper} {
				font-size: ${message.iconFontSize};
			}
		`;
	}
);

export const StyledFieldMessageTextWrapper = styled.div.withConfig({
	displayName: "StyledFieldMessageTextWrapper-sc-"
})(({ theme }) => {
	const { message } = theme.components.baseInput;

	return css`
		align-self: center;
		max-width: calc(100% - (${message.iconFontSize} + ${message.iconMarginRight}));

		> ul,
		> ${StyledBulletList} {
			margin: 0;
			padding-left: ${message.textListPaddingLeft};
		}
	`;
});

export const StyledSelectionSuffix = styled(Icon).withConfig({ displayName: "StyledSelectionSuffix-sc-" })<{
	$disabled?: boolean;
}>(({ theme, $disabled }) => {
	const { selectionSuffixColor } = theme.components.baseInput;

	return css`
		color: ${selectionSuffixColor};
		user-select: none;
		${$disabled
			? css`
					color: inherit;
					cursor: default;
				`
			: css`
					cursor: pointer;
				`}
	`;
});

export function Label(props: LabelProps): ReactElement<LabelProps> {
	const classNames = joinClassNames(
		baseLabelClassName,
		`${baseFieldClassName}__label`,
		{ [`${baseLabelClassName}--disabled`]: props.disabled },
		{ [addPrefix("-u-unseenButRead")]: props.hide },
		props.className
	);

	return props.label ? (
		props.graphic ? (
			<StyledFieldLabelWrapper $hidden={props.hide}>
				<StyledFieldLabelGraphicWrapper
					$disabled={props.disabled}
					data-role={DataRoles.Label.Graphic}
					data-disabled={props.disabled}
				>
					{props.graphic}
				</StyledFieldLabelGraphicWrapper>
				<StyledFieldLabel
					$disabled={props.disabled}
					$hidden={props.hide}
					htmlFor={props.htmlFor}
					data-role={props.dataRole ?? DataRoles.Label}
					data-disabled={props.disabled}
					id={props.id ? `${props.id}-label` : undefined}
					className={classNames}
					style={props.style}
					ref={props.wrapperRef}
					onClick={props.onClick}
					onKeyDown={props.onKeyDown}
				>
					{props.label}
				</StyledFieldLabel>
			</StyledFieldLabelWrapper>
		) : (
			<StyledFieldLabel
				$disabled={props.disabled}
				$hidden={props.hide}
				htmlFor={props.htmlFor}
				data-role={props.dataRole ?? DataRoles.Label}
				data-disabled={props.disabled}
				id={props.id ? `${props.id}-label` : undefined}
				className={classNames}
				style={props.style}
				ref={props.wrapperRef}
				onClick={props.onClick}
				onKeyDown={props.onKeyDown}
			>
				{props.label}
			</StyledFieldLabel>
		)
	) : (
		<></>
	);
}

Label.displayName = "Label";

export function Error(props: ErrorProps): ReactElement<ErrorProps> {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const classNames = joinClassNames(baseMessageClassName, `${baseMessageClassName}--error`, props.className);

	return (
		<StyledFieldMessageWrapper
			id={props.id ? `${props.id}-error` : undefined}
			$error={true}
			data-role={props.dataRole ?? DataRoles.Error.Message}
			className={classNames}
			style={props.style}
			ref={props.wrapperRef}
		>
			<StyledFieldMessageIconWrapper className={`${baseMessageClassName}Icon`}>
				<Icon title={languageContext.baseInputTitles?.errorIconTitle} variant="error" iconTheme="custom">
					error
				</Icon>
			</StyledFieldMessageIconWrapper>
			<StyledFieldMessageTextWrapper className={`${baseMessageClassName}Text`} data-role={DataRoles.Error.Text}>
				{props.errorMessage}
			</StyledFieldMessageTextWrapper>
		</StyledFieldMessageWrapper>
	);
}

Error.displayName = "Error";

export function Warning(props: WarningProps): ReactElement<WarningProps> {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const classNames = joinClassNames(baseMessageClassName, `${baseMessageClassName}--warning`, props.className);

	return (
		<StyledFieldMessageWrapper
			id={props.id ? `${props.id}-warning` : undefined}
			$warning={true}
			data-role={props.dataRole ?? DataRoles.Warning.Message}
			className={classNames}
			style={props.style}
			ref={props.wrapperRef}
		>
			<StyledFieldMessageIconWrapper className={`${baseMessageClassName}Icon`}>
				<Icon title={languageContext.baseInputTitles?.warningIconTitle} variant="warning">
					warning
				</Icon>
			</StyledFieldMessageIconWrapper>
			<StyledFieldMessageTextWrapper className={`${baseMessageClassName}Text`} data-role={DataRoles.Warning.Text}>
				{props.warningMessage}
			</StyledFieldMessageTextWrapper>
		</StyledFieldMessageWrapper>
	);
}

Warning.displayName = "Warning";

export function Info(props: InfoProps): ReactElement<InfoProps> {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);

	return (
		<StyledFieldMessageWrapper
			id={props.id ? `${props.id}-info` : undefined}
			$info={true}
			data-role={props.dataRole ?? DataRoles.Info.Message}
			className={props.className}
			style={props.style}
			ref={props.wrapperRef}
		>
			<StyledFieldMessageIconWrapper>
				<Icon title={languageContext.baseInputTitles?.infoIconTitle} variant="info">
					info
				</Icon>
			</StyledFieldMessageIconWrapper>
			<StyledFieldMessageTextWrapper data-role={DataRoles.Info.Text}>{props.infoMessage}</StyledFieldMessageTextWrapper>
		</StyledFieldMessageWrapper>
	);
}

Info.displayName = "Info";

export function SelectionSuffix(props: SelectionSuffixProps): ReactElement<SelectionSuffixProps> {
	return (
		<StyledSelectionSuffix
			size="big"
			id={props.id}
			className={props.className}
			style={props.style}
			$disabled={props.disabled}
			onClick={props.onClick}
			dataRole={props.dataRole ?? DataRoles.SelectionSuffix}
			htmlAttributes={{ "aria-hidden": true }}
		>
			expand_more
		</StyledSelectionSuffix>
	);
}

SelectionSuffix.displayName = "SelectionSuffix";

const InputElements = {
	Label,
	Error,
	Warning,
	SelectionSuffix,
	Info
};
export { InputElements };
