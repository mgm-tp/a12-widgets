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

import type { ReactNode, KeyboardEvent, ReactElement, MouseEvent } from "react";
import { createContext, useCallback, useContext, useState, Children, isValidElement, useEffect, useRef } from "react";

import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import { Icon } from "../../icon/main/icon.view.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { AccordionContextType, AccordionVariant, AccordionProps } from "./accordion.api.js";
import {
	AccordionContainer,
	AccordionDetails,
	AccordionSection,
	AccordionSummary,
	AccordionSummaryText
} from "./accordion.styled.js";

const baseClassName = addPrefix("accordion");

export const AccordionContext = createContext<AccordionContextType>({});

function renderVariantIcon(variant?: AccordionVariant): ReactNode {
	switch (variant) {
		case "open":
			return (
				<Icon iconTheme="filled" data-variant-type={variant}>
					radio_button_unchecked
				</Icon>
			);
		case "info":
			return (
				<Icon iconTheme="filled" data-variant-type={variant}>
					info
				</Icon>
			);
		case "error":
			return (
				<Icon iconTheme="custom" data-variant-type={variant}>
					error
				</Icon>
			);
		case "warning":
			return (
				<Icon iconTheme="filled" data-variant-type={variant}>
					warning
				</Icon>
			);
		case "done":
			return (
				<Icon iconTheme="filled" data-variant-type={variant}>
					check_circle
				</Icon>
			);
		case "inProgress":
			return (
				<Icon iconTheme="filled" data-variant-type={variant}>
					pending
				</Icon>
			);
		default:
			return;
	}
}

export namespace Accordion {
	const findNextFocusableSummary = (
		accordionWrapperRef: HTMLElement | null,
		condition: (focusedIndex: number, length: number) => number
	): HTMLElement | null => {
		const elements =
			accordionWrapperRef && accordionWrapperRef.querySelectorAll(`[data-role=${DataRoles.Accordion.Summary}`);

		if (!elements || elements.length === 0 || !document.activeElement) {
			return null;
		}

		const sections = Array.from(elements);
		const focusedIndex = sections.indexOf(document.activeElement);
		const nextFocusableIndex = condition(focusedIndex, sections.length);

		return sections[nextFocusableIndex] as HTMLElement;
	};

	export function Container(props: AccordionProps.ContainerProps): ReactElement<AccordionProps.ContainerProps> {
		let accordionWrapperRef: HTMLElement | null = null;

		const { role, style, id, wrapperRef, expandIcon, collapseIcon, controlled } = props;
		const classNames = joinClassNames(`${baseClassName}__container`, props.className);
		const getWrapperRef = (param: HTMLDivElement | null): void => {
			accordionWrapperRef = param;
			wrapperRef?.(param);
		};

		const moveFocusBack = useCallback((): void => {
			const element = findNextFocusableSummary(accordionWrapperRef, (focusedIndex, length) =>
				focusedIndex > 0 ? focusedIndex - 1 : length - 1
			);
			element?.focus();
		}, [accordionWrapperRef]);

		const moveFocusNext = useCallback((): void => {
			const element = findNextFocusableSummary(accordionWrapperRef, (focusedIndex, length) =>
				focusedIndex < length - 1 ? focusedIndex + 1 : 0
			);
			element?.focus();
		}, [accordionWrapperRef]);

		const handleKeyDown = useCallback(
			(event: KeyboardEvent<HTMLDivElement>): void => {
				if (!(event.target as HTMLElement).classList.contains(`${baseClassName}__summary`)) {
					return;
				}

				if (event.key === "ArrowUp") {
					event.preventDefault();
					moveFocusBack();
				}

				if (event.key === "ArrowDown") {
					event.preventDefault();
					moveFocusNext();
				}
			},
			[moveFocusBack, moveFocusNext]
		);

		return (
			<AccordionContext.Provider value={{ collapseIcon, expandIcon, controlled }}>
				<AccordionContainer
					className={classNames}
					role={role || "navigation"}
					style={style}
					id={id}
					data-role={DataRoles.Accordion}
					ref={getWrapperRef}
					onKeyDown={handleKeyDown}
				>
					{props.children}
				</AccordionContainer>
			</AccordionContext.Provider>
		);
	}

	Container.displayName = "Accordion.Container";

	export function Section(props: AccordionProps.SectionProps): ReactElement<AccordionProps.SectionProps> {
		const context = useContext(AccordionContext);
		const [expanded, setExpanded] = useState(!!props.expanded);
		const collapseIcon = props.collapseIcon || context.collapseIcon;
		const expandIcon = props.expandIcon || context.expandIcon;
		const classNames = joinClassNames(
			`${baseClassName}__section`,
			{ [`${baseClassName}__section--selected`]: props.selected },
			props.className
		);

		const hasDetails =
			(Children.map(props.children, (child) => isValidElement<{ children: ReactNode }>(child) && child.props.children)
				?.length ?? 0) > 1;

		const handleClick = useCallback(
			(event: MouseEvent<HTMLElement>) => {
				if (!context.controlled && hasDetails) {
					setExpanded((prevExpanded) => !prevExpanded);
				}

				props.onClick?.(event);
			},
			[context.controlled, hasDetails, props]
		);

		useEffect(() => {
			if (!context.controlled && hasDetails) {
				setExpanded(!!props.expanded);
			}
		}, [props.expanded, context.controlled, hasDetails]);

		return (
			<AccordionContext.Provider
				value={{
					expandIcon,
					collapseIcon,
					onSummaryClick: handleClick,
					expanded: hasDetails ? (context.controlled ? !!props.expanded : expanded) : undefined,
					selected: props.selected,
					hasDetails
				}}
			>
				<AccordionSection
					className={classNames}
					id={props.id}
					style={props.style}
					data-role={DataRoles.Accordion.Section}
					selected={props.selected}
				>
					{props.children}
				</AccordionSection>
			</AccordionContext.Provider>
		);
	}

	Section.displayName = "Accordion.Section";

	export function Summary(props: AccordionProps.SummaryProps): ReactElement<AccordionProps.SummaryProps> {
		const { collapseIcon, expandIcon, expanded, selected, hasDetails, onSummaryClick } = useContext(AccordionContext);
		const { accordionTitles, accordionVariantTitles } = useContext<A11yDefinition>(A11YLanguageContext);
		const accordionSummaryRef = useRef<HTMLDivElement | null>(null);

		const classNames = joinClassNames(`${baseClassName}__summary`, props.className);
		const summaryCollapseIcon = collapseIcon || <Icon>remove</Icon>;
		const summaryExpandIcon = expandIcon || <Icon>add</Icon>;

		const variantTitle = props.variant && accordionVariantTitles?.[props.variant];
		const expandCollapseTitle = hasDetails ? (expanded ? accordionTitles?.close : accordionTitles?.open) : undefined;

		const accordionSummaryTitle =
			variantTitle && expandCollapseTitle
				? `${variantTitle} - ${expandCollapseTitle}`
				: variantTitle || expandCollapseTitle || undefined;

		const { title: resolvedTitle, hintRenderer } = useInteractionHint({
			title: accordionSummaryTitle,
			componentKey: "accordion",
			referenceElementRef: accordionSummaryRef
		});

		const getAccordionSummaryRef = (ref: HTMLDivElement): void => {
			accordionSummaryRef.current = ref;
		};

		const handleClick = useCallback(
			(event: MouseEvent<HTMLElement>) => {
				onSummaryClick?.(event);
				accordionSummaryRef.current?.focus();
			},
			[onSummaryClick]
		);

		const handleKeyDown = useCallback(
			(event: KeyboardEvent<HTMLElement>) => {
				if (event.key === "Enter") {
					handleClick(event as any);
				}
			},
			[handleClick]
		);

		return (
			<AccordionSummary
				id={props.id}
				className={classNames}
				tabIndex={0}
				style={props.style}
				aria-expanded={expanded}
				role="button"
				aria-current={selected ? "page" : undefined}
				data-role={DataRoles.Accordion.Summary}
				title={resolvedTitle}
				ref={getAccordionSummaryRef}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				$variant={props.variant}
			>
				{props.variant ? renderVariantIcon(props.variant) : props.graphic}
				<AccordionSummaryText className={`${baseClassName}__text`} data-role={DataRoles.Accordion.Text}>
					{props.children}
					{variantTitle && !hintRenderer && <HiddenText> - {variantTitle}</HiddenText>}
					{!!hintRenderer && accordionSummaryTitle && (
						<HiddenText>{props.variant ? ` - ${accordionSummaryTitle}` : accordionSummaryTitle}</HiddenText>
					)}
				</AccordionSummaryText>
				{hasDetails ? (expanded ? summaryCollapseIcon : summaryExpandIcon) : undefined}
				{hintRenderer?.()}
			</AccordionSummary>
		);
	}

	Summary.displayName = "Accordion.Summary";

	export function Details(props: AccordionProps.DetailsProps): ReactElement<AccordionProps.DetailsProps> {
		const classNames = joinClassNames(`${baseClassName}__details`, props.className);
		const { expanded } = useContext(AccordionContext);

		return expanded ? (
			<AccordionDetails
				id={props.id}
				className={classNames}
				role="document"
				data-role={DataRoles.Accordion.Details}
				style={props.style}
				tabIndex={props.tabIndex}
			>
				{props.children}
			</AccordionDetails>
		) : (
			<></>
		);
	}

	Details.displayName = "Accordion.Details";
}
