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

import type { FC, ReactNode } from "react";

import type { Styleable } from "../../src/common/main/base-props.js";
import { Autocomplete } from "../../src/input/autocomplete/main/autocomplete.view.js";
import { Button } from "../../src/button/main/button.view.js";
import { ButtonGroup } from "../../src/button-group/main/button-group.view.js";
import { Icon } from "../../src/icon/main/icon.view.js";
import { TextOutput } from "../../src/text-output/main/text-output.view.js";

export const AutocompleteExample: FC<Styleable> = ({ className }): ReactNode => {
	return (
		<div className={className}>
			<Autocomplete
				label="Location"
				inputPlaceHolder="Please select or start typing"
				hintTemplate="{count} matches"
				items={["Vietnam", "Germany"]}
			/>
		</div>
	);
};

export const ButtonExample: FC<Styleable> = ({ className }): ReactNode => {
	return (
		<ButtonGroup>
			<Button primary label="Primary Button" className={className} />
			<Button secondary label="Secondary Button" className={className} />
			<Button primary icon={<Icon>search</Icon>} title="Primary Icon button" className={className} />
			<Button secondary icon={<Icon>search</Icon>} title="Secondary Icon button" className={className} />
			<Button icon={<Icon>search</Icon>} title="Default Icon Button" className={className} />
		</ButtonGroup>
	);
};

export const TextOutputExample: FC<Styleable> = ({ className }): ReactNode => {
	return (
		<div className={className}>
			<TextOutput label="Text Output">Initial content</TextOutput>
		</div>
	);
};

export const TextOutputWithoutDataExample: FC<Styleable> = ({ className }): ReactNode => {
	return (
		<div className={className}>
			<TextOutput noData label="Text Output without data">
				no data
			</TextOutput>
		</div>
	);
};
