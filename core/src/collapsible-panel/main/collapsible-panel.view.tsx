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

import type {
	ContextType,
	KeyboardEvent,
	MouseEvent,
	TouchEvent,
	FocusEvent,
	ReactElement,
	ReactNode,
	RefObject
} from "react";
import { createRef, Component } from "react";
import { styled, css } from "styled-components";
import { Key } from "ts-key-enum";

import { active, hover } from "../../theme/base/mixins/_interaction.js";
import { Icon, StyledIconWrapper } from "../../icon/main/icon.view.js";
import {
	joinClassNames,
	bindMethods,
	addPrefix,
	getAllFocusableElements,
	getParentElement,
	getNearestFocusableParent
} from "../../common/main/utils.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import type { UseInteractionHintResult } from "../../interaction-hint/main/use-interaction-hint.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { CollapsiblePanelProps } from "./collapsible-panel.api.js";

const baseClassName = addPrefix("collapsiblePanel");

interface CollapsiblePanelState {
	isAddonHoveredOrTouched?: boolean;
	isAddonFocused?: boolean;
}

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

		${$swapAddonsPosition
			? css`
					right: 0;
				`
			: css`
					left: calc(-${marginRight} - ${fontSize});
				`}

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
		margin-left: ${$swapAddonsPosition
			? collapsiblePanel.indicator.marginRight
			: `calc(${collapsiblePanel.indicator.fontSize} + ${collapsiblePanel.indicator.marginRight})`};
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
		${!$noEffect &&
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
		`}
		${!$noFocus &&
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
		`}
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

function CollapsiblePanelInteractionHintWrapper(props: {
	collapsiblePanelTitle: string | undefined;
	wrapperRef: RefObject<HTMLDivElement | null>;
	labelRef: RefObject<HTMLDivElement | null>;
	children: (state: UseInteractionHintResult) => ReactNode;
}) {
	const { title, hintRenderer } = useInteractionHint({
		title: props.collapsiblePanelTitle,
		componentKey: "collapsiblePanel",
		referenceElementRef: props.labelRef
	});

	return <>{props.children({ title, hintRenderer })}</>;
}

export class CollapsiblePanel extends Component<CollapsiblePanelProps, CollapsiblePanelState> {
	static displayName = "CollapsiblePanel";
	declare context: ContextType<typeof A11YLanguageContext>;
	private labelRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>();
	private titleRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>();
	// Reference for the whole collapsible wrapper — used as reference element for interaction hint
	private wrapperRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>();

	constructor(props: CollapsiblePanelProps) {
		super(props);

		this.state = {
			isAddonHoveredOrTouched: false,
			isAddonFocused: false
		};

		bindMethods(this);
	}

	private getLabelRef(ref: HTMLDivElement | null): void {
		this.labelRef.current = ref;
	}

	private getTitleRef(ref: HTMLDivElement): void {
		this.titleRef.current = ref;
	}

	private handleClick(): void {
		this.labelRef.current?.focus();
		this.props.onClick();
	}

	private handleKeyUp(event: KeyboardEvent): void {
		if (event.key === Key.Enter) {
			this.props.onClick();
		}
	}

	private handleHoverOrTouchAddon(
		event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
		isHovered?: boolean
	): void {
		const nearestFocusableParentElement = getNearestFocusableParent(event.target as HTMLElement);

		if (getAllFocusableElements(event.currentTarget).length > 0) {
			this.setState({
				isAddonHoveredOrTouched:
					isHovered && !!nearestFocusableParentElement && event.currentTarget.contains(nearestFocusableParentElement)
			});
		}
	}

	private handleFocusAddon(event: FocusEvent<HTMLElement>, isFocused?: boolean): void {
		if (getAllFocusableElements(event.currentTarget).length > 0) {
			this.setState({ isAddonFocused: isFocused });
		}
	}

	private handleWrapperMouseOver(event: MouseEvent<HTMLDivElement>): void {
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
		this.setState({ isAddonHoveredOrTouched: isInteractiveAddon });
	}

	private graphicIconRenderer(): ReactElement {
		return (
			<StyledCollapsiblePanelIndicator
				className={`${baseClassName}__indicator`}
				data-role={DataRoles.CollapsiblePanel.Indicator}
				$swapAddonsPosition={this.props.swapAddonsPosition}
			>
				<Icon>{this.props.children ? "keyboard_arrow_down" : "keyboard_arrow_right"}</Icon>
			</StyledCollapsiblePanelIndicator>
		);
	}

	private addonsRenderer(): ReactElement {
		return this.props.addons ? (
			<StyledCollapsiblePanelAddons
				className={`${baseClassName}__add-ons`}
				data-role={DataRoles.CollapsiblePanelAddons}
				onMouseOver={(event) => this.handleHoverOrTouchAddon(event, true)}
				onMouseLeave={(event) => this.handleHoverOrTouchAddon(event, false)}
				onTouchStart={(event) => this.handleHoverOrTouchAddon(event, true)}
				onTouchEnd={(event) => this.handleHoverOrTouchAddon(event, false)}
				onFocus={(event) => this.handleFocusAddon(event, true)}
				onBlur={(event) => this.handleFocusAddon(event, false)}
			>
				{this.props.addons}
			</StyledCollapsiblePanelAddons>
		) : (
			<></>
		);
	}

	render(): ReactNode {
		const classNames = joinClassNames(baseClassName, this.props.className);
		const panelTitles = this.context.collapsiblePanelTitles;
		const collapsiblePanelTitle = this.props.children ? panelTitles?.closePanel : panelTitles?.openPanel;

		return (
			<StyledCollapsiblePanelWrapper
				className={classNames}
				id={this.props.id}
				style={this.props.style}
				data-role={DataRoles.CollapsiblePanel}
				ref={this.wrapperRef}
			>
				<StyledCollapsiblePanelTitle
					$noEffect={this.state.isAddonHoveredOrTouched}
					$noFocus={this.state.isAddonHoveredOrTouched || this.state.isAddonFocused}
					className={joinClassNames(
						`${baseClassName}__title`,
						{
							[`${baseClassName}__title--no-effect`]: this.state.isAddonHoveredOrTouched
						},
						{
							[`${baseClassName}__title--no-focus`]: this.state.isAddonHoveredOrTouched || this.state.isAddonFocused
						}
					)}
					data-role={DataRoles.CollapsiblePanel.Header}
					aria-level={this.props.ariaLevel}
					role={this.props.role}
					ref={this.getTitleRef}
					onClick={this.handleClick}
					onKeyUp={this.handleKeyUp}
					onMouseOver={this.handleWrapperMouseOver}
				>
					{this.props.swapAddonsPosition && this.addonsRenderer()}
					<CollapsiblePanelInteractionHintWrapper
						collapsiblePanelTitle={collapsiblePanelTitle}
						wrapperRef={this.wrapperRef}
						labelRef={this.labelRef}
					>
						{({ title: resolvedTitle, hintRenderer }) => {
							return (
								<>
									<StyledCollapsiblePanelLabel
										className={`${baseClassName}__label`}
										role="button"
										tabIndex={0}
										aria-expanded={this.props.children ? "true" : "false"}
										data-role={DataRoles.CollapsiblePanel.Title.Wrapper}
										ref={this.getLabelRef}
										$swapAddonsPosition={this.props.swapAddonsPosition}
										title={resolvedTitle}
									>
										{!this.props.swapAddonsPosition && this.graphicIconRenderer()}
										<StyledCollapsiblePanelLabelText
											className={`${baseClassName}__label--text`}
											data-role={DataRoles.CollapsiblePanel.Title}
										>
											{this.props.title}
										</StyledCollapsiblePanelLabelText>
										{this.props.info && (
											<StyledCollapsiblePanelLabelInfo
												className={`${baseClassName}__label--info`}
												data-role={DataRoles.CollapsiblePanel.Info}
											>
												&nbsp;- {this.props.info}
											</StyledCollapsiblePanelLabelInfo>
										)}
										{collapsiblePanelTitle && !!hintRenderer && <HiddenText>{collapsiblePanelTitle}</HiddenText>}
										{this.props.swapAddonsPosition && this.graphicIconRenderer()}
									</StyledCollapsiblePanelLabel>
									{!this.props.swapAddonsPosition && this.addonsRenderer()}
									{hintRenderer?.()}
								</>
							);
						}}
					</CollapsiblePanelInteractionHintWrapper>
				</StyledCollapsiblePanelTitle>
				{this.props.children && (
					<StyledCollapsiblePanelContent
						className={`${baseClassName}__content`}
						role="document"
						data-role={DataRoles.CollapsiblePanel.Content}
					>
						{this.props.children}
					</StyledCollapsiblePanelContent>
				)}
			</StyledCollapsiblePanelWrapper>
		);
	}
}

CollapsiblePanel.contextType = A11YLanguageContext;
