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

import { useState, useCallback } from "react";

import { getLocalStorage, setLocalStorage } from "./utils.js";

export interface InteractionHintSettingProps {
	enableInteractionHint: boolean;
	followCursor: boolean;
	hideArrow: boolean;
	toggleEnableInteractionHint: () => void;
	toggleFollowCursor: () => void;
	toggleHideArrow: () => void;
}

const INTERACTION_HINT_KEY = "interactionHint";
const FOLLOW_CURSOR_KEY = "followCursor";
const HIDE_ARROW_KEY = "hideArrow";

function useLocaleStorageState(key: string) {
	const [value, setValue] = useState(() => getLocalStorage(key) === "true");

	const setLocaleStorageValue = useCallback(
		() =>
			setValue((prev) => {
				const newValue = !prev;
				setLocalStorage(INTERACTION_HINT_KEY, String(newValue));

				return newValue;
			}),
		[]
	);

	return [value, setLocaleStorageValue] as const;
}

export function useInteractionHintSettings(): InteractionHintSettingProps {
	const [enableInteractionHint, toggleEnableInteractionHint] = useLocaleStorageState(INTERACTION_HINT_KEY);
	const [followCursor, toggleFollowCursor] = useLocaleStorageState(FOLLOW_CURSOR_KEY);
	const [hideArrow, toggleHideArrow] = useLocaleStorageState(HIDE_ARROW_KEY);

	return {
		enableInteractionHint,
		followCursor,
		hideArrow,
		toggleEnableInteractionHint,
		toggleFollowCursor,
		toggleHideArrow
	};
}
