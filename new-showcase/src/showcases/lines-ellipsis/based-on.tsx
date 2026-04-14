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
// start code removal
import { useState } from "react";
// end code removal

import { LinesEllipsis, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";
// end code removal

export function BasedOnLineEllipsisShowcase(): ReactElement {
	// start code removal
	const [checked, setChecked] = useState(false);

	// end code removal
	return (
		// start code removal
		<ConfigurationView
			configuration={
				<Checkbox
					fitToParent={false}
					checked={checked}
					label="split based on letters"
					onChange={(): void => setChecked(!checked)}
				/>
			}
		>
			<CodeSnippetGenerationWrapper>
				<LinesEllipsis
					basedOn={checked ? "letters" : "words"}
					text="Ellipses are a powerful tool in written communication, often used to indicate a pause, omission, or trailing off of thought.
					By mastering the art of using ellipses strategically, writers can captivate their audience and convey complex ideas with precision."
				/>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
