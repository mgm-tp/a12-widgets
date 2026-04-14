/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (C) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is available to you under a choice of two different
 * license agreements:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, which permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

/* eslint-disable */
import fs from "fs";
import path from "path";

// Get source directory from command line argument (required)
const srcArg = process.argv[2];

if (!srcArg) {
	console.error("Error: Source directory argument is required\n");
	console.error("Usage: node generate-index-files.js <src-directory>");
	console.error("Example: node generate-index-files.js ./src");
	console.error("         node generate-index-files.js /absolute/path/to/src");
	process.exit(1);
}

const SRC_DIR = path.resolve(process.cwd(), srcArg);

const EXCLUDE_PATTERNS = [
	/^__tests__$/,
	/\.test\.(ts|tsx)$/,
	/\.spec\.(ts|tsx)$/,
	/\.internal(\..*)?\.(ts|tsx)$/,
	/\.d\.ts$/,
	// Index files will be exported via directories
	/^index\.ts$/,
	/^index\.tsx$/
];

/**
 * Check if a path should be excluded from exports
 */
function shouldExclude(name) {
	return EXCLUDE_PATTERNS.some((pattern) => pattern.test(name));
}

/**
 * Get all TypeScript/TSX files and subdirectories in a directory
 */
function getExportableItems(dirPath) {
	try {
		const items = fs.readdirSync(dirPath);
		const files = [];
		const directories = [];

		items.forEach((item) => {
			const fullPath = path.join(dirPath, item);
			const stat = fs.statSync(fullPath);

			if (shouldExclude(item, fullPath)) {
				console.log(`Exclude ${fullPath}`);
				return;
			}

			if (
				stat.isDirectory() &&
				item !== "test" &&
				(fs.existsSync(path.join(fullPath, "index.ts")) || fs.existsSync(path.join(fullPath, "index.tsx")))
			) {
				// Only include directories that have an index.ts or index.tsx
				directories.push(item);
			} else if (stat.isFile() && /\.(ts|tsx)$/.test(item)) {
				// Remove extension for cleaner exports
				files.push(item.replace(/\.(ts|tsx)$/, ""));
			}
		});

		return { files, directories };
	} catch (error) {
		console.error(`Error reading directory ${dirPath}:`, error.message);

		return { files: [], directories: [] };
	}
}

/**
 * Generate index.ts content for a directory
 */
function generateIndexContent(dirPath) {
	const { files, directories } = getExportableItems(dirPath);

	return [
		...files.map((file) => `export * from './${file}.js';`),
		...directories.map((dir) => `export * from './${dir}/index.js';`)
	].join("\n");
}

/**
 * Recursively process directory and create index.ts files
 * Returns true if the directory has exportable content
 */
function processDirectory(dirPath) {
	const { files, directories } = getExportableItems(dirPath);

	// First, recursively process subdirectories
	const validSubDirs = directories.filter((dir) => processDirectory(path.join(dirPath, dir)));

	// Check if this directory has any exportable content
	const hasContent = files.length > 0 || validSubDirs.length > 0;

	if (!hasContent) {
		return false;
	}

	// Check if index.tsx exists, if so use that, otherwise use index.ts
	const indexTsxPath = path.join(dirPath, "index.tsx");
	const indexTsPath = path.join(dirPath, "index.ts");
	const indexPath = fs.existsSync(indexTsxPath) ? indexTsxPath : indexTsPath;

	const content = generateIndexContent(dirPath);

	if (content.trim().length > 0) {
		fs.writeFileSync(indexPath, content, "utf8");
		const relativePath = path.relative(SRC_DIR, indexPath);
		console.log(`✓ Generated: ${relativePath}`);
	}

	return true;
}

/**
 * Main execution
 */
function main() {
	console.log(`Generating index.ts files in: ${SRC_DIR}\n`);

	if (!fs.existsSync(SRC_DIR)) {
		console.error(`Error: Source directory not found: ${SRC_DIR}`);
		process.exit(1);
	}

	const stat = fs.statSync(SRC_DIR);

	if (!stat.isDirectory()) {
		console.error(`Error: Path is not a directory: ${SRC_DIR}`);
		process.exit(1);
	}

	// Process the entire src directory tree
	processDirectory(SRC_DIR);

	console.log("\n✨ Done! All index.ts files have been generated.");
}

// Run the script
main();
