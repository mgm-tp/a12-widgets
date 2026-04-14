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

import type { MouseEvent, ReactElement } from "react";
import { memo, useRef, useContext, useCallback, useMemo } from "react";
import { styled, css } from "styled-components";
import { darken } from "polished";

import { addPrefix, joinClassNames, getRole } from "../../../common/main/utils.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { useSelectedText } from "../../../common/main/hooks.js";
import { activeAndHover, darkFocus } from "../../../theme/base/mixins/_interaction.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { useTableContext } from "../../new-api/table.context.js";
import type { Column } from "../../new-api/column.api.js";
import { StyledSelectTemplate } from "../../../input/select/main/select.styled.js";
import { createPseudoElement } from "../../../theme/base/mixins/_pseudo.js";
import { StyledCheckbox } from "../../../input/checkbox/main/checkbox.styled.js";
import { StyledTreeNodeArrow, StyledTreeNodeIcon } from "../../../tree/main/tpl/tree-elements.styled.js";
import { StyledTableDnDBody } from "../../new-api/table.dnd.view.js";
import { Icon, StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { BASE_TABLE_CLASSNAME } from "../table.internal.js";
import { TableDataAttributes } from "../table.data-attributes.js";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { handleContextMenu, resetBoxShadowForSubInfoCell } from "./table.tpl.utils.js";
import { StyledTableMixins, StyledBaseTable } from "./table.styled.js";
import { useStyledTableContext } from "./table.context.styled.js";
import { StyledBodyRowBadgeWrapper, StyledTableBodyRow } from "./table.body-row.tpl.view.js";
import { StyledTableBodyRowSegment } from "./table.body-row-segment.tpl.view.js";
import { StyledTableExpandableWrapper } from "./table.expandable-body-row-wrapper.tpl.view.js";

export const StyledTableBodyCell = styled(StyledBaseTable.Cell).withConfig({ displayName: "StyledTableBodyCell-sc-" })<{
	actionCell?: boolean;
	useSecondaryColor?: boolean;
	horizAlignment?: Column.HorizontalAlignment;
	verAlignment?: Column.VerticalAlignment;
	$verticalHeader?: boolean;
	$cellHighlighting?: boolean;
	$firstCell?: boolean;
}>(
	({
		theme,
		subInfo,
		actionCell,
		useSecondaryColor,
		horizAlignment,
		verAlignment,
		cardView,
		$verticalHeader,
		$cellHighlighting,
		$firstCell
	}) => {
		const { bodyRow, bodyCell } = theme.components.table;

		const rowSelected = useStyledTableContext((context) => !!context.row?.selected);
		const rowHighlightVariant = useStyledTableContext((context) => context.row?.highlightVariant);
		const rowHighlighted = useStyledTableContext((context) => !!context.row?.highlighted);
		const rowDisabled = useStyledTableContext((context) => !!context.row?.disabled);
		const rowSubInfo = useStyledTableContext((context) => !!context.row?.subInfo);
		const rowInteractive = useStyledTableContext((context) => !!context.row?.interactive);
		const rowNoEffect = useStyledTableContext((context) => !!context.row?.noEffect);

		const background = rowDisabled
			? bodyRow.disabled.background
			: rowSelected
				? bodyRow.selected.background
				: rowHighlightVariant === "info"
					? bodyRow.infoBG
					: rowHighlightVariant === "success"
						? bodyRow.successBG
						: rowHighlighted
							? bodyRow.highlightedBG
							: bodyRow.background;

		return css`
			min-height: ${bodyCell.minHeight};
			overflow: hidden;

			${$firstCell &&
			css`
				isolation: isolate;
			`}

			${StyledBodyRowBadgeWrapper} {
				width: ${bodyRow.badge.width};
				&:before {
					height: ${bodyRow.badge.height};
					transform: ${bodyRow.badge.transform};
				}

				${StyledIconWrapper} {
					font-size: ${bodyRow.badge.fontSize};
					color: ${$verticalHeader
						? bodyCell.subInfo.background
						: subInfo
							? darken(bodyRow.subBGRatio, background)
							: background};
					position: absolute;
					top: 3px;
					left: 4px;
					-webkit-tap-highlight-color: transparent;
					-webkit-touch-callout: none;
					-webkit-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
					user-select: none;
				}
			}

			${!actionCell &&
			css`
				flex-direction: column;
			`};

			${!rowDisabled &&
			$cellHighlighting &&
			!$verticalHeader &&
			css`
				${StyledTableMixins.setRowBG({
					background: subInfo ? darken(bodyRow.subBGRatio, background) : background,
					theme,
					state: "hover",
					darken: true
				})};
				border-bottom: ${bodyRow.borderBottom};
				${StyledTableBodyRow}:last-child && {
					border-bottom: none;
				}

				${StyledTableExpandableWrapper}:last-child &&&& {
					border-bottom: none;
				}

				${StyledTableDnDBody}:last-child &&&& {
					border-bottom: none;
				}

				${StyledTableExpandableWrapper} ${StyledTableBodyRow}:last-child && , ${StyledTableDnDBody} ${StyledTableBodyRow}:last-child && {
					border-bottom: ${bodyRow.borderBottom};
				}
			`};

			${subInfo &&
			!$verticalHeader &&
			css`
				background-color: ${bodyCell.subInfo.background};
				border-bottom: ${bodyRow.borderBottom};
				border-top: ${bodyRow.borderBottom};
				border-top-color: transparent;
				justify-content: center;

				${StyledTableBodyRow}:last-child && {
					border-bottom: none;
				}

				${StyledTableMixins.setRowBG({ background, theme, darken: true })};

				${!rowInteractive &&
				!rowDisabled &&
				!$cellHighlighting &&
				css`
					${StyledTableMixins.setRowBG({
						background: bodyRow.nonInteractive.hoverBG,
						theme,
						state: "hover",
						darken: true,
						selector: StyledTableBodyRow
					})};
					${StyledTableMixins.setRowBG({
						background: bodyRow.nonInteractive.activeBG,
						theme,
						state: "active",
						darken: true,
						selector: StyledTableBodyRow
					})};
					${StyledTableMixins.setRowBG({
						background: bodyRow.nonInteractive.focusBG,
						theme,
						state: "focus",
						darken: true,
						selector: StyledTableBodyRow
					})};
				`}

				${rowInteractive &&
				!rowDisabled &&
				!rowNoEffect &&
				css`
					position: relative;
					border: none;
					${createPseudoElement(":before")}
					&:before {
						border-bottom: ${bodyRow.borderBottom};
						pointer-events: none;
					}

					${activeAndHover(
						css`
							&:before {
								border-top: ${bodyRow.interactive.hoverBorder};
								border-bottom: ${bodyRow.interactive.hoverBorder};
								background-clip: padding-box;
							}
						`,
						`${StyledTableBodyRow}:not(:focus)`
					)};

					@media (pointer: fine) {
						${StyledTableBodyRow}:not(:focus):hover [data-role="${DataRoles.Table.Body.Row
							.SegmentLeft}"] &:first-child:before,
						${StyledTableBodyRow}:not(:focus):hover > [data-role="${DataRoles.Table.Body.Row
							.SegmentScroll}"]:first-child > &:first-child:before {
							border-left: ${bodyRow.interactive.hoverBorder};
						}
					}

					${StyledTableBodyRow}:focus && {
						background-clip: padding-box;
						&:before {
							border-top: ${bodyRow.interactive.focusBorder};
							border-bottom: ${bodyRow.interactive.focusBorder};
							margin: 1px 0;
							${darkFocus}
						}
					}
				`}
			`};

			${!subInfo &&
			!actionCell &&
			css`
				[data-role="${DataRoles.Tree}"] && {
					padding: ${theme.components.treeTable.bodyCell.padding};
				}
			`};

			color: ${useSecondaryColor && bodyCell.secondary.color};
			font-weight: ${rowDisabled && bodyRow.disabled.fontWeight};

			${actionCell &&
			css`
				align-self: center;
				& > * {
					flex-shrink: 0;
					flex-wrap: nowrap;
				}
				&:after {
					content: "";
					font-size: 0;
					min-height: inherit;
				}

				${StyledCheckbox.StyledField} {
					min-height: auto;
				}
			`};

			// Horizontal alignment
			&& > * {
				align-self: ${actionCell || horizAlignment === "center"
					? "center"
					: horizAlignment === "right"
						? "flex-end"
						: "flex-start"};
			}
			&& {
				text-align: ${horizAlignment};
			}
			${StyledSelectTemplate.StyledFieldSelectControl} {
				text-align-last: ${horizAlignment === "center" && "center"};
			}
			${actionCell &&
			css`
				justify-content: ${horizAlignment === "right"
					? "flex-end"
					: horizAlignment === "center"
						? "center"
						: "flex-start"};
			`}

			// Vertical alignment
		${!actionCell &&
			css`
				justify-content: ${verAlignment === "bottom"
					? "flex-end"
					: verAlignment === "middle"
						? "center"
						: "flex-start"};
			`}

		${cardView &&
			css`
				text-align: left;
				&,
				&.${addPrefix("h_rightAlign")} {
					justify-content: flex-start;
				}
				${actionCell &&
				css`
					justify-content: flex-end;
				`}
			`}

		${verAlignment === "bottom" &&
			css`
				${StyledTreeNodeArrow} {
					bottom: 0;
					margin-top: 0;
					margin-bottom: calc((8px - ${theme.components.tree.nodeArrow.button.fontSize}) * 0.5);
				}

				${StyledTreeNodeIcon} {
					align-items: flex-end;
				}
			`};

			${verAlignment === "middle" &&
			css`
				&& ${StyledTreeNodeArrow} {
					margin-top: 0;
					top: 49%;
					transform: translateY(-50%);
				}

				${StyledTreeNodeIcon} {
					align-items: center;
				}
			`};

			[class*="field--block"] {
				flex-grow: 0;
			}

			${rowSubInfo &&
			css`
				// Style for touch devices with non-hover-capable pointing
				@media (pointer: coarse) and (any-hover: none) {
					border-bottom: ${bodyRow.borderBottom};
					border-left: none;
					border-right: none;
					border-top: none;
				}
			`};
			${$cellHighlighting &&
			css`
				@media (pointer: coarse) and (any-hover: none) {
					&:active,
					&:focus {
						outline: none;
						background-color: ${!$verticalHeader && bodyRow.nonInteractive.focusBG};
					}
				}
			`}

			${subInfo && resetBoxShadowForSubInfoCell(StyledTableBodyRowSegment)}
		`;
	}
);

export const StyledTableBodyCellGroupTpl = styled(StyledTableBodyCell).withConfig({
	displayName: "StyledTableBodyCellGroupTpl-sc-"
})(({ theme, resizable, $cellHighlighting }) => {
	const { headCellGroup, bodyRow } = theme.components.table;
	const crossTabulation = useTableContext((context) => context.crossTabulation);
	const isCellHighlightingForRegularTable = !crossTabulation && $cellHighlighting;

	const rowSegmentType = useStyledTableContext((context) => context.rowSegmentType);
	const rowInteractive = useStyledTableContext((context) => !!context.row?.interactive);

	return css`
		${isCellHighlightingForRegularTable &&
		css`
			${StyledTableMixins.setRowBG({
				background: bodyRow.nonInteractive.hoverBG,
				theme,
				state: "hover"
			})}
		`};
		position: relative;
		${StyledTableBodyRowSegment} > && {
			${createPseudoElement(
				":after",
				css`
					display: block;
					left: unset;
					border-right: ${headCellGroup.borderRight};
				`
			)}
		}
		${((crossTabulation && rowSegmentType === "left") || rowSegmentType === "right") &&
		css`
			${StyledTableBodyRowSegment} > && {
				&:last-child:after {
					border-right-color: transparent;
				}
			}
		`}

		${resizable &&
		css`
			[data-role="${DataRoles.Table.Body.Cell.Group}"]:last-child &&:last-child {
				flex: 1;
			}
		`}

	        // Make sure when hover/focus, column's border not overlap with content row's border
	        ${rowInteractive &&
		css`
			${activeAndHover(
				css`
					&:after {
						top: 3px;
						bottom: 3px;
					}
				`,
				StyledTableBodyRow
			)}
			${StyledTableBodyRow}:focus & {
				&:after {
					top: 3px;
					bottom: 3px;
				}
			}
		`}
	`;
});

const StyledTableBodyCellLabel = styled.div.withConfig({ displayName: "StyledTableBodyCellLabel-sc-" })<{
	cardView?: boolean;
}>(({ theme, cardView }) => {
	const { table } = theme.components;

	return css`
		${cardView &&
		css`
			align-items: center;
			color: ${table.bodyCell.dataColor};
			display: flex;
			font-size: ${table.cardView.bodyCell.dataTitleFontSize};
			margin-top: -16px;
		`}
	`;
});

export const BodyCellTpl = memo(function BodyCellTpl(
	props: TableTemplateProps.BodyCellProps
): ReactElement<TableTemplateProps.BodyCellProps> {
	const { onClick, onContextMenu, wrapperRef, onMouseOver, onMouseLeave } = props;

	const bodyCellRef = useRef<HTMLDivElement | null>(null);
	const { isSelectedText } = useSelectedText(bodyCellRef, false);
	const { tableTitles } = useContext<A11yDefinition>(A11YLanguageContext);
	const cardView = useTableContext((context) => context.cardView);
	const resizable = useTableContext((context) => context.resizable);
	const hasColumnGroup = useTableContext((context) => context.hasColumnGroup);
	const cellHighlighting = useTableContext((context) => !!context.cellHighlighting);
	const rowHighlightVariant = useStyledTableContext((context) => context.row?.highlightVariant);
	const rowDisabled = useStyledTableContext((context) => !!context.row?.disabled);

	const rowInfo = rowHighlightVariant === "info";
	const rowSuccess = rowHighlightVariant === "success";
	const relativeWidth = props.relativeWidth ?? 1;

	const getBodyCellRef = useCallback(
		(param: HTMLDivElement | null) => {
			bodyCellRef.current = param;
			wrapperRef?.(param);
		},
		[wrapperRef]
	);

	const classNames = useMemo(
		() =>
			joinClassNames(
				`${BASE_TABLE_CLASSNAME}__contentCell`,
				{ [`${BASE_TABLE_CLASSNAME}__contentCell--secondary`]: props.useSecondaryColor },
				{
					[`${BASE_TABLE_CLASSNAME}__contentCell--${relativeWidth && relativeWidth * 10}`]:
						!props.actionCell || (props.actionCell && props.relativeWidth)
				},
				{
					[`${BASE_TABLE_CLASSNAME}__contentCell--align-${props.horizontalAlignment}`]:
						props.horizontalAlignment && props.horizontalAlignment !== "left" && !props.actionCell
				},
				{
					[`${BASE_TABLE_CLASSNAME}__contentCell--align-${props.verticalAlignment}`]:
						props.verticalAlignment && props.verticalAlignment !== "top" && !props.actionCell
				},
				{ [`${BASE_TABLE_CLASSNAME}__contentCell--fixedWidth`]: props.fixedWidth },
				{ [`${BASE_TABLE_CLASSNAME}__contentCell--sub-info`]: props.subInfo },
				{ [`${BASE_TABLE_CLASSNAME}__actionCell`]: props.actionCell },
				props.className
			),
		[
			props.useSecondaryColor,
			props.actionCell,
			props.relativeWidth,
			props.horizontalAlignment,
			props.verticalAlignment,
			props.fixedWidth,
			props.subInfo,
			props.className,
			relativeWidth
		]
	);

	const selectedHighLightTitle = useMemo(() => {
		return `${props.useSelectedTitle ? tableTitles?.selectedRowTitles : ""}${
			props.useHighlightTitle === "success" ? tableTitles?.successRowTitles : ""
		}`;
	}, [tableTitles?.selectedRowTitles, tableTitles?.successRowTitles, props.useHighlightTitle, props.useSelectedTitle]);

	const handleOnClick = useCallback(
		(event: MouseEvent<HTMLElement>): void => {
			if (!onClick) {
				return;
			}

			// js-dom doesn't support window.getSelection yet
			// See https://github.com/jsdom/jsdom/issues/317 for more detail
			// So just simply trigger onClick here in test environment
			if (!window.getSelection) {
				onClick(event);
			} else {
				if (!isSelectedText) {
					onClick(event);
				}
			}
		},
		[isSelectedText, onClick]
	);

	const handleMouseOver = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			if (props.verticalHeader) {
				event.stopPropagation();

				return;
			}

			onMouseOver?.(event);
		},
		[onMouseOver, props.verticalHeader]
	);

	const handleMouseLeave = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			event.stopPropagation();
			onMouseLeave?.(event);
		},
		[onMouseLeave]
	);

	const StyledTableBodyCellRendered = hasColumnGroup ? StyledTableBodyCellGroupTpl : StyledTableBodyCell;

	return (
		<StyledTableBodyCellRendered
			id={props.id}
			data-role={props.dataRole || DataRoles.Table.Body.Cell}
			role={getRole(props.role, "cell")}
			aria-colindex={props.ariaColIndex}
			className={classNames}
			style={props.style}
			onClick={props.onClick ? handleOnClick : undefined}
			onContextMenu={handleContextMenu(bodyCellRef, onContextMenu)}
			onKeyDown={props.onKeyDown}
			fixedWidth={props.fixedWidth}
			subInfo={props.subInfo}
			actionCell={props.actionCell}
			onMouseOver={handleMouseOver}
			onMouseLeave={handleMouseLeave}
			$verticalHeader={props.verticalHeader}
			relativeWidth={relativeWidth}
			$hasActionCellWidth={!!props.relativeWidth}
			cardView={cardView}
			useSecondaryColor={props.useSecondaryColor}
			verAlignment={props.verticalAlignment}
			horizAlignment={props.horizontalAlignment}
			hasColumnGroup={hasColumnGroup}
			resizable={resizable}
			ref={getBodyCellRef}
			tabIndex={cellHighlighting ? -1 : undefined}
			$cellHighlighting={cellHighlighting}
			$firstCell={props.firstCell}
			data-width={props.relativeWidth}
			data-type={props.actionCell && TableDataAttributes.Table.ActionCell}
		>
			{(props.useSelectedTitle || props.useHighlightTitle) && selectedHighLightTitle && (
				<HiddenText>{selectedHighLightTitle}</HiddenText>
			)}
			{props.useSecondaryColor &&
				(props.secondaryCellTitle ? (
					<HiddenText>{props.secondaryCellTitle}</HiddenText>
				) : (
					props.firstCell && <HiddenText>{tableTitles?.secondaryCellTitles ?? ""}</HiddenText>
				))}
			{props.label && (
				<StyledTableBodyCellLabel className={`${BASE_TABLE_CLASSNAME}__labelCell`} cardView={cardView}>
					{props.label}
					<HiddenText>, </HiddenText>
				</StyledTableBodyCellLabel>
			)}
			{props.firstCell && (rowDisabled || rowInfo || rowSuccess) && (
				<StyledBodyRowBadgeWrapper>
					{rowDisabled && <Icon title="Disable">block</Icon>}
					{rowSuccess && <Icon title="Success">check</Icon>}
					{rowInfo && <Icon title="Info">info</Icon>}
				</StyledBodyRowBadgeWrapper>
			)}
			{props.children}
		</StyledTableBodyCellRendered>
	);
});

BodyCellTpl.displayName = "BodyCellTpl";
