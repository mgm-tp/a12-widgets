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

import type { ReactElement, FC } from "react";
import { useMemo } from "react";
import type { LinkMatcher } from "@lexical/react/LexicalAutoLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import type { AutoLinkPluginProps } from "./auto-link.api.js";
import type { ChangeHandler } from "./auto-link.internal.api.js";
import { useAutoLink } from "./hook.js";
import { createLinkMatcherWithLinkify, createLinkMatcherWithRegExp } from "./utils.js";

/**
 * ===== BEGIN THIRD-PARTY SOURCE: Lexical (https://lexical.dev),
 * https://github.com/facebook/lexical/blob/v.0.12.2/packages/lexical-react/src/LexicalAutoLinkPlugin.ts
 * Licensed under the MIT License.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Modified by mgm technology partners on 2024-16-04.
 */
export function LexicalAutoLinkPlugin({
	matchers,
	onChange,
	target
}: {
	matchers: Array<LinkMatcher>;
	onChange?: ChangeHandler;
	target?: string;
}): ReactElement | null {
	const [editor] = useLexicalComposerContext();

	useAutoLink(editor, matchers, onChange, target);

	return <></>;
}

// ===== END THIRD-PARTY SOURCE =====

LexicalAutoLinkPlugin.displayName = "LexicalAutoLinkPlugin";

export const AutoLinkPlugin: FC<AutoLinkPluginProps> = (props: AutoLinkPluginProps) => {
	const matchers = useMemo((): LinkMatcher[] => {
		let pluginMatchers: LinkMatcher[] = [createLinkMatcherWithLinkify()];

		if (props.customTerms) {
			const customMatchers = props.customTerms.map((customTerm) => {
				return createLinkMatcherWithRegExp(customTerm.regex, customTerm.getUrl);
			});

			pluginMatchers = [...pluginMatchers, ...customMatchers];
		}

		return pluginMatchers;
	}, [props.customTerms]);

	return <LexicalAutoLinkPlugin target={props.target} matchers={matchers} />;
};

AutoLinkPlugin.displayName = "AutoLinkPlugin";
