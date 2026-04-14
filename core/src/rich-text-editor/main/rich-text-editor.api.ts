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

import type { ReactNode } from "react";
import type { EditorState, LexicalEditor } from "lexical";

import type { Container, Identifiable, Styleable } from "../../common/main/base-props.js";
import type { BaseInputProps } from "../../input/base/template/base.tpl.api.js";

import type { StaticToolbarProps } from "./plugins/static-toolbar-plugin/static-toolbar.api.js";
import type { RichTextEditorComposerProps } from "./template/rich-text-editor.tpl.api.js";

type OmittedInputBaseProps = Omit<
	BaseInputProps,
	"fitToParent" | "ariaDescribedby" | "breakTooltipsToNewLine" | "onChange"
>;

export interface RichTextEditorProps
	extends
		Styleable,
		Identifiable,
		Container,
		OmittedInputBaseProps,
		Pick<RichTextEditorComposerProps, "initialConfig"> {
	/**
	 * Used to determine whether the editor's height should automatically expand.
	 */
	autoExpand?: boolean;

	/**
	 * Maximum height of the editor. Only needed if {@link autoExpand} is set to true. Any CSS unit can be used.
	 */
	maxHeight?: number | string;

	/**
	 * Minimum and initial height of the editor. The default value is 100px. Any CSS unit can be used.
	 */
	minHeight?: number | string;

	/**
	 * Renders editor in single line mode. If set, {@link minHeight}, {@link maxHeight} and {@link autoExpand} have no use.
	 */
	singleLine?: boolean;

	/**
	 * Element to be displayed above the editor's input as the toolbar.
	 */
	staticToolbarButtons?: StaticToolbarProps.Item[];

	/**
	 * Placeholder text displayed in the editor's input.
	 */
	placeholder?: string;

	/**
	 * Specifies addons that will be placed after the input wrapper.
	 */
	addonAfter?: ReactNode | ReactNode[];

	/**
	 * Triggers whenever the editor states changes.
	 * EditorState: {@link https://lexical.dev/docs/api/classes/lexical.EditorState}
	 * LexicalEditor: {@link https://lexical.dev/docs/api/classes/lexical.LexicalEditor}
	 */
	onChange?(editorState: EditorState, editor: LexicalEditor): void;

	/**
	 * Defines whether the element may be checked for spelling errors by the browser.
	 */
	spellCheck?: boolean;

	/**
	 * RichTextEditorComposer provides LexicalEditor context value to its descendants via React Context.
	 * By default, RichTextEditorComposer will be the top level of RichTextEditor and wrap all contents inside.
	 * In case, you want to provide LexicalEditor context to your components, set this property to false and wrap your components inside the RichTextEditorComposer.
	 * @default true
	 */
	useComposer?: boolean;
}
