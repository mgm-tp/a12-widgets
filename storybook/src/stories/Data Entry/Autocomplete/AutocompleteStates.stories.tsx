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

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Autocomplete } from "@com.mgmtp.a12.widgets/widgets-core";

const LANGUAGES = [
	"Java",
	"Groovy",
	"JavaScript",
	"TypeScript",
	"C++",
	"C",
	"Scala",
	"Python",
	"PHP",
	"ActionScript",
	"AppleScript",
	"Clojure",
	"COBOL",
	"BASIC",
	"Erlang",
	"Fortran",
	"Haskell",
	"Lisp",
	"Perl",
	"Ruby",
	"Scheme"
];

const meta: Meta<typeof Autocomplete> = {
	title: "Data Entry/Autocomplete/States",
	component: Autocomplete,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div style={{ width: 400 }}>
			<Autocomplete
				id="autocomplete-loading-default"
				label="Programming Language"
				inputPlaceHolder="Please select or start typing"
				hintTemplate="{count} matches"
				items={LANGUAGES}
				loading
				loadingLabel="Fetching options..."
			/>
		</div>
	)
};

export const Loading: Story = {
	render: () => (
		<div style={{ width: 400 }}>
			<Autocomplete
				id="autocomplete-loading"
				label="Programming Language"
				inputPlaceHolder="Please select or start typing"
				hintTemplate="{count} matches"
				items={LANGUAGES}
				loading
				loadingLabel="Fetching options..."
			/>
		</div>
	)
};

export const Disabled: Story = {
	render: () => (
		<div style={{ width: 400 }}>
			<Autocomplete
				id="autocomplete-disabled"
				label="Programming Language (disabled)"
				inputPlaceHolder="Please select or start typing"
				hintTemplate="{count} matches"
				items={LANGUAGES}
				initialValue="Java"
				disabled
			/>
		</div>
	)
};

export const ValidationMessages: Story = {
	render: () => {
		const AutocompleteValidation = () => {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<div style={{ width: 400, display: "flex", flexDirection: "column", gap: 16 }}>
					<Autocomplete
						id="autocomplete-error"
						label="Error state"
						inputPlaceHolder="Please select or start typing"
						hintTemplate="{count} matches"
						items={LANGUAGES}
						value={value}
						onValueChange={(v) => setValue(v as string)}
						errorMessage="A selection is required"
					/>
					<Autocomplete
						id="autocomplete-warning"
						label="Warning state"
						inputPlaceHolder="Please select or start typing"
						hintTemplate="{count} matches"
						items={LANGUAGES}
						value={value}
						onValueChange={(v) => setValue(v as string)}
						warningMessage="Consider selecting a more popular language"
					/>
					<Autocomplete
						id="autocomplete-info"
						label="Info state"
						inputPlaceHolder="Please select or start typing"
						hintTemplate="{count} matches"
						items={LANGUAGES}
						value={value}
						onValueChange={(v) => setValue(v as string)}
						infoMessage="Start typing to filter the list"
					/>
				</div>
			);
		};

		return <AutocompleteValidation />;
	}
};
