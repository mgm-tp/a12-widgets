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

/**
 * Forbid React hook calls inside styled-components style callbacks.
 *
 * `styled(X)(({ theme }) => { useFoo(); ... })` and
 * `styled.div(({ theme }) => { useFoo(); ... })` are NOT React component
 * scopes; `react/rules-of-hooks` does not detect them (styled-components#3478).
 * styled-components calls a style callback from the styled component's render,
 * but not on every render, so a hook there makes the hook count differ between
 * renders: React logs "change in the order of Hooks" and eventually crashes with
 * "Rendered fewer hooks than expected" (A12W-11532).
 *
 * Fix: lift hook calls into the consuming component body and pass values
 * via transient props (`$foo`) into the styled component.
 */
export default {
	name: "no-hooks-in-styled-callback",
	meta: {
		type: "problem",
		docs: {
			description: "Disallow React hook calls inside styled-components style callbacks."
		},
		schema: [],
		messages: {
			hookInStyled:
				"Hook '{{name}}' called inside a styled-components style callback. " +
				"Lift the hook into the consuming component and pass the value via a $transient prop."
		}
	},
	create(context) {
		/**
		 * True if `node` is a CallExpression whose callee is a styled factory:
		 *   styled(X)            -> Identifier styled invoked
		 *   styled.div           -> MemberExpression with object.name === "styled"
		 *   styled(X).withConfig({...})
		 *   styled.div.withConfig({...})
		 *   styled.div.attrs({...})
		 */
		function isStyledFactoryCallee(callee) {
			if (!callee) {
				return false;
			}

			// styled.div(...)  -> callee = MemberExpression { object: Identifier "styled" }
			if (callee.type === "MemberExpression") {
				const obj = callee.object;

				if (obj && obj.type === "Identifier" && obj.name === "styled") {
					return true;
				}

				// styled.div.withConfig / styled.div.attrs -> recurse on object
				if (obj && (obj.type === "MemberExpression" || obj.type === "CallExpression")) {
					return isStyledFactoryCallee(obj);
				}

				return false;
			}

			// styled(X)(...) -> callee = CallExpression whose callee is Identifier "styled"
			if (callee.type === "CallExpression") {
				const inner = callee.callee;

				if (inner && inner.type === "Identifier" && inner.name === "styled") {
					return true;
				}

				// styled(X).withConfig({...})(fn) -> callee is MemberExpression on CallExpression
				if (inner && (inner.type === "MemberExpression" || inner.type === "CallExpression")) {
					return isStyledFactoryCallee(inner);
				}
			}

			return false;
		}

		/**
		 * True if `tag` tags a style template whose interpolations styled-components
		 * evaluates during style generation:
		 *   styled.div`...`, styled(X)`...`, styled.div.withConfig({...})`...`
		 *   css`...`, keyframes`...`, createGlobalStyle`...`
		 */
		function isStyleTemplateTag(tag) {
			if (!tag) {
				return false;
			}

			if (tag.type === "Identifier") {
				return tag.name === "css" || tag.name === "keyframes" || tag.name === "createGlobalStyle";
			}

			return isStyledFactoryCallee(tag);
		}

		function isHookName(name) {
			return typeof name === "string" && /^use[A-Z0-9]/.test(name);
		}

		function getCalleeName(callee) {
			if (!callee) {
				return null;
			}

			if (callee.type === "Identifier") {
				return callee.name;
			}

			if (callee.type === "MemberExpression" && callee.property && callee.property.type === "Identifier") {
				return callee.property.name;
			}

			return null;
		}

		function visit(node, report) {
			if (!node || typeof node.type !== "string") {
				return;
			}

			// Do not descend into nested function bodies — those are separate scopes.
			if (
				node.type === "FunctionDeclaration" ||
				node.type === "FunctionExpression" ||
				node.type === "ArrowFunctionExpression"
			) {
				return;
			}

			if (node.type === "CallExpression") {
				const name = getCalleeName(node.callee);

				if (isHookName(name)) {
					report(node, name);
				}
			}

			for (const key of Object.keys(node)) {
				if (key === "parent") {
					continue;
				}

				const value = node[key];

				if (Array.isArray(value)) {
					for (const item of value) {
						if (item && typeof item === "object" && typeof item.type === "string") {
							visit(item, report);
						}
					}
				} else if (value && typeof value === "object" && typeof value.type === "string") {
					visit(value, report);
				}
			}
		}

		function reportHooksIn(callback) {
			if (!callback || (callback.type !== "ArrowFunctionExpression" && callback.type !== "FunctionExpression")) {
				return;
			}

			visit(callback.body, (hookNode, name) => {
				context.report({
					node: hookNode,
					messageId: "hookInStyled",
					data: { name }
				});
			});
		}

		return {
			// styled.div(fn), styled(X).withConfig({...})(fn), styled.div.attrs(fn)
			CallExpression(node) {
				if (!isStyledFactoryCallee(node.callee)) {
					return;
				}

				for (const arg of node.arguments) {
					reportHooksIn(arg);
				}
			},

			// styled.div`...${fn}...`, css`...${fn}...`
			TaggedTemplateExpression(node) {
				if (!isStyleTemplateTag(node.tag)) {
					return;
				}

				for (const expression of node.quasi.expressions) {
					reportHooksIn(expression);
				}
			}
		};
	}
};
