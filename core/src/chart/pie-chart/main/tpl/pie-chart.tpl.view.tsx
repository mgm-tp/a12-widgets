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

import type { ReactNode, RefObject, MouseEvent } from "react";
import { createContext, Component, createRef } from "react";
import type { TextProps } from "recharts";
import { Text as RechartsText } from "recharts";
import type { Margin, PolarViewBox } from "recharts/types/util/types.js";

import { bindMethods, addPrefix, joinClassNames, noop } from "../../../../common/main/utils.js";
import { DataRoles } from "../../../../common/main/data-roles.js";
import { Button } from "../../../../button/main/button.view.js";
import { Icon } from "../../../../icon/main/icon.view.js";
import { AttachedPortal } from "../../../../attached-portal/main/attached-portal.view.js";
import { StyledPieChartLegendListItem, StyledRechartsPieChartLegend } from "../../../main/chart.styled.js";

import type { PieChartElementsProps } from "./pie-chart.tpl.api.js";

const baseLegendClassName = addPrefix("chart-legend");

/**
 * @deprecated since version 38.1.1.
 * This component uses customized elements. Therefore, relying solely on Recharts may not provide the same result.
 * If you still wish to implement this functionality, please refer to the existing implementation to apply the necessary customizations in your project.
 */
export namespace PieChartElements {
	/** @deprecated since version 38.1.1. */
	interface PositionProviderContext {
		textsHaveSamePosition: boolean;
		gap: number;

		getTextPosition(primary?: PieChartElementsProps.TextPosition, secondary?: PieChartElementsProps.TextPosition): void;

		getTextHeight(
			type: PieChartElementsProps.TextType,
			height: number,
			position: PieChartElementsProps.TextPosition
		): void;
	}

	/** @deprecated since version 38.1.1. */
	export const positionProviderContext = createContext<PositionProviderContext>({
		textsHaveSamePosition: false,
		gap: 0,
		getTextPosition: noop,
		getTextHeight: noop
	});

	/** @deprecated since version 38.1.1. */
	interface LabelContentContext {
		viewBox: PolarViewBox | undefined;
		offset: number;
	}

	/** @deprecated since version 38.1.1. */
	export const labelContentContext = createContext<LabelContentContext>({
		offset: 0,
		viewBox: undefined
	});

	/** @deprecated since version 38.1.1. */
	interface LabelMarginContext {
		getLabelMargin(margin: Margin): void;
	}

	/** @deprecated since version 38.1.1. */
	export const labelMarginContext = createContext<LabelMarginContext>({
		getLabelMargin: noop
	});

	/** @deprecated since version 38.1.1. */
	interface LabelState {
		primaryTextPosition: PieChartElementsProps.TextPosition | null;
		secondaryTextPosition: PieChartElementsProps.TextPosition | null;
		primaryTextHeight: number;
		secondaryTextHeight: number;
	}

	/** @deprecated since version 38.1.1. */
	export class Label extends Component<PieChartElementsProps.LabelProps, LabelState> {
		static displayName = "Label";
		static defaultProps = {
			gap: 20,
			offset: 5
		};

		private getLabelMargin: ((margin: Margin) => void) | null;

		constructor(props: PieChartElementsProps.LabelProps) {
			super(props);

			this.state = {
				primaryTextPosition: null,
				secondaryTextPosition: null,
				primaryTextHeight: 0,
				secondaryTextHeight: 0
			};

			this.getLabelMargin = null;

			bindMethods(this);
		}

		componentDidUpdate(_: PieChartElementsProps.LabelProps, prevState: LabelState): void {
			const { secondaryTextHeight, primaryTextHeight, primaryTextPosition, secondaryTextPosition } = this.state;
			const { offset, gap } = this.props;
			let margin: Margin = { top: 0, left: 0, bottom: 0, right: 0 };

			if (
				this.getLabelMargin &&
				this.state !== prevState &&
				(primaryTextPosition || secondaryTextPosition) &&
				(primaryTextPosition !== "center" || secondaryTextPosition !== "center")
			) {
				const primaryMargin = this.calculateMargin(primaryTextPosition, primaryTextHeight);
				const secondaryMargin = this.calculateMargin(secondaryTextPosition, secondaryTextHeight);

				if (primaryTextPosition !== secondaryTextPosition) {
					margin = {
						...margin,
						top: Math.max(primaryMargin.top || 0, secondaryMargin.top || 0),
						bottom: Math.max(primaryMargin.bottom || 0, secondaryMargin.bottom || 0)
					};
				} else {
					margin = {
						...margin,
						top: (primaryTextPosition as string).startsWith("top")
							? (primaryMargin.top || 0) + (secondaryMargin.top || 0) - offset + gap
							: 0,
						bottom: (primaryTextPosition as string).startsWith("bottom")
							? (primaryMargin.bottom || 0) + (secondaryMargin.bottom || 0) - offset + gap
							: 0
					};
				}

				this.getLabelMargin(margin);
			}
		}

		render(): ReactNode {
			return <labelMarginContext.Consumer>{this.renderLabel}</labelMarginContext.Consumer>;
		}

		private renderLabel({ getLabelMargin }: LabelMarginContext): ReactNode {
			this.getLabelMargin = getLabelMargin;
			const { primaryText, secondaryText, gap } = this.props;
			const { primaryTextPosition, secondaryTextPosition } = this.state;

			return (
				<positionProviderContext.Provider
					value={{
						textsHaveSamePosition: !!primaryText && !!secondaryText && primaryTextPosition === secondaryTextPosition,
						gap,
						getTextPosition: this.handleTextPositions,
						getTextHeight: this.handleTextHeight
					}}
				>
					{primaryText}
					{secondaryText}
				</positionProviderContext.Provider>
			);
		}

		private calculateMargin(position: PieChartElementsProps.TextPosition | null, height: number): Margin {
			let margin = { top: 0, left: 0, bottom: 0, right: 0 };
			const { offset } = this.props;

			switch (position) {
				case "top":
				case "top-left":
				case "top-right":
					margin = {
						...margin,
						top: height + offset
					};
					break;
				case "bottom":
				case "bottom-left":
				case "bottom-right":
					margin = {
						...margin,
						bottom: height + offset
					};
					break;
				default:
			}

			return margin;
		}

		private handleTextPositions(
			primary?: PieChartElementsProps.TextPosition,
			secondary?: PieChartElementsProps.TextPosition
		): void {
			this.setState(({ primaryTextPosition, secondaryTextPosition }) => ({
				primaryTextPosition: primary ? primary : primaryTextPosition,
				secondaryTextPosition: secondary ? secondary : secondaryTextPosition
			}));
		}

		private handleTextHeight(type: PieChartElementsProps.TextType, height: number): void {
			this.setState(({ primaryTextHeight, secondaryTextHeight }) => ({
				primaryTextHeight: type === "primary" ? height : primaryTextHeight,
				secondaryTextHeight: type === "secondary" ? height : secondaryTextHeight
			}));
		}
	}

	/** @deprecated since version 38.1.1. */
	export class Text extends Component<PieChartElementsProps.TextProps> {
		static displayName = "Text";
		static defaultProps = {
			type: "primary",
			position: "center"
		};

		private containerRefObject: RefObject<SVGGElement | null>;
		private getTextPosition:
			| ((primary?: PieChartElementsProps.TextPosition, secondary?: PieChartElementsProps.TextPosition) => void)
			| null;
		private getTextHeight:
			| ((type: PieChartElementsProps.TextType, height: number, position: PieChartElementsProps.TextPosition) => void)
			| null;

		constructor(props: PieChartElementsProps.TextProps) {
			super(props);

			this.containerRefObject = createRef<SVGGElement>();
			this.getTextPosition = null;
			this.getTextHeight = null;

			bindMethods(this);
		}

		componentDidMount(): void {
			this.handleTextSize();
			this.handleTextPosition();
		}

		componentDidUpdate(prevProps: PieChartElementsProps.TextProps): void {
			if (this.props.position !== prevProps.position || this.props.type !== prevProps.type) {
				this.handleTextSize();
				this.handleTextPosition();
			}
		}

		render(): ReactNode {
			return (
				<g ref={this.containerRefObject}>
					<labelContentContext.Consumer>
						{({ viewBox, offset }) => {
							return (
								<positionProviderContext.Consumer>
									{(position) => this.renderText({ viewBox, offset, ...position })}
								</positionProviderContext.Consumer>
							);
						}}
					</labelContentContext.Consumer>
				</g>
			);
		}

		private handleTextSize(): void {
			const gElement = this.containerRefObject.current;
			const { type, position } = this.props;

			if (gElement && this.getTextHeight) {
				const height = Math.ceil(gElement.getBoundingClientRect().height);
				this.getTextHeight(type, height, position);
			}
		}

		private handleTextPosition(): void {
			if (this.getTextPosition) {
				const { type, position } = this.props;
				this.getTextPosition(type === "primary" ? position : undefined, type === "secondary" ? position : undefined);
			}
		}

		private getStylesOnTopLeft(
			viewBox: PolarViewBox,
			textsHaveSamePosition: boolean,
			offset: number,
			gap: number
		): TextProps {
			const { cx, cy, outerRadius } = viewBox;
			const { type } = this.props;
			let styles = {};

			if (type === "primary") {
				styles = {
					...styles,
					x: cx && outerRadius ? cx - outerRadius : 0,
					y: cy && outerRadius ? cy - outerRadius - offset : 0,
					verticalAnchor: "end",
					textAnchor: "start",
					dy: textsHaveSamePosition ? -gap - 8 : -8
				};
			} else {
				styles = {
					...styles,
					x: cx && outerRadius ? cx - outerRadius : 0,
					y: cy && outerRadius ? cy - outerRadius - offset : 0,
					verticalAnchor: "end",
					textAnchor: "start",
					dy: -8
				};
			}

			return styles;
		}

		private getStylesOnTopRight(
			viewBox: PolarViewBox,
			textsHaveSamePosition: boolean,
			offset: number,
			gap: number
		): TextProps {
			const { cx, cy, outerRadius } = viewBox;
			const { type } = this.props;
			let styles = {};

			if (type === "primary") {
				styles = {
					...styles,
					x: cx && outerRadius ? cx + outerRadius : 0,
					y: cy && outerRadius ? cy - outerRadius - offset : 0,
					verticalAnchor: "end",
					textAnchor: "end",
					dy: textsHaveSamePosition ? -gap - 8 : -8
				};
			} else {
				styles = {
					...styles,
					x: cx && outerRadius ? cx + outerRadius : 0,
					y: cy && outerRadius ? cy - outerRadius - offset : 0,
					verticalAnchor: "end",
					textAnchor: "end",
					dy: -8
				};
			}

			return styles;
		}

		private getStylesOnTop(
			viewBox: PolarViewBox,
			textsHaveSamePosition: boolean,
			offset: number,
			gap: number
		): TextProps {
			const { cx, cy, outerRadius } = viewBox;
			const { type } = this.props;
			let styles = {};

			if (type === "primary") {
				styles = {
					...styles,
					x: cx,
					y: cy && outerRadius ? cy - outerRadius - offset : 0,
					verticalAnchor: "end",
					textAnchor: "middle",
					dy: textsHaveSamePosition ? -gap - 8 : -8
				};
			} else {
				styles = {
					...styles,
					x: cx,
					y: cy && outerRadius ? cy - outerRadius - offset : 0,
					verticalAnchor: "end",
					textAnchor: "middle",
					dy: -8
				};
			}

			return styles;
		}

		private getStylesOnBottom(
			viewBox: PolarViewBox,
			textsHaveSamePosition: boolean,
			offset: number,
			gap: number
		): TextProps {
			const { cx, cy, outerRadius } = viewBox;
			const { type } = this.props;
			let styles = {};

			if (type === "primary") {
				styles = {
					...styles,
					x: cx,
					y: cy && outerRadius ? cy + outerRadius + offset : 0,
					verticalAnchor: "start",
					textAnchor: "middle",
					dy: 8
				};
			} else {
				styles = {
					...styles,
					x: cx,
					y: cy && outerRadius ? cy + outerRadius + offset : 0,
					verticalAnchor: "start",
					textAnchor: "middle",
					dy: textsHaveSamePosition ? gap + 8 : 8
				};
			}

			return styles;
		}

		private getStylesOnBottomLeft(
			viewBox: PolarViewBox,
			textsHaveSamePosition: boolean,
			offset: number,
			gap: number
		): TextProps {
			const { cx, cy, outerRadius } = viewBox;
			const { type } = this.props;
			let styles = {};

			if (type === "primary") {
				styles = {
					...styles,
					x: cx && outerRadius ? cx - outerRadius : 0,
					y: cy && outerRadius ? cy + outerRadius + offset : 0,
					verticalAnchor: "start",
					textAnchor: "start",
					dy: 8
				};
			} else {
				styles = {
					...styles,
					x: cx && outerRadius ? cx - outerRadius : 0,
					y: cy && outerRadius ? cy + outerRadius + offset : 0,
					verticalAnchor: "start",
					textAnchor: "start",
					dy: textsHaveSamePosition ? gap + 8 : 8
				};
			}

			return styles;
		}

		private getStylesOnBottomRight(
			viewBox: PolarViewBox,
			textsHaveSamePosition: boolean,
			offset: number,
			gap: number
		): TextProps {
			const { cx, cy, outerRadius } = viewBox;
			const { type } = this.props;
			let styles = {};

			if (type === "primary") {
				styles = {
					...styles,
					x: cx && outerRadius ? cx + outerRadius : 0,
					y: cy && outerRadius ? cy + outerRadius + offset : 0,
					verticalAnchor: "start",
					textAnchor: "end",
					dy: 8
				};
			} else {
				styles = {
					...styles,
					x: cx && outerRadius ? cx + outerRadius : 0,
					y: cy && outerRadius ? cy + outerRadius + offset : 0,
					verticalAnchor: "start",
					textAnchor: "end",
					dy: textsHaveSamePosition ? gap + 8 : 8
				};
			}

			return styles;
		}

		private getStylesOnCenter(viewBox: PolarViewBox, textsHaveSamePosition: boolean, gap: number): TextProps {
			const { type } = this.props;
			const { cx, cy } = viewBox;

			let styles: TextProps = {
				x: cx ? cx : 0,
				y: cy ? cy : 0,
				dx: 0,
				dy: 0,
				verticalAnchor: "start",
				textAnchor: "start"
			};

			if (type === "primary") {
				styles = {
					...styles,
					verticalAnchor: "middle",
					textAnchor: "middle",
					dy: textsHaveSamePosition ? -gap / 2 : 0
				};
			} else {
				styles = {
					...styles,
					verticalAnchor: "middle",
					textAnchor: "middle",
					dy: textsHaveSamePosition ? gap / 2 : 0
				};
			}

			return styles;
		}

		private renderText({
			viewBox,
			offset,
			gap,
			textsHaveSamePosition,
			getTextPosition,
			getTextHeight
		}: PositionProviderContext & LabelContentContext): ReactNode {
			if (!viewBox) {
				return null;
			}

			const { type, position, ref, ...rest } = this.props;
			const { cx, cy } = viewBox;
			this.getTextPosition = getTextPosition;
			this.getTextHeight = getTextHeight;

			const fill = type === "primary" ? "#000" : "#777";
			const fontSize = type === "primary" ? 20 : 16;

			let styles: Pick<TextProps, "x" | "y" | "dx" | "dy" | "verticalAnchor" | "textAnchor"> = {
				x: cx ? cx : 0,
				y: cy ? cy : 0,
				dx: 0,
				dy: 0,
				verticalAnchor: "start",
				textAnchor: "start"
			};

			switch (position) {
				case "top":
					styles = this.getStylesOnTop(viewBox, textsHaveSamePosition, offset, gap);
					break;
				case "top-left":
					styles = this.getStylesOnTopLeft(viewBox, textsHaveSamePosition, offset, gap);
					break;
				case "top-right":
					styles = this.getStylesOnTopRight(viewBox, textsHaveSamePosition, offset, gap);
					break;
				case "bottom":
					styles = this.getStylesOnBottom(viewBox, textsHaveSamePosition, offset, gap);
					break;
				case "bottom-left":
					styles = this.getStylesOnBottomLeft(viewBox, textsHaveSamePosition, offset, gap);
					break;
				case "bottom-right":
					styles = this.getStylesOnBottomRight(viewBox, textsHaveSamePosition, offset, gap);
					break;
				default:
					// Position is "center"
					styles = this.getStylesOnCenter(viewBox, textsHaveSamePosition, gap);
			}

			return <RechartsText fontSize={fontSize} fill={fill} {...styles} {...rest} />;
		}
	}

	/** @deprecated since version 38.1.1. */
	interface LegendInternalProps {
		/** @internal */
		data: PieChartElementsProps.ChartData[];

		/** @internal */
		activeDataKey?: string;

		/** @internal */
		onLegendVisibilityChange(isVisible: boolean): void;
	}

	/** @deprecated since version 38.1.1. */
	interface LegendState {
		open: boolean;
		maxHeight?: number;
	}

	/** @deprecated since version 38.1.1. */
	export class Legend extends Component<PieChartElementsProps.LegendProps & LegendInternalProps, LegendState> {
		static displayName = "Legend";
		private buttonHideRef: HTMLElement | null = null;
		private hideButtonHeight: number;

		constructor(props: PieChartElementsProps.LegendProps & LegendInternalProps) {
			super(props);

			this.hideButtonHeight = 0;

			this.state = { open: false };

			bindMethods(this);
		}

		private handleRef(ref: HTMLElement | null): void {
			this.buttonHideRef = ref;
		}

		private handleOnClickHideButton(): void {
			this.setState((prevState) => ({
				open: !prevState.open
			}));
		}

		private handleOnLegendVisibilityChange(isVisible: boolean): void {
			if (!isVisible) {
				this.setState({ open: false });
			}

			this.props.onLegendVisibilityChange(isVisible);
		}

		private renderLegend(): ReactNode {
			const { className, style, id, hideable, layout, height, width, align, verticalAlign } = this.props;
			const classNames = joinClassNames(
				baseLegendClassName,
				{ [`${baseLegendClassName}--layout-${layout}`]: layout },
				{ [`${baseLegendClassName}__hideable`]: hideable },
				{ [`${baseLegendClassName}--${verticalAlign || "top"}`]: !hideable },
				{ [`${baseLegendClassName}--${align || "right"}`]: !hideable },
				className
			);
			const legendStyle = {
				maxHeight: !hideable ? height && (hideable ? height - this.hideButtonHeight : height) : undefined,
				maxWidth: width,
				...style
			};

			return (
				<StyledRechartsPieChartLegend
					className={classNames}
					style={legendStyle}
					id={id}
					hideable={hideable}
					layout={layout}
					dataRole={DataRoles.PieChart.Legend}
				>
					{this.props.data.map(this.renderLegendItem)}
				</StyledRechartsPieChartLegend>
			);
		}

		private handleOnAttachedPortalSizeChange(maxWidth: number, maxHeight: number): void {
			const { height } = this.props;
			const newHeight =
				!height || height - this.hideButtonHeight > maxHeight ? maxHeight : height - this.hideButtonHeight;

			if (newHeight !== this.state.maxHeight) {
				this.setState({ maxHeight: newHeight });
			}
		}

		componentDidMount(): void {
			if (this.props.hideable && this.buttonHideRef) {
				this.hideButtonHeight = this.buttonHideRef.clientHeight;

				const { height } = this.props;
				this.setState({ maxHeight: height ? height - this.hideButtonHeight : height });
			}
		}

		render(): ReactNode {
			return this.props.hideable
				? [
						<Button
							key="legend__button"
							primary
							icon={<Icon>{this.state.open ? "close" : "info"}</Icon>}
							onClick={this.handleOnClickHideButton}
							buttonRef={this.handleRef}
						/>,
						this.state.open && this.buttonHideRef && (
							<AttachedPortal
								key="legend__portal"
								referenceElement={this.buttonHideRef}
								closeOnOutsideClick
								onVisibilityChange={this.handleOnLegendVisibilityChange}
								orientationList={["bottom-end", "top-end"]}
								fixedOrientation
								style={{ maxHeight: this.state.maxHeight }}
								onSizeChange={this.handleOnAttachedPortalSizeChange}
							>
								{this.renderLegend()}
							</AttachedPortal>
						)
					]
				: this.renderLegend();
		}

		private renderLegendItem(data: PieChartElementsProps.ChartData, index: number): ReactNode {
			if (!this.props.showNonPositiveEntries && data.value <= 0) {
				return null;
			}

			return (
				<LegendItem
					key={index}
					data={data}
					onMouseEnter={this.props.onMouseEnter}
					onMouseLeave={this.props.onMouseLeave}
					activeDataKey={this.props.activeDataKey}
					onClick={this.props.onClick}
				/>
			);
		}
	}

	/** @deprecated since version 38.1.1. */
	export interface LegendItemInternalProps extends PieChartElementsProps.LegendItemProps {
		/** @internal */
		activeDataKey?: string;
	}

	/** @deprecated since version 38.1.1. */
	export class LegendItem extends Component<LegendItemInternalProps> {
		static displayName = "LegendItem";
		constructor(props: PieChartElementsProps.LegendItemProps) {
			super(props);

			bindMethods(this);
		}

		render(): ReactNode {
			const { data, onMouseEnter, onMouseLeave, activeDataKey, onClick, style, ...rest } = this.props;
			const blurred = !!(activeDataKey && activeDataKey !== data.name);

			return (
				<StyledPieChartLegendListItem
					blurred={blurred}
					graphicWrapperProps={{
						style: { backgroundColor: data.color }
					}}
					graphic={<></>}
					text={data.name}
					meta={data.value.toString()}
					onMouseEnter={this.onMouseEnter}
					onMouseLeave={this.onMouseLeave}
					onClick={this.onClick}
					{...rest}
				/>
			);
		}

		private onMouseEnter(event: MouseEvent<HTMLElement>): void {
			if (this.props.onMouseEnter) {
				this.props.onMouseEnter(this.props.data, event);
			}
		}

		private onMouseLeave(event: MouseEvent<HTMLElement>): void {
			if (this.props.onMouseLeave) {
				this.props.onMouseLeave(this.props.data, event);
			}
		}

		private onClick(event: MouseEvent<HTMLElement>): void {
			if (this.props.onClick) {
				this.props.onClick(this.props.data, event);
			}
		}
	}
}
