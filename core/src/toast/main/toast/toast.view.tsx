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

import type { FC, ReactElement } from "react";
import { useContext, useRef, useCallback, useEffect } from "react";

import { getParentElement, noop } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { ToastGroupContext } from "../toast-group.view.js";

import { ToastTemplate } from "./template/toast.template.view.js";
import type { ToastProps } from "./toast.api.js";

export const Toast: FC<ToastProps> = (props: ToastProps): ReactElement<ToastProps> | null => {
	const { duration = 3000, onClose, type = "temporary" } = props;
	const { shouldStopTimeout, toastCount, stackable, animationTimeout } = useContext(ToastGroupContext);

	const timeoutId = useRef<number | null>(null);
	const toastRef = useRef<HTMLDivElement | null>(null);
	const isTemporary = type === "temporary";

	const getToastRef = (ref: HTMLDivElement | null): void => {
		toastRef.current = ref;
		props.wrapperRef?.(ref);
	};

	const handleSetTimeOut = useCallback((): void => {
		const toastContainer = getParentElement(
			toastRef.current,
			(currentParent) => currentParent.getAttribute("data-role") === DataRoles.Toast.Container
		);

		const toastArray = Array.from(toastContainer?.querySelectorAll(`[data-role=${DataRoles.Toast}]`) ?? []);
		const toastIndex = toastArray.indexOf(toastRef.current as Element);

		timeoutId.current = window.setTimeout(onClose ?? noop, duration + toastIndex * (animationTimeout || 400));
	}, [animationTimeout, duration, onClose]);

	const handleClearTimeout = useCallback((): void => {
		if (timeoutId.current) {
			window.clearTimeout(timeoutId.current);
		}
	}, []);

	useEffect(() => {
		const isNotStackable = isTemporary && !stackable;
		const startTimeout = (): void => {
			if (isNotStackable) {
				handleSetTimeOut();
			}
		};

		startTimeout();

		return (): void => {
			if (isNotStackable) {
				handleClearTimeout();
			}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const isStackable = isTemporary && stackable;

		const startTimeout = (shouldStopTimeout?: boolean): void => {
			if (isStackable) {
				if (shouldStopTimeout) {
					return;
				}

				handleSetTimeOut();
			}
		};

		startTimeout(shouldStopTimeout);

		return (): void => {
			if (isStackable) {
				handleClearTimeout();
			}
		};
	}, [handleClearTimeout, handleSetTimeOut, isTemporary, shouldStopTimeout, stackable]);

	return (
		<ToastTemplate
			{...props}
			focusOnMount={stackable ? false : props.focusOnMount}
			ariaLevel={toastCount > 1 ? 3 : undefined}
			wrapperRef={getToastRef}
		/>
	);
};

Toast.displayName = "Toast";
