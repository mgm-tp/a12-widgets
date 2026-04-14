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

import type { FC } from "react";
import { useState, useCallback } from "react";

import "@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/themes/rich-text-editor.css";
import { Icon, Radio, CheckboxGroup, DefaultRichTextEditor } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../../helpers/configuration-view.js";

import { EditorStyle } from "../style/inline-styled-editor-wrapper.styled.js";
import { BUTTONS } from "../share/data.js";

export const Basic: FC = () => {
	const [selectedValue, setSelectedValue] = useState("editable");
	const [minHeightSelected, setMinHeightSelected] = useState(false);
	const [maxHeightSelected, setMaxHeightSelected] = useState(false);

	const handleRadioValueChanged = useCallback((value: string): void => {
		setSelectedValue(value);
	}, []);

	const handleCheckboxChanged = useCallback(
		(value: string): void => {
			if (value === "minHeight") {
				setMinHeightSelected(!minHeightSelected);
			} else if (value === "maxHeight") {
				setMaxHeightSelected(!maxHeightSelected);
			}
		},
		[minHeightSelected, maxHeightSelected]
	);

	return (
		<ConfigurationView
			configuration={
				<>
					<Radio inline value={selectedValue} onValueChanged={handleRadioValueChanged} name="chicken">
						<Radio.Item label="Editable" value="editable" />
						<Radio.Item label="Readonly" value="readonly" />
						<Radio.Item label="Disabled" value="disabled" />
						<Radio.Item label="Auto expand" value="autoExpand" />
					</Radio>
					<br />
					<CheckboxGroup inline onValueChanged={handleCheckboxChanged}>
						<CheckboxGroup.Item label="Set min-Height to 50px" value="minHeight" selected={minHeightSelected} />
						<CheckboxGroup.Item
							label="Set max-Height to 200px"
							value="maxHeight"
							selected={maxHeightSelected && selectedValue === "autoExpand"}
							disabled={selectedValue !== "autoExpand"}
						/>
					</CheckboxGroup>
				</>
			}
		>
			<div className="-u-width-full">
				<EditorStyle />
				<DefaultRichTextEditor
					initialConfig={{ namespace: "Default Rich Text Editor" }}
					id="default-editor"
					label="Basic Default Rich Text Editor"
					labelGraphic={<Icon>info</Icon>}
					disabled={selectedValue === "disabled"}
					readonly={selectedValue === "readonly"}
					autoExpand={selectedValue === "autoExpand"}
					placeholder="Type anything..."
					minHeight={minHeightSelected ? 50 : undefined}
					maxHeight={maxHeightSelected ? 200 : undefined}
					helperText="Example Helper Text. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
					staticToolbarButtons={BUTTONS}
				/>
			</div>
		</ConfigurationView>
	);
};
