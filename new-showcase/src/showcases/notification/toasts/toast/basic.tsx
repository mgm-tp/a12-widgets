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

import type { CommonToastProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, Toast, Radio } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { CodeSnippetGenerationWrapper } from "../../../../helpers/showcase-example.js";
import { ConfigurationView } from "../../../../helpers/configuration-view.js";

const fakeMessage = "Toast widget has the following variants: info (default), success, warning, and error.";

const fakeFooter = (
	<ButtonGroup alignment="right">
		<Button label="Update later" />
		<Button label="Update now" primary />
	</ButtonGroup>
);

// end code removal
export function BasicToastShowcase(): ReactElement {
	// start code removal
	const [variant, setVariant] = useState<CommonToastProps["variant"]>("info");
	const changeVariant = (val: string): void => {
		setVariant(val as CommonToastProps["variant"]);
	};

	// end code removal
	return (
		// start code removal
		<ConfigurationView
			configuration={
				<div>
					<Radio inline label="Toast variant" onValueChanged={changeVariant} value={variant}>
						<Radio.Item label="Info" value="info" />
						<Radio.Item label="Success" value="success" />
						<Radio.Item label="Warning" value="warning" />
						<Radio.Item label="Error" value="error" />
					</Radio>
				</div>
			}
		>
			<CodeSnippetGenerationWrapper>
				<Toast variant={variant} message={fakeMessage} header="Error" footer={fakeFooter} />
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
