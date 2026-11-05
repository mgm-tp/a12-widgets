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

/**
 * Readout for the samples collected by `useDropdownPerfProbe`.
 * @module
 */

import type { ReactElement } from "react";

import type { PerfSample } from "./perf-probe.js";

// Default-exported so this module only exports components: `storybook/default-exports` demands a
// default export for everything under `storybook/`, while react-refresh rejects mixing a component
// export with a non-component one.
export default function PerfPanel({
	samples,
	onReset,
	title = "Time to painted dropdown"
}: {
	samples: PerfSample[];
	onReset: () => void;
	title?: string;
}): ReactElement {
	return (
		<div style={{ minWidth: 320, fontFamily: "monospace", fontSize: 12 }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
				<strong>{title}</strong>
				<button type="button" onClick={onReset}>
					clear
				</button>
			</div>
			{samples.length === 0 ? (
				<p>Open the dropdown, type, or press the arrow keys to record samples.</p>
			) : (
				<table>
					<thead>
						<tr>
							<th style={{ textAlign: "left", paddingRight: 16 }}>trigger</th>
							<th style={{ textAlign: "right", paddingRight: 16 }}>ms</th>
							<th style={{ textAlign: "right" }}>options</th>
						</tr>
					</thead>
					<tbody>
						{samples.map((sample) => (
							<tr key={sample.id}>
								<td style={{ paddingRight: 16 }}>{sample.trigger}</td>
								<td style={{ textAlign: "right", paddingRight: 16 }}>{sample.ms.toFixed(1)}</td>
								<td style={{ textAlign: "right" }}>{sample.options.toLocaleString("en-US")}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

PerfPanel.displayName = "PerfPanel";
