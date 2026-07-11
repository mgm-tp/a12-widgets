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
import { walk } from "./utils.ts";

/** AsciiDoc attribute placeholder rewritten to the resolved showcase URL. */
const SHOWCASE_BASE_URL_PLACEHOLDER = "{showcase-base-url}";

/** Token in `Config.showcaseBaseUrl` substituted with the package version. */
const SHOWCASE_VERSION_TOKEN = "{{showcase-version}}";
const ADOC_FILE_EXTENSION = ".adoc";

const resolvedShowcaseBaseUrl = Config.showcaseBaseUrl.replaceAll(SHOWCASE_VERSION_TOKEN, Config.version);

function resolvePlaceholders(content: string): string {
	return content.replaceAll(SHOWCASE_BASE_URL_PLACEHOLDER, resolvedShowcaseBaseUrl);
}

/**
 * Mirror `src/` → `lib/`, resolving `{showcase-base-url}` to the literal URL
 * (with package version baked in). Non-adoc files are copied verbatim.
 * Output is the shippable adoc tree consumed by downstream zip + asciidoctor steps.
 */
export async function compile(): Promise<void> {
	console.log(`[compile] resolving placeholders into ${Path.relative(process.cwd(), Config.libDir)}/...`);
	await Fs.rm(Config.libDir, { recursive: true, force: true });
	await Fs.mkdir(Config.libDir, { recursive: true });

	let emittedFileCount = 0;

	for await (const absoluteSourcePath of walk(Config.srcDir)) {
		const relativePath = Path.relative(Config.srcDir, absoluteSourcePath);
		const targetPath = Path.join(Config.libDir, relativePath);
		await Fs.mkdir(Path.dirname(targetPath), { recursive: true });

		if (absoluteSourcePath.endsWith(ADOC_FILE_EXTENSION)) {
			const sourceContent = await Fs.readFile(absoluteSourcePath, "utf8");
			await Fs.writeFile(targetPath, resolvePlaceholders(sourceContent), "utf8");
		} else {
			await Fs.copyFile(absoluteSourcePath, targetPath);
		}

		emittedFileCount++;
	}

	console.log(`[compile] OK — ${emittedFileCount} file(s) emitted.`);
}
