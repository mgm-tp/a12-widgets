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

import type { ReactNode, ReactElement } from "react";
import {
	useRef,
	useState,
	useContext,
	useMemo,
	isValidElement,
	cloneElement,
	Fragment,
	Children,
	useCallback,
	useEffect
} from "react";

import { Icon } from "../../../icon/main/icon.view.js";
import { Button } from "../../../button/main/button.view.js";
import { provider as DeviceDetector } from "../../../common/main/device-detector.js";
import { addPrefix, getHorizontalPadding, getVerticalPadding, joinClassNames } from "../../../common/main/utils.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { ProgressIndicator } from "../../../progress-indicator/main/progress-indicator.view.js";
import { TextOutput } from "../../../text-output/main/text-output.view.js";
import type { Identifiable } from "../../../common/main/base-props.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { StyledFileUpload } from "../file-upload.styled.js";
import { FileUpload } from "../file-upload.view.js";

import type { DefaultFileUploadProps } from "./default-file-upload.api.js";
import {
	DefaultIcon,
	ImageIcon,
	PdfIcon,
	SoundIcon,
	SpreadsheetIcon,
	TextIcon,
	VideoIcon
} from "./svg-icons.internal.js";

const baseClassName = addPrefix("field__upload");

function getPreviewIcon(
	type: DefaultFileUploadProps.PlaceholderIconType,
	title?: string,
	id?: string,
	previewImage?: boolean,
	disabled?: boolean
): ReactNode {
	const classNames = previewImage ? `${baseClassName}-preview-icon` : "";
	const commonProps = {
		id: id && `${id}-preview-icon`,
		className: classNames,
		title: title,
		preview: previewImage,
		$disabled: disabled,
		dataRole: previewImage ? DataRoles.FileUpload.PreviewIcon : ""
	};

	switch (type) {
		case "text":
			return <TextIcon key="text" {...commonProps} />;
		case "image":
			return <ImageIcon key="image" {...commonProps} />;
		case "pdf":
			return <PdfIcon key="pdf" {...commonProps} />;
		case "sound":
			return <SoundIcon key="sound" {...commonProps} />;
		case "video":
			return <VideoIcon key="video" {...commonProps} />;
		case "spreadsheet":
			return <SpreadsheetIcon key="spreadsheet" {...commonProps} />;
		case "none":
			return null;
		default:
			return <DefaultIcon key="default" {...commonProps} />;
	}
}

/**
 * This wrapper provides the default styles for FileUpload widget
 */
export function DefaultFileUpload(props: DefaultFileUploadProps): ReactElement<DefaultFileUploadProps> {
	const wrapperRef = useRef<HTMLElement | null>(null);
	// Calculate initial fit states based on uploadAreaSize configuration
	const hasCompleteSize = props.uploadAreaSize?.width && props.uploadAreaSize?.height;
	const [horizFit, setHorizFit] = useState(!hasCompleteSize);
	const focusOnUploadArea = useRef<boolean>(false);
	const [vertFit, setVertFit] = useState(!hasCompleteSize);
	const [fileUploadSize, setFileUploadSize] = useState<{ width: string; height: string }>();
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const a11yTitles = languageContext.fileUploadTitles;

	// Prevent adding irrelevant props to the child component
	const {
		className,
		loading,
		actionItem,
		placeholderIcon = "default",
		showPlaceholderIconAsPreview,
		placeholderIconTitle,
		image,
		onUploadAreaClick,
		onCancel,
		ariaLabelledby,
		ariaDescribedby,
		fileOptions,
		compact,
		title,
		...rest
	} = props;
	const { showAsLink = true } = fileOptions ?? {};
	const fileNameAfterUploadId = props.id
		? image
			? `${props.id}-content-invisible-text`
			: `${props.id}-content-visible-text`
		: undefined;

	const clonedImageElement = useMemo(() => {
		return image && isValidElement<Identifiable>(image) && props.id
			? cloneElement(image, { id: `${props.id}-image` })
			: image;
	}, [image, props.id]);

	// Create the default children for the component
	const renderedContent = useMemo((): ReactNode => {
		if (loading && !compact) {
			return <FileUploadIcon />;
		}

		if (image && !fileOptions) {
			return clonedImageElement;
		}

		if (showPlaceholderIconAsPreview && !fileOptions) {
			return getPreviewIcon(placeholderIcon, placeholderIconTitle, props.id, true, props.disabled);
		}

		if ((props.buttonText || props.descriptionText) && !fileOptions) {
			const buttonText: string | undefined = DeviceDetector.isDesktop() ? props.buttonText : props.mobileButtonText;

			return [
				props.descriptionText && (
					<StyledFileUpload.StyledUploadDescriptionText
						$hidden={props.hideDescriptionText}
						className={`${baseClassName}-leftText`}
						key="file-upload-left-text"
						desktop={DeviceDetector.isDesktop()}
						id={`${props.id}-left-text`}
					>
						{props.descriptionText}
					</StyledFileUpload.StyledUploadDescriptionText>
				),
				<FileUploadIcon key="file-upload-icon" />,
				buttonText && (
					<StyledFileUpload.StyledUploadText
						className={`${baseClassName}-rightText`}
						$hidden={props.hideButtonText}
						key="file-upload-right-text"
						id={`${props.id}-right-text`}
					>
						{buttonText}
					</StyledFileUpload.StyledUploadText>
				)
			];
		}

		if (fileOptions || compact) {
			const { linkProps, name, icon, textOnlyDisplay } = fileOptions ?? {};
			const Wrapper = textOnlyDisplay && props.readOnly ? TextOutput : Fragment;

			let fileNameElement;

			if (fileOptions) {
				const renderName = (): ReactNode =>
					image ? (
						<HiddenText id={fileNameAfterUploadId}>{name}</HiddenText>
					) : (
						<span id={fileNameAfterUploadId} data-role={DataRoles.FileUpload.VisibleText}>
							{name}
						</span>
					);

				fileNameElement = (
					<Wrapper>
						{showAsLink ? (
							<StyledFileUpload.StyledFieldUploadFileNameLink
								{...linkProps}
								className={!textOnlyDisplay ? addPrefix("-u-truncate") : undefined}
								showHiddenText={title !== name || linkProps?.title !== name}
								linkAttributes={{
									"aria-disabled": props.disabled,
									tabIndex: compact ? 0 : -1,
									...linkProps?.linkAttributes
								}}
							>
								{image ? (
									<>
										{clonedImageElement}
										{renderName()}
									</>
								) : (
									<>
										{icon}
										{renderName()}
									</>
								)}
							</StyledFileUpload.StyledFieldUploadFileNameLink>
						) : (
							<>
								{icon}
								{renderName()}
							</>
						)}
					</Wrapper>
				);
			} else {
				fileNameElement = (
					<FileUploadIcon className={`${baseClassName}-icon--withPlaceholder`} withPlaceholder compact={compact} />
				);
			}

			return loading || props.loadingLabel ? (
				<ProgressIndicator
					label={props.loadingLabel}
					outerOverlayVariant="transparent"
					innerOverlayVariant="transparent"
					size="small"
					type="horizontal"
					noTabIndex
				/>
			) : (
				fileNameElement
			);
		}

		return [
			<FileUploadIcon key="file-upload-icon" className={`${baseClassName}-icon--withPlaceholder`} withPlaceholder />,
			placeholderIcon !== "none" &&
				getPreviewIcon(placeholderIcon, placeholderIconTitle, props.id, false, props.disabled)
		];
	}, [
		loading,
		compact,
		image,
		fileOptions,
		showPlaceholderIconAsPreview,
		props.buttonText,
		props.descriptionText,
		props.id,
		props.disabled,
		props.mobileButtonText,
		props.hideDescriptionText,
		props.hideButtonText,
		props.readOnly,
		props.loadingLabel,
		placeholderIcon,
		placeholderIconTitle,
		clonedImageElement,
		fileNameAfterUploadId,
		showAsLink,
		title
	]);

	const numberOfTooltips = Children.count(props.tooltips);
	const baseFieldClassName = addPrefix("field");

	const getWrapperRef = (ref: HTMLElement | null): void => {
		wrapperRef.current = ref;
	};

	const onCancelUploading = useCallback(() => {
		onCancel?.();
		focusOnUploadArea.current = true;
	}, [onCancel]);

	const getLinkedTexts = useCallback(
		(text?: string) =>
			joinClassNames(
				{ [`${props.id}-info`]: props.id && props.infoMessage && typeof props.infoMessage !== "boolean" },
				{ [`${props.id}-warning`]: props.id && props.warningMessage && typeof props.warningMessage !== "boolean" },
				{ [`${props.id}-error`]: props.id && props.errorMessage && typeof props.errorMessage !== "boolean" },
				text,
				{ [`${props.id}-left-text`]: props.id && DeviceDetector.isDesktop() && props.descriptionText },
				{ [`${props.id}-right-text`]: (props.id && props.buttonText) || props.mobileButtonText },
				{ [`${props.id}-image`]: props.id && image },
				{ [`${props.id}-preview-icon`]: props.id && !image && placeholderIcon && placeholderIconTitle },
				{ [`${props.id}-loading`]: props.id && loading }
			),
		[
			image,
			loading,
			placeholderIcon,
			placeholderIconTitle,
			props.buttonText,
			props.descriptionText,
			props.errorMessage,
			props.id,
			props.infoMessage,
			props.mobileButtonText,
			props.warningMessage
		]
	);

	const uploaded = useMemo(() => (compact ? !!fileOptions : !!image), [compact, fileOptions, image]);

	const renderedFileUpload = useMemo(() => {
		return (
			<FileUpload
				className={joinClassNames(
					className,
					{
						[`${baseClassName}--placeholder`]:
							!image && !loading && !showPlaceholderIconAsPreview && placeholderIcon !== "none"
					},
					{ [`${baseClassName}--hasChild`]: image || (showPlaceholderIconAsPreview && placeholderIcon) },
					{ [`${baseClassName}--loading`]: loading },
					{ [`${baseClassName}--cancelable`]: loading && onCancel },
					{ [`${baseClassName}--noPadding`]: image && !showPlaceholderIconAsPreview }
				)}
				actionItem={
					loading && !!onCancel ? (
						<Button
							tabIndex={0}
							icon={<Icon>close</Icon>}
							secondary
							destructive={!compact}
							title={a11yTitles && a11yTitles.cancelUpload}
							onClick={onCancelUploading}
						/>
					) : (
						(!compact || fileOptions) && actionItem
					)
				}
				ariaLabelledby={getLinkedTexts(ariaLabelledby)}
				ariaDescribedby={getLinkedTexts(ariaDescribedby ?? ariaLabelledby)}
				loading={loading}
				disabled={!compact && loading}
				uploadIconOnDrag={
					!loading &&
					!props.buttonText &&
					!props.descriptionText &&
					!props.multiple &&
					!fileOptions &&
					!actionItem && <FileUploadIcon className={`${baseClassName}-icon--withPlaceholder`} withPlaceholder />
				}
				onUploadAreaClick={onUploadAreaClick}
				{...rest}
				width={props.uploadAreaSize?.width}
				cancelable={!!(loading && onCancel)}
				noPadding={!!(image && !showPlaceholderIconAsPreview)}
				hasChild={!!(image || (showPlaceholderIconAsPreview && placeholderIcon))}
				placeholder={!image && !loading && !showPlaceholderIconAsPreview && !compact && placeholderIcon !== "none"}
				compact={compact}
				textOnlyDisplay={props.readOnly && fileOptions?.textOnlyDisplay}
				hasLoadingLabel={!!props.loadingLabel}
				interactiveFileName={fileOptions?.name ? showAsLink : !props.readOnly}
				noUploaded={!uploaded}
				focusOnUploadArea={focusOnUploadArea.current}
				title={title}
				fileNameAfterUploadId={fileNameAfterUploadId}
			>
				{renderedContent}
				{loading && a11yTitles && <HiddenText id={`${props.id}-loading`}>{a11yTitles.loading}</HiddenText>}
			</FileUpload>
		);
	}, [
		className,
		image,
		loading,
		showPlaceholderIconAsPreview,
		placeholderIcon,
		onCancel,
		compact,
		a11yTitles,
		onCancelUploading,
		fileOptions,
		actionItem,
		getLinkedTexts,
		ariaLabelledby,
		ariaDescribedby,
		props.buttonText,
		props.descriptionText,
		props.multiple,
		props.uploadAreaSize?.width,
		props.readOnly,
		props.loadingLabel,
		props.id,
		onUploadAreaClick,
		rest,
		showAsLink,
		uploaded,
		title,
		fileNameAfterUploadId,
		renderedContent
	]);

	useEffect(() => {
		const parent = wrapperRef.current?.parentElement;
		const { width, height, maxWidth, maxHeight } = props.uploadAreaSize || {};

		const calculateDynamicDimensions = (): void => {
			if (!parent) {
				return;
			}

			const parentRect = parent.getBoundingClientRect();
			const parentWidth = parentRect.width;

			if (!props.uploadAreaSize) {
				setHorizFit(true);
				setVertFit(true);

				const wrapper = wrapperRef.current;

				if (wrapper && parentWidth > 0) {
					setFileUploadSize({ width: `${Math.floor(parentWidth)}px`, height: "auto" });
				}
			} else if (props.uploadAreaSize) {
				const plainParentWidth = Number(parentWidth) - Number(getHorizontalPadding(parent));
				const plainParentHeight = Number(parentRect.height) - Number(getVerticalPadding(parent));

				if (width || height) {
					setHorizFit(!width && (!maxWidth || Number(maxWidth) > plainParentWidth));
					setVertFit(!height && (!maxHeight || Number(maxHeight) > plainParentHeight));
				} else if (maxWidth && maxHeight) {
					setHorizFit(true);
					setVertFit(true);
					const appliedWidth = Math.min(Number(maxWidth), plainParentWidth);
					setFileUploadSize({ width: `${Math.floor(appliedWidth)}px`, height: "auto" });
				} else {
					setHorizFit(true);
					setVertFit(true);
				}
			}
		};

		setHorizFit(!hasCompleteSize);
		setVertFit(!hasCompleteSize);

		let resizeObserver: ResizeObserver | null = null;

		if (typeof ResizeObserver !== "undefined" && parent) {
			resizeObserver = new ResizeObserver(calculateDynamicDimensions);
			resizeObserver.observe(parent);
		}

		return (): void => {
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
		};
	}, [props.uploadAreaSize, compact, props.image, fileOptions, hasCompleteSize]);

	return (
		<StyledFileUpload.StyledFieldUploadWrapper
			ref={getWrapperRef}
			className={joinClassNames(
				baseFieldClassName,
				{ [`${baseFieldClassName}--tooltips`]: numberOfTooltips && !props.breakTooltipsToNewLine },
				{ [`${baseClassName}--fit`]: horizFit || vertFit }
			)}
			data-role={DataRoles.FileUpload}
			$hasTooltips={!!(numberOfTooltips && !props.breakTooltipsToNewLine)}
			$horizFit={horizFit || compact}
			$vertFit={vertFit || compact}
			$compact={compact}
			$fileUploadSize={fileUploadSize}
		>
			{renderedFileUpload}
		</StyledFileUpload.StyledFieldUploadWrapper>
	);
}

DefaultFileUpload.displayName = "DefaultFileUpload";

interface FileUploadIconProps {
	className?: string;
	withPlaceholder?: boolean;
	compact?: boolean;
}

export const FileUploadIcon = (props: FileUploadIconProps): ReactElement<FileUploadIconProps> => {
	return (
		<StyledFileUpload.StyledUploadIcon
			className={joinClassNames(`${baseClassName}-icon`, props.className)}
			$withPlaceholder={props.withPlaceholder}
			$compact={props.compact}
		>
			file_upload
		</StyledFileUpload.StyledUploadIcon>
	);
};

FileUploadIcon.displayName = "FileUploadIcon";
