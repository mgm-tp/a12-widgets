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
import { useContext, useRef } from "react";

import { HeaderTrigger } from "../../../button/main/header-trigger/header-trigger.view.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { List } from "../../../list/main/list.view.js";
import type { MarkdownEditorMode, MarkdownEditorProps } from "../markdown-editor.api.js";
import { useMarkdownEditorMode } from "../shared/mode-context.js";

import { StyledMarkdownToolbarModeMenu } from "./toolbar.styled.js";

interface ModeOption {
	mode: MarkdownEditorMode;
	label?: string;
	icon: string;
	dataRole: string;
}

/**
 * The mode picker as it sits in the toolbar: a header trigger at the end of the bar
 * that names the current mode, and a menu with edit, source and view behind it.
 *
 * The mode comes from the editor around it, so a custom toolbar can drop this in
 * wherever it likes and it still works.
 *
 * With only one mode left to pick there is nothing to choose, so the button goes away.
 */
export const ModeMenu: FC<MarkdownEditorProps.ToolbarControlProps> = ({ disabled }) => {
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const { mode, availableModes, changeMode } = useMarkdownEditorMode();
	const closeRef = useRef<(() => void) | undefined>(undefined);

	const options: ModeOption[] = [
		{ mode: "edit", label: titles?.modeEdit, icon: "edit", dataRole: DataRoles.MarkdownEditor.ModeSwitcher.Edit },
		{ mode: "source", label: titles?.modeSource, icon: "code", dataRole: DataRoles.MarkdownEditor.ModeSwitcher.Source },
		{
			mode: "view",
			label: titles?.modeView,
			icon: "visibility",
			dataRole: DataRoles.MarkdownEditor.ModeSwitcher.View
		}
	];

	const offered = options.filter((option) => availableModes.includes(option.mode));

	// Nothing to switch between.
	if (offered.length < 2) {
		return null;
	}

	// The trigger shows the mode the editor is in, so the bar tells the user where they are
	// without opening the menu. The editor only ever sits in one of the offered modes.
	// HeaderTrigger is drawn for the dark application header; `multilingual light` is its
	// variant for a light surface, which the toolbar is.
	const current = offered.find((option) => option.mode === mode) ?? offered[0];

	const handleChooseMode = (next: MarkdownEditorMode): void => {
		changeMode(next);
		closeRef.current?.();
	};

	return (
		<StyledMarkdownToolbarModeMenu
			orientation="bottom-end"
			disabled={disabled}
			dataRole={DataRoles.MarkdownEditor.ModeSwitcher.Wrapper}
			close={(handler) => {
				closeRef.current = handler;
			}}
			triggerElement={
				<HeaderTrigger
					multilingual
					light
					graphic={current.icon}
					text={current.label}
					textTitle={titles?.modeSwitcherLabel}
					meta="keyboard_arrow_down"
					disabled={disabled}
					dataRole={DataRoles.MarkdownEditor.ModeSwitcher.Trigger}
				/>
			}
		>
			<List role="menu" dataRole={DataRoles.MarkdownEditor.ToolbarList}>
				{offered.map((option) => (
					<List.Item
						key={option.mode}
						htmlAttributes={{ role: "menuitem" }}
						dataRole={option.dataRole}
						text={option.label}
						graphic={<Icon>{option.icon}</Icon>}
						selected={option.mode === mode}
						onClick={() => handleChooseMode(option.mode)}
					/>
				))}
			</List>
		</StyledMarkdownToolbarModeMenu>
	);
};

ModeMenu.displayName = "MarkdownModeMenu";
