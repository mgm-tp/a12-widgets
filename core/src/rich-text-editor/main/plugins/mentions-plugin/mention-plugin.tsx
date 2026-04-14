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

import type { FC, ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { MenuRenderFn, MenuTextMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import {
	LexicalTypeaheadMenuPlugin,
	MenuOption,
	useBasicTypeaheadTriggerMatch
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { TextNode } from "lexical";
import { $getSelection, $isRangeSelection } from "lexical";

import { $createEditorMentionNode } from "../../nodes/mention-node.js";
import { $createInlineStyleTextNode, $isInlineStyleTextNode } from "../../nodes/inline-style-text-node.js";
import { StyledEditorMentionSuggestion, StyledEditorMentionSuggestionItem } from "../../rich-text-editor.styled.js";
import { AttachedPortal } from "../../../../attached-portal/main/attached-portal.view.js";
import { editorThemeClasses } from "../../themes/themes.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { MentionPluginProps } from "./mention-plugin.api.js";

class MentionOption extends MenuOption {
	name: string;
	value: string;

	constructor(name: string, value: string) {
		super(name);
		this.name = name;
		this.value = value;
	}
}

function useMentionLookupService(mentionString: string | null, options: MentionOption[]): Array<MentionOption> {
	const [results, setResults] = useState<Array<MentionOption>>([]);
	useEffect(() => {
		if (mentionString === null) {
			if (results.length) {
				setResults([]);
			}

			return;
		}

		const cachedResults = options.filter((option) => option.name.toLowerCase().includes(mentionString.toLowerCase()));

		if (!cachedResults.length) {
			setResults([]);

			return;
		} else {
			setResults(cachedResults);

			return;
		}
	}, [mentionString, options, results.length]);

	return results;
}

function checkForAtSignMentions(text: string, trigger: string, regExp?: string): MenuTextMatch | null {
	const escapedTrigger = trigger.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
	const reg = new RegExp(
		regExp ??
			`(^|\\s|\\()([${escapedTrigger}]((?:[^${escapedTrigger}\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'"~=<>_:;\\s](?:\\.[ |$]| |[\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'"~=<>_:;]|)){0,75}))$`,
		"g"
	);
	const match = reg.exec(text);

	if (match !== null) {
		const maybeLeadingWhitespace = match[1];
		const matchingString = match[3];

		if (matchingString.length >= 1 || matchingString.length === 0) {
			return {
				leadOffset: match.index + maybeLeadingWhitespace.length,
				matchingString,
				replaceableString: match[2]
			};
		}
	}

	return null;
}

export const MentionPlugin: FC<MentionPluginProps> = (props) => {
	const [editor] = useLexicalComposerContext();
	const [queryString, setQueryString] = useState<string | null>(null);
	const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
	const [shouldMentionMenuDisplay, setShouldMentionMenuDisplay] = useState(false);
	const suggestions = useMemo(
		() => props.suggestions.map((suggestion) => new MentionOption(suggestion.name, suggestion.value)),
		[props.suggestions]
	);
	const results = useMentionLookupService(queryString, suggestions);
	const { onSearchChange, onAddMention } = props;

	const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
		minLength: 0
	});

	const onSelectOption = useCallback(
		(selectedOption: MentionOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
			editor.update(() => {
				const mentionNode = $createEditorMentionNode({
					mentionName: selectedOption.name,
					selectedClassName: [editorThemeClasses.withTooltipWord],
					mentionText: selectedOption.value
				});
				const keepStyleNode = $createInlineStyleTextNode(" ", selectedClasses);

				// keep mention node style as focus node
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					const focus = selection.focus.getNode();

					if ($isInlineStyleTextNode(focus)) {
						const currentFormat = focus.getFormat();

						keepStyleNode.setFormat(currentFormat);

						if (!props.clearTextFormatAfterTransform) {
							mentionNode.setFormat(currentFormat);
							mentionNode.addSelectedStyleName(...selectedClasses);
						}
					}
				}

				if (nodeToReplace) {
					nodeToReplace.replace(mentionNode);
					mentionNode.insertAfter(keepStyleNode);
					keepStyleNode.select();
				}

				closeMenu();
			});
			onAddMention?.(selectedOption);
		},
		[editor, onAddMention, props.clearTextFormatAfterTransform, selectedClasses]
	);

	const checkForMentionMatch = useCallback(
		(text: string) => {
			const mentionMatch = checkForAtSignMentions(text, props.mentionTrigger ?? "@", props.mentionRegExp);
			const selection = $getSelection();
			const slashMatch = checkForSlashTriggerMatch(text, editor);

			if ($isRangeSelection(selection)) {
				const focus = selection.focus.getNode();

				if ($isInlineStyleTextNode(focus) && mentionMatch) {
					setShouldMentionMenuDisplay(true);
					setSelectedClasses(focus.getSelectedStyleName());
				}
			}

			return !slashMatch && mentionMatch ? mentionMatch : null;
		},
		[checkForSlashTriggerMatch, editor, props.mentionRegExp, props.mentionTrigger]
	);

	const options = useMemo(() => results.map((result) => new MentionOption(result.name, result.value)), [results]);

	const onQueryChange = useCallback(
		(query: string | null) => {
			if (queryString !== query) {
				setQueryString(query);

				onSearchChange?.(query ?? "");
			}
		},
		[onSearchChange, queryString]
	);

	const handleCloseMenu = useCallback(() => {
		setShouldMentionMenuDisplay(false);
	}, []);

	const getClientCoordinatesOfSelection = useCallback((): { top: number; left: number } | null => {
		let position: { top: number; left: number } | null = null;

		const domSelection = window.getSelection();

		if (domSelection && domSelection.rangeCount > 0) {
			const range = domSelection.getRangeAt(0);
			const rects = range.getClientRects();

			if (rects.length > 0) {
				const rect = rects[0];
				position = { top: rect.top, left: rect.left };
			}
		}

		return position;
	}, []);

	const menuRenderFn: MenuRenderFn<MentionOption> = useCallback(
		(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }): ReactElement | null => {
			if (!anchorElementRef.current || !props.suggestions.length) {
				return null;
			}

			const anchorElementRect = anchorElementRef.current?.getBoundingClientRect();

			// Using the `position` property to provide coordinates to `AttachedPortal`
			// because `anchorElementRef` is the trigger element when typing mention match @, it's not the @.
			const position = getClientCoordinatesOfSelection();

			return shouldMentionMenuDisplay && results.length && position ? (
				<AttachedPortal
					focusOnOpen={false}
					isInRichTextEditor
					onVisibilityChange={setShouldMentionMenuDisplay}
					position={{
						top: position.top + anchorElementRect.height,
						left: position.left
					}}
					closeOnOutsideClick
				>
					<StyledEditorMentionSuggestion data-role={DataRoles.RichTextEditor.MentionSuggestion}>
						{options.map((option, index: number) => (
							<StyledEditorMentionSuggestionItem
								key={index}
								focused={selectedIndex === index}
								onClick={(): void => {
									setHighlightedIndex(index);
									selectOptionAndCleanUp(option);
								}}
								onMouseEnter={(): void => {
									setHighlightedIndex(index);
								}}
								data-role={DataRoles.RichTextEditor.MentionSuggestion.Item}
							>
								{option.name}
							</StyledEditorMentionSuggestionItem>
						))}
					</StyledEditorMentionSuggestion>
				</AttachedPortal>
			) : null;
		},
		[getClientCoordinatesOfSelection, options, props.suggestions.length, results.length, shouldMentionMenuDisplay]
	);

	return (
		<LexicalTypeaheadMenuPlugin<MentionOption>
			onQueryChange={onQueryChange}
			onSelectOption={onSelectOption}
			triggerFn={checkForMentionMatch}
			options={options}
			menuRenderFn={menuRenderFn}
			onClose={handleCloseMenu}
		/>
	);
};

MentionPlugin.displayName = "MentionPlugin";
