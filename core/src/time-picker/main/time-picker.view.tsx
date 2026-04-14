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

import type { FC, ReactElement, ContextType, ReactNode } from "react";
import { useMemo, useCallback, Component } from "react";

import { addPrefix, bindMethods, StringUtils } from "../../common/main/utils.js";
import { DateTimeUtils } from "../../common/main/date-time/date-utils.js";
import { TimeUtils } from "../../common/main/date-time/time-utils.js";
import { provider } from "../../common/main/device-detector.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { ModalOverlay } from "../../modal-overlay/main/modal-overlay.view.js";
import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import { PickerHeaderCloseButton } from "../../datepicker/main/date-picker.tpl.view.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { TimePickerProps } from "./time-picker.api.js";
import { TimePickerDialog } from "./time-picker.mobile.view.js";
import { TimePickerInput } from "./time-picker-input.view.js";
import { createDefaultTimeFormatter, createDefaultTimeConverter, Header } from "./time-picker.internal.js";
import { StyledTimePickerText, StyledTimePickerWrapper } from "./time-picker.styled.js";

export const TimePicker: FC<TimePickerProps> = (props): ReactElement => {
	const { value: valueTZ, onChange, timezone, customHeaderElement, mode, timeConverter, timeFormatter } = props;
	const { convertDate } = useMemo(() => DateTimeUtils.createTimezoneConverter(timezone), [timezone]);

	const value = useMemo(() => {
		const valueUTC = convertDate.toUTC(valueTZ);

		return valueUTC ? DateTimeUtils.normalizeDateValue(valueUTC) : undefined;
	}, [convertDate, valueTZ]);

	const _onChange: TimePickerProps["onChange"] = useCallback(
		(date: Date) => onChange?.(convertDate.toTimezone(date)),
		[convertDate, onChange]
	);

	const _customHeaderElement: TimePickerProps["customHeaderElement"] = useMemo(() => {
		if (customHeaderElement instanceof Function) {
			return (time: Date | undefined, closeHandler: (() => void) | undefined) =>
				customHeaderElement(convertDate.toTimezone(time), closeHandler);
		}

		return customHeaderElement;
	}, [convertDate, customHeaderElement]);

	const _timeConverter: TimePickerProps.TimeConverter = useMemo(() => {
		const converter = timeConverter ?? createDefaultTimeConverter({ mode, timezone });

		return (inputTZ) => convertDate.toUTC(converter(inputTZ));
	}, [convertDate, mode, timeConverter, timezone]);

	const _timeFormatter: TimePickerProps.TimeFormatter = useMemo(() => {
		const formatter = timeFormatter ?? createDefaultTimeFormatter({ mode, timezone });

		return (timeUTC) => formatter(convertDate.toTimezone(timeUTC));
	}, [convertDate, mode, timeFormatter, timezone]);

	return (
		<TimePickerUTC
			{...props}
			value={value}
			onChange={_onChange}
			timeConverter={_timeConverter}
			timeFormatter={_timeFormatter}
			customHeaderElement={_customHeaderElement}
		/>
	);
};

TimePicker.displayName = "TimePicker";

export interface TimePickerDialogState {
	value?: Date;
	timeInput: string;
	showPicker: boolean;
}

type TimePickerUTCProps = TimePickerProps & Required<Pick<TimePickerProps, "timeConverter" | "timeFormatter">>;

class TimePickerUTC extends Component<TimePickerUTCProps, TimePickerDialogState> {
	static displayName = "TimePickerUTC";
	declare context: ContextType<typeof A11YLanguageContext>;
	static defaultProps = {
		closeOnBackdropClick: true
	};

	private referenceElement: HTMLElement | null = null;
	private timePickerInputRef: HTMLElement | null = null;

	private pickerRef: HTMLElement | null = null;

	private converter = DateTimeUtils.createTimezoneConverter(this.props.timezone).convertDate;

	constructor(props: TimePickerUTCProps) {
		super(props);

		this.state = {
			value: props.value,
			timeInput: props.timeFormatter(props.value),
			showPicker: false
		};

		props.clearHandler?.(() => this.handleClearAll());

		bindMethods(this);
	}

	componentDidUpdate(prevProps: TimePickerProps): void {
		if (prevProps.timeFormatter?.(this.props.value) !== this.props.timeFormatter(this.props.value)) {
			this.setState({ timeInput: this.props.timeFormatter(this.props.value) });
		}

		if (!TimeUtils.isSameTime(prevProps.value, this.props.value)) {
			this.setState({
				value: this.props.value,
				timeInput: this.props.timeFormatter(this.props.value)
			});
		}
	}

	private handlePickerChange(value?: Date): void {
		this.setState({ value: this.converter.toUTC(value) });
	}

	private handleOk(): void {
		this.setState({ showPicker: false }, this.propagateChange);
		this.props.focusOnInputAfterPicking ? this.timePickerInputRef?.focus() : this.referenceElement?.focus();
	}

	private handleClearAll(): void {
		this.setState({ value: undefined, timeInput: this.props.timeFormatter(undefined) }, this.propagateChange);
	}

	private handleClear(): void {
		this.setState({ value: undefined });
		this.pickerRef?.focus();
	}

	private validateInput(value: string, valid: boolean): void {
		// To prevent triggering props.onValidate on input blurred without typing
		if (this.state.timeInput !== value) {
			this.props.onValidate?.({ value, valid });
		}
	}

	private handleInputChange(value: string): void {
		const convertedValue = this.props.timeConverter(value);

		if (convertedValue) {
			this.validateInput(value, true);
			this.setState({ value: DateTimeUtils.normalizeDateValue(convertedValue), timeInput: "" }, this.propagateChange);
		} else if (!value) {
			this.validateInput(value, true);
			this.setState({ value: undefined }, () => this.propagateChange(!!this.state.timeInput));
		} else {
			this.validateInput(value, false);
			this.setState({ timeInput: value });
		}
	}

	private propagateChange(shouldTriggerChange?: boolean): void {
		this.setState({ timeInput: this.props.timeFormatter(this.state.value) });

		if (!TimeUtils.isSameTime(this.props.value, this.state.value) || shouldTriggerChange) {
			this.props.onChange?.(this.state.value);
		}
	}

	private showPicker(showPicker: boolean): void {
		const convertedValue = this.props.timeConverter(this.state.timeInput);

		this.setState({
			showPicker,
			value: convertedValue ? DateTimeUtils.normalizeDateValue(convertedValue) : undefined
		});
	}

	private renderPickerButton(): ReactNode {
		const { icon, id, disabled, readonly, label, placeholder } = this.props;
		const pickerIcon = icon || <Icon>schedule</Icon>;
		const title = this.context.pickerTitles?.timePickerTrigger;
		const buttonTitleId = id && `${id}-timepicker-trigger-button-title`;

		return (
			<Button
				id={id && `${id}-timepicker-trigger-button`}
				icon={pickerIcon}
				title={title}
				block
				disabled={disabled || readonly}
				buttonRef={this.getReferenceElement}
				buttonAttributes={{
					"aria-labelledby": StringUtils.join(
						{ [`${id}-timepicker-input-label`]: id && (label || placeholder) },
						{ [`${buttonTitleId}`]: !!title && buttonTitleId }
					)
				}}
				onClick={this.handleIconButtonClick}
			>
				{title && <HiddenText id={buttonTitleId}>{`, ${title}`}</HiddenText>}
			</Button>
		);
	}

	private handleIconButtonClick(): void {
		this.showPicker(true);
	}

	private handleCloseButtonClick(): void {
		this.setState({ showPicker: false });
	}

	private renderDialogHeader(): ReactNode {
		const headerTextId = this.props.id ? `${this.props.id}-header-text` : undefined;

		return (
			<Header actionButtons={<PickerHeaderCloseButton onClick={this.handleCloseButtonClick} />}>
				<StyledTimePickerText as="span" className={addPrefix("TimePicker__header--text")} id={headerTextId}>
					{this.props.customHeaderTitle || "Set Time"}
				</StyledTimePickerText>
			</Header>
		);
	}

	private renderCustomHeader(): ReactNode {
		const customHeader = this.props.customHeaderElement;

		if (customHeader instanceof Function) {
			return customHeader(this.state.value, () => this.setState({ showPicker: false }));
		}

		return customHeader;
	}

	private renderDialog(mobile?: boolean): ReactNode {
		return (
			<TimePickerDialog
				customHeaderElement={
					mobile && !this.props.customHeaderElement ? this.renderDialogHeader() : this.renderCustomHeader()
				}
				timezone={this.props.timezone}
				value={this.converter.toTimezone(this.state.value)}
				mode={this.props.mode}
				clearLabel={this.props.clearLabel}
				okLabel={this.props.okLabel}
				onChange={this.handlePickerChange}
				onClearClick={this.handleClear}
				onOkClick={this.handleOk}
				wrapperRef={this.getPickerRef}
				pickerAttributes={mobile ? undefined : this.props.desktopPickerAttributes}
			/>
		);
	}

	private handlePortalVisibilityChange(isVisible: boolean): void {
		this.showPicker(isVisible);
	}

	private handleModalClose(): void {
		this.showPicker(false);
	}

	private getTimePickerInputRef(ref: HTMLInputElement | null): void {
		this.props.timePickerInputRef?.(ref);
		this.timePickerInputRef = ref;
	}

	private getReferenceElement(ref: HTMLElement | null): void {
		this.referenceElement = ref;
	}

	private getPickerRef(ref: HTMLElement | null): void {
		this.pickerRef = ref;
	}

	render(): ReactNode {
		const {
			id,
			style,
			className,
			closeOnBackdropClick,
			hidePickerButton,
			onInputChange,
			value,
			onChange,
			icon,
			...rest
		} = this.props;

		return (
			<StyledTimePickerWrapper
				style={style}
				className={className}
				id={id}
				data-role={DataRoles.TimePicker.Wrapper}
				ref={this.getPickerRef}
				tabIndex={-1}
			>
				<TimePickerInput
					inputRef={this.getTimePickerInputRef}
					value={this.state.timeInput}
					icon={!hidePickerButton && this.renderPickerButton()}
					onChange={this.handleInputChange}
					onValueChange={onInputChange}
					id={id && `${id}-timepicker`}
					{...rest}
				/>
				{this.state.showPicker &&
					(provider.hasTouch() ? (
						<ModalOverlay
							onClose={this.handleModalClose}
							preventScroll
							closeOnOutsideClick={closeOnBackdropClick && provider.isDesktop()}
							containerAttributes={this.props.mobilePickerAttributes}
						>
							{this.renderDialog(true)}
						</ModalOverlay>
					) : (
						this.referenceElement && (
							<AttachedPortal
								selfSizing
								closeOnOutsideClick
								adjustPositionToScreen
								orientationList={["bottom-start", "bottom-end", "top-start", "top-end", "right", "left"]}
								fixedOrientation
								referenceElement={this.referenceElement}
								onVisibilityChange={this.handlePortalVisibilityChange}
							>
								{this.renderDialog()}
							</AttachedPortal>
						)
					))}
			</StyledTimePickerWrapper>
		);
	}
}

TimePickerUTC.contextType = A11YLanguageContext;
