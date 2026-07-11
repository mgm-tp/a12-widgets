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

/* eslint-disable no-console */

import fs from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

/**
 * Script to update the MATERIAL_ICONS list from the material-symbols npm package.
 *
 * Usage:
 *   node icon-list-transform_script_example.js
 *
 * This script:
 * 1. Downloads the latest material-symbols npm package
 * 2. Extracts icon names from the index.d.ts type definitions
 * 3. Updates core/src/icon/main/material-icons-data.ts
 */

main().catch((error) => {
	console.error(error);
	process.exit(1);
});

async function main() {
	const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "material-symbols-"));

	try {
		console.log("Downloading material-symbols package...");
		execSync("npm pack material-symbols@latest", { cwd: tmpDir, stdio: "pipe" });

		const tgzFile = fs.readdirSync(tmpDir).find((f) => f.endsWith(".tgz"));

		if (!tgzFile) {
			throw new Error("Failed to download material-symbols package");
		}

		execSync(`tar xzf ${tgzFile}`, { cwd: tmpDir, stdio: "pipe" });

		const dtsPath = path.join(tmpDir, "package", "index.d.ts");
		const content = fs.readFileSync(dtsPath, "utf-8");

		const names = [];

		for (const line of content.split("\n")) {
			const match = line.match(/^\s+"([^"]+)"/);

			if (match) {
				names.push(match[1]);
			}
		}

		names.sort();

		console.log(`Found ${names.length} icons`);

		const dataFile = path.resolve(import.meta.dirname, "../src/icon/main/material-icons-data.ts");
		const currentContent = fs.readFileSync(dataFile, "utf-8");
		const headerEnd = currentContent.indexOf("export const");
		const header = currentContent.substring(0, headerEnd);

		const output =
			header + "export const MATERIAL_ICONS: string[] = [\n" + names.map((n) => `\t"${n}"`).join(",\n") + "\n];\n";

		fs.writeFileSync(dataFile, output);
		console.log(`Updated ${dataFile} with ${names.length} icons`);
	} finally {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	}
}
