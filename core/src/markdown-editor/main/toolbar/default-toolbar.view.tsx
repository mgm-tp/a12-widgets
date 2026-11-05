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

import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";

import { CodeBlockMenu } from "./code-block-menu.view.js";
import { HeadingMenu } from "./heading-menu.view.js";
import { ModeMenu } from "./mode-menu.view.js";
import { TableMenu } from "./table-menu/index.js";
import {
	BlockquoteButton,
	BoldButton,
	BulletListButton,
	CodeButton,
	HighlightButton,
	HorizontalRuleButton,
	ImageButton,
	IndentButton,
	ItalicButton,
	LinkButton,
	OrderedListButton,
	OutdentButton,
	RedoButton,
	StrikeButton,
	SubscriptButton,
	SuperscriptButton,
	TaskListButton,
	UnderlineButton,
	UndoButton
} from "./toolbar-controls.view.js";
import { StyledMarkdownToolbarControls } from "./toolbar.styled.js";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "./toolbar.view.js";

interface DefaultToolbarProps {
	/**
	 * Draws the formatting controls. `view` mode turns them off: there is nothing to format,
	 * but the bar and the mode menu stay, so the surface does not jump and the user can leave.
	 *
	 * @default true
	 */
	showControls?: boolean;
}

/**
 * The built-in toolbar: the full set of formatting controls, composed from the
 * same `MarkdownEditor.*` components available for custom toolbars.
 *
 * Each control hides itself when its `features` key is off. The last group is asked
 * about here too, because a group that empties would leave its separator behind.
 *
 * The formatting controls take the free space, so the mode menu sits at the far end of the bar.
 * `view` mode drops the controls and the menu stays where it was.
 */
export const DefaultToolbar: FC<DefaultToolbarProps> = ({ showControls = true }) => {
	// The surfaces, not the toolbar state: this renders the `Toolbar` that provides
	// that state, so it does not exist yet at this point.
	const { features } = useMarkdownEditorSurfaces();

	return (
		<Toolbar>
			{showControls && (
				<StyledMarkdownToolbarControls>
					<ToolbarGroup>
						<UndoButton />
						<RedoButton />
					</ToolbarGroup>

					<ToolbarSeparator />

					<ToolbarGroup>
						<BoldButton />
						<ItalicButton />
						<StrikeButton />
						<UnderlineButton />
						<HighlightButton />
						<CodeButton />
						<SubscriptButton />
						<SuperscriptButton />
						<HeadingMenu />
					</ToolbarGroup>

					<ToolbarSeparator />

					<ToolbarGroup>
						<BulletListButton />
						<OrderedListButton />
						<TaskListButton />
						<IndentButton />
						<OutdentButton />
					</ToolbarGroup>

					<ToolbarSeparator />

					<ToolbarGroup>
						<LinkButton />
						<ImageButton />
						<CodeBlockMenu />
						<BlockquoteButton />
						<HorizontalRuleButton />
					</ToolbarGroup>

					{features.table && (
						<>
							<ToolbarSeparator />

							<ToolbarGroup>
								<TableMenu />
							</ToolbarGroup>
						</>
					)}
				</StyledMarkdownToolbarControls>
			)}

			<ModeMenu />
		</Toolbar>
	);
};

DefaultToolbar.displayName = "MarkdownDefaultToolbar";
