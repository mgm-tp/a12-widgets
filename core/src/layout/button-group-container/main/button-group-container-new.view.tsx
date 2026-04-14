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

import type { ButtonGroupContainerNewProps } from "./button-group-container-new.api.js";
import { createButtons } from "./button-group-container.utils.js";
import {
	StyledButtonGroupContainer,
	StyledButtonGroupContainerList,
	StyledButtonGroupResponsiveContainer
} from "./button-group-container.styled.js";

const baseClassName = addPrefix("button-group-container");

interface ButtonGroupContainerNewState {
	nonCondensedButtonCount: number;
	countingState: boolean;
}

export class ButtonGroupContainerNew extends Component<ButtonGroupContainerNewProps, ButtonGroupContainerNewState> {
	static displayName = "ButtonGroupContainerNew";

	declare context: ContextType<typeof ThemeContext>;

	private dummyRef: HTMLElement | null = null;
	private containerRef: RefObject<HTMLDivElement | null> = createRef();
	private popupMenuIconWidth = 0;

	constructor(props: ButtonGroupContainerNewProps) {
		super(props);
		this.state = {
			nonCondensedButtonCount: (this.props.leftSlotButtons ?? []).length + (this.props.rightSlotButtons ?? []).length,
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
		const slot = side == "left" ? this.props.leftSlotButtons : this.props.rightSlotButtons;

		return slot?.length ?? 0;
	}

	private renderCondensedGroups(): ReactNode {
		const { nonCondensedButtonCount } = this.state;
		const {
			leftSlotButtons = [],
			rightSlotButtons = [],
			popupMenuHeaderTitle,
			collapsingDirection = "left-to-right"
		} = this.props;
		const leftCount = this.getSlotLength("left");
		const rightCount = this.getSlotLength("right");
		const condensedButtonCount = leftCount + rightCount - nonCondensedButtonCount;

		let popupButtonsProps: ButtonGroupContainerNewProps.ButtonProps[];

		if (collapsingDirection === "right-to-left") {
			// For right-to-left, we condense from the rightmost buttons
			const rightButtonsToCondense = Math.min(condensedButtonCount, rightCount);
			const leftButtonsToCondense = Math.max(0, condensedButtonCount - rightCount);

			// Get condensed buttons from right slot first, then from left slot if needed
			const condensedRightButtonsProps = rightSlotButtons.slice(-rightButtonsToCondense);
			const condensedLeftButtonsProps = leftButtonsToCondense > 0 ? leftSlotButtons.slice(-leftButtonsToCondense) : [];

			// Combine in the correct order: left buttons first, then right buttons
			popupButtonsProps = [...condensedLeftButtonsProps, ...condensedRightButtonsProps];
		} else {
			// For left-to-right (default), take from the beginning
			const allButtonsProps = [...leftSlotButtons, ...rightSlotButtons];
			popupButtonsProps = allButtonsProps.slice(0, condensedButtonCount);
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
							popupListAttributes={this.props.popupListAttributes}
						>
							<StyledButtonGroupContainerList>
								{createButtons({
									containerButtonProps: popupButtonsProps,
									isInPopUp: true,
									preserveSemanticStyles: this.props.preserveSemanticStyles,
									lastLeftSlotIndex: leftSlotButtons.length - 1
								})}
							</StyledButtonGroupContainerList>
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
			leftSlotButtons = [],
			rightSlotButtons = [],
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
							{createButtons({
								containerButtonProps: leftSlotButtons.slice(0, leftButtonsToShow)
							})}
						</ButtonGroup>
					)}
					{(popup || hasRight) && (
						<ButtonGroup alignment="right" {...rightSlotProps} className={rightSlotProps.className}>
							{createButtons({
								containerButtonProps: rightSlotButtons.slice(0, rightButtonsToShow)
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
							{createButtons({ containerButtonProps: leftSlotButtons, startCreateAt: condensedButtonCount })}
						</ButtonGroup>
					)}
					{hasRight && (
						<ButtonGroup alignment="right" {...rightSlotProps} className={rightSlotProps.className}>
							{createButtons({
								containerButtonProps: rightSlotButtons,
								startCreateAt: Math.max(0, condensedButtonCount - leftCount)
							})}
						</ButtonGroup>
					)}
				</>
			);
		}
	}

	private renderCondensedWhenHasOnlyRightGroup(popup: ReactNode, condensedButtonCount: number): ReactNode {
		const { rightSlotButtons = [], rightSlotProps = {}, collapsingDirection = "left-to-right" } = this.props;
		const rightCount = this.getSlotLength("right");

		if (collapsingDirection === "right-to-left") {
			// For right-to-left, condense from the rightmost buttons
			const rightButtonsToShow = rightCount - condensedButtonCount;
			const hasRight = rightButtonsToShow > 0;

			return (
				<>
					{(popup || hasRight) && (
						<ButtonGroup alignment="right" {...rightSlotProps}>
							{createButtons({
								containerButtonProps: rightSlotButtons.slice(0, rightButtonsToShow)
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
							{createButtons({
								containerButtonProps: rightSlotButtons,
								startCreateAt: Math.max(0, condensedButtonCount)
							})}
						</ButtonGroup>
					)}
				</>
			);
		}
	}

	private renderResponsiveContainer(): ReactNode {
		const { id, style, className, leftSlotButtons = [], rightSlotButtons = [] } = this.props;

		const isTestEnvironment = document.hidden; // Prevent test of other projects fail
		const leftGroup = createButtons({ containerButtonProps: leftSlotButtons, withProps: false });
		const rightGroup = createButtons({ containerButtonProps: rightSlotButtons, withProps: false });

		return (
			<>
				<WidgetsResizeDetector
					handleHeight={false}
					onResize={this.updateNonCondensedButtonCount}
					targetRef={this.containerRef}
				>
					<StyledButtonGroupResponsiveContainer
						className={joinClassNames(`${baseClassName} ${baseClassName}--responsive`, className)}
						id={id}
						style={style}
						ref={this.containerRef}
						data-role={DataRoles.ButtonGroupContainer}
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
								<PopUpMenu icon={this.getPopupIcon()} popupListAttributes={this.props.popupListAttributes} />
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
		const { leftSlotButtons = [], rightSlotButtons = [], className, id, style, children } = this.props;
		const leftGroup = createButtons({ containerButtonProps: leftSlotButtons });
		const rightGroup = createButtons({ containerButtonProps: rightSlotButtons });

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
						parentGap
					);
					this.setState({ nonCondensedButtonCount, countingState: false });
				}
			}
		});
	}

	componentDidMount(): void {
		if (this.props.responsive) {
			this.handleLoad();
		}
	}

	componentDidUpdate(prevProps: ButtonGroupContainerNewProps): void {
		if (
			this.props.responsive &&
			(this.props.rightSlotButtons !== prevProps.rightSlotButtons ||
				this.props.leftSlotButtons !== prevProps.leftSlotButtons)
		) {
			this.updateNonCondensedButtonCount();
		}
	}

	render(): ReactNode {
		return this.props.responsive ? this.renderResponsiveContainer() : this.renderNormalContainer();
	}
}
ButtonGroupContainerNew.contextType = ThemeContext;
