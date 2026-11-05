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

import type { NamedSignalsOutput } from "@lexical/extension";
import { namedSignals, safeCast } from "@lexical/extension";
import type { ReactExtension } from "@lexical/react/ReactExtension";
import { useExtensionDependency } from "@lexical/react/useExtensionComponent";
import type { ExtensionConfigBase, LexicalExtension } from "lexical";
import { declarePeerDependency, defineExtension } from "lexical";
import type { Context } from "react";
import { useContext, useEffect } from "react";

/**
 * Makes an extension that carries data from the application into the editor.
 *
 * The problem it solves: a Lexical node builds its DOM outside React
 * and a command runs outside React, so neither can read a React context.
 * But an extension can hold signals and a small React component can copy the context into them.
 * Every feature that needs application data wants those same pieces, so this writes them once.
 *
 * Give it a context and the values to start from:
 *
 * ```ts
 * export interface MentionHost {
 *   people: readonly string[];
 * }
 *
 * export const MentionHostContext = createContext<MentionHost>({ people: [] });
 *
 * export const MentionHostExtension = defineHostBridgeExtension<MentionHost, "@a12/MentionHost">(
 *   "@a12/MentionHost",
 *   MentionHostContext,
 *   { people: [] }
 * );
 * ```
 *
 * The feature that wants the data depends on it, so it always comes along:
 *
 * ```ts
 * export const MentionExtension = defineExtension({
 *   name: "@a12/Mention",
 *   nodes: [MentionNode],
 *   dependencies: [MentionHostExtension]
 * });
 * ```
 *
 * The consumer registers that one feature and puts the context above the editor:
 *
 * ```tsx
 * const EXTENSIONS = [MentionExtension]
 * <MentionHostContext.Provider value={{ people }}>
 *   <MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EXTENSIONS} />
 * </MentionHostContext.Provider>
 * ```
 *
 * Read it from React:
 *
 * ```tsx
 * const people = useExtensionSignalValue(MentionHostExtension, "people");
 * ```
 *
 * Or from anywhere else — a command, a node, a transform:
 *
 * ```ts
 * const { output } = getPeerDependencyFromEditorOrThrow<typeof MentionHostExtension>(
 *   editor,
 *   "@a12/MentionHost"
 * );
 * const people = output.people.value;
 * ```
 *
 * Two things to know:
 *
 * - The context and the defaults must have the same keys. Each key becomes a signal of that name.
 * - React is a **peer** dependency, so an editor built without React still works.
 *   There is no context to read, so the signals keep the defaults,
 *   which is what a headless markdown conversion needs.
 */
export function defineHostBridgeExtension<Config extends ExtensionConfigBase, Name extends string>(
	name: Name,
	context: Context<Config>,
	defaults: Config
): LexicalExtension<Config, Name, NamedSignalsOutput<Config>, unknown> {
	function HostBridge(): null {
		const value = useContext(context);
		const { output } = useExtensionDependency(extension);

		useEffect(() => {
			// Key by key: a fresh context object on every render
			// would otherwise wake every subscriber, even for values that did not change.
			for (const key of Object.keys(value) as (keyof Config)[]) {
				const signal = output[key];

				// `peek()` reads without subscribing.
				// Plain `.value` would make this effect a subscriber of the very signals it writes,
				// so its own write would schedule it to run again.
				if (signal.peek() !== value[key]) {
					signal.value = value[key];
				}
			}
		}, [output, value]);

		return null;
	}

	HostBridge.displayName = `HostBridge(${name})`;

	const extension = defineExtension({
		name,
		config: safeCast<Config>(defaults),
		build: (_editor, config) => namedSignals(config),
		peerDependencies: [
			declarePeerDependency<typeof ReactExtension>("@lexical/react/React", {
				decorators: [HostBridge]
			})
		]
	});

	return extension;
}
