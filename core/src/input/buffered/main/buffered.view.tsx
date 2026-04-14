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

import type {
	ComponentType,
	ReactNode,
	ComponentClass,
	ChangeEvent,
	FocusEvent,
	KeyboardEvent,
	ReactElement,
	FC
} from "react";
import { Component, useCallback } from "react";
import { Key } from "ts-key-enum";

import { bindMethods, resolveRef } from "../../../common/main/utils.js";

import type { BufferedInputProps, HTMLInputProps, ImmediateInputProps } from "./buffered.api.js";

interface BufferedInputState<ValueType> {
	readonly value?: ValueType;
}

/**
 * The function makes no assumptions about the actual type of the value.
 * But the raw component must accept the props of StatelessInputProps.
 *
 * When the buffered component is created, an internal buffer is used to hold the steadily changing value of the
 * underlying stateless component and to pass it back to the stateless component for rendering.
 *
 * The buffered component will have the prop type of {@link BufferedInputProps} and optionally those of Target
 * component. This means that you can directly pass the props of the target component.
 *
 * @template ValueType data type of the edited value of the target component
 * @template TargetPropsType props type of target
 *
 * @param Target type of targeted, immediate input component
 */
export function BufferedInput<ValueType, TargetPropsType extends ImmediateInputProps<ValueType>>(
	// type Target with StatelessInputProps<ValueType> to bound type of ValueType
	Target: ComponentType<ImmediateInputProps<ValueType> & TargetPropsType>

	// type props of return type also with TargetPropsType to bound it to props of Target
	// where will overwrite props of same name
): ComponentClass<BufferedInputProps<ValueType> & TargetPropsType> {
	// tslint:disable-next-line:no-shadowed-variable
	class BufferedInputElement extends Component<
		BufferedInputProps<ValueType> & TargetPropsType,
		BufferedInputState<ValueType>
	> {
		static displayName = "BufferedInputField";

		private prevSubmitValue: ValueType | undefined;
		private inputRef: HTMLInputElement | HTMLTextAreaElement | null = null;
		private justSubmit: boolean = false;

		constructor(props: BufferedInputProps<ValueType> & TargetPropsType) {
			super(props);
			this.state = { value: props.initialValue ?? props.value };
			this.prevSubmitValue = this.state.value;
			bindMethods(this);
		}

		private handleInputRef(ref: HTMLInputElement | HTMLTextAreaElement | null): void {
			this.inputRef = ref;
			resolveRef(ref, this.props.inputRef);
		}

		private handleValueChange(value: ValueType): void {
			const inputHasFocus = document.activeElement === this.inputRef;
			const handler = inputHasFocus ? this.bufferChange : this.submitChange;
			handler(value);
		}

		// buffer input changed
		private bufferChange(value: ValueType): void {
			this.setState({ value });
			this.props.onValueChange?.(value);
		}

		// submit input changed ("autofill")
		private submitChange(value: ValueType): void {
			if (value !== this.props.value) {
				this.prevSubmitValue = value;
				this.justSubmit = true;

				this.setState({ value });
				this.props.onValueSubmit(value);
				this.props.onSubmit?.();
			}
		}

		private handleSubmit(): void {
			if (this.props.alwaysSubmit || this.state.value !== this.prevSubmitValue) {
				this.prevSubmitValue = this.state.value;
				this.justSubmit = true;

				this.props.onValueSubmit(this.state.value);
			}

			this.props.onSubmit?.();
		}

		componentDidUpdate(prevProps: Readonly<BufferedInputProps<ValueType> & TargetPropsType>): void {
			if (
				(this.props.alwaysSubmit && this.justSubmit) ||
				(this.justSubmit && this.props.value !== undefined && prevProps.value === this.props.value) ||
				prevProps.value !== this.props.value
			) {
				this.prevSubmitValue = this.props.value;
				this.justSubmit = false;
				this.setState({ value: this.props.value });
			}
		}

		render(): ReactNode {
			// spread some properties that cannot be DOM attributes after rendering
			const { initialValue, onValueSubmit, ...rest } = this.props;

			return (
				<Target
					{...(rest as TargetPropsType)}
					value={this.state.value}
					onValueChange={this.handleValueChange}
					onSubmit={this.handleSubmit}
					inputRef={this.handleInputRef}
				/>
			);
		}
	}

	return BufferedInputElement;
}

BufferedInput.displayName = "BufferedInput";

export function HTMLInputAdapter<T extends HTMLInputProps>(
	Target: ComponentType<T>
): FC<ImmediateInputProps<string> & T> {
	const AdaptedHTMLInput = (props: ImmediateInputProps<string> & T): ReactElement => {
		const { onValueChange, onSubmit, onBlur, onKeyDown, submitOnEnter, onChange, ...rest } = props;

		const handleOnChange = useCallback(
			(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				onValueChange?.(event.target.value);
				onChange?.(event);
			},
			[onChange, onValueChange]
		);

		const handleOnBlur = useCallback(
			(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				onSubmit?.();
				onBlur?.(event);
			},
			[onBlur, onSubmit]
		);

		const handleKeydown = useCallback(
			(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				if (submitOnEnter && event.key === Key.Enter) {
					onSubmit?.();
				}

				onKeyDown?.(event);
			},
			[onKeyDown, onSubmit, submitOnEnter]
		);

		return <Target {...(rest as T)} onChange={handleOnChange} onBlur={handleOnBlur} onKeyDown={handleKeydown} />;
	};

	AdaptedHTMLInput.displayName = "AdaptedHTMLInput";

	return AdaptedHTMLInput;
}

HTMLInputAdapter.displayName = "HTMLInputAdapter";
