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

import { getExtensionDependencyFromEditor } from "@lexical/extension";
import { $convertFromMarkdownString, $convertToMarkdownString, MdastImportExtension } from "@lexical/mdast";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import type { LexicalEditor } from "lexical";
import type { FocusEvent, ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { DataRoles } from "../../common/main/data-roles.js";
import { useSelectedText } from "../../common/main/hooks.js";
import { joinClassNames } from "../../common/main/utils.js";
import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { InputElements } from "../../input/base/template/base.tpl.view.js";

import { ImageContextMenu, TableContextMenu } from "./context-menu/index.js";
import type { EditedImage } from "./dialogs/image-dialog.view.js";
import { ImageDialog } from "./dialogs/image-dialog.view.js";
import { LinkDialog } from "./dialogs/link-dialog.view.js";
import { defineMarkdownEditorExtension } from "./extensions.js";
import { useMarkdownEditorHandle } from "./hooks/use-markdown-editor-handle.js";
import type { FlushPendingEdit } from "./hooks/use-markdown-value-bridge.js";
import { EXTERNAL_VALUE_TAG, useMarkdownValueBridge } from "./hooks/use-markdown-value-bridge.js";
import type {
	MarkdownEditorMode,
	MarkdownEditorProps,
	MarkdownEditorSurfacesContextValue
} from "./markdown-editor.api.js";
import { StyledMarkdownEditorMain } from "./markdown-editor.styled.js";
import { RichEditor } from "./modes/rich-editor.view.js";
import { SourceEditor } from "./modes/source-editor.view.js";
import type { ResolvedFeatures } from "./optional-features.js";
import { getFeaturesKey, parseFeaturesKey } from "./optional-features.js";
import type { MarkdownEditorModeContextValue } from "./shared/mode-context.js";
import { MarkdownEditorModeContext } from "./shared/mode-context.js";
import { MarkdownEditorSurfacesContext } from "./shared/surfaces-context.js";
import { createSourceTokenizer } from "./source-highlighting/micromark-tokenizer.js";
import { CodeBlockMenu as CodeBlockMenuView } from "./toolbar/code-block-menu.view.js";
import { DefaultToolbar } from "./toolbar/default-toolbar.view.js";
import { HeadingMenu as HeadingMenuView } from "./toolbar/heading-menu.view.js";
import { ModeMenu as ModeMenuView } from "./toolbar/mode-menu.view.js";
import { TableMenu as TableMenuView } from "./toolbar/table-menu/index.js";
import { CustomToolbarButton } from "./toolbar/toolbar-button.view.js";
import * as controls from "./toolbar/toolbar-controls.view.js";
import {
	Toolbar as ToolbarView,
	ToolbarGroup as ToolbarGroupView,
	ToolbarSeparator as ToolbarSeparatorView
} from "./toolbar/toolbar.view.js";
import { useSourceCommands } from "./toolbar/use-source-commands.js";
import { DEFAULT_ALLOWED_MODES } from "./utils/constants.js";
import { focusEditor } from "./utils/helpers.js";

/**
 * A WYSIWYG markdown editor, built on Lexical and `@lexical/mdast`.
 *
 * It has three modes: rich text (`edit`), highlighted markdown source (`source`)
 * and a read-only preview (`view`).
 *
 * The toolbar is rebuilt with {@link MarkdownEditorProps.toolbar}
 * and the editor takes more Lexical extensions through {@link MarkdownEditorProps.extensions}.
 *
 * Unlike the other inputs, {@link MarkdownEditorProps.onChange} is debounced by default,
 * for better performance.
 */
export function MarkdownEditor(props: MarkdownEditorProps): ReactElement {
	const { extensions: extraExtensions, features } = props;

	// `features` is documented as safe to write inline, so it is a new object on most renders.
	// The key is the set as a string, so it only changes when a feature flips.
	const featuresKey = getFeaturesKey(features);
	const resolvedFeatures = useMemo(() => parseFeaturesKey(featuresKey), [featuresKey]);

	// `LexicalExtensionComposer` recreates the editor whenever this identity changes,
	// so it is memoized on the feature set and the (documented as stable) `extensions` array.
	const extension = useMemo(
		() => defineMarkdownEditorExtension(resolvedFeatures, extraExtensions),
		[resolvedFeatures, extraExtensions]
	);

	return (
		<LexicalExtensionComposer extension={extension} contentEditable={null}>
			<EditorShell {...props} resolvedFeatures={resolvedFeatures} />
		</LexicalExtensionComposer>
	);
}

MarkdownEditor.displayName = "MarkdownEditor";

interface EditorShellProps extends MarkdownEditorProps {
	/** {@link MarkdownEditorProps.features} with every key answered. */
	resolvedFeatures: ResolvedFeatures;
}

interface HelperTextProps {
	/** Id of the helper text element. */
	id: string;

	/** Puts the caret back in the editor. Only the shell knows which one is on screen. */
	focusActiveSurface: () => void;

	children: ReactNode;
}

// The text below the editor. Clicking it puts the caret in the editor
function HelperText({ id, focusActiveSurface, children }: HelperTextProps): ReactElement {
	const helperTextRef = useRef<HTMLLabelElement>(null);
	const { isSelectedText } = useSelectedText(helperTextRef);

	const handleClick = useCallback((): void => {
		// Do not steal the caret while the user is selecting the text.
		if (!isSelectedText) {
			focusActiveSurface();
		}
	}, [isSelectedText, focusActiveSurface]);

	return (
		<StyledBaseInput.StyledFieldHelperWrapper data-role={DataRoles.MarkdownEditor.HelperText.Wrapper}>
			<StyledBaseInput.StyledFieldHelperText
				id={id}
				ref={helperTextRef}
				onClick={handleClick}
				data-role={DataRoles.MarkdownEditor.HelperText}
			>
				{children}
			</StyledBaseInput.StyledFieldHelperText>
		</StyledBaseInput.StyledFieldHelperWrapper>
	);
}

HelperText.displayName = "MarkdownEditorHelperText";

/**
 * The interactive body, rendered inside the composer so it can reach the editor
 * through context.
 */
function EditorShell(props: EditorShellProps): ReactElement {
	const {
		id,
		style,
		className,
		value,
		onChange,
		mode: controlledMode,
		initialMode = "edit",
		allowedModes,
		onModeChange,
		emitMode = "debounced",
		emitDebounceMs = 300,
		placeholder,
		autoFocus = false,
		minHeight = 160,
		maxHeight,
		showToolbar = true,
		toolbar,
		label,
		hideLabel,
		labelGraphic,
		fitToParent = true,
		disabled,
		readonly,
		tooltips,
		error,
		warning,
		info,
		errorMessage,
		warningMessage,
		infoMessage,
		helperText,
		plugins: extraPlugins,
		onFocus,
		onBlur,
		onKeyDown,
		editorRef,
		resolvedFeatures
	} = props;

	const [richEditor] = useLexicalComposerContext();

	const [internalMode, setInternalMode] = useState<MarkdownEditorMode>(initialMode);
	const [focused, setFocused] = useState(false);
	const [linkDialogOpen, setLinkDialogOpen] = useState(false);

	// `null` while the dialog is shut. Open, it carries the image being changed,
	// or `{ editing: null }` for a new one.
	const [imageDialog, setImageDialog] = useState<{ editing: EditedImage | null } | null>(null);

	// State, not a ref: the toolbar's active states re-render when the nested editor
	// appears, and `EditorRefPlugin` accepts a callback ref.
	const [sourceEditor, setSourceEditor] = useState<LexicalEditor | null>(null);

	// The source editor lives in a child component, so it hands its flush up through a ref
	// and clears it when it goes away. The rich bridge is called right here,
	// so its flush comes back from the hook instead.
	const sourceFlushRef = useRef<FlushPendingEdit | null>(null);

	// Modes outside the allowed list fall back to the first allowed one.
	const availableModes = allowedModes && allowedModes.length > 0 ? allowedModes : DEFAULT_ALLOWED_MODES;
	const rawMode = controlledMode ?? internalMode;
	const requestedMode = availableModes.includes(rawMode) ? rawMode : availableModes[0]!;
	const effectiveMode: MarkdownEditorMode = readonly ? "view" : requestedMode;

	const generatedId = useId();
	const fieldId = id || generatedId;

	const labelId = label ? `${fieldId}-label` : undefined;

	// Keep the editor's editability in sync with mode / disabled.
	useEffect(() => {
		richEditor.setEditable(effectiveMode === "edit" && !disabled);
	}, [richEditor, effectiveMode, disabled]);

	// Turning the rich document into markdown and back. The bridge below does the
	// rest. This sits in the shell instead of a plugin component, because the shell
	// is already inside the composer that owns the rich editor.
	//
	// Use `richEditor.read`, not `richEditor.getEditorState().read`: the serializer
	// looks up its rules on the editor that is currently active, and only `.read`
	// makes it active. Neither call takes a list of transformers — the extensions on
	// the editor are what configures them.
	const readMarkdown = useCallback((): string => richEditor.read(() => $convertToMarkdownString()), [richEditor]);

	const writeMarkdown = useCallback(
		(markdown: string): void => {
			// `$convertFromMarkdownString` replaces the root's contents on its own, so
			// there is nothing to clear here and the selection is left alone.
			richEditor.update(() => $convertFromMarkdownString(markdown), { tag: EXTERNAL_VALUE_TAG });
		},
		[richEditor]
	);

	const flushRich = useMarkdownValueBridge({
		value,
		onChange,
		emitMode,
		emitDebounceMs,
		enabled: effectiveMode !== "source",
		read: readMarkdown,
		write: writeMarkdown
	});

	/*
	 * Auto-focus once, on whichever surface comes up first. The ref keeps it a first-render decision,
	 * like `autoFocus` on an `<input>`: a later mode switch mounts a fresh surface,
	 * and taking focus there would pull the user out of whatever they moved on to.
	 *
	 * Must stay below the bridge, which is what puts `value` into the document.
	 * `editor.focus()` gives up on an empty one. Effects run in source order.
	 */
	const pendingAutoFocus = useRef(autoFocus);

	useEffect(() => {
		if (!pendingAutoFocus.current || disabled || readonly || effectiveMode === "view") {
			return;
		}

		// The source editor sits in a nested composer,
		// so the shell only sees it a render after it mounts. The flag stays up until then.
		const target = effectiveMode === "source" ? sourceEditor : richEditor;

		if (!target) {
			return;
		}

		pendingAutoFocus.current = false;
		focusEditor(target);
	}, [disabled, readonly, effectiveMode, richEditor, sourceEditor]);

	// Whichever surface is on screen is the one holding an edit. The other one has nothing
	// waiting, so asking both is the same as asking the right one.
	const flush = useCallback((): void => {
		flushRich();
		sourceFlushRef.current?.();
	}, [flushRich]);

	// Drives the toolbar while in source mode: formats the raw markdown.
	// Highlighting parses with the *rich* editor's dialect, taken from its own registry:
	// a consumer-registered syntax must not parse in one mode and render as plain text in the other.
	const tokenize = useMemo(() => {
		const { output } = getExtensionDependencyFromEditor(richEditor, MdastImportExtension);

		return createSourceTokenizer(output.registry.micromarkExtensions);
	}, [richEditor]);

	const sourceCommands = useSourceCommands({ sourceEditor, value, onChange, tokenize });

	const openLinkDialog = useCallback(() => setLinkDialogOpen(true), []);
	const openImageDialog = useCallback(() => setImageDialog({ editing: null }), []);
	const openImageEditDialog = useCallback((editing: EditedImage) => setImageDialog({ editing }), []);
	const closeImageDialog = useCallback(() => setImageDialog(null), []);

	const changeMode = useCallback(
		(next: MarkdownEditorMode): void => {
			if (next === effectiveMode) {
				return;
			}

			/*
			 * The editor we are leaving is about to go away.
			 * If it holds an edit we have not sent yet, send it now, while we still can.
			 *
			 * Only send real edits. `flush()` checks whether anything was actually typed,
			 * which is the right question to ask here.
			 * The tempting alternative is to write the document back out and compare it with `value`,
			 * sending it when the two differ.
			 *
			 * But they always differ. Parsing throws away what mdast has no node for,
			 * so `"a\n\n\n\n\nb\n"` already reads back as `"a\n\nb"` the moment it loads:
			 * runs of blank lines collapse into one, a heading gains the blank line under it,
			 * and the trailing newline goes. None of that waits for a keystroke,
			 * so comparing the text would report a change every time someone opens the source view.
			 */
			flush();

			if (controlledMode === undefined) {
				setInternalMode(next);
			}

			onModeChange?.(next);
		},
		[effectiveMode, flush, controlledMode, onModeChange]
	);

	// The host's handlers run alongside the editor's own focus bookkeeping.
	const handleFocus = useCallback(
		(event: FocusEvent<HTMLElement>) => {
			if (!disabled) {
				setFocused(true);
			}

			onFocus?.(event);
		},
		[disabled, onFocus]
	);

	const handleBlur = useCallback(
		(event: FocusEvent<HTMLElement>) => {
			setFocused(false);
			flush();
			onBlur?.(event);
		},
		[flush, onBlur]
	);

	/**
	 * Puts the caret in the editor the user can see. The label and the helper text both call it.
	 * `htmlFor` cannot do this: a `<label>` only forwards its click to a real form control,
	 * and the surface is a contenteditable `div`.
	 */
	const focusActiveSurface = useCallback((): void => {
		// Nothing to focus in `view` mode, or while the field is disabled or readonly.
		if (disabled || readonly || effectiveMode === "view") {
			return;
		}

		const target = effectiveMode === "source" ? sourceEditor : richEditor;

		if (target) {
			focusEditor(target);
		}
	}, [disabled, readonly, effectiveMode, richEditor, sourceEditor]);

	const hasToolbarSpace = showToolbar && !readonly;
	const showToolbarControls = hasToolbarSpace && effectiveMode !== "view";

	const hasError = error || !!errorMessage;
	const hasWarning = warning || !!warningMessage;
	const hasInfo = info || !!infoMessage;

	// The handle is built here, not in `MarkdownEditor`:
	// only this component sits inside the composer, so only it can reach both editors.
	useMarkdownEditorHandle(editorRef, {
		mode: effectiveMode,
		richEditor,
		sourceEditor,
		sourceCommands,
		flush,
		editable: effectiveMode !== "view" && !disabled
	});

	// Handed to every control and every consumer plugin. The per-selection toolbar state is
	// not in here: `MarkdownEditor.Toolbar` works that out itself, so a moving caret
	// re-renders the toolbar rather than this component.
	const isSourceMode = effectiveMode === "source";
	const isViewMode = effectiveMode === "view";

	const richMenusEnabled = effectiveMode === "edit" && !disabled && !readonly;

	// The placeholder only helps where the user can type, so it goes away in view mode and while disabled.
	const shownPlaceholder = isViewMode || disabled ? undefined : placeholder;

	// The surfaces put this on the placeholder element, so the description below can name it.
	const placeholderId = `${fieldId}-placeholder`;

	// Everything that describes the field, in the order it should be read.
	// The placeholder is in here as well, the way the rich text editor does it,
	// so the text is offered to a screen reader and not only through `aria-placeholder`.
	const describedBy = useMemo(
		() =>
			joinClassNames(
				{ [`${fieldId}-error`]: !!errorMessage },
				{ [`${fieldId}-warning`]: !!warningMessage },
				{ [`${fieldId}-info`]: !!infoMessage },
				{ [placeholderId]: !!shownPlaceholder },
				{ [`${fieldId}-helper-text`]: !!helperText }
			) || undefined,
		[fieldId, placeholderId, shownPlaceholder, errorMessage, warningMessage, infoMessage, helperText]
	);

	const surfaces = useMemo<MarkdownEditorSurfacesContextValue>(() => {
		const base = {
			richEditor,
			disabled: !!disabled,
			features: resolvedFeatures,
			openLinkDialog,
			openImageDialog
		};

		// Built per branch, not with one `isSourceMode ? … : null` per key, so the
		// union stays a real discriminant: a control that checks `isSourceMode`
		// gets `sourceCommands` typed as present.
		return isSourceMode
			? { ...base, isSourceMode: true, sourceEditor, sourceCommands }
			: { ...base, isSourceMode: false, sourceEditor: null };
	}, [
		richEditor,
		disabled,
		isSourceMode,
		sourceEditor,
		sourceCommands,
		resolvedFeatures,
		openLinkDialog,
		openImageDialog
	]);

	// The mode menu is the only reader, but it is provided around everything: a custom toolbar
	// may put `MarkdownEditor.ModeMenu` anywhere inside the editor.
	const modeState = useMemo<MarkdownEditorModeContextValue>(
		() => ({ mode: requestedMode, availableModes, changeMode }),
		[requestedMode, availableModes, changeMode]
	);

	return (
		// Wraps everything, not just the toolbar: a consumer plugin passed to `plugins` is
		// mounted above the source composer, so this context is the only way it can reach the
		// source editor. It also keeps working with `showToolbar={false}` and in view mode.
		<MarkdownEditorSurfacesContext.Provider value={surfaces}>
			<MarkdownEditorModeContext.Provider value={modeState}>
				{/* Mounted outside the mode switch, so consumer plugins survive edit ↔ source ↔ view. */}
				{extraPlugins}
				<StyledBaseInput.StyledFieldWrapper
					$block={fitToParent}
					id={id ? `${id}-wrapper` : undefined}
					className={className}
					style={style}
					data-role={DataRoles.MarkdownEditor.Wrapper}
				>
					<StyledMarkdownEditorMain data-role={DataRoles.MarkdownEditor}>
						<StyledBaseInput.StyledField $block={fitToParent} data-role={DataRoles.MarkdownEditor.Input.Field}>
							{label && (
								<InputElements.Label
									id={fieldId}
									label={label}
									hide={hideLabel}
									graphic={labelGraphic}
									disabled={disabled}
									onClick={focusActiveSurface}
									dataRole={DataRoles.MarkdownEditor.Label}
								/>
							)}
							{tooltips}
							{errorMessage && (
								<InputElements.Error
									id={fieldId}
									errorMessage={errorMessage}
									dataRole={DataRoles.MarkdownEditor.ErrorMessage}
								/>
							)}
							{warningMessage && (
								<InputElements.Warning
									id={fieldId}
									warningMessage={warningMessage}
									dataRole={DataRoles.MarkdownEditor.WarningMessage}
								/>
							)}
							{infoMessage && (
								<InputElements.Info
									id={fieldId}
									infoMessage={infoMessage}
									dataRole={DataRoles.MarkdownEditor.InfoMessage}
								/>
							)}

							{hasToolbarSpace && (toolbar ? toolbar : <DefaultToolbar showControls={showToolbarControls} />)}

							{effectiveMode === "source" ? (
								<SourceEditor
									value={value}
									onChange={onChange}
									emitMode={emitMode}
									emitDebounceMs={emitDebounceMs}
									flushPendingEditRef={sourceFlushRef}
									focused={focused}
									error={hasError}
									warning={hasWarning}
									info={hasInfo}
									minHeight={minHeight}
									maxHeight={maxHeight}
									placeholder={shownPlaceholder}
									placeholderId={placeholderId}
									disabled={disabled}
									ariaLabelledby={labelId}
									ariaDescribedby={describedBy}
									onFocus={handleFocus}
									onBlur={handleBlur}
									onKeyDown={onKeyDown}
									readonly={readonly}
									tokenize={tokenize}
									onEditorReady={setSourceEditor}
								/>
							) : (
								<RichEditor
									focused={focused}
									minHeight={minHeight}
									maxHeight={maxHeight}
									error={hasError}
									warning={hasWarning}
									info={hasInfo}
									disabled={disabled}
									// Only a readonly field is painted grey. `view` mode is a way of looking at an
									// editable field, so it keeps the normal white surface.
									readonly={readonly}
									isViewMode={isViewMode}
									placeholder={shownPlaceholder}
									placeholderId={placeholderId}
									ariaLabelledby={labelId}
									ariaDescribedby={describedBy}
									onFocus={handleFocus}
									onBlur={handleBlur}
									onKeyDown={onKeyDown}
								/>
							)}
						</StyledBaseInput.StyledField>

						<TableContextMenu enabled={richMenusEnabled} />
						<ImageContextMenu enabled={richMenusEnabled} onEditImage={openImageEditDialog} />
					</StyledMarkdownEditorMain>

					{helperText && (
						<HelperText id={`${fieldId}-helper-text`} focusActiveSurface={focusActiveSurface}>
							{helperText}
						</HelperText>
					)}
				</StyledBaseInput.StyledFieldWrapper>

				{linkDialogOpen && (
					<LinkDialog
						isSourceMode={isSourceMode}
						onInsertMdToSource={sourceCommands.insertText}
						initialText={isSourceMode ? sourceCommands.getSelectedText() : undefined}
						onClose={() => setLinkDialogOpen(false)}
					/>
				)}
				{imageDialog && (
					<ImageDialog
						isSourceMode={isSourceMode}
						onInsertMdToSource={sourceCommands.insertText}
						editing={imageDialog.editing ?? undefined}
						onClose={closeImageDialog}
					/>
				)}
			</MarkdownEditorModeContext.Provider>
		</MarkdownEditorSurfacesContext.Provider>
	);
}

EditorShell.displayName = "MarkdownEditorShell";

/**
 * Parts to build a custom toolbar for the {@link MarkdownEditorProps.toolbar} prop.
 * Put them inside {@link MarkdownEditor.Toolbar} to choose which buttons show,
 * in what order and in which groups. Custom buttons fit there too:
 *
 * ```tsx
 * <MarkdownEditor
 *   value={value}
 *   onChange={setValue}
 *   toolbar={
 *     <MarkdownEditor.Toolbar>
 *       <MarkdownEditor.ToolbarGroup>
 *         <MarkdownEditor.BoldButton />
 *         <MarkdownEditor.ItalicButton />
 *       </MarkdownEditor.ToolbarGroup>
 *     </MarkdownEditor.Toolbar>
 *   }
 * />
 * ```
 *
 * Each button wires itself. It reads the editor around it to know when it is active or disabled,
 * it edits the rich text or the markdown source (same as the built-in toolbar does in each mode)
 * and it stays keyboard accessible through the toolbar's roving tabindex.
 */
export namespace MarkdownEditor {
	/** The toolbar container: ARIA `toolbar` role plus roving-tabindex keyboard navigation. */
	export function Toolbar(props: MarkdownEditorProps.ToolbarProps): ReactElement {
		return <ToolbarView {...props} />;
	}

	/** A visual group of toolbar controls. */
	export function ToolbarGroup(props: MarkdownEditorProps.ToolbarGroupProps): ReactElement {
		return <ToolbarGroupView {...props} />;
	}

	/** A vertical divider between toolbar groups. */
	export function ToolbarSeparator(props: MarkdownEditorProps.ToolbarSeparatorProps): ReactElement {
		return <ToolbarSeparatorView {...props} />;
	}

	/** A generic toolbar button for custom controls; `onClick` receives the toolbar context. */
	export function ToolbarButton(props: MarkdownEditorProps.ToolbarButtonProps): ReactElement {
		return <CustomToolbarButton {...props} />;
	}

	/**
	 * The mode menu: edit, source and view, as far as `allowedModes` offers them.
	 * It reads the mode from the editor around it, so it needs no props.
	 * With one mode on offer there is nothing to pick and it renders nothing.
	 */
	export function ModeMenu(props: MarkdownEditorProps.ToolbarControlProps): ReactElement | null {
		return <ModeMenuView {...props} />;
	}

	/** Undo (rich edit mode only). */
	export function UndoButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.UndoButton {...props} />;
	}

	/** Redo (rich edit mode only). */
	export function RedoButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.RedoButton {...props} />;
	}

	/** Toggles bold. */
	export function BoldButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.BoldButton {...props} />;
	}

	/** Toggles italic. */
	export function ItalicButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.ItalicButton {...props} />;
	}

	/** Toggles strikethrough. */
	export function StrikeButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.StrikeButton {...props} />;
	}

	/** Toggles underline (rich edit mode only). */
	export function UnderlineButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.UnderlineButton {...props} />;
	}

	/** Toggles highlight. */
	export function HighlightButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.HighlightButton {...props} />;
	}

	/** Toggles inline code. */
	export function CodeButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.CodeButton {...props} />;
	}

	/** Toggles subscript (rich edit mode only). */
	export function SubscriptButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.SubscriptButton {...props} />;
	}

	/** Toggles superscript (rich edit mode only). */
	export function SuperscriptButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.SuperscriptButton {...props} />;
	}

	/** Toggles a bullet list. */
	export function BulletListButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.BulletListButton {...props} />;
	}

	/** Toggles an ordered list. */
	export function OrderedListButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.OrderedListButton {...props} />;
	}

	/** Toggles a task list. */
	export function TaskListButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.TaskListButton {...props} />;
	}

	/** Indents the current list item. */
	export function IndentButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.IndentButton {...props} />;
	}

	/** Outdents the current list item. */
	export function OutdentButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.OutdentButton {...props} />;
	}

	/** Opens the link dialog for the current selection. */
	export function LinkButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.LinkButton {...props} />;
	}

	/** Opens the image dialog. */
	export function ImageButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.ImageButton {...props} />;
	}

	/** Toggles a blockquote. */
	export function BlockquoteButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.BlockquoteButton {...props} />;
	}

	/** Inserts a horizontal rule. */
	export function HorizontalRuleButton(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <controls.HorizontalRuleButton {...props} />;
	}

	/** Block-type picker: paragraph and headings H1–H6. */
	export function HeadingMenu(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <HeadingMenuView {...props} />;
	}

	/** Inserts a code block or switches its language. */
	export function CodeBlockMenu(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <CodeBlockMenuView {...props} />;
	}

	/** Table operations menu. */
	export function TableMenu(props: MarkdownEditorProps.ToolbarControlProps): ReactElement {
		return <TableMenuView {...props} />;
	}
}
