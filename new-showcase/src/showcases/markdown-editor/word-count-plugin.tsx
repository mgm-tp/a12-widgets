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

import type { LexicalEditor } from "lexical";
import { $getRoot } from "lexical";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { MarkdownEditor, useMarkdownEditorSurfaces } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

interface WordCountPluginProps {
	onCount: (words: number) => void;
}

function countWords(editor: LexicalEditor): number {
	return editor.getEditorState().read(() => $getRoot().getTextContent().split(/\s+/).filter(Boolean).length);
}

// A plugin is a component rendered inside the editor. It renders nothing itself and
// stays mounted across mode switches. `useMarkdownEditorSurfaces` gives it both Lexical
// editors, so it can follow whichever one the user is looking at.
function WordCountPlugin({ onCount }: WordCountPluginProps): null {
	const { richEditor, sourceEditor, isSourceMode } = useMarkdownEditorSurfaces();
	const editor = isSourceMode ? sourceEditor : richEditor;

	useEffect(() => {
		if (!editor) {
			return;
		}

		onCount(countWords(editor));

		return editor.registerUpdateListener(() => onCount(countWords(editor)));
	}, [editor, onCount]);

	return null;
}

const INITIAL_MARKDOWN = `# Word count

Type here and watch the counter under the editor. The plugin listens to the
editor directly, so it does not wait for the debounced \`onChange\`.
`;

export function MarkdownEditorWordCountPlugin(): ReactElement {
	const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);
	const [words, setWords] = useState(0);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
			<MarkdownEditor
				id="markdown-editor-word-count"
				label="Description"
				value={markdown}
				onChange={setMarkdown}
				plugins={<WordCountPlugin onCount={setWords} />}
				allowedModes={["edit", "source"]}
				minHeight={220}
				maxHeight={400}
			/>
			<p style={{ margin: 0 }}>
				<strong>{words}</strong> {words === 1 ? "word" : "words"}
			</p>
		</div>
	);
}
