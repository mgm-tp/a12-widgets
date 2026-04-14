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

import type { KeyboardEvent, ReactElement } from "react";
import { useState, useCallback } from "react";
import { Key } from "ts-key-enum";

import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import type { Orientation } from "../../../common/main/alignment.js";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { StyledContextMenuDialog } from "./table.styled.js";

export function ContextMenuTpl(
	props: TableTemplateProps.ContextMenuProps | TableTemplateProps.HeadContextMenuProps
): ReactElement | null {
	const { position, renderer, closeHandler, ...rest } = props;

	const orientations: Orientation[] = ["bottom-start", "bottom-end", "top-start", "top-end"];

	const [isTopEnd, setIsTopEnd] = useState(false);

	const onKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === Key.Escape) {
				closeHandler();
			}
		},
		[closeHandler]
	);

	const onVisibilityChange = useCallback(
		(isVisible: boolean) => {
			if (!isVisible) {
				closeHandler();
			}
		},
		[closeHandler]
	);

	const onOrientationChange = useCallback((orientation: Orientation) => {
		setIsTopEnd(orientation === "top-end");
	}, []);

	return (
		<AttachedPortal
			position={position}
			fixedOrientation
			adjustPositionToScreen
			onClickOutside={closeHandler}
			onKeyDown={onKeyDown}
			onVisibilityChange={onVisibilityChange}
			// Adding margins so the first item does not have hover styles immediately after opening context menu
			className={joinClassNames(addPrefix("-u-margin-3xs"), { "-u-negative-margin-l-3xs": isTopEnd })}
			orientationList={orientations}
			onOrientationChange={onOrientationChange}
		>
			<StyledContextMenuDialog>{renderer?.({ ...rest, closeHandler })}</StyledContextMenuDialog>
		</AttachedPortal>
	);
}

ContextMenuTpl.displayName = "ContextMenuTpl";
