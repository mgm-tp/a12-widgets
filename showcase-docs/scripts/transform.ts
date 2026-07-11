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

import Fs from "node:fs/promises";
import Path from "node:path";

import { Config } from "./config.ts";
import type { AdocEntry } from "./config.ts";
import { mdToAdoc } from "./md-to-adoc.ts";
import type { LinkRewriter } from "./md-to-adoc.ts";

const ASCIIDOCTOR_ANCHOR_PREFIX = "_";
const ADOC_HEADING_PATTERN = /^=+ /;
const SHOWCASE_ROUTE_PREFIX = "#/";
const SHOWCASE_BASE_URL_ATTRIBUTE = "{showcase-base-url}";

/**
 * Mirror Asciidoctor's `idprefix=_` + `idseparator=_` section-id algorithm: lowercase the title,
 * replace runs of non-alphanumeric characters with `_`, trim surrounding underscores, prepend `_`.
 * Used to produce in-doc anchor ids that line up with the ids Asciidoctor generates from headings.
 */
function asciidoctorSectionAnchor(title: string): string {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");

	return ASCIIDOCTOR_ANCHOR_PREFIX + slug;
}

/**
 * Build the lookup table consumed by `md-to-adoc.ts` to rewrite cross-references.
 * `showcaseRoute` (without leading `#`) → anchor id derived from `title`.
 */
function buildRouteToAnchorMap(entries: readonly AdocEntry[]): Map<string, string> {
	const routeToAnchor = new Map<string, string>();

	for (const entry of entries) {
		if (!entry.showcaseRoute) {
			continue;
		}

		routeToAnchor.set(entry.showcaseRoute, asciidoctorSectionAnchor(entry.title));
	}

	return routeToAnchor;
}

/**
 * Demote every AsciiDoc heading by one level so the injected `= title` becomes the file's H1.
 */
function demoteHeadings(body: string): string {
	return body
		.split("\n")
		.map((line) => (ADOC_HEADING_PATTERN.test(line) ? "=" + line : line))
		.join("\n");
}

/**
 * Build a {@link LinkRewriter} that maps showcase SPA routes (`#/some/route`) to AsciiDoc:
 *
 * 1. Registered route → in-doc cross-reference `<<anchor,label>>`.
 * 2. Unregistered route + non-empty base URL → `link:{showcase-base-url}#/route[label]`.
 * 3. Unregistered route + empty base URL → warning, falls back to default rendering.
 * 4. Anything else (absolute URL, mailto, ...) → falls back to default rendering.
 */
function createShowcaseLinkRewriter(routeToAnchor: Map<string, string>, showcaseBaseUrl: string): LinkRewriter {
	return (url, label, api) => {
		if (!url.startsWith(SHOWCASE_ROUTE_PREFIX)) {
			return undefined;
		}

		const routeWithFragment = url.slice(1); // strip leading `#`, keep leading `/`
		const [routePath, fragment] = routeWithFragment.split("#"); // split off any heading fragment
		const anchor = routeToAnchor.get(routePath);

		if (anchor) {
			// A fragment targets a specific heading within the page. Convert it to the same
			// Asciidoctor section id that heading receives so the cross-reference resolves to it
			// rather than to the page top.
			if (fragment) {
				return `<<${asciidoctorSectionAnchor(fragment)},${label}>>`;
			}

			return `<<${anchor},${label}>>`;
		}

		if (showcaseBaseUrl) {
			return `link:${SHOWCASE_BASE_URL_ATTRIBUTE}#${routeWithFragment}[${label}]`;
		}

		api.warn(`Broken showcase link: ${url} (no anchor, no showcaseBaseUrl)`);

		return undefined;
	};
}

/**
 * Convert each registered Markdown source into AsciiDoc under `src/generated/`.
 * Demotes headings by one level, prepends `= title`, and rewrites showcase routes
 * to either in-doc anchors or `{showcase-base-url}` links. Reports broken-link warnings.
 */
export async function transform(): Promise<void> {
	console.log(`[transform] generating ${Config.adocEntries.length} adoc file(s) from markdown...`);
	await Fs.rm(Config.generatedDir, { recursive: true, force: true });
	await Fs.mkdir(Config.generatedDir, { recursive: true });

	const routeToAnchor = buildRouteToAnchorMap(Config.adocEntries);
	const linkRewriter = createShowcaseLinkRewriter(routeToAnchor, Config.showcaseBaseUrl);
	const allWarnings: string[] = [];

	for (const entry of Config.adocEntries) {
		const sourcePath = Path.join(Config.showcaseDocsRoot, entry.mdPath);
		const targetPath = Path.join(Config.generatedDir, entry.adocPath);

		await Fs.mkdir(Path.dirname(targetPath), { recursive: true });

		const markdownSource = await Fs.readFile(sourcePath, "utf8");
		const { adoc: body, warnings } = mdToAdoc(markdownSource, { linkRewriter });

		for (const warning of warnings) {
			allWarnings.push(`${entry.mdPath}: ${warning}`);
		}

		const demotedBody = demoteHeadings(body);
		const generatedAdoc = `= ${entry.title}\n\n${demotedBody}`;

		await Fs.writeFile(targetPath, generatedAdoc, "utf8");
	}

	if (allWarnings.length > 0) {
		console.warn(`[transform] ${allWarnings.length} link warning(s):`);

		for (const warning of allWarnings) {
			console.warn(`  ${warning}`);
		}
	}

	console.log(
		`[transform] OK — ${Config.adocEntries.length} file(s) written to ${Path.relative(process.cwd(), Config.generatedDir)}/.`
	);
}
