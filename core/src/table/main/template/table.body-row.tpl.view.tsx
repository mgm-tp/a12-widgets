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

import type { MouseEvent, KeyboardEvent, TouchEvent, FocusEvent, ReactElement } from "react";
import { memo, useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Key } from "ts-key-enum";
import { styled, css } from "styled-components";
import { darken } from "polished";

import { getNearestFocusableParent, getRole, joinClassNames } from "../../../common/main/utils.js";
import { provider } from "../../../common/main/device-detector.js";
import { useSelectedText } from "../../../common/main/hooks.js";
import { active, activeAndHover, darkFocus, hover } from "../../../theme/base/mixins/_interaction.js";
import { StyledTextOutputContent } from "../../../text-output/main/text-output.view.js";
import { useTableContext } from "../../new-api/table.context.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { StyledBaseTable, StyledTableMixins } from "./table.styled.js";
import {
	StyledTableContextProvider,
	useOptimalTableContextValue,
	useStyledTableContext
} from "./table.context.styled.js";
import { StyledTableExpandableWrapper } from "./table.expandable-body-row-wrapper.tpl.view.js";

const bodyRowStates = (selected?: boolean, beforeBorder?: string, afterBorder?: string) => {
	return css`
		&&:before {
			border: ${beforeBorder};
		}
		${selected &&
		css`
			&:after {
				border-left-color: ${afterBorder};
			}
		`}
	`;
};

export const StyledBodyRowBadgeWrapper = styled.div.withConfig({ displayName: "StyledBodyRowBadgeWrapper-sc-" })(() => {
	return css`
		position: absolute;
		z-index: 1;
		left: 0;
		top: 0;

		&:before {
			content: "";
			transform-origin: 0 0;
			border-right: 1px solid transparent;
			position: absolute;
			right: 0;
		}
	`;
});

export const StyledTableBodyRow = styled(StyledBaseTable.Row).withConfig({ displayName: "StyledTableBodyRow-sc-" })<{
	virtualScroll?: boolean;
}>((props) => {
	const { theme, cardView, virtualScroll, tabIndex } = props;

	const cellHighlighting = useTableContext((context) => context.cellHighlighting);
	const crossTabulation = useTableContext((context) => context.crossTabulation);

	const rowSelected = useStyledTableContext((context) => !!context.row?.selected);
	const rowHighlightVariant = useStyledTableContext((context) => context.row?.highlightVariant);
	const rowHighlighted = useStyledTableContext((context) => !!context.row?.highlighted);
	const rowDisabled = useStyledTableContext((context) => !!context.row?.disabled);
	const rowInteractive = useStyledTableContext((context) => !!context.row?.interactive);
	const rowNoEffect = useStyledTableContext((context) => !!context.row?.noEffect);
	const contextMenuOpen = useStyledTableContext((context) => !!context.row?.contextMenuOpen);

	const { table } = theme.components;
	const { bodyRow, header } = table;
	const { lineHeight } = theme.baseInputStyles;

	const background = rowDisabled
		? bodyRow.disabled.background
		: rowSelected || contextMenuOpen
			? bodyRow.selected.background
			: rowHighlightVariant === "info"
				? bodyRow.infoBG
				: rowHighlightVariant === "success"
					? bodyRow.successBG
					: rowHighlighted
						? bodyRow.highlightedBG
						: bodyRow.background;

	return css`
		line-height: ${lineHeight};
		outline: none;
		overflow: hidden;
		position: relative;
		&:before,
		&:after {
			bottom: 0;
			left: 0;
			position: absolute;
			top: 0;
			content: ""; // Right-clicking on rows does not open the context menu in Firefox when add content for :after
			pointer-events: none;
		}
		&:before {
			right: 0;
		}
		&:not(:last-child):before,
		${StyledTableExpandableWrapper}:not(:last-child) &:before {
			border-bottom: ${bodyRow.borderBottom};
		}
		&:after {
			display: block;
		}
		${StyledTableMixins.setRowBG({ background, theme })};

		// For non-interactive row
		${!rowInteractive &&
		!rowDisabled &&
		!cellHighlighting &&
		css`
			${!(rowHighlightVariant === "info" && tabIndex === -1) &&
			css`
				${StyledTableMixins.setRowBG({ background: bodyRow.nonInteractive.hoverBG, theme, state: "hover" })};
				${StyledTableMixins.setRowBG({ background: bodyRow.nonInteractive.activeBG, theme, state: "active" })};
				${hover(css`
					${StyledBodyRowBadgeWrapper} ${StyledIconWrapper} {
						color: ${darken(bodyRow.subBGRatio, bodyRow.nonInteractive.hoverBG)};
					}
				`)}
				&:focus {
					${StyledBodyRowBadgeWrapper} ${StyledIconWrapper} {
						color: ${darken(bodyRow.subBGRatio, bodyRow.nonInteractive.hoverBG)};
					}
				}
			`};
			${StyledTableMixins.setRowBG({ background: bodyRow.nonInteractive.focusBG, theme, state: "focus" })};
		`};

		${rowSelected &&
		css`
			&:after {
				border-bottom: 0;
				border-left: ${bodyRow.selected.borderLeft};
			}
		`}

		${!rowNoEffect &&
		css`
			${activeAndHover(css`
				${!rowInteractive &&
				css`
					box-shadow: none;
				`}
			`)};
			${rowInteractive &&
			!rowDisabled &&
			css`
				${active(css`
					${bodyRowStates(rowSelected, bodyRow.interactive.activeBorder, bodyRow.selected.activeBorderColor)};
				`)};
				${hover(css`
					cursor: pointer;
					${bodyRowStates(rowSelected, bodyRow.interactive.hoverBorder, bodyRow.selected.hoverBorderColor)};
				`)};
				&:focus {
					${bodyRowStates(rowSelected, bodyRow.interactive.focusBorder, bodyRow.selected.focusBorderColor)};
					&:before {
						box-sizing: border-box;
						margin: 1px;
						${darkFocus};
					}
					&:after {
						background-color: ${bodyRow.selected.focusBG};
						background-clip: padding-box;
						border-left-width: ${rowSelected ? bodyRow.selected.focusBorderWidth : bodyRow.interactive.borderWidth};
						box-sizing: border-box;
						margin: 1px 0 1px 1px;
						width: ${bodyRow.interactive.borderWidth};
					}
				}
			`}
		`}

		${rowDisabled &&
		css`
			color: ${bodyRow.disabled.color};
		`}
		${StyledTextOutputContent} {
			color: inherit;
		}
		${cardView &&
		css`
			margin: 16px auto;
			width: ${table.cardView.bodyRow.width};
		`}

		${!rowInteractive &&
		css`
			${activeAndHover(css`
				${StyledTableMixins.setInputBG({ background: bodyRow.inputsHighlightedBG })}
			`)}
			&:focus {
				${StyledTableMixins.setInputBG({ background: bodyRow.inputsHighlightedBG })}
			}
		`}
		${(rowSelected || rowHighlightVariant || rowHighlighted) &&
		css`
			${StyledTableMixins.setInputBG({ background: bodyRow.inputsHighlightedBG })}
		`}

		${!rowNoEffect &&
		css`
			// Apply for additional content of expandable row
			@media (pointer: fine) {
				${StyledTableExpandableWrapper} > :first-child:hover + & {
					${StyledTableMixins.setRowBG({ background: bodyRow.nonInteractive.hoverBG, theme })};
				}
			}

			@media (pointer: coarse) {
				${StyledTableExpandableWrapper} > :first-child:active + & {
					${StyledTableMixins.setRowBG({ background: bodyRow.nonInteractive.activeBG, theme })};
				}
			}
		`}
		@media (pointer: fine) {
			${StyledTableExpandableWrapper} > :first-child + &:hover {
				${StyledTableMixins.setRowBG({ background: bodyRow.infoBG, theme })};
			}
		}

		@media (pointer: coarse) {
			${StyledTableExpandableWrapper} > :first-child + &:active {
				${StyledTableMixins.setRowBG({ background: bodyRow.infoBG, theme })};
			}
		}

		${virtualScroll &&
		css`
			&:last-child:before {
				border-bottom: ${bodyRow.borderBottom};
			}
		`};
		// Style for touch devices with non-hover-capable pointing
		// Non-interactive Row
		${!rowDisabled &&
		css`
			${cellHighlighting &&
			crossTabulation &&
			provider.hasTouch() &&
			css`
				&:focus-within {
					[data-role="${DataRoles.Table.Body.Row.SegmentLeft}"] {
						&:not(:active):not(:focus-within) {
							background-color: ${darken(bodyRow.subBGRatio, header.background)};
						}
					}
				}
			`};
			${!cellHighlighting &&
			!rowInteractive &&
			css`
				&:active,
				&:focus-within {
					background-color: ${bodyRow.nonInteractive.focusBG};
					${StyledTableMixins.setInputBG({ background: bodyRow.inputsHighlightedBG })}
				}
			`}
		`};
		// Interactive Row
		${!rowNoEffect &&
		rowInteractive &&
		css`
			@media (pointer: coarse) and (any-hover: none) {
				&:not(:focus):active {
					&:before {
						border: none;
						border-bottom: ${bodyRow.borderBottom};
						box-sizing: border-box;
					}
					&:after {
						border-left: ${rowSelected && bodyRow.selected.borderLeft};
						box-sizing: border-box;
					}
				}
			}
		`}

		${cellHighlighting &&
		crossTabulation &&
		!rowDisabled &&
		css`
			${hover(css`
				${StyledBodyRowBadgeWrapper} ${StyledIconWrapper} {
					color: ${darken(bodyRow.subBGRatio, header.background)};
				}

				[data-role="${DataRoles.Table.Body.Row.SegmentLeft}"] {
					&:not(:hover) {
						background-color: ${darken(bodyRow.subBGRatio, header.background)};
					}
				}
			`)};
		`}
	`;
});

export const BodyRowTpl = memo(function BodyRowTpl(
	props: TableTemplateProps.BodyRowProps
): ReactElement<TableTemplateProps.BodyRowProps> {
	const { onClick, onKeyDown, onRendered, onMouseOver, wrapperRef, onFocus } = props;
	const tabIndex = props.tabIndex ?? (props.disabled ? undefined : props.interactive ? 0 : -1);
	const isInteractive = (!props.disabled && props.interactive) || tabIndex !== -1;

	const bodyRowRef = useRef<HTMLDivElement | null>(null);
	const { isSelectedText } = useSelectedText(bodyRowRef, isInteractive);
	const cardView = useTableContext((context) => context.cardView);
	const hasVirtualScroll = useTableContext((context) => !!context.virtualScrollOptions);
	const hasInfiniteScroll = useTableContext((context) => !!context.infiniteScrollOptions);
	const dnd = useTableContext((context) => !!context.dragDropOptions);
	const [contextMenuOpen, setContextMenuOpen] = useState<boolean>(false);

	const getRef = useCallback(
		(param: HTMLDivElement | null) => {
			wrapperRef?.(param);
			bodyRowRef.current = param;
		},
		[wrapperRef]
	);

	const [addNoEffectClass, setAddNoEffectClass] = useState(false);

	const noEffectClassName = `${BASE_TABLE_CLASSNAME}__contentRow--no-effect`;

	const classNames = useMemo(
		() =>
			joinClassNames(
				`${BASE_TABLE_CLASSNAME}__contentRow`,
				{ [`${BASE_TABLE_CLASSNAME}__contentRow--interactive`]: isInteractive },
				{ [`${BASE_TABLE_CLASSNAME}__contentRow--selected`]: props.selected },
				{ [`${BASE_TABLE_CLASSNAME}__contentRow--${props.highlightVariant}`]: props.highlightVariant },
				{ [`${BASE_TABLE_CLASSNAME}__contentRow--highlighted`]: props.highlighted },
				{ [`${BASE_TABLE_CLASSNAME}__contentRow--disabled`]: props.disabled },
				{ [`${noEffectClassName}`]: addNoEffectClass },
				props.className
			),
		[
			isInteractive,
			props.selected,
			props.highlightVariant,
			props.highlighted,
			props.disabled,
			props.className,
			noEffectClassName,
			addNoEffectClass
		]
	);

	useEffect(() => {
		if (!onRendered) {
			return;
		}

		const imgTags = bodyRowRef.current?.getElementsByTagName("img");

		if (imgTags && imgTags.length > 0) {
			for (let i = 0; i < imgTags.length; i++) {
				imgTags[i].addEventListener("load", onRendered);
			}

			return (): void => {
				for (let i = 0; i < imgTags.length; i++) {
					imgTags[i].removeEventListener("load", onRendered);
				}
			};
		} else {
			onRendered();

			return;
		}
	}, [onRendered]);

	const handleOnClick = useCallback(
		(event: MouseEvent<HTMLElement>): void => {
			if (!onClick) {
				return;
			}

			if (dnd) {
				window.getSelection()?.removeAllRanges();
			}

			// js-dom doesn't support window.getSelection yet
			// See https://github.com/jsdom/jsdom/issues/317 for more detail
			// So just simply trigger onClick here in test environment
			if (!window.getSelection) {
				onClick(event);
			} else {
				const selection = window.getSelection();

				if (!isSelectedText || !bodyRowRef.current?.contains(selection?.anchorNode as HTMLElement)) {
					onClick(event);
				}
			}
		},
		[onClick, dnd, isSelectedText]
	);

	const handleOnKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			if (event.key === Key.Enter && event.target === bodyRowRef.current) {
				onClick?.(event as any);
			}

			onKeyDown?.(event);
		},
		[onClick, onKeyDown]
	);

	const shouldAddNoEffectClassName = useCallback(
		(event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>): void => {
			if (props.disabled || !props.interactive) {
				return;
			}

			const nearestFocusableParentElement = getNearestFocusableParent(event.target as HTMLElement);
			setAddNoEffectClass(
				!!(
					document.activeElement !== bodyRowRef.current &&
					nearestFocusableParentElement &&
					bodyRowRef.current !== nearestFocusableParentElement
				)
			);
		},
		[props.disabled, props.interactive]
	);

	const handleMouseOver = useCallback(
		(event: MouseEvent<HTMLElement>): void => {
			onMouseOver?.(event);
			shouldAddNoEffectClassName(event);
		},
		[onMouseOver, shouldAddNoEffectClassName]
	);

	const handleFocusTableRow = useCallback(
		(event: FocusEvent<HTMLElement>) => {
			setAddNoEffectClass(false);
			onFocus?.(event);
		},
		[onFocus]
	);

	const contextValue = useOptimalTableContextValue({
		row: {
			highlighted: props.highlighted,
			highlightVariant: props.highlightVariant,
			selected: props.selected,
			disabled: props.disabled,
			interactive: isInteractive,
			noEffect: addNoEffectClass,
			contextMenuOpen,
			setContextMenuOpen
		}
	});

	return (
		<StyledTableContextProvider value={contextValue}>
			<StyledTableBodyRow
				aria-selected={props.ariaSelected}
				id={props.id}
				className={classNames}
				style={props.style}
				onClick={!props.disabled && props.onClick ? handleOnClick : undefined}
				onKeyDown={onClick || onKeyDown ? handleOnKeyDown : undefined}
				onBlur={props.onBlur}
				onFocus={handleFocusTableRow}
				onContextMenu={props.onContextMenu}
				data-role={props.dataRole || DataRoles.Table.Body.Row}
				role={getRole(props.role, "row")}
				tabIndex={tabIndex}
				title={props.title}
				ref={getRef}
				onMouseOver={handleMouseOver}
				onTouchStart={shouldAddNoEffectClassName}
				cardView={cardView}
				virtualScroll={hasVirtualScroll || hasInfiniteScroll}
				{...props.htmlAttributes}
			>
				{props.children}
			</StyledTableBodyRow>
		</StyledTableContextProvider>
	);
});

BodyRowTpl.displayName = "BodyRowTpl";
