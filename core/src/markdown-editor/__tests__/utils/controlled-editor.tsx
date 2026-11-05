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
import { useState } from "react";

import type { MarkdownEditorProps } from "../../main/markdown-editor.api.js";
import { MarkdownEditor } from "../../main/markdown-editor.view.js";

import { ALL_MODES } from "./presets.js";

export interface ControlledEditorProps extends Partial<MarkdownEditorProps> {
	/** The markdown the host starts out holding. */
	initialValue?: string;
}

/**
 * Keeps the markdown in state for tests.
 * The editor is controlled, so a fixed `value` would undo every edit on the next render.
 *
 * Extra props pass through and `onChange` still fires so spies see each emit.
 *
 * Every mode is offered unless a test says otherwise: the editor itself offers `edit` only,
 * and most tests here switch modes.
 */
export const ControlledEditor: FC<ControlledEditorProps> = ({
	initialValue = "",
	onChange,
	allowedModes = ALL_MODES,
	...props
}) => {
	const [value, setValue] = useState(initialValue);

	return (
		<MarkdownEditor
			value={value}
			allowedModes={allowedModes}
			onChange={(next) => {
				setValue(next);
				onChange?.(next);
			}}
			{...props}
		/>
	);
};

ControlledEditor.displayName = "ControlledEditor";
