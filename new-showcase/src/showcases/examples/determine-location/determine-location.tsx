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

import type { FC, ChangeEvent } from "react";
import { useCallback, useState, useRef } from "react";
import { styled, css } from "styled-components";

import type {
	CollapsibleTreeNodeModel,
	InsertableTreeProps,
	MapTreeNode,
	SelectableTreeNodeModel,
	TreeNodeModel,
	DropDownItem
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Collapsible,
	find,
	findById,
	findTreeHTMLNodeById,
	Insertable,
	InsertableTree,
	Selectable,
	TreeAdapter,
	ActionContentbox,
	ContentBoxElements,
	Autocomplete,
	Button,
	ButtonGroup,
	ButtonGroupContainer,
	Icon,
	ModalOverlay,
	TextField
} from "@com.mgmtp.a12.widgets/widgets-core";

import { getCurrentTheme } from "../../../helpers/theme-selector.js";

interface DataItem {
	id: string;
	label: string;
	parentId?: string;
}

let DATA: DataItem[] = [
	{
		id: "1",
		label: "Submission"
	},
	{
		id: "2",
		label: "General Data",
		parentId: "1"
	},
	{
		id: "3",
		label: "Costs",
		parentId: "2"
	},
	{
		id: "4",
		label: "Time",
		parentId: "2"
	},
	{
		id: "5",
		label: "Insurance Company",
		parentId: "2"
	},
	{
		id: "6",
		label: "Partner",
		parentId: "1"
	},
	{
		id: "7",
		label: "Client",
		parentId: "6"
	},
	{
		id: "8",
		label: "Broker",
		parentId: "6"
	},
	{
		id: "9",
		label: "Subagent",
		parentId: "6"
	},
	{
		id: "10",
		label: "Insurance Company",
		parentId: "6"
	}
];

const CustomTree = Selectable(Collapsible(Insertable(TreeAdapter(InsertableTree))));

interface IdentifiableFileNode
	extends CollapsibleTreeNodeModel, SelectableTreeNodeModel, InsertableTreeProps.TreeNodeModel {
	children?: IdentifiableFileNode[];
}

function getTreeRootNode(data: DataItem[], selectedId?: string): IdentifiableFileNode {
	const root = data.find((item) => !item.parentId);

	const { id, label } = root ?? {};

	return {
		id,
		label,
		children: [],
		selected: id === selectedId
	};
}

function convertDataToTreeNode(
	root: IdentifiableFileNode,
	data: DataItem[],
	selectedId?: string
): IdentifiableFileNode {
	if (!root.children) {
		root.children = [];
	}

	root.children.push(
		...data
			.filter((item) => item.parentId === root.id)
			.map((item) => ({
				id: item.id,
				label: item.label,
				selected: item.id === selectedId
			}))
	);
	root.children.forEach((child: IdentifiableFileNode) => convertDataToTreeNode(child, data, selectedId));

	return root;
}

function getDropDownRootSection(data: DataItem[]): DropDownItem {
	const result = getTreeRootNode(data);

	return {
		id: result.id,
		label: result.label as string
	};
}

const isBaseTheme = getCurrentTheme().includes("base");

const CustomSecondaryText = styled.span(({ theme }) => {
	return css`
		[data-role="plasma-icon"] {
			font-size: ${isBaseTheme ? theme.typography.fontSize.lgFontSize : theme.typography.fontSize.nanoFontSize};
			vertical-align: middle;
			margin-bottom: 2px;
		}
	`;
});

function convertDataToDropDownItems(root: DropDownItem, data: DataItem[]): DropDownItem[] {
	const autocompleteItems: DropDownItem[] = [
		{
			id: root.id,
			label: root.label
		}
	];
	const firstItem: DropDownItem = {
		id: root.id,
		label: root.label,
		children: []
	};

	const directChildren: DropDownItem[] = [];
	const indirectChildren: DropDownItem[] = [];

	data.forEach((dataItem) => {
		if (firstItem.id === dataItem.id) {
			return;
		}

		if (!firstItem.children) {
			firstItem.children = [];
		}

		let parent: DataItem | undefined;

		if (dataItem.parentId) {
			parent = data.find((parentItem) => parentItem.id === dataItem.parentId && parentItem.id !== firstItem.id);
		}

		if (parent) {
			indirectChildren.push({
				id: dataItem.id,
				label: dataItem.label,
				secondaryText: (
					<CustomSecondaryText>
						&hellip; <Icon>chevron_right</Icon> {parent.label}
					</CustomSecondaryText>
				)
			});
		} else {
			directChildren.push({
				id: dataItem.id,
				label: dataItem.label
			});
		}
	});
	firstItem.children?.push(...[...directChildren, ...indirectChildren]);
	autocompleteItems.push(firstItem);

	return autocompleteItems;
}

interface IdentifiableTreeNodeTemplateModel extends InsertableTreeProps.TreeNodeTemplateModel {
	id: string;
	fileNode: TreeNodeModel;
}

export const DetermineLocation: FC = () => {
	const getTreeData = useCallback((data: DataItem[], selectedId?: string): IdentifiableFileNode => {
		return convertDataToTreeNode(getTreeRootNode(data, selectedId), data, selectedId);
	}, []);

	const getAutocompleteData = useCallback((data: DataItem[]): DropDownItem[] => {
		return convertDataToDropDownItems(getDropDownRootSection(data), data);
	}, []);

	const [treeData, setTreeData] = useState<IdentifiableFileNode>(getTreeData(DATA));
	const [autocompleteData, setAutocompleteData] = useState<DropDownItem[]>(getAutocompleteData(DATA));
	const [showModal, setShowModal] = useState(false);
	const [newNodeTitle, setNewNodeTitle] = useState("");
	const [insertNodeId, setInsertNodeId] = useState("");
	const [insertPosition, setInsertPosition] = useState<InsertableTreeProps.InsertPosition | null>(null);

	const collapseNodeHandler = useRef<(id: any) => void | null>(null);
	const isCreatedNewNode = useRef(false);

	const filterAutocompleteItemsRecursively = useCallback(
		(filterText: string, items: DropDownItem[]): DropDownItem[] => {
			const result: DropDownItem[] = [];

			for (const item of items) {
				const checkText = item.label.toLocaleLowerCase();

				if (item.children && item.children.length > 0) {
					const childResult = filterAutocompleteItemsRecursively(filterText, item.children);
					const newItem = JSON.parse(JSON.stringify(item));

					if (childResult.length > 0) {
						newItem.children = childResult;
						result.push(newItem);
					}
				} else if (checkText.startsWith(filterText)) {
					result.push(item);
				} else if (checkText.includes(filterText)) {
					result.push(item);
				}
			}

			return result;
		},
		[]
	);

	const filterAutocompleteItems = useCallback(
		(filterText: string): DropDownItem[] => {
			const autocompleteData = getAutocompleteData(DATA);

			if (filterText !== "") {
				return filterAutocompleteItemsRecursively(filterText, autocompleteData);
			}

			return autocompleteData;
		},
		[filterAutocompleteItemsRecursively, getAutocompleteData]
	);

	const handleSearch = useCallback(
		(value: string): void => {
			setAutocompleteData(filterAutocompleteItems(value.toLocaleLowerCase()));
		},
		[filterAutocompleteItems]
	);

	const onToggleSelection = useCallback((node: IdentifiableFileNode): void => {
		const copiedData = { ...convertDataToTreeNode(getTreeRootNode(DATA), DATA) };
		const toggledNode = findById(copiedData, node.id) as IdentifiableFileNode;
		const previouslySelectedNode = find(copiedData, (n: IdentifiableFileNode) => !!n.selected) as IdentifiableFileNode;

		if (previouslySelectedNode) {
			if (previouslySelectedNode === toggledNode) {
				toggledNode.selected = !toggledNode.selected;
			} else {
				previouslySelectedNode.selected = false;
				toggledNode.selected = true;
			}
		} else {
			toggledNode.selected = true;
		}

		setTreeData(copiedData);
	}, []);

	const onInsertStart = useCallback(
		(position: InsertableTreeProps.InsertPosition, node: IdentifiableTreeNodeTemplateModel): void => {
			if (!node.selected) {
				onToggleSelection({ label: node.label, id: node.fileNode.id, selected: node.selected });
			}

			setShowModal(true);
			setInsertPosition(position);
			setInsertNodeId(node.fileNode.id);
		},
		[onToggleSelection]
	);

	const handleNewNodeTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setNewNodeTitle(event.target.value);
	}, []);

	const closeModal = useCallback((): void => {
		setShowModal(false);
		setNewNodeTitle("");
		setInsertPosition(null);
		isCreatedNewNode.current = false;
	}, []);

	const focusNewRow = useCallback((nodeId: string): void => {
		const newRow = findTreeHTMLNodeById(nodeId);

		if (newRow) {
			newRow.focus();
		}
	}, []);

	const addNewNode = useCallback((): void => {
		const randomId = `${Math.round(Math.random() * 1000)}`;

		if (!insertNodeId || !newNodeTitle || !insertPosition) {
			return;
		}

		const dataItem = DATA.find((item) => item.id === insertNodeId);

		if (!dataItem) {
			return;
		}

		const dataItemIndex = DATA.indexOf(dataItem);

		const newDataItem: DataItem = {
			id: randomId,
			label: newNodeTitle
		};

		switch (insertPosition) {
			case "top": {
				const parentId = dataItem.parentId;

				if (parentId) {
					DATA = [...DATA.slice(0, dataItemIndex), { ...newDataItem, parentId }, ...DATA.slice(dataItemIndex)];
				}

				break;
			}

			case "bottom": {
				const parentId = dataItem.parentId;

				if (parentId) {
					DATA = [
						...DATA.slice(0, dataItemIndex),
						dataItem,
						{ ...newDataItem, parentId },
						...DATA.slice(dataItemIndex + 1)
					];
				}

				break;
			}

			case "asChild": {
				DATA = [{ ...newDataItem, parentId: insertNodeId }, ...DATA];
				collapseNodeHandler.current?.(insertNodeId);
				break;
			}

			default:
				return;
		}

		isCreatedNewNode.current = true;
		setAutocompleteData(getAutocompleteData(DATA));
		setTreeData(getTreeData(DATA, newDataItem.id));
		closeModal();
		setTimeout(() => focusNewRow(newDataItem.id));
	}, [
		closeModal,
		collapseNodeHandler,
		focusNewRow,
		getAutocompleteData,
		getTreeData,
		insertNodeId,
		insertPosition,
		newNodeTitle
	]);

	const initializeTemplateTreeNode: MapTreeNode<IdentifiableTreeNodeTemplateModel> = useCallback((n, chained) => {
		return {
			...chained,
			fileNode: n,
			id: n.id
		};
	}, []);

	const expandAllParentNodes = useCallback(
		(root: IdentifiableFileNode, node: IdentifiableFileNode): void => {
			const parent: IdentifiableFileNode | undefined = find(root, (parentNode) => {
				return !!parentNode.children && parentNode.children.findIndex((child) => child.id === node.id) !== -1;
			}) as IdentifiableFileNode;

			if (parent) {
				collapseNodeHandler.current?.(parent.id);
				expandAllParentNodes(root, parent);
			}
		},
		[collapseNodeHandler]
	);

	const selectCurrentNode = useCallback(
		(root: IdentifiableFileNode, node: IdentifiableFileNode): IdentifiableFileNode => {
			const toggledNode = findById(root, node.id) as IdentifiableFileNode;
			const previouslySelectedNode = find(root, (n: IdentifiableFileNode) => !!n.selected) as IdentifiableFileNode;

			if (previouslySelectedNode) {
				if (previouslySelectedNode.id !== toggledNode.id) {
					previouslySelectedNode.selected = false;
					toggledNode.selected = true;
				}
			} else {
				toggledNode.selected = true;
			}

			return root;
		},
		[]
	);

	const onAutoCompleteValueChange = useCallback(
		(value: string | DropDownItem): void => {
			if (!value || typeof value === "string" || !value.id) {
				return;
			}

			const node = findById(getTreeData(DATA), value.id);

			if (node) {
				setTreeData((prevState) => {
					const copiedData = { ...prevState };
					expandAllParentNodes(copiedData, node);
					selectCurrentNode(copiedData, node);

					return copiedData;
				});
			}
		},
		[expandAllParentNodes, getTreeData, selectCurrentNode]
	);

	const getTotalAutocompleteItems = useCallback((items: DropDownItem[]): number => {
		let total = 0;

		for (const item of items) {
			if (item.children) {
				total += getTotalAutocompleteItems(item.children);
			} else {
				total++;
			}
		}

		return total;
	}, []);

	return (
		<div style={{ maxWidth: 400, height: 625, width: "100%" }}>
			<ActionContentbox
				className="contentbox--determine-location"
				padding={false}
				headingElements={<ContentBoxElements.Title text="Move node to..." />}
				subActionBar={
					<ContentBoxElements.SubActionBar>
						<Autocomplete
							lightBackground
							inputPlaceHolder="Search"
							hintTemplate="{total} matches"
							items={autocompleteData}
							onSearch={handleSearch}
							onValueChange={onAutoCompleteValueChange}
						/>
					</ContentBoxElements.SubActionBar>
				}
				footer={<ContentBoxElements.Footer />}
			>
				<CustomTree
					root={treeData}
					tplTreeNode={initializeTemplateTreeNode}
					onToggleSelection={onToggleSelection}
					onInsert={onInsertStart}
					buttonTitles={{
						top: "Insert top",
						bottom: "Insert below",
						asChild: "Insert as child"
					}}
					scrollSelectedNodeIntoView
					collapseNodeHandler={(handler) => (collapseNodeHandler.current = handler)}
				/>
			</ActionContentbox>
			{showModal && (
				<ModalOverlay onClose={closeModal} focusBack={!isCreatedNewNode.current}>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={1} text="Insert new node" />}
						footer={
							<ContentBoxElements.Footer>
								<ButtonGroupContainer>
									<ButtonGroup alignment="right">
										<Button onClick={closeModal}>Cancel</Button>
										<Button primary onClick={addNewNode}>
											Add
										</Button>
									</ButtonGroup>
								</ButtonGroupContainer>
							</ContentBoxElements.Footer>
						}
					>
						<TextField
							value={newNodeTitle}
							onChange={handleNewNodeTitleChange}
							label="Title"
							placeholder="Enter node title"
						/>
					</ActionContentbox>
				</ModalOverlay>
			)}
		</div>
	);
};
