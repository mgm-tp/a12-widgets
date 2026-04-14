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

import type { MutableRefObject, ContextType, HTMLProps, KeyboardEvent, ReactElement } from "react";
import { createRef, Component } from "react";
import { Key } from "ts-key-enum";
import { styled, css } from "styled-components";

import { provider } from "../../../common/main/device-detector.js";
import {
	bindMethods,
	getRole,
	joinClassNames,
	moveItemFocusBack,
	moveItemFocusNext,
	StringUtils
} from "../../../common/main/utils.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { countActionColumns, flattenAllColumns } from "../../new-api/table.utils.js";
import type { BaseColumnType, Column } from "../../new-api/column.api.js";
import { createPseudoElement } from "../../../theme/base/mixins/_pseudo.js";
import { activeAndHover } from "../../../theme/base/mixins/_interaction.js";
import { WidgetsResizeDetector } from "../../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";

import { BASE_TABLE_CLASSNAME, ColumnWidthSync, RowScrollManager } from "../table.internal.js";
import { TableDataAttributes } from "../table.data-attributes.js";

import { StyledBaseTable } from "./table.styled.js";
import type { TableTemplateProps } from "./table.tpl.api.js";
import { RowScrollManagerContext } from "./table.tpl.utils.js";
import { StyledTableBody } from "./table.body.tpl.view.js";
import { StyledTableFoot } from "./table.foot.tpl.view.js";
import { StyledTableFootRow } from "./table.foot-row.tpl.view.js";
import { StyledTableHeadCellGroup } from "./table.head-cell-group.tpl.view.js";
import { StyledTableHeadCell } from "./table.head-cell.tpl.view.js";

const showSeparatorPinnedColumn = (props: {
	columnPosition?: Column.Pinning;
	boxShadow?: string;
	hoverBoxShadow?: string;
}) => {
	return css`
		[data-role="${DataRoles.Table.Header.Row}--${props.columnPosition}"],
		[data-role="${DataRoles.Table.Body.Row}--${props.columnPosition}"],
		[data-role="${DataRoles.Table.Footer.Row}--${props.columnPosition}"],
		[data-role="${DataRoles.Table.Row.Scroller}--${props.columnPosition}"] {
			box-shadow: ${props.boxShadow};

			// Keep the separator pinned column when hovering/focusing on cell highlighting
			${props.columnPosition === "right" &&
			css`
				[data-role="${DataRoles.Table.Header.Cell}"]:first-of-type {
					box-shadow: ${props.hoverBoxShadow};
				}

				${activeAndHover(css`
					[data-role="${DataRoles.Table.Body.Cell}"]:first-of-type {
						box-shadow: ${props.hoverBoxShadow};
					}
				`)};

				&:focus-within {
					[data-role="${DataRoles.Table.Body.Cell}"]:first-of-type {
						box-shadow: ${props.hoverBoxShadow};
					}
				}
			`};

			${props.columnPosition === "left" &&
			css`
				[data-role*="resize-handler"]:not(:hover) div {
					background-color: transparent;
				}

				// Last column of left pin - to make sure left-pin border displays correctly in column group
				&:after,
				& > :last-child:after {
					border-right-color: transparent;
				}

				/**
	  *	Keep the separator pinned column when hovering/focusing on cell highlighting
	 **/

				[data-role="${DataRoles.Table.Header.Cell}"]:last-of-type {
					box-shadow: ${props.hoverBoxShadow};
				}

				${activeAndHover(css`
					[data-role="${DataRoles.Table.Body.Cell}"]:last-of-type {
						box-shadow: ${props.hoverBoxShadow};
					}
				`)}
				&:focus-within {
					[data-role="${DataRoles.Table.Body.Cell}"]:last-of-type {
						box-shadow: ${props.hoverBoxShadow};
					}
				}
			`};
		}
	`;
};

export const StyledTableTpl = styled.div.withConfig({ displayName: "StyledTableTpl-sc-" })<{
	virtualScroll?: boolean;
	addLastBorderOnHeader?: boolean;
	horizontalScrollPosition?: TableTemplateProps.HorizontalScrollPosition;
}>(({ theme, virtualScroll, addLastBorderOnHeader, horizontalScrollPosition }) => {
	const { table } = theme.components;

	return css`
		color: ${table.color};
		display: flex;
		height: 100%;
		outline: none;
		position: relative;
		${virtualScroll &&
		css`
			${StyledTableBody} {
				border: none;

				&:focus {
					border: none;
				}

				&:not(:empty) {
					overflow-y: hidden;
				}
			}
		`}
		${!virtualScroll &&
		css`
			${StyledTableBody}:not(:empty) {
				flex-grow: 0;
			}

			${StyledTableFoot} {
				display: flex;
				flex-grow: 1;
				flex-direction: column;
			}

			${StyledTableFootRow}:last-child {
				flex-grow: 1;
			}
		`}

		${(horizontalScrollPosition === "left" || horizontalScrollPosition === "middle") &&
		showSeparatorPinnedColumn({
			columnPosition: "right",
			boxShadow: table.pinned.rightColumn.boxShadow,
			hoverBoxShadow: table.pinned.rightColumn.hoverBoxShadow
		})};
		${(horizontalScrollPosition === "right" || horizontalScrollPosition === "middle") &&
		showSeparatorPinnedColumn({
			columnPosition: "left",
			boxShadow: table.pinned.leftColumn.boxShadow,
			hoverBoxShadow: table.pinned.leftColumn.hoverBoxShadow
		})};

		${addLastBorderOnHeader &&
		css`
			[data-role="${DataRoles.Table.Header.Row.SegmentRight}"] {
				${StyledTableHeadCellGroup}:last-child, > ${StyledTableHeadCell}:last-child {
					${createPseudoElement(
						":after",
						css`
							border-right: ${table.headCellGroup.rightBorderRight};
							left: unset;
						`
					)};

					&:focus:after {
						border-color: transparent;
					}
				}
			}
		`}
	`;
});

const StyledTableResizePreview = styled.div.withConfig({ displayName: "StyledTableResizePreview-sc-" })(({ theme }) => {
	const { resizeHandler } = theme.components.table;

	return css`
		cursor: col-resize;
		height: 100%;
		padding: 0 ${resizeHandler.horizontalPadding};
		position: absolute;
		top: 0;
		visibility: hidden;

		div {
			background-color: ${resizeHandler.background};
			height: 100%;
			width: ${resizeHandler.width};
		}
	`;
});

const StyledTableResizeOverlay = styled.div.withConfig({ displayName: "StyledTableResizeOverlay-sc-" })`
	cursor: col-resize;
	height: 100%;
	position: absolute;
	visibility: hidden;
	width: 100%;
`;

export const StyledTableContainerWrapper = styled.div.withConfig({ displayName: "StyledTableContainerWrapper-sc-" })`
	display: flex;
	flex-direction: column;
	width: 100%;
	position: relative;
	isolation: isolate;

	// To avoid the header cell is clicked & the whole table is selected when dragging the resize handler
	&[${TableDataAttributes.Data.Table.ContainerResizing}="true"] ${StyledBaseTable.Cell} {
		cursor: col-resize;
		user-select: none;
	}
`;

export interface TableState {
	readonly horizontalScrollPosition: TableTemplateProps.HorizontalScrollPosition;
	addLastBorderOnHeader: boolean;
}

export class TableTpl extends Component<TableTemplateProps.TableElementProps, TableState> {
	static displayName = "TableTpl";
	private readonly SCROLL_OPTIONS = {
		step: 40,
		animationStep: 8,
		animationTime: 10
	};
	private rowScrollerElement = DataRoles.Table.Row.Scroller.Scroll;

	private SCROLL_ELEMENT_DATA_ROLES = [
		DataRoles.Table.Header.Row.SegmentScroll,
		DataRoles.Table.Filter.Row.SegmentScroll,
		DataRoles.Table.Body.Row.SegmentScroll,
		DataRoles.Table.Footer.Row.SegmentScroll,
		this.rowScrollerElement,
		DataRoles.Table.Row.Group.Header
	];

	private readonly rowScrollManager: RowScrollManager;
	private tableWrapperRef: HTMLDivElement | null = null;
	private footerScrollRef: HTMLDivElement | null = null;
	private containerWrapperRef: MutableRefObject<HTMLDivElement | null> = createRef();

	private sameHorizontalScrollPosition = false;

	declare context: ContextType<typeof A11YLanguageContext>;

	constructor(props: HTMLProps<HTMLDivElement>) {
		super(props);

		this.state = {
			horizontalScrollPosition: null,
			addLastBorderOnHeader: false
		};

		bindMethods(this);

		this.rowScrollManager = new RowScrollManager(
			this.SCROLL_ELEMENT_DATA_ROLES,
			this.rowScrollerElement,
			this.onFooterRowScroll
		);
	}

	private getContainerWrapperRef(ref: HTMLDivElement | null): void {
		this.containerWrapperRef.current = ref;
		this.props.containerWrapper?.(ref);
	}

	private registerOnFooterRowScroll(): void {
		this.rowScrollManager.handleTriggerRowScroll();
	}

	private handleMouseWheelScrollHorizontally(event: WheelEvent): void {
		this.rowScrollManager.handleMouseWheelScrollHorizontally(event);
	}

	private onFooterRowScroll(position: TableTemplateProps.HorizontalScrollPosition): void {
		if (position !== this.state.horizontalScrollPosition) {
			this.setState({
				horizontalScrollPosition: position
			});
		}
	}

	private getTableWrapperRef(ref: HTMLDivElement | null): void {
		this.tableWrapperRef = ref;
		this.props.wrapperRef?.(ref);
	}

	private onResize(): void {
		if (!this.props.cardView) {
			this.syncColumns({ forceResetScrollCell: true });
			this.setBorderForSegment();
		}
	}

	private handleOnKeyDown(event: KeyboardEvent<HTMLElement>): void {
		const target = event.target as HTMLElement;
		const currentRow = target.classList.contains(`${BASE_TABLE_CLASSNAME}__contentRow`) ? target : undefined;
		const allowHorizontalScroll =
			target.classList.contains(`${BASE_TABLE_CLASSNAME}__content`) ||
			target.classList.contains("ReactVirtualized__List") ||
			currentRow;

		if (
			this.footerScrollRef &&
			allowHorizontalScroll &&
			(event.key === Key.ArrowLeft || event.key === Key.ArrowRight)
		) {
			event.preventDefault();

			const { step, animationStep, animationTime } = this.SCROLL_OPTIONS;

			const sign = event.key === Key.ArrowLeft ? -1 : 1;

			let count = step / animationStep;
			const interval = setInterval(() => {
				if (!this.footerScrollRef || count === 0) {
					clearInterval(interval);

					return;
				}

				this.footerScrollRef.scrollLeft += sign * animationStep;
				count--;
			}, animationTime);
		}

		if (
			!this.props.disableArrowNavigation &&
			currentRow &&
			(event.key === Key.ArrowUp || event.key === Key.ArrowDown)
		) {
			event.preventDefault();
			const moveFocusFunction = event.key === Key.ArrowUp ? moveItemFocusBack : moveItemFocusNext;
			moveFocusFunction(this.tableWrapperRef, currentRow, `.${BASE_TABLE_CLASSNAME}__contentRow[tabIndex]`, true);

			return;
		}
	}

	private syncColumns({ forceResetScrollCell = false, resetOnly = false }): void {
		if (this.tableWrapperRef) {
			const scrollLeft = this.footerScrollRef?.scrollLeft;
			const onDone = () => {
				this.registerOnFooterRowScroll();

				// Avoid scroll jump when horizontal scroll's position not change but still need to sync the row
				this.rowScrollManager.update(this.sameHorizontalScrollPosition ? scrollLeft : 0);
				this.sameHorizontalScrollPosition = false;

				this.getFooterScrollRef();
			};

			setTimeout(() => {
				if (this.tableWrapperRef) {
					ColumnWidthSync.synchronizeColumns(this.tableWrapperRef, {
						onDone,
						scrollLeft,
						numberActionColumns: this.props.columns
							? countActionColumns(flattenAllColumns(this.props.columns))
							: undefined,
						forceResetScrollCell,
						resetOnly
					});
				}
			}, 50);
		}
	}

	// Set a right gap to the scroll/right segment if the body has vertical scroll.
	private setBorderForSegment(): void {
		const hasColumnGroup = this.tableWrapperRef?.classList.contains(`${BASE_TABLE_CLASSNAME}--group`);

		if (!hasColumnGroup) {
			return;
		}

		const headerRightSegment = this.tableWrapperRef?.querySelector(
			`[data-role="${DataRoles.Table.Header.Row.SegmentRight}"]`
		);
		const addedClass = `${BASE_TABLE_CLASSNAME}__headerRow--right-border`;

		if (this.tableBodyHasVerticalScroll()) {
			this.setState({ addLastBorderOnHeader: true });
			headerRightSegment?.classList.add(addedClass);
		} else {
			this.setState({ addLastBorderOnHeader: false });
			headerRightSegment?.classList.add(addedClass);
		}
	}

	private tableBodyHasVerticalScroll(): boolean {
		if (!this.tableWrapperRef) {
			return false;
		}

		const tableBody = this.tableWrapperRef.querySelector(`[data-role=${DataRoles.Table.Body}]`);

		return tableBody ? tableBody.scrollHeight > tableBody.clientHeight : false;
	}

	private generateClassName(): string | undefined {
		return joinClassNames(
			BASE_TABLE_CLASSNAME,
			{
				[`${BASE_TABLE_CLASSNAME}--scroll-position-${this.state.horizontalScrollPosition}`]:
					this.state.horizontalScrollPosition
			},
			{ [`${BASE_TABLE_CLASSNAME}--cards`]: this.props.cardView },
			{ [`${BASE_TABLE_CLASSNAME}--resizable`]: this.props.resizable },
			this.props.className
		);
	}

	private generateAriaLabel(): string | undefined {
		const { ariaLabel, noAriaLabel, interactive } = this.props;
		const isMobileDevices = provider.isTablet() || provider.isPhone();

		return !noAriaLabel && !isMobileDevices
			? StringUtils.join(
					ariaLabel,
					{ " - ": interactive && ariaLabel },
					{ [`${this.context.tableTitles?.interactiveTableLabel}`]: interactive },
					{ [`${this.context.tableTitles?.tableLabel}`]: !interactive && !ariaLabel }
				)
			: undefined;
	}

	private getFooterScrollRef(): void {
		this.footerScrollRef = this.tableWrapperRef?.querySelector(`[data-role='${this.rowScrollerElement}']`) || null;
	}

	componentDidMount(): void {
		if (!this.tableWrapperRef) {
			return;
		}

		this.getFooterScrollRef();
		this.rowScrollManager.handleTriggerRowScroll();
		this.registerOnFooterRowScroll();
		this.containerWrapperRef.current?.addEventListener("wheel", this.handleMouseWheelScrollHorizontally);
	}

	componentDidUpdate(prevProp: Readonly<TableTemplateProps.TableElementProps>, prevState: TableState): void {
		// reset all cell widths when turning on the cardView mode
		if (!prevProp.cardView && this.props.cardView && this.tableWrapperRef) {
			this.syncColumns({ forceResetScrollCell: true, resetOnly: true });

			return;
		}

		const getWidths = (columns: BaseColumnType[] = []): (Column.Width | undefined)[] =>
			flattenAllColumns(columns).map(({ width }) => width);
		const [prevWidths, currentWidths] = [prevProp.columns, this.props.columns].map(getWidths);
		const columnChanged =
			prevWidths.length !== currentWidths.length || prevWidths.some((width, index) => width !== currentWidths[index]);

		// to prevent delay when scrolling from edges
		if (this.state.horizontalScrollPosition === prevState.horizontalScrollPosition && !this.props.cardView) {
			this.sameHorizontalScrollPosition = prevState.horizontalScrollPosition === "right";
			this.syncColumns({ forceResetScrollCell: columnChanged });
		}
	}

	componentWillUnmount(): void {
		this.rowScrollManager.destroy();
		this.containerWrapperRef.current?.removeEventListener("wheel", this.handleMouseWheelScrollHorizontally);
	}

	render(): ReactElement {
		const {
			cardView,
			wrapperRef,
			tabIndex,
			interactive,
			role,
			dataRole,
			resizable,
			children,
			columns,
			containerWrapper,
			noAriaLabel,
			as,
			ariaLabelledby,
			...rest
		} = this.props;

		return (
			<StyledTableTpl
				{...rest}
				className={this.generateClassName()}
				ref={this.getTableWrapperRef}
				data-role={dataRole || DataRoles.Table}
				role={getRole(role, cardView ? "list" : "table")}
				aria-label={this.generateAriaLabel()}
				tabIndex={tabIndex ?? -1}
				onKeyDown={this.handleOnKeyDown}
				addLastBorderOnHeader={this.state.addLastBorderOnHeader}
				aria-labelledby={ariaLabelledby}
				horizontalScrollPosition={this.state.horizontalScrollPosition}
			>
				<WidgetsResizeDetector onResize={this.onResize} targetRef={this.containerWrapperRef}>
					<StyledTableContainerWrapper
						className={`${BASE_TABLE_CLASSNAME}__containerWrapper`}
						ref={this.getContainerWrapperRef}
					>
						<RowScrollManagerContext.Provider
							value={{
								rowScrollManager: this.rowScrollManager
							}}
						>
							{children}
						</RowScrollManagerContext.Provider>
						{resizable && (
							<>
								{/* Resize overlay to prevent interacting with elements in Table*/}
								<StyledTableResizeOverlay className={`${BASE_TABLE_CLASSNAME}__resize--overlay`} />
								<StyledTableResizePreview className={`${BASE_TABLE_CLASSNAME}__resize--preview`}>
									<div />
								</StyledTableResizePreview>
							</>
						)}
					</StyledTableContainerWrapper>
				</WidgetsResizeDetector>
			</StyledTableTpl>
		);
	}
}

TableTpl.contextType = A11YLanguageContext;
