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

import type { ReactElement, SyntheticEvent, FC, ChangeEvent, MouseEvent } from "react";
import { useRef, useState, useCallback } from "react";
import { produce } from "immer";

import type {
	CollapsibleTreeNodeModel,
	InsertableTreeProps,
	SelectableTreeNodeModel,
	TreeNodeTemplateModel
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Button,
	ButtonGroup,
	ActionContentbox,
	ContentBoxElements,
	TextField,
	ModalOverlay,
	Collapsible,
	find,
	findById,
	findTreeHTMLNodeById,
	Insertable,
	InsertableTree,
	Selectable,
	TreeAdapter
} from "@com.mgmtp.a12.widgets/widgets-core";

const Tree = Selectable(Insertable(Collapsible(TreeAdapter(InsertableTree))));

interface BackRefTplTreeNodeModel extends TreeNodeTemplateModel {
	fileNode: FileNode;
}

interface FileNode extends CollapsibleTreeNodeModel, SelectableTreeNodeModel, InsertableTreeProps.TreeNodeModel {
	children?: FileNode[];
}

const TREE: FileNode = {
	id: "insertable-1",
	label: "1 Submission",
	initiallyExpanded: true,
	children: [
		{
			id: "insertable-2",
			label: "2 General Data",
			initiallyExpanded: true,
			children: [
				{
					id: "insertable-3",
					label: "3 Costs"
				},
				{
					id: "insertable-4",
					label: "4 Time"
				},
				{
					id: "insertable-5",
					label: "5 More Data",
					children: [
						{
							id: "insertable-6",
							label: "6 Insurance Company"
						}
					]
				}
			]
		},
		{
			id: "insertable-7",
			label: "7 Partner",
			initiallyExpanded: true,
			children: [
				{
					id: "insertable-8",
					label: "8 Client"
				},
				{
					id: "insertable-9",
					label: "9 Broker"
				},
				{
					id: "insertable-10",
					label: "10 Subagent"
				},
				{
					id: "insertable-11",
					label: "11 Insurance Company"
				},
				{
					id: "insertable-12",
					label: "12 More Data"
				}
			]
		}
	]
};

export function InsertableTreeShowcase(): ReactElement {
	const freeId = useRef(100);
	const collapseNodeHandler = useRef<((id: string | number) => void) | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [activeNode, setActiveNode] = useState<FileNode | undefined>(undefined);
	const [position, setPosition] = useState<InsertableTreeProps.InsertPosition | null>(null);
	const [tree, setTree] = useState<FileNode>(JSON.parse(JSON.stringify(TREE)));

	const focusNewRow = useCallback((node: FileNode): void => {
		const newRow = findTreeHTMLNodeById(node.id);
		newRow?.focus();
	}, []);

	const onToggleSelection = useCallback((node: SelectableTreeNodeModel): void => {
		if (!node.id) {
			return;
		}

		setTree(
			produce((draft) => {
				const toggledNode = findById(draft, node.id);
				const prevSelectedNode = find(draft, (n) => n.selected === true);

				if (prevSelectedNode) {
					if (prevSelectedNode === toggledNode) {
						toggledNode.selected = !toggledNode.selected;
					} else {
						prevSelectedNode.selected = false;
						toggledNode.selected = true;
					}
				} else {
					toggledNode.selected = true;
				}
			})
		);
	}, []);

	const onInsert = useCallback(
		(position: InsertableTreeProps.InsertPosition, node: BackRefTplTreeNodeModel): void => {
			if (!node.fileNode.id) {
				return;
			}

			if (!node.selected) {
				onToggleSelection(node);
			}

			setShowModal(true);
			setActiveNode(node.fileNode);
			setPosition(position);
		},
		[onToggleSelection]
	);

	const closeModal = useCallback((): void => {
		setShowModal(false);
		setPosition(null);
	}, [setPosition, setShowModal]);

	const unselectAll = useCallback((node: FileNode): void => {
		node.selected = false;

		for (const child of node.children || []) {
			unselectAll(child);
		}
	}, []);

	const addNewFileNode = useCallback(
		(label?: string): void => {
			if (!label || !activeNode) {
				return;
			}

			const newNode: SelectableTreeNodeModel = {
				label: label,
				id: `insertable-${freeId.current++}`,
				selected: true
			};

			setTree(
				produce((draft) => {
					const currentActiveNode = findById(draft, activeNode.id);

					unselectAll(draft);

					const parent = find(
						draft,
						(n) =>
							!!n.children &&
							n.children.length > 0 &&
							n.children.findIndex((child) => child.id === currentActiveNode.id) > -1
					);

					if (currentActiveNode) {
						switch (position) {
							case "top": {
								if (parent?.children) {
									const nodeIndex = parent.children.findIndex((n) => n.id === currentActiveNode.id);

									if (nodeIndex > -1) {
										parent.children = [
											...parent.children.slice(0, nodeIndex),
											newNode,
											currentActiveNode,
											...parent.children.slice(nodeIndex + 1)
										];
									}
								}

								break;
							}

							case "bottom": {
								if (parent?.children) {
									const nodeIndex = parent.children.findIndex((n) => n.id === currentActiveNode.id);

									if (nodeIndex > -1) {
										parent.children = [
											...parent.children.slice(0, nodeIndex),
											currentActiveNode,
											newNode,
											...parent.children.slice(nodeIndex + 1)
										];
									}
								}

								break;
							}

							case "asChild": {
								currentActiveNode.children = [newNode, ...(currentActiveNode.children || [])];
								collapseNodeHandler.current?.(currentActiveNode.id);
								break;
							}

							default: {
								return;
							}
						}
					}
				})
			);

			closeModal();

			setTimeout(() => {
				focusNewRow(newNode);
			});
		},
		[activeNode, setTree, closeModal, unselectAll, position, focusNewRow]
	);

	return (
		<>
			<Tree
				id="insertable"
				root={tree}
				tplTreeNode={(n, chained) => ({
					...chained,
					fileNode: n
				})}
				scrollSelectedNodeIntoView
				collapseNodeHandler={(handler) => (collapseNodeHandler.current = handler)}
				onToggleSelection={onToggleSelection}
				onInsert={onInsert}
			/>
			{showModal && <InsertNodeModal addNewNode={addNewFileNode} closeModal={closeModal} />}
		</>
	);
}

interface InsertNodeModalProps {
	closeModal(event?: SyntheticEvent): void;
	addNewNode(label: string): void;
}

const InsertNodeModal: FC<InsertNodeModalProps> = (props) => {
	const { addNewNode, closeModal } = props;
	const [label, setLabel] = useState("");
	const [saving, setSaving] = useState(false);

	const handleTextChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setLabel(event.target.value);
	}, []);

	const cancelAdding = useCallback((): void => {
		setSaving(false);
		closeModal();
	}, [closeModal]);

	const addNode = useCallback(
		(event: MouseEvent): void => {
			event.stopPropagation();
			event.preventDefault();

			if (label) {
				addNewNode(label);
				setSaving(true);
			}
		},
		[addNewNode, label]
	);

	return (
		<ModalOverlay focusBack={!saving} onClose={props.closeModal}>
			<ActionContentbox
				headingElements={<ContentBoxElements.Title ariaLevel={1} text="Insert new node" />}
				footer={
					<ContentBoxElements.Footer>
						<ButtonGroup alignment="right">
							<Button onClick={cancelAdding} title="Cancel">
								Cancel
							</Button>
							<Button primary onClick={addNode} disabled={!label} title="Add">
								Add
							</Button>
						</ButtonGroup>
					</ContentBoxElements.Footer>
				}
			>
				<TextField
					value={label}
					label="Label"
					placeholder="Enter node label"
					className="-u-margin-t-sm"
					onChange={handleTextChange}
				/>
			</ActionContentbox>
		</ModalOverlay>
	);
};
