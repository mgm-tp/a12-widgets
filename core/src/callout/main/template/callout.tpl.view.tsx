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
import { styled, css } from "styled-components";

import { provider as DeviceDetector } from "../../../common/main/device-detector.js";
import { darkFocus } from "../../../theme/base/mixins/_interaction.js";
import { joinClassNames, addPrefix } from "../../../common/main/utils.js";
import type { Orientation } from "../../../common/main/alignment.js";
import { StyledGrid } from "../../../layout/layout-grid/main/layout-grid.styled.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { StyledButton } from "../../../button/main/button.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { CalloutTplProps } from "./callout.tpl.api.js";

const baseClassName = addPrefix("callout");

export const StyledCalloutInner = styled.div.withConfig({ displayName: "StyledCalloutInner-sc-" })<{
	hasHeader?: boolean;
}>(({ theme, hasHeader }) => {
	const { inner } = theme.components.callout;

	return css`
		background-color: ${inner.backgroundColor};
		box-shadow: ${inner.boxShadow};
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		padding: ${inner.padding};
		${hasHeader &&
		css`
			padding-top: 0;
		`}
	`;
});

export const StyledCalloutHeader = styled.div.withConfig({ displayName: "StyledCalloutHeader-sc-" })(({ theme }) => {
	const { header } = theme.components.callout;

	return css`
		align-items: center;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		flex-shrink: 0;
		min-height: ${header.minHeight};
	`;
});

export const StyledCalloutHeaderTitle = styled.div.withConfig({ displayName: "StyledCalloutHeaderTitle-sc-" })(
	({ theme }) => {
		const { headerTitle } = theme.components.callout;

		return css`
			align-items: center;
			display: flex;
			justify-content: space-between;
			width: 100%;
			& > *:first-child {
				font-family: ${headerTitle.fontFamily};
				font-weight: ${headerTitle.fontWeight};
				color: ${headerTitle.fontColor};
				font-size: ${headerTitle.fontSize};
				line-height: ${headerTitle.lineHeight};
				margin: 0;
			}
		`;
	}
);

export const StyledCalloutHeaderSuffix = styled.div.withConfig({ displayName: "StyledCalloutHeaderSuffix-sc-" })(
	({ theme }) => {
		const { headerSuffix } = theme.components.callout;

		return css`
			align-self: center;
			display: flex;
			flex: none;
			gap: ${headerSuffix.gap};

			${StyledButton} {
				font-size: ${theme.components.callout.headerSuffix.fontSize};
				width: auto;
				height: auto;
				min-height: 0;
			}
			${StyledIconWrapper} {
				font-size: ${headerSuffix.fontSize};
			}
		`;
	}
);

export const StyledCalloutPointer = styled.div.withConfig({ displayName: "StyledCalloutPointer-sc-" })<{
	calloutOrientation?: Orientation;
}>(({ theme, calloutOrientation }) => {
	const { pointer } = theme.components.callout;
	let extendStyle;

	switch (calloutOrientation) {
		case "bottom":
			extendStyle = css`
				left: 50%;
				transform: translate(0, -50%) rotate(45deg);
				top: 0;
			`;
			break;

		case "bottom-start":
			extendStyle = css`
				left: 10px;
				transform: translate(0, -50%) rotate(45deg);
				top: 0;
			`;
			break;

		case "bottom-end":
			extendStyle = css`
				right: 10px;
				transform: translate(0, -50%) rotate(45deg);
				top: 0;
			`;
			break;

		case "top":
			extendStyle = css`
				bottom: 0;
				left: 50%;
				transform: translate(0, 50%) rotate(45deg);
			`;
			break;

		case "top-start":
			extendStyle = css`
				bottom: 0;
				left: 10px;
				transform: translate(0, 50%) rotate(45deg);
			`;
			break;

		case "top-end":
			extendStyle = css`
				bottom: 0;
				right: 10px;
				transform: translate(0, 50%) rotate(45deg);
			`;
			break;

		case "left":
			extendStyle = css`
				bottom: 0;
				right: 0;
				transform: translate(50%, -50%) rotate(45deg);
			`;
			break;

		case "left-start":
			extendStyle = css`
				right: 0;
				transform: translate(50%, -50%) rotate(45deg);
				top: 15px;
			`;
			break;

		case "left-end":
			extendStyle = css`
				bottom: 10px;
				right: 0;
				transform: translate(50%, -50%) rotate(45deg);
			`;
			break;

		case "right":
			extendStyle = css`
				bottom: 0;
				left: 0;
				transform: translate(-50%, -50%) rotate(45deg);
			`;
			break;

		case "right-start":
			extendStyle = css`
				left: 0;
				transform: translate(-50%, -50%) rotate(45deg);
				top: 15px;
			`;
			break;

		case "right-end":
			extendStyle = css`
				bottom: 10px;
				left: 0;
				transform: translate(-50%, -50%) rotate(45deg);
			`;
			break;

		default:
			break;
	}

	return css`
		background-color: ${pointer.backgroundColor};
		outline: 1px solid transparent;
		position: absolute;
		pointer-events: none;
		height: ${pointer.height};
		width: ${pointer.width};
		${extendStyle}
	`;
});

export const StyledCalloutBody = styled.div.withConfig({ displayName: "StyledCalloutBody-sc-" })(({ theme }) => {
	const { body, header, footer } = theme.components.callout;

	return css`
		box-sizing: border-box;
		background-color: ${body.backgroundColor};
		color: ${body.fontColor};
		display: flex;
		font-family: ${body.fontFamily};
		font-size: ${body.fontSize};
		line-height: ${body.lineHeight};
		flex-direction: column;
		height: 100%;
		overflow: auto;
		padding: ${body.padding};
		position: relative;
		&:not(:empty) {
			min-height: ${body.minHeight};
			& + ${StyledCalloutFooter} {
				border-top: ${footer.borderTop};
				max-height: calc(100% - ${body.minHeight} - ${header.minHeight});
			}
		}
		& > ${StyledGrid} {
			width: inherit;
		}
		&:focus {
			${darkFocus}
		}
	`;
});

export const StyledCalloutFooter = styled.div.withConfig({ displayName: "StyledCalloutFooter-sc-" })(({ theme }) => {
	const { body, footer } = theme.components.callout;

	return css`
		box-sizing: border-box;
		background-color: ${body.backgroundColor};
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		padding: ${footer.padding};
		min-height: ${footer.minHeight};
		max-height: 100%;
		overflow: hidden;
		gap: ${footer.gap};
		& > * {
			padding: ${footer.childPadding};
		}
	`;
});

export const StyledCalloutWrapper = styled.div.withConfig({ displayName: "StyledCalloutWrapper-sc-" })<{
	calloutOrientation?: Orientation;
	hasPointer?: boolean;
	hasDefinedWidth: boolean;
}>(({ theme, hasDefinedWidth, hasPointer, calloutOrientation }) => {
	return css`
		display: flex;
		flex-direction: column;
		min-width: 0;
		outline: 1px solid transparent;
		position: relative;
		width: ${hasDefinedWidth ? theme.components.callout.width : "100%"};
		${hasPointer &&
		calloutOrientation &&
		css`
			${["top", "top-start", "top-end"].includes(calloutOrientation) &&
			css`
				margin-bottom: 15px;
			`}

			${["bottom", "bottom-start", "bottom-end"].includes(calloutOrientation) &&
			css`
				margin-top: 15px;
			`}

			${["left", "left-end", "left-start"].includes(calloutOrientation) &&
			css`
				margin-right: 15px;
				max-height: calc(100vh - 16px);
			`}

			${["right", "right-end", "right-start"].includes(calloutOrientation) &&
			css`
				margin-left: 15px;
				max-height: calc(100vh - 16px);
				transform: translateX(0);
			`}
		`}
	`;
});

export function CalloutTpl(props: CalloutTplProps): ReactElement<CalloutTplProps> {
	const hasDefinedWidth = !DeviceDetector.isPhone();
	const headerTitleId = props.header?.title && props.id ? `${props.id}-header-title` : undefined;

	return (
		<StyledCalloutWrapper
			hasDefinedWidth={hasDefinedWidth}
			calloutOrientation={props.calloutOrientation}
			hasPointer={props.isPointerVisible}
			className={joinClassNames(
				baseClassName,
				{ [`${baseClassName}--hasPointer`]: props.isPointerVisible },
				props.className
			)}
			id={props.id}
			style={props.style}
			ref={props.wrapperRef}
			data-role={DataRoles.Callout}
			aria-labelledby={headerTitleId}
			{...props.htmlAttributes}
		>
			{props.isPointerVisible && (
				<StyledCalloutPointer
					calloutOrientation={props.calloutOrientation}
					className={`${baseClassName}__pointer`}
					data-role={DataRoles.Callout.Pointer}
					style={props.pointerPosition}
				/>
			)}
			<StyledCalloutInner
				hasHeader={!!(props.header && (props.header.prefix || props.header.suffix || props.header.title))}
				className={`${baseClassName}__inner`}
				data-role={DataRoles.Callout.Inner}
			>
				{props.header && (props.header.prefix || props.header.suffix || props.header.title) && (
					<StyledCalloutHeader className={`${baseClassName}__header`} data-role={DataRoles.Callout.Header}>
						{props.header.prefix && (
							<div className={`${baseClassName}__header-prefix`} data-role={DataRoles.Callout.Header.Prefix}>
								{props.header.prefix}
							</div>
						)}
						{props.header.title && (
							<StyledCalloutHeaderTitle
								className={joinClassNames(`${baseClassName}__header-title`, {
									[addPrefix("handle")]: props.resizeAndDrag
								})}
								data-role={DataRoles.Callout.Header.Title}
								id={headerTitleId}
							>
								{props.header.title}
							</StyledCalloutHeaderTitle>
						)}
						{props.header.suffix && (
							<StyledCalloutHeaderSuffix
								className={`${baseClassName}__header-suffix`}
								data-role={DataRoles.Callout.Header.Suffix}
							>
								{props.header.suffix}
							</StyledCalloutHeaderSuffix>
						)}
					</StyledCalloutHeader>
				)}
				<StyledCalloutBody
					ref={props.bodyRef}
					className={`${baseClassName}__body`}
					data-role={DataRoles.Callout.Body}
					style={{
						padding: typeof props.padding !== "boolean" ? props.padding : !props.padding ? 0 : undefined
					}}
				>
					{props.children}
				</StyledCalloutBody>
				{props.footer && (
					<StyledCalloutFooter className={`${baseClassName}__footer`} data-role={DataRoles.Callout.Footer}>
						{props.footer}
					</StyledCalloutFooter>
				)}
			</StyledCalloutInner>
		</StyledCalloutWrapper>
	);
}

CalloutTpl.displayName = "CalloutTpl";
