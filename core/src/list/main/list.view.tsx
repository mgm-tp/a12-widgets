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

import type { ReactElement, KeyboardEvent, MouseEvent, TouchEvent } from "react";
import { createContext, useContext, useRef, useCallback, useState, useEffect, isValidElement } from "react";
import { Key } from "ts-key-enum";

import {
	addPrefix,
	joinClassNames,
	Key as CustomKey,
	getNearestFocusableParent,
	getAllInteractiveElements
} from "../../common/main/utils.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { provider } from "../../common/main/device-detector.js";
import { usePrevious } from "../../common/main/hooks.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { ProgressBar } from "../../progress-bar/main/progress-bar.view.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ListItemProps, ListProps, ListSubHeaderProps } from "./list.api.js";
import {
	StyledListWrapper,
	StyledListSubHeader,
	StyledListItemWrapper,
	StyledListItemContent,
	StyledListItemGraphic,
	StyledListItemMeta,
	StyledListItemSecondaryText,
	StyledListItemText,
	StyledListSubHeaderContentWrapper,
	StyledListSubHeaderContent,
	StyledListSubHeaderChildren,
	StyledListSubHeaderMeta,
	StyledListSubHeaderGraphic
} from "./list.styled.js";

const baseClassName = addPrefix(`list`);

interface ListContextType {
	flipped: boolean;
	divider: boolean;
	border: boolean;
	paddedLeft: boolean;
	paddedRight: boolean;
}

const ListContext = createContext<ListContextType>({
	flipped: false,
	divider: false,
	border: false,
	paddedLeft: false,
	paddedRight: false
});

export const ListContextProvider = ListContext.Provider;

export function List(props: ListProps): ReactElement<ListProps> {
	const baseItemClassName = `${baseClassName}--items`;
	const classNames = joinClassNames(
		baseClassName,
		{ [`${baseItemClassName}-divider`]: props.divider },
		{ [`${baseItemClassName}-padded-left`]: props.paddedLeft },
		{ [`${baseItemClassName}-padded-right`]: props.paddedRight },
		{ [`${baseClassName}--bordered`]: props.border },
		props.className
	);

	return (
		<ListContextProvider
			value={{
				flipped: !!props.flipped,
				divider: !!props.divider,
				border: !!props.border,
				paddedLeft: !!props.paddedLeft,
				paddedRight: !!props.paddedRight
			}}
		>
			<StyledListWrapper
				id={props.id}
				className={classNames}
				style={props.style}
				tabIndex={props.tabIndex}
				ref={props.wrapperRef}
				data-role={props.dataRole || DataRoles.List}
				onKeyDown={props.onKeyDown}
				role={props.role}
				aria-controls={props.ariaControls}
				aria-describedby={props.ariaDescribedby}
			>
				{props.children}
			</StyledListWrapper>
		</ListContextProvider>
	);
}

List.displayName = "List";

export namespace List {
	export function SubHeader(props: ListSubHeaderProps): ReactElement<ListSubHeaderProps> {
		const { id, style, onClick, onKeyDown, onKeyUp, fill, divider, graphic, children, meta, title } = props;
		const listContext = useContext(ListContext);
		const isInteractive = !!(onClick || onKeyDown || onKeyUp);
		const className = joinClassNames(
			`${baseClassName}-sub-header`,
			{ [`${baseClassName}-sub-header--fill`]: fill },
			props.className
		);
		const subHeaderRef = useRef<HTMLLIElement | null>(null);
		const { hintRenderer } = useInteractionHint({
			title,
			componentKey: "list",
			referenceElementRef: subHeaderRef
		});

		const handleKeyDown = useCallback(
			(event: KeyboardEvent<HTMLElement>): void => {
				if (onClick && (event.key === Key.Enter || event.key === CustomKey.Space)) {
					onClick(event as any);
				}

				onKeyDown?.(event);
			},
			[onClick, onKeyDown]
		);

		return (
			<StyledListSubHeader
				id={id}
				className={className}
				ref={subHeaderRef}
				style={style}
				data-role={DataRoles.List.SubHeader}
				onClick={onClick}
				onKeyDown={handleKeyDown}
				onKeyUp={onKeyUp}
				$fill={fill}
				$hasDivider={divider ?? listContext.divider}
				$hasBorder={listContext.border}
			>
				<StyledListSubHeaderContentWrapper
					data-role={DataRoles.List.SubHeader.ContentWrapper}
					role="heading"
					aria-level={2}
					tabIndex={isInteractive ? 0 : undefined}
					$fill={fill}
					$interactive={isInteractive}
				>
					<StyledListSubHeaderContent
						role={isInteractive ? "button" : undefined}
						data-role={DataRoles.List.SubHeader.Content}
						$useAsButton={isInteractive}
					>
						{graphic && (
							<StyledListSubHeaderGraphic data-role={DataRoles.List.SubHeader.Graphic}>
								{graphic}
							</StyledListSubHeaderGraphic>
						)}
						<StyledListSubHeaderChildren>{children}</StyledListSubHeaderChildren>

						{meta && (
							<StyledListSubHeaderMeta data-role={DataRoles.List.SubHeader.Meta}>{meta}</StyledListSubHeaderMeta>
						)}
						{hintRenderer?.()}
					</StyledListSubHeaderContent>
				</StyledListSubHeaderContentWrapper>
			</StyledListSubHeader>
		);
	}

	SubHeader.displayName = "List.SubHeader";

	export function Item(props: ListItemProps): ReactElement<ListItemProps> {
		const a11yContext = useContext(A11YLanguageContext);
		const metaRef = useRef<HTMLDivElement>(null);
		const contentRef = useRef<HTMLDivElement | null>(null);
		const textRef = useRef<HTMLDivElement | null>(null);
		const liRef = useRef<HTMLLIElement | null>(null);
		const { title: resolvedTitle, hintRenderer } = useInteractionHint({
			title: props.title,
			componentKey: props.isIconButton ? "iconButton" : "list",
			referenceElementRef: contentRef
		});

		const [noEffect, setNoEffect] = useState(false);
		const prevNoEffect = usePrevious(noEffect);
		const [setAriaAtContent, setSetAriaAtContent] = useState(false);
		const [hasInteractiveMeta, setHasInteractiveMeta] = useState(false);

		const getWrapperRef = (ref: HTMLLIElement | null): void => {
			liRef.current = ref;
			props.wrapperRef?.(ref);
		};

		const getContentRef = (ref: HTMLDivElement | null): void => {
			contentRef.current = ref;
			props.contentProps?.wrapperRef?.(ref);
		};

		const getTextRef = (ref: HTMLDivElement | null): void => {
			textRef.current = ref;
		};

		const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
			props.onKeyDown?.(event);

			if (event.key === Key.Enter || (props.selected !== undefined && event.key === CustomKey.Space)) {
				props.onClick?.(event as any);
			}
		};

		const getTabIndex = (): number | undefined => {
			const defaultTabIndex = props.readonly || props.disabled ? undefined : 0;

			return props.tabIndex ?? defaultTabIndex;
		};

		const removeNoEffect = (): void => {
			setNoEffect(false);
		};

		const addNoEffect = (event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>): void => {
			const nearestFocusableParentElement = getNearestFocusableParent(event.target as HTMLElement);

			if (hasInteractiveMeta && document.activeElement === (textRef.current || metaRef.current)) {
				return;
			}

			if (
				document.activeElement !== liRef?.current?.firstChild &&
				nearestFocusableParentElement &&
				event.currentTarget.contains(nearestFocusableParentElement)
			) {
				setNoEffect(true);
			} else {
				removeNoEffect();
			}
		};

		const onGraphicMouseOver = (event: MouseEvent<HTMLDivElement>): void => {
			props.graphicWrapperProps?.onMouseOver?.(event);
			addNoEffect(event);
		};

		const onGraphicMouseLeave = (event: MouseEvent<HTMLDivElement>): void => {
			props.graphicWrapperProps?.onMouseLeave?.(event);
			removeNoEffect();
		};

		useEffect(() => {
			const hasInteractive = metaRef.current ? getAllInteractiveElements(metaRef.current).length > 0 : false;
			// Updates state when meta element contains interactive elements (buttons, links, etc.)
			setHasInteractiveMeta(hasInteractive);
		}, [props.meta]);

		useEffect(() => {
			// Determines if the list content element should have the right accessibility semantics applied
			setSetAriaAtContent(!hasInteractiveMeta && !props.graphicWrapperProps?.onClick && !props.readonly);
		}, [hasInteractiveMeta, props.graphicWrapperProps?.onClick, props.readonly]);

		useEffect(() => {
			if (prevNoEffect && !hasInteractiveMeta) {
				removeNoEffect();
			}
		}, [hasInteractiveMeta, prevNoEffect]);

		const baseItemClassName = `${baseClassName}-item`;
		const nonInteractiveClassName = `${baseItemClassName}--non-interactive`;
		const selectedTitle = a11yContext.listTitles?.selected;
		const isMobile = provider.isPhone();
		const hasProgressBar = !!props.processedPercentage;
		const percentage = props.processedPercentage !== undefined ? props.processedPercentage : 0;
		const shouldHandleEvents = !props.disabled && !props.readonly;
		const className = joinClassNames(
			baseItemClassName,
			{ [`${baseItemClassName}--readonly ${nonInteractiveClassName}`]: props.readonly },
			{ [`${baseItemClassName}--disabled ${nonInteractiveClassName}`]: props.disabled },
			{ [`${baseItemClassName}--active`]: props.active },
			{ [`${baseItemClassName}--selected`]: props.selected },
			props.className
		);
		const ariaLabel = props.ariaLabel ?? props.title;
		const hasItemClick = !!props.onClick;
		const hasInteractiveChildren = !!(hasInteractiveMeta || props.graphicWrapperProps?.onClick);

		// If both the item and its children are interactive, treat it as nested interactive.
		// Then, the a11y information should be updated.
		// E.g. Apply focus/a11y attributes to the text element, while the interaction styles still look like on the content element.
		const isNestedInteractiveItem = hasItemClick && hasInteractiveChildren;

		return (
			<ListContext.Consumer>
				{(listContextValue) => (
					<StyledListItemWrapper
						ref={getWrapperRef}
						id={props.id}
						className={className}
						style={props.style}
						data-role={props.dataRole || DataRoles.List.Item}
						$readonly={props.readonly}
						$disabled={props.disabled || hasProgressBar}
						$hasDivider={props.divider ?? listContextValue.divider}
						$hasBorder={listContextValue.border}
						$hasButtonSemantics={!!props.buttonSemantics}
					>
						{hasProgressBar && <ProgressBar percentage={percentage} />}
						<StyledListItemContent
							id={props.contentProps?.id}
							title={resolvedTitle}
							aria-label={!props.text ? ariaLabel : undefined}
							aria-disabled={setAriaAtContent ? props.disabled || hasProgressBar : undefined}
							tabIndex={setAriaAtContent ? getTabIndex() : undefined}
							aria-pressed={setAriaAtContent ? props.selected : undefined}
							role={setAriaAtContent ? "button" : undefined}
							className={`${baseItemClassName}__content`}
							data-role={DataRoles.List.Item.Content}
							onFocus={props.onFocus}
							onClick={shouldHandleEvents ? props.onClick : undefined}
							onMouseDown={props.onMouseDown}
							onKeyDown={shouldHandleEvents ? (props.onKeyDown || props.onClick) && handleKeyDown : undefined}
							onKeyUp={shouldHandleEvents && props.onKeyUp ? (event) => props.onKeyUp?.(event) : undefined}
							onMouseOver={props.onMouseOver}
							onMouseEnter={props.onMouseEnter}
							onMouseLeave={props.onMouseLeave}
							ref={getContentRef}
							$selected={props.selected}
							$readonly={props.readonly}
							$disabled={props.disabled || hasProgressBar}
							$noEffect={noEffect}
							$useAsButton={setAriaAtContent}
							$useFocusWithinStyles={isNestedInteractiveItem}
							$buttonSemantics={props.buttonSemantics}
							$preserveMainActionStyles={props.preserveMainActionStyles}
							{...props.htmlAttributes}
						>
							{props.graphic && (
								<StyledListItemGraphic
									aria-hidden={props.graphicWrapperProps?.onClick ? undefined : true}
									data-role={DataRoles.List.Item.Graphic}
									onMouseOver={onGraphicMouseOver}
									onMouseLeave={onGraphicMouseLeave}
									onTouchStart={addNoEffect}
									onTouchEnd={removeNoEffect}
									{...props.graphicWrapperProps}
									ref={typeof props.graphicWrapperProps?.ref !== "string" ? props.graphicWrapperProps?.ref : undefined}
									$iconPlaceholder={!isValidElement(props.graphic)}
									$disabled={props.disabled || hasProgressBar}
								>
									{props.graphic}
								</StyledListItemGraphic>
							)}
							{props.text && (
								<StyledListItemText
									ref={getTextRef}
									className={`${baseItemClassName}__text`}
									data-role={DataRoles.List.Item.Text}
									aria-disabled={isNestedInteractiveItem && props.disabled ? true : undefined}
									role={isNestedInteractiveItem ? "button" : undefined}
									tabIndex={isNestedInteractiveItem ? getTabIndex() : undefined}
									$paddedLeft={listContextValue.paddedLeft}
									$paddedRight={listContextValue.paddedRight}
									$selected={props.selected}
								>
									{!props.flipped && !listContextValue.flipped && props.text}
									{props.secondaryText && (
										<StyledListItemSecondaryText
											className={`${baseItemClassName}__secondary-text`}
											data-role={DataRoles.List.Item.SecondaryText}
										>
											{props.secondaryText}
										</StyledListItemSecondaryText>
									)}
									{(props.flipped || listContextValue.flipped) && props.text}
									{!!hintRenderer && <HiddenText>{ariaLabel}</HiddenText>}
								</StyledListItemText>
							)}
							{props.selected && selectedTitle && isMobile && <HiddenText>{selectedTitle}</HiddenText>}
							{props.meta && (
								<StyledListItemMeta
									ref={metaRef}
									className={`${baseItemClassName}__meta`}
									data-role={DataRoles.List.Item.Meta}
									onMouseOver={addNoEffect}
									onMouseLeave={removeNoEffect}
									onTouchStart={addNoEffect}
									onTouchEnd={removeNoEffect}
									$disabled={props.disabled || hasProgressBar}
								>
									{props.meta}
								</StyledListItemMeta>
							)}
							{hintRenderer?.()}
						</StyledListItemContent>
					</StyledListItemWrapper>
				)}
			</ListContext.Consumer>
		);
	}

	Item.displayName = "List.Item";
}
