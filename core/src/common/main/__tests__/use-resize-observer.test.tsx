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

import { waitFor } from "@testing-library/react";
import { useRef, useState } from "react";
import { render } from "test-utils";
import { describe, expect, test, vi } from "vitest";

import type { ResizePayload, UseResizeObserverOptions } from "../resize-observer/resize-observer.api.js";
import { useResizeObserver } from "../resize-observer/use-resize-observer.js";

function CallbackRefProbe(props: {
	options?: UseResizeObserverOptions<HTMLDivElement>;
	boxWidth: number;
	boxHeight?: number;
	showBox?: boolean;
}) {
	const { options, boxWidth, boxHeight = 20, showBox = true } = props;
	const { ref, width, height } = useResizeObserver<HTMLDivElement>(options);

	return (
		<div>
			{showBox && <div ref={ref} style={{ width: boxWidth, height: boxHeight }} data-testid="box" />}
			<output data-testid="size">{`${width ?? "-"}x${height ?? "-"}`}</output>
		</div>
	);
}

function TargetRefProbe(props: { onResize: (payload: ResizePayload) => void }) {
	const targetRef = useRef<HTMLDivElement>(null);
	const [boxWidth, setBoxWidth] = useState(50);

	useResizeObserver<HTMLDivElement>({ targetRef, onResize: props.onResize });

	return (
		<div>
			<div ref={targetRef} style={{ width: boxWidth, height: 20 }} />
			<button onClick={() => setBoxWidth(120)}>grow</button>
		</div>
	);
}

describe("useResizeObserver", () => {
	test("reports the observed element's dimensions via the returned ref", async () => {
		const onResize = vi.fn();
		const { getByTestId } = render(<CallbackRefProbe options={{ onResize }} boxWidth={50} boxHeight={20} />);

		await waitFor(() => expect(getByTestId("size")).toHaveTextContent("50x20"));
		expect(onResize).toHaveBeenCalledWith(expect.objectContaining({ width: 50, height: 20, entry: expect.anything() }));
	});

	test("reports changes when the element resizes via targetRef", async () => {
		const onResize = vi.fn();
		const { getByRole } = render(<TargetRefProbe onResize={onResize} />);

		await waitFor(() => expect(onResize).toHaveBeenCalledWith(expect.objectContaining({ width: 50 })));

		getByRole("button", { name: "grow" }).click();

		await waitFor(() => expect(onResize).toHaveBeenCalledWith(expect.objectContaining({ width: 120 })));
	});

	test("does not notify when only a disabled dimension changes", async () => {
		const onResize = vi.fn();
		const { getByTestId, rerender } = render(
			<CallbackRefProbe options={{ onResize, handleHeight: false }} boxWidth={50} boxHeight={20} />
		);

		await waitFor(() => expect(onResize).toHaveBeenCalledTimes(1));

		rerender(<CallbackRefProbe options={{ onResize, handleHeight: false }} boxWidth={50} boxHeight={80} />);

		// Height changes are coalesced but never reported; give the deferred
		// notification a chance to (wrongly) fire before asserting.
		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(onResize).toHaveBeenCalledTimes(1);
		expect(getByTestId("size")).toMatchTextContent("50x");

		rerender(<CallbackRefProbe options={{ onResize, handleHeight: false }} boxWidth={90} boxHeight={80} />);

		await waitFor(() => expect(onResize).toHaveBeenCalledTimes(2));
		expect(onResize).toHaveBeenLastCalledWith(expect.objectContaining({ width: 90 }));
	});

	test("reports null dimensions when the observed element detaches", async () => {
		const onResize = vi.fn();
		const { rerender } = render(<CallbackRefProbe options={{ onResize }} boxWidth={50} />);

		await waitFor(() => expect(onResize).toHaveBeenCalledWith(expect.objectContaining({ width: 50 })));

		rerender(<CallbackRefProbe options={{ onResize }} boxWidth={50} showBox={false} />);

		await waitFor(() =>
			expect(onResize).toHaveBeenCalledWith(expect.objectContaining({ width: null, height: null, entry: null }))
		);
	});

	test("skipOnMount suppresses the initial notification but not later resizes", async () => {
		const onResize = vi.fn();
		const { rerender } = render(<CallbackRefProbe options={{ onResize, skipOnMount: true }} boxWidth={50} />);

		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(onResize).not.toHaveBeenCalled();

		rerender(<CallbackRefProbe options={{ onResize, skipOnMount: true }} boxWidth={90} />);

		await waitFor(() => expect(onResize).toHaveBeenCalledWith(expect.objectContaining({ width: 90 })));
	});
});
