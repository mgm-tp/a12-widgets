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

import Path from "node:path";

import PackageJson from "../package.json" with { type: "json" };

/**
 * Declarative entry mapping a Markdown source under `new-showcase/src/docs/` to a generated
 * AsciiDoc file under `src/generated/`. Drives the transform step.
 */
export interface AdocEntry {
	/** Path of the Markdown source, relative to `new-showcase/src/docs/`. */
	mdPath: string;

	/** Path of the AsciiDoc output, relative to `src/generated/`. Directories are created on demand. */
	adocPath: string;

	/** Top-level `=` heading injected as the first line of the generated file. Source headings are demoted by one level so this title becomes H1. */
	title: string;

	/**
	 * Original showcase-app route (e.g. `/get-started/migration-instructions/...`). When set, the
	 * link rewriter maps `#/<route>` Markdown links to in-doc AsciiDoc cross-references.
	 */
	showcaseRoute?: string;
}

/**
 * Top-level static configuration consumed by every pipeline stage (lint, transform, compile,
 * build, dist). All paths are absolute.
 */
export interface AppConfig {
	/** Package version from `package.json`; baked into the rendered showcase base URL. */
	version: string;

	/** Hand-written AsciiDoc source root (`showcase-docs/src/`). */
	srcDir: string;

	/** Compiled AsciiDoc output root (`showcase-docs/lib/`); placeholders are resolved into this tree. */
	libDir: string;

	/** Final distributable output root (`showcase-docs/dist/`); contains the standalone HTML and zip. */
	outDir: string;

	/** AsciiDoc tree generated from Markdown sources, nested inside `srcDir`. */
	generatedDir: string;

	/** Root of the showcase Markdown sources (`new-showcase/src/docs/`). */
	showcaseDocsRoot: string;

	/** Markdown-to-AsciiDoc pipeline entries; see {@link AdocEntry}. */
	adocEntries: readonly AdocEntry[];

	/** Hosted showcase base URL with `{{showcase-version}}` placeholder; resolved at compile time. */
	showcaseBaseUrl: string;

	/** Highlight.js stylesheet shipped by the dependency, copied verbatim into the dist. */
	srcHighlightStyleFile: string;

	/** Destination path for the highlight stylesheet inside `outDir`. */
	outHighlightStyleFile: string;
}

const rootProjectDir = Path.join(import.meta.dirname, "..", "..");
const docDir = Path.join(rootProjectDir, "showcase-docs");
const srcDir = Path.join(docDir, "src");
const libDir = Path.join(docDir, "lib");
const outDir = Path.join(docDir, "dist");
const generatedDir = Path.join(srcDir, "generated");
const showcaseDocsRoot = Path.join(rootProjectDir, "new-showcase", "src", "docs");

/**
 * Declarative map: for every Markdown source, which AsciiDoc file to emit and what title to use.
 *
 * - `mdPath`: path under `new-showcase/src/docs/`.
 * - `adocPath`: path under `src/generated/` (will be created on demand).
 * - `title`: top-level `=` heading injected as the first line of the generated file. All headings
 *   from the source are demoted by one level so `title` becomes the file's H1.
 * - `showcaseRoute`: optional original showcase-app route. Used by the link rewriter to map
 *   in-source `#/get-started/...` Markdown links to in-doc AsciiDoc cross-references.
 *
 * To add another Markdown file, add an entry here, then `include::generated/<adocPath>[]` from a
 * hand-written section file under `src/`.
 */
export const ADOC_ENTRIES: readonly AdocEntry[] = [
	{
		mdPath: "migration/migration-notes.md",
		adocPath: "migration/migration-notes.adoc",
		title: "Migration Notes",
		showcaseRoute: "/get-started/migration-instructions/migration-notes"
	},
	{
		mdPath: "migration/codemod-instruction.md",
		adocPath: "migration/codemod-instruction.adoc",
		title: "Codemod Instructions",
		showcaseRoute: "/get-started/migration-instructions/codemod-instruction"
	},
	{
		mdPath: "migration/patch-instruction.md",
		adocPath: "migration/patch-instruction.adoc",
		title: "Patch Instructions",
		showcaseRoute: "/get-started/migration-instructions/patch-instruction"
	},
	{
		mdPath: "migration/rich-text-editor-migration-notes.md",
		adocPath: "migration/rich-text-editor-migration-notes.adoc",
		title: "Rich Text Editor Migration Notes",
		showcaseRoute: "/get-started/migration-instructions/draft-js-to-lexical-editor"
	},
	{
		mdPath: "migration/chart-widget-to-recharts/migration-overview.md",
		adocPath: "migration/chart-widget-to-recharts/migration-overview.adoc",
		title: "Chart Widget to Recharts: Overview",
		showcaseRoute: "/get-started/migration-instructions/chart-widgets-to-recharts"
	},
	{
		mdPath: "migration/chart-widget-to-recharts/bar-chart-migration.md",
		adocPath: "migration/chart-widget-to-recharts/bar-chart-migration.adoc",
		title: "Bar Chart Migration",
		showcaseRoute: "/get-started/migration-instructions/chart-widgets-to-recharts/bar-chart-migration"
	},
	{
		mdPath: "migration/chart-widget-to-recharts/line-chart-migration.md",
		adocPath: "migration/chart-widget-to-recharts/line-chart-migration.adoc",
		title: "Line Chart Migration",
		showcaseRoute: "/get-started/migration-instructions/chart-widgets-to-recharts/line-chart-migration"
	},
	{
		mdPath: "migration/chart-widget-to-recharts/pie-chart-migration.md",
		adocPath: "migration/chart-widget-to-recharts/pie-chart-migration.adoc",
		title: "Pie Chart Migration",
		showcaseRoute: "/get-started/migration-instructions/chart-widgets-to-recharts/pie-chart-migration"
	}
];

export const Config: AppConfig = {
	version: PackageJson.version,
	srcDir,
	libDir,
	outDir,
	generatedDir,
	showcaseDocsRoot,
	adocEntries: ADOC_ENTRIES,
	showcaseBaseUrl: "https://www.mgm-tp.com/a12.htmlshowcase/{{showcase-version}}/",

	srcHighlightStyleFile: Path.join(
		import.meta.dirname,
		"..",
		"node_modules",
		"highlight.js",
		"styles",
		"atom-one-light.css"
	),
	outHighlightStyleFile: Path.join(outDir, "styles", "highlightjs-theme.css")
};
