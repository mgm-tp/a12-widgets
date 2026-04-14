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

import type { FC, KeyboardEvent } from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import { styled, css } from "styled-components";
import { Key } from "ts-key-enum";

import { fadeIn } from "../../../theme/base/mixins/_animation.js";
import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import type { Orientation } from "../../../common/main/alignment.js";
import { addPrefix } from "../../../common/main/utils.js";

import type { ConnectedToastProps } from "./connected-toast.api.js";
import { ConnectedToastTemplate } from "./template/connected-toast.template.view.js";

const StyledAttachedPortal = styled(AttachedPortal).withConfig({ displayName: "StyledAttachedPortal-sc-" })(
	({ theme }) => {
		const { animationDuration } = theme.components.connectedToast;

		return css`
			animation: ${fadeIn()} ${animationDuration};
		`;
	}
);

export const ConnectedToast: FC<ConnectedToastProps> = ({
	duration = 2000,
	focusOnOpen = true,
	hideOnReferenceElementPositionChange = true,
	closeOnOutsideClick = true,
	type = "temporary",
	...props
}) => {
	const timeoutHandle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const toastRef = useRef<HTMLDivElement | null>(null);

	const {
		referenceElement,
		wrapperRef,
		orientation: orientationProp,
		variant = "info",
		message,
		onClose,
		...rest
	} = props;

	const [orientation, setOrientation] = useState<Orientation | undefined>(orientationProp);

	const handlePortalVisibilityChange = useCallback(
		(visible: boolean): void => {
			if (!visible && onClose) {
				onClose();
			}
		},
		[onClose]
	);

	const handleRef = (ref: HTMLDivElement | null): void => {
		toastRef.current = ref;
		wrapperRef?.(ref);
	};

	const handleOrientationChange = useCallback((orientation: Orientation): void => {
		setOrientation(orientation);
	}, []);

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
		if (event.key === Key.Tab) {
			onClose?.();
			referenceElement.focus();
		}
	};

	useEffect(() => {
		const setTimeoutIfNecessary = (): void => {
			if (timeoutHandle.current === undefined && type === "temporary") {
				timeoutHandle.current = setTimeout(handleCloseToast, duration);
			}
		};

		const clearTimeoutIfNecessary = (): void => {
			if (timeoutHandle.current !== undefined && type === "temporary") {
				clearTimeout(timeoutHandle.current);
				timeoutHandle.current = undefined;
			}
		};

		const handleCloseToast = (): void => {
			clearTimeoutIfNecessary();
			onClose?.();
			referenceElement.focus();
		};

		setTimeoutIfNecessary();

		return (): void => {
			clearTimeoutIfNecessary();
		};
	}, [duration, onClose, referenceElement, type]);

	return (
		<StyledAttachedPortal
			className={addPrefix("toast-animation--connected")}
			orientation={orientation}
			referenceElement={referenceElement}
			closeOnOutsideClick={closeOnOutsideClick}
			hideOnReferenceElementPositionChange={hideOnReferenceElementPositionChange}
			adjustPositionToScreen
			focusOnOpen={focusOnOpen}
			onVisibilityChange={handlePortalVisibilityChange}
			onOrientationChange={handleOrientationChange}
			onKeyDown={handleKeyDown}
		>
			<ConnectedToastTemplate
				toastOrientation={orientation}
				message={message}
				variant={variant}
				{...rest}
				wrapperRef={handleRef}
			/>
		</StyledAttachedPortal>
	);
};

ConnectedToast.displayName = "ConnectedToast";
