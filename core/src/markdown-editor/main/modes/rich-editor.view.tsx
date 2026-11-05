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

import type { ContentEditableProps } from "@lexical/react/LexicalContentEditable";
import type { FC, FocusEvent, KeyboardEvent } from "react";
import { useMemo } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";
import {
	StyledMarkdownEditorInput,
	StyledMarkdownPlaceholder,
	StyledMarkdownRichWrapper
} from "../markdown-editor.styled.js";

interface RichEditorProps {
	focused: boolean;
	minHeight?: number | string;
	maxHeight?: number | string;
	error?: boolean;
	warning?: boolean;
	info?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	isViewMode?: boolean;
	placeholder?: string;
	placeholderId?: string;
	ariaLabelledby?: string;
	ariaDescribedby?: string;
	onFocus: (event: FocusEvent<HTMLDivElement>) => void;
	onBlur: (event: FocusEvent<HTMLDivElement>) => void;
	onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * The WYSIWYG surface for both edit and view modes (read-only is toggled on the
 * editor itself via `setEditable`).
 *
 * Deliberately thin: rich text, history, lists, links, tables, horizontal rules
 * and the markdown typing shortcuts all live on the root extension, so they
 * need no React presence at all. What remains here are the plugins that still
 * depend on React props.
 *
 * There is no `RichTextPlugin` wrapper either — `RichTextExtension` provides the
 * behaviour, and the composer is mounted with `contentEditable={null}` so the
 * editable lands exactly here.
 */
export const RichEditor: FC<RichEditorProps> = ({
	focused,
	minHeight,
	maxHeight,
	error,
	warning,
	info,
	disabled,
	readonly,
	isViewMode,
	placeholder,
	placeholderId,
	ariaLabelledby,
	ariaDescribedby,
	onFocus,
	onBlur,
	onKeyDown
}) => {
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

	return (
		<StyledMarkdownRichWrapper
			// Nothing in view mode can be typed into, so the surface never takes on the focus,
			// hover or active look of an input. It keeps its border.
			$focused={focused && !isViewMode}
			$noEffect={isViewMode}
			$minHeight={minHeight}
			$maxHeight={maxHeight}
			$error={error}
			$warning={warning}
			$info={info}
			$disabled={disabled}
			$readonly={readonly}
			onFocus={onFocus}
			onBlur={onBlur}
			onKeyDown={onKeyDown}
			data-role={DataRoles.MarkdownEditor.Input.Wrapper}
		>
			<StyledMarkdownEditorInput
				{...placeholderProps}
				$hasFocus={focused && !isViewMode}
				role="textbox"
				aria-multiline="true"
				aria-labelledby={ariaLabelledby}
				aria-describedby={ariaDescribedby}
				aria-readonly={readonly || isViewMode || undefined}
				aria-disabled={disabled || undefined}
				aria-invalid={error || undefined}
				data-role={isViewMode ? DataRoles.MarkdownEditor.Surface.View : DataRoles.MarkdownEditor.Surface.Edit}
			/>
		</StyledMarkdownRichWrapper>
	);
};

RichEditor.displayName = "MarkdownRichEditor";
