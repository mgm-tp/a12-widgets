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

import LoginLayoutAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/login-layout/main/login-layout.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { LoginLayoutExample } from "./example.js";

import loginLayoutCode from "!./example.tsx?raw";

const showcase: Showcase = {
	label: "Login Layout",
	description: (
		<>
			<p>
				The <strong>Login Layout</strong> is a set of Widgets which provides a basic layout for login pages.
			</p>
			<p>
				The main component <strong>LoginLayout</strong> equips some useful properties like <code>backgroundImage</code>,{" "}
				<code>fullscreen</code> or <code>mobile</code> to achieve the common use-cases.
			</p>
			<p>
				In addition, under the same name namespace, we provide other convenient components, e.g. <code>Headline</code>,{" "}
				<code>Logo</code>, <code>Form</code>, <code>Footer</code>... Please see the below example how those components
				are organized to create a practical login form.
			</p>
		</>
	),
	sections: [
		{
			content: <LoginLayoutExample />,
			code: { name: "example.tsx", code: loginLayoutCode },
			fullSize: true
		}
	]
};
export default {
	label: "Login Layout",
	structure: [showcase],
	widgetInfo: {
		typedoc: [{ declaration: LoginLayoutAPI }],
		themingConfiguration: "loginLayout"
	}
};
