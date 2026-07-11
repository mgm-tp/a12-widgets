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

import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "@rsbuild/core";
import { ProvidePlugin } from "@rspack/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginStyledComponents } from "@rsbuild/plugin-styled-components";

import packageJson from "./package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: ReturnType<typeof defineConfig> = defineConfig(({ env }) => {
	const version = packageJson.version;

	return {
		server: {
			port: 5555,
			publicDir: [{ name: "public" }]
		},
		source: {
			entry: {
				index: ["./src/index.tsx"]
			},
			tsconfigPath: "./tsconfig.json",
			define: {
				__A12_VERSION__: JSON.stringify(version),
				SC_DISABLE_SPEEDY: false
			}
		},
		html: {
			template: "public/index.html"
		},
		plugins: [pluginReact(), pluginStyledComponents({ fileName: false })],
		resolve: {
			dedupe: [
				"immer",
				"react",
				"react-dnd",
				"react-dom",
				"styled-components",
				"lexical",
				"@lexical/react",
				"@lexical/link",
				"@lexical/list",
				"@lexical/utils"
			],
			alias: {
				public: path.resolve(__dirname, "public")
			}
		},
		tools: {
			rspack: {
				module: {
					rules: [
						{
							test: /\.tsx?$/,
							exclude: [/node_modules/],
							resourceQuery: { not: [/raw/] },
							use: ["builtin:swc-loader"]
						},
						{ test: /\.js$/, loader: "source-map-loader" },
						{
							resourceQuery: /raw$/,
							type: "asset/source"
						}
					]
				},
				ignoreWarnings: [/Failed to parse source map/],
				plugins: [
					new ProvidePlugin({
						React: "react"
					})
				]
			}
		},
		output: {
			sourceMap: env === "development",
			distPath: { root: "./public-showcase" },
			assetPrefix: "./",
			injectStyles: true
		}
	};
});

export default config;
