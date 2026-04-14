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
import { loremIpsum } from "lorem-ipsum";

import { Radio, ActionContentbox, ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core";

// end code removal
// start code removal
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { fixedRandomNumber } from "../../helpers/utils.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";
// end code removal

export function PaddingConfiguration(): ReactElement {
	// start code removal
	const [value, setValue] = useState("default");
	const onValueChanged = (newValue: string): void => {
		setValue(newValue);
	};

	const padding = value === "no-padding" ? false : value === "custom" ? "10px 24px" : true;

	// end code removal
	return (
		// start code removal
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-row -u-justify-end -u-items-center">
					<Radio name="padding-config" onValueChanged={onValueChanged} value={value} label="Padding Configuration">
						<Radio.Item value="default" label="Default" />
						<Radio.Item value="no-padding" label="No Padding" />
						<Radio.Item value="custom" label="Custom Padding (12px 24px)" />
					</Radio>
				</div>
			}
			useDarkBackground
		>
			<CodeSnippetGenerationWrapper>
				<ActionContentbox
					footer={<ContentBoxElements.Footer />}
					headingElements={<ContentBoxElements.Title key="title" text="Content box with padding configuration" />}
					headingButtons={<ContentBoxElements.CloseButton />}
					padding={padding}
				>
					{loremIpsum({ units: "sentences", count: 10, random: fixedRandomNumber() })}
				</ActionContentbox>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
