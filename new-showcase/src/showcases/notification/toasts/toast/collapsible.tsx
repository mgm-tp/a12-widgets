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

import type { ReactElement } from "react";
import { useState, useCallback } from "react";

import { LinesEllipsis, Link, Toast, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const HTML_SAMPLE = (
	<div>
		<div>This is a div tag</div>
		<p>
			This is a p tag contains an <a href="https://example.com">anchor tag</a>
		</p>
		<strong>This is a strong tag</strong>
		<br />
		Todo List:
		<ul>
			<li>Task 1</li>
			<li>Task 2</li>
			<li>Task 3</li>
		</ul>
	</div>
);

export function CombinationToastShowcase(): ReactElement {
	const customIcon = <Icon>public</Icon>;
	const [minimizedHtml, setMinimizedHtml] = useState(false);
	const renderHtmlContent = minimizedHtml ? <LinesEllipsis htmlSupport maxLine={2} text={HTML_SAMPLE} /> : HTML_SAMPLE;

	const toggleMinimizedHtmlToastState = useCallback(() => {
		setMinimizedHtml((htmlState) => !htmlState);
	}, []);

	return (
		<div>
			<Toast
				icon={customIcon}
				header={<em>Collapsible toast with html content</em>}
				message={renderHtmlContent}
				collapse={
					<Link useAsButton onClick={toggleMinimizedHtmlToastState}>
						{minimizedHtml ? "READ MORE" : "READ LESS"}
					</Link>
				}
			/>
		</div>
	);
}
