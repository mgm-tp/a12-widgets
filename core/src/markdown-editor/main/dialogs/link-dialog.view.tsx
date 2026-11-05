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

import { $createLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent } from "@lexical/utils";
import type { LexicalEditor } from "lexical";
import { $createTextNode, $getSelection, $isRangeSelection } from "lexical";
import type { FC, KeyboardEvent, ReactElement, RefObject } from "react";
import { useContext, useRef, useState } from "react";
import { Key } from "ts-key-enum";

import { Button } from "../../../button/main/button.view.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { TextField } from "../../../input/text-field/main/template/text-field.tpl.view.js";
import { ModalOverlay } from "../../../modal-overlay/main/modal-overlay.view.js";
import { composeLink } from "../modes/source-commands.js";
import { isAllowedLinkUrl } from "../utils/helpers.js";

import {
	StyledDialog,
	StyledDialogBody,
	StyledDialogError,
	StyledDialogFooter,
	StyledDialogHeading
} from "./dialogs.styled.js";

/** Reads whether the caret sits in a link, that link's URL, and whether nothing is selected. */
function readLinkState(editor: LexicalEditor): { isLink: boolean; href: string; selectionEmpty: boolean } {
	return editor.getEditorState().read(() => {
		const selection = $getSelection();

		if (!$isRangeSelection(selection)) {
			return { isLink: false, href: "", selectionEmpty: true };
		}

		const link = $findMatchingParent(selection.anchor.getNode(), (node) => $isLinkNode(node));

		return {
			isLink: link !== null,
			href: $isLinkNode(link) ? link.getURL() : "",
			selectionEmpty: selection.isCollapsed()
		};
	});
}

interface LinkDialogProps {
	/** In source mode the dialog writes markdown text. In edit mode it works on the rich editor. */
	isSourceMode: boolean;

	/** Takes a composed `[text](url)` fragment and drops it into the source text. */
	onInsertMdToSource: (markdown: string) => void;

	/** The text the user selected in source mode. It becomes the link label. */
	initialText?: string;

	/** Closes the dialog and returns focus to the editor. */
	onClose: () => void;
}

/**
 * Dialog for adding or editing a link. The typed URL goes through
 * {@link isAllowedLinkUrl} first, so `javascript:` and other blocked schemes
 * show an error instead of ending up in the text.
 *
 * Source mode can only insert. There is no link node to remove there.
 */
export const LinkDialog: FC<LinkDialogProps> = ({ isSourceMode, onInsertMdToSource, initialText, onClose }) => {
	const [richEditor] = useLexicalComposerContext();
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);

	const linkState = isSourceMode ? undefined : readLinkState(richEditor);
	const isLink = !!linkState?.isLink;
	const selectionEmpty = isSourceMode ? !initialText?.trim() : (linkState?.selectionEmpty ?? true);

	// The fields are uncontrolled, so typing does not re-render the dialog.
	// The refs keep what the user typed until submit reads it.
	const urlRef = useRef(linkState?.href ?? "");
	const textRef = useRef("");

	const [error, setError] = useState<string | undefined>(undefined);

	const closeDialog = (): void => {
		onClose();

		if (!isSourceMode) {
			richEditor.focus();
		}
	};

	const handleSubmit = (): void => {
		const trimmedUrl = urlRef.current.trim();

		// Empty and refused look the same to the user: the dialog stays open and says so.
		if (!trimmedUrl || !isAllowedLinkUrl(trimmedUrl)) {
			setError(titles?.linkInvalid ?? "Invalid or disallowed URL.");

			return;
		}

		const trimmedText = textRef.current.trim();

		if (isSourceMode) {
			const label = selectionEmpty ? trimmedText || trimmedUrl : (initialText ?? "");
			onInsertMdToSource(composeLink(label, trimmedUrl));
			closeDialog();

			return;
		}

		richEditor.focus();

		if (selectionEmpty && trimmedText) {
			// Nothing is selected, so there is no text to wrap. Add a new link node with the typed label.
			richEditor.update(() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					const link = $createLinkNode(trimmedUrl);
					link.append($createTextNode(trimmedText));
					selection.insertNodes([link]);
				}
			});
		} else {
			richEditor.dispatchCommand(TOGGLE_LINK_COMMAND, trimmedUrl);
		}

		closeDialog();
	};

	const handleRemove = (): void => {
		richEditor.focus();
		richEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		closeDialog();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === Key.Enter) {
			event.preventDefault();
			handleSubmit();
		}
	};

	/** The two fields differ only in label, role, start value and the ref they fill. */
	const renderField = (
		dataRole: string,
		label: string | undefined,
		valueRef: RefObject<string>,
		autoFocus = false
	): ReactElement => (
		<div data-role={dataRole}>
			<TextField
				label={label}
				inputProps={{ value: undefined, defaultValue: valueRef.current }}
				autoFocus={autoFocus}
				onChange={(event) => (valueRef.current = event.target.value)}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);

	return (
		<ModalOverlay onClose={closeDialog} closeOnEsc closeOnOutsideClick focusOnOpen maxWidth={512}>
			<StyledDialog
				role="dialog"
				aria-modal="true"
				aria-label={titles?.linkDialogTitle}
				data-role={DataRoles.MarkdownEditor.Dialog.Wrapper}
			>
				<StyledDialogHeading data-role={DataRoles.MarkdownEditor.Dialog.Title}>
					{titles?.linkDialogTitle}
				</StyledDialogHeading>
				<StyledDialogBody>
					{renderField(DataRoles.MarkdownEditor.Dialog.Field, titles?.linkUrlLabel, urlRef, true)}
					{selectionEmpty && renderField(DataRoles.MarkdownEditor.Dialog.Field, titles?.linkTextLabel, textRef)}
					{error && <StyledDialogError data-role={DataRoles.MarkdownEditor.Dialog.Error}>{error}</StyledDialogError>}
				</StyledDialogBody>
				<StyledDialogFooter data-role={DataRoles.MarkdownEditor.Dialog.Footer}>
					{isLink && (
						<Button
							secondary
							destructive
							label={titles?.linkRemove}
							onClick={handleRemove}
							dataRole={DataRoles.MarkdownEditor.Dialog.Action}
						/>
					)}
					<Button
						secondary
						label={titles?.cancel}
						onClick={closeDialog}
						dataRole={DataRoles.MarkdownEditor.Dialog.Action}
					/>
					<Button
						primary
						label={titles?.linkSubmit}
						onClick={handleSubmit}
						dataRole={DataRoles.MarkdownEditor.Dialog.Action}
					/>
				</StyledDialogFooter>
			</StyledDialog>
		</ModalOverlay>
	);
};

LinkDialog.displayName = "MarkdownLinkDialog";
