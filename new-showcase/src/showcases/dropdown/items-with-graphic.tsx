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
import { useState } from "react";

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { Checkbox, DropDown, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const items = [
	{ label: "Top", graphic: <Icon>vertical_align_top</Icon> },
	{ label: "Middle", graphic: <Icon>vertical_align_center</Icon> },
	{ label: "Bottom", graphic: <Icon>vertical_align_bottom</Icon> },
	{ label: "Center", graphic: <Icon>format_align_center</Icon> },
	{ label: "Justify", graphic: <Icon>format_align_justify</Icon>, disabled: true },
	{ label: "Left", graphic: <Icon>format_align_left</Icon> },
	{ label: "Right", graphic: <Icon>format_align_right</Icon> },
	{ label: "Decrease", graphic: <Icon>format_indent_decrease</Icon> },
	{ label: "Increase", graphic: <Icon>format_indent_increase</Icon> },
	{ label: "Translate", graphic: <Icon>translate</Icon> },
	{ label: "Visibility", graphic: <Icon>visibility</Icon> },
	{ label: "Invisibility", graphic: <Icon>visibility_off</Icon> },
	{ label: "view array", graphic: <Icon>view_array</Icon> },
	{ label: "View column", graphic: <Icon>view_column</Icon> },
	{ label: "View day", graphic: <Icon>view_day</Icon> },
	{ label: "View headline", graphic: <Icon>view_headline</Icon> },
	{ label: "View list", graphic: <Icon>view_list</Icon> },
	{ label: "View module", graphic: <Icon>view_module</Icon> },
	{ label: "View quitl", graphic: <Icon>view_quilt</Icon> },
	{ label: "View stream", graphic: <Icon>view_stream</Icon> },
	{ label: "View week", graphic: <Icon>view_week</Icon> },
	{ label: "View agenda", graphic: <Icon>view_agenda</Icon> }
].map((item) => ({ ...item, tabIndex: 0, value: item.label.toLowerCase() }));

export function DropDownWithGraphicShowcase(): ReactElement {
	const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);
	const [horizontal, setHorizontal] = useState<boolean>(false);

	return (
		<ConfigurationView
			reportLabel="Horizontal"
			configuration={
				<Checkbox fitToParent={false} checked={horizontal} label="Horizontal Mode" onChange={setHorizontal} />
			}
			useDarkBackground
		>
			<DropDown
				horizontal={horizontal}
				hint="25 of 25 options shown"
				items={items}
				onSelectedItemChange={setSelectedItem}
				selectedItem={selectedItem}
			/>
		</ConfigurationView>
	);
}
