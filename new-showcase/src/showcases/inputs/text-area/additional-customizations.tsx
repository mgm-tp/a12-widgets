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
import type { FC, ChangeEvent } from "react";
import { useState, useCallback } from "react";

import {
	Counter,
	Button,
	Icon,
	TextAreaStateless,
	TextAffix,
	HintTooltip,
	WarningTooltip
} from "@com.mgmtp.a12.widgets/widgets-core";

import { fixedRandomNumber } from "../../../helpers/utils.js";

const helperText = loremIpsum({ units: "sentences", count: 2, random: fixedRandomNumber() });
const id = "text-area-combination";

export const AdditionalCustomizations: FC = () => {
	const [value, setValue] = useState("");

	const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		setValue(event.target.value);
	}, []);

	return (
		<TextAreaStateless
			id={id}
			value={value}
			onChange={handleChange}
			addonBefore={<Button icon={<Icon>search</Icon>} title="Search" />}
			addonAfter={[
				<HintTooltip text="This is a hint" key="hint" />,
				<WarningTooltip text="This is a warning" key="warning" id={`${id}-warning-tooltip`} />
			]}
			label="Addon Before"
			labelGraphic={<Icon>info</Icon>}
			prefixes={<Counter id="counter" value={10} overflowCount={9} />}
			suffixes={<TextAffix id="mmoll">mmol/l</TextAffix>}
			helperText={helperText}
			autoExpand
			ariaDescribedby={`${id}-warning-tooltip counter mmoll`}
		/>
	);
};
