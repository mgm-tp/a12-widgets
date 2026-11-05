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

import { type Styleable } from "@com.mgmtp.a12.widgets/widgets-core";

/**
 * The license header at the very start of a snippet, together with the blank lines after it.
 *
 * Anchored at the start so only the header is stripped: block comments further down, such as the
 * JSDoc explaining why an example is written the way it is, stay visible in the displayed code.
 * The trailing part deliberately matches only spaces, tabs and line breaks rather than `\s*`,
 * which would also swallow the indentation of the first line of code.
 *
 * @deprecated since 39.1.0, together with the rest of `@com.mgmtp.a12.widgets/widgets-utils`, which will be
 * removed in a future major version. Copy this expression into your project if you need it.
 */
export const LICENSE_HEADER = /^\/\*[\s\S]*?\*\/(?:[\t ]*(?:\r?\n|\r))+/;

/**
 * @deprecated since 39.1.0, together with the rest of `@com.mgmtp.a12.widgets/widgets-utils`, which will be
 * removed in a future major version. The code viewer exists to render the showcase's own snippets and has no
 * counterpart in `widgets-core`. Render highlighted code with `react-syntax-highlighter` (or any other highlighter)
 * directly, or copy this component's source out of the package.
 */
export type CodeModule = {
	default: string;
};

/**
 * @deprecated since 39.1.0, together with the rest of `@com.mgmtp.a12.widgets/widgets-utils`, which will be
 * removed in a future major version. The code viewer exists to render the showcase's own snippets and has no
 * counterpart in `widgets-core`. Render highlighted code with `react-syntax-highlighter` (or any other highlighter)
 * directly, or copy this component's source out of the package.
 */
export type SourceCode = {
	name?: string;
	code: string | CodeModule;
};

/**
 * The props of {@link CodeExample}.
 *
 * @deprecated since 39.1.0, together with the rest of `@com.mgmtp.a12.widgets/widgets-utils`, which will be
 * removed in a future major version. The code viewer exists to render the showcase's own snippets and has no
 * counterpart in `widgets-core`. Render highlighted code with `react-syntax-highlighter` (or any other highlighter)
 * directly, or copy this component's source out of the package.
 */
export interface CodeExampleProps extends Styleable {
	/**
	 * If an array of SourceCode is passed, a Flyout menu will be displayed with a list of file name as label of the menu item
	 * Otherwise, no file name is displayed.
	 */
	code: CodeModule | SourceCode | SourceCode[];

	/**
	 * A language registered with the syntax highlighter. Only `jsx` and `tsx` are registered; anything else
	 * renders unhighlighted.
	 *
	 * @default tsx
	 */
	language?: string;
}
