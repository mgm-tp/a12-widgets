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

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $setSelection, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from "lexical";
import { useEffect, useRef } from "react";

// Only consider the focus event as caused by the Tab key if it occurs within the TAB_TO_FOCUS_INTERVAL after the Tab key is pressed.
const TAB_TO_FOCUS_INTERVAL = 100;

export default function TabFocusPluginInternal(): null {
	const [editor] = useLexicalComposerContext();
	const lastTabKeyDownTimestampRef = useRef(0);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.key === "Tab") {
				lastTabKeyDownTimestampRef.current = event.timeStamp;
			}
		};

		window.addEventListener("keydown", handleKeyDown, true);

		return (): void => {
			window.removeEventListener("keydown", handleKeyDown, true);
		};
	}, []);

	useEffect(() => {
		return editor.registerCommand(
			FOCUS_COMMAND,
			(event: FocusEvent) => {
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					if (lastTabKeyDownTimestampRef.current + TAB_TO_FOCUS_INTERVAL > event.timeStamp) {
						$setSelection(selection.clone());
					}
				}

				return false;
			},
			COMMAND_PRIORITY_LOW
		);
	}, [editor]);

	return null;
}
