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

import type { MouseEvent, TouchEvent, ReactElement } from "react";
import { memo, useRef, useMemo, useState, useContext, useCallback } from "react";
import { styled, css } from "styled-components";
import { darken } from "polished";

import { getNearestFocusableParent, joinClassNames, getRole } from "../../../common/main/utils.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { provider } from "../../../common/main/device-detector.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { active, darkFocus, hover } from "../../../theme/base/mixins/_interaction.js";
import { Icon, StyledIconWrapper, StyledVariantIconWrapper } from "../../../icon/main/icon.view.js";
import { useTableContext } from "../../new-api/table.context.js";
import type { Column } from "../../new-api/column.api.js";
import { StyledBaseBoolean } from "../../../input/base-input-styled/base-boolean.styled.js";
import { StyledCheckbox } from "../../../input/checkbox/main/checkbox.styled.js";
import { createPseudoElement } from "../../../theme/base/mixins/_pseudo.js";
import { StyledTooltipWrapper } from "../../../tooltip/main/tooltip.styled.js";
import { StyledButton } from "../../../button/main/button.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { BASE_TABLE_CLASSNAME } from "../table.internal.js";
import { TableDataAttributes } from "../table.data-attributes.js";

import { StyledTableMixins, StyledBaseTable } from "./table.styled.js";
import type { TableTemplateProps } from "./table.tpl.api.js";
import { handleContextMenu } from "./table.tpl.utils.js";
import { StyledTableHeadRowSegment } from "./table.head-row-segment.tpl.view.js";
import { StyledTableHeadCellGroup } from "./table.head-cell-group.tpl.view.js";
import { useStyledTableContext } from "./table.context.styled.js";

const StyledTableHeadCellSortingIcon = styled(Icon).withConfig({ displayName: "StyledTableHeadCellSortingIcon-sc-" })``;

const StyledTableHeadCellContent = styled.div.withConfig({ displayName: "StyledTableHeadCellContent-sc-" })<{
	hasColumnGroup?: boolean;
	horizAlignment?: Column.HorizontalAlignment;
}>(({ theme, hasColumnGroup, horizAlignment }) => {
	const { headCellGroup, headCell } = theme.components.table;

	return css`
		align-items: center;
		display: flex;
		flex-grow: 1;
		flex-wrap: wrap;
		line-height: normal;
		min-height: ${headCell.contentMinHeight};

		> ${StyledIconWrapper}:not(${StyledTableHeadCellSortingIcon}):not(${StyledVariantIconWrapper}) {
			color: inherit;
		}

		[data-role=${DataRoles.Status.Icon}] ${StyledIconWrapper} {
			display: inherit;
		}

		${StyledIconWrapper} {
			align-items: center;
			display: inline-flex;
			font-size: ${headCell.iconFontSize};
			height: 22px;
		}

		${StyledButton}[data-type="icon"]:not([data-role=${DataRoles.Tag}] ${StyledButton}) {
			font-size: ${headCell.buttonIconFontSize};
			height: ${headCell.buttonIconSize};
			min-height: ${headCell.buttonIconSize};
			width: ${headCell.buttonIconSize};
		}

		${hasColumnGroup &&
		css`
			line-height: ${headCellGroup.lineHeight};
		`}
		${horizAlignment !== "left" &&
		css`
			justify-content: ${horizAlignment === "right" ? "flex-end" : horizAlignment};
			text-align: ${horizAlignment};
			${StyledBaseBoolean.StyledFieldControl} {
				justify-content: ${horizAlignment === "right" ? "flex-end" : horizAlignment};
			}
			${StyledBaseBoolean.StyledFieldGroup} ${StyledBaseBoolean.StyledFieldControl} {
				justify-content: unset;
			}
		`}
	`;
});

const headCellStates = (color?: string, border?: string) => {
	return css`
		color: ${color};
		&:before {
			border-bottom: ${border};
		}
		${StyledTableHeadCellSortingIcon} {
			color: inherit;
		}
	`;
};

export const StyledTableHeadCell = styled(StyledBaseTable.Cell).withConfig({ displayName: "StyledTableHeadCell-sc-" })<{
	noEffect?: boolean;
	verAlignment?: Column.VerticalAlignment;
	sortable?: boolean;
	touch?: boolean;
	isHovering?: boolean;
	$filterRow?: boolean;
}>(
	({
		theme,
		subInfo,
		actionCell,
		verAlignment,
		cardView,
		touch,
		isHovering,
		$rowSegmentType: rowSegmentType,
		$filterRow: filterRow
	}) => {
		const { header, headCell, bodyCell, bodyRow } = theme.components.table;

		return css`
			${isHovering &&
			css`
				${StyledTableMixins.setRowBG({ background: header.background, theme, darken: true })}
			`}
			align-items: center;
			color: ${headCell.color};
			cursor: default;
			font-size: ${headCell.fontSize};
			font-weight: ${headCell.fontWeight};
			min-height: ${touch ? headCell.touchMinHeight : headCell.minHeight};
			position: relative;
			${StyledCheckbox.StyledField} {
				min-height: auto;
			}
			${!subInfo &&
			!actionCell &&
			css`
				padding: ${filterRow ? bodyCell.padding : headCell.padding};
			`}
			&:focus {
				outline: none;
			}

			${filterRow &&
			css`
				overflow: hidden;
				&:empty {
					display: ${cardView && "none"};
				}
			`}

			${!filterRow &&
			!actionCell &&
			css`
				${StyledTableHeadCellContent} && {
					overflow: hidden;
				}
			`}
 
		 ${subInfo &&
			css`
				// Reset separator of pinned column
				&&&&:last-of-type {
					box-shadow: none;
				}
				${StyledTableMixins.setRowBG({
					background: isHovering ? darken(bodyRow.subBGRatio, header.background) : header.background,
					theme,
					darken: true
				})}
			`}
		   ${(verAlignment === "bottom" || verAlignment === "top") &&
			css`
				align-items: ${verAlignment === "bottom" ? "flex-end" : "flex-start"};
			`}
 
		 ${!cardView &&
			(rowSegmentType === "left" || rowSegmentType === "scroll") &&
			css`
				${StyledTableHeadRowSegment}:first-child &&&:first-child[data-role*="group-parent"] {
					min-width: 100%;
				}
				${StyledTableHeadCellGroup}:not(:first-child) &&&:first-child[data-role*="group-parent"] {
					min-width: 100%;
				}
			`}

		${StyledTooltipWrapper} {
				align-items: center;
				display: inline-flex;
				margin: ${headCell.tooltipMargin};
			}
		`;
	}
);

export const StyledTableHeadSortableCell = styled(StyledTableHeadCell).withConfig({
	displayName: "StyledTableHeadSortableCell-sc-"
})(({ theme, noEffect, sortable, resizable }) => {
	const { headCell, resizeHandler } = theme.components.table;

	if (!sortable) {
		return css``;
	}

	return css`
		cursor: pointer;
		position: relative;
		color: ${headCell.sortable.color};
		${createPseudoElement(":before")};

		${!noEffect &&
		css`
			&:not([data-headCell-no-effect="true"]) {
				${active(headCellStates(headCell.sortable.activeColor, headCell.sortable.activeBorder))}
				${hover(headCellStates(headCell.sortable.hoverColor, headCell.sortable.hoverBorder))}
			}
			&:not([${TableDataAttributes.Data.Head.CellResizing}="true"]):focus {
				${headCellStates(headCell.sortable.focusColor, headCell.sortable.focusBorder)}
				&:before {
					outline-offset: -1px;
					${darkFocus}
				}
				&:after {
					border-left: ${theme.focusStyles.focusedBoundaryDark};
				}
			}
		`}
		${resizable &&
		css`
			&:before {
				right: ${resizeHandler.width};
			}
		`}
	`;
});

const StyledTableHeadCellGroupTpl = styled(StyledTableHeadSortableCell).withConfig({
	displayName: "StyledTableHeadCellGroupTpl-sc-"
})<{ $cellHighlighting?: boolean }>(
	({
		theme,
		resizable,
		isHovering,
		$crossTabulation: crossTabulation,
		$cellHighlighting: cellHighlighting,
		$rowSegmentType: rowSegmentType
	}) => {
		const { headCellGroup, header } = theme.components.table;
		const isCellHighlightingForRegularTable = !crossTabulation && cellHighlighting;

		return css`
			${isHovering &&
			isCellHighlightingForRegularTable &&
			css`
				${StyledTableMixins.setRowBG({ background: header.background, theme, darken: true })}
			`}
			${!resizable &&
			css`
				${createPseudoElement(
					":after",
					css`
						display: block;
						left: unset;
						border-right: ${headCellGroup.gapForSingle};
					`
				)}
				&&:focus:after {
					border-color: transparent;
				}

				${StyledTableHeadRowSegment} > && {
					&:after {
						border-right: ${headCellGroup.gapForGroup};
					}
				}
				${crossTabulation &&
				rowSegmentType === "left" &&
				css`
					&&:last-child:after {
						border-right-color: transparent;
					}
				`}
			`}
		`;
	}
);

export const HeadCellTpl = memo(function HeadCellTpl(
	props: TableTemplateProps.HeadCellProps
): ReactElement<TableTemplateProps.HeadCellProps> {
	const { onContextMenu, wrapperRef, onClick, onKeyUp, sortable, htmlAttributes } = props;
	const cardView = useTableContext((context) => context.cardView);
	const resizable = useTableContext((context) => context.resizable);
	const hasColumnGroup = useTableContext((context) => context.hasColumnGroup);
	const crossTabulation = useTableContext((context) => context.crossTabulation);
	const cellHighlighting = useTableContext((context) => context.cellHighlighting);
	const rowSegmentType = useStyledTableContext((context) => context.rowSegmentType);
	const filterRow = useStyledTableContext((context) => !!context.header?.filterRow);
	const headCellRef = useRef<HTMLDivElement | null>(null);
	const isParentHeadCell = useMemo(() => props.dataRole?.includes("parent"), [props.dataRole]);
	const [noEffect, setNoEffect] = useState(false);
	const columnWidth = props.relativeWidth ?? 1;

	const classNames = useMemo(
		() =>
			joinClassNames(
				`${BASE_TABLE_CLASSNAME}__headerCell`,
				{
					[`${BASE_TABLE_CLASSNAME}__headerCell--${columnWidth * 10}`]:
						!isParentHeadCell && (!props.actionCell || (props.actionCell && props.relativeWidth))
				},
				{ [`${BASE_TABLE_CLASSNAME}__headerCell--sortable`]: props.sortable },
				{
					[`${BASE_TABLE_CLASSNAME}__headerCell--align-${props.horizontalAlignment}`]:
						props.horizontalAlignment && props.horizontalAlignment !== "left"
				},
				{
					[`${BASE_TABLE_CLASSNAME}__headerCell--align-${props.verticalAlignment}`]:
						props.verticalAlignment && props.verticalAlignment !== "middle"
				},
				{ [`${BASE_TABLE_CLASSNAME}__headerCell--fixedWidth`]: props.fixedWidth },
				{ [`${BASE_TABLE_CLASSNAME}__headerCell--sub-info`]: props.subInfo },
				{ [`${BASE_TABLE_CLASSNAME}__actionCell`]: props.actionCell },
				{ [`${BASE_TABLE_CLASSNAME}__headerCell--touch`]: props.sortable && provider.hasTouch() },
				props.className
			),
		[
			columnWidth,
			isParentHeadCell,
			props.actionCell,
			props.relativeWidth,
			props.sortable,
			props.horizontalAlignment,
			props.verticalAlignment,
			props.fixedWidth,
			props.subInfo,
			props.className
		]
	);

	const { tableTitles } = useContext<A11yDefinition>(A11YLanguageContext);
	const a11yAscendingIconTitle = tableTitles?.ascendingIcon;
	const a11yDescendingIconTitle = tableTitles?.descendingIcon;
	const a11ySortableTitle = tableTitles?.sortableTitle;
	const a11yActionTitle = tableTitles?.actionTitle;
	const isMobile = provider.isPhone();

	const addNoStyleEffect = useCallback((event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>): void => {
		const target = event.target as HTMLElement;

		if (getNearestFocusableParent(target) === headCellRef.current) {
			return;
		}

		setNoEffect(true);
		headCellRef.current?.classList.add(`${BASE_TABLE_CLASSNAME}__headerCell--no-effect`);
	}, []);

	const removeNoStyleEffect = useCallback((): void => {
		setNoEffect(false);
		headCellRef.current?.classList.remove(`${BASE_TABLE_CLASSNAME}__headerCell--no-effect`);
	}, []);

	const StyledTableHeadCellRendered = hasColumnGroup
		? StyledTableHeadCellGroupTpl
		: props.sortable
			? StyledTableHeadSortableCell
			: StyledTableHeadCell;

	const handleHeadCellRef = useCallback(
		(instance: HTMLDivElement | null) => {
			wrapperRef?.(instance);
			headCellRef.current = instance;
		},
		[wrapperRef]
	);

	const handleOnHeadCellFocus = useCallback(() => {
		if (noEffect) {
			setNoEffect(false);
		}
	}, [noEffect]);

	return (
		<StyledTableHeadCellRendered
			id={props.id}
			className={classNames}
			onContextMenu={handleContextMenu(headCellRef, onContextMenu)}
			style={props.style}
			isHovering={props.isHovering}
			onClick={onClick}
			onKeyUp={onKeyUp}
			data-role={props.dataRole || DataRoles.Table.Header.Cell}
			role={getRole(props.role, "columnheader")}
			aria-colindex={props.ariaColIndex}
			tabIndex={sortable ? 0 : undefined}
			aria-sort={props.sorting === "asc" ? "ascending" : props.sorting === "desc" ? "descending" : undefined}
			ref={handleHeadCellRef}
			onMouseOver={sortable ? addNoStyleEffect : undefined}
			onMouseOut={sortable ? removeNoStyleEffect : undefined}
			onTouchStart={sortable ? addNoStyleEffect : undefined}
			onTouchEnd={sortable ? removeNoStyleEffect : undefined}
			onFocus={handleOnHeadCellFocus}
			fixedWidth={props.fixedWidth}
			subInfo={props.subInfo}
			actionCell={props.actionCell}
			relativeWidth={columnWidth}
			$hasActionCellWidth={!!props.relativeWidth}
			cardView={cardView}
			noEffect={noEffect}
			verAlignment={props.verticalAlignment}
			hasColumnGroup={hasColumnGroup}
			resizable={resizable}
			sortable={sortable}
			data-width={props.relativeWidth}
			$crossTabulation={crossTabulation}
			$rowSegmentType={rowSegmentType}
			$filterRow={filterRow}
			$cellHighlighting={cellHighlighting}
			data-type={props.actionCell && TableDataAttributes.Table.ActionCell}
			{...htmlAttributes}
			title={
				sortable
					? htmlAttributes?.title
						? `${htmlAttributes?.title}, ${a11ySortableTitle?.trim()}`
						: a11ySortableTitle?.trim()
					: htmlAttributes?.title
			}
		>
			{props.leftResizeHandler}
			<StyledTableHeadCellContent
				className={`${BASE_TABLE_CLASSNAME}__contentHeaderCell`}
				role={getRole(props.contentWrapperRole, props.sortable ? "button" : undefined)}
				hasColumnGroup={hasColumnGroup}
				horizAlignment={props.horizontalAlignment}
				data-role={DataRoles.Table.Header.Cell.Content}
			>
				{props.children}
				{props.sorting === "asc" && (
					<StyledTableHeadCellSortingIcon
						className={`${BASE_TABLE_CLASSNAME}__sorting-icon`}
						key="asc"
						size="big"
						title={isMobile ? a11yAscendingIconTitle : undefined}
					>
						arrow_drop_up
					</StyledTableHeadCellSortingIcon>
				)}
				{props.sorting === "desc" && (
					<StyledTableHeadCellSortingIcon
						className={`${BASE_TABLE_CLASSNAME}__sorting-icon`}
						key="desc"
						size="big"
						title={isMobile ? a11yDescendingIconTitle : undefined}
					>
						arrow_drop_down
					</StyledTableHeadCellSortingIcon>
				)}
			</StyledTableHeadCellContent>
			{props.sortable && isMobile && a11ySortableTitle && <HiddenText>{a11ySortableTitle}</HiddenText>}
			{props.hiddenText === "" ? undefined : props.hiddenText ? (
				<HiddenText>{props.hiddenText}</HiddenText>
			) : (
				props.actionCell && a11yActionTitle && <HiddenText>{a11yActionTitle}</HiddenText>
			)}
			{props.rightResizeHandler}
		</StyledTableHeadCellRendered>
	);
});

HeadCellTpl.displayName = "HeadCellTpl";
