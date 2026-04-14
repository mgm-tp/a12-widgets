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

import type { TouchEvent, MouseEvent, ReactNode, ReactElement } from "react";
import { PureComponent } from "react";

import { addPrefix, joinClassNames, bindMethods, noop } from "../../common/main/utils.js";
import { TimeUtils } from "../../common/main/date-time/time-utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ClockProps } from "./time-picker.clock.api.js";
import type { TimePickerProps } from "./time-picker.api.js";
import {
	StyledTimePickerClockNum,
	StyledTimePickerClock,
	StyledTimePickerClockPointer,
	StyledTimePickerClockPointerInnerDot,
	StyledTimePickerClockPointerOuterDot,
	StyledTimePickerClockPointerOuterDotContent
} from "./time-picker.styled.js";

interface ClockState {
	angle: number;
	size: number;
}

interface ClockSettings {
	size: number;
	start?: number;
	step?: number;
}

interface ClockNumber {
	display: number;
	translateX: number;
	translateY: number;
}

/** @internal */
export type ClockMode = "12h" | "24h" | "minute";

const CLOCK_SIZE = 256;
const baseClockClassName = addPrefix("clock");
const basePointerClassName = addPrefix("pointer");

export class Clock extends PureComponent<ClockProps, ClockState> {
	static displayName = "Clock";

	constructor(props: ClockProps) {
		super(props);
		const mode = this.getMode(props.screen, props.timeFormat);
		this.state = { angle: props.value !== undefined ? getPointerAngle(props.value, mode) : 0, size: CLOCK_SIZE };

		bindMethods(this);
	}

	private handleTouchMove(e: TouchEvent<HTMLElement>): void {
		const rect = e.currentTarget.getBoundingClientRect();
		this.movePointer(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
	}

	private handleMouseMove(e: MouseEvent<HTMLElement>): void {
		if (e.buttons === 1) {
			const rect = e.currentTarget.getBoundingClientRect();
			this.movePointer(e.clientX - rect.left, e.clientY - rect.top);
		}
	}

	private handleClick(e: MouseEvent<HTMLElement>): void {
		const rect = e.currentTarget.getBoundingClientRect();
		this.movePointer(e.clientX - rect.left, e.clientY - rect.top);
	}

	private movePointer(x: number, y: number): void {
		const mode = this.getMode(this.props.screen, this.props.timeFormat);
		const value = getPointerValue(x, y, mode, this.state.size);

		if (value !== this.props.value && this.props.onChange != null) {
			this.props.onChange(value);
		}
	}

	private getMode(screen: TimePickerProps.Screen, timeFormat: string): ClockMode {
		return screen === "hour" ? (timeFormat.indexOf("H") >= 0 ? "24h" : "12h") : "minute";
	}

	private isValueOnInnerClock(value: number): boolean {
		return value === 0 || value > 12;
	}

	private render12hClock(size: number, hourFormat: string): ReactNode {
		return getNumbers(12, { size: size }).map((digit: ClockNumber) => (
			<StyledTimePickerClockNum
				key={digit.display}
				className={`${baseClockClassName}__num`}
				style={{ transform: `translate(${digit.translateX}px, ${digit.translateY}px)` }}
				data-role={DataRoles.TimePicker.Clock.Num}
			>
				{TimeUtils.getFormattedHour(digit.display, hourFormat)}
			</StyledTimePickerClockNum>
		));
	}

	private render24hOuterClock(size: number, hourFormat: string): ReactNode {
		return getNumbers(12, { size: size, start: 1 }).map((digit: ClockNumber) => (
			<StyledTimePickerClockNum
				key={digit.display}
				className={`${baseClockClassName}__num`}
				style={{ transform: `translate(${digit.translateX}px, ${digit.translateY}px)` }}
				data-role={DataRoles.TimePicker.Clock.Num}
			>
				{TimeUtils.getFormattedHour(digit.display, hourFormat)}
			</StyledTimePickerClockNum>
		));
	}

	private render24hInnerClock(size: number, hourFormat: string): ReactNode {
		return getNumbers(12, { size: size - 80, start: 13 }).map((digit: ClockNumber) => (
			<StyledTimePickerClockNum
				key={digit.display}
				className={`${baseClockClassName}__num`}
				style={{ transform: `translate(${digit.translateX}px, ${digit.translateY}px)` }}
				data-role={DataRoles.TimePicker.Clock.Num}
			>
				{TimeUtils.getFormattedHour(digit.display, hourFormat)}
			</StyledTimePickerClockNum>
		));
	}

	private renderMinuteClock(size: number, minuteFormat: string): ReactNode {
		return getNumbers(12, { size: size, start: 5, step: 5 }).map((digit: ClockNumber) => (
			<StyledTimePickerClockNum
				key={digit.display}
				className={`${baseClockClassName}__num`}
				style={{ transform: `translate(${digit.translateX}px, ${digit.translateY}px)` }}
				data-role={DataRoles.TimePicker.Clock.Num}
			>
				{digit.display === 60 ? "00" : TimeUtils.getFormattedMinute(digit.display, minuteFormat)}
			</StyledTimePickerClockNum>
		));
	}

	private renderPointer(displayValue: string, hasSmallPointer: boolean): ReactElement {
		return (
			<StyledTimePickerClockPointer
				hasSmallPointer={hasSmallPointer}
				className={`${baseClockClassName}__pointer ${hasSmallPointer ? `${baseClockClassName}__pointer--small` : ""}`}
				style={{ transform: `rotateZ(${this.state.angle}deg)` }}
				data-role={DataRoles.TimePicker.Pointer}
			>
				<StyledTimePickerClockPointerInnerDot className={`${basePointerClassName}__innerDot`} />
				<StyledTimePickerClockPointerOuterDot
					className={`${basePointerClassName}__outerDot`}
					style={{ transform: `rotateZ(${-this.state.angle}deg)` }}
				>
					<StyledTimePickerClockPointerOuterDotContent>{displayValue}</StyledTimePickerClockPointerOuterDotContent>
				</StyledTimePickerClockPointerOuterDot>
			</StyledTimePickerClockPointer>
		);
	}

	private renderInitialPointer(hasSmallPointer: boolean): ReactElement {
		return (
			<StyledTimePickerClockPointer
				hasSmallPointer={hasSmallPointer}
				initialPointer
				className={`${baseClockClassName}__pointer ${
					hasSmallPointer ? `${baseClockClassName}__pointer--initialSmall` : `${baseClockClassName}__pointer--initial`
				}`}
				style={{ transform: `rotateZ(${getPointerAngle(12, "12h")}deg)` }}
				data-role={DataRoles.TimePicker.Pointer}
			>
				<StyledTimePickerClockPointerInnerDot
					initial
					className={`${basePointerClassName}__innerDot ${basePointerClassName}__innerDot--initial`}
				/>
			</StyledTimePickerClockPointer>
		);
	}

	private handleClockRef(ref: HTMLElement | null): void {
		if (ref) {
			const size = ref.getBoundingClientRect().width;
			this.setState((prev) => (prev.size !== size ? { size } : null));
		}
	}

	componentDidUpdate(prevProps: Readonly<ClockProps>): void {
		if (this.props.value !== prevProps.value || this.props.screen !== prevProps.screen) {
			const mode = this.getMode(this.props.screen, this.props.timeFormat);
			this.setState({
				angle:
					this.props.value !== undefined
						? getShortestAngle(this.state.angle, getPointerAngle(this.props.value, mode))
						: 0
			});
		}
	}

	render(): ReactElement<ClockProps> {
		const { size } = this.state;
		const hourFormat = TimeUtils.getHourFormat(this.props.timeFormat) || "H";
		const minuteFormat = TimeUtils.getMinuteFormat(this.props.timeFormat) || "mm";
		const mode = this.getMode(this.props.screen, this.props.timeFormat);
		const smallPointer =
			mode === "24h" && (this.props.value === undefined || this.isValueOnInnerClock(this.props.value));

		return (
			<StyledTimePickerClock
				ref={this.handleClockRef}
				data-role={DataRoles.TimePicker.Clock}
				className={joinClassNames(addPrefix("TimePicker__clock"), baseClockClassName, this.props.className)}
				style={this.props.style}
				id={this.props.id}
				onTouchMove={(event) => this.handleTouchMove(event)}
				onMouseMove={(event) => this.handleMouseMove(event)}
				onTouchEnd={this.props.onTouchEnd}
				onMouseUp={this.props.onMouseUp}
				onClick={this.handleClick}
				onKeyDown={noop}
			>
				{mode === "12h" && this.render12hClock(size, hourFormat)}
				{mode === "24h" && this.render24hOuterClock(size, hourFormat)}
				{mode === "24h" && this.render24hInnerClock(size, hourFormat)}
				{mode === "minute" && this.renderMinuteClock(size, minuteFormat)}
				{this.props.value !== undefined
					? this.renderPointer(
							this.props.screen === "hour"
								? TimeUtils.getFormattedHour(this.props.value, hourFormat)
								: TimeUtils.getFormattedMinute(this.props.value, minuteFormat),
							smallPointer
						)
					: this.renderInitialPointer(smallPointer)}
			</StyledTimePickerClock>
		);
	}
}

function getNumbers(count: number, { size, start = 1, step = 1 }: ClockSettings): ClockNumber[] {
	return [...new Array(count)].map((val, i: number) => ({
		display: i * step + start,
		translateX: Number(((size / 2 - 20) * Math.cos((2 * Math.PI * (i - 2)) / count)).toFixed(10)),
		translateY: Number(((size / 2 - 20) * Math.sin((2 * Math.PI * (i - 2)) / count)).toFixed(10))
	}));
}

function getPointerAngle(value: number, mode: ClockMode): number {
	switch (mode) {
		case "12h":
			return (360 / 12) * (value - 3);
		case "24h":
			return (360 / 12) * ((value % 12) - 3);
		case "minute":
			return (360 / 60) * (value - 15);
		default:
			return 0;
	}
}

function getPointerValue(x: number, y: number, mode: ClockMode, size: number): number {
	let angle = (Math.atan2(size / 2 - x, size / 2 - y) / Math.PI) * 180;

	if (angle < 0) {
		angle = 360 + angle;
	}

	switch (mode) {
		case "12h": {
			const value = Math.round(12 - (angle * 12) / 360);

			return value === 0 ? 12 : value;
		}

		case "24h": {
			const radius = Math.sqrt(Math.pow(size / 2 - x, 2) + Math.pow(size / 2 - y, 2));
			let value = 12 - Math.round((angle * 12) / 360);

			if (value === 0) {
				value = 12;
			}

			if (radius < size / 2 - 36) {
				value = value === 12 ? 0 : value + 12;
			}

			return value;
		}

		case "minute": {
			const value = Math.round(60 - (60 * angle) / 360);

			return value === 60 ? 0 : value;
		}

		default:
			return 0;
	}
}

function mod(a: number, b: number): number {
	return a - Math.floor(a / b) * b;
}

function getShortestAngle(from: number, to: number): number {
	const difference = to - from;

	return from + mod(difference + 180, 360) - 180;
}
