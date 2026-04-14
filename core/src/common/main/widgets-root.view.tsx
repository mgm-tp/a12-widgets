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

import type { FC, MutableRefObject, RefObject } from "react";
import { createContext, useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";

import type { Container } from "./base-props.js";
import { isBrowser } from "./is-browser.js";
import { DataRoles } from "./data-roles.js";

export const PortalContext = createContext<{ portalPlaceholderRef: RefObject<HTMLElement | null> }>({
	portalPlaceholderRef: { current: isBrowser ? document.body : null }
});

PortalContext.displayName = "PortalContext";

const StyledPortalPlaceholder = styled("div").withConfig({ displayName: "StyledPortalPlaceholder-sc-" })`
	left: 0;
	position: fixed;
	top: 0;
	width: 100vw;
`;

declare global {
	interface Window {
		previousActiveElement: Element | null;
	}
}

/**
 * This component renders its children plus a placeholder div that will be then available to mount all portals inside.
 * This is very useful in case you want to scope all the portals inside the root div of the React tree and not in the
 * HTML body. It should be used to wrap the outermost element of your application.
 */
export const WidgetsRoot: FC<Container> = (props) => {
	const [portalPlaceholder, setPortalPlaceholder] = useState<MutableRefObject<HTMLDivElement | null>>({
		current: null
	});

	const handlePortalPlaceholderRef = useCallback((ref: HTMLDivElement | null) => {
		setPortalPlaceholder({ current: ref });
	}, []);

	useEffect(() => {
		const handleFocusOut = (event: FocusEvent): void => {
			window.previousActiveElement = event.target as Element;
		};

		document.addEventListener("focusout", handleFocusOut);

		return (): void => {
			document.removeEventListener("focusout", handleFocusOut);
		};
	}, []);

	return (
		<>
			<PortalContext.Provider value={{ portalPlaceholderRef: portalPlaceholder }}>
				{props.children}
			</PortalContext.Provider>
			<StyledPortalPlaceholder data-role={DataRoles.Portal.Placeholder} ref={handlePortalPlaceholderRef} />
		</>
	);
};

WidgetsRoot.displayName = "WidgetsRoot";
