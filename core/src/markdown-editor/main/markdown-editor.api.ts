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

import type { AnyLexicalExtensionArgument, LexicalEditor } from "lexical";
import type { KeyboardEvent, ReactNode, Ref } from "react";

import type { Container, Identifiable, Styleable } from "../../common/main/base-props.js";
import type { BaseInputEventHandler, BaseInputProps } from "../../input/base/template/base.tpl.api.js";

import type { MarkdownEditorOptionalFeatures, ResolvedFeatures } from "./optional-features.js";
import type { MarkdownEditorToolbarState } from "./toolbar/toolbar-state.js";
import type { MarkdownEditorSourceCommands } from "./toolbar/use-source-commands.js";

/**
 * The editing surface presented by the {@link MarkdownEditor}.
 * - `edit` — the rich WYSIWYG editor (default).
 * - `source` — a plain-text view of the raw markdown.
 * - `view` — the rich editor rendered read-only.
 */
export type MarkdownEditorMode = "edit" | "source" | "view";

/**
 * Controls when {@link MarkdownEditorProps.onChange} fires.
 * - `change` — on every edit.
 * - `debounced` — trailing debounce (see {@link MarkdownEditorProps.emitDebounceMs}); flushed on blur and mode switch (default).
 * - `blur` — only when the editor loses focus, on a mode switch, or on unmount.
 */
export type MarkdownEditorEmitMode = "change" | "debounced" | "blur";

/**
 * Lets the host control a {@link MarkdownEditor} that is already on screen.
 * Filled in through {@link MarkdownEditorProps.editorRef}.
 *
 * Two editors sit behind it: rich text and markdown source.
 * The methods always work on the one the user can see, so the host does not have to check which.
 * The handle is the same object the whole time.
 *
 * The markdown is not here — that stays with {@link MarkdownEditorProps.value} and
 * {@link MarkdownEditorProps.onChange}. What is here is what the host cannot keep itself:
 * the caret, the undo history, and an edit that has not been sent yet.
 *
 * ```tsx
 * const editor = useRef<MarkdownEditorHandle>(null);
 *
 * <MarkdownEditor editorRef={editor} value={markdown} onChange={setMarkdown} />
 * <button onClick={() => editor.current?.insertMarkdown("## Heading\n")}>Add heading</button>
 * ```
 *
 * Methods that would change the text do nothing in `view` mode,
 * or while the field is disabled or readonly. Reading still works.
 */
export interface MarkdownEditorHandle {
	/**
	 * Which editor the user can see. A readonly field is always `"view"`.
	 * Same value {@link MarkdownEditorProps.onModeChange} gives.
	 */
	readonly mode: MarkdownEditorMode;

	/**
	 * Sends an edit that is still waiting, instead of leaving it to the debounce.
	 * Does nothing if nobody typed.
	 *
	 * Blur, a mode switch and unmount already send it.
	 * Use this for a save that skips the blur: an autosave timer, a keyboard shortcut,
	 * or the user leaving the page.
	 */
	flush(): void;

	/** Puts the caret in the editor the user can see, at the end of the text. */
	focus(): void;

	/** Takes the focus off the editor. */
	blur(): void;

	/**
	 * The selected text as markdown, or `""` if nothing is selected.
	 *
	 * In `source` mode that is the raw text the user highlighted.
	 * In `edit` mode the selected nodes are turned back into markdown, so bold text comes back as `**bold**`.
	 */
	getSelectedMarkdown(): string;

	/**
	 * Puts markdown in at the caret, replacing the selection.
	 * Adds it at the end if the editor was never focused.
	 *
	 * The host hears about it through {@link MarkdownEditorProps.onChange},
	 * the same as a keystroke, so {@link MarkdownEditorProps.emitMode} still decides when.
	 */
	insertMarkdown(markdown: string): void;

	/**
	 * Takes back the last edit on the editor the user can see.
	 * Each editor keeps its own history, so this never reaches edits made in the other mode.
	 */
	undo(): void;

	/** Puts back the last edit {@link undo} took away. */
	redo(): void;

	/**
	 * The Lexical editor behind what the user can see:
	 * the source editor in `source` mode, the rich one otherwise.
	 * Null for one render after switching to `source` mode, while that editor is still starting up.
	 *
	 * The two hold different documents: nodes in the rich one, plain text in the source one.
	 * Read from either. To write, use {@link insertMarkdown} — it knows both.
	 */
	getActiveEditor(): LexicalEditor | null;
}

type OmittedInputBaseProps = Omit<BaseInputProps, "ariaDescribedby" | "breakTooltipsToNewLine">;

/**
 * Focus and blur are reported for the active editing surface — the rich editor's
 * contenteditable, or the source editor's. `onChange` carries the markdown
 * value instead of a DOM event, so it is declared separately below.
 */
type MarkdownEditorEventHandlers = Omit<BaseInputEventHandler<HTMLElement>, "onChange">;

export interface MarkdownEditorProps
	extends Styleable, Identifiable, Container, OmittedInputBaseProps, MarkdownEditorEventHandlers {
	/**
	 * The markdown content. The host application is authoritative:
	 * the editor renders this value and reports edits through {@link onChange}.
	 */
	value: string;

	/**
	 * Called with the serialized markdown whenever the content changes,
	 * subject to {@link emitMode}.
	 */
	onChange: (markdown: string) => void;

	/**
	 * Controls the active {@link MarkdownEditorMode}.
	 * When provided the component is mode-controlled and {@link onModeChange} should update it.
	 *
	 * A mode outside {@link allowedModes} is ignored: the field falls back to the first allowed one.
	 * List a mode there before driving the field into it.
	 */
	mode?: MarkdownEditorMode;

	/**
	 * The initial {@link MarkdownEditorMode} when uncontrolled.
	 * Same as {@link mode}: a mode outside {@link allowedModes} falls back to the first allowed one.
	 *
	 * @default "edit"
	 */
	initialMode?: MarkdownEditorMode;

	/**
	 * Called when the mode changes: the user picked one from the mode menu,
	 * or a {@link MarkdownEditor.ModeMenu} in a toolbar of the host's own did.
	 */
	onModeChange?: (mode: MarkdownEditorMode) => void;

	/**
	 * The modes this instance offers. Modes not listed are left out of the mode menu in the toolbar,
	 * and one listed mode alone hides the menu — there is nothing to pick.
	 * That is the default: edit only, so no mode menu until the host names a second mode.
	 * A `mode` or `initialMode` outside the list falls back to the first listed mode.
	 *
	 * @default ["edit"]
	 * @example
	 * <MarkdownEditor value={markdown} onChange={setMarkdown} allowedModes={["edit", "view"]} />
	 */
	allowedModes?: MarkdownEditorMode[];

	/**
	 * When to emit {@link onChange}.
	 *
	 * Serializing the document walks the whole mdast tree, so emitting on every keystroke costs O(document).
	 * On a 2,000-block document a keystroke costs roughly three times as much on `"change"`
	 * as it does debounced. The exact figures depend on the machine.
	 * Set `"change"` explicitly if the host needs an emit per edit and its documents are small.
	 * @default "debounced"
	 */
	emitMode?: MarkdownEditorEmitMode;

	/**
	 * Trailing debounce window in milliseconds for `emitMode: "debounced"`.
	 * @default 300
	 */
	emitDebounceMs?: number;

	/**
	 * Placeholder shown while the editor is empty.
	 */
	placeholder?: string;

	/**
	 * Puts the caret in the editor once it has rendered, at the end of the text —
	 * the same place a `<textarea autofocus>` puts it. Works for both editable surfaces:
	 * `edit` focuses the rich text, `source` focuses the raw markdown.
	 *
	 * Read on the first render only, like the `autoFocus` of a plain `<input>`.
	 * Setting it later does nothing and switching modes afterwards DOES NOT
	 * take the focus back off whatever the user is on.
	 *
	 * Ignored when there is nothing to type in: in `view` mode,
	 * and while {@link BaseInputProps.readonly} or {@link BaseInputProps.disabled} is set.
	 *
	 * Only one field on a page should ask for it.
	 *
	 * @default false
	 */
	autoFocus?: boolean;

	/**
	 * Minimum (and initial) height of the editing surface. Any CSS unit.
	 */
	minHeight?: number | string;

	/**
	 * Maximum height of the editing surface before it scrolls. Any CSS unit.
	 */
	maxHeight?: number | string;

	/**
	 * Shows the toolbar: the formatting controls, and the mode menu at the end of the bar.
	 * `view` mode keeps the bar and the menu but drops the controls. A readonly field has no bar.
	 *
	 * Off means no mode menu either, so drive the mode through {@link mode} and {@link onModeChange}.
	 *
	 * @default true
	 */
	showToolbar?: boolean;

	/**
	 * A custom toolbar composition rendered in place of the built-in toolbar,
	 * built from the `MarkdownEditor.*` toolbar components:
	 *
	 * ```tsx
	 * toolbar={
	 *   <MarkdownEditor.Toolbar>
	 *     <MarkdownEditor.ToolbarGroup>
	 *       <MarkdownEditor.BoldButton />
	 *       <MarkdownEditor.ItalicButton />
	 *     </MarkdownEditor.ToolbarGroup>
	 *   </MarkdownEditor.Toolbar>
	 * }
	 * ```
	 *
	 * Visibility follows the same rules as the built-in toolbar: it is hidden
	 * when {@link showToolbar} is `false`, in `view` mode and when {@link BaseInputProps.readonly} is set.
	 *
	 * The mode menu is not put in for you. Add `<MarkdownEditor.ModeMenu />` where you want it,
	 * or leave it out and drive the mode through {@link mode} and {@link onModeChange}.
	 */
	toolbar?: ReactNode;

	/**
	 * Picks which optional markdown this editor reads and writes. CommonMark is always on.
	 * Only the keys you list change. The rest keep their defaults.
	 *
	 * ```tsx
	 * <MarkdownEditor value={markdown} onChange={setMarkdown} features={{ table: false, highlight: true }} />
	 * ```
	 *
	 * Writing it inline like that builds a new object on every render. That is fine here:
	 * the editor compares the true/false values, not the object, so nothing happens until
	 * one of them actually differs. {@link extensions} has no such comparison
	 * an inline array there rebuilds the editor on every render, which is why it must be hoisted.
	 *
	 * Turning a key on or off rebuilds the editor and loads {@link value} in again.
	 *
	 * @see {@link MarkdownEditorOptionalFeatures} for the keys, their defaults,
	 * and what happens to markdown that already uses a construct you switched off.
	 */
	features?: MarkdownEditorOptionalFeatures;

	/**
	 * Lexical extensions registered on top of the built-in set.
	 * This is how a consumer adds their own markdown: an extension bundles a node
	 * with the rules that read it from markdown and write it back,
	 * so a custom block is parsed, rendered and serialized like any built-in one.
	 *
	 * Must be a stable reference — a new array recreates the editor
	 * and throws away its content, so define it at module scope or memoize it.
	 *
	 * ```tsx
	 * const EDITOR_EXTENSIONS = [AlertExtension];
	 *
	 * <MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EDITOR_EXTENSIONS} />
	 * ```
	 *
	 * @see {@link https://lexical.dev/docs/concepts/extensions}
	 */
	extensions?: AnyLexicalExtensionArgument[];

	/**
	 * Custom plugin components rendered inside the editor, where they can reach
	 * the {@link LexicalEditor} through `useLexicalComposerContext()` to register commands,
	 * listeners or node transforms. They are expected to render nothing themselves.
	 *
	 * They stay mounted across mode switches.
	 *
	 * ```tsx
	 * <MarkdownEditor value={markdown} onChange={setMarkdown} plugins={<MyWordCountPlugin />} />
	 * ```
	 */
	plugins?: ReactNode;

	/**
	 * Handler function for the onKeyDown event of the active editing surface.
	 *
	 * It runs after the editor's own key handling, so a key the editor already
	 * acts on (Enter, Backspace, the formatting shortcuts) has already taken
	 * effect by the time the host sees it.
	 */
	onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;

	/**
	 * Filled with a {@link MarkdownEditorHandle} once the editor has rendered,
	 * so the host can focus it, insert markdown at the caret, read the selection, undo, or send a waiting edit.
	 *
	 * ```tsx
	 * const editor = useRef<MarkdownEditorHandle>(null);
	 *
	 * <MarkdownEditor editorRef={editor} value={markdown} onChange={setMarkdown} />
	 * ```
	 *
	 * The markdown is not in here. That stays with {@link value} and {@link onChange}.
	 */
	editorRef?: Ref<MarkdownEditorHandle>;
}

/**
 * Prop interfaces of the `MarkdownEditor.*` toolbar components.
 */
export namespace MarkdownEditorProps {
	/**
	 * Props of {@link MarkdownEditor.Toolbar} — the toolbar container.
	 * It renders the ARIA `toolbar` role and provides roving-tabindex keyboard navigation
	 * (Arrow keys, Home/End) across every native `<button>` rendered inside it.
	 */
	export interface ToolbarProps extends Styleable, Identifiable, Container {}

	/**
	 * Props of {@link MarkdownEditor.ToolbarGroup} — a visual group of controls.
	 */
	export interface ToolbarGroupProps extends Styleable, Container {}

	/**
	 * Props of {@link MarkdownEditor.ToolbarSeparator} — a vertical divider
	 * between toolbar groups.
	 */
	export interface ToolbarSeparatorProps extends Styleable {}

	/**
	 * Props shared by all named toolbar controls (buttons and menus).
	 * Controls derive everything else — active state, enablement, source-mode behavior,
	 * localized titles — from the surrounding editor.
	 */
	export interface ToolbarControlProps {
		/**
		 * Disables the control in addition to the editor-driven enablement rules.
		 */
		disabled?: boolean;
	}

	/**
	 * Props of {@link MarkdownEditor.ToolbarButton} — the generic toolbar button
	 * for custom controls. It participates in the toolbar's keyboard navigation
	 * and preserves the editor selection on click, like the built-in controls.
	 */
	export interface ToolbarButtonProps {
		/**
		 * The button icon: a string is treated as a Material Symbols ligature name,
		 * any other node is rendered as-is.
		 */
		icon: ReactNode;

		/** Accessible name / tooltip of the button. */
		title: string;

		/** When true the button represents a toggle and exposes `aria-pressed`. */
		toggle?: boolean;

		/** Active (pressed) visual state; also sets `aria-pressed` for toggles. */
		active?: boolean;

		disabled?: boolean;

		/** data-role attribute for test selectors. */
		dataRole?: string;

		/**
		 * Called on click with the current {@link MarkdownEditorToolbarContextValue},
		 * so the handler can run editor commands or source-mode edits directly.
		 */
		onClick: (toolbar: MarkdownEditorToolbarContextValue) => void;
	}
}

/** The parts of the surfaces context that do not depend on the mode. */
interface MarkdownEditorSurfacesBase {
	/**
	 * The Lexical editor holding the document as rich nodes.
	 * Always present, and in rich-edit mode it is the one the user sees;
	 * in `source` mode {@link MarkdownEditorSurfacesContextValue.sourceEditor} takes over
	 * and this one keeps the last rich document.
	 */
	richEditor: LexicalEditor;

	/** True while the whole editor field is disabled. */
	disabled: boolean;

	/**
	 * The editor's {@link MarkdownEditorProps.features}, with every key answered.
	 * A custom control can read it to hide itself when the syntax it writes is off.
	 */
	features: ResolvedFeatures;

	/** Opens the link dialog for the current selection. */
	openLinkDialog: () => void;

	/** Opens the image dialog. */
	openImageDialog: () => void;
}

/**
 * Both editing surfaces and the state around them: which one the user sees,
 * what the editor is configured to do and the dialogs it can open.
 *
 * A discriminated union on `isSourceMode`, so a check narrows the source half:
 * inside `if (surfaces.isSourceMode)` the compiler knows `sourceCommands` is there
 * and no optional chaining is needed.
 *
 * Returned by {@link useMarkdownEditorSurfaces}, so a toolbar control
 * and a component mounted inside the editor both read it the same way.
 */
export type MarkdownEditorSurfacesContextValue =
	| (MarkdownEditorSurfacesBase & {
			/** True while the editor shows the raw markdown source. */
			isSourceMode: false;

			/** No source editor outside `source` mode. */
			sourceEditor: null;

			/** Dispatch through {@link MarkdownEditorSurfacesBase.richEditor} instead. */
			sourceCommands?: never;
	  })
	| (MarkdownEditorSurfacesBase & {
			/** True while the editor shows the raw markdown source. */
			isSourceMode: true;

			/**
			 * The editor rendering the highlighted markdown source. It — not
			 * {@link MarkdownEditorSurfacesBase.richEditor} — holds the document the user sees,
			 * so its selection is what the toolbar's active states reflect.
			 *
			 * Still null for the one render between switching to `source` and the source composer mounting.
			 */
			sourceEditor: LexicalEditor | null;

			/** Formatting commands operating on the raw markdown source. */
			sourceCommands: MarkdownEditorSourceCommands;
	  });

/**
 * What a toolbar control sees: everything in {@link MarkdownEditorSurfacesContextValue}
 * plus the per-selection state only a toolbar computes.
 *
 * Passed to {@link MarkdownEditorProps.ToolbarButtonProps.onClick}.
 * A component outside a toolbar reads the surfaces on their own through `useMarkdownEditorSurfaces()`.
 */
export type MarkdownEditorToolbarContextValue = MarkdownEditorSurfacesContextValue & {
	/** Snapshot of the active/enabled state of every built-in control. */
	toolbarState: MarkdownEditorToolbarState;
};
