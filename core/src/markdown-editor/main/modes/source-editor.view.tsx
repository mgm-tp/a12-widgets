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

import { HistoryExtension } from "@lexical/history";
import { PlainTextExtension } from "@lexical/plain-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { ContentEditableProps } from "@lexical/react/LexicalContentEditable";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import type { LexicalEditor } from "lexical";
import { defineExtension } from "lexical";
import type { FC, FocusEvent, KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";
import { useUnmount } from "../../../common/main/hooks.js";
import { MarkdownHighlightingExtension } from "../extensions/markdown-highlighting-extension.js";
import type { SurfaceValueBridgeOptions } from "../hooks/use-markdown-value-bridge.js";
import { EXTERNAL_VALUE_TAG, useMarkdownValueBridge } from "../hooks/use-markdown-value-bridge.js";
import {
	StyledMarkdownEditorInput,
	StyledMarkdownPlaceholder,
	StyledMarkdownSourceWrapper
} from "../markdown-editor.styled.js";
import type { SourceTokenizer } from "../source-highlighting/micromark-tokenizer.js";
import { registerSourceHighlighting } from "../source-highlighting/register-source-highlighting.js";
import { $getSourceDocumentText, $setSourceDocument } from "../source-highlighting/source-document.js";

/**
 * The value options this surface passes straight on to its bridge.
 * There is no `enabled` flag: the bridge sits inside this surface's own composer and
 * unmounts with it, so it is never around while another surface owns the text.
 */
type SourceValueOptions = Omit<SurfaceValueBridgeOptions, "enabled">;

interface SourceEditorProps extends SourceValueOptions {
	focused: boolean;
	minHeight?: number | string;
	maxHeight?: number | string;
	placeholder?: string;
	disabled?: boolean;
	readonly?: boolean;
	error?: boolean;
	warning?: boolean;
	info?: boolean;
	placeholderId?: string;
	ariaLabelledby?: string;
	ariaDescribedby?: string;
	onFocus: (event: FocusEvent<HTMLElement>) => void;
	onBlur: (event: FocusEvent<HTMLElement>) => void;
	onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;

	/** Tokenizer for the dialect the rich editor parses — see the shell. */
	tokenize: SourceTokenizer;

	/**
	 * Receives the nested editor once it exists, so the shell can drive it from the
	 * toolbar and read its state.
	 *
	 * Called with `null` on unmount, by this component rather than by `EditorRefPlugin`:
	 * that plugin only ever calls forward, so without this the shell would keep
	 * pointing at an editor that is no longer on screen.
	 */
	onEditorReady: (editor: LexicalEditor | null) => void;
}

/**
 * Reads and writes the raw markdown of this editor. {@link useMarkdownValueBridge}
 * does the rest — when to call `onChange`, ignoring our own echo, IME input,
 * flushing — which is what makes `onChange` behave the same here as in rich mode.
 *
 * This is a component instead of a hook call inside {@link SourceEditor}, because
 * the editor it needs comes from the composer that `SourceEditor` renders, so it
 * has to sit below it.
 */
const SourceValueBridge: FC<SourceValueOptions & { tokenize: SourceTokenizer }> = ({ tokenize, ...options }) => {
	const [editor] = useLexicalComposerContext();

	const read = useCallback((): string => editor.read(() => $getSourceDocumentText()), [editor]);

	const write = useCallback(
		(markdown: string): void => {
			// `discrete: true` applies the update straight away instead of batching it,
			// so anything reading the document right after this sees the new text.
			editor.update(
				() => {
					if ($getSourceDocumentText() !== markdown) {
						$setSourceDocument(markdown, tokenize);
					}
				},
				{ discrete: true, tag: EXTERNAL_VALUE_TAG }
			);
		},
		[editor, tokenize]
	);

	useMarkdownValueBridge({ ...options, read, write });

	return null;
};

SourceValueBridge.displayName = "MarkdownSourceValueBridge";

/** Keeps the nested editor's editability in step with the shell's props. */
const SourceEditableState: FC<{ editable: boolean }> = ({ editable }) => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		editor.setEditable(editable);
	}, [editor, editable]);

	return null;
};

SourceEditableState.displayName = "MarkdownSourceEditableState";

/**
 * The raw-markdown surface, syntax highlighted.
 *
 * Runs its own Lexical editor: the shell's editor holds the document as *rich* nodes,
 * while this one holds it as a flat run of source blocks whose children are
 * nested token elements. One editor cannot be both.
 *
 * `PlainTextExtension` supplies typing and Enter (a line break, never a new paragraph);
 * {@link MarkdownHighlightingExtension} supplies the node set, and
 * {@link registerSourceHighlighting} the transforms that keep the highlighting in step with the text.
 */
export const SourceEditor: FC<SourceEditorProps> = ({
	value,
	onChange,
	emitMode,
	emitDebounceMs,
	flushPendingEditRef,
	focused,
	minHeight,
	maxHeight,
	placeholder,
	disabled,
	readonly,
	error,
	warning,
	info,
	placeholderId,
	ariaLabelledby,
	ariaDescribedby,
	onFocus,
	onBlur,
	onKeyDown,
	tokenize,
	onEditorReady
}) => {
	// `EditorRefPlugin` hands the editor up but never takes it back, so the shell would hold a dead one
	// for the rest of its life. Give it back when this surface goes away.
	useUnmount(() => onEditorReady(null));

	// `ContentEditableProps` pairs `placeholder` with a required `aria-placeholder`,
	// so the two are supplied together or not at all.
	const placeholderProps: ContentEditableProps = useMemo(
		() =>
			placeholder
				? {
						"aria-placeholder": placeholder,
						placeholder: (
							<StyledMarkdownPlaceholder id={placeholderId} data-role={DataRoles.MarkdownEditor.Placeholder}>
								{placeholder}
							</StyledMarkdownPlaceholder>
						)
					}
				: {},
		[placeholder, placeholderId]
	);

	// `LexicalExtensionComposer` rebuilds the editor whenever this identity changes,
	// which would throw the document away — so it depends on the tokenizer alone.
	const extension = useMemo(
		() =>
			defineExtension({
				name: "@a12/MarkdownEditor/SourceMode",
				// No `TabIndentationExtension`: `registerTabIndentation` calls `preventDefault()` on Tab,
				// trapping the keyboard — `@lexical/extension` 0.48.0. Plain text has nothing to indent anyway.
				dependencies: [PlainTextExtension, HistoryExtension, MarkdownHighlightingExtension],
				register: (editor) => registerSourceHighlighting(editor, tokenize)
			}),
		[tokenize]
	);

	return (
		<LexicalExtensionComposer extension={extension} contentEditable={null}>
			<StyledMarkdownSourceWrapper
				$focused={focused}
				$minHeight={minHeight}
				$maxHeight={maxHeight}
				$disabled={disabled}
				$readonly={readonly}
				$error={error}
				$warning={warning}
				$info={info}
				onFocus={onFocus}
				onBlur={onBlur}
				onKeyDown={onKeyDown}
				data-role={DataRoles.MarkdownEditor.Input.Wrapper}
			>
				<StyledMarkdownEditorInput
					{...placeholderProps}
					$hasFocus={focused}
					role="textbox"
					aria-multiline="true"
					data-role={DataRoles.MarkdownEditor.Surface.Source}
					aria-labelledby={ariaLabelledby}
					aria-describedby={ariaDescribedby}
					aria-readonly={readonly || undefined}
					aria-disabled={disabled || undefined}
					aria-invalid={error || undefined}
				/>
			</StyledMarkdownSourceWrapper>
			<EditorRefPlugin editorRef={onEditorReady} />
			<SourceEditableState editable={!disabled && !readonly} />
			<SourceValueBridge
				value={value}
				onChange={onChange}
				emitMode={emitMode}
				emitDebounceMs={emitDebounceMs}
				tokenize={tokenize}
				flushPendingEditRef={flushPendingEditRef}
			/>
		</LexicalExtensionComposer>
	);
};

SourceEditor.displayName = "MarkdownSourceEditor";
