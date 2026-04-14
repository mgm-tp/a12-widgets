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

import type { FC } from "react";
import { useState, useCallback } from "react";
import { loremIpsum } from "lorem-ipsum";

import { SplitView, ActionContentbox, ContentBoxElements, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const shortText = loremIpsum({ count: 1, units: "paragraphs" });
const longText = loremIpsum({ count: 2, units: "paragraphs" });

export const SplitViewShowcase: FC = () => {
	const [openRightArea, setOpenRightArea] = useState(true);
	const [width, setWidth] = useState<number | undefined>(undefined);

	const toggleLeftMenu = useCallback(() => {
		setOpenRightArea((prevState) => !prevState);
	}, []);

	const handleResizeStop = useCallback((event: Event, data: { width: number }) => {
		setWidth(data.width);
	}, []);

	return (
		<SplitView>
			<SplitView.Area
				width={width}
				resizableOptions={{ minWidth: 200, maxWidth: "70%", onResizeStop: handleResizeStop }}
			>
				<ActionContentbox
					headingElements={<ContentBoxElements.Title ariaLevel={2} text="Left Area" />}
					headingButtons={
						<ContentBoxElements.HeadingActionButton
							icon={<Icon>menu</Icon>}
							onClick={toggleLeftMenu}
							title="Toggle Area"
						/>
					}
				>
					{longText}
				</ActionContentbox>
			</SplitView.Area>
			{openRightArea && (
				<SplitView.Area>
					<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Right Area" />}>
						{shortText}
					</ActionContentbox>
				</SplitView.Area>
			)}
		</SplitView>
	);
};
