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
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginStyledComponents } from "@rsbuild/plugin-styled-components";
import { ProvidePlugin } from "@rspack/core";

import packageJson from "./package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: ReturnType<typeof defineConfig> = defineConfig(({ env }) => {
	const version = packageJson.version;

	return {
		server: {
			port: 5555,
			publicDir: [{ name: "public" }],
			// The playground preview runs in an opaque-origin sandbox iframe, so its requests for bundled
			// assets (fonts in particular — @font-face fetches require CORS) are cross-origin. Allow them.
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		},
		source: {
			entry: {
				index: ["./src/index.tsx"],
				// Isolated, opaque-origin bundle for the playground preview iframe (untrusted ?code= runs here).
				sandbox: ["./src/playground/sandbox-entry.tsx"]
			},
			tsconfigPath: "./tsconfig.json",
			define: {
				__A12_VERSION__: JSON.stringify(version),
				SC_DISABLE_SPEEDY: false
			}
		},
		html: {
			template: ({ entryName }) => (entryName === "sandbox" ? "public/sandbox.html" : "public/index.html")
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
				"@lexical/mdast",
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
				ignoreWarnings: [
					/Failed to parse source map/,
					// Benign monaco-editor bundling noise: its ESM build carries an AMD `require([...])`
					// fallback (dead in ESM) that can't be statically analyzed, and its TS worker references
					// Node's __filename/__dirname (auto-mocked for the browser). Scoped to monaco so unrelated
					// critical-dependency warnings still surface.
					(warning) =>
						/monaco-editor/.test(warning.module?.resource ?? "") &&
						/Critical dependency|has been mocked/.test(warning.message)
				],
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
			// "auto" makes rspack resolve the public path at runtime from each script's own location,
			// rather than the relative "./" — which Monaco's bundled workers cannot resolve (their
			// `importScripts` ignores document.baseURI, so "./" double-nests the chunk path and 404s).
			// "auto" keeps the build deploy-path-portable while yielding absolute, worker-safe URLs.
			assetPrefix: "auto",
			injectStyles: true
		}
	};
});

export default config;
