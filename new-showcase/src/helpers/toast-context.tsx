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

import type { FC, ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import type { Container, Variant } from "@com.mgmtp.a12.widgets/widgets-core";
import { Toast, ToastGroup } from "@com.mgmtp.a12.widgets/widgets-core";

export interface ShowToastOptions {
	header?: ReactNode;
	message: ReactNode;
	variant?: Variant;
}

interface ToastEntry extends ShowToastOptions {
	key: string;
}

interface ToastContextValue {
	showToast(options: ShowToastOptions): void;
}

const ToastContext = createContext<ToastContextValue>({
	showToast: () => {}
});

export function useToast(): ToastContextValue {
	return useContext(ToastContext);
}

export const ToastProvider: FC<Container> = ({ children }) => {
	const [toasts, setToasts] = useState<ToastEntry[]>([]);
	const counter = useRef(0);

	const showToast = useCallback((options: ShowToastOptions): void => {
		const key = `toast-${counter.current++}`;
		setToasts((prev) => [...prev, { ...options, key }]);
	}, []);

	const removeToast = useCallback((key: string): void => {
		setToasts((prev) => prev.filter((t) => t.key !== key));
	}, []);

	const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastGroup position="top-right">
				{toasts.map((toast) => (
					<Toast
						key={toast.key}
						type="temporary"
						variant={toast.variant ?? "info"}
						header={toast.header}
						message={toast.message}
						onClose={(): void => removeToast(toast.key)}
					/>
				))}
			</ToastGroup>
		</ToastContext.Provider>
	);
};
