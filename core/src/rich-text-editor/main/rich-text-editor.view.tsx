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

import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { FC, ReactNode } from "react";
import { Children, cloneElement, isValidElement, useCallback, useMemo, useRef, useState } from "react";

import type { Identifiable } from "../../common/main/base-props.js";
import { DataRoles } from "../../common/main/data-roles.js";
import type { OnResizeCallback, ResizePayload } from "../../common/main/resize-observer/resize-observer.api.js";
import { useResizeObserver } from "../../common/main/resize-observer/use-resize-observer.js";
import { joinClassNames } from "../../common/main/utils.js";
import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { InputElements } from "../../input/base/template/base.tpl.view.js";
import { useFieldDefaultsConfig } from "../../input/field-default-config/main/field-default-config.utils.js";

import TabFocusPluginInternal from "./internal-plugins/tab-focus-plugin/tab-focus-plugin.internal.js";
import SelectAllPlugin from "./plugins/select-all-plugin/select-all-plugin.js";
import { ToolbarPlugin } from "./plugins/static-toolbar-plugin/static-toolbar.view.js";
import { TextFormatPlugin } from "./plugins/text-format-plugin/text-format-plugin.view.js";
import type { RichTextEditorProps } from "./rich-text-editor.api.js";
import {
	StyledEditorAddon,
	StyledEditorContentWrapper,
	StyledEditorInputWrapper,
	StyledEditorMain,
	StyledEditorPlaceholder
} from "./rich-text-editor.styled.js";
import {
	RichTextEditorComposer,
	RichTextEditorContentEditable,
	RichTextEditorHelperText,
	RichTextEditorLabel,
	RichTextEditorSelectionCacheProvider
} from "./template/rich-text-editor.tpl.view.js";

export const RichTextEditor: FC<RichTextEditorProps> = (props) => {
	const {
		id,
		style,
		autoExpand,
		minHeight,
		maxHeight,
		singleLine,
		label,
		hideLabel,
		disabled,
		readonly,
		labelGraphic,
		tooltips,
		error,
		warning,
		info,
		errorMessage,
		warningMessage,
		infoMessage,
		helperText,
		staticToolbarButtons,
		placeholder,
		onChange,
		addonAfter,
		initialConfig: userConfig,
		spellCheck,
		children,
		useComposer = true,
		enableHistory = true,
		breakTooltipsToNewLine: breakTooltipsToNewLineProp,
		messagePosition: messagePositionProp,
		...rest
	} = props;
	const { breakTooltipsToNewLine, messagePosition } = useFieldDefaultsConfig(
		{ messagePosition: messagePositionProp, breakTooltipsToNewLine: breakTooltipsToNewLineProp },
		"above"
	);
	const [focused, setFocused] = useState(false);
	const addonAfterRefs = useRef<Record<string, HTMLElement | null>>({});

	const isInteractive = useMemo(() => !readonly && !disabled, [disabled, readonly]);

	const ariaDescribedBy = useMemo(() => {
		if (!id) {
			return undefined;
		}

		return (
			joinClassNames(
				{ [`${id}-error`]: !!errorMessage },
				{ [`${id}-warning`]: !!warningMessage },
				{ [`${id}-info`]: !!infoMessage },
				{ [`${id}-placeholder`]: !!(isInteractive && placeholder) },
				{ [`${id}-helper-text`]: !!helperText }
			) || undefined
		);
	}, [id, isInteractive, placeholder, helperText, errorMessage, warningMessage, infoMessage]);

	const isFixedHeight = useMemo(
		() => !!(minHeight && !(singleLine || autoExpand)),
		[autoExpand, minHeight, singleLine]
	);

	const handleInputFocus = useCallback(() => {
		if (disabled || readonly) {
			return;
		}

		setFocused(true);
	}, [disabled, readonly]);

	const handleInputBlur = useCallback(() => {
		if (disabled || readonly) {
			return;
		}

		setFocused(false);
	}, [disabled, readonly]);

	const setHeightForAddonAfter = useCallback<OnResizeCallback>(({ height }: ResizePayload): void => {
		if (height !== undefined) {
			Object.keys(addonAfterRefs.current).forEach((key) => {
				const addonAfterRef = addonAfterRefs.current[key];

				if (addonAfterRef) {
					addonAfterRef.style.height = height + "px";
				}
			});
		}
	}, []);

	const { ref: resizeRef } = useResizeObserver<HTMLDivElement>({
		onResize: setHeightForAddonAfter
	});

	const renderAddonAfter = useCallback(
		(belongsToMain = true): ReactNode => {
			const addons = Children.toArray(addonAfter).filter(Boolean);

			return (
				addons.length > 0 &&
				addons.map((addon, index) => (
					<StyledEditorAddon
						$position="after"
						notSingleLine={!singleLine && !!staticToolbarButtons}
						key={index}
						data-role={belongsToMain ? `${DataRoles.RichTextEditor.AfterAddon}-${index}` : undefined}
						ref={(ref): void => {
							if (belongsToMain) {
								addonAfterRefs.current[index] = ref;
							}
						}}
					>
						{belongsToMain || !isValidElement<Identifiable>(addon) ? addon : cloneElement(addon, { id: undefined })}
					</StyledEditorAddon>
				))
			);
		},
		[addonAfter, singleLine, staticToolbarButtons]
	);

	const messagesElement = (
		<>
			{errorMessage && (
				<InputElements.Error
					id={id}
					errorMessage={errorMessage}
					dataRole={DataRoles.RichTextEditor.ErrorMessage}
					position={messagePosition}
				/>
			)}
			{warningMessage && (
				<InputElements.Warning
					id={id}
					warningMessage={warningMessage}
					dataRole={DataRoles.RichTextEditor.WarningMessage}
					position={messagePosition}
				/>
			)}
			{infoMessage && (
				<InputElements.Info
					id={id}
					infoMessage={infoMessage}
					dataRole={DataRoles.RichTextEditor.InfoMessage}
					position={messagePosition}
				/>
			)}
		</>
	);

	const renderContent = (
		<RichTextEditorSelectionCacheProvider>
			<StyledBaseInput.StyledFieldWrapper
				$block
				$tooltipPosition={breakTooltipsToNewLine}
				id={id && `${id}-wrapper`}
				style={style}
				data-role={DataRoles.RichTextEditor.Wrapper}
			>
				<StyledEditorMain
					$autoExpand={autoExpand}
					$withInitialHeight={isFixedHeight}
					data-role={DataRoles.RichTextEditor}
				>
					<StyledBaseInput.StyledField data-role={DataRoles.RichTextEditor.Input.Field}>
						{label && (
							<RichTextEditorLabel label={label} id={id} hide={hideLabel} graphic={labelGraphic} disabled={disabled} />
						)}
						{(breakTooltipsToNewLine === true || breakTooltipsToNewLine === "above") && tooltips}
						{messagePosition !== "below" && messagesElement}
						<div ref={resizeRef}>
							{staticToolbarButtons && (
								<ToolbarPlugin
									items={staticToolbarButtons}
									ariaControls={id ? `${id}-textarea` : undefined}
									ariaDescribedby={id && label ? `${id}-label` : undefined}
								/>
							)}
							<StyledEditorInputWrapper
								$error={error || !!errorMessage}
								$warning={warning || !!warningMessage}
								$info={info || !!infoMessage}
								$disabled={disabled}
								$readonly={readonly}
								$focused={focused}
								$autoExpand={autoExpand}
								$withInitialHeight={isFixedHeight}
								$singleLine={singleLine}
								$minHeight={minHeight}
								$maxHeight={maxHeight}
								data-role={DataRoles.RichTextEditor.Input.Wrapper}
							>
								<RichTextPlugin
									contentEditable={
										<StyledEditorContentWrapper
											onFocus={handleInputFocus}
											onBlur={handleInputBlur}
											data-role={DataRoles.RichTextEditor.ContentWrapper}
										>
											<RichTextEditorContentEditable
												id={id}
												{...rest}
												readOnly={readonly}
												disabled={disabled}
												spellCheck={spellCheck ?? false}
												aria-labelledby={id && label ? `${id}-label` : undefined}
												aria-describedby={ariaDescribedBy}
												aria-multiline={!singleLine}
												aria-readonly={readonly}
												aria-disabled={disabled}
												aria-invalid={error || errorMessage ? true : undefined}
											/>
										</StyledEditorContentWrapper>
									}
									placeholder={
										isInteractive && placeholder ? (
											<StyledEditorPlaceholder
												id={id ? `${id}-placeholder` : undefined}
												data-role={DataRoles.RichTextEditor.Placeholder}
											>
												{placeholder}
											</StyledEditorPlaceholder>
										) : null
									}
									ErrorBoundary={LexicalErrorBoundary}
								/>
								{enableHistory && <HistoryPlugin />}
								<TabFocusPluginInternal />
								{readonly && <SelectAllPlugin />}
								<TextFormatPlugin />
								{onChange && <OnChangePlugin onChange={onChange} />}
								{children}
							</StyledEditorInputWrapper>
						</div>
						{messagePosition === "below" && messagesElement}
					</StyledBaseInput.StyledField>
					{renderAddonAfter()}
					{!breakTooltipsToNewLine && tooltips && (
						<StyledBaseInput.StyledFieldAddon $position="after" data-role={DataRoles.RichTextEditor.TooltipAddon}>
							{tooltips}
						</StyledBaseInput.StyledFieldAddon>
					)}
				</StyledEditorMain>
				{breakTooltipsToNewLine === "below" && tooltips}
				{helperText && (
					<StyledBaseInput.StyledFieldHelperWrapper data-role={DataRoles.RichTextEditor.HelperText.Wrapper}>
						<RichTextEditorHelperText id={id}>{helperText}</RichTextEditorHelperText>
						{renderAddonAfter(false)}
					</StyledBaseInput.StyledFieldHelperWrapper>
				)}
			</StyledBaseInput.StyledFieldWrapper>
		</RichTextEditorSelectionCacheProvider>
	);

	return useComposer ? (
		<RichTextEditorComposer initialConfig={userConfig}>{renderContent}</RichTextEditorComposer>
	) : (
		renderContent
	);
};

RichTextEditor.displayName = "RichTextEditor";
