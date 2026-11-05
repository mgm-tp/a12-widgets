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

import type { ReactElement } from "react";
import { useRef, useState } from "react";

import { Button } from "@com.mgmtp.a12.widgets/widgets-core";
import type { MarkdownEditorHandle } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { MarkdownEditor } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

const INITIAL_MARKDOWN = `# Meeting notes

Select some text and click **Quote selection**, or insert the template below.
`;

const TEMPLATE = `
## Action items

- [ ] Owner — task
`;

export function MarkdownEditorHandleExample(): ReactElement {
	const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);
	const [savedAt, setSavedAt] = useState<string | null>(null);

	// Filled once the editor has rendered. It works on the surface the user can see,
	// so the buttons below behave the same in edit and in source mode.
	const editor = useRef<MarkdownEditorHandle>(null);

	const insertTemplate = (): void => editor.current?.insertMarkdown(TEMPLATE);

	const quoteSelection = (): void => {
		const selected = editor.current?.getSelectedMarkdown();

		if (selected) {
			editor.current?.insertMarkdown(`> ${selected}`);
		}
	};

	// `onChange` is debounced by default. A save that skips the blur, like this button
	// or an autosave timer, flushes first so the last keystrokes are not left behind.
	const save = (): void => {
		editor.current?.flush();
		setSavedAt(new Date().toLocaleTimeString());
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
			<div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
				<Button label="Insert template" onClick={insertTemplate} />
				<Button label="Quote selection" onClick={quoteSelection} />
				<Button primary label="Save" onClick={save} />
			</div>
			<MarkdownEditor
				id="markdown-editor-handle"
				label="Notes"
				value={markdown}
				onChange={setMarkdown}
				editorRef={editor}
				allowedModes={["edit", "source"]}
				minHeight={220}
				maxHeight={400}
			/>
			<details>
				<summary>Markdown value{savedAt ? ` (saved at ${savedAt})` : ""}</summary>
				<pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>{markdown}</pre>
			</details>
		</div>
	);
}
