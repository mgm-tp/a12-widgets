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

import type { AccordionProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Accordion, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { Text } from "../../helpers/text-generator.js";

const { Container, Section, Summary, Details } = Accordion;

export const initialSections: AccordionProps.SectionProps[] = [
	{
		id: "first-accordion-section"
	},
	{
		id: "second-accordion-section",
		expanded: true
	},
	{
		id: "third-accordion-section"
	}
];
export function ControlledAccordion(): ReactElement {
	const [sections, setSections] = useState(initialSections);

	const handleSectionClick = useCallback(
		(id?: string) => {
			const newSections = sections.map((sec) => ({
				...sec,
				expanded: sec.id === id ? !sec.expanded : false
			}));
			setSections(newSections);
		},
		[sections]
	);

	return (
		<Container
			className="-u-width-full"
			controlled
			expandIcon={<Icon>expand_more</Icon>}
			collapseIcon={<Icon>expand_less</Icon>}
		>
			{sections.map((section, index) => {
				return (
					<Section
						id={section.id}
						key={section.id}
						expanded={section.expanded}
						onClick={() => handleSectionClick(section.id)}
					>
						<Summary>Section {index + 1}</Summary>
						<Details>
							<div className="-u-padding-xs">{Text.LONG_PARAGRAPH}</div>
						</Details>
					</Section>
				);
			})}
		</Container>
	);
}
