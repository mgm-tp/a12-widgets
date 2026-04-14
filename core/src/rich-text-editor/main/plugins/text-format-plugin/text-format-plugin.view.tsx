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

import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
	BaseSelection,
	LexicalEditor,
	LexicalNode,
	PointType,
	RangeSelection,
	TextFormatType,
	TextNode
} from "lexical";
import {
	$getNodeByKey,
	$getSelection,
	$insertNodes,
	$isRangeSelection,
	COMMAND_PRIORITY_EDITOR,
	COMMAND_PRIORITY_LOW,
	COMMAND_PRIORITY_NORMAL,
	CONTROLLED_TEXT_INSERTION_COMMAND,
	FORMAT_TEXT_COMMAND,
	SELECTION_CHANGE_COMMAND
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { isEqual } from "lodash-es";

import {
	$createInlineStyleTextNode,
	$isInlineStyleTextNode,
	InlineStyleTextNode
} from "../../nodes/inline-style-text-node.js";
import {
	$getRangeSelectionPoint,
	$getSelectionNodes,
	$splitText,
	$updateTextSelection
} from "../../utils/selection.js";
import { APPLY_TEXT_FORMAT_COMMAND } from "../../utils/commands.js";
import { useRichTextEditorCache } from "../../template/rich-text-editor.tpl.view.js";
import { mergeWithSibling } from "../../utils/node.js";
import { useLastInteractionType } from "../../../../common/main/hooks.js";

export const TextFormatPlugin: FC = () => {
	const [editor] = useLexicalComposerContext();
	const [isolateClassList, setIsolateClassList] = useState<string[]>([]);
	const { setClassList, classList } = useRichTextEditorCache();
	const editorPreviousTextContentRef = useRef("");
	const editorPreviousSelectionRef = useRef<BaseSelection | null>(null);
	const lastInteraction = useLastInteractionType();

	const toggleCollapsedSelectionStyle = useCallback(
		(styleName: string, isSelectionActiveStyleName: boolean) => {
			let newClassSet = [...new Set([...(classList ?? []), styleName])];

			if (isSelectionActiveStyleName) {
				newClassSet = newClassSet.filter((el) => el !== styleName);
			}

			setClassList(newClassSet);
		},
		[classList, setClassList]
	);

	const toggleRangeSelectionStyle = useCallback(
		(selection: RangeSelection, styleName: string, isSelectionActiveStyleName: boolean, isolateStyle: boolean) => {
			$updateTextSelection(selection, (node) => {
				const currentNode = node;

				if ($isInlineStyleTextNode(currentNode)) {
					if (isolateStyle) {
						currentNode.setNodeIsolate();
					}

					if (isSelectionActiveStyleName) {
						currentNode.setLexicalUnmergeable();
						currentNode.removeSelectedStyleName(styleName);
					} else {
						currentNode.setLexicalUnmergeable();
						currentNode.addSelectedStyleName(styleName);
					}
				}

				if (isolateStyle) {
					const newIsolateClassList = [...new Set([...isolateClassList, styleName])];
					setIsolateClassList(newIsolateClassList);
				}
			});
		},
		[isolateClassList]
	);

	const handleAddSelectionClassListToTypingText = (
		focus: PointType,
		selectionClassList: string[],
		newTextCount: number
	): void => {
		const focusNode = focus.getNode();

		if (!$isInlineStyleTextNode(focusNode)) {
			return;
		}

		const textLength = focusNode.getTextContentSize();
		let updatedNode: TextNode | undefined;

		if (focus.offset === 1) {
			updatedNode = $splitText(focusNode, focus.offset)[0];
		} else if (focus.offset === textLength) {
			updatedNode = $splitText(focusNode, focus.offset - newTextCount)[1];
		} else {
			updatedNode = $splitText(focusNode, focus.offset - newTextCount, focus.offset)[1];
		}

		if ($isInlineStyleTextNode(updatedNode)) {
			updatedNode.setSelectedStyleName(selectionClassList);
			updatedNode.setLexicalUnmergeable();
		}
	};

	useEffect(() => {
		return editor.registerCommand(
			APPLY_TEXT_FORMAT_COMMAND,
			(payload: {
				styleName: string;
				allowCollapseStyle: boolean;
				isActive: (
					selection: BaseSelection | null,
					editor: LexicalEditor,
					selectionCLassListCache?: string[]
				) => boolean;
				isolateStyle: boolean;
			}) => {
				const selection = $getSelection();
				const isActiveSelection = payload.isActive(selection, editor, classList);

				if ($isRangeSelection(selection)) {
					if (selection.isCollapsed() && payload.allowCollapseStyle) {
						toggleCollapsedSelectionStyle(payload.styleName, isActiveSelection);
					} else {
						toggleRangeSelectionStyle(selection, payload.styleName, isActiveSelection, payload.isolateStyle);
					}
				}

				return false;
			},
			COMMAND_PRIORITY_EDITOR
		);
	}, [classList, editor, toggleCollapsedSelectionStyle, toggleRangeSelectionStyle]);

	useEffect(() => {
		const removeNormalizedCommands = mergeRegister(
			editor.registerCommand<TextFormatType>(
				FORMAT_TEXT_COMMAND,
				(format) => {
					const selection = $getSelection();

					if (!$isRangeSelection(selection)) {
						return false;
					}

					if (selection.isCollapsed()) {
						// Let Lexical handle this case
						return false;
					}

					const hasFormat = selection.hasFormat(format);
					selection.toggleFormat(format);
					$updateTextSelection(selection, (node) => {
						if ($isInlineStyleTextNode(node)) {
							if (hasFormat) {
								node.removeFormat(format);
							} else {
								node.addFormat(format);
							}
						}
					});

					return true;
				},
				COMMAND_PRIORITY_LOW
			)
		);

		return (): void => {
			removeNormalizedCommands();
		};
	}, [classList, editor, lastInteraction, setClassList]);

	// Update class list cached when selection change
	useEffect(() => {
		const removeUpdateCommands = editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection) && selection.isCollapsed()) {
					const focus = selection.focus;
					const focusNode = focus.getNode();

					if ($isInlineStyleTextNode(focusNode)) {
						let newClassList = focusNode.getSimpleTextClassNames();

						if (focus.offset === focusNode.getTextContent().length && focusNode.__isolate) {
							newClassList = newClassList.filter((className) => !isolateClassList.includes(className));
						}

						setClassList(newClassList);
					}
				} else if ($isRangeSelection(selection)) {
					const getCommonClassList = (nodes: LexicalNode[]): string[] => {
						const inlineStyleNodes = nodes.filter($isInlineStyleTextNode);

						if (inlineStyleNodes.length === 0) {
							return [];
						}

						const allClassLists = inlineStyleNodes.map((node) => node.getSelectedStyleName());

						return allClassLists.reduce(
							(commonList, currentNodeClassList) =>
								commonList.filter((className) => currentNodeClassList.includes(className)),
							allClassLists[0]
						);
					};

					const nodes = $getSelectionNodes(selection);
					const commonClassList = getCommonClassList(nodes);
					setClassList(commonClassList);
				}

				editorPreviousSelectionRef.current = selection;

				return false;
			},
			COMMAND_PRIORITY_NORMAL
		);

		return (): void => {
			removeUpdateCommands();
		};
	}, [editor, isolateClassList, setClassList]);

	useEffect(() => {
		return editor.registerMutationListener(
			InlineStyleTextNode,
			(mutatedNodes) => {
				editor.update(() => {
					for (const [nodeKey] of mutatedNodes) {
						const textNode: InlineStyleTextNode | null = $getNodeByKey(nodeKey);

						if (!textNode) {
							continue;
						}

						const next = textNode?.getNextSibling();

						if (
							$isInlineStyleTextNode(textNode) &&
							textNode.isSimpleText() &&
							$isInlineStyleTextNode(next) &&
							next.isSimpleText()
						) {
							mergeWithSibling(textNode, next);
						}

						const previous = textNode?.getPreviousSibling();

						if (
							$isInlineStyleTextNode(textNode) &&
							textNode.isSimpleText() &&
							$isInlineStyleTextNode(previous) &&
							previous.isSimpleText()
						) {
							mergeWithSibling(previous, textNode);
						}
					}
				});
			},
			{ skipInitialization: true }
		);
	}, [editor]);

	useEffect(() => {
		return editor.registerTextContentListener((textContent) => {
			const newLettersCount = textContent.length - editorPreviousTextContentRef.current.length;

			editor.update(() => {
				const selection = $getSelection();

				if (!$isRangeSelection(selection)) {
					return;
				}

				const focus = selection.focus;
				const focusNode = focus.getNode();

				if ($isInlineStyleTextNode(focusNode)) {
					const currentClassList = focusNode.getSimpleTextClassNames();
					const selectionClassList = classList ?? [];

					if (
						!isEqual(currentClassList, selectionClassList) &&
						selection.isCollapsed() &&
						newLettersCount &&
						// We do not apply custom style to composing node when typing. To do that, select text after composing and apply style to it
						!focusNode.isComposing()
					) {
						handleAddSelectionClassListToTypingText(focus, selectionClassList, newLettersCount);
					}

					if (selection.isCollapsed() && focusNode.isComposing()) {
						setClassList([]);
					}
				}
			});
			editorPreviousTextContentRef.current = textContent;
		});
	}, [classList, editor, setClassList]);

	useEffect(() => {
		return editor.registerCommand(
			CONTROLLED_TEXT_INSERTION_COMMAND,
			(eventOrText: string | InputEvent) => {
				const selection = $getSelection();

				if (!$isRangeSelection(selection)) {
					return false;
				}

				const { startPoint, endPoint } = $getRangeSelectionPoint(selection);
				const startNode = startPoint.getNode();
				const endNode = endPoint.getNode();

				if (
					typeof eventOrText === "string" &&
					!selection.isCollapsed() &&
					(!$isInlineStyleTextNode(startNode) ||
						($isInlineStyleTextNode(startNode) && startPoint.offset === startNode.getTextContentSize()) ||
						($isInlineStyleTextNode(endNode) && endPoint.offset === endNode.getTextContentSize()))
				) {
					const newInsertedNode = $createInlineStyleTextNode(
						eventOrText,
						classList?.filter((className) => !isolateClassList.includes(className)) ?? []
					);

					newInsertedNode.setFormat(selection.format);
					newInsertedNode.setLexicalUnmergeable();

					$insertNodes([newInsertedNode]);

					return true;
				}

				return false;
			},
			COMMAND_PRIORITY_NORMAL
		);
	}, [classList, editor, isolateClassList]);

	return <></>;
};

TextFormatPlugin.displayName = "TextFormatPlugin";
