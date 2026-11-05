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

import playgroundSourcesJson from "../generated/playground-sources.json?raw";

interface PlaygroundSourceManifest {
	files: Record<string, string>;
	sourcePathsByHash: Record<string, string>;
}

// This manifest is generated before the showcase starts. It contains the source files needed by
// playground examples and a hash-to-path index for matching displayed code to its original file.
const playgroundSourceManifest = JSON.parse(playgroundSourcesJson) as PlaygroundSourceManifest;
const sourceFileExtensionPattern = /\.(jsx?|tsx?)$/;

/** Finds the original source file for code opened from a showcase example. */
export function findPlaygroundSourcePathByHash(hash: string): string | undefined {
	return playgroundSourceManifest.sourcePathsByHash[hash];
}

/** Returns the compiled CommonJS code stored for a playground source file. */
export function getPlaygroundSourceCode(sourcePath: string): string | undefined {
	return playgroundSourceManifest.files[sourcePath];
}

function normalizeImportPath(specifier: string): string {
	return specifier.replace(/\?.*$/, "").replace(sourceFileExtensionPattern, "");
}

function resolveRelativePath(specifier: string, sourceName: string): string {
	// Example sourceName: "showcases/examples/sidebar-with-tab-panel/sidebar-with-tab-panel"
	// starts from its folder: "showcases/examples/sidebar-with-tab-panel".
	const parts = sourceName.split("/").slice(0, -1);

	// Example specifier: "../master-detail/master-detail.js" -> "../master-detail/master-detail".
	for (const part of normalizeImportPath(specifier).split("/")) {
		// "." means "stay in the same folder", like "./filter-selector"; empty parts do not change the path.
		if (part === "" || part === ".") {
			continue;
		}

		if (part === "..") {
			// ".." moves up one folder: "showcases/examples/sidebar-with-tab-panel" -> "showcases/examples".
			parts.pop();
		} else {
			// Normal segments are appended: "master-detail", then "master-detail".
			parts.push(part);
		}
	}

	// Final manifest path: "showcases/examples/master-detail/master-detail".
	return parts.join("/");
}

function findManifestSourcePath(sourcePath: string): string | undefined {
	// First try the exact path, for example "helpers/configuration-view".
	if (playgroundSourceManifest.files[sourcePath]) {
		return sourcePath;
	}

	// If the import points to a folder, try its index file, for example "helpers/foo/index".
	const indexPath = `${sourcePath}/index`;

	return playgroundSourceManifest.files[indexPath] ? indexPath : undefined;
}

/**
 * The sandbox cannot read source files from disk, so relative imports are resolved against this manifest instead.
 * Directory imports also try their index file.
 */
export function resolvePlaygroundSourcePath(specifier: string, sourceName?: string): string | undefined {
	if (!sourceName || !specifier.startsWith(".")) {
		return undefined;
	}

	return findManifestSourcePath(resolveRelativePath(specifier, sourceName));
}
