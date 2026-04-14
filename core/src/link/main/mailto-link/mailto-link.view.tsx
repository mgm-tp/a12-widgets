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
import { useContext } from "react";

import { Icon } from "../../../icon/main/icon.view.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { addPrefix, joinClassNames } from "../../../common/main/utils.js";

import { Link } from "../link/link.view.js";

import type { MailtoLinkProps } from "./mailto-link.api.js";

export function MailtoLink(props: MailtoLinkProps): ReactElement<MailtoLinkProps> {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const a11yTitles = languageContext.linkTitles?.mailtoLinkTitle;
	const { to, href, className, children, title = a11yTitles, ...rest } = props;

	return (
		<Link
			className={joinClassNames(addPrefix("link--mailto"), className)}
			title={title}
			href={`mailto:${to}`}
			{...rest}
		>
			<Icon>email</Icon>
			{children}
		</Link>
	);
}

MailtoLink.displayName = "MailtoLink";
