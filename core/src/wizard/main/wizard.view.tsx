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

import type { ReactElement, ContextType, ReactNode, SyntheticEvent, KeyboardEvent } from "react";
import { createRef, Children, isValidElement, cloneElement, Component, useRef, useContext, useState } from "react";
import { ThemeContext, ThemeProvider } from "styled-components";

import { Icon } from "../../icon/main/icon.view.js";
import { bindMethods, getParentElement, joinClassNames } from "../../common/main/utils.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { provider } from "../../common/main/device-detector.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { ElementSizeMeasurer } from "../../common/main/responsive-handler.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";
import { WidgetsResizeDetector } from "../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";
import { defaultTheme } from "../../theme/default/default-theme.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ResponsiveBehaviour, WizardState } from "./wizard.internal.js";
import { computeCondensedStepCount, wizardBaseClassName } from "./wizard.internal.js";
import { NextStepFirstWithBoundaryFocusedBehaviour } from "./responsive-behaviour/next-step-first-with-boundary-focused-behaviour.js";
import { DefaultBehaviour } from "./responsive-behaviour/default-behaviour.js";
import { PreviousStepFirstWithBoundaryFocusedBehaviour } from "./responsive-behaviour/previous-step-first-with-boundary-focused-behaviour.js";
import { NextStepFirstBehaviour } from "./responsive-behaviour/next-step-first-behaviour.js";
import type { WizardNavigationButtonProps, WizardProps, WizardStepProps } from "./wizard.api.js";
import {
	StyledWizardContent,
	StyledWizardContentContainer,
	StyledWizardContentContainerWrapper,
	StyledWizardNavigator,
	StyledWizardStep,
	StyledWizardText,
	StyledWizardTip,
	StyledWizardWrapper
} from "./wizard.styled.js";

function WizardVariantIcon(props: { variant: "success" | "warning" | "error" }): ReactElement {
	const icon = props.variant === "success" ? "check_circle" : props.variant;

	return <Icon variant={props.variant}>{icon}</Icon>;
}

WizardVariantIcon.displayName = "WizardVariantIcon";

export class Wizard extends Component<WizardProps, WizardState> {
	static displayName = "Wizard";
	declare context: ContextType<typeof ThemeContext>;

	private responsiveBehaviour: ResponsiveBehaviour;
	private wrapperRef = createRef<HTMLDivElement>();
	private shouldFocusToSelectedStep = false;
	private clickedOnNextStep = false;
	private clickedOnPreviousStep = false;
	private dummyElement: HTMLElement | null = null;

	constructor(props: WizardProps) {
		super(props);
		this.state = {};
		this.responsiveBehaviour = this.getResponsiveBehaviour(props.responsiveBehaviour);

		bindMethods(this);
	}

	private resetCondensedState(): void {
		this.setState({ condensedLeft: undefined, condensedRight: undefined });
	}

	private getResponsiveBehaviour(responsiveBehaviour?: WizardProps.ResponsiveBehaviour): DefaultBehaviour {
		if (!responsiveBehaviour) {
			return new DefaultBehaviour();
		}

		if (responsiveBehaviour.focusOnBoundary && responsiveBehaviour.nextStepFirst) {
			return new NextStepFirstWithBoundaryFocusedBehaviour();
		}

		if (responsiveBehaviour.focusOnBoundary && !responsiveBehaviour.nextStepFirst) {
			return new PreviousStepFirstWithBoundaryFocusedBehaviour();
		}

		if (!responsiveBehaviour.focusOnBoundary && responsiveBehaviour.nextStepFirst) {
			return new NextStepFirstBehaviour();
		}

		return new DefaultBehaviour();
	}

	private handleSizeChange(): void {
		this.resetCondensedState();
	}

	private renderChildren(): ReactNode {
		const visibleElements = !this.props.responsive ? Children.toArray(this.props.children) : this.getVisibleElements();

		return visibleElements.map((element, index) => {
			return (
				isValidElement<WizardStepProps>(element) &&
				cloneElement(element, {
					id: element.props.id ?? (this.props.id ? `${this.props.id}-step-${index}` : undefined),
					key: "element-" + index,
					style: { ...element.props.style, whiteSpace: "nowrap" },
					wrapperRef: (ref: HTMLElement | null) => {
						element.props.wrapperRef?.(ref);

						if (ref && this.shouldFocusToSelectedStep && element.props.selected) {
							const button = ref.getElementsByTagName("button").item(0);

							if (button) {
								button.focus();
							}
						}
					}
				})
			);
		});
	}

	private getVisibleElements(): ReactNode[] {
		const visibleElements = this.getRealChildren();
		const { condensedLeft, condensedRight } = this.state;

		let offsetLeft = visibleElements.findIndex((element) => isValidElement(element) && element.type === Wizard.Step);

		if (condensedLeft) {
			const condensedLeftCount = computeCondensedStepCount(condensedLeft);

			if (condensedLeft.hide) {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				visibleElements.splice(condensedLeft.begin + offsetLeft, condensedLeftCount);
				offsetLeft -= condensedLeftCount;
			} else {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				visibleElements.splice(condensedLeft.begin + offsetLeft, condensedLeftCount, this.renderLeftOutStep());
				offsetLeft -= condensedLeftCount - 1;
			}
		}

		if (condensedRight) {
			const condensedRightCount = computeCondensedStepCount(condensedRight);

			if (condensedRight.hide) {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				visibleElements.splice(condensedRight.begin + offsetLeft, condensedRightCount);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				visibleElements.splice(condensedRight.begin + offsetLeft, condensedRightCount, this.renderLeftOutStep());
			}
		}

		return visibleElements;
	}

	private getRealChildren(): ReactNode[] {
		return Children.toArray(this.props.children).filter(Boolean);
	}

	private renderLeftOutStep(): ReactElement<WizardStepProps> {
		return (
			<ThemeProvider theme={this.context || defaultTheme}>
				<Wizard.Step icon={<Icon>more_horiz</Icon>} leftOut />
			</ThemeProvider>
		);
	}

	private initializeResponsiveBehaviour(leftOutStepWrapperWidth: number): void {
		if (this.dummyElement) {
			const leftOutStepWidth = this.dummyElement?.getBoundingClientRect().width || 0;
			this.responsiveBehaviour.setLeftOutWidth(leftOutStepWrapperWidth);
			const arrowWidth = leftOutStepWidth - leftOutStepWrapperWidth;
			this.responsiveBehaviour.setArrowWidth(arrowWidth);
			this.resetCondensedState();
		}
	}

	private updateSteps(): void {
		if (this.wrapperRef.current) {
			const newState = this.responsiveBehaviour.update(this.wrapperRef.current);

			if (newState) {
				this.setState(newState);
			}
		}
	}

	private handleClick(event: SyntheticEvent): void {
		const target = event.target as HTMLElement;
		const wrapperElement = getParentElement(
			target,
			(element) => element.getAttribute("data-role") === `${DataRoles.Wizard}`
		);
		const previousStepElement = wrapperElement?.querySelector(`button[data-type=${DataRoles.Wizard.Previous}]`);
		const nextStepElement = wrapperElement?.querySelector(`button[data-type=${DataRoles.Wizard.Next}]`);

		this.clickedOnNextStep = target === nextStepElement || !!nextStepElement?.contains(target);
		this.clickedOnPreviousStep = target === previousStepElement || !!previousStepElement?.contains(target);
		this.shouldFocusToSelectedStep = !(this.clickedOnNextStep || this.clickedOnPreviousStep);
	}

	private handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (event.key === "Enter") {
			this.handleClick(event);
		}
	}

	private focusToNextButton(): void {
		if (this.focusToNavigateButton("next")) {
			this.clickedOnNextStep = false;
		}
	}

	private focusToPreviousButton(): void {
		if (this.focusToNavigateButton("previous")) {
			this.clickedOnPreviousStep = false;
		}
	}

	private focusToNavigateButton(buttonType: "previous" | "next"): boolean {
		if (this.wrapperRef.current) {
			const navButton = this.wrapperRef.current.querySelector(
				`button[data-type="${DataRoles.Wizard}-${buttonType}"]`
			) as HTMLElement;

			if (navButton) {
				const parent = navButton.parentElement;

				if (navButton.hasAttribute("disabled") && parent) {
					const div = document.createElement("div");
					div.tabIndex = 0;
					div.style.outline = "none";

					if (buttonType === "previous") {
						parent.insertBefore(div, navButton);
					} else {
						parent.appendChild(div);
					}

					div.onblur = (): void => {
						parent.removeChild(div);
					};

					div.focus();

					return true;
				} else {
					navButton.focus();
				}
			}
		}

		return false;
	}

	componentDidUpdate(_prevProps: WizardProps, prevState: WizardState): void {
		if (prevState.condensedLeft || prevState.condensedRight) {
			this.resetCondensedState();
		} else if (this.wrapperRef.current) {
			if (
				this.wrapperRef.current.children.length === this.getRealChildren().length &&
				this.state.condensedRight === undefined &&
				this.state.condensedLeft === undefined
			) {
				this.updateSteps();
			}

			if (this.clickedOnNextStep) {
				this.focusToNextButton();
			} else if (this.clickedOnPreviousStep) {
				this.focusToPreviousButton();
			}
		}
	}

	render(): ReactNode {
		const combinedClassNames = joinClassNames(
			wizardBaseClassName,
			{ [`${wizardBaseClassName}--truncate-text`]: this.props.truncate },
			{ [`${wizardBaseClassName}--responsive`]: this.props.responsive },
			this.props.className
		);

		return this.props.responsive ? (
			<WidgetsResizeDetector handleHeight={false} onResize={this.handleSizeChange} targetRef={this.wrapperRef}>
				<StyledWizardWrapper
					tabIndex={-1}
					ref={this.wrapperRef}
					style={this.props.style}
					id={this.props.id}
					className={combinedClassNames}
					role="navigation"
					data-role={DataRoles.Wizard}
					onClick={this.handleClick}
					onKeyDown={this.handleKeyDown}
					$truncateText={this.props.truncate}
					$responsive={this.props.responsive}
				>
					{this.renderChildren()}
				</StyledWizardWrapper>
				<ElementSizeMeasurer
					key="size-measurer"
					elementToRender={
						<Wizard.Step
							wrapperRef={(ref) => {
								this.dummyElement = ref;
							}}
							icon={<Icon>more_horiz</Icon>}
							leftOut
						/>
					}
					callback={this.initializeResponsiveBehaviour}
				/>
			</WidgetsResizeDetector>
		) : (
			<StyledWizardWrapper
				tabIndex={-1}
				ref={this.wrapperRef}
				style={this.props.style}
				id={this.props.id}
				className={combinedClassNames}
				role="navigation"
				data-role={DataRoles.Wizard}
				onClick={this.handleClick}
				onKeyDown={this.handleKeyDown}
				$truncateText={this.props.truncate}
				$responsive={this.props.responsive}
			>
				{this.renderChildren()}
			</StyledWizardWrapper>
		);
	}
}

export namespace Wizard {
	const StepButtonNavigator = (props: WizardNavigationButtonProps & { type: "previous" | "next" }): ReactElement => {
		const { wrapperRef, onClick, type } = props;
		const wizardNavigatorRef = useRef<HTMLButtonElement | null>(null);
		const classNames = joinClassNames(`${wizardBaseClassName}__${type}`, props.className);
		const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
		const title = languageContext.wizardTitles && languageContext.wizardTitles[`${type}Button`];

		const { title: resolvedTitle, hintRenderer } = useInteractionHint({
			title,
			componentKey: "wizard",
			referenceElementRef: wizardNavigatorRef
		});

		const getWizardNavigatorRef = (ref: HTMLButtonElement): void => {
			wrapperRef?.(ref);
			wizardNavigatorRef.current = ref;
		};

		return (
			<StyledWizardNavigator
				ref={getWizardNavigatorRef}
				className={classNames}
				aria-label={title}
				title={resolvedTitle}
				data-role={DataRoles.Wizard.NavigateButton}
				data-type={`${DataRoles.Wizard}-${type}`}
				disabled={props.disabled}
				onClick={onClick}
				$navigationType={type}
			>
				{!props.icon && <Icon>{type === "previous" ? "keyboard_arrow_left" : "keyboard_arrow_right"}</Icon>}
				{hintRenderer?.()}
			</StyledWizardNavigator>
		);
	};

	StepButtonNavigator.displayName = "Wizard.StepButtonNavigator";

	export const PreviousStepButton = (props: WizardNavigationButtonProps): ReactElement<WizardNavigationButtonProps> => (
		<StepButtonNavigator type="previous" {...props} />
	);

	PreviousStepButton.displayName = "Wizard.PreviousStepButton";

	export function NextStepButton(props: WizardNavigationButtonProps): ReactElement<WizardNavigationButtonProps> {
		return <StepButtonNavigator type="next" {...props} />;
	}

	NextStepButton.displayName = "Wizard.NextStepButton";

	export function Step(props: WizardStepProps): ReactElement<WizardStepProps> {
		const a11yContext = useContext(A11YLanguageContext);
		const [focused, setFocused] = useState(false);
		const isMobile = provider.isPhone();
		const wizardStepRef = useRef<HTMLButtonElement | null>(null);

		const { title: resolvedTitle, hintRenderer } = useInteractionHint({
			title: props.title,
			componentKey: "wizard",
			referenceElementRef: wizardStepRef
		});

		const handleFocus = (): void => {
			setFocused(true);
		};

		const handleBlur = (): void => {
			setFocused(false);
		};

		const {
			className,
			disabled,
			error,
			finished,
			icon,
			id,
			label,
			leftOut,
			nonInteractive,
			onClick,
			selected,
			warning,
			wrapperRef,
			title,
			...rest
		} = props;
		const leftOutButtonTitle = a11yContext.wizardTitles?.leftOutButton;
		const wizardVariantIconTitles = a11yContext.wizardTitles?.variantIcon;
		const hasIcon = !!(icon || finished || warning || error);
		const isDisabled = nonInteractive || leftOut || disabled;

		const renderVariantIconHiddenText = (
			<>
				{finished && <HiddenText>{wizardVariantIconTitles?.["success"]}</HiddenText>}
				{warning && <HiddenText>{wizardVariantIconTitles?.["warning"]}</HiddenText>}
				{error && <HiddenText>{wizardVariantIconTitles?.["error"]}</HiddenText>}
			</>
		);

		const classNames = joinClassNames(
			`${wizardBaseClassName}__step`,
			{ [`${wizardBaseClassName}__step--non-interactive`]: nonInteractive || leftOut },
			{ [`${wizardBaseClassName}__step--selected`]: selected },
			{ [`${wizardBaseClassName}__step--finished`]: finished },
			{ [`${wizardBaseClassName}__step--warning`]: warning },
			{ [`${wizardBaseClassName}__step--error`]: error },
			{ [`${wizardBaseClassName}__step--focused`]: focused },
			{ [`${wizardBaseClassName}__step--left-out`]: leftOut },
			className
		);

		return (
			<StyledWizardStep
				className={classNames}
				ref={wrapperRef}
				data-role={DataRoles.Wizard.Step}
				data-selected={selected}
				$nonInteractive={nonInteractive || leftOut}
				$leftOut={leftOut}
				$selected={selected}
				$focused={focused}
				id={id}
			>
				<StyledWizardTip
					className={`${wizardBaseClassName}__tip`}
					$leftOut={leftOut}
					$selected={selected}
					$finished={finished}
				/>
				{leftOut && <HiddenText>{leftOutButtonTitle}</HiddenText>}
				<StyledWizardContent
					ref={wizardStepRef}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className={`${wizardBaseClassName}__content`}
					aria-label={title}
					role="link"
					data-role={DataRoles.Wizard.Content}
					onClick={nonInteractive ? undefined : onClick}
					disabled={isDisabled}
					aria-current={selected && !isMobile ? "step" : undefined}
					aria-hidden={leftOut ? true : undefined}
					$disabled={isDisabled}
					$selected={selected}
					$nonInteractive={nonInteractive || leftOut}
					$warning={warning}
					$error={error}
					$finished={finished}
					$leftOut={leftOut}
					title={resolvedTitle}
					{...rest}
				>
					<StyledWizardContentContainerWrapper
						data-role={DataRoles.Wizard.Content.ContainerWrapper}
						$hasIcon={hasIcon}
						$selected={selected}
					>
						<StyledWizardContentContainer data-role={DataRoles.Wizard.Content.Container}>
							{isMobile && selected && <HiddenText>{a11yContext.wizardTitles?.currentStep}</HiddenText>}
							{!finished && !warning && !error && icon}
							{finished && <WizardVariantIcon variant="success" />}
							{warning && <WizardVariantIcon variant="warning" />}
							{error && <WizardVariantIcon variant="error" />}
							{renderVariantIconHiddenText}
							{isValidElement(label) ? (
								label
							) : (
								<StyledWizardText className={`${wizardBaseClassName}__text`}>{label}</StyledWizardText>
							)}
						</StyledWizardContentContainer>
					</StyledWizardContentContainerWrapper>
					{hintRenderer?.()}
				</StyledWizardContent>
			</StyledWizardStep>
		);
	}

	Step.displayName = "Wizard.Step";
}

Wizard.contextType = ThemeContext;
