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
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

/* eslint-disable */
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Parse command line arguments
const args = process.argv.slice(2);
const useDoubleQuotes = args.includes("-d");
const inputPath = args.find((arg) => !arg.startsWith("-"));

if (!inputPath) {
	console.error("Error: Path argument is required\n");
	console.error("Usage: node extract-exports.js <file-or-folder-path> [-d]");
	console.error("  -d  Wrap each entity name in double quotes");
	console.error("Example: node extract-exports.js ./src/button");
	console.error("         node extract-exports.js ./src/button -d");
	process.exit(1);
}

const TARGET_PATH = path.resolve(process.cwd(), inputPath);
const OUTPUT_DIR = path.resolve(process.cwd(), "exports-output");

const EXCLUDE_PATTERNS = [/^__tests__$/, /\.test\.(ts|tsx)$/, /\.spec\.(ts|tsx)$/, /\.d\.ts$/, /^node_modules$/];

/**
 * Check if a path should be excluded
 */
function shouldExclude(name) {
	return EXCLUDE_PATTERNS.some((pattern) => pattern.test(name));
}

/**
 * Generate a hash from the input path for the output filename
 */
function generateHashedFilename(inputPath) {
	const hash = crypto.createHash("md5").update(inputPath).digest("hex").substring(0, 8);
	const baseName = path.basename(inputPath).replace(/\.[^/.]+$/, "");
	return `${baseName}-${hash}.txt`;
}

/**
 * Extract export entities from a TypeScript/TSX file
 * Only extracts top-level exports (not indented inside namespaces/blocks)
 */
function extractExportsFromFile(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf8");
		const lines = content.split("\n");
		const exports = [];
		const relativePath = path.relative(process.cwd(), filePath);

		/**
		 * Check if the lines before an export contain @internal in JSDoc
		 */
		function hasInternalJsDoc(lineIndex) {
			// Look backwards for JSDoc comment
			let i = lineIndex - 1;
			let inComment = false;

			while (i >= 0) {
				const prevLine = lines[i].trim();

				// End of JSDoc (we're going backwards, so */ is the start for us)
				if (prevLine.endsWith("*/")) {
					inComment = true;
				}

				// Check for @internal tag
				if (inComment && prevLine.includes("@internal")) {
					return true;
				}

				// Start of JSDoc (we're going backwards, so /** is the end for us)
				if (prevLine.startsWith("/**") || prevLine.startsWith("/*")) {
					break;
				}

				// If we hit a non-comment, non-empty line before finding /**, stop
				if (!inComment && prevLine !== "" && !prevLine.startsWith("*") && !prevLine.startsWith("//")) {
					break;
				}

				i--;
			}

			return false;
		}

		lines.forEach((line, lineIndex) => {
			// Only match exports at the start of a line (top-level, no indentation)
			if (!line.match(/^export\s/)) {
				return;
			}

			// Skip if the export has @internal in its JSDoc
			if (hasInternalJsDoc(lineIndex)) {
				return;
			}

			// Match named exports: export const/let/var/function/class/type/interface/enum/namespace
			const namedExportMatch = line.match(
				/^export\s+(const|let|var|function|class|type|interface|enum|namespace|abstract\s+class)\s+(\w+)/
			);
			if (namedExportMatch) {
				exports.push({
					type: namedExportMatch[1].replace("abstract ", "abstract "),
					name: namedExportMatch[2],
					file: relativePath,
					exportType: "named"
				});
				return;
			}

			// Match export default
			const defaultExportMatch = line.match(/^export\s+default\s+(?:(class|function)\s+)?(\w+)?/);
			if (defaultExportMatch) {
				const name = defaultExportMatch[2] || "default";
				exports.push({
					type: defaultExportMatch[1] || "default",
					name: name,
					file: relativePath,
					exportType: "default"
				});
				return;
			}

			// Match export { ... } without "from" (local re-exports that are still top-level)
			const exportBracesMatch = line.match(/^export\s*\{([^}]+)\}\s*(?:;|$)/);
			if (exportBracesMatch) {
				const exportList = exportBracesMatch[1];
				const individualExports = exportList
					.split(",")
					.map((e) => e.trim())
					.filter(Boolean);
				individualExports.forEach((exp) => {
					const asMatch = exp.match(/(\w+)\s+as\s+(\w+)/);
					if (asMatch) {
						exports.push({
							type: "re-export",
							name: asMatch[2],
							originalName: asMatch[1],
							file: relativePath,
							exportType: "named"
						});
					} else if (exp !== "type" && /^\w+$/.test(exp)) {
						exports.push({
							type: "re-export",
							name: exp,
							file: relativePath,
							exportType: "named"
						});
					}
				});
			}
		});

		return exports;
	} catch (error) {
		console.error(`Error reading file ${filePath}:`, error.message);
		return [];
	}
}

/**
 * Recursively collect all TypeScript/TSX files from a directory
 */
function collectFiles(dirPath, files = []) {
	try {
		const items = fs.readdirSync(dirPath);

		items.forEach((item) => {
			if (shouldExclude(item)) {
				return;
			}

			const fullPath = path.join(dirPath, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				collectFiles(fullPath, files);
			} else if (stat.isFile() && /\.(ts|tsx)$/.test(item)) {
				files.push(fullPath);
			}
		});
	} catch (error) {
		console.error(`Error reading directory ${dirPath}:`, error.message);
	}

	return files;
}

/**
 * Check if an export name is internal (should be excluded)
 * Internal entities: names starting with _, containing "Internal", or containing "internal"
 */
function isInternalExport(name) {
	return name.startsWith("_") || /[Ii]nternal/.test(name);
}

/**
 * Format exports for output - just entity names, one per line, ending with comma
 * Only includes top-level exports (not re-exports), excludes internal entities
 */
function formatExports(allExports, useQuotes) {
	// Filter to only top-level exports (named and default, not re-exports)
	const topLevelExports = allExports.filter((exp) => exp.exportType === "named" || exp.exportType === "default");

	// Get unique export names, filter out internal ones, and sort them
	const uniqueNames = [...new Set(topLevelExports.map((exp) => exp.name))]
		.filter((name) => !isInternalExport(name))
		.sort();

	return uniqueNames
		.map((name) => {
			if (useQuotes) {
				return `"${name}",`;
			}
			return `${name},`;
		})
		.join("\n");
}

/**
 * Main execution
 */
function main() {
	if (!fs.existsSync(TARGET_PATH)) {
		console.error(`Error: Path not found: ${TARGET_PATH}`);
		process.exit(1);
	}

	const stat = fs.statSync(TARGET_PATH);
	let files = [];

	if (stat.isDirectory()) {
		files = collectFiles(TARGET_PATH);
	} else if (stat.isFile()) {
		if (!/\.(ts|tsx)$/.test(TARGET_PATH)) {
			console.error("Error: File must be a TypeScript (.ts) or TSX (.tsx) file");
			process.exit(1);
		}
		files = [TARGET_PATH];
	} else {
		console.error("Error: Path is neither a file nor a directory");
		process.exit(1);
	}

	// Extract exports from all files
	const allExports = [];
	files.forEach((file) => {
		const exports = extractExportsFromFile(file);
		allExports.push(...exports);
	});

	// Ensure output directory exists
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	// Generate output file
	const outputFilename = generateHashedFilename(TARGET_PATH);
	const outputPath = path.join(OUTPUT_DIR, outputFilename);
	const content = formatExports(allExports, useDoubleQuotes);

	fs.writeFileSync(outputPath, content, "utf8");

	console.log(`file://${outputPath}`);
}

// Run the script
main();
