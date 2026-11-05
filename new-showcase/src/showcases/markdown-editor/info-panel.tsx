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

import { useExtensionComponent } from "@lexical/react/useExtensionComponent";
import type { ReactElement } from "react";
import { useState } from "react";

import type { InfoPanelHost } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import {
	InfoPanelHostContext,
	MarkdownEditor,
	MdastInfoPanelExtension
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

// Module scope: a new array on every render would rebuild the editor and lose the document.
const EXTENSIONS = [MdastInfoPanelExtension];

// The extension brings its own toolbar menu. `useExtensionComponent` hands it out,
// and because it is a hook the lookup has to happen in a component rendered inside the editor.
function PanelMenu(): ReactElement {
	const Menu = useExtensionComponent(MdastInfoPanelExtension);

	return <Menu />;
}

const TOOLBAR = (
	<MarkdownEditor.Toolbar>
		<MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.BoldButton />
			<MarkdownEditor.ItalicButton />
		</MarkdownEditor.ToolbarGroup>
		<MarkdownEditor.ToolbarSeparator />
		<MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.HeadingMenu />
			<MarkdownEditor.BulletListButton />
			<PanelMenu />
		</MarkdownEditor.ToolbarGroup>
		<MarkdownEditor.ModeMenu />
	</MarkdownEditor.Toolbar>
);

// Application data for the extension. This host lets users add three of the five panel
// types. Panels already in the document keep rendering whatever type they carry.
const HOST: InfoPanelHost = { insertableTypes: new Set(["info", "note", "warning"]) };

const INITIAL_MARKDOWN = `# Info panels

:::info
Panels are \`:::name\` block directives. Put the caret in one and use the panel
menu to change its type or remove the panel.
:::

:::error
This host does not offer the **error** type in the menu, but a panel that is
already in the document still renders.
:::

Switch to **Source** to see the directives.
`;

export function MarkdownEditorInfoPanel(): ReactElement {
	const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
			<InfoPanelHostContext.Provider value={HOST}>
				<MarkdownEditor
					id="markdown-editor-info-panel"
					label="Description"
					value={markdown}
					onChange={setMarkdown}
					extensions={EXTENSIONS}
					toolbar={TOOLBAR}
					allowedModes={["edit", "source", "view"]}
					minHeight={300}
				/>
			</InfoPanelHostContext.Provider>
			<details>
				<summary>Markdown value</summary>
				<pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>{markdown}</pre>
			</details>
		</div>
	);
}
