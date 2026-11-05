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

import type { FC } from "react";
import { useContext, useRef, useState } from "react";

import { AttachedPortal } from "../../../../attached-portal/main/attached-portal.view.js";
import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../../common/main/data-roles.js";
import type { MarkdownEditorProps } from "../../markdown-editor.api.js";
import { useMarkdownEditorSurfaces } from "../../shared/surfaces-context.js";
import { useMarkdownEditorToolbarState } from "../../shared/toolbar-context.js";
import { focusEditor } from "../../utils/helpers.js";
import { ToolbarButton } from "../toolbar-button.view.js";
import type { TableSize } from "../toolbar-command-registry.js";
import { useToolbarCommand } from "../toolbar-command-registry.js";

import { TableSizePicker } from "./table-size-picker.view.js";

/**
 * The table button. It opens the size grid and nothing else: pick a size, get a table.
 * Changing a table that is already there (add a row, delete a column, delete the table)
 * is done from the right-click menu inside the table, which works on the row and column
 * under the pointer.
 *
 * Works in source mode too. The grid writes the same GFM the rich editor builds.
 */
export const TableMenu: FC<MarkdownEditorProps.ToolbarControlProps> = ({ disabled: disabledProp }) => {
	const runCommand = useToolbarCommand();
	const { disabled: toolbarDisabled, features, richEditor, sourceEditor, isSourceMode } = useMarkdownEditorSurfaces();
	const toolbarState = useMarkdownEditorToolbarState();
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const [open, setOpen] = useState(false);

	// The button element, so the grid has something to hang off.
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	const disabled = disabledProp || toolbarDisabled;

	/**
	 * Inserts the picked table, closes the grid and puts the caret back in the text,
	 * so the next keystroke goes into the new table rather than nowhere.
	 */
	const insertTable = (size: TableSize): void => {
		runCommand("insertTable", size);
		setOpen(false);

		// `sourceEditor` is null for one render after a mode switch.
		const editor = isSourceMode ? sourceEditor : richEditor;

		if (editor) {
			focusEditor(editor);
		}
	};

	// No button when tables are off: it writes syntax the editor cannot read back.
	if (!features.table) {
		return null;
	}

	return (
		<>
			<ToolbarButton
				icon="table"
				title={titles?.tableMenu}
				active={toolbarState.isInTable}
				disabled={disabled}
				dataRole={DataRoles.MarkdownEditor.ToolbarItem}
				buttonRef={(ref): void => {
					triggerRef.current = ref;
				}}
				buttonAttributes={{ "aria-haspopup": "grid", "aria-expanded": open }}
				onClick={() => setOpen((wasOpen) => !wasOpen)}
			/>

			{open && (
				<AttachedPortal
					referenceElement={triggerRef.current ?? undefined}
					adjustPositionToScreen
					closeOnOutsideClick
					focusOnOpen={false}
					onVisibilityChange={(visible): void => {
						if (!visible) {
							setOpen(false);
						}
					}}
					onClickOutside={() => setOpen(false)}
				>
					<TableSizePicker onPick={insertTable} />
				</AttachedPortal>
			)}
		</>
	);
};

TableMenu.displayName = "MarkdownTableMenu";
