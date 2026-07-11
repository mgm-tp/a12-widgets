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

import JSZip from "jszip";

import { Config } from "./config.ts";
import { walk } from "./utils.ts";

/**
 * Bundle `lib/` into `dist/documentation.zip` for shipment to GetA12.
 * The zip contains fully resolved adoc (no asciidoc attribute placeholders).
 */
export async function dist(): Promise<void> {
	console.log(`[dist] zipping ${Path.relative(process.cwd(), Config.libDir)}/...`);
	const zip = new JSZip();

	let count = 0;

	for await (const absPath of walk(Config.libDir)) {
		const rel = Path.relative(Config.libDir, absPath).split(Path.sep).join("/");
		zip.file(rel, await Fs.readFile(absPath));
		count++;
	}

	const buffer = await zip.generateAsync({ type: "nodebuffer" });
	await Fs.mkdir(Config.outDir, { recursive: true });
	const zipPath = Path.join(Config.outDir, "documentation.zip");
	await Fs.writeFile(zipPath, buffer);

	console.log(`[dist] OK — ${count} file(s) packaged → ${Path.relative(process.cwd(), zipPath)}.`);
}
