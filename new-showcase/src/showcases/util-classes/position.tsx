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
import { useState, useCallback } from "react";

import { Select } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const positions = ["-u-static", "-u-fixed", "-u-absolute", "-u-relative"];

const offsets = ["-u-pin-none", "-u-pin", "-u-pin-y", "-u-pin-x", "-u-pin-t", "-u-pin-r", "-u-pin-b", "-u-pin-l"];
const baseBoxClassName = "-u-border-solid -u-width-1-6 -u-height-24 -u-margin-r-md";

export function PositionUtilClassShowcase(): ReactElement {
	const [position, setPosition] = useState(positions[0]);
	const [offset, setOffset] = useState(offsets[0]);

	const onChangePosition = useCallback((value: string) => {
		setPosition(value);
		setOffset(offsets[0]);
	}, []);

	return (
		<ConfigurationView
			configuration={
				<>
					<div>
						<Select
							className="-u-margin-r-md"
							label="Position"
							fitToParent={false}
							onValueChanged={onChangePosition}
							items={positions.map((item) => ({ label: item, value: item })) || []}
							value={position}
						/>
						<Select
							className="-u-margin-r-md"
							label="Offset"
							fitToParent={false}
							onValueChanged={setOffset}
							value={offset}
							items={offsets.map((item) => ({ label: item, value: item })) || []}
						/>
					</div>
					<p>
						<strong>Utility classes</strong>:&nbsp;
						<code>{position}</code>&nbsp;<code>{offset}</code>
					</p>
				</>
			}
		>
			<div className="-u-height-64 -u-width-full">
				<div className="-u-padding-sm -u-background-grey-light -u-height-full -u-flex -u-relative">
					<div className={`${baseBoxClassName} -u-border-grey-dark`}>Box 1</div>
					<div
						className={`${baseBoxClassName}  ${position} ${offset} -u-border-orange -u-background-orange-light`}
						style={{ zIndex: 1 }}
					>
						Box 2
					</div>
					<div className={`${baseBoxClassName} -u-border-grey-dark`}>Box 3</div>
				</div>
			</div>
		</ConfigurationView>
	);
}
