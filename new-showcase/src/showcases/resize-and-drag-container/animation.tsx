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
import { useState, useRef, useCallback } from "react";

import { Button, Icon, ResizeAndDragContainer, ButtonGroup, List } from "@com.mgmtp.a12.widgets/widgets-core";

export function AnimationShowcase(): ReactElement {
	const [show, setShow] = useState<boolean>(false);
	const referenceElement = useRef<HTMLDivElement | null>(null);

	const toggleShow = useCallback(() => {
		setShow((prevState) => !prevState);
	}, []);

	const onClose = useCallback(() => {
		setShow(false);
	}, []);

	return (
		<>
			<div key="element" className="h_inlineBlock" ref={referenceElement}>
				<Button icon={<Icon>add</Icon>} title="Show Container" onClick={toggleShow} />
			</div>
			{referenceElement.current && (
				<ResizeAndDragContainer
					show={show}
					animation
					referenceElement={referenceElement.current}
					minHeight={200}
					minWidth={200}
					maxHeight={1000}
					maxWidth={1000}
					initialSize={{ width: 300, height: 400 }}
					onClose={onClose}
					closeOnOutsideClick
				>
					<InteractiveList />
				</ResizeAndDragContainer>
			)}
		</>
	);
}

function InteractiveList(): ReactElement {
	return (
		<List flipped border>
			<List.SubHeader fill>User Data</List.SubHeader>
			<List.Item readonly text="John Smith" secondaryText="Name" />
			<List.Item readonly text="123456" secondaryText="ID" />

			<List.SubHeader fill>Contact</List.SubHeader>
			<List.Item
				text="0123-456789"
				secondaryText="Phone"
				readonly
				meta={
					<ButtonGroup>
						<Button secondary icon={<Icon>add</Icon>} title="Add" />
						<Button secondary icon={<Icon>edit</Icon>} title="Edit" />
					</ButtonGroup>
				}
			/>
			<List.Item
				text="join.smith@cool.com"
				secondaryText="Email"
				readonly
				meta={
					<ButtonGroup>
						<Button secondary icon={<Icon>add</Icon>} title="Add" />
						<Button secondary icon={<Icon>edit</Icon>} title="Edit" />
					</ButtonGroup>
				}
			/>
			<List.Item readonly text={<Button primary>Make Appointment</Button>} />

			<List.SubHeader fill>Skills</List.SubHeader>
			<List.Item text="React" meta={<Icon size="big">keyboard_arrow_right</Icon>} />
			<List.Item text="Typescript" meta={<Icon size="big">keyboard_arrow_right</Icon>} />

			<List.SubHeader fill>Projects</List.SubHeader>
			<List.Item
				flipped={false}
				text={<div>A12 Widgets </div>}
				meta={
					<ButtonGroup>
						<Button secondary icon={<Icon>delete</Icon>} title="Delete" />
						<Button secondary icon={<Icon>edit</Icon>} title="Edit" />
					</ButtonGroup>
				}
			/>
			<List.Item
				flipped={false}
				text={<div>A12 Plasma </div>}
				meta={
					<ButtonGroup>
						<Button secondary icon={<Icon>delete</Icon>} title="Delete" />
						<Button secondary icon={<Icon>edit</Icon>} title="Edit" />
					</ButtonGroup>
				}
			/>
		</List>
	);
}
