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

import type { KeyboardEvent, MouseEvent, TouchEvent, FocusEvent, ReactElement, ReactNode, ContextType } from "react";
import { Component, useContext, useRef, useState } from "react";
import { styled, css } from "styled-components";
import { Key } from "ts-key-enum";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import {
	bindMethods,
	joinClassNames,
	addPrefix,
	getAllFocusableElements,
	getParentElement,
	getNearestFocusableParent
} from "../../common/main/utils.js";
import { Icon, StyledIconWrapper } from "../../icon/main/icon.view.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";
import { active, hover } from "../../theme/base/mixins/_interaction.js";

import type { CollapsiblePanelProps } from "./collapsible-panel.api.js";

const baseClassName = addPrefix("collapsiblePanel");

export const StyledCollapsiblePanelContent = styled.div.withConfig({
	displayName: "StyledCollapsiblePanelContent-sc-"
})(({ theme }) => {
	return css`
		color: ${theme.components.collapsiblePanel.content.color};
	`;
});

export const StyledCollapsiblePanelAddons = styled.div.withConfig({ displayName: "StyledCollapsiblePanelAddons-sc-" })(
	({ theme }) => css`
		align-items: center;
		display: flex;
		gap: ${theme.components.collapsiblePanel.addons.gap};
	`
);

export const StyledCollapsiblePanelLabelInfo = styled.span.withConfig({
	displayName: "StyledCollapsiblePanelLabelInfo-sc-"
})(({ theme }) => {
	const { fontStyle, fontWeight } = theme.components.collapsiblePanel.labelInfo;

	return css`
		display: inline-block;
		font-style: ${fontStyle};
		font-weight: ${fontWeight};
	`;
});

export const StyledCollapsiblePanelLabelText = styled.div.withConfig({
	displayName: "StyledCollapsiblePanelLabelText-sc-"
})`
	display: inline;
`;

export const StyledCollapsiblePanelIndicator = styled.div.withConfig({
	displayName: "StyledCollapsiblePanelIndicator-sc-"
})<{ $swapAddonsPosition?: boolean }>(({ theme, $swapAddonsPosition }) => {
	const { backgroundColor, borderRadius, width, marginRight, fontSize } = theme.components.collapsiblePanel.indicator;
	const iconStyle = theme.components.collapsiblePanel.icon;

	return css`
		align-items: center;
		align-self: flex-start;
		background-color: ${backgroundColor};
		border-radius: ${borderRadius};
		display: flex;
		margin-right: ${marginRight};
		position: absolute;
		top: calc((1.125rem - ${fontSize}) * 0.5);
		width: ${width};

		${
			$swapAddonsPosition
				? css`
						right: 0;
					`
				: css`
					left: calc(-${marginRight} - ${fontSize});
				`
		}

		${StyledIconWrapper} {
			color: ${iconStyle.color};
			font-size: ${fontSize};
		}
	`;
});

export const StyledCollapsiblePanelLabel = styled.div.withConfig({ displayName: "StyledCollapsiblePanelLabel-sc-" })<{
	$swapAddonsPosition?: boolean;
}>(({ theme, $swapAddonsPosition }) => {
	const { collapsiblePanel } = theme.components;

	return css`
		flex: 1;
		line-height: 1.125rem;
		margin-left: ${
			$swapAddonsPosition
				? collapsiblePanel.indicator.marginRight
				: `calc(${collapsiblePanel.indicator.fontSize} + ${collapsiblePanel.indicator.marginRight})`
		};
		outline: none;
		position: relative;
	`;
});

export const StyledCollapsiblePanelTitle = styled.div.withConfig({ displayName: "StyledCollapsiblePanelTitle-sc-" })<{
	$noEffect?: boolean;
	$noFocus?: boolean;
}>(({ theme, $noEffect, $noFocus }) => {
	const {
		backgroundColor,
		color,
		fontSize,
		fontWeight,
		padding,
		activeBackgroundColor,
		activeBoxShadow,
		hoverBackgroundColor,
		hoverBoxShadow,
		focusByTab
	} = theme.components.collapsiblePanel.title;
	const iconStyle = theme.components.collapsiblePanel.icon;

	return css`
		align-items: center;
		box-sizing: border-box;
		background-color: ${backgroundColor};
		color: ${color};
		display: flex;
		flex-direction: row;
		font-size: ${fontSize};
		font-weight: ${fontWeight};
		min-height: inherit;
		outline: none;
		padding: ${padding};
		${
			!$noEffect &&
			css`
				${active(css`
					background-color: ${activeBackgroundColor};
					box-shadow: ${activeBoxShadow};
					cursor: pointer;
				`)}
				${hover(css`
					background-color: ${hoverBackgroundColor};
					box-shadow: ${hoverBoxShadow};
					cursor: pointer;
				`)}
			`
		}
		${
			!$noFocus &&
			css`
				&:focus-within {
					background-color: ${focusByTab.backgroundColor};
					color: ${focusByTab.color};
					position: relative;
					${StyledIconWrapper} {
						color: ${iconStyle.focusColor};
					}
					&:before {
						border: ${focusByTab.border};
						bottom: 0;
						content: "";
						left: 0;
						position: absolute;
						pointer-events: none;
						right: 0;
						top: 0;
					}
				}
			`
		}
	`;
});

export const StyledCollapsiblePanelWrapper = styled.div.withConfig({
	displayName: "StyledCollapsiblePanelWrapper-sc-"
})(({ theme }) => {
	const { minHeight, fontFamily, fontSize } = theme.components.collapsiblePanel;

	return css`
		display: flex;
		flex-direction: column;
		font-family: ${fontFamily};
		font-size: ${fontSize};
		min-height: ${minHeight};
	`;
});

function CollapsiblePanelImpl(props: CollapsiblePanelProps): ReactElement<CollapsiblePanelProps> {
	const { addons, ariaLevel, children, className, id, info, onClick, role, style, swapAddonsPosition, title } = props;

	const [isAddonHoveredOrTouched, setIsAddonHoveredOrTouched] = useState(false);
	const [isAddonFocused, setIsAddonFocused] = useState(false);

	const labelRef = useRef<HTMLDivElement | null>(null);

	const { collapsiblePanelTitles: panelTitles } = useContext(A11YLanguageContext);
	const collapsiblePanelTitle = children ? panelTitles?.closePanel : panelTitles?.openPanel;

	const { title: resolvedTitle, hintRenderer } = useInteractionHint({
		title: collapsiblePanelTitle,
		componentKey: "collapsiblePanel",
		referenceElementRef: labelRef
	});

	function handleClick(): void {
		labelRef.current?.focus();
		onClick();
	}

	function handleKeyUp(event: KeyboardEvent): void {
		if (event.key === Key.Enter) {
			onClick();
		}
	}

	function handleHoverOrTouchAddon(
		event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
		isHovered: boolean
	): void {
		const nearestFocusableParentElement = getNearestFocusableParent(event.target as HTMLElement);

		if (getAllFocusableElements(event.currentTarget).length > 0) {
			setIsAddonHoveredOrTouched(
				isHovered && !!nearestFocusableParentElement && event.currentTarget.contains(nearestFocusableParentElement)
			);
		}
	}

	function handleFocusAddon(event: FocusEvent<HTMLElement>, isFocused: boolean): void {
		if (getAllFocusableElements(event.currentTarget).length > 0) {
			setIsAddonFocused(isFocused);
		}
	}

	function handleWrapperMouseOver(event: MouseEvent<HTMLDivElement>): void {
		const target = event.target as HTMLElement;
		const nearestFocusableParentElement = getNearestFocusableParent(target);
		const addon =
			target.getAttribute("data-role") === `${DataRoles.CollapsiblePanelAddons}`
				? target
				: getParentElement(
						target,
						(currentParent) => currentParent.getAttribute("data-role") === `${DataRoles.CollapsiblePanelAddons}`
					);
		const isInteractiveAddon =
			!!addon && !!nearestFocusableParentElement && event.currentTarget.contains(nearestFocusableParentElement);
		setIsAddonHoveredOrTouched(isInteractiveAddon);
	}

	function graphicIconRenderer(): ReactElement {
		return (
			<StyledCollapsiblePanelIndicator
				className={`${baseClassName}__indicator`}
				data-role={DataRoles.CollapsiblePanel.Indicator}
				$swapAddonsPosition={swapAddonsPosition}
			>
				<Icon>{children ? "keyboard_arrow_down" : "keyboard_arrow_right"}</Icon>
			</StyledCollapsiblePanelIndicator>
		);
	}

	function addonsRenderer(): ReactElement | null {
		return addons ? (
			<StyledCollapsiblePanelAddons
				className={`${baseClassName}__add-ons`}
				data-role={DataRoles.CollapsiblePanelAddons}
				onMouseOver={(event) => handleHoverOrTouchAddon(event, true)}
				onMouseLeave={(event) => handleHoverOrTouchAddon(event, false)}
				onTouchStart={(event) => handleHoverOrTouchAddon(event, true)}
				onTouchEnd={(event) => handleHoverOrTouchAddon(event, false)}
				onFocus={(event) => handleFocusAddon(event, true)}
				onBlur={(event) => handleFocusAddon(event, false)}
			>
				{addons}
			</StyledCollapsiblePanelAddons>
		) : null;
	}

	return (
		<StyledCollapsiblePanelWrapper
			className={joinClassNames(baseClassName, className)}
			id={id}
			style={style}
			data-role={DataRoles.CollapsiblePanel}
		>
			<StyledCollapsiblePanelTitle
				$noEffect={isAddonHoveredOrTouched}
				$noFocus={isAddonHoveredOrTouched || isAddonFocused}
				className={joinClassNames(
					`${baseClassName}__title`,
					{
						[`${baseClassName}__title--no-effect`]: isAddonHoveredOrTouched
					},
					{
						[`${baseClassName}__title--no-focus`]: isAddonHoveredOrTouched || isAddonFocused
					}
				)}
				data-role={DataRoles.CollapsiblePanel.Header}
				aria-level={ariaLevel}
				role={role}
				onClick={handleClick}
				onKeyUp={handleKeyUp}
				onMouseOver={handleWrapperMouseOver}
			>
				{swapAddonsPosition && addonsRenderer()}
				<StyledCollapsiblePanelLabel
					className={`${baseClassName}__label`}
					role="button"
					tabIndex={0}
					aria-expanded={children ? "true" : "false"}
					data-role={DataRoles.CollapsiblePanel.Title.Wrapper}
					ref={labelRef}
					$swapAddonsPosition={swapAddonsPosition}
					title={resolvedTitle}
				>
					{!swapAddonsPosition && graphicIconRenderer()}
					<StyledCollapsiblePanelLabelText
						className={`${baseClassName}__label--text`}
						data-role={DataRoles.CollapsiblePanel.Title}
					>
						{title}
					</StyledCollapsiblePanelLabelText>
					{info && (
						<StyledCollapsiblePanelLabelInfo
							className={`${baseClassName}__label--info`}
							data-role={DataRoles.CollapsiblePanel.Info}
						>
							&nbsp;- {info}
						</StyledCollapsiblePanelLabelInfo>
					)}
					{collapsiblePanelTitle && !!hintRenderer && <HiddenText>{collapsiblePanelTitle}</HiddenText>}
					{swapAddonsPosition && graphicIconRenderer()}
				</StyledCollapsiblePanelLabel>
				{!swapAddonsPosition && addonsRenderer()}
				{hintRenderer?.()}
			</StyledCollapsiblePanelTitle>
			{children && (
				<StyledCollapsiblePanelContent
					className={`${baseClassName}__content`}
					role="document"
					data-role={DataRoles.CollapsiblePanel.Content}
				>
					{children}
				</StyledCollapsiblePanelContent>
			)}
		</StyledCollapsiblePanelWrapper>
	);
}

CollapsiblePanelImpl.displayName = "CollapsiblePanelImpl";

/**
 * A panel with a clickable title that toggles its content.
 *
 * @remarks
 * The implementation is a function component built on hooks. `CollapsiblePanel` itself stays a thin class shell that
 * renders it, so consumers that hold a `ref` to the component instance, annotate `typeof CollapsiblePanel` as a class
 * or subclass it keep compiling and working. New code should not rely on any of these.
 */
export class CollapsiblePanel extends Component<CollapsiblePanelProps> {
	static displayName = "CollapsiblePanel";
	static contextType = A11YLanguageContext;
	declare context: ContextType<typeof A11YLanguageContext>;

	constructor(props: CollapsiblePanelProps) {
		super(props);
		// Subclasses relied on the base constructor to bind their own methods to the instance.
		bindMethods(this);
	}

	render(): ReactNode {
		return <CollapsiblePanelImpl {...this.props} />;
	}
}
