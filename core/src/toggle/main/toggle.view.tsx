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

import type { KeyboardEvent, FocusEvent, MouseEvent, ElementType, ReactNode, ReactElement } from "react";
import {
	createContext,
	useContext,
	useRef,
	useState,
	useCallback,
	useEffect,
	useMemo,
	Children,
	isValidElement,
	cloneElement
} from "react";
import { Key } from "ts-key-enum";

import {
	generateUid,
	addPrefix,
	joinClassNames,
	Key as KeyUtils,
	moveItemFocusBack,
	moveItemFocusNext,
	getNearestFocusableParent,
	getParentElement,
	StringUtils,
	inputWithSuffixName
} from "../../common/main/utils.js";
import { HiddenText, StyledHiddenTextWrapper } from "../../common/main/hidden-text/hidden-text.view.js";
import { provider } from "../../common/main/device-detector.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { Label } from "../../input/base/template/base.tpl.view.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ToggleProps, ToggleItemProps } from "./toggle.api.js";
import { StyledToggle } from "./toggle.styled.js";

const baseClassName = addPrefix("toggle");
const baseFieldClassName = addPrefix("field");

type SelectedItem = Pick<ToggleItemProps, "variant" | "title" | "children">;

type ToggleContextType = {
	setSelectedItem?: (params: SelectedItem) => void;
	toggleOverlay?: (show: boolean) => void;
	showOnlySelectedOption?: boolean;
};

const ToggleContext = createContext<ToggleContextType>({});

const ToggleContextProvider = ToggleContext.Provider;

export function Toggle(props: ToggleProps): ReactElement<ToggleProps> {
	const { onValueChanged, disabled, readOnly, id, value, showOnlySelectedOption, style, block, className, label } =
		props;

	const toggleButtonTitles = useContext(A11YLanguageContext).toggleButtonTitles;

	const wrapperClassNames = joinClassNames(
		baseFieldClassName,
		baseClassName,
		{ [`${baseClassName}--block`]: block },
		className
	);
	const toggleRef = useRef<HTMLDivElement | null>(null);
	const selectedItemOverlayRef = useRef<HTMLSpanElement | null>(null);
	const focusableItemRefs = useRef<Array<HTMLElement | null>>([]);
	const mouseEventTimeoutRef = useRef<number | null>(null);
	const touchEventTimeoutRef = useRef<number | null>(null);
	const shouldHandleHoverEvents = useRef(true);
	const shouldShowOverlay = useRef(true);
	const [{ variant, title, children }, setState] = useState<SelectedItem>({});
	const [showOverlay, setShowOverlay] = useState(true);
	const [touchStarted, setTouchStarted] = useState(false);
	const shouldHandleTouchEvent = (provider.hasTouch() && !provider.isDesktop()) || touchStarted;
	const desktopWithTouch = provider.hasTouch() && provider.isDesktop();

	const { hintRenderer } = useInteractionHint({
		title,
		componentKey: "toggle",
		referenceElementRef: selectedItemOverlayRef
	});

	const handleMouseEnter = useCallback((): void => {
		if (showOverlay) {
			const shouldFocusFirstElement = toggleRef.current?.contains(document.activeElement);
			//fix fast hovering bug
			mouseEventTimeoutRef.current = window.setTimeout(() => {
				setShowOverlay(false);

				if (shouldFocusFirstElement) {
					focusableItemRefs.current?.[0]?.focus();
				}

				mouseEventTimeoutRef.current = null;
			}, 100);
		}
	}, [showOverlay, toggleRef]);

	const handleMouseLeave = useCallback((): void => {
		//fix fast hovering bug
		if (mouseEventTimeoutRef.current !== null) {
			window.clearTimeout(mouseEventTimeoutRef.current);
		}

		if (!showOverlay && shouldHandleHoverEvents.current) {
			setShowOverlay(true);
			setTimeout(() => {
				if (toggleRef.current?.contains(document.activeElement) && selectedItemOverlayRef.current) {
					selectedItemOverlayRef.current?.focus();
				}
			});
		}
	}, [selectedItemOverlayRef, showOverlay, toggleRef]);

	const toggleOverlay = useCallback((show = true) => {
		shouldHandleHoverEvents.current = show;
		setShowOverlay(show);
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent): void => {
			if (showOverlay) {
				if (event.key === Key.Enter || event.key === KeyUtils.Space) {
					event.preventDefault();
					toggleOverlay(false);
					focusableItemRefs.current?.[0]?.focus();
				}
			} else {
				if (event.key === Key.ArrowLeft || event.key === Key.ArrowRight) {
					const moveFocus = event.key === Key.ArrowLeft ? moveItemFocusBack : moveItemFocusNext;
					moveFocus(toggleRef.current as HTMLDivElement, document.activeElement, "[tabindex='0']:not(:disabled)", true);
				}

				if (event.key === Key.Escape) {
					toggleOverlay();
				}
			}
		},
		[showOverlay, toggleOverlay]
	);

	const handleOnFocus = useCallback((event: FocusEvent): void => {
		if (
			(event.target as HTMLElement) !== selectedItemOverlayRef.current &&
			event.relatedTarget &&
			(event.relatedTarget as HTMLElement).getAttribute("data-role") !== `${DataRoles.Toggle.SelectedItemOverlay}`
		) {
			shouldHandleHoverEvents.current = false;
		}
	}, []);

	const handleOnBlur = useCallback(
		(event: FocusEvent): void => {
			if (
				toggleRef.current &&
				!showOverlay &&
				!event.currentTarget.contains(event.relatedTarget) &&
				shouldShowOverlay.current
			) {
				toggleOverlay();
			}
		},
		[showOverlay, toggleOverlay, toggleRef]
	);

	const handleOnClick = useCallback(
		(event: MouseEvent) => {
			shouldShowOverlay.current = true;

			if (shouldHandleTouchEvent) {
				setShowOverlay(false);
				toggleRef.current?.focus();

				return;
			}

			if (!toggleRef.current?.contains(document.activeElement)) {
				return;
			}

			const targetElement = event.target as HTMLElement;
			const nearestFocusableParent = getNearestFocusableParent(targetElement);

			if (nearestFocusableParent?.getAttribute("data-role") === DataRoles.Toggle.Item) {
				nearestFocusableParent.focus();
				shouldHandleHoverEvents.current = true;
			}
		},
		[toggleRef, shouldHandleTouchEvent]
	);

	// This click handler is needed for keyboard use with screen readers
	const handleOverlayWrapperClick = useCallback(() => {
		setShowOverlay(!showOverlay);
		toggleRef.current?.focus();
	}, [showOverlay, toggleRef]);

	const handleOnMouseDown = useCallback(
		(event: MouseEvent) => {
			if (!toggleRef.current?.contains(document.activeElement)) {
				return;
			}

			// Prevent overlay from showing when clicking to disabled item
			const disabledItem = getParentElement(
				event.target as HTMLElement,
				(element) =>
					element.getAttribute("data-role") === DataRoles.Toggle.Item && (element as HTMLButtonElement).disabled
			);

			if (disabledItem) {
				shouldHandleHoverEvents.current = true;
				shouldShowOverlay.current = false;
			}
		},
		[toggleRef]
	);

	const handleItemWrapperRef = useCallback((element: HTMLElement | null, itemProps: ToggleItemProps): void => {
		if (!itemProps.readOnly && !itemProps.disabled && element) {
			focusableItemRefs.current.push(element);
		}

		itemProps.wrapperRef?.(element);
	}, []);

	useEffect(() => {
		if (showOnlySelectedOption) {
			if (showOverlay && toggleRef.current?.contains(document.activeElement)) {
				setTimeout(() => {
					selectedItemOverlayRef.current?.focus();
				}); //Focus to the overlay if it is open
			}

			focusableItemRefs.current?.forEach((item) => {
				(item as HTMLElement).tabIndex = showOverlay ? -1 : 0;
			});
		}
	}, [showOnlySelectedOption, showOverlay, selectedItemOverlayRef, toggleRef, touchStarted]);

	const setSelectedItem = useCallback(({ variant, title, children }: SelectedItem) => {
		setState({ variant, title, children });
	}, []);

	const toggleContextValue = useMemo(
		() => ({
			setSelectedItem,
			toggleOverlay,
			showOnlySelectedOption
		}),
		[setSelectedItem, toggleOverlay, showOnlySelectedOption]
	);

	const renderSelectedItemOverlay = (): ReactNode => {
		const a11yTitle = StringUtils.join(
			title,
			{ ",": title && showOverlay },
			{ [`${toggleButtonTitles?.overlayTitle}`]: showOverlay }
		);

		const overlayProperties = showOverlay
			? {
					tabIndex: !disabled && !readOnly ? 0 : undefined,
					$variant: variant,
					$readonly: readOnly,
					$disabled: disabled,
					$hasTouch: shouldHandleTouchEvent
				}
			: { tabIndex: -1 };

		const Component = (showOverlay ? StyledToggle.StyledSelectedItemOverlay : StyledHiddenTextWrapper) as ElementType;

		return (
			<Component
				data-role={DataRoles.Toggle.SelectedItemOverlay}
				ref={selectedItemOverlayRef}
				role="button"
				title={a11yTitle}
				aria-label={a11yTitle}
				aria-expanded={!showOverlay}
				aria-disabled={disabled || readOnly}
				onClick={!disabled && !readOnly ? handleOverlayWrapperClick : undefined}
				{...overlayProperties}
			>
				{children}
				{hintRenderer?.()}
			</Component>
		);
	};

	const renderChildren = useMemo(() => {
		return Children.map(props.children, (button, index) => {
			const buttonElement = isValidElement<ToggleItemProps>(button)
				? cloneElement<ToggleItemProps>(button, {
						id: button.props.id ?? (id && `${inputWithSuffixName(id)}${index + 1}`),
						disabled: disabled ?? button.props.disabled,
						readOnly: readOnly ?? button.props.readOnly,
						key: button.props.value,
						selected: button.props.value === value,
						wrapperRef: (element) => handleItemWrapperRef(element, button.props),
						onClick:
							onValueChanged || button.props.onClick
								? (event: MouseEvent<HTMLElement>) => {
										onValueChanged?.(button.props.value, value);
										button.props.onClick?.(event);

										if (shouldHandleTouchEvent) {
											event.stopPropagation();
											toggleOverlay(true);
										}
									}
								: undefined
					})
				: button;

			return buttonElement && showOnlySelectedOption && isValidElement<ToggleItemProps>(button) ? (
				<StyledToggle.StyledOptionButton
					data-role={DataRoles.Toggle.OptionButton}
					$disabled={disabled ?? button.props.disabled}
					$readonly={readOnly ?? button.props.readOnly}
				>
					{buttonElement}
				</StyledToggle.StyledOptionButton>
			) : (
				buttonElement
			);
		});
	}, [
		props.children,
		id,
		disabled,
		readOnly,
		value,
		onValueChanged,
		showOnlySelectedOption,
		handleItemWrapperRef,
		shouldHandleTouchEvent,
		toggleOverlay
	]);

	const shouldAddEvents = useMemo(() => !readOnly && !disabled && !!focusableItemRefs.current, [disabled, readOnly]);

	const handleTouchStart = useCallback(() => {
		// Fix bug on touch device has mouse support
		if (showOverlay && desktopWithTouch) {
			if (touchEventTimeoutRef.current !== null) {
				window.clearTimeout(touchEventTimeoutRef.current);
				touchEventTimeoutRef.current = null;
			}

			setTouchStarted(true);
		}
	}, [showOverlay, desktopWithTouch]);

	const handleTouchEnd = useCallback(() => {
		if (!desktopWithTouch) {
			return;
		}

		touchEventTimeoutRef.current = window.setTimeout(() => {
			if (showOverlay) {
				setTouchStarted(false);
			} else {
				shouldHandleHoverEvents.current = true;
			}
		}, 200);

		if (!showOverlay) {
			toggleOverlay(true);
		}
	}, [desktopWithTouch, showOverlay, toggleOverlay]);

	return (
		<StyledToggle.StyledFieldWrapper
			className={wrapperClassNames}
			style={style}
			id={id}
			data-role={DataRoles.Toggle}
			$block={block}
		>
			<Label label={label} disabled={disabled} htmlFor={id} dataRole={DataRoles.Toggle.Label} />
			{showOnlySelectedOption ? (
				<StyledToggle.StyledToggleWrapper
					className={`${baseClassName}__wrapper`}
					onMouseEnter={shouldAddEvents && !shouldHandleTouchEvent ? handleMouseEnter : undefined}
					onMouseLeave={shouldAddEvents && !shouldHandleTouchEvent ? handleMouseLeave : undefined}
					onKeyDown={shouldAddEvents ? handleKeyDown : undefined}
					onBlur={shouldAddEvents ? handleOnBlur : undefined}
					onFocus={shouldAddEvents ? handleOnFocus : undefined}
					onClick={shouldAddEvents ? handleOnClick : undefined}
					onMouseDown={shouldAddEvents && !shouldHandleTouchEvent ? handleOnMouseDown : undefined}
					data-role={DataRoles.Toggle.Wrapper}
					$block={block}
					$showOverlay={showOverlay}
					$showOnlySelectedOption={showOnlySelectedOption}
					ref={toggleRef}
					tabIndex={-1}
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
				>
					<ToggleContextProvider value={toggleContextValue}>
						{renderSelectedItemOverlay()}
						<StyledToggle.StyledOptionButtons
							data-role={DataRoles.Toggle.OptionButtons}
							aria-hidden={showOverlay}
							$hasOverlay={showOverlay}
						>
							{renderChildren}
						</StyledToggle.StyledOptionButtons>
					</ToggleContextProvider>
				</StyledToggle.StyledToggleWrapper>
			) : (
				<StyledToggle.StyledToggleWrapper className={`${baseClassName}__wrapper`}>
					<ToggleContextProvider value={toggleContextValue}>{renderChildren}</ToggleContextProvider>
				</StyledToggle.StyledToggleWrapper>
			)}
		</StyledToggle.StyledFieldWrapper>
	);
}

Toggle.displayName = "Toggle";

export namespace Toggle {
	export function Item(props: ToggleItemProps): ReactElement<ToggleItemProps> {
		const { disabled, readOnly, selected, className, id, onClick, children, title, variant, wrapperRef, ...rest } =
			props;

		const { setSelectedItem, showOnlySelectedOption, toggleOverlay } = useContext(ToggleContext);
		const selectedTitle = useContext(A11YLanguageContext).toggleButtonTitles?.selected;

		const isMobile = provider.isPhone();
		const toggleItemRef = useRef<HTMLButtonElement | null>(null);
		const { hintRenderer } = useInteractionHint({
			title,
			componentKey: "toggle",
			referenceElementRef: toggleItemRef
		});

		const itemClassName = joinClassNames(
			`${baseClassName}__item`,
			{ [`${baseClassName}__item--disabled`]: disabled },
			{ [`${baseClassName}__item--readonly`]: readOnly },
			{ [`${baseClassName}__item--selected`]: selected },
			className
		);
		const buttonId = id || generateUid();

		const handleKeyDown = useCallback(
			(event: KeyboardEvent) => {
				if (event.key === KeyUtils.Space || event.key === Key.Enter) {
					event.preventDefault();
					onClick?.(event as any);
					setTimeout(() => toggleOverlay?.(true));
				}
			},
			[onClick, toggleOverlay]
		);

		const shouldAddEvents = useMemo(() => !readOnly && !disabled, [disabled, readOnly]);

		useEffect(() => {
			if (selected && setSelectedItem) {
				setSelectedItem?.({ variant, children, title });
			}
		}, [selected, variant, children, title, setSelectedItem]);

		const getToggleItemRef = useCallback(
			(ref: HTMLButtonElement) => {
				wrapperRef?.(ref);
				toggleItemRef.current = ref;
			},
			[wrapperRef]
		);

		/**
		 * Handle hide and show overlay after hover over the toggle item.
		 */
		useEffect(() => {
			toggleItemRef.current?.addEventListener("mouseout", () => {
				toggleOverlay?.(true);
			});

			toggleItemRef.current?.addEventListener("mouseover", () => {
				toggleOverlay?.(false);
			});

			return (): void => {
				toggleItemRef.current?.removeEventListener("mouseout", () => {
					toggleOverlay?.(true);
				});

				toggleItemRef.current?.removeEventListener("mouseover", () => {
					toggleOverlay?.(false);
				});
			};
		}, [toggleOverlay]);

		return (
			<StyledToggle.StyledToggleItem
				type="button"
				id={buttonId}
				className={itemClassName}
				disabled={disabled || readOnly}
				onClick={shouldAddEvents ? onClick : undefined}
				data-role={DataRoles.Toggle.Item}
				aria-pressed={selected}
				onKeyDown={shouldAddEvents && onClick ? handleKeyDown : undefined}
				tabIndex={showOnlySelectedOption ? -1 : undefined}
				ref={getToggleItemRef}
				$selected={selected}
				$readonly={readOnly}
				$disabled={disabled}
				$showOnlySelectedOption={showOnlySelectedOption}
				title={hintRenderer ? "" : title}
				{...rest}
			>
				<StyledToggle.StyledToggleContent
					data-role={DataRoles.Toggle.ItemContent}
					className={`${baseClassName}__content`}
					$showOnlySelectedOption={showOnlySelectedOption}
				>
					{children}
					{isMobile && selected && selectedTitle && <HiddenText>{selectedTitle} </HiddenText>}
					{!!hintRenderer && <HiddenText>{title}</HiddenText>}
				</StyledToggle.StyledToggleContent>
				{hintRenderer?.()}
			</StyledToggle.StyledToggleItem>
		);
	}
}
