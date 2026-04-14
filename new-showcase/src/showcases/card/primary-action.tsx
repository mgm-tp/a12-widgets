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

import type { MouseEvent, ReactElement } from "react";
import { useCallback } from "react";

import { Button, Icon, ButtonGroup, Card, Link, ResponsiveImageContainer } from "@com.mgmtp.a12.widgets/widgets-core";

export function PrimaryActionCardShowcase(): ReactElement {
	const SAMPLE_LINK = "#/examples/gallery";

	const handleClick = useCallback((event: MouseEvent) => {
		event.stopPropagation();
		alert("You clicked on the action button");
	}, []);

	return (
		<Card style={{ width: 300, background: "#fff" }}>
			<Card.ActionArea
				onClick={(): void => {
					window.location.href = SAMPLE_LINK;
				}}
			>
				<Card.Media>
					<ResponsiveImageContainer src="images/DF757_01-001.png" alt="Kiwi" />
				</Card.Media>
				<Card.Content>
					<p>Lorem ipsum amet esse veniam dolore in elit id proident reprehenderit</p>
					<div className="-u-flex -u-justify-between -u-items-center -u-margin-t-sm -u-margin-b-sm">
						<ButtonGroup>
							<Button label="Action 1" secondary onClick={handleClick} />
							<Button label="Action 2" secondary onClick={handleClick} />
						</ButtonGroup>
						<ButtonGroup>
							<Button
								icon={
									<Icon iconTheme="filled" title="Favorite">
										favorite
									</Icon>
								}
								secondary
								title="Favorite"
							/>

							<Link href={SAMPLE_LINK} title="Share">
								<Icon size="big" iconTheme="filled" title="Share">
									share
								</Icon>
							</Link>
						</ButtonGroup>
					</div>
				</Card.Content>
			</Card.ActionArea>
		</Card>
	);
}
