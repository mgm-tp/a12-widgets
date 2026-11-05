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
import { useState } from "react";

import { MarkdownEditor } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import type { MarkdownEditorProps } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

/*
 * Helpers shared by the markdown editor stories in this folder.
 *
 * The editor never holds the document, so every story has to keep the markdown in
 * state and hand it back through `value`. That wrapper, and the panel that shows the
 * markdown the host ends up with, are the same everywhere, so they live here.
 */

const VALUE_PANEL_STYLE = {
	background: "#f5f5f5",
	border: "1px solid #ddd",
	borderRadius: 4,
	padding: 12,
	fontSize: 12,
	maxHeight: 260,
	overflow: "auto",
	whiteSpace: "pre-wrap",
	margin: 0
} as const;

const VALUE_PANEL_TITLE_STYLE = {
	fontSize: 13,
	margin: "0 0 4px",
	fontWeight: 600,
	display: "flex",
	gap: 8,
	alignItems: "center"
} as const;

const VALUE_PANEL_COUNT_STYLE = {
	fontWeight: 400,
	opacity: 0.6,
	fontFamily: "ui-monospace, monospace",
	fontSize: 12
} as const;

export interface MarkdownValuePanelProps {
	markdown: string;

	/**
	 * Whether the markdown is still the one the story started with.
	 *
	 * Only some stories know that, so the badge is optional. Leave it out and the panel
	 * shows the markdown and its size, with no badge.
	 */
	unchanged?: boolean;
}

/**
 * Shows the markdown the host currently holds.
 *
 * This is what makes a story readable the way a form sees the field: the editor shows
 * the content, this shows the text that goes out on save.
 */
export function MarkdownValuePanel({ markdown, unchanged }: MarkdownValuePanelProps): ReactElement {
	const badge = unchanged === undefined ? "" : unchanged ? " · unchanged" : " · re-written by an edit";

	return (
		<div style={{ marginTop: 16 }}>
			<p style={VALUE_PANEL_TITLE_STYLE}>
				<span>Markdown the host holds</span>
				<span style={VALUE_PANEL_COUNT_STYLE}>
					{markdown.length.toLocaleString()} characters
					{badge}
				</span>
			</p>
			<pre style={VALUE_PANEL_STYLE}>{markdown}</pre>
		</div>
	);
}

export interface ControlledMarkdownEditorProps extends MarkdownEditorProps {
	/** Shows the markdown the host holds in a panel under the editor. */
	showValuePanel?: boolean;
}

/**
 * Keeps the markdown in state, the way a host application does, and still reports every
 * edit to the story's `onChange` so the actions panel sees it.
 *
 * With `showValuePanel`, the markdown the host ends up with is shown under the editor.
 * That is what the stories about round-trips and about the emitted value need.
 */
export function ControlledMarkdownEditor({
	value,
	onChange,
	showValuePanel,
	...props
}: ControlledMarkdownEditorProps): ReactElement {
	const [markdown, setMarkdown] = useState(value);

	return (
		<>
			<MarkdownEditor
				{...props}
				value={markdown}
				onChange={(next) => {
					setMarkdown(next);
					onChange(next);
				}}
			/>
			{showValuePanel ? <MarkdownValuePanel markdown={markdown} unchanged={markdown === value} /> : null}
		</>
	);
}

/*
 * Storybook's lint rules want a default export from every file under `stories/`, and
 * React's fast refresh rule wants that export to be a component. The wrapper is the one
 * a story reaches for first, so it is the default as well as a named export.
 */
export default ControlledMarkdownEditor;
