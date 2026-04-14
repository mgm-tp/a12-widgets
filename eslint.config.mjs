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
 * 1. Open-Source License – EUPL v1.2
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
import { reactRecommended } from "@com.mgmtp.a12.devtools/eslint-config";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import noticePlugin from "eslint-plugin-notice";
import stylistic from "@stylistic/eslint-plugin";
import storybook from "eslint-plugin-storybook";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

const license = await Fs.readFile(Path.join(import.meta.dirname, "license_header.txt"), "utf-8");

/** @type { import("eslint").Linter.Config[] } */
export default [
	...reactRecommended,
	a11yPlugin.flatConfigs.recommended,
	{
		name: "widgets/ignores",
		ignores: ["**/{lib,dist,target,public-showcase,playwright-report,storybook-static,.*}/"]
	},
	{
		name: "widgets/general",
		languageOptions: {
			parserOptions: {
				projectService: { allowDefaultProject: ["./*.{js,cjs,mjs,ts}", "*/scripts/*.{js,cjs,mjs,ts}"] },
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			notice: noticePlugin,
			"@stylistic": stylistic
		},
		rules: {
			camelcase: "warn",
			"no-console": "error",

			"@typescript-eslint/no-empty-object-type": "warn",
			"@typescript-eslint/no-unsafe-function-type": "warn",
			"@typescript-eslint/no-use-before-define": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					ignoreRestSiblings: true,
					destructuredArrayIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^error$",
					argsIgnorePattern: "^_"
				}
			],
			"@typescript-eslint/no-empty-function": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-expressions": "warn",
			"@typescript-eslint/consistent-type-imports": "error",
			"notice/notice": ["error", { template: license, onNonMatchingHeader: "replace", chars: license.length }],

			"react/jsx-key": "off",
			"react/jsx-curly-brace-presence": ["error", "never"],
			"react/no-unescaped-entities": "off",
			"react/react-in-jsx-scope": "off",
			"react-hooks/exhaustive-deps": "error",
			"react-hooks/refs": "warn",
			"react-hooks/set-state-in-effect": "warn",
			"react-hooks/preserve-manual-memoization": "warn",
			"react-hooks/immutability": "warn",

			"jsx-a11y/no-noninteractive-element-interactions": "warn",
			"jsx-a11y/mouse-events-have-key-events": "warn",
			"jsx-a11y/label-has-associated-control": [
				"error",
				{
					labelComponents: ["Label"],
					labelAttributes: ["label"],
					assert: "either",
					depth: 3
				}
			],
			"jsx-a11y/no-static-element-interactions": "off",
			"jsx-a11y/no-noninteractive-tabindex": "off",
			"jsx-a11y/no-autofocus": "off",
			"import/no-duplicates": ["error", { considerQueryString: true }],
			"@stylistic/padding-line-between-statements": [
				"error",
				{ blankLine: "always", prev: "*", next: ["if", "while", "for", "switch", "try", "do", "return"] },
				{ blankLine: "always", prev: "block-like", next: "*" }
			],
			"@stylistic/lines-around-comment": [
				"error",
				{
					beforeBlockComment: true,
					allowObjectStart: true,
					allowClassStart: true,
					allowArrayStart: true,
					allowInterfaceStart: true,
					allowBlockStart: true,
					allowTypeStart: true,
					allowModuleStart: true,
					allowEnumStart: true
				}
			]
		}
	},
	{
		name: "widgets/core",
		files: ["core/**/*.{ts,tsx}"],
		rules: {
			"@typescript-eslint/explicit-function-return-type": "warn",
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							regex: "\\..*/lib/.*",
							message: "Importing from the 'lib' directory is not allowed; import from 'src' directory instead"
						}
					]
				}
			],
			"@typescript-eslint/no-floating-promises": "error"
		}
	},
	{
		name: "widgets/test",
		files: ["{core}/**/{test,__tests__,playwright}/**/*.{ts,tsx}", "**/*.config.ts"],
		rules: {
			"react/display-name": "off",
			"import/no-extraneous-dependencies": "off",
			"@typescript-eslint/explicit-function-return-type": "off"
		}
	},
	{
		name: "widgets/new-showcase",
		files: ["new-showcase/**"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					paths: [
						"@com.mgmtp.a12.widgets/widgets-core/lib/index.js",
						"@com.mgmtp.a12.widgets/widgets-core/lib/common/index.js"
					]
				}
			]
		}
	},
	...storybook.configs["flat/recommended"].map((config) => ({
		...config,
		files: ["storybook/**/*.{ts,tsx,js,jsx}"]
	})),
	{
		...reactRefresh.configs.vite,
		name: "widgets/storybook",
		files: ["storybook/**/*.{ts,tsx,js,jsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser
		}
	}
];
