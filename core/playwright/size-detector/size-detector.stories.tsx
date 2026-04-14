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

import { useRef, useState } from "react";

import { useElementSizeDetector, useWindowSize } from "../../src/layout/size-detector/main/size-detector.view.js";
import { SizeDetectorUtils } from "../../src/layout/size-detector/main/size-detector.utils.js";

export const ExampleSizeDetect1 = () => {
	const { breakPoint } = useWindowSize();

	return <div id="test-id">{breakPoint.size}</div>;
};

export const ExampleSizeDetect2 = () => {
	const resizeRef = useRef<HTMLDivElement | null>(null);

	const { breakPoint } = useElementSizeDetector({
		targetRef: resizeRef
	});

	return (
		<div id="test-id" ref={resizeRef}>
			{breakPoint.size}
		</div>
	);
};

export const ExampleSizeDetect3 = () => {
	const resizeRef = useRef<HTMLDivElement | null>(null);
	const [breakPoints, setBreakPoints] = useState(SizeDetectorUtils.DefaultBreakPoints);
	const { breakPoint } = useElementSizeDetector({
		targetRef: resizeRef,
		breakPoints: breakPoints
	});

	return (
		<>
			<div id="test-div" ref={resizeRef}>
				{breakPoint.size}
			</div>
			<button
				id="test-button"
				onClick={() =>
					setBreakPoints([
						{
							width: 320,
							size: "xs"
						},
						{
							width: 640,
							size: "sm"
						},
						{
							width: 1024,
							size: "md"
						},
						{
							width: Number.POSITIVE_INFINITY,
							size: "lg"
						}
					])
				}
			></button>
		</>
	);
};
