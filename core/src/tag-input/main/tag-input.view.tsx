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
	ContextType,
	RefObject,
	MutableRefObject,
	KeyboardEvent,
	ChangeEvent,
	MouseEvent,
	FocusEvent,
	TouchEvent,
	ReactNode
} from "react";
import { createRef, Children, Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Key } from "ts-key-enum";

import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import { Button } from "../../button/main/button.view.js";
import { ButtonGroup } from "../../button-group/main/button-group.view.js";
import {
	addPrefix,
	bindMethods,
	getHorizontalMargin,
	getHorizontalPadding,
	getParentElement,
	joinClassNames
} from "../../common/main/utils.js";
import { getDesktopOperatingSystem, provider } from "../../common/main/device-detector.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { ContentBoxElements } from "../../contentbox/main/template/contentbox.tpl.view.js";
import type { DropDownItem } from "../../dropdown/main/template/dropdown.tpl.api.js";
import { DropDown } from "../../dropdown/main/template/dropdown.tpl.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { InputElements } from "../../input/base/template/base.tpl.view.js";
import { ModalOverlay } from "../../modal-overlay/main/modal-overlay.view.js";
import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { ConnectedToast } from "../../toast/main/connected-toast/connected-toast.view.js";
import { WidgetsResizeDetector } from "../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";

import type { TagInternalProps } from "./tag-input.internal.js";
import {
	createDataTag,
	createDataTags,
	filterTags,
	filterUsedTags,
	getCreationKey,
	getFocusedTag,
	unFocusAllTags
} from "./tag-input.internal.js";
import type { TagInputProps } from "./tag-input.api.js";
import {
	StyledTagInputActionContentBox,
	StyledTagInputFieldAddon,
	StyledTagInputFieldWrapper,
	StyledTagInputGroupWrapper,
	StyledTagInputHiddenSpan,
	StyledTagInputTag,
	StyledTagInputTagGroup,
	StyledTagInputTouch,
	StyledTextAreaStateless
} from "./tag-input.styled.js";

const BASE_TAG_CLASS = addPrefix("tag");
const BASE_TAG_INPUT_CLASS = addPrefix("tag-input");
const BASE_FIELD_CLASS = addPrefix("field");

export interface TagInputState {
	tags: TagInternalProps[];
	value: string;
	inputText: string;
	selectedItem?: DropDownItem;
	isDisplayDropDownTags: boolean;
	focus?: boolean;
	duplicateTag?: boolean;
	isTyped?: boolean;
	isPreselectedItem?: boolean;
}

export class TagInput extends Component<TagInputProps, TagInputState> {
	static defaultProps = { keys: [","], fitToParent: true };
	static displayName = "TagInput";
	declare context: ContextType<typeof A11YLanguageContext>;

	private addedTags: TagInternalProps[] = [];
	private removedTags: TagInternalProps[] = [];
	private tagsBeforeOpenModal: TagInternalProps[] = [];

	private dropdownListRef: DropDown | null = null;
	private dropdownWrapperRef: HTMLDivElement | null = null;
	private addonBeforeRefs: Record<string, HTMLElement | null> = {};
	private addonAfterRefs: Record<string, HTMLElement | null> = {};
	private wrapperRef: HTMLElement | null = null;
	private tagGroupRef: RefObject<HTMLDivElement | null> = createRef();
	private inputRef: HTMLTextAreaElement | null = null;
	private fieldRef: HTMLElement | null = null;
	private dummyRef: HTMLElement | null = null;
	private helperTextRef: HTMLElement | null = null;
	private labelRef: HTMLElement | null = null;
	private errorRef: HTMLElement | null = null;
	private warningRef: HTMLElement | null = null;
	private infoRef: HTMLElement | null = null;
	private contentboxRef: HTMLElement | null = null;
	private connectedToastRef: MutableRefObject<HTMLElement | null> = createRef();

	private previousInputWidth = 0;
	private inputInitHeight = 0;
	private alreadyInNewLine = false;
	private noEffect = false;
	private tagHover = false;
	private hasTouch = provider.hasTouch() && !provider.isDesktop();
	private timeoutHandle: ReturnType<typeof setTimeout> | undefined;

	private updateDropDownPosition: (() => void) | undefined = undefined;

	constructor(props: TagInputProps) {
		super(props);

		const tags = this.props.initialTags ? createDataTags(this.props.initialTags) : [];
		const { items } = this.getDropDownItems(tags);
		this.state = {
			tags,
			value: "",
			inputText: "",
			isDisplayDropDownTags: false,
			selectedItem: items[0],
			duplicateTag: false,
			isTyped: false,
			isPreselectedItem: false
		};

		bindMethods(this);
	}

	private handleDeleteInputValue(event: KeyboardEvent<HTMLDivElement>, key: string): void {
		event.preventDefault();
		const selectedText = this.inputRef?.value.substring(this.inputRef?.selectionStart, this.inputRef?.selectionEnd);
		const isSelectText = !!this.state.inputText && selectedText === this.state.inputText;

		// Support delete all text in text area when selected text and press Backspace or Delete.
		const handleChangeText = (): void =>
			this.state.inputText ? this.handleInputValueChange(event as any) : this.handlePressDelete(key, isSelectText);

		// Allowing to delete previous tags when the text area is empty and pressing Backspace or Delete
		if (isSelectText) {
			return this.setState({ inputText: "", isTyped: false }, () => handleChangeText());
		}

		handleChangeText();
	}

	private handleTagGroupKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
		if (this.props.readonly || this.props.disabled) {
			return;
		}

		const key = event.key;

		if (!this.state.value.trim()) {
			switch (key) {
				case Key.Backspace:
				case Key.Delete:
					this.handleDeleteInputValue(event, key);
					break;
				case Key.ArrowRight:
				case Key.ArrowLeft:
					this.handlePressArrowKeys(key);
					break;
				case Key.Tab:
					break;
				default:
					this.setState((prevState) => ({
						tags: unFocusAllTags(prevState.tags),
						isDisplayDropDownTags: event.key !== Key.Escape
					}));
					this.focusTextArea();
			}
		}
	}

	private handlePressDelete(key: string, keepFocusInput = false): void {
		if (this.state.inputText) {
			this.setState({ value: this.state.inputText });
		}

		const tags = [...this.state.tags];
		const focusedTag = getFocusedTag(tags);

		if (focusedTag) {
			this.removeTag(focusedTag.id);
		} else if (tags.length > 0 && key === Key.Backspace && !keepFocusInput) {
			this.blurTextArea();
			tags[tags.length - 1].isFocus = true;
			this.setState({ tags });
		}
	}

	private handlePressArrowKeys(key: string): void {
		const tags = [...this.state.tags];
		const focusedTag = getFocusedTag(tags);

		switch (key) {
			case Key.ArrowLeft:
				if (focusedTag) {
					const focusedTagIndex = tags.indexOf(focusedTag);

					if (focusedTagIndex > 0) {
						tags[focusedTagIndex - 1].isFocus = true;
					}

					tags[focusedTagIndex].isFocus = false;
					this.setState({ tags });
				} else if (tags.length > 0) {
					this.blurTextArea();
					tags[tags.length - 1].isFocus = true;
					this.setState({ tags });
				}

				break;
			case Key.ArrowRight:
				if (focusedTag) {
					const focusedTagIndex = tags.indexOf(focusedTag);

					if (focusedTagIndex < tags.length - 1) {
						tags[focusedTagIndex + 1].isFocus = true;
					}

					if (focusedTagIndex === tags.length - 1) {
						this.focusTextArea();
					}

					tags[focusedTagIndex].isFocus = false;
					this.setState({ tags });
				}

				break;
			default:
				return;
		}
	}

	private handleInputValueChange(event: ChangeEvent<HTMLTextAreaElement>): void {
		const { value } = event.target;
		const creationKey = getCreationKey(this.props.keys as string[], value);

		// Prevent creating duplicated tags on Android
		if (provider.isPhone() && creationKey && this.isDuplicateTag(value.replace(creationKey, ""))) {
			this.setState({ duplicateTag: true, isDisplayDropDownTags: this.hasTouch });

			return;
		}

		if (this.state.value.trim() === value.trim() && !creationKey) {
			this.setState({ value, duplicateTag: false }, () => {
				// Reset selectedItem state after removing all empty spaces
				const { items } = this.getDropDownItems();
				const selectedItem = items.every((item) => !!item.disabled) ? undefined : items[0];
				this.setState({ selectedItem: value === "" ? selectedItem : undefined });
			});

			return;
		}

		const valueChangeCallback = (): void => {
			const { items } = this.getDropDownItems();
			const selectedItem = items.every((item) => !!item.disabled) ? undefined : items[0];
			this.setState((state) => ({
				selectedItem,
				isDisplayDropDownTags:
					!this.hasTouch && items.length > 0 && value.trim() !== "" && !creationKey ? true : state.isDisplayDropDownTags
			}));
		};

		this.setState({ value, isTyped: true }, () => {
			valueChangeCallback();
		});
		this.dropdownListRef?.resetPreselectedPosition();
		this.addTag(value);
	}

	private handleMouseDownOnTag(id: string, event: MouseEvent<HTMLElement>): void {
		event.preventDefault();
		let tags = [...this.state.tags];
		const currentTag = tags.filter((tag) => tag.id === id)[0];

		if (currentTag && !currentTag.isFocus) {
			tags = unFocusAllTags(tags);
			const indexOfTag = tags.indexOf(currentTag);
			tags[indexOfTag].isFocus = true;
			this.tagGroupRef.current?.focus();

			if (this.state.isDisplayDropDownTags && this.hasTouch) {
				this.tagsBeforeOpenModal = this.tagsBeforeOpenModal.map((tag) => ({ ...tag, isFocus: tag.id === id }));
			}

			this.setState({ tags, isDisplayDropDownTags: this.state.isDisplayDropDownTags && this.hasTouch, focus: false });
		}
	}

	private handleDropdownSelectedItemChange(item: DropDownItem): void {
		if (!item.disabled) {
			this.addTag(item.label, false, true, () => {
				this.setState({ isDisplayDropDownTags: this.hasTouch, selectedItem: undefined });
			});
		}
	}

	private handleDropdownPreSelectedItemChange(preItem: DropDownItem): void {
		this.setState({
			selectedItem: preItem,
			inputText: preItem?.label ?? "",
			isPreselectedItem: !this.state.isTyped
		});
	}

	private showTagList(): void {
		if (this.props.readonly || this.props.disabled || this.state.isDisplayDropDownTags || this.state.duplicateTag) {
			return;
		}

		this.tagsBeforeOpenModal = this.state.tags;

		const { items } = this.getDropDownItems();

		this.setState(
			{
				isDisplayDropDownTags: true,
				selectedItem: items.every((item) => item.disabled) ? undefined : items[0],
				isTyped: false
			},
			() => {
				if (!this.hasTouch || !this.contentboxRef) {
					return;
				}

				this.inputRef = this.contentboxRef.getElementsByTagName("textarea")[0];
				this.tagGroupRef.current = this.contentboxRef.querySelector(`[data-role="${DataRoles.TagGroup}"]`);
				this.fieldRef = this.tagGroupRef.current?.querySelector(`[data-role="${DataRoles.Textarea}"]`) as HTMLElement;
				this.setState({ focus: true });
			}
		);
	}

	private handleInputBlur(event: FocusEvent<HTMLTextAreaElement>): void {
		const value = this.state.inputText ? this.state.inputText.trim() : this.state.value.trim();

		// On Android phones with TalkBack enabled, this blur event is triggered when swiping forward to a dropdown item and double-tapping to select it.
		// Therefore, the `relatedTarget` should not be the dropdown to ensure that the option selected is visible in focus tracking instead of creating a new tag.
		// On iOS, this blur event is triggered when tapping the "done" button on the virtual keyboard. Consequently, the `relatedTarget` should not be contained in the body either.
		if (
			provider.get() !== "desktop" &&
			(!document.body.contains(event.relatedTarget) || this.dropdownWrapperRef?.contains(event.relatedTarget))
		) {
			return;
		}

		if (!this.isDuplicateTag(value)) {
			if (!value) {
				this.setState({ value: "" });
			} else {
				this.setState(
					(prev) => ({ isDisplayDropDownTags: this.hasTouch ? prev.isDisplayDropDownTags : false, value: "" }),
					() => {
						this.addTag(value, false, false);
					}
				);
			}
		} else {
			this.setState({
				focus: false,
				duplicateTag: this.isDuplicateTag(value)
			});
		}
	}

	private handleBlurWrapper(): void {
		this.setState((prevState) => ({ tags: unFocusAllTags(prevState.tags) }));
	}

	private handleTagGroupFocus(): void {
		this.setState({ focus: true, duplicateTag: false });
	}

	private handleTagGroupBlur(): void {
		this.setState({ focus: false });
	}

	private blurTextArea(): void {
		this.inputRef?.blur();
		this.tagGroupRef.current?.focus();
	}

	private handleHoverOrTouchStyle(event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>): void {
		if (!this.tagGroupRef.current) {
			return;
		}

		const target = event.target as HTMLElement;
		const targetIsRemoveButton =
			target.getAttribute("data-role") === `${DataRoles.Button}` ||
			!!getParentElement(target, (p) => p.getAttribute("data-role") === `${DataRoles.Button}`);
		const targetIsTag =
			target.getAttribute("data-role") === `${DataRoles.Tag}` ||
			!!getParentElement(target, (p) => p.getAttribute("data-role") === `${DataRoles.Tag}`);

		this.noEffect = targetIsTag;
		this.tagHover = targetIsTag && !targetIsRemoveButton;

		if (!this.hasTouch) {
			this.setState({ focus: document.activeElement === this.inputRef && !this.noEffect });
		}
	}

	private removeEffectedStyle(): void {
		this.noEffect = false;
		this.tagHover = false;
	}

	private focusTextArea(): void {
		this.inputRef?.focus();
	}

	private isDuplicateTag(value: string): boolean {
		const formatValue = value.trim().toLowerCase();

		return this.state.tags.some((tag) => tag.text.toLowerCase() === formatValue);
	}

	private addTag(value: string, useCreationKey = true, shouldFocusTextArea = true, callback?: () => void): void {
		let addedTagValue: string | null = value.trim();

		if (useCreationKey) {
			const creationKey = getCreationKey(this.props.keys as string[], value);
			addedTagValue = creationKey && addedTagValue ? addedTagValue.replace(creationKey, "") : null;
		}

		if (addedTagValue && !this.isDuplicateTag(addedTagValue)) {
			const addedTag = createDataTag(addedTagValue, false);

			if (this.hasTouch) {
				this.addedTags.push(addedTag);
			}

			this.setState(
				(prevState) => ({ tags: [...prevState.tags, addedTag], value: "", inputText: "" }),
				() => {
					this.repositionTextArea();

					if (this.props.onAddedTag && !this.hasTouch) {
						this.props.onAddedTag([addedTag.text]);
					}

					if (shouldFocusTextArea) {
						this.focusTextArea();
					}

					callback?.();
				}
			);
		} else if (!addedTagValue && !value.trim().length) {
			this.setState({ value: "", inputText: "" });
		}
	}

	private removeTag(id: string): void {
		const tags = [...this.state.tags];
		let removedTag: TagInternalProps;

		for (let i = 0; i < tags.length; i++) {
			if (tags[i].id === id) {
				removedTag = tags[i];
				tags.splice(i, 1);
				break;
			}
		}

		const isDisplayDropDownTags = this.state.isDisplayDropDownTags;

		if (!this.hasTouch) {
			this.focusTextArea();

			if (!isDisplayDropDownTags) {
				this.setState({ isDisplayDropDownTags: false });
			}
		}

		this.setState({ tags }, () => {
			if (this.props.onRemoveTag && (!this.hasTouch || (this.hasTouch && !this.state.isDisplayDropDownTags))) {
				this.props.onRemoveTag(removedTag.text);
			}

			if (this.hasTouch) {
				this.removedTags.push(removedTag);
			}

			this.setState({
				duplicateTag: this.isDuplicateTag(this.state.value.trim())
			});
		});
	}

	private repositionTextArea(): void {
		if (this.inputRef && this.dummyRef && this.wrapperRef) {
			this.updateDummyText(this.inputRef.value);

			if (!this.hasCreationKeyInInput() && this.inputRef.value) {
				const inputWidth = Math.floor(this.inputRef.getBoundingClientRect().width);
				const actualTextWidth = Math.floor(
					this.dummyRef.getBoundingClientRect().width + (getHorizontalPadding(this.inputRef) ?? 0)
				);

				if (this.hasEnterKeyInInput()) {
					if (!this.alreadyInNewLine) {
						this.jumpToNewLine();
					}
				} else {
					if (this.alreadyInNewLine) {
						if (actualTextWidth < this.previousInputWidth) {
							this.jumpToPreviousLine();
						}
					} else {
						if (actualTextWidth >= inputWidth) {
							this.jumpToNewLine(actualTextWidth);
						}
					}
				}
			} else {
				this.setWidthForInput(null);
				this.recalculatePreviousInputWidth();
			}
		}
	}

	private renderCreatedTags(): ReactNode {
		const { disabled, readonly } = this.props;

		return this.state.tags.map((tag, index) => {
			const { isFocus, id, text } = tag;

			return (
				<StyledTagInputTag
					key={index}
					id={id}
					removable={!readonly && !disabled}
					className={joinClassNames(
						{ [`${BASE_TAG_CLASS}--focus`]: isFocus && !disabled && !readonly },
						{ [`${BASE_TAG_CLASS}--readonly`]: readonly },
						{ [`${BASE_TAG_CLASS}--disabled`]: disabled }
					)}
					tabIndex={provider.isDesktop() ? -1 : undefined} // prevent Talkback from reading the text twice.
					onRemove={(): void => this.removeTag(id)}
					onMouseDown={this.handleMouseDownOnTag}
					disabledRemoveButton={disabled}
					$focus={isFocus && !disabled && !readonly}
					$readonly={readonly}
					$disabled={disabled}
					$hover={this.tagHover}
				>
					{text}
				</StyledTagInputTag>
			);
		});
	}

	private getDropDownItems(initTags?: TagInternalProps[]): { items: DropDownItem[]; hint: string } {
		let tags = initTags;
		let value = "";

		if (this.state) {
			tags = this.state.tags;
			value = this.state.value.trim();
		}

		let passedTags: string[] = [];
		let hint = "";
		let type = "";

		if (!value && this.props.popularTags) {
			passedTags = [...this.props.popularTags];
			hint = this.props.popularLabel || hint;
			type = "popular";
		} else if (value && this.props.suggestionTags) {
			passedTags = filterTags(this.props.suggestionTags, value);
			hint = this.props.suggestionLabel || hint;
			type = "suggestion";
		}

		return {
			items: filterUsedTags(passedTags.sort(this.props.comparator), tags ?? [], type, !this.props.comparator),
			hint
		};
	}

	private getActiveItem(last = false): DropDownItem | undefined {
		const { items } = this.getDropDownItems();
		const activeItems = items.filter((i) => !i.disabled);

		return activeItems.length > 0 ? (last ? activeItems[activeItems.length - 1] : activeItems[0]) : undefined;
	}

	private handleTextAreaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
		if (this.props.readonly || this.props.disabled) {
			return;
		}

		event.persist();
		const { isDisplayDropDownTags } = this.state;

		if (
			this.isDuplicateTag(this.state.value) &&
			!this.state.selectedItem &&
			(event.key === Key.Tab || event.key === Key.Enter || (this.props.keys && this.props.keys.indexOf(event.key) > 0))
		) {
			event.preventDefault();
			this.setState({ duplicateTag: true, isDisplayDropDownTags: this.hasTouch });

			return;
		}

		if (
			!isDisplayDropDownTags &&
			(event.key === Key.ArrowUp || event.key === Key.ArrowDown || event.key === Key.Enter)
		) {
			const activeItem = this.getActiveItem(event.key === Key.ArrowUp);
			this.setState({
				isDisplayDropDownTags: true,
				selectedItem: activeItem
			});

			return;
		}

		if (
			event.key === Key.Escape ||
			event.key === Key.Tab ||
			((event.key === Key.Backspace ||
				event.key === Key.Delete ||
				event.key === Key.ArrowRight ||
				event.key === Key.ArrowLeft) &&
				this.state.value.length === 0)
		) {
			if (event.key === Key.Escape && isDisplayDropDownTags) {
				event.stopPropagation();
			}

			this.setState((prev) => ({
				isDisplayDropDownTags: !this.hasTouch || event.key === Key.Escape ? false : prev.isDisplayDropDownTags,
				selectedItem: undefined
			}));

			if (event.key === Key.Tab && !this.hasTouch) {
				if (this.state.inputText) {
					this.addTag(this.state.inputText.trim(), false);
				} else {
					this.addTag(this.state.value.trim(), false);
				}
			}

			return;
		}

		if (
			(event.key === Key.Backspace ||
				event.key === Key.Delete ||
				event.key === Key.ArrowRight ||
				event.key === Key.ArrowLeft) &&
			this.state.value.trim() === ""
		) {
			event.stopPropagation();

			return;
		}

		if (isDisplayDropDownTags) {
			this.dropdownListRef?.handleForwardedKeyboardEvent(event);
		}
	}

	private getUpdateElementPositionHandler(handler: () => void): void {
		this.updateDropDownPosition = handler;
	}

	private handlePortalVisibilityChange(isDisplayDropDownTags: boolean): void {
		this.setState({ isDisplayDropDownTags });
	}

	private closeModal(): void {
		this.setState(
			{ isDisplayDropDownTags: false, tags: this.tagsBeforeOpenModal, value: "", duplicateTag: false },
			() => {
				if (this.hasTouch && this.wrapperRef) {
					this.tagGroupRef.current = this.wrapperRef.querySelector(
						`[data-role="${DataRoles.TagGroup}"]`
					) as HTMLDivElement;
					this.tagGroupRef.current?.focus();
				}

				this.addedTags = [];
				this.removedTags = [];
			}
		);
	}

	private handleModalClose(): void {
		this.props.mobileModalProps?.onModalClose?.();
		this.closeModal();
	}

	private handleModalSaveButtonClick(): void {
		if (this.isDuplicateTag(this.state.value)) {
			this.setState({ duplicateTag: true });

			return;
		}

		this.tagsBeforeOpenModal = this.state.tags;
		const value = this.state.value.trim();

		if (value) {
			this.addTag(value, false, false);
			const newTag = this.addedTags[this.addedTags.length - 1];
			this.tagsBeforeOpenModal.push(newTag);
		}

		const realAddedTags = this.addedTags.filter((t) => !this.removedTags.includes(t)).map((t) => t.text);
		const realRemovedTags = this.removedTags.filter((t) => !this.addedTags.includes(t)).map((t) => t.text);

		this.props.mobileModalProps?.onSave?.(realAddedTags, realRemovedTags);

		this.closeModal();
	}

	private handleDropdownItemMouseDown(): void {
		this.focusTextArea();
	}

	private handleDropdownWrapperMouseDown(event: MouseEvent<HTMLElement>): void {
		// To prevent the input from blurring and to avoid creating a new tag when clicking the disabled dropdown item.
		event.preventDefault();
		event.stopPropagation();
	}

	private getDropdownListRef(instance: DropDown): void {
		this.dropdownListRef = instance;
	}

	private getDropdownWrapperRef(instance: HTMLDivElement | null): void {
		this.dropdownWrapperRef = instance;
	}

	private renderDropDownTags(ariaLabelledby?: string): ReactNode {
		if (!this.props.suggestionTags && !this.props.popularTags) {
			return null;
		}

		const { selectedItem, value } = this.state;
		const { items, hint } = this.getDropDownItems();
		const dropDownWidth = this.tagGroupRef.current?.getBoundingClientRect().width;

		const isMac = getDesktopOperatingSystem() === "Mac";

		const dropdown = items.length > 0 && (
			<DropDown
				ref={this.getDropdownListRef}
				wrapperRef={this.getDropdownWrapperRef}
				onSelectedItemChange={this.handleDropdownSelectedItemChange}
				onPreselectedItemChange={this.handleDropdownPreSelectedItemChange}
				style={{ width: dropDownWidth }}
				hint={hint}
				selectedItem={selectedItem}
				items={items}
				id={this.props.id ? `${this.props.id}-${value.trim() ? "suggestion" : "popular"}-dropdown` : undefined}
				ariaLabelledby={ariaLabelledby}
				onMouseDown={this.handleDropdownItemMouseDown}
				onWrapperMouseDown={this.handleDropdownWrapperMouseDown}
				hideA11yLabel={isMac && this.state.isTyped}
			/>
		);

		if (this.hasTouch) {
			return dropdown;
		}

		return (
			this.tagGroupRef.current &&
			items.length > 0 && (
				<AttachedPortal
					referenceElement={this.tagGroupRef.current}
					selfSizing
					fixedOrientation
					orientationList={["bottom-start", "top-start"]}
					updateElementPosition={this.getUpdateElementPositionHandler}
					onVisibilityChange={this.handlePortalVisibilityChange}
					hideOnReferenceElementPositionChange
					closeOnClickReferenceElement={false}
					closeOnOutsideClick={{ exception: [this.labelRef, this.helperTextRef] }}
					focusOnOpen={false}
				>
					{dropdown}
				</AttachedPortal>
			)
		);
	}

	private recalculatePreviousInputWidth(): void {
		if (this.fieldRef && this.tagGroupRef.current) {
			const inputWidth = this.fieldRef.getBoundingClientRect().width;
			const fieldExtraSpace =
				(getHorizontalPadding(this.tagGroupRef.current) ?? 0) + (getHorizontalMargin(this.fieldRef) ?? 0);
			const wrapperWithoutExtraSpace = this.tagGroupRef.current.getBoundingClientRect().width - fieldExtraSpace;
			this.previousInputWidth = inputWidth < wrapperWithoutExtraSpace ? inputWidth : this.previousInputWidth;
			this.alreadyInNewLine = inputWidth >= wrapperWithoutExtraSpace;
		}
	}

	private updateDummyText(value: string): void {
		if (this.dummyRef) {
			this.dummyRef.textContent = value.replace(/ /g, " ");
		}
	}

	private jumpToPreviousLine(): void {
		if (this.inputRef) {
			this.setWidthForInput(this.previousInputWidth);
			this.alreadyInNewLine = false;
		}
	}

	private jumpToNewLine(actualTextWidth?: number): void {
		if (this.fieldRef && this.tagGroupRef.current) {
			this.previousInputWidth = this.fieldRef.getBoundingClientRect().width;
			const fieldExtraSpace =
				(getHorizontalPadding(this.tagGroupRef.current) ?? 0) + (getHorizontalMargin(this.fieldRef) ?? 0);
			const wrapperWithoutExtraSpace = this.tagGroupRef.current.getBoundingClientRect().width - fieldExtraSpace;
			this.resetInitHeightForInput(wrapperWithoutExtraSpace, actualTextWidth);
			this.setWidthForInput(wrapperWithoutExtraSpace);
			this.alreadyInNewLine = true;
		}
	}

	private setWidthForInput(width: number | null): void {
		if (this.inputRef) {
			const inputPadding = getHorizontalPadding(this.inputRef) ?? 0;
			const fieldWidth = width ? "min-width: " + (width - inputPadding) + "px" : "";
			this.fieldRef?.setAttribute("style", fieldWidth);
		}
	}

	private resetInitHeightForInput(wrapperWithoutExtraSpace: number, actualTextWidth?: number): void {
		if (actualTextWidth && actualTextWidth < wrapperWithoutExtraSpace && this.inputRef) {
			this.inputRef.style.height = this.inputInitHeight + "px";
		}
	}

	private hasCreationKeyInInput(): boolean {
		return (
			!!this.inputRef && !!this.inputRef.value && !!getCreationKey(this.props.keys as string[], this.inputRef.value)
		);
	}

	private hasEnterKeyInInput(): boolean {
		return !!this.inputRef && !!this.inputRef.value && this.inputRef.value.indexOf("\n") > -1;
	}

	private handleConnectedToastClose(): void {
		this.setState({ duplicateTag: false }, () => {
			if (document.activeElement === this.inputRef) {
				this.setState({ focus: true });
			}
		});
	}

	private getConnectedToastRef(ref: HTMLElement | null): void {
		this.connectedToastRef.current = ref;
	}

	private getContentboxRef(ref: HTMLElement | null): void {
		this.contentboxRef = ref;
	}

	private getWrapperRef(ref: HTMLElement | null): void {
		this.wrapperRef = ref;
	}

	private getTagGroupRef(ref: HTMLDivElement | null): void {
		this.tagGroupRef.current = ref;
	}

	private getInputRef(ref: HTMLTextAreaElement | null): void {
		this.inputRef = ref;
	}

	private getLabelRef(ref: HTMLElement | null): void {
		this.labelRef = ref;
	}

	private getErrorRef(ref: HTMLElement | null): void {
		this.errorRef = ref;
	}

	private getWarningRef(ref: HTMLElement | null): void {
		this.warningRef = ref;
	}

	private getInfoRef(ref: HTMLElement | null): void {
		this.infoRef = ref;
	}

	private getHelperTextRef(ref: HTMLElement | null): void {
		this.helperTextRef = ref;
	}

	private setInputElementsWidth(): void {
		if (this.tagGroupRef.current) {
			const tagGroupWidth = `${this.tagGroupRef.current.getBoundingClientRect().width}px`;

			if (this.labelRef) {
				// Using `maxWidth` instead of `width` ensures that the label will not take unnecessary space while maintaining consistent alignment with other refs.
				this.labelRef.style.maxWidth = tagGroupWidth;
			}

			if (this.errorRef) {
				this.errorRef.style.width = tagGroupWidth;
			}

			if (this.warningRef) {
				this.warningRef.style.width = tagGroupWidth;
			}

			if (this.infoRef) {
				this.infoRef.style.width = tagGroupWidth;
			}

			if (this.helperTextRef) {
				this.helperTextRef.style.width = tagGroupWidth;
			}
		}
	}

	private getInputValueToDisplay(): string {
		const { value, inputText } = this.state;

		let inputValue = value;

		if (inputText && !this.hasTouch) {
			inputValue = inputText;
		}

		return inputValue;
	}

	componentDidMount(): void {
		if (this.wrapperRef && this.inputRef && this.tagGroupRef.current) {
			this.fieldRef = this.tagGroupRef.current?.querySelector(`[data-role="${DataRoles.Textarea}"]`) as HTMLElement;
			this.inputInitHeight = this.inputRef.getBoundingClientRect().height;
		}

		this.setInputElementsWidth();
	}

	componentDidUpdate(): void {
		this.repositionTextArea();

		if (this.updateDropDownPosition) {
			this.updateDropDownPosition();
		}
	}

	componentWillUnmount(): void {
		if (this.timeoutHandle !== undefined) {
			clearTimeout(this.timeoutHandle);
			this.timeoutHandle = undefined;
		}
	}

	render(): ReactNode {
		const {
			label,
			placeholder,
			className,
			id,
			style,
			autoFocus,
			helperText,
			hideLabel,
			tooltips,
			errorMessage,
			warningMessage,
			infoMessage,
			disabled,
			readonly,
			warning,
			error,
			info,
			ariaDescribedby,
			ariaLabelledby,
			inputProps,
			mobileModalProps,
			labelGraphic,
			openOnFocus = true
		} = this.props;
		const { tagInputTitles } = this.context;
		const { tags, value, isDisplayDropDownTags, selectedItem } = this.state;

		const classNames = joinClassNames(
			`${BASE_TAG_INPUT_CLASS}`,
			{ [`${BASE_TAG_INPUT_CLASS}--readonly`]: readonly },
			{ [`${BASE_TAG_INPUT_CLASS}--disabled`]: disabled },
			{ [`${BASE_TAG_INPUT_CLASS}--warning`]: warning || warningMessage },
			{ [`${BASE_TAG_INPUT_CLASS}--error`]: error || errorMessage },
			`${BASE_FIELD_CLASS}-wrapper`,
			`${BASE_FIELD_CLASS}-wrapper--block`,
			className
		);
		const textAreaId = id ? `${id}-textarea` : undefined;
		const unavailableInput = readonly || disabled;

		const renderAddonBefore = (): ReactNode => {
			const addons = Children.toArray(this.props.addonBefore).filter(Boolean);

			return (
				addons.length > 0 &&
				addons.map((addon, index) => (
					<StyledTagInputFieldAddon
						$position="before"
						className={`${BASE_FIELD_CLASS}-addon ${BASE_FIELD_CLASS}-addon--before`}
						key={`tag-input--addon-before-${index}`}
						data-role={`tag-input--addon-before-${index}`}
						ref={(ref): void => {
							this.addonBeforeRefs[index] = ref;
						}}
					>
						{addon}
					</StyledTagInputFieldAddon>
				))
			);
		};

		const renderAddonAfter = (): ReactNode => {
			const addons = Children.toArray(this.props.addonAfter).filter(Boolean);

			return (
				addons.length > 0 &&
				addons.map((addon, index) => (
					<StyledTagInputFieldAddon
						$position="after"
						className={`${BASE_FIELD_CLASS}-addon ${BASE_FIELD_CLASS}-addon--after`}
						key={`tag-input--addon-after-${index}`}
						data-role={`tag-input--addon-after-${index}`}
						ref={(ref): void => {
							this.addonAfterRefs[index] = ref;
						}}
					>
						{addon}
					</StyledTagInputFieldAddon>
				))
			);
		};

		const tagInputContent = (props: { key: string; idSuffix?: string }): ReactNode => (
			<>
				<StyledBaseInput.StyledFieldMain className={`${BASE_FIELD_CLASS}__main`} key={props.key}>
					<StyledBaseInput.StyledField className={BASE_FIELD_CLASS}>
						{(!this.hasTouch || !isDisplayDropDownTags) && (
							<InputElements.Label
								id={id}
								label={label || tagInputTitles?.hiddenLabel}
								hide={hideLabel || !label}
								disabled={disabled}
								dataRole={DataRoles.TagInput.Label}
								htmlFor={`${textAreaId}${props.idSuffix ?? ""}`}
								wrapperRef={this.getLabelRef}
								graphic={labelGraphic}
							/>
						)}
						{tooltips}
						{errorMessage && (
							<InputElements.Error
								id={id}
								className={`${BASE_FIELD_CLASS}__message`}
								errorMessage={errorMessage}
								dataRole={DataRoles.TagInput.ErrorMessage}
								wrapperRef={this.getErrorRef}
							/>
						)}
						{warningMessage && (
							<InputElements.Warning
								id={id}
								className={`${BASE_FIELD_CLASS}__message`}
								warningMessage={warningMessage}
								dataRole={DataRoles.TagInput.WarningMessage}
								wrapperRef={this.getWarningRef}
							/>
						)}
						{infoMessage && (
							<InputElements.Info
								id={id}
								infoMessage={infoMessage}
								dataRole={DataRoles.TagInput.InfoMessage}
								wrapperRef={this.getInfoRef}
							/>
						)}
						<StyledTagInputGroupWrapper
							className={`${BASE_TAG_INPUT_CLASS}__group-wrapper`}
							data-role={DataRoles.TagInput.Group}
						>
							{renderAddonBefore()}
							<WidgetsResizeDetector
								handleHeight={false}
								onResize={this.setInputElementsWidth}
								targetRef={this.tagGroupRef}
							>
								<StyledTagInputTagGroup
									wrapperRef={this.getTagGroupRef}
									onKeyDown={this.handleTagGroupKeyDown}
									onFocus={this.handleTagGroupFocus}
									onClick={this.focusTextArea}
									onBlur={this.handleTagGroupBlur}
									onMouseOver={this.handleHoverOrTouchStyle}
									onMouseLeave={this.removeEffectedStyle}
									onTouchStart={this.handleHoverOrTouchStyle}
									tabIndex={-1}
									$disabled={disabled}
									$readonly={readonly}
									$error={!!(error || errorMessage)}
									$warning={!!(warning || warningMessage)}
									$info={!!(info || infoMessage)}
									$focus={this.state.focus}
									$noEffect={this.noEffect}
								>
									{tags && this.renderCreatedTags()}
									<StyledTextAreaStateless
										id={`${textAreaId}${props.idSuffix ?? ""}`}
										key={`${props.key}-textarea`}
										inputRef={this.getInputRef}
										value={this.getInputValueToDisplay()}
										placeholder={tags.length > 0 ? "" : placeholder}
										onChange={this.handleInputValueChange}
										onFocus={openOnFocus ? this.showTagList : undefined}
										onKeyDown={this.handleTextAreaKeyDown}
										readonly={readonly}
										disabled={disabled}
										autoFocus={autoFocus ?? (this.hasTouch && isDisplayDropDownTags)}
										autoExpand
										showHiddenText
										inputProps={inputProps}
										role={unavailableInput ? undefined : "combobox"}
										wrapperRole="listitem"
										ariaExpanded={unavailableInput ? undefined : isDisplayDropDownTags}
										ariaHaspopup={unavailableInput ? "false" : "listbox"}
										ariaAutocomplete={unavailableInput ? undefined : "list"}
										ariaActivedescendant={selectedItem?.id}
										ariaOwns={
											provider.get() === "desktop" && this.props.id && !this.state.isPreselectedItem
												? `${this.props.id}-${value.trim() ? "suggestion" : "popular"}-dropdown`
												: undefined
										}
										inputWrapperProps={{ "aria-labelledby": id && `${id}-label` }}
										onClick={this.showTagList}
										onBlur={this.handleInputBlur}
									/>
								</StyledTagInputTagGroup>
							</WidgetsResizeDetector>
							{renderAddonAfter()}
						</StyledTagInputGroupWrapper>
					</StyledBaseInput.StyledField>
				</StyledBaseInput.StyledFieldMain>
				{helperText && (!this.hasTouch || !isDisplayDropDownTags) && (
					<StyledBaseInput.StyledFieldHelperWrapper
						className={`${BASE_FIELD_CLASS}__helper`}
						ref={this.getHelperTextRef}
					>
						<StyledBaseInput.StyledFieldHelperText
							id={`${id}-helper-text`}
							className={`${BASE_FIELD_CLASS}__helper-text`}
							htmlFor={textAreaId}
							data-role={DataRoles.Tag.HelperText}
						>
							{helperText}
						</StyledBaseInput.StyledFieldHelperText>
					</StyledBaseInput.StyledFieldHelperWrapper>
				)}
			</>
		);

		const connectedToast = (
			<TransitionGroup component={null}>
				{this.inputRef && this.state.duplicateTag && (
					<CSSTransition timeout={200} nodeRef={this.connectedToastRef}>
						<ConnectedToast
							referenceElement={this.inputRef}
							message={this.props.duplicatedTagMessage || tagInputTitles?.duplicatedTagMessage}
							variant="error"
							wrapperRef={this.getConnectedToastRef}
							onClose={this.handleConnectedToastClose}
							type="permanent"
							hideOnReferenceElementPositionChange={!this.hasTouch}
						/>
					</CSSTransition>
				)}
			</TransitionGroup>
		);

		return (
			<StyledTagInputFieldWrapper
				id={id}
				style={style}
				tabIndex={-1}
				className={classNames}
				ref={this.getWrapperRef}
				onBlur={this.handleBlurWrapper}
				aria-label={tagInputTitles?.ariaLabel}
				role="region"
				data-role={DataRoles.TagInput}
				$block
			>
				{tagInputContent({ key: "tag-input" })}
				{!this.hasTouch &&
					isDisplayDropDownTags &&
					this.renderDropDownTags(
						joinClassNames(
							{ [`${id}-info`]: id && infoMessage },
							{ [`${id}-warning`]: id && warningMessage },
							{ [`${id}-error`]: id && errorMessage },
							ariaLabelledby,
							ariaDescribedby,
							{
								[`${id}-label`]: id
							},
							{
								[`${id}-helper-text`]: id && helperText
							},
							{
								[`${textAreaId}-label`]: tags.length === 0 && placeholder && textAreaId
							}
						)
					)}
				{this.hasTouch && isDisplayDropDownTags && (
					<ModalOverlay
						closeOnOutsideClick
						fullscreen
						focusOnOpen={false}
						noGutter={provider.isPhone()}
						onClose={this.handleModalClose}
						focusBack={false}
					>
						<StyledTagInputActionContentBox
							className={`${BASE_TAG_INPUT_CLASS}__contentbox`}
							contentRef={this.getContentboxRef}
							headingElements={
								<ContentBoxElements.Title text={!this.props.hideLabel && this.props.label} ariaLevel={1} />
							}
							headingButtons={<ContentBoxElements.CloseButton onClick={this.closeModal} />}
							footer={
								<ContentBoxElements.Footer>
									<ButtonGroup alignment="right">
										<Button
											secondary
											destructive
											icon={mobileModalProps?.buttonsProps?.cancelIcon ?? <Icon>close</Icon>}
											label={mobileModalProps?.buttonsProps?.cancelLabel}
											onClick={this.closeModal}
											title={mobileModalProps?.buttonsProps?.cancelLabel ?? tagInputTitles?.closeButtonTitle}
										/>
										<Button
											primary
											icon={mobileModalProps?.buttonsProps?.saveIcon ?? <Icon>save</Icon>}
											label={mobileModalProps?.buttonsProps?.saveLabel}
											onClick={this.handleModalSaveButtonClick}
											title={mobileModalProps?.buttonsProps?.saveLabel ?? tagInputTitles?.saveButtonTitle}
										/>
									</ButtonGroup>
								</ContentBoxElements.Footer>
							}
						>
							<StyledTagInputTouch className={joinClassNames(classNames, `${BASE_TAG_INPUT_CLASS}--touch`)}>
								{tagInputContent({ key: "tag-input-modal", idSuffix: "-modal" })}
								{isDisplayDropDownTags && this.renderDropDownTags()}
							</StyledTagInputTouch>
						</StyledTagInputActionContentBox>
					</ModalOverlay>
				)}
				<StyledTagInputHiddenSpan
					aria-hidden={true}
					ref={(ref) => {
						this.dummyRef = ref;
					}}
				/>
				{connectedToast}
			</StyledTagInputFieldWrapper>
		);
	}
}

TagInput.contextType = A11YLanguageContext;
