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

import type { ContextType, ChangeEvent, FocusEvent, ReactNode, KeyboardEvent } from "react";
import { Component } from "react";
import { Key } from "ts-key-enum";

import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import { Button } from "../../../button/main/button.view.js";
import type { DropDown } from "../../../dropdown/main/template/dropdown.tpl.view.js";
import { Icon as IconWidget } from "../../../icon/main/icon.view.js";
import type { Orientation } from "../../../common/main/alignment.js";
import { Tooltip } from "../../../tooltip/main/tooltip.view.js";
import {
	addPrefix,
	bindMethods,
	hasGotFocus,
	isTypeableCharacter,
	joinClassNames,
	StringUtils
} from "../../../common/main/utils.js";
import { provider } from "../../../common/main/device-detector.js";
import { TextLineStateless } from "../../text-line/main/template/text-line.tpl.view.js";
import { SelectionSuffix } from "../../base/template/base.tpl.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { IconPickerProps } from "./icon-picker.api.js";
import { IconPickerUtils } from "./icon-picker.internal.js";
import {
	StyledIconPickerDropdown,
	StyledIconPickerPreviewIcon,
	StyledIconPickerWrapper
} from "./icon-picker.styled.js";

const PORTAL_ORIENTATIONS: Orientation[] = ["bottom-start", "top-start"];
const iconPickerBaseClass = addPrefix("icon-picker");
const baseFieldClassName = addPrefix("field");

interface IconPickerState {
	inputValue: string;
	showIconPicker?: boolean;
	preSelectedIcon?: IconPickerProps.Icon;
	searchText: string;
}

export class IconPicker extends Component<IconPickerProps, IconPickerState> {
	static displayName = "IconPicker";

	declare context: ContextType<typeof A11YLanguageContext>;

	private dropdownInstance: DropDown | null = null;
	private inputWrapperRef: HTMLElement | null = null;
	private inputRef: HTMLInputElement | null = null;
	private inputLabelRef: HTMLElement | null = null;
	private inputHelperTextRef: HTMLElement | null = null;
	private dropdownRef: HTMLElement | null = null;
	private clearButtonRef: HTMLElement | null = null;
	private viewListButtonRef: HTMLElement | null = null;
	private justClickOnItem = false;

	constructor(props: IconPickerProps) {
		super(props);
		const { selectedIcon } = props;
		this.state = {
			inputValue: IconPickerUtils.getIconLabel(selectedIcon),
			searchText: ""
		};
		bindMethods(this);
	}

	private getInputWrapperRef(ref: HTMLDivElement | null): void {
		this.inputWrapperRef = ref;
		this.props.inputWrapperRef?.(ref);
	}

	private getInputRef(ref: HTMLInputElement): void {
		this.inputRef = ref;
		this.props.inputRef?.(ref);
	}

	private getInputLabelRef(ref: HTMLElement | null): void {
		this.inputLabelRef = ref;
	}

	private getInputHelperTextRef(ref: HTMLElement | null): void {
		this.inputHelperTextRef = ref;
	}

	private getDropdownRef(ref: HTMLElement | null): void {
		this.dropdownRef = ref;
	}

	private getClearButtonRef(ref: HTMLElement | null): void {
		this.clearButtonRef = ref;
	}

	private getViewListButtonRef(ref: HTMLElement | null): void {
		this.viewListButtonRef = ref;
	}

	private getDropdownInstance(instance: DropDown): void {
		this.dropdownInstance = instance;
	}

	private handleInputWrapperClick(): void {
		this.justClickOnItem = false;
		this.showIconPicker();
		this.inputRef?.focus();
	}

	private handleInputValueChange(event: ChangeEvent<HTMLInputElement>): void {
		const value = event.target.value;
		this.setState({ inputValue: value, searchText: value });
		this.dropdownInstance?.resetPreselectedPosition();
	}

	private handleInputFocus(event: FocusEvent<HTMLInputElement>): void {
		const { openOnFocus = true, onFocus } = this.props;
		onFocus?.(event);

		if (openOnFocus) {
			this.showIconPicker();
		}
	}

	private handleViewButtonClick(): void {
		window.open("https://fonts.google.com/icons?icon.set=Material+Icons");
	}

	private handleSelectedItemChange(icon: IconPickerProps.Icon): void {
		this.justClickOnItem = true;
		this.props.onIconClick?.(icon);
		this.triggerOnChange(icon);
		this.hideIconPicker(() => this.inputRef?.focus());
	}

	private handlePreselectedIconChange(preSelectedIcon: IconPickerProps.Icon | undefined): void {
		this.setState((state) => ({
			preSelectedIcon,
			inputValue: preSelectedIcon ? IconPickerUtils.getIconLabel(preSelectedIcon) : state.inputValue
		}));
	}

	private handleClearButtonClick(): void {
		this.dropdownInstance?.resetPreselectedPosition();

		if (this.props.selectedIcon) {
			this.props.onChange?.(undefined);
		}

		// Trick for NVDA
		// setTimeout to make sure the input value will be updated after the other actions done.
		setTimeout(() => this.setState({ inputValue: "", preSelectedIcon: undefined, searchText: "" }));
	}

	private handleDropdownIconClick(): void {
		!this.props.disabled &&
			!this.props.readonly &&
			this.setState({ showIconPicker: !this.state.showIconPicker }, () => {
				if (!this.state.showIconPicker && this.state.preSelectedIcon) {
					this.triggerOnChange(this.state.preSelectedIcon);
				}
			});
	}

	/**
	 * Trick for NVDA
	 * When NVDA on, using arrow keys to navigate in browse mode and the clear button is focused,
	 * this will help the dropdown close.
	 */
	private handleViewListButtonFocus(): void {
		this.setState({ showIconPicker: false });
	}

	private handlePortalVisibilityChange(visible: boolean): void {
		if (!visible) {
			this.hideIconPicker(() => {
				if (hasGotFocus(this.inputRef)) {
					this.inputWrapperRef?.classList.add(`${baseFieldClassName}__input--focus`);
				}
			});
		}
	}

	private shouldEnableSaveSpaceMode(): boolean {
		return !!this.inputWrapperRef && this.inputWrapperRef.clientWidth <= 208;
	}

	private renderViewListButton(): ReactNode {
		const viewListIconButtonTitle = this.context.iconPicker?.viewListMaterialIconsTitle;
		const disabled = this.props.disabled || this.props.readonly;

		return (
			<Tooltip text={viewListIconButtonTitle} disabled={disabled}>
				<Button
					onClick={this.handleViewButtonClick}
					icon={<IconWidget>view_list</IconWidget>}
					disabled={disabled}
					buttonRef={this.getViewListButtonRef}
					onFocus={this.handleViewListButtonFocus}
				/>
			</Tooltip>
		);
	}

	private handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (event.key === Key.Tab) {
			if (!event.shiftKey && hasGotFocus(this.inputRef) && (this.state.inputValue || this.props.selectedIcon)) {
				return;
			}

			// This condition to avoid blink & trigger onChange when SHIFT+TAB from clear button to input
			if (!(event.shiftKey && hasGotFocus(this.clearButtonRef))) {
				if (this.state.preSelectedIcon) {
					this.triggerOnChange(this.state.preSelectedIcon);
				}

				this.hideIconPicker();
			}
		}

		if (event.key === Key.Escape && this.state.showIconPicker) {
			this.setState({ showIconPicker: false });

			if (this.state.preSelectedIcon) {
				this.triggerOnChange(this.state.preSelectedIcon);
			}
		}

		if (hasGotFocus(this.clearButtonRef) && event.key !== Key.Enter && event.key !== Key.Tab) {
			event.preventDefault();

			return;
		}

		if (hasGotFocus(this.viewListButtonRef)) {
			return;
		}

		if (event.key === Key.ArrowUp || event.key === Key.ArrowDown || event.key === Key.Enter) {
			if (event.target === this.clearButtonRef) {
				return;
			}

			event.preventDefault();
			this.justClickOnItem = false;
			this.showIconPicker();
		} else if (isTypeableCharacter(event) || event.key === Key.Backspace || event.key === Key.Delete) {
			this.showIconPicker();
		}

		if (this.state.showIconPicker && !hasGotFocus(this.clearButtonRef)) {
			this.dropdownInstance?.handleForwardedKeyboardEvent(event);
		}
	}

	private handleClickOutside(): void {
		if (this.state.preSelectedIcon) {
			this.triggerOnChange(this.state.preSelectedIcon);
		}
	}

	private triggerOnChange(icon: IconPickerProps.Icon) {
		const { selectedIcon } = this.props;

		if (!selectedIcon || icon.theme !== selectedIcon.theme || icon.label !== selectedIcon.label) {
			this.props.onChange?.(icon);
			this.hideIconPicker();
		}
	}

	private showIconPicker(): void {
		if (this.props.disabled || this.props.readonly || this.state.showIconPicker || this.justClickOnItem) {
			this.justClickOnItem = false;

			return;
		}

		this.setState({ showIconPicker: true });
	}

	private hideIconPicker(callback?: () => void): void {
		this.setState(
			{
				showIconPicker: false,
				inputValue: IconPickerUtils.getIconLabel(this.props.selectedIcon),
				searchText: "",
				preSelectedIcon: undefined
			},
			callback
		);
	}

	componentDidUpdate(prevProps: IconPickerProps): void {
		if (this.inputWrapperRef && this.dropdownRef) {
			const width = this.inputWrapperRef.getBoundingClientRect().width;

			if (this.dropdownRef.getBoundingClientRect().width !== width) {
				this.dropdownRef.style.width = width + "px";
			}
		}

		if (IconPickerUtils.isDifferentIcons(this.props.selectedIcon, prevProps.selectedIcon)) {
			this.setState(() => ({
				inputValue: IconPickerUtils.getIconLabel(this.props.selectedIcon)
			}));
		}
	}

	render(): ReactNode {
		const {
			className,
			hintTemplate,
			id,
			style,
			placeholder,
			prefixes,
			addonAfter,
			suffixes,
			selectedIcon,
			saveSpaceMode: propsSaveSpaceMode,
			textAlignment,
			disabled,
			readonly,
			...rest
		} = this.props;
		const a11yTitles = this.context.iconPicker;
		const { showIconPicker, inputValue, searchText, preSelectedIcon } = this.state;

		const unavailableInput = readonly || disabled;
		const icons = IconPickerUtils.filterIconByName(searchText, selectedIcon);

		const hint =
			hintTemplate &&
			StringUtils.format(hintTemplate, {
				count: selectedIcon ? icons.length + 1 : icons.length,
				total: "999+"
			});

		const saveSpaceMode = propsSaveSpaceMode || this.shouldEnableSaveSpaceMode();
		const dropdownItems = (
			selectedIcon
				? [
						{
							...selectedIcon,
							selected: true,
							className: `${iconPickerBaseClass}__item--selected`,
							dataType: "icon-selected"
						},
						...icons
					]
				: icons
		).map((icon, index) => ({
			...icon,
			title: IconPickerUtils.getIconLabel(icon),
			graphic: <IconWidget iconTheme={icon.theme}>{icon.label}</IconWidget>,
			hideLabel: saveSpaceMode,
			id: icon.id || `${icon.label}-${icon.theme}`,
			value: `${icon.label}-${index}`
		}));

		const previewIcon = (): ReactNode => {
			const icon = preSelectedIcon || selectedIcon;

			return (
				icon && (
					<StyledIconPickerPreviewIcon className={`${iconPickerBaseClass}__preview-icon`} iconTheme={icon.theme}>
						{icon.label}
					</StyledIconPickerPreviewIcon>
				)
			);
		};

		return (
			<StyledIconPickerWrapper
				className={joinClassNames(iconPickerBaseClass, className)}
				id={id}
				style={style}
				onKeyDown={this.handleKeyDown}
				data-role={DataRoles.IconPicker}
				$disabled={disabled}
			>
				<TextLineStateless
					{...rest}
					disabled={disabled}
					readonly={readonly}
					textAlignment={textAlignment}
					showHiddenText
					id={id && `${id}-textline`}
					placeholder={selectedIcon ? undefined : placeholder}
					value={inputValue}
					onChange={this.handleInputValueChange}
					inputWrapperRef={this.getInputWrapperRef}
					inputRef={this.getInputRef}
					labelRef={this.getInputLabelRef}
					helperTextRef={this.getInputHelperTextRef}
					onFocus={this.handleInputFocus}
					onWrapperClick={this.handleInputWrapperClick}
					addonAfter={[this.renderViewListButton(), addonAfter]}
					prefixes={[prefixes, textAlignment !== "right" && previewIcon()]}
					suffixes={[
						textAlignment === "right" && previewIcon(),
						(selectedIcon || inputValue) && !unavailableInput && (
							<Button
								destructive
								icon={<IconWidget>close</IconWidget>}
								onClick={this.handleClearButtonClick}
								buttonRef={this.getClearButtonRef}
								title={a11yTitles && a11yTitles.clearTextButton}
							/>
						),
						suffixes,
						!readonly && <SelectionSuffix disabled={disabled} onClick={this.handleDropdownIconClick} />
					]}
					inputProps={{
						...this.props.inputProps,
						role: unavailableInput ? undefined : "combobox",
						[`aria-haspopup`]: unavailableInput ? "false" : "listbox",
						[`aria-expanded`]: unavailableInput ? undefined : !!showIconPicker,
						[`aria-autocomplete`]: unavailableInput ? undefined : "list",
						[`aria-owns`]: showIconPicker && id ? `${id}--dropdown` : undefined,
						[`aria-activedescendant`]:
							showIconPicker && preSelectedIcon
								? preSelectedIcon.id || `${preSelectedIcon.label}-${preSelectedIcon.theme}`
								: undefined
					}}
				/>
				{showIconPicker && this.inputWrapperRef && (
					<AttachedPortal
						hideOnReferenceElementPositionChange={provider.isDesktop()}
						closeOnClickReferenceElement={false}
						referenceElement={this.inputWrapperRef}
						closeOnOutsideClick={{ exception: [this.inputLabelRef, this.inputHelperTextRef] }}
						onVisibilityChange={this.handlePortalVisibilityChange}
						onClickOutside={this.handleClickOutside}
						orientationList={PORTAL_ORIENTATIONS}
						fixedOrientation
						selfSizing
						focusOnOpen={false}
					>
						<StyledIconPickerDropdown
							id={id ? `${id}--dropdown` : undefined}
							ref={this.getDropdownInstance}
							className={joinClassNames(`${iconPickerBaseClass}__container`, {
								[`${iconPickerBaseClass}__container--small`]: saveSpaceMode
							})}
							$saveSpace={saveSpaceMode}
							items={dropdownItems}
							hint={hint}
							horizontal
							wrapperRef={this.getDropdownRef}
							onSelectedItemChange={this.handleSelectedItemChange}
							onPreselectedItemChange={this.handlePreselectedIconChange}
						/>
					</AttachedPortal>
				)}
			</StyledIconPickerWrapper>
		);
	}
}

IconPicker.contextType = A11YLanguageContext;
