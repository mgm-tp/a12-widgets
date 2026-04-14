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

import type { FC, CSSProperties } from "react";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import { Portal } from "../../../../../portal/main/portal.view.js";
import { provider } from "../../../../../common/main/device-detector.js";
import { DataRoles } from "../../../../../common/main/data-roles.js";

import type { SpellCheckPopupProps } from "../spell-check-plugin.api.js";

import type { SpellCheckPopupInternalProps } from "./spell-check-popup.api.js";

export const SpellCheckPopupInternal: FC<SpellCheckPopupInternalProps & SpellCheckPopupProps> = (props) => {
	const [isVisible, setVisible] = useState(false);
	const [misspelledWord, setMisspelledWord] = useState("");
	const [position, setPosition] = useState<{ top: number; left: number }>();
	const openTimeoutId = useRef<number | null>(null);
	const closeTimeoutId = useRef<number | null>(null);

	const { open, close, popupRef, delayRender = 500, render, ...rest } = props;

	const clearTimeout = (): void => {
		if (openTimeoutId.current !== null) {
			window.clearTimeout(openTimeoutId.current);
			openTimeoutId.current = null;
		}

		if (closeTimeoutId.current !== null) {
			window.clearTimeout(closeTimeoutId.current);
			closeTimeoutId.current = null;
		}
	};

	const openPopup = useCallback(
		(position: { top: number; left: number }): void => {
			clearTimeout();
			openTimeoutId.current = window.setTimeout(() => {
				setVisible(true);
				setPosition(position);
			}, delayRender);
		},
		[delayRender]
	);

	const closePopup = useCallback((position?: { top: number; left: number }): void => {
		clearTimeout();
		setVisible(false);

		if (position) {
			setPosition(position);
		}
	}, []);

	const getStyle = useMemo((): CSSProperties => {
		return isVisible
			? {
					visibility: "visible",
					position: "absolute",
					...position
				}
			: {
					visibility: "hidden",
					position: "absolute",
					...position
				};
	}, [isVisible, position]);

	useEffect(() => {
		open?.((misspelledWord: string, pageX: number, pageY: number) => {
			const top = window.scrollY !== 0 && !provider.isDesktop() ? window.scrollY + pageY : pageY;
			const position = {
				top,
				left: pageX
			};
			setMisspelledWord(misspelledWord);
			openPopup(position);
		});
	}, [open, openPopup]);

	useEffect(() => {
		close?.(() => closePopup());
	}, [close, closePopup]);

	useEffect(() => {
		return () => clearTimeout();
	}, []);

	const children = render?.(misspelledWord);

	return children ? (
		<Portal>
			<div
				{...rest}
				style={{ ...getStyle }}
				onMouseOver={clearTimeout}
				onMouseLeave={() => closePopup()}
				ref={popupRef}
				data-role={DataRoles.RichTextEditor.SpellCheckPopup}
			>
				{children}
			</div>
		</Portal>
	) : null;
};

SpellCheckPopupInternal.displayName = "SpellCheckPopupInternal";
