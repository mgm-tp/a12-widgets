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
import { useState, useMemo } from "react";
// end code removal

import { List, Icon, Radio, Range } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";
// end code removal

export function ListElements(): ReactElement {
	// start code removal
	const [secondaryTextPos, setSecondaryTextPos] = useState<string | undefined>("bottom");
	const [graphic, setGraphic] = useState<string | undefined>("none");
	const [meta, setMeta] = useState<string | undefined>("none");

	const configuration = (
		<div>
			<Radio
				label="Secondary Text Position"
				inline
				value={secondaryTextPos}
				onValueChanged={setSecondaryTextPos}
				id="secondary-text-config"
			>
				<Radio.Item label="Default" value="bottom" />
				<Radio.Item label="Flipped" value="top" />
			</Radio>
			<Radio label="Graphic" inline value={graphic} onValueChanged={setGraphic} id="graphic-config">
				<Radio.Item label="None" value="none" />
				<Radio.Item label="Icon" value="icon" />
				<Radio.Item label="Text" value="text" />
			</Radio>
			<Radio label="Meta" inline value={meta} onValueChanged={setMeta} id="meta-config">
				<Radio.Item label="None" value="none" />
				<Radio.Item label="Icon" value="icon" />
				<Radio.Item label="Text" value="text" />
			</Radio>
		</div>
	);

	const renderedGraphic = useMemo(() => {
		switch (graphic) {
			case "icon":
				return <Icon>folder</Icon>;
			case "text":
				return "L";
			default:
				return undefined;
		}
	}, [graphic]);

	const renderedMeta = useMemo(() => {
		switch (meta) {
			case "icon":
				return <Icon>check</Icon>;
			case "text":
				return "Meta";
			default:
				return undefined;
		}
	}, [meta]);

	const renderedListItems = useMemo(
		() =>
			Array.from(new Range(4)).map((value) => {
				if (value === 3) {
					return <List.Item key={value} text="List Item without graphic or meta" secondaryText="Secondary text" />;
				}

				return (
					<List.Item
						key={value}
						text="List Item"
						secondaryText="Secondary text"
						graphic={renderedGraphic}
						meta={renderedMeta}
					/>
				);
			}),
		[renderedGraphic, renderedMeta]
	);

	// end code removal
	return (
		// start code removal
		<ConfigurationView configuration={configuration}>
			<CodeSnippetGenerationWrapper namespaceOptions={[{ name: "List", subComponents: ["Item", "SubHeader"] }]}>
				<List
					border
					divider
					flipped={secondaryTextPos === "top"}
					paddedLeft={graphic !== "none"}
					paddedRight={meta !== "none"}
				>
					{renderedListItems}
					<List.SubHeader
						fill
						graphic={graphic === "icon" && <Icon>folder</Icon>}
						meta={meta === "icon" && <Icon>edit</Icon>}
					>
						Sub header
					</List.SubHeader>
					{renderedListItems}
				</List>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
