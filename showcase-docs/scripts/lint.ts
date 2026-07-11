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

import { execFileSync } from "node:child_process";
import Fs from "node:fs/promises";
import Path from "node:path";

const ADOC_FILE_GLOB = "*.adoc";
const GENERATED_DIRECTORY_NAME = "generated";

const packageRoot = Path.resolve(import.meta.dirname, "..");
const licenseHeaderPath = Path.join(import.meta.dirname, "license-header.txt");

/**
 * Verify every committed `*.adoc` (excluding `generated/`) starts with the EUPL license header.
 * Throws if any file misses or diverges from `license-header.txt`.
 */
export async function lint(): Promise<void> {
	console.log("[lint] checking license headers in committed *.adoc...");
	const expectedHeader = await Fs.readFile(licenseHeaderPath, "utf8");
	const trackedAdocFiles = listTrackedAdocFiles();

	const filesMissingHeader: string[] = [];

	for (const relativePath of trackedAdocFiles) {
		const absolutePath = Path.join(packageRoot, relativePath);
		const fileContent = await Fs.readFile(absolutePath, "utf8");

		if (!fileContent.startsWith(expectedHeader)) {
			filesMissingHeader.push(relativePath);
		}
	}

	if (filesMissingHeader.length > 0) {
		const errorLines = [
			"Missing or invalid license header in:",
			...filesMissingHeader.map((file) => `  ${file}`),
			"",
			`Expected header from: ${Path.relative(packageRoot, licenseHeaderPath)}`
		];
		throw new Error(errorLines.join("\n"));
	}

	console.log(`[lint] OK — ${trackedAdocFiles.length} file(s) verified.`);
}

function listTrackedAdocFiles(): string[] {
	const gitOutput = execFileSync("git", ["ls-files", ADOC_FILE_GLOB], {
		cwd: packageRoot,
		encoding: "utf8"
	});

	return gitOutput.split("\n").filter((path) => path && !isInGeneratedDirectory(path));
}

function isInGeneratedDirectory(path: string): boolean {
	return path.split("/").includes(GENERATED_DIRECTORY_NAME);
}
