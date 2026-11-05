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

import { configExtension, getExtensionDependencyFromEditor } from "@lexical/extension";
import type { MdastExportHandler, MdastImportHandler } from "@lexical/mdast";
import { MdastImportExtension } from "@lexical/mdast";
import type { LexicalEditor } from "lexical";
import {
	$createNodeSelection,
	$getEditor,
	$getNearestNodeFromDOMNode,
	$setSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	defineExtension
} from "lexical";
import { directiveFromMarkdown } from "mdast-util-directive";

import type { DirectiveKind, DirectiveMdast } from "../nodes/unknown-directive-node.js";
import {
	$createUnknownDirectiveNode,
	$isUnknownDirectiveNode,
	UnknownDirectiveNode
} from "../nodes/unknown-directive-node.js";

import { enhancedDirective, enhancedDirectiveToMarkdown } from "./enhanced-micromark-directive/index.js";

/**
 * Builds the registry key an importer claims one directive name under, like
 * `"containerDirective:note"`.
 *
 * The mdast import registry picks a handler by node type. But `:::note` and `:::warning`
 * both parse to the same type, `containerDirective`. A handler registered under that type
 * gets both, so it cannot claim one name on its own.
 *
 * The fix is this key. It adds the name, so two importers can sit side by side.
 * {@link MdastUnknownDirectiveExtension} registers the one real handler for the type and
 * hands each directive to the importer whose key matches its name.
 *
 * ```ts
 * configExtension(MdastImportExtension, {
 *   importRules: [{ type: directiveImportType("containerDirective", "note"), $import: $importMyPanel }]
 * })
 * ```
 */
export function directiveImportType(kind: DirectiveKind, name: string): string {
	return `${kind}:${name}`;
}

/** The keys {@link directiveImportType} writes, told apart from ordinary import rules. */
const DIRECTIVE_IMPORT_TYPE = /^(?:container|leaf|text)Directive:.+$/;

interface UnknownDirectiveOutput {
	/**
	 * `kind:name` -> importer, read back out of the mdast registry once per editor.
	 * A directive whose key is not in here becomes a placeholder.
	 */
	importersByKey: ReadonlyMap<string, MdastImportHandler<DirectiveMdast>>;
}

/*
 * Handles every directive in the document. The import registry takes one handler per node
 * type and the three shapes are three types, so this one function serves all of them:
 * a claimed name goes to whoever claimed it, a name nobody claimed becomes a placeholder.
 */
const $importDirective: MdastImportHandler<DirectiveMdast> = (node, ctx) => {
	const { output } = getExtensionDependencyFromEditor($getEditor(), MdastUnknownDirectiveExtension);
	const $importClaimed = output.importersByKey.get(directiveImportType(node.type, node.name));

	return $importClaimed ? $importClaimed(node, ctx) : $createUnknownDirectiveNode(node);
};

/** Gives the serializer back exactly what was parsed, so the markdown comes out unchanged. */
const $exportUnknownDirective: MdastExportHandler = (node) =>
	$isUnknownDirectiveNode(node) ? node.getDirectiveMdast() : null;

/**
 * Makes a click on a placeholder select it. Once selected, the editor's normal keys apply:
 * Backspace or Delete removes it, the arrow keys step over it.
 */
function registerUnknownDirectiveSelection(editor: LexicalEditor): () => void {
	return editor.registerCommand<MouseEvent>(
		CLICK_COMMAND,
		(event) => {
			// The click lands inside the placeholder's DOM, so the nearest Lexical node
			// tells us whether a placeholder was hit — no selector to keep in sync.
			const target = event.target instanceof HTMLElement ? $getNearestNodeFromDOMNode(event.target) : null;

			if (!$isUnknownDirectiveNode(target)) {
				return false;
			}

			const nodeSelection = $createNodeSelection();

			nodeSelection.add(target.getKey());
			$setSelection(nodeSelection);

			return true;
		},
		COMMAND_PRIORITY_LOW
	);
}

/**
 * Shows a placeholder box for any directive the editor does not know,
 * so text written by other tools comes back out of the editor unchanged.
 *
 * Other tools write their own content as directives, like a Docusaurus `:::tip`
 * or a `:::chart` from some plugin. This editor cannot draw those, but it must not lose them.
 * So each one becomes a read-only box you can click, select and delete
 * and saving writes the original markdown back:
 *
 * ```md
 * :::chart{type="bar"}
 * sales, 42
 * :::
 * ```
 *
 * Put that markdown in the editor, edit the rest of the document, read the value back:
 * the `:::chart` block comes out character for character the same, name and attributes and all.
 * The box holds the parsed directive and writes that same directive back, so nothing is lost.
 *
 * This extension also turns the `:::` grammar on, once, for everyone.
 * Directives nest on three colons at every level and that is how they are written back:
 *
 * ```md
 * :::warning
 * heads up
 *
 * :::info
 * detail
 * :::
 *
 * footer
 * :::
 * ```
 *
 * Three colons, always. Four or more is a paragraph, not a fence.
 *
 * An extension that CAN draw a directive claims the name with {@link directiveImportType},
 * in the same call that says how to write it back out. List this extension as a dependency
 * as well, because it is what reads the claims:
 *
 * ```ts
 * defineExtension({
 *   name: "Spoiler",
 *   nodes: [SpoilerNode],
 *   dependencies: [
 *     MdastUnknownDirectiveExtension,
 *     configExtension(MdastImportExtension, {
 *       importRules: [{ type: directiveImportType("textDirective", "spoiler"), $import: $importSpoiler }],
 *       exportRules: [{ type: SpoilerNode.getType(), $export: $exportSpoiler }]
 *     })
 *   ]
 * })
 * ```
 *
 * Leave that dependency out and nothing parses `:spoiler[…]` at all, so the claim never fires.
 *
 * Block and inline are separate. Claiming `:spoiler[…]` does not claim `:::spoiler`
 * and the other way round. Claim both if you want both.
 */
export const MdastUnknownDirectiveExtension = defineExtension({
	name: "@a12/mdast/UnknownDirective",
	nodes: [UnknownDirectiveNode],
	register: registerUnknownDirectiveSelection,

	build: (_editor, _config, state): UnknownDirectiveOutput => {
		const importersByKey = new Map<string, MdastImportHandler<DirectiveMdast>>();

		// The claims are already in the mdast registry under `kind:name` keys. The importer
		// never dispatches those itself — it looks up the plain node type — so they sit
		// there unread and we pick them back up here.
		// First claim on a key wins, and merging prepends what was added closer to the editor
		// root, so an extension added earlier cannot have its names taken by a later one.
		for (const rule of state.getDependency(MdastImportExtension).config.importRules) {
			if (DIRECTIVE_IMPORT_TYPE.test(rule.type) && !importersByKey.has(rule.type)) {
				importersByKey.set(rule.type, rule.$import);
			}
		}

		return { importersByKey };
	},

	dependencies: [
		configExtension(MdastImportExtension, {
			importRules: [
				{ type: "containerDirective", $import: $importDirective },
				{ type: "leafDirective", $import: $importDirective },
				{ type: "textDirective", $import: $importDirective }
			],
			exportRules: [{ type: "mde-unknown-directive", $export: $exportUnknownDirective }],
			micromarkExtensions: [enhancedDirective()],
			mdastExtensions: [directiveFromMarkdown()],
			toMarkdownExtensions: [enhancedDirectiveToMarkdown()]
		})
	]
});
