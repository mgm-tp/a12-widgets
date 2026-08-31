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

import type { ContextType, RefObject, ReactNode, ReactElement } from "react";
import { createRef, Component } from "react";
import { ThemeContext } from "styled-components";

import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { ButtonGroup } from "../../../button-group/main/button-group.view.js";
import { addPrefix, bindMethods, joinClassNames } from "../../../common/main/utils.js";
import {
	ElementSizeMeasurer,
	getHorizontalSpacing,
	ResponsiveHandler
} from "../../../common/main/responsive-handler.js";
import { WidgetsResizeDetector } from "../../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { PopUpMenu } from "../../../pop-up-menu/main/pop-up-menu.view.js";
import { defaultTheme } from "../../../theme/default/default-theme.js";

import type { ButtonGroupContainerLegacyProps } from "./button-group-container-legacy.api.js";
import { cloneButtonsWithKeys, getAvailableWidth } from "./button-group-container.utils.js";
import { StyledButtonGroupContainer, StyledButtonGroupResponsiveContainer } from "./button-group-container.styled.js";

const baseClassName = addPrefix("button-group-container");

interface ButtonGroupContainerLegacyState {
	nonCondensedButtonCount: number;
	countingState: boolean;
}

export class ButtonGroupContainerLegacy extends Component<
	ButtonGroupContainerLegacyProps,
	ButtonGroupContainerLegacyState
> {
	static displayName = "ButtonGroupContainerLegacy";

	declare context: ContextType<typeof ThemeContext>;

	private dummyRef: HTMLElement | null = null;
	private containerRef: RefObject<HTMLDivElement | null> = createRef();
	private parentElementRef: RefObject<HTMLElement | null> = createRef();
	private popupMenuIconWidth = 0;

	constructor(props: ButtonGroupContainerLegacyProps) {
		super(props);
		this.state = {
			nonCondensedButtonCount: (this.props.leftSlot ?? []).length + (this.props.rightSlot ?? []).length,
			countingState: !!props.responsive
		};
		bindMethods(this);
	}

	private getDummyContainerRef(ref: HTMLElement | null): void {
		this.dummyRef = ref;
	}

	private handleLoad(): void {
		this.updateNonCondensedButtonCount();
	}

	private updatePopupIconWidth(condensedIconWidth: number): void {
		if (this.popupMenuIconWidth !== condensedIconWidth) {
			this.popupMenuIconWidth = condensedIconWidth;
		}
	}

	private getPopupIcon(): ReactNode {
		return this.props.popupMenuIcon || <Icon>more_vert</Icon>;
	}

	private getSlotLength(side: "left" | "right"): number {
		const slot = side == "left" ? this.props.leftSlot : this.props.rightSlot;

		return slot?.length ?? 0;
	}

	private renderCondensedGroups(): ReactNode {
		const { nonCondensedButtonCount } = this.state;
		const { leftSlot = [], rightSlot = [], popupMenuHeaderTitle, collapsingDirection = "left-to-right" } = this.props;
		const leftCount = this.getSlotLength("left");
		const rightCount = this.getSlotLength("right");
		const condensedButtonCount = leftCount + rightCount - nonCondensedButtonCount;

		let popupButtons: ReactNode[];

		if (collapsingDirection === "right-to-left") {
			// For right-to-left, we condense from the rightmost buttons
			const rightButtonsToCondense = Math.min(condensedButtonCount, rightCount);
			const leftButtonsToCondense = Math.max(0, condensedButtonCount - rightCount);

			// Get condensed buttons from right slot first, then from left slot if needed
			const condensedRightButtons = rightSlot.slice(-rightButtonsToCondense);
			const condensedLeftButtons = leftButtonsToCondense > 0 ? leftSlot.slice(-leftButtonsToCondense) : [];

			// Combine in the correct order: left buttons first, then right buttons
			popupButtons = [...condensedLeftButtons, ...condensedRightButtons];
		} else {
			// For left-to-right (default), take from the beginning
			const allButtons = [...leftSlot, ...rightSlot];
			popupButtons = allButtons.slice(0, condensedButtonCount);
		}

		const popup = condensedButtonCount > 0 && (
			<A11YLanguageContext.Consumer>
				{(a11y) => {
					return (
						<PopUpMenu
							icon={this.getPopupIcon()}
							headerTitle={popupMenuHeaderTitle}
							isInResponsiveGroupButton
							triggerButtonCloseTitle={a11y.buttonGroupTitles?.triggerPopupClose}
							triggerButtonTitle={a11y.buttonGroupTitles?.triggerPopupOpen}
						>
							{cloneButtonsWithKeys({ buttons: popupButtons, rootKey: "popup" })}
						</PopUpMenu>
					);
				}}
			</A11YLanguageContext.Consumer>
		);
		const hasLeftGroup = this.getSlotLength("left") > 0;
		const hasOnlyRightGroup = this.getSlotLength("left") === 0 && this.getSlotLength("right") > 0;

		return hasLeftGroup
			? this.renderCondensedWhenHasLeftGroup(popup, condensedButtonCount)
			: hasOnlyRightGroup && this.renderCondensedWhenHasOnlyRightGroup(popup, condensedButtonCount);
	}

	private renderCondensedWhenHasLeftGroup(popup: ReactNode, condensedButtonCount: number): ReactNode {
		const {
			leftSlot = [],
			rightSlot = [],
			leftSlotProps = {},
			rightSlotProps = {},
			collapsingDirection = "left-to-right"
		} = this.props;
		const leftCount = this.getSlotLength("left");
		const rightCount = this.getSlotLength("right");

		if (collapsingDirection === "right-to-left") {
			// For right-to-left collapsing, we condense from the rightmost buttons first
			// Calculate how many buttons to keep from each side
			const rightButtonsToCondense = Math.min(condensedButtonCount, rightCount);
			const leftButtonsToCondense = Math.max(0, condensedButtonCount - rightCount);

			const leftButtonsToShow = leftCount - leftButtonsToCondense;
			const rightButtonsToShow = rightCount - rightButtonsToCondense;

			const hasLeft = leftButtonsToShow > 0;
			const hasRight = rightButtonsToShow > 0;

			return (
				<>
					{hasLeft && (
						<ButtonGroup alignment="left" {...leftSlotProps} className={leftSlotProps.className}>
							{cloneButtonsWithKeys({
								buttons: leftSlot.slice(0, leftButtonsToShow),
								rootKey: "left"
							})}
						</ButtonGroup>
					)}
					{(popup || hasRight) && (
						<ButtonGroup alignment="right" {...rightSlotProps} className={rightSlotProps.className}>
							{cloneButtonsWithKeys({
								buttons: rightSlot.slice(0, rightButtonsToShow),
								rootKey: "right"
							})}
							{popup}
						</ButtonGroup>
					)}
				</>
			);
		} else {
			// Original left-to-right behavior
			const hasLeft = leftCount > condensedButtonCount;
			const hasRight = rightCount > 0 && leftCount + rightCount > condensedButtonCount;

			return (
				<>
					{(popup || hasLeft) && (
						<ButtonGroup alignment="left" {...leftSlotProps} className={leftSlotProps.className}>
							{popup}
							{cloneButtonsWithKeys({ buttons: leftSlot, rootKey: "left", startCloneAt: condensedButtonCount })}
						</ButtonGroup>
					)}
					{hasRight && (
						<ButtonGroup alignment="right" {...rightSlotProps} className={rightSlotProps.className}>
							{cloneButtonsWithKeys({
								buttons: rightSlot,
								rootKey: "right",
								startCloneAt: Math.max(0, condensedButtonCount - leftCount)
							})}
						</ButtonGroup>
					)}
				</>
			);
		}
	}

	private renderCondensedWhenHasOnlyRightGroup(popup: ReactNode, condensedButtonCount: number): ReactNode {
		const { rightSlot = [], rightSlotProps = {}, collapsingDirection = "left-to-right" } = this.props;
		const rightCount = this.getSlotLength("right");

		if (collapsingDirection === "right-to-left") {
			// For right-to-left, condense from the rightmost buttons
			const rightButtonsToShow = rightCount - condensedButtonCount;
			const hasRight = rightButtonsToShow > 0;

			return (
				<>
					{(popup || hasRight) && (
						<ButtonGroup alignment="right" {...rightSlotProps}>
							{cloneButtonsWithKeys({
								buttons: rightSlot.slice(0, rightButtonsToShow),
								rootKey: "right"
							})}
							{popup}
						</ButtonGroup>
					)}
				</>
			);
		} else {
			// Original left-to-right behavior
			const hasRight = rightCount > condensedButtonCount;

			return (
				<>
					{(popup || hasRight) && (
						<ButtonGroup alignment="right" {...rightSlotProps}>
							{popup}
							{cloneButtonsWithKeys({
								buttons: rightSlot,
								rootKey: "right",
								startCloneAt: Math.max(0, condensedButtonCount)
							})}
						</ButtonGroup>
					)}
				</>
			);
		}
	}

	private renderResponsiveContainer(): ReactNode {
		const { id, style, className, leftSlot = [], rightSlot = [], fitVisibleContentWidth = false } = this.props;
		const isTestEnvironment = document.hidden; // Prevent test of other projects fail
		const leftGroup = cloneButtonsWithKeys({ buttons: leftSlot, rootKey: "left-dummy", withProps: false });
		const rightGroup = cloneButtonsWithKeys({ buttons: rightSlot, rootKey: "right-dummy", withProps: false });

		return (
			<>
				<WidgetsResizeDetector
					handleHeight={false}
					onResize={this.updateNonCondensedButtonCount}
					targetRef={fitVisibleContentWidth ? this.parentElementRef : this.containerRef}
				>
					<StyledButtonGroupResponsiveContainer
						className={joinClassNames(`${baseClassName} ${baseClassName}--responsive`, className)}
						id={id}
						style={style}
						ref={this.containerRef}
						data-role={DataRoles.ButtonGroupContainer}
						$fitVisibleContentWidth={fitVisibleContentWidth}
					>
						{this.renderCondensedGroups()}
					</StyledButtonGroupResponsiveContainer>
				</WidgetsResizeDetector>
				{this.state.countingState && !isTestEnvironment && (
					<StyledButtonGroupResponsiveContainer
						className={`${baseClassName} ${baseClassName}--responsive`}
						ref={this.getDummyContainerRef}
						style={{ visibility: "hidden", position: "absolute" }}
					>
						{this.renderPlainGroup(leftGroup, rightGroup, false)}
					</StyledButtonGroupResponsiveContainer>
				)}
				{this.popupMenuIconWidth === 0 && (
					<ElementSizeMeasurer
						elementToRender={
							<StyledButtonGroupResponsiveContainer className={`${baseClassName} ${baseClassName}--responsive`}>
								<PopUpMenu icon={this.getPopupIcon()} />
							</StyledButtonGroupResponsiveContainer>
						}
						itemDataRole="popup"
						callback={this.updatePopupIconWidth}
					/>
				)}
			</>
		);
	}

	private renderPlainGroup(leftGroup: ReactNode[], rightGroup: ReactNode[], withProps = true): ReactElement {
		const { leftSlotProps = {}, rightSlotProps = {} } = this.props;

		return (
			<>
				{this.getSlotLength("left") > 0 && (
					<ButtonGroup alignment="left" {...(withProps ? leftSlotProps : {})}>
						{leftGroup}
					</ButtonGroup>
				)}
				{this.getSlotLength("right") > 0 && (
					<ButtonGroup alignment="right" {...(withProps ? rightSlotProps : {})}>
						{rightGroup}
					</ButtonGroup>
				)}
			</>
		);
	}

	private renderNormalContainer(): ReactNode {
		const { leftSlot = [], rightSlot = [], className, id, style, children } = this.props;
		const leftGroup = cloneButtonsWithKeys({
			buttons: leftSlot,
			rootKey: "left"
		});
		const rightGroup = cloneButtonsWithKeys({ buttons: rightSlot, rootKey: "right" });

		return (
			<StyledButtonGroupContainer
				className={joinClassNames(baseClassName, className)}
				id={id}
				style={style}
				data-role={DataRoles.ButtonGroupContainer}
			>
				{children || this.renderPlainGroup(leftGroup, rightGroup)}
			</StyledButtonGroupContainer>
		);
	}

	private updateNonCondensedButtonCount(): void {
		this.setState({ countingState: true }, () => {
			if (this.dummyRef && this.containerRef.current) {
				const buttonRefs = Array.from(this.dummyRef.querySelectorAll(`[data-role$="button"]`));

				if (buttonRefs.length > 0) {
					const parentGap = parseFloat((this.context || defaultTheme)?.components.buttonGroup.gap.split(" ")[0]);
					const nonCondensedButtonCount = ResponsiveHandler.getNonCondensedItemNumberRtl(
						this.containerRef.current,
						buttonRefs,
						// popupMenuIconWidth should include margin when placed inside ButtonGroupContainer
						this.popupMenuIconWidth + getHorizontalSpacing(buttonRefs[0], "margin"),
						parentGap,
						getAvailableWidth(this.containerRef.current, this.props.fitVisibleContentWidth ?? false)
					);
					this.setState({ nonCondensedButtonCount, countingState: false });
				}
			}
		});
	}

	componentDidMount(): void {
		if (this.props.responsive) {
			this.parentElementRef.current = this.containerRef.current?.parentElement ?? null;
			this.handleLoad();
		}
	}

	componentDidUpdate(prevProps: ButtonGroupContainerLegacyProps): void {
		if (
			this.props.responsive &&
			(this.props.rightSlot !== prevProps.rightSlot || this.props.leftSlot !== prevProps.leftSlot)
		) {
			this.updateNonCondensedButtonCount();
		}
	}

	render(): ReactNode {
		return !this.props.responsive ? this.renderNormalContainer() : this.renderResponsiveContainer();
	}
}
ButtonGroupContainerLegacy.contextType = ThemeContext;
