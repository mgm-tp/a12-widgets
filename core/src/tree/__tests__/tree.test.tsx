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

import { getByDataRole, queryByDataRole, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";

import { Icon } from "../../icon/main/icon.view.js";
import { noop } from "../../common/main/utils.js";
import { Counter } from "../../counter/main/counter.view.js";
import { Tooltip } from "../../tooltip/main/tooltip.view.js";

import { TreeContainer, TreeNode } from "../main/tpl/tree-elements.tpl.js";
import type {
	CollapsibleTreeNodeModel,
	MapTreeNode,
	SelectableTreeNodeModel,
	TreeNodeModel
} from "../main/behavior/tree.behavior.api.js";
import { Selectable } from "../main/behavior/tree.selectable.js";
import { Collapsible } from "../main/behavior/tree.collapsible.js";
import { TreeAdapter } from "../main/behavior/tree.adapter.js";
import { Tree } from "../main/tpl/tree.tpl.view.js";

namespace Icons {
	export const COMPUTER = <Icon>computer</Icon>;
	export const DRIVE = <Icon>storage</Icon>;
	export const FOLDER = <Icon>folder</Icon>;
	export const FILE = <Icon>insert_drive_file</Icon>;
}

describe("com.mgmtp.a12.widgets.tree", () => {
	test("rendering tree template", () => {
		const { container } = render(
			<TreeContainer id="container">
				<TreeNode label="Root" level={0} onArrowClick={noop} id="root-node">
					<TreeNode label="Plain node" level={1} id="0" />

					<TreeNode label="Node with icon" level={1} icon={Icons.COMPUTER} id="1" />

					<TreeNode label="Node with arrow" level={1} showArrow id="5" />

					<TreeNode label="Node with interactive arrow" level={1} onArrowClick={noop} id="6" />

					<TreeNode label="Nested node level 0" level={1} showArrow id="2">
						<TreeNode label="Nested node level 1" level={2} showArrow id="3">
							<TreeNode label="Nested node level 2" level={3} showArrow id="4" />
						</TreeNode>
					</TreeNode>

					<TreeNode label="Disabled node" level={1} disabled onArrowClick={noop} id="7" />

					<TreeNode label="Node status" level={1} onArrowClick={noop} id="8">
						<TreeNode label="Selected node" level={2} onArrowClick={noop} selected id="9">
							<TreeNode label="Highlight-variant success node" level={3} highlightVariant="success" id="11" />
						</TreeNode>
						<TreeNode label="Highlighted node" level={2} highlighted id="10" />
					</TreeNode>
				</TreeNode>
			</TreeContainer>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering tree template fitToParent", () => {
		const { container } = render(
			<TreeContainer fitToParent id="container">
				<TreeNode label="Root" level={0} onArrowClick={noop} id="root-node">
					<TreeNode label="Plain node" level={1} id="0" />

					<TreeNode label="Node with icon" level={1} icon={Icons.COMPUTER} id="1" />

					<TreeNode label="Node with arrow" level={1} showArrow id="5" />

					<TreeNode label="Node with interactive arrow" level={1} onArrowClick={noop} id="6" />

					<TreeNode label="Nested node level 0" level={1} showArrow id="2">
						<TreeNode label="Nested node level 1" level={2} showArrow id="3">
							<TreeNode label="Nested node level 2" level={3} showArrow id="4" />
						</TreeNode>
					</TreeNode>

					<TreeNode label="Disabled node" level={1} disabled onArrowClick={noop} id="7" />

					<TreeNode label="Node status" level={1} onArrowClick={noop} id="8">
						<TreeNode label="Selected node" level={2} onArrowClick={noop} selected id="9">
							<TreeNode label="Highlight-variant success node" level={3} highlightVariant="success" id="11" />
						</TreeNode>
						<TreeNode label="Highlighted node" level={2} highlighted id="10" />
					</TreeNode>
				</TreeNode>
			</TreeContainer>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering combined tree", () => {
		interface FileNode extends TreeNodeModel, CollapsibleTreeNodeModel, SelectableTreeNodeModel {
			type: "computer" | "drive" | "folder" | "file";
			children?: FileNode[];
			locked?: boolean;
		}

		const BaseTree = Selectable(Collapsible(TreeAdapter(Tree)));

		const TREE: FileNode = {
			id: 1,
			label: "My Computer",
			icon: Icons.COMPUTER,
			type: "computer",
			initiallyExpanded: true,
			locked: true,
			children: [
				{
					id: 2,
					label: "C:",
					icon: <Counter value={10} type="constructive" />,
					type: "drive",
					disabled: true,
					initiallyExpanded: true,
					children: [
						{
							id: 3,
							label: "Programs",
							type: "folder",
							icon: Icons.FOLDER
						},
						{
							id: 4,
							label: "Temp",
							type: "folder",
							icon: <Counter value={10} overflowCount={9} />
						},
						{
							id: 5,
							label: "ZANS and quiet a long text, that it has to display multiline",
							type: "folder",
							icon: <img alt="" src="images/dnd_image.png" />,
							children: [
								{
									id: 6,
									label: "System32",
									type: "folder",
									icon: Icons.FOLDER,
									children: [
										{
											id: 7,
											label: "sasser.dll",
											type: "file",
											icon: Icons.FILE
										}
									]
								}
							]
						},
						{
							id: 8,
							label: "swap.sys",
							type: "file",
							icon: (
								<Tooltip text="Counter with tooltip">
									<Counter value={3} addonAfter={<Icon>done</Icon>} type="destructive" />
								</Tooltip>
							)
						},
						{
							id: 9,
							label: "Locked",
							type: "folder",
							icon: Icons.FOLDER,
							locked: true
						}
					]
				},
				{
					id: 10,
					label: "D:",
					type: "drive",
					icon: Icons.DRIVE,
					selected: true
				},
				{
					id: 11,
					label: "E:",
					type: "drive",
					icon: Icons.DRIVE,
					children: [
						{
							id: 12,
							label: "autostart.bat",
							type: "file",
							icon: Icons.FILE
						}
					]
				}
			]
		};

		const tplTreeNode: MapTreeNode = (n, chained) => {
			return {
				...chained,
				className: n.disabled && n.children ? "disabled-but-expandable" : undefined,
				fileNode: n
			};
		};

		const { container } = render(
			<>
				<BaseTree root={TREE} tplTreeNode={tplTreeNode} onToggleSelection={noop} id="combined-behaviour" />
			</>
		);

		// Find the disabled tree node (C: drive)
		const disabledTreeNode = document.getElementById("tree-node-2");

		// Verify the disabled tree node exists and has the custom className from MapTreeNode
		expect(disabledTreeNode).toBeTruthy();
		expect(disabledTreeNode?.className).toContain("disabled-but-expandable");

		expect(container.firstChild).toMatchSnapshot();
	});

	test("should enable the arrow button of a disabled row", () => {
		const onArrowClick = vi.fn();

		const { container } = render(
			<TreeContainer id="container">
				<TreeNode label="Root" level={0} onArrowClick={onArrowClick} id="root-node" disabled>
					<TreeNode label="Highlight-variant success node" level={3} highlightVariant="success" id="11" />
				</TreeNode>
			</TreeContainer>
		);

		const arrowButton = getByDataRole(container, "tree-node-expander");
		expect(arrowButton.getAttribute("disabled")).toBeFalsy();
	});

	test("should enable the arrow button of a non-interactive row", () => {
		const onArrowClick = vi.fn();

		const { container } = render(
			<TreeContainer id="container">
				<TreeNode label="Root" level={0} onArrowClick={onArrowClick} id="root-node" interactive={false}>
					<TreeNode label="Highlight-variant success node" level={3} highlightVariant="success" id="11" />
				</TreeNode>
			</TreeContainer>
		);

		const arrowButton = getByDataRole(container, "tree-node-expander");
		expect(arrowButton.getAttribute("disabled")).toBeFalsy();
	});

	test("should disable the arrow button if `onArrowClick` is not provided", () => {
		const { container } = render(
			<TreeContainer id="container">
				<TreeNode label="Root" level={0} id="root-node" showArrow>
					<TreeNode label="Highlight-variant success node" level={3} highlightVariant="success" id="11" />
				</TreeNode>
			</TreeContainer>
		);

		const arrowButton = getByDataRole(getByDataRole(container, "tree-node-expander"), "button");
		expect(arrowButton.getAttribute("disabled")).toBe("");
	});

	test("should not show the arrow button if `showArrow` and `onArrowClick` are not provided", () => {
		const { container } = render(
			<TreeContainer id="container">
				<TreeNode label="Root" level={0} id="root-node">
					<TreeNode label="Highlight-variant success node" level={3} highlightVariant="success" id="11" />
				</TreeNode>
			</TreeContainer>
		);

		expect(queryByDataRole(container, "tree-node-expander")).toBeFalsy();
	});
});
