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

import type { ReactElement } from "react";
import { memo, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

import type { SandboxReadyMessage } from "./playground-utils.js";
import { SANDBOX_PATH, SANDBOX_REPLY_SOURCE, SANDBOX_REQUEST_SOURCE } from "./playground-utils.js";

const StyledSandboxFrame = styled.iframe`
	border: 0;
	display: block;
	height: 100%;
	width: 100%;
`;

interface SandboxPreviewProps {
	code: string;

	/** Name of the theme the preview should render with (see PLAYGROUND_THEME_OPTIONS). */
	themeName: string;

	/** Full registry path of the source showcase file (e.g. "showcases/drag-and-drop/basic") for accurate relative import resolution. */
	sourceName?: string;

	/** When true, the preview uses a dark background (#dbdfe8) - mirrors the showcase's `useDarkBackground` section config. */
	darkBackground?: boolean;
	className?: string;
}

/**
 * Renders the playground preview inside an opaque-origin sandbox iframe and feeds it the current code
 * and theme via postMessage. The evaluated, possibly untrusted code therefore never runs in the
 * showcase origin.
 */
export const SandboxPreview = memo(
	({ code, themeName, sourceName, darkBackground, className }: SandboxPreviewProps): ReactElement => {
		const iframeRef = useRef<HTMLIFrameElement>(null);
		const [isReady, setIsReady] = useState(false);

		useEffect(() => {
			function handleMessage(event: MessageEvent): void {
				// Only trust messages coming from our own iframe document.
				if (event.source !== iframeRef.current?.contentWindow) {
					return;
				}

				const data = event.data as SandboxReadyMessage | undefined;

				if (data && data.source === SANDBOX_REPLY_SOURCE && data.type === "ready") {
					setIsReady(true);
				}
			}

			window.addEventListener("message", handleMessage);

			return () => window.removeEventListener("message", handleMessage);
		}, []);

		useEffect(() => {
			if (!isReady) {
				return;
			}

			// targetOrigin "*" is required because the sandbox runs in an opaque origin; only code + theme are sent.
			iframeRef.current?.contentWindow?.postMessage(
				{ source: SANDBOX_REQUEST_SOURCE, type: "run", code, themeName, sourceName, darkBackground },
				"*"
			);
		}, [isReady, code, themeName, sourceName, darkBackground]);

		return (
			<StyledSandboxFrame
				ref={iframeRef}
				className={className}
				src={SANDBOX_PATH}
				sandbox="allow-scripts"
				title="Playground preview"
			/>
		);
	}
);
