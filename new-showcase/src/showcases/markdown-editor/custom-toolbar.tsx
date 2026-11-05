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

import { $getSelection, $isRangeSelection } from "lexical";
import type { ReactElement } from "react";
import { useState } from "react";

import { MarkdownEditor } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

const INITIAL_MARKDOWN = `# Release notes

A **minimal** toolbar: just the controls this form needs, plus a custom
"Insert signature" button.
`;

export function MarkdownEditorCustomToolbar(): ReactElement {
	const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
			<MarkdownEditor
				id="markdown-editor-custom-toolbar"
				label="Release notes"
				value={markdown}
				onChange={setMarkdown}
				allowedModes={["edit", "source", "view"]}
				minHeight={220}
				maxHeight={400}
				toolbar={
					<MarkdownEditor.Toolbar>
						<MarkdownEditor.ToolbarGroup>
							<MarkdownEditor.BoldButton />
							<MarkdownEditor.ItalicButton />
							<MarkdownEditor.CodeButton />
						</MarkdownEditor.ToolbarGroup>
						<MarkdownEditor.ToolbarSeparator />
						<MarkdownEditor.ToolbarGroup>
							<MarkdownEditor.HeadingMenu />
							<MarkdownEditor.BulletListButton />
							<MarkdownEditor.OrderedListButton />
						</MarkdownEditor.ToolbarGroup>
						<MarkdownEditor.ToolbarSeparator />
						<MarkdownEditor.ToolbarGroup>
							<MarkdownEditor.LinkButton />
							{/*
							 * A custom control gets the toolbar context. In source mode the document is
							 * plain text, so it inserts Markdown; otherwise it edits the rich editor.
							 */}
							<MarkdownEditor.ToolbarButton
								icon="signature"
								title="Insert signature"
								onClick={({ richEditor, sourceCommands }) =>
									sourceCommands
										? sourceCommands.insertText("\n\n---\n\n*Kind regards*\n")
										: richEditor.update(() => {
												const selection = $getSelection();

												if ($isRangeSelection(selection)) {
													selection.insertParagraph();
													selection.insertText("Kind regards");
												}
											})
								}
							/>
						</MarkdownEditor.ToolbarGroup>
						<MarkdownEditor.ToolbarSeparator />
						{/* A custom toolbar gets no mode menu on its own. Put it where you want it. */}
						<MarkdownEditor.ModeMenu />
					</MarkdownEditor.Toolbar>
				}
			/>
			<details>
				<summary>Markdown value</summary>
				<pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>{markdown}</pre>
			</details>
		</div>
	);
}
