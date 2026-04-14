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

import { loremIpsum } from "lorem-ipsum";
import type { ReactElement } from "react";
// start code removal
import { styled } from "styled-components";
// end code removal

import { TextOutput, ErrorTooltip, HintTooltip, WarningTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";
// end code removal
import { fixedRandomNumber } from "../../helpers/utils.js";

const shortText = loremIpsum({ count: 10, units: "words", random: fixedRandomNumber() });
const longText = loremIpsum({ count: 50, units: "words", random: fixedRandomNumber() });
const addons = [<ErrorTooltip key="error" text="Error" />, <WarningTooltip key="warning" text="Warning" />];
// start code removal
const StyledWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => `${theme.spacing.verticalSpacing.vertWhiteSpacingmd}px`};
`;
// end code removal

export function AdditionalCustomizations(): ReactElement {
	return (
		// start code removal
		<StyledWrapper>
			<CodeSnippetGenerationWrapper>
				<TextOutput
					label="Short content with messages"
					warningMessage="Warning message"
					errorMessage="Error message"
					infoMessage="Info message"
				>
					{shortText}
				</TextOutput>
				<TextOutput
					label="Long content with tooltips and addons"
					tooltips={<HintTooltip text="Hint" />}
					addonAfter={addons}
				>
					{longText}
				</TextOutput>
			</CodeSnippetGenerationWrapper>
		</StyledWrapper>
		// end code removal
	);
}
