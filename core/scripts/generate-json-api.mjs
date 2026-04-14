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

import Path from "node:path";
import Fs from "node:fs/promises";

import { minimatch } from "minimatch";
import { ReflectionKind } from "typedoc";

const projectDir = Path.join(import.meta.dirname, "..", "..");

const generateTypedocPath = Path.join(projectDir, "core", "target", "typedoc.json");
const outDir = Path.join(projectDir, "json-api/core/src");

async function generateJsonApi() {
	const generatedTypedocFile = await Fs.readFile(generateTypedocPath, { encoding: "utf8" });

	for (const module of JSON.parse(generatedTypedocFile).children ?? []) {
		if (module.kind !== ReflectionKind.Module || !module.children?.length) {
			continue;
		}

		const sourceFileName = module.children[0].sources[0].fileName;

		if (minimatch(sourceFileName, "**/*.api.ts")) {
			const outFile = Path.join(outDir, sourceFileName.replace(/\.ts$/, ".json"));

			await Fs.mkdir(Path.dirname(outFile), { recursive: true });
			await Fs.writeFile(outFile, JSON.stringify(module, null, 2));
		}
	}
}

generateJsonApi()
	.then(() => {
		console.log("Generated JSON API successfully!");
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
