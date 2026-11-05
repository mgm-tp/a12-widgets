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

import { useState } from "react";
import { getByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { DropDownItem } from "../../../dropdown/index.js";
import { Autocomplete } from "../main/autocomplete.view.js";

const ALL: DropDownItem[] = [
	{ label: "Insurer DE", value: "de" },
	{ label: "Insurer AT", value: "at" },
	{ label: "Reinsurer CH", value: "ch" }
];

interface SelectionOptions {
	/** Hand `value` over as a freshly built object on every render instead of a stable one. */
	freshValueIdentity?: boolean;

	/** Query candidates through `onSearch` (async mode) instead of letting the widget filter. */
	async?: boolean;

	/** Put the committed selection back into the candidate list on every render. */
	reAddSelected?: boolean;
}

/**
 * Stands in for the platform's DropDownSelection: it queries candidates from the "server" through
 * `onSearch` and puts the currently selected item back into the candidate list on every render.
 */
function ServerBackedSelection({
	freshValueIdentity = false,
	async = true,
	reAddSelected = true
}: SelectionOptions): React.ReactElement {
	const [selected, setSelected] = useState<DropDownItem | undefined>(ALL[0]);
	const [query, setQuery] = useState("");

	const results = async ? ALL.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase())) : ALL;
	const items =
		reAddSelected && selected && !results.some((item) => item.value === selected.value)
			? [selected, ...results]
			: results;

	return (
		<Autocomplete
			label="Insurer"
			hintTemplate=""
			items={items}
			value={freshValueIdentity && selected ? { ...selected } : selected}
			onSearch={async ? setQuery : undefined}
			onValueChange={(value) => setSelected(typeof value === "string" ? { label: value } : value)}
		/>
	);
}

async function openAndPutCaretAtEnd(input: HTMLInputElement): Promise<void> {
	await userEvent.click(input);
	input.setSelectionRange(input.value.length, input.value.length);
}

describe("com.mgmtp.a12.widgets.autocomplete.value-sync", () => {
	// A caller that rebuilds `value` on every render only re-renders the widget mid-edit when it also
	// searches asynchronously — which is why the two together are what surfaces this.
	test("an edit survives a caller that rebuilds `value` on every render", async () => {
		const { container } = render(<ServerBackedSelection freshValueIdentity />);
		const input = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		expect(input).toHaveValue("Insurer DE");

		await openAndPutCaretAtEnd(input);
		await userEvent.keyboard("{Backspace}");

		expect(input).toHaveValue("Insurer D");
	});

	test("the same holds when the caller does not put the selection back into the candidates", async () => {
		const { container } = render(<ServerBackedSelection freshValueIdentity reAddSelected={false} />);
		const input = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		await openAndPutCaretAtEnd(input);
		await userEvent.keyboard("{Backspace}");

		expect(input).toHaveValue("Insurer D");
	});

	test("a stable `value` keeps working while searching asynchronously", async () => {
		const { container } = render(<ServerBackedSelection />);
		const input = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		await openAndPutCaretAtEnd(input);
		await userEvent.keyboard("{Backspace}{Backspace}");

		expect(input).toHaveValue("Insurer ");
	});
});
