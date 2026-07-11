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

import asciidoctorModule, { type Asciidoctor } from "asciidoctor";
// @ts-expect-error - asciidoctor-highlight.js ships no type declarations.
import highlightJsExt from "asciidoctor-highlight.js";

import { Config } from "./config.ts";

// `asciidoctor` is a CommonJS package whose `module.exports` IS the factory function. Under
// NodeNext + verbatimModuleSyntax the default import resolves to the module namespace, so cast it
// back to the actual factory shape that the runtime exposes.
const asciidoctorFactory = asciidoctorModule as unknown as () => Asciidoctor;
const asciidoctor = asciidoctorFactory();

const registry = asciidoctor.Extensions.create();
highlightJsExt.register(registry);

/**
 * Compile `lib/index.adoc` into a standalone HTML file at `dist/index.html` via Asciidoctor.
 * Surfaces asciidoctor diagnostics through the shared logger.
 */
export async function build(): Promise<void> {
	console.log(
		`[build] building ${Path.relative(process.cwd(), Config.libDir)}/index.adoc → ${Path.relative(process.cwd(), Config.outDir)}/index.html...`
	);
	asciidoctor.convertFile(Path.resolve(Config.libDir, "index.adoc"), {
		to_dir: Config.outDir,
		mkdirs: true,
		safe: 0,
		extension_registry: registry,
		attributes: {
			icons: "font",
			["source-highlighter"]: "highlightjs-ext",
			toclevels: 3,
			["toc-title"]: "Table of Contents",
			toc: "left",
			doctype: "article",
			["source-linenums-option"]: true,
			tabsize: 2,
			sectnums: true,
			sectanchors: true,
			sectlinks: true,
			experimental: true,
			sectids: true,
			encoding: "utf-8",
			lang: "en",
			fragment: true,
			xrefstyle: "short",
			standalone: true,
			revnumber: Config.version,
			author: "Widgets Product Team"
		}
	});

	try {
		await Fs.access(Config.srcHighlightStyleFile);
		await Fs.mkdir(Path.dirname(Config.outHighlightStyleFile), { recursive: true });
		await Fs.copyFile(Config.srcHighlightStyleFile, Config.outHighlightStyleFile);
	} catch {
		// Highlight stylesheet missing in environments where the dependency was not installed; ignore.
	}

	console.log("[build] OK.");
}
