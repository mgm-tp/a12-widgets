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
import { render } from "test-utils";
import { describe, test, expect } from "vitest";

import type { MessagePosition, TooltipLineBreak } from "../../base/template/base.tpl.api.js";
import { FieldDefaultConfigProvider, useFieldDefaultConfig, useFieldDefaultsConfig } from "../main/index.js";

/**
 * Renders the resolved positions as text so the assertions read the exact values the widgets would use.
 */
function Probe(props: {
	messagePosition?: MessagePosition;
	breakTooltipsToNewLine?: TooltipLineBreak;
	tooltipFallback?: TooltipLineBreak;
}): ReactElement {
	const { tooltipFallback = false, ...ownProps } = props;
	const resolved = useFieldDefaultsConfig(ownProps, tooltipFallback);

	return <span data-role="probe">{`${resolved.messagePosition}|${String(resolved.breakTooltipsToNewLine)}`}</span>;
}

function resolvedText(container: HTMLElement): string {
	return container.querySelector('[data-role="probe"]')?.textContent ?? "";
}

describe("com.mgmtp.a12.widgets.field-default-config", () => {
	describe("without a provider", () => {
		test("falls back to the widget's own defaults", () => {
			const { container } = render(<Probe tooltipFallback="above" />);

			expect(resolvedText(container)).toBe("above|above");
		});

		test("keeps an inline tooltip fallback inline", () => {
			const { container } = render(<Probe tooltipFallback={false} />);

			expect(resolvedText(container)).toBe("above|false");
		});

		test("uses the explicit props when they are set", () => {
			const { container } = render(
				<Probe messagePosition="below" breakTooltipsToNewLine="below" tooltipFallback="above" />
			);

			expect(resolvedText(container)).toBe("below|below");
		});
	});

	describe("with a provider", () => {
		test("applies the configured message position", () => {
			const { container } = render(
				<FieldDefaultConfigProvider messagePosition="below">
					<Probe tooltipFallback="above" />
				</FieldDefaultConfigProvider>
			);

			expect(resolvedText(container)).toBe("below|above");
		});

		test("overrides the widget's own tooltip default", () => {
			const { container } = render(
				<FieldDefaultConfigProvider tooltipPosition="below">
					<Probe tooltipFallback="above" />
				</FieldDefaultConfigProvider>
			);

			expect(resolvedText(container)).toBe("above|below");
		});

		test("maps the beside tooltip position to the inline layout", () => {
			const { container } = render(
				<FieldDefaultConfigProvider tooltipPosition="beside">
					<Probe tooltipFallback="above" />
				</FieldDefaultConfigProvider>
			);

			expect(resolvedText(container)).toBe("above|false");
		});

		test("lets an explicit prop win over the provider", () => {
			const { container } = render(
				<FieldDefaultConfigProvider messagePosition="below" tooltipPosition="below">
					<Probe messagePosition="above" breakTooltipsToNewLine="above" tooltipFallback={false} />
				</FieldDefaultConfigProvider>
			);

			expect(resolvedText(container)).toBe("above|above");
		});

		test("leaves unset options on the widget's own default", () => {
			const { container } = render(
				<FieldDefaultConfigProvider messagePosition="below">
					<Probe tooltipFallback={false} />
				</FieldDefaultConfigProvider>
			);

			expect(resolvedText(container)).toBe("below|false");
		});
	});

	describe("nested providers", () => {
		test("inherits options the inner provider does not set", () => {
			const { container } = render(
				<FieldDefaultConfigProvider tooltipPosition="below">
					<FieldDefaultConfigProvider messagePosition="below">
						<Probe tooltipFallback="above" />
					</FieldDefaultConfigProvider>
				</FieldDefaultConfigProvider>
			);

			expect(resolvedText(container)).toBe("below|below");
		});

		test("lets the inner provider override the outer one", () => {
			const { container } = render(
				<FieldDefaultConfigProvider messagePosition="below" tooltipPosition="below">
					<FieldDefaultConfigProvider tooltipPosition="above">
						<Probe tooltipFallback={false} />
					</FieldDefaultConfigProvider>
				</FieldDefaultConfigProvider>
			);

			expect(resolvedText(container)).toBe("below|above");
		});
	});

	describe("useFieldDefaultConfig", () => {
		test("returns an empty configuration when no provider is mounted", () => {
			let config: unknown;

			function ConfigProbe(): ReactElement {
				config = useFieldDefaultConfig();

				return <span />;
			}

			render(<ConfigProbe />);

			expect(config).toEqual({});
		});

		test("returns the merged configuration of the nested providers", () => {
			let config: unknown;

			function ConfigProbe(): ReactElement {
				config = useFieldDefaultConfig();

				return <span />;
			}

			render(
				<FieldDefaultConfigProvider tooltipPosition="below">
					<FieldDefaultConfigProvider messagePosition="below">
						<ConfigProbe />
					</FieldDefaultConfigProvider>
				</FieldDefaultConfigProvider>
			);

			expect(config).toEqual({ messagePosition: "below", tooltipPosition: "below" });
		});
	});
});
