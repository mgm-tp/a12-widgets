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

import { BulletList, CollapsiblePanel, MessageBox } from "@com.mgmtp.a12.widgets/widgets-core";

import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

export function Introduction(): ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const toggleCollapsiblePanel = useCallback(() => setIsOpen(!isOpen), [isOpen]);

	return (
		<>
			<p>
				Widgets provide a great amount of helper classes (styles), which can be used to change the styling of a specific
				element/Widget.
			</p>
			<CollapsiblePanel title="Some notes about the usage" onClick={toggleCollapsiblePanel}>
				{isOpen && (
					<>
						<BulletList.Unordered>
							<BulletList.Item>
								Helper Classes also apply to the Widgets that use a specific Widget as the main wrapper. For example,
								the Text Field is used in the Date Picker and Date Time Picker; the Select is used in the Year Selector
								and Month Selector. Then these 4 Widgets will also be affected by the Helper Classes.
							</BulletList.Item>
							<BulletList.Item>
								If an element/Widget contains multiple parts (Text Field, Text Area, Text Output, Select), the Helper
								Classes will be applied to all parts except the Tooltip and the Error/Warning Message.
							</BulletList.Item>
							<BulletList.Item>
								If you'd like to change the general appearance of an element/widget throughout the application, you
								should use the Plasma Configuration. For more information, see{" "}
								<StyledShowcaseLink href="#/get-started/use-and-configure-widgets-style">
									Get Started {">"} Use And Configure Widgets Style.
								</StyledShowcaseLink>
							</BulletList.Item>
							<BulletList.Item>
								If your project is using CSS Prefix, please also add the prefix manually when using the Helper Classes.
								<MessageBox label={<strong>USING WITHIN THE FMM</strong>} variant="warning" className="-u-margin-t-xs">
									<div>
										First, you need to add the desired styles in the model settings. Then they can be applied to the
										model elements.
										<br />
										<strong>Please note:</strong> When applying styles to a section, only the styling of the section
										itself will be changed and not the styling of the elements within the section.
									</div>
								</MessageBox>
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				)}
			</CollapsiblePanel>
		</>
	);
}
