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
	DragEvent,
	MouseEvent,
	KeyboardEvent,
	ChangeEvent,
	ReactNode,
	ReactElement,
	RefObject
} from "react";
import { useContext, createRef, Component, useRef, useCallback } from "react";
import { Key } from "ts-key-enum";

import { provider as DeviceDetector } from "../../common/main/device-detector.js";
import {
	addPrefix,
	bindMethods,
	inputWithSuffixName,
	joinClassNames,
	noop,
	StringUtils
} from "../../common/main/utils.js";
import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { Error, Info, Label, Warning } from "../../input/base/template/base.tpl.view.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { PopupMenuConfigContext } from "../../pop-up-menu/main/popup-menu-context.js";
import type { FileUploadTitles } from "../../common/main/a11y-localization/index.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";

import type { FileUploadProps } from "./file-upload.api.js";
import { StyledFileUpload } from "./file-upload.styled.js";

const baseClassName = addPrefix("field__upload");

interface FileUploadInternalProps {
	width?: string | number;
	loading?: boolean;
	hasLoadingLabel?: boolean;
	cancelable?: boolean;
	noPadding?: boolean;
	hasChild?: boolean;
	placeholder?: boolean;
	textOnlyDisplay?: boolean;
	interactiveFileName?: boolean;
	focusOnUploadArea?: boolean;
	fileNameAfterUploadId?: string;
	hintRenderer?: (() => React.ReactElement | null) | null;
	uploadButtonTitle?: string;
}

export interface FileUploadState {
	isDraggingOver: boolean;
	isActionItemMouseOver: boolean;
}

class FileUploadInternal extends Component<FileUploadProps & FileUploadInternalProps, FileUploadState> {
	static displayName = "FileUploadInternal";
	declare context: ContextType<typeof A11YLanguageContext>;
	private isPhone = DeviceDetector.isPhone();

	private fileInput: HTMLInputElement | null = null;
	private shouldFocus = false;
	private uploadAreaRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>();
	private fileUploadActionRef: RefObject<HTMLDivElement | null> = createRef<HTMLDivElement | null>();

	constructor(props: FileUploadProps) {
		super(props);

		this.state = {
			isDraggingOver: false,
			isActionItemMouseOver: false
		};

		bindMethods(this);
	}

	private isUnavailableFileUpload(): boolean | undefined {
		return this.props.disabled || this.props.readOnly;
	}

	private handleFileUpload(fileList: FileList, isFileDropped: boolean): void {
		if (this.props.onChange) {
			this.props.onChange(fileList, isFileDropped);
		}

		this.shouldFocus = true;
		this.setState({ isDraggingOver: false });
	}

	private handleDragOver(event: DragEvent<HTMLElement>): void {
		// Prevent the browser from trying to open the file
		event.preventDefault();

		this.setState({
			isDraggingOver: true
		});
	}

	private handleDragLeave(): void {
		this.setState({
			isDraggingOver: false
		});
	}

	private handleOnDrop(event: DragEvent<HTMLElement>): void {
		// Prevent the browser from trying to open the file
		event.preventDefault();

		if (!this.props.disabled && !this.props.readOnly) {
			this.handleFileUpload(event.dataTransfer.files, true);
		}
	}

	private handleOnBlur(): void {
		if (this.shouldFocus) {
			this.shouldFocus = false;
		}
	}

	private handleOnClick(event: MouseEvent<HTMLElement>): void {
		event.stopPropagation();

		if (this.props.compact && this.props.disabled) {
			return;
		}

		this.openFileDialog();
	}

	private handleOnClickInReadOnlyMode(event: MouseEvent<HTMLElement>): void {
		event.stopPropagation();
		this.props?.onUploadAreaClick?.();
	}

	private handleOnKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (event.key === Key.Enter) {
			this.openFileDialog();
		}
	}

	private handleOnFileInputChange(event: ChangeEvent<HTMLInputElement>): void {
		if (event.target.files && event.target.files.length > 0) {
			this.handleFileUpload(event.target.files, false);
			event.target.value = "";
		}
	}

	private setActionItemMouseOver(): void {
		this.setState({ isActionItemMouseOver: true });
	}

	private setActionItemMouseLeave(): void {
		this.setState({ isActionItemMouseOver: false });
	}

	private handleFileInputRef(ref: HTMLInputElement): void {
		this.fileInput = ref;

		if (this.props.fileInputRef) {
			this.props.fileInputRef(ref);
		}
	}

	private handleUploadAreaRef(ref: HTMLDivElement): void {
		this.uploadAreaRef.current = ref;
		this.props.uploadAreaRef?.(ref);
	}

	private openFileDialog(): void {
		const allowOpeningFileDialog =
			this.props.onUploadAreaClick?.() !== false || (this.props.compact && !this.props.actionItem);

		if (this.fileInput && allowOpeningFileDialog) {
			this.fileInput.click();
		}

		setTimeout(() => {
			this.setState({ isActionItemMouseOver: false });
		});
	}

	// Prevent click from called twice, since this event will also trigger onClick on the outer div
	private onInputClick(event: MouseEvent<HTMLInputElement>): void {
		event.stopPropagation();
	}

	private focusOnUploadArea(): void {
		this.uploadAreaRef?.current?.focus();
	}

	private handleLabelClick(event: MouseEvent<HTMLElement>): void {
		event.preventDefault();
		this.focusOnUploadArea();
	}

	private renderHiddenTitle(): ReactNode {
		if (this.props.uploadButtonTitle && !this.props.loading && this.props.id) {
			return <HiddenText id={`${this.props.id}-upload-button-title`}>{this.props.uploadButtonTitle}</HiddenText>;
		}

		return undefined;
	}

	private getLinkedTexts = (text?: string): string | undefined =>
		StringUtils.join(
			{
				[`${this.props.id}-label`]: this.props.id && this.props.label
			},
			text,
			{
				[`${this.props.id}-helper-text`]: this.props.id && this.props.helperText
			},
			{
				[`${this.props.id}-upload-button-title`]: this.renderHiddenTitle() && !this.props.compact
			}
		);

	private renderedFileUpload(): ReactNode {
		const uploadContentOverClassNames = joinClassNames(`${baseClassName}-content`, {
			[`${baseClassName}-content--isOver`]: this.state.isActionItemMouseOver && this.props.loading
		});
		const wrapperClassNames = joinClassNames(
			baseClassName,
			{ [`${baseClassName}--readonly`]: this.props.readOnly },
			{ [`${baseClassName}--disabled`]: this.props.disabled },
			{ [`${baseClassName}--error`]: this.props.errorMessage },
			{ [`${baseClassName}--warning`]: this.props.warningMessage },
			{ [`${baseClassName}--isOver`]: this.state.isDraggingOver },
			this.props.className
		);

		const fileNameDisplay = !!(this.props.compact && this.props.actionItem);
		const isInteractiveReadonly =
			!this.props.compact && this.props.readOnly && !this.props.disabled && !!this.props.onUploadAreaClick;
		const { as, ...restInputProps } = this.props.inputProps ?? {};
		const isCompactButton = this.props.noUploaded && this.props.compact;

		const createOnClickHandler = (): ((event: MouseEvent<HTMLElement>) => void) | undefined => {
			if (!this.props.compact && this.isUnavailableFileUpload()) {
				return isInteractiveReadonly ? this.handleOnClickInReadOnlyMode : undefined;
			}

			if (this.props.compact && !this.props.interactiveFileName) {
				return undefined;
			}

			return this.handleOnClick;
		};

		const renderedAction = (): ReactNode => {
			const menuDescriptionId = `${this.props.id}-menu-description`;
			const getMenuActionTitle = (showPopupList?: boolean, fileUploadTitles?: FileUploadTitles): string | undefined =>
				showPopupList ? fileUploadTitles?.menuActionsClose : fileUploadTitles?.menuActionsOpen;

			return (
				<A11YLanguageContext.Consumer>
					{({ fileUploadTitles }) => (
						<PopupMenuConfigContext.Provider
							value={{
								renderTriggerElementAttributes: (showPopupList) => ({
									"aria-labelledby": StringUtils.join(
										menuDescriptionId,
										`${this.props.id}-label`,
										this.props.fileNameAfterUploadId
									),
									title: getMenuActionTitle(showPopupList, fileUploadTitles)
								}),
								...(menuDescriptionId && {
									renderTriggerElementChildren: ({ title, showPopupList }) => (
										<HiddenText
											id={menuDescriptionId}
										>{`${title ?? getMenuActionTitle(showPopupList, fileUploadTitles)} ${fileUploadTitles?.menuActionConnector}`}</HiddenText>
									)
								})
							}}
						>
							<StyledFileUpload.StyledUploadActions
								className={`${baseClassName}-actions`}
								data-role={DataRoles.FileUpload.Actions}
								onMouseOver={this.setActionItemMouseOver}
								onMouseLeave={this.setActionItemMouseLeave}
								onMouseOut={this.setActionItemMouseLeave}
								$cancelable={this.props.cancelable}
								$unavailable={this.isUnavailableFileUpload()}
								$fileNamePreview={fileNameDisplay}
								ref={this.fileUploadActionRef}
							>
								{this.props.actionItem}
							</StyledFileUpload.StyledUploadActions>
						</PopupMenuConfigContext.Provider>
					)}
				</A11YLanguageContext.Consumer>
			);
		};

		return (
			<StyledFileUpload.StyledUploadWrapper
				className={wrapperClassNames}
				style={this.props.style}
				data-role={DataRoles.FileUpload.Control}
				$uploadAreaSize={this.props.uploadAreaSize}
				$compact={this.props.compact}
				$textOnlyDisplay={this.props.textOnlyDisplay}
				$hasActionItem={!!this.props.actionItem && !this.isUnavailableFileUpload()}
			>
				<StyledFileUpload.StyledUploadContent
					id={this.props.id && `${this.props.id}-content`}
					title={this.props.title}
					key={`${this.props.id}-content-${this.props.loading}`}
					tabIndex={(this.isUnavailableFileUpload() && !isInteractiveReadonly) || fileNameDisplay ? -1 : 0}
					ref={this.handleUploadAreaRef}
					className={uploadContentOverClassNames}
					data-role={DataRoles.FileUpload.Content}
					role={isCompactButton ? "button" : undefined}
					aria-disabled={this.isPhone && this.isUnavailableFileUpload() && !isInteractiveReadonly}
					aria-describedby={
						this.props.compact
							? this.getLinkedTexts(this.props.ariaDescribedby ?? this.props.ariaLabelledby)
							: undefined
					}
					onClick={createOnClickHandler()}
					onDragOver={this.handleDragOver}
					onDragLeave={this.handleDragLeave}
					onDrop={this.handleOnDrop}
					onBlur={this.handleOnBlur}
					onKeyDown={fileNameDisplay ? undefined : this.handleOnKeyDown}
					$hasChild={this.props.hasChild}
					$loading={this.props.loading}
					$error={!!this.props.errorMessage}
					$warning={!!this.props.warningMessage}
					$info={!!this.props.infoMessage}
					$dragOver={this.state.isDraggingOver}
					$withPlaceholder={this.props.placeholder}
					$cancelable={this.props.cancelable}
					$disabled={this.props.disabled}
					$readonly={this.props.readOnly}
					$interactiveReadonly={isInteractiveReadonly}
					$compact={this.props.compact}
					$hasActionItem={!!this.props.actionItem && !this.isUnavailableFileUpload()}
					$textOnlyDisplay={this.props.textOnlyDisplay}
					$hasLoadingLabel={this.props.hasLoadingLabel}
					$interactiveFileName={this.props.interactiveFileName}
					$shouldBeInteractiveInReadonly={this.props.readOnly && !!this.props.onUploadAreaClick}
					$uploaded={!this.props.noUploaded}
				>
					{this.props.compact ? (
						<>
							{this.props.children}
							{this.renderHiddenTitle()}
						</>
					) : (
						<div
							role="button"
							aria-disabled={this.isUnavailableFileUpload() && !isInteractiveReadonly}
							aria-labelledby={this.getLinkedTexts(this.props.ariaLabelledby)}
							data-role={DataRoles.FileUpload.Content.Inner}
						>
							{this.props.children}
							{this.state.isDraggingOver && this.props.uploadIconOnDrag}
							{this.renderHiddenTitle()}
						</div>
					)}
					{this.props.hintRenderer?.()}
					<StyledFileUpload.StyledUploadInput
						{...restInputProps}
						tabIndex={-1}
						ref={this.handleFileInputRef}
						type="file"
						className={inputWithSuffixName(baseClassName)}
						disabled={this.isUnavailableFileUpload()}
						multiple={this.props.multiple}
						accept={this.props.accept}
						id={this.props.id}
						data-role={inputWithSuffixName(DataRoles.FileUpload)}
						onChange={this.handleOnFileInputChange}
						onClick={this.onInputClick}
					/>
				</StyledFileUpload.StyledUploadContent>
				{this.props.actionItem &&
					(this.props.compact
						? !this.isUnavailableFileUpload() && (
								<>
									<StyledFileUpload.StyledFieldUploadFileNameDivider data-role={DataRoles.FileUpload.Divider} />
									{renderedAction()}
								</>
							)
						: (!this.isUnavailableFileUpload() || this.props.loading) && renderedAction())}
			</StyledFileUpload.StyledUploadWrapper>
		);
	}

	componentDidUpdate(prevProps: Readonly<FileUploadInternalProps>): void {
		if (
			!this.props.disableFocusRestore &&
			((prevProps.loading !== this.props.loading && !this.props.loading && this.shouldFocus) ||
				this.props.focusOnUploadArea)
		) {
			this.focusOnUploadArea();
		}
	}

	public render(): ReactNode {
		return (
			<>
				<div style={{ width: this.props.uploadAreaSize?.width }}>
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<Label
						id={this.props.id}
						label={this.props.label}
						graphic={this.props.labelGraphic}
						disabled={this.props.disabled}
						hide={this.props.hideLabel || !this.props.label}
						onClick={
							(this.props.readOnly && !this.props.onUploadAreaClick) || this.props.disabled
								? undefined
								: this.handleLabelClick
						}
						dataRole={DataRoles.FileUpload.Label}
					/>
					{!this.props.compact && this.props.tooltips}
					{this.props.errorMessage && typeof this.props.errorMessage !== "boolean" && (
						<Error
							errorMessage={this.props.errorMessage}
							dataRole={DataRoles.FileUpload.ErrorMessage}
							id={this.props.id}
						/>
					)}
					{this.props.warningMessage && typeof this.props.warningMessage !== "boolean" && (
						<Warning
							warningMessage={this.props.warningMessage}
							dataRole={DataRoles.FileUpload.WarningMessage}
							id={this.props.id}
						/>
					)}
					{this.props.infoMessage && typeof this.props.infoMessage !== "boolean" && (
						<Info infoMessage={this.props.infoMessage} dataRole={DataRoles.FileUpload.InfoMessage} id={this.props.id} />
					)}
				</div>
				{this.props.compact && this.props.tooltips ? (
					<StyledFileUpload.StyledFieldUploadInlineWrapper>
						{this.renderedFileUpload()}
						{this.props.tooltips}
					</StyledFileUpload.StyledFieldUploadInlineWrapper>
				) : (
					this.renderedFileUpload()
				)}
				{this.props.helperText && (
					<StyledBaseInput.StyledFieldHelperWrapper
						className={addPrefix("field__helper")}
						$customWidth={this.props.width}
					>
						<StyledBaseInput.StyledFieldHelperText
							className={addPrefix("field__helper-text")}
							onClick={this.focusOnUploadArea}
							onKeyDown={noop}
							id={this.props.id && `${this.props.id}-helper-text`}
						>
							{this.props.helperText}
						</StyledBaseInput.StyledFieldHelperText>
					</StyledBaseInput.StyledFieldHelperWrapper>
				)}
			</>
		);
	}
}

FileUploadInternal.contextType = A11YLanguageContext;

export function FileUpload(props: FileUploadProps & FileUploadInternalProps): ReactElement {
	const { uploadAreaRef: propsUploadAreaRef, title, disabled, readOnly, children } = props;
	const uploadAreaRef = useRef<HTMLDivElement | null>(null);
	const { fileUploadTitles } = useContext(A11YLanguageContext);

	const getUploadAreaRef = useCallback(
		(ref: HTMLDivElement | null) => {
			uploadAreaRef.current = ref;
			propsUploadAreaRef?.(ref);
		},
		[propsUploadAreaRef]
	);

	const originalTitle =
		title === "" ? undefined : (title ?? (readOnly || disabled ? undefined : fileUploadTitles?.uploadButton));

	const { title: resolvedTitle, hintRenderer } = useInteractionHint({
		title: originalTitle,
		componentKey: "fileUpload",
		referenceElementRef: uploadAreaRef,
		focusable: !disabled && !readOnly
	});

	const uploadButtonTitle = title === "" ? undefined : (title ?? fileUploadTitles?.uploadButton);

	return (
		<FileUploadInternal
			{...props}
			title={resolvedTitle}
			uploadAreaRef={getUploadAreaRef}
			hintRenderer={hintRenderer}
			uploadButtonTitle={uploadButtonTitle}
		>
			{children}
		</FileUploadInternal>
	);
}

FileUpload.displayName = "FileUpload";
