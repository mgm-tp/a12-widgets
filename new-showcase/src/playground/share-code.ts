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

import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";

/**
 * Client-side sharing for the playground: playground source is compressed
 * (DEFLATE level 9 → base64url) and carried in the URL so a link fully
 * reconstructs the editor state — no backend, gist, or paste service.
 *
 * The showcase uses a hash router, so the app route already lives in
 * `window.location.hash` (e.g. `#/playground/playground`). The shared code
 * therefore rides as a *search param of the hash route*
 * (`#/playground/playground?code=…`), read/written via react-router's
 * `useSearchParams` — NOT as its own top-level fragment.
 *
 * Security: the code stays in the host page's URL and is fed to the opaque-origin
 * sandbox iframe over postMessage (see `sandbox-preview.tsx`). It must never be
 * placed in the iframe's `src` — that would defeat the sandbox isolation.
 */

/**
 * react-router path of the standalone playground. It renders on the shell-less `/fullscreen` route
 * (no header/sidebar); the in-app `/playground/playground` route redirects here (see root.tsx).
 * Shared links and "Open in playground" target this path directly to skip the redirect hop.
 */
export const PLAYGROUND_ROUTE = "/fullscreen/playground";

/** Search-param keys used in shared playground URLs. */
export const PLAYGROUND_QUERY_PARAMS = {
	/** Compressed (DEFLATE + base64url) source code. */
	code: "code",

	/** Theme name (e.g. "default", "compact"). */
	theme: "theme",

	/** Full registry path of the source showcase file (e.g. "showcases/drag-and-drop/basic"); used for accurate relative import resolution in the sandbox. */
	source: "source",

	/** When true, the preview uses a dark background (#dbdfe8) - mirrors the showcase's `useDarkBackground` section config. */
	darkBackground: "dark"
} as const;

/** Compress playground source to a URL-safe string (base64url-encoded DEFLATE). */
export function compressCode(code: string): string {
	const deflated = deflateSync(strToU8(code), { level: 9 });

	return bytesToBase64Url(deflated);
}

/**
 * Decompress a shared param back to source. Returns `null` when the input is
 * missing or corrupt, so callers can fall back to their default code.
 */
export function decompressCode(compressed: string | null | undefined): string | null {
	if (!compressed) {
		return null;
	}

	try {
		return strFromU8(inflateSync(base64UrlToBytes(compressed)));
	} catch {
		return null;
	}
}

/**
 * Builds a hash-router href that opens the playground pre-seeded with `code`, e.g.
 * `#/fullscreen/playground?code=…&theme=…&source=…`. Suitable for an anchor `href` or
 * `window.location.hash`. For programmatic navigation via react-router's `useNavigate`,
 * use {@link buildPlaygroundTo} instead.
 */
export function buildPlaygroundHref(
	code: string,
	themeName?: string,
	sourceName?: string,
	darkBackground?: boolean
): string {
	return `#${buildPlaygroundTo(code, themeName, sourceName, darkBackground)}`;
}

/** Builds the react-router "to" target (path + search) that seeds the playground with `code`, `themeName`, `sourceName` and `darkBackground`. */
export function buildPlaygroundTo(
	code: string,
	themeName?: string,
	sourceName?: string,
	darkBackground?: boolean
): string {
	const params = new URLSearchParams({ [PLAYGROUND_QUERY_PARAMS.code]: compressCode(code) });

	if (themeName) {
		params.set(PLAYGROUND_QUERY_PARAMS.theme, themeName);
	}

	if (sourceName) {
		params.set(PLAYGROUND_QUERY_PARAMS.source, sourceName);
	}

	if (darkBackground) {
		params.set(PLAYGROUND_QUERY_PARAMS.darkBackground, "true");
	}

	return `${PLAYGROUND_ROUTE}?${params.toString()}`;
}

function bytesToBase64Url(bytes: Uint8Array): string {
	let binary = "";

	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}

	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
	const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
	const bytes = new Uint8Array(binary.length);

	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	return bytes;
}
