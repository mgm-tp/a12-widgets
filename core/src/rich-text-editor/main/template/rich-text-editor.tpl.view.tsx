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

import type { FC, ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ContentEditableProps } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import merge from "deepmerge";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import type { ElementFormatType } from "lexical";

import { InputElements } from "../../../input/base/template/base.tpl.view.js";
import type { LabelProps } from "../../../input/base/template/base.tpl.api.js";
import { noop } from "../../../common/main/utils.js";
import type { Container, Identifiable } from "../../../common/main/base-props.js";
import { useSelectedText } from "../../../common/main/hooks.js";
import { StyledBaseInput } from "../../../input/base-input-styled/base.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { StyledEditorInput } from "../rich-text-editor.styled.js";
import { defaultConfig } from "../default-configs.js";
import { editorHasContent } from "../utils/common.js";

import type {
	RichTextEditorComposerProps,
	RichTextEditorSelectionCacheContextValue
} from "./rich-text-editor.tpl.api.js";

export const RichTextEditorLabel: FC<LabelProps> = (props) => {
	const [editor] = useLexicalComposerContext();
	const handleClick = useCallback(() => editor.focus(), [editor]);

	return (
		<InputElements.Label
			id={props.id}
			label={props.label}
			graphic={props.graphic}
			hide={props.hide || !props.label}
			disabled={props.disabled}
			dataRole={DataRoles.RichTextEditor.Label}
			onClick={handleClick}
		/>
	);
};

RichTextEditorLabel.displayName = "RichTextEditorLabel";

export const RichTextEditorHelperText: FC<Identifiable & Container> = (props) => {
	const [editor] = useLexicalComposerContext();
	const helperTextRef = useRef(null);
	const { isSelectedText } = useSelectedText(helperTextRef);

	const handleClick = useCallback((): void => {
		if (!isSelectedText) {
			editor.focus();
		}
	}, [editor, isSelectedText]);

	return (
		<StyledBaseInput.StyledFieldHelperText
			id={props.id ? `${props.id}-helper-text` : undefined}
			onClick={handleClick}
			onKeyDown={noop}
			ref={helperTextRef}
			data-role={DataRoles.RichTextEditor.HelperText}
		>
			{props.children}
		</StyledBaseInput.StyledFieldHelperText>
	);
};

RichTextEditorHelperText.displayName = "RichTextEditorHelperText";

export const RichTextEditorContentEditable: FC<ContentEditableProps> = (props) => {
	const [editor] = useLexicalComposerContext();
	const { disabled, readOnly, as, ...rest } = props;

	const [isFocused, setIsFocused] = useState(false);

	const allowFocus = !readOnly || editorHasContent(editor);

	useEffect(() => {
		editor.setEditable(!disabled && !readOnly);
	}, [disabled, editor, readOnly]);

	const onFocus = useCallback(() => {
		if (allowFocus) {
			setIsFocused(true);
		}
	}, [allowFocus]);

	const onBlur = useCallback(() => {
		setIsFocused(false);
	}, []);

	return (
		<StyledEditorInput
			onFocus={onFocus}
			onBlur={onBlur}
			tabIndex={allowFocus ? 0 : -1}
			data-role={DataRoles.RichTextEditor.Input}
			$hasFocus={isFocused}
			{...rest}
		/>
	);
};

RichTextEditorContentEditable.displayName = "RichTextEditorContentEditable";

export const RichTextEditorComposer: FC<RichTextEditorComposerProps> = (props: RichTextEditorComposerProps) => {
	const { initialConfig, children } = props;

	const editorConfig: InitialConfigType = useMemo(() => {
		const config = defaultConfig();

		if (initialConfig) {
			return merge(config, initialConfig);
		}

		return config;
	}, [initialConfig]);

	return <LexicalComposer initialConfig={editorConfig}>{children}</LexicalComposer>;
};

RichTextEditorComposer.displayName = "RichTextEditorComposer";

export const RichTextEditorSelectionCacheContext = createContext<RichTextEditorSelectionCacheContextValue>({
	classList: [],
	setClassList: () => undefined,
	elementFormatType: "left",
	setElementFormatType: () => undefined
});

// Provider that cache value related to current selection
export const RichTextEditorSelectionCacheProvider: FC<{ children?: ReactNode }> = ({ children }) => {
	// Value of the css class list use in InlineStyleTextNode for custom style
	const [classList, setClassList] = useState<string[]>();
	// Value of the format type use in ElementNode for alignment
	const [elementFormatType, setElementFormatType] = useState<ElementFormatType>("left");

	return (
		<RichTextEditorSelectionCacheContext.Provider
			value={{ classList, setClassList, elementFormatType, setElementFormatType }}
		>
			{children}
		</RichTextEditorSelectionCacheContext.Provider>
	);
};

RichTextEditorSelectionCacheProvider.displayName = "RichTextEditorSelectionCacheProvider";

export const useRichTextEditorCache = (): RichTextEditorSelectionCacheContextValue => {
	return useContext(RichTextEditorSelectionCacheContext);
};
