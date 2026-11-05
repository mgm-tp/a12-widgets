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

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

import { useLatest, useUnmount } from "../../../common/main/hooks.js";
import type { MarkdownEditorEmitMode } from "../markdown-editor.api.js";

/**
 * Marks an update that put the host's `value` into the document,
 * so it is not mistaken for something the user typed.
 *
 * {@link MarkdownValueBridgeOptions.write} has to set this tag, because the bridge
 * ignores updates that carry it. Without it, putting the host's own value into the
 * editor would look like an edit and be sent right back to the host.
 */
export const EXTERNAL_VALUE_TAG = "external-value";

/**
 * Reports a surface's waiting edit now, instead of when the debounce would have run.
 *
 * Does nothing unless the user actually typed something, so it is safe to call at any time
 * — on blur, on a mode switch, on unmount. Calling it when nobody edited anything reports nothing,
 * which is what keeps the host's markdown untouched.
 */
export type FlushPendingEdit = () => void;

/** What a surface passes to {@link useMarkdownValueBridge}, apart from its own conversions. */
export interface SurfaceValueBridgeOptions {
	value: string;

	onChange: (markdown: string) => void;

	emitMode?: MarkdownEditorEmitMode;

	emitDebounceMs?: number;

	/**
	 * When `false`, the surface is asleep: it neither takes new `value`s from the host
	 * nor reports its own edits. It picks the current value up again the next time
	 * it is switched on — that is the source → edit handoff.
	 *
	 * Only the rich bridge needs this: it runs in the shell, which outlives the rich surface.
	 * The source bridge sits inside the source composer and unmounts with it,
	 * so being mounted already means the same thing.
	 */
	enabled?: boolean;

	/**
	 * Filled in with this surface's {@link FlushPendingEdit}, and emptied again on unmount.
	 *
	 * A way to hand the flush upwards, for a surface the shell cannot call the hook for itself.
	 * The source editor needs it: its bridge sits inside the nested composer,
	 * a child of the shell. The rich surface does not, because the shell calls the hook directly
	 * and already has the returned flush in hand.
	 */
	flushPendingEditRef?: RefObject<FlushPendingEdit | null>;
}

interface MarkdownValueBridgeOptions extends SurfaceValueBridgeOptions {
	/**
	 * Turns the editor's document into markdown.
	 * Keep its identity stable — the effects below re-run when it changes.
	 */
	read: () => string;

	/**
	 * Replaces the editor's document with `markdown`,
	 * in one update tagged {@link EXTERNAL_VALUE_TAG}. Keep its identity stable.
	 */
	write: (markdown: string) => void;
}

/** What the bridge remembers between renders. Changing any of it must not re-render. */
interface BridgeState {
	/** The markdown we last wrote into the document, so we don't write it twice. */
	lastApplied: string | null;

	/**
	 * The markdown the document last held. Answers one question:
	 * did the text really change? It stops two false alarms — a repaint that touched nodes but no text,
	 * and our own text arriving again from the host.
	 *
	 * `lastApplied` cannot answer it. That one holds the host's string
	 * and the document does not always give the same string back: write `"- one\n"` and `read` returns `"- one"`.
	 * Compared against `lastApplied`, an untouched document looks edited.
	 */
	lastDocument: string | null;

	/** There is an edit we have not reported yet. */
	dirty: boolean;

	debounceTimer: ReturnType<typeof setTimeout> | undefined;

	/** A new value from the host that arrived while typing with an IME. */
	pendingExternal: string | null;

	/** The user is typing with an IME right now. */
	composing: boolean;
}

/**
 * Keeps a Lexical editor and the host's markdown `value` in sync, in both
 * directions: tell the host about the user's edits when
 * {@link MarkdownEditorEmitMode} says to, and put a new `value` from the host into
 * the document.
 *
 * Both directions have to ignore their own echo. After we tell the host about an
 * edit, it gives us the same text back as a new `value`. Putting that text into
 * the document again would move the caret back to the start.
 *
 * The rich and the source editor hold the same text in a different shape, so both
 * need this. Only the two conversions differ, which is why they are passed in as
 * {@link MarkdownValueBridgeOptions.read} and {@link MarkdownValueBridgeOptions.write}.
 * Everything the host can notice — when `onChange` fires, what a blur sends, what
 * happens while typing with an IME — is decided here, in one place, so the two
 * cannot end up behaving differently.
 *
 * Takes the editor from the composer around it, so every caller has to sit inside
 * the composer it means.
 */
export function useMarkdownValueBridge({
	value,
	onChange,
	emitMode = "debounced",
	emitDebounceMs = 300,
	enabled = true,
	read,
	write,
	flushPendingEditRef
}: MarkdownValueBridgeOptions): FlushPendingEdit {
	const [editor] = useLexicalComposerContext();

	// `lastApplied` starts as `null` rather than `value`,
	// so that the first value is still written into the empty document on mount.
	const stateRef = useRef<BridgeState>({
		lastApplied: null,
		lastDocument: null,
		dirty: false,
		debounceTimer: undefined,
		pendingExternal: null,
		composing: false
	});

	// Hosts usually pass an inline arrow function, so `onChange` is a new function
	// on every render. Read it through a ref to keep the effects below from re-running.
	const latestOnChange = useLatest(onChange);

	const emit = useCallback(
		(markdown: string): void => {
			const state = stateRef.current;

			// Nodes changed, text did not, so nobody edited anything.
			// Code highlighting does this: it splits a code block into coloured pieces once its language
			// finishes loading, long after the document is ready.
			// Without the check, opening a page would report an edit nobody made
			// and the host's markdown would be replaced by the editor's version of it.
			if (markdown === state.lastDocument) {
				return;
			}

			state.lastDocument = markdown;
			latestOnChange.current(markdown);
		},
		[latestOnChange]
	);

	const applyExternal = useCallback(
		(markdown: string): void => {
			const state = stateRef.current;

			// Remember it *before* writing, not after: a discrete write applies right away,
			// so the update listener already runs inside `write`.
			state.lastApplied = markdown;

			write(markdown);

			// Read what the document made of it. Later updates are compared against this,
			// so it has to be what the document holds, not what the host sent.
			//
			// Overwriting here also discards the text we last sent the host, which we need:
			// we send `A`, the host sends `B`, the document now holds `B`, then the host
			// sends `A` again (an undo, an old draft). `A` has to be written.
			// If it were still stored here, the check below would treat it as our own text
			// and skip the write, leaving the host on `A` and the editor on `B`.
			state.lastDocument = read();
		},
		[write, read]
	);

	const flush = useCallback((): void => {
		const state = stateRef.current;

		clearTimeout(state.debounceTimer);
		state.debounceTimer = undefined;

		if (state.dirty) {
			state.dirty = false;
			emit(read());
		}
	}, [emit, read]);

	// Let a shell that cannot call this hook itself reach the flush.
	useEffect(() => {
		if (!flushPendingEditRef) {
			return undefined;
		}

		flushPendingEditRef.current = flush;

		return (): void => {
			flushPendingEditRef.current = null;
		};
	}, [flushPendingEditRef, flush]);

	// Editor → host. Updates that only moved the caret change no nodes,
	// so they are not edits and are skipped.
	useEffect(
		() =>
			editor.registerUpdateListener(({ dirtyElements, dirtyLeaves, tags }) => {
				if (!enabled || tags.has(EXTERNAL_VALUE_TAG) || (dirtyElements.size === 0 && dirtyLeaves.size === 0)) {
					return;
				}

				if (emitMode === "change") {
					emit(read());

					return;
				}

				const state = stateRef.current;
				state.dirty = true;

				if (emitMode === "debounced") {
					clearTimeout(state.debounceTimer);
					state.debounceTimer = setTimeout(flush, emitDebounceMs);
				}
			}),
		[editor, emit, read, flush, emitMode, emitDebounceMs, enabled]
	);

	// Host → editor. Only a value we have not seen before is written into the document:
	// not the one the host just returned to us and not one the document already holds.
	useEffect(() => {
		const state = stateRef.current;

		if (!enabled) {
			return;
		}

		// Our own text, returned unchanged.
		// The document already holds this, so writing it again would only move the caret.
		if (value === state.lastDocument) {
			state.lastApplied = value;

			return;
		}

		if (value === state.lastApplied) {
			return;
		}

		if (state.composing) {
			// Hold it back until the IME is done,
			// so the text is never replaced half-way through typing a character.
			state.pendingExternal = value;

			return;
		}

		applyExternal(value);
	}, [value, enabled, applyExternal]);

	/*
	 * Track IME input, and write a held-back value once it is over.
	 *
	 * The listeners follow the root element via `registerRootListener`,
	 * because a root comes and goes with its surface. Reading it once
	 * would leave them on a detached element — or attach nothing at all,
	 * when the widget starts in source mode and no rich `ContentEditable` exists yet.
	 */
	useEffect(() => {
		const onCompositionStart = (): void => {
			stateRef.current.composing = true;
		};

		const onCompositionEnd = (): void => {
			const state = stateRef.current;
			state.composing = false;

			if (state.pendingExternal !== null) {
				const pending = state.pendingExternal;
				state.pendingExternal = null;
				applyExternal(pending);
			}
		};

		return editor.registerRootListener((rootElement, prevRootElement) => {
			prevRootElement?.removeEventListener("compositionstart", onCompositionStart);
			prevRootElement?.removeEventListener("compositionend", onCompositionEnd);
			rootElement?.addEventListener("compositionstart", onCompositionStart);
			rootElement?.addEventListener("compositionend", onCompositionEnd);
		});
	}, [editor, applyExternal]);

	// Send any waiting edit before this surface goes away. Switching modes unmounts
	// the surface that owns the text, so this is the last chance to report it.
	useUnmount(flush);

	return flush;
}
