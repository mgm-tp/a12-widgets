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

import type { MouseEvent, KeyboardEvent, ReactElement } from "react";
import { createRef, Component } from "react";
import { Key } from "ts-key-enum";

import { InputElements } from "../../../../input//base/template/base.tpl.view.js";
import { joinClassNames, addPrefix, bindMethods } from "../../../../common/main/utils.js";
import { StyledBaseInput } from "../../../../input/base-input-styled/base.styled.js";
import { DataRoles } from "../../../../common/index.js";

import type { SliderProps } from "./slider.api.js";
import {
	StyledSlider,
	StyledSliderBackdrop,
	StyledSliderBar,
	StyledSliderBarFill,
	StyledSliderBarLeftFill,
	StyledSliderLabel,
	StyledSliderThumb,
	StyledSliderTick,
	StyledSliderLeftTick,
	StyledSliderWrapper
} from "./slider.styled.js";

const baseClassName = addPrefix("field__slider");
const baseFieldClassName = addPrefix("field");

interface SliderState {
	thumbPosition: number;
	isDragging: boolean;
}

export class Slider extends Component<SliderProps, SliderState> {
	static displayName = "Slider";
	private sliderBoxRef = createRef<HTMLDivElement>();
	private backupThumbPosition: number | null = null;
	private backupValue: string | null = null;

	private barLeft: number | null = null;
	private barRight: number | null = null;

	static defaultProps = {
		fitToParent: true
	};

	constructor(props: SliderProps) {
		super(props);
		this.state = this.getStateFromProps();
		bindMethods(this);
	}

	private getStateFromProps(): SliderState {
		const indexOfValue = this.props.marks.findIndex((mark) => mark.value === this.props.value);

		return {
			thumbPosition: indexOfValue > 0 ? (indexOfValue / (this.props.marks.length - 1)) * 100 : 0,
			isDragging: false
		};
	}

	private getValueOfThumb(): string {
		const indexOfValue = Math.round((this.state.thumbPosition * (this.props.marks.length - 1)) / 100);

		return this.props.marks[indexOfValue].value;
	}

	private handleMouseDown(event: MouseEvent<HTMLDivElement>): void {
		if (this.props.disabled || this.props.readonly) {
			return;
		}

		this.sliderBoxRef.current?.focus();

		if (this.sliderBoxRef.current) {
			this.barLeft = this.sliderBoxRef.current.getBoundingClientRect().left;
			this.barRight = this.sliderBoxRef.current.getBoundingClientRect().right;
			this.backupThumbPosition = this.state.thumbPosition;
			this.backupValue = this.getValueOfThumb();
			const ghostThumbPosition = ((event.pageX - this.barLeft) / (this.barRight - this.barLeft)) * 100;

			this.setState({ isDragging: true }, () => {
				this.updateThumbPosition(ghostThumbPosition);
			});
		}

		event.preventDefault();
	}

	private handleMouseMove(event: MouseEvent<HTMLDivElement>): void {
		event.preventDefault();

		if (this.barLeft && this.barRight) {
			const ghostThumbPosition = ((event.pageX - this.barLeft) / (this.barRight - this.barLeft)) * 100;
			this.updateThumbPosition(ghostThumbPosition);
		}
	}

	private handleMouseUp(event: MouseEvent<HTMLDivElement>): void {
		const newValue = this.getValueOfThumb();
		this.setState({ isDragging: false });

		if (newValue !== this.backupValue) {
			this.props.onChange?.(newValue);
		}

		event.preventDefault();
	}

	private handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
		if (this.props.disabled || this.props.readonly) {
			return;
		}

		const key = event.key;

		if (key === Key.Escape) {
			event.preventDefault();

			if (this.state.isDragging && this.backupThumbPosition) {
				this.setState({ isDragging: false, thumbPosition: this.backupThumbPosition });
			}
		}

		this.backupThumbPosition = this.state.thumbPosition;
		this.backupValue = this.getValueOfThumb();

		if (key === Key.ArrowUp || key === Key.ArrowRight) {
			event.preventDefault();
			this.moveStep(1);
		}

		if (key === Key.ArrowDown || key === Key.ArrowLeft) {
			event.preventDefault();
			this.moveStep(-1);
		}

		if (key === Key.PageUp) {
			event.preventDefault();
			this.moveStep(5);
		}

		if (key === Key.PageDown) {
			event.preventDefault();
			this.moveStep(-5);
		}

		if (key === Key.End) {
			event.preventDefault();
			this.setState({ thumbPosition: 100 });
			this.props.onChange?.(this.props.marks[this.props.marks.length - 1].value);
		}

		if (key === Key.Home) {
			event.preventDefault();
			this.setState({ thumbPosition: 0 });
			this.props.onChange?.(this.props.marks[0].value);
		}
	}

	private moveStep(delta: number): void {
		const positionForDelta = (1 / (this.props.marks.length - 1)) * 100 * delta;
		this.updateThumbPosition(this.state.thumbPosition + positionForDelta);
	}

	private updateThumbPosition(thumbPosition: number): void {
		const indexOfThumb =
			thumbPosition >= 100
				? this.props.marks.length - 1
				: thumbPosition <= 0
					? 0
					: Math.round((thumbPosition * (this.props.marks.length - 1)) / 100);

		const newThumbPosition = (indexOfThumb / (this.props.marks.length - 1)) * 100;
		const newMark = this.props.marks[indexOfThumb];

		if (!newMark.disabled) {
			this.setState({ thumbPosition: newThumbPosition });

			if (!this.state.isDragging && this.backupValue !== newMark.value) {
				this.props.onChange?.(newMark.value);
			}
		}
	}

	componentDidUpdate(prevProps: SliderProps): void {
		if (this.state.isDragging) {
			this.sliderBoxRef.current?.focus();
		}

		if (prevProps.value !== this.props.value || prevProps.marks !== this.props.marks) {
			this.setState(this.getStateFromProps());
		}
	}

	render(): ReactElement<HTMLDivElement> {
		const {
			marks,
			className,
			style,
			id,
			label,
			labelGraphic,
			disabled,
			errorMessage,
			readonly,
			fitToParent,
			hideLabel
		} = this.props;
		const lastMarkIndex = marks.length - 1;

		const wrapperClassNames = joinClassNames(
			baseFieldClassName,
			{ [`${baseFieldClassName}--block`]: fitToParent },
			className
		);

		return (
			<StyledBaseInput.StyledField
				$block={fitToParent}
				className={wrapperClassNames}
				style={style}
				id={id}
				data-role={DataRoles.FieldSlider}
			>
				<InputElements.Label
					id={id}
					label={label}
					graphic={labelGraphic}
					disabled={disabled}
					hide={hideLabel}
					htmlFor={id}
					dataRole={DataRoles.FieldSlider.Label}
				/>
				{errorMessage ? (
					<InputElements.Error id={id} errorMessage={errorMessage} dataRole={DataRoles.FieldSlider.ErrorMessage} />
				) : undefined}
				<StyledSliderWrapper className={`${baseClassName}-wrapper`}>
					{this.props.leftLabel && <InputElements.Label label={this.props.leftLabel} />}
					<StyledSlider
						className={joinClassNames(
							baseClassName,
							{ [`${baseClassName}--readonly`]: readonly },
							{ [`${baseClassName}--disabled`]: disabled },
							{ [`${baseClassName}--invalid`]: errorMessage }
						)}
						tabIndex={-1}
						onMouseDown={this.handleMouseDown}
						onKeyDown={this.handleKeyDown}
						data-role={DataRoles.FieldSlider.Box}
						ref={this.sliderBoxRef}
						$disabled={disabled}
						$readonly={readonly}
						$invalid={!!errorMessage}
					>
						<StyledSliderBar className={`${baseClassName}Bar`} key="bar">
							<StyledSliderBarLeftFill
								className={`${baseClassName}BarFill ${baseClassName}BarFill--left`}
								data-role={DataRoles.FieldSlider.BarFillLeft}
								$disabled={disabled}
								$thumbPosition={this.state.thumbPosition}
							/>
							<StyledSliderBarFill
								className={`${baseClassName}BarFill ${baseClassName}BarFill--right`}
								data-role={DataRoles.FieldSlider.BarFillRight}
								$disabled={disabled}
								$thumbPosition={this.state.thumbPosition}
							/>
							{marks.map((_, index) => {
								const tickPosition = (index / lastMarkIndex) * 100;
								const tickSide = tickPosition <= this.state.thumbPosition ? "left" : "right";

								return tickSide === "left" ? (
									<StyledSliderLeftTick
										className={`${baseClassName}BarTick ${baseClassName}BarTick--${tickSide}`}
										key={`major-tick-${index}`}
										data-role={DataRoles.FieldSlider.BarTick}
										$disabled={disabled}
										$tickPosition={tickPosition}
									/>
								) : (
									<StyledSliderTick
										className={`${baseClassName}BarTick ${baseClassName}BarTick--${tickSide}`}
										key={`major-tick-${index}`}
										data-role={DataRoles.FieldSlider.BarTick}
										$disabled={disabled}
										$tickPosition={tickPosition}
									/>
								);
							})}
							{marks.map((mark, index) => {
								return (
									<StyledSliderLabel
										className={joinClassNames(`${baseClassName}BarLabel`, {
											[`${baseClassName}BarLabel--disabled`]: mark.disabled
										})}
										key={`major-tick-label-${index}`}
										data-role={DataRoles.FieldSlider.BarLabel}
										$disabled={disabled ?? mark.disabled}
										$position={(index / lastMarkIndex) * 100}
									>
										{mark.label ?? mark.value}
									</StyledSliderLabel>
								);
							})}
						</StyledSliderBar>
						<StyledSliderThumb
							className={`${baseClassName}Thumb`}
							data-role={DataRoles.FieldSlider.Thumb}
							$disabled={disabled}
							$invalid={!!errorMessage}
							$readonly={readonly}
							$thumbPosition={this.state.thumbPosition}
						/>
						{this.state.isDragging ? (
							<StyledSliderBackdrop
								className={`${baseClassName}Backdrop`}
								onMouseMove={this.handleMouseMove}
								onMouseUp={this.handleMouseUp}
								data-role={DataRoles.FieldSlider.Backdrop}
							/>
						) : undefined}
					</StyledSlider>
					{this.props.rightLabel && <InputElements.Label label={this.props.rightLabel} />}
				</StyledSliderWrapper>
			</StyledBaseInput.StyledField>
		);
	}
}
