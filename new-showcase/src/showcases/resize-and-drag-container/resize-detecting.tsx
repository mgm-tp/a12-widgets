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

import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core";
import { Table, Range, Icon, ResizeAndDragContainer, Button } from "@com.mgmtp.a12.widgets/widgets-core";

import type { UserCard } from "../../helpers/definitions.js";
import { createUserCard } from "../../helpers/faker.js";

type RowType = UserCard;
const columns: BaseColumnType<RowType>[] = [
	{ label: "Name", dataKey: "name" },
	{ label: "Email", dataKey: "email" },
	{ label: "Address", dataKey: "address.street" },
	{ label: "Phone", dataKey: "phone" },
	{ label: "Website", dataKey: "website" },
	{ label: "Company", dataKey: "company.name" }
];

function createTableData(): RowType[] {
	return Array.from(new Range(10)).map(() => createUserCard());
}

function ExampleTable(props: { cardView?: boolean }): ReactElement<{}> {
	return <Table<RowType> data={createTableData()} columns={columns} cardView={props.cardView} />;
}

export function ResizeDetectingShowcase() {
	const [show, setShow] = useState<boolean>(false);
	const [showCardView, setShowCardView] = useState<boolean>(false);
	const referenceElement = useRef<HTMLDivElement | null>(null);

	const toggleShow = useCallback(() => {
		setShow(!show);
	}, [show]);

	const onClose = useCallback(() => {
		setShow(false);
	}, []);

	const handleWrapperElement = useCallback((ref: HTMLElement | null) => {
		if (ref) {
			setShowCardView(ref.clientWidth <= 500);
		}
	}, []);

	const handleResize = useCallback((_: MouseEvent | TouchEvent, __: any, element: HTMLElement) => {
		setShowCardView(element.clientWidth <= 500);
	}, []);

	return (
		<>
			<div key="element" className="h_inlineBlock" ref={referenceElement}>
				<Button icon={<Icon>add</Icon>} title="Show Container" onClick={toggleShow} />
			</div>
			{show && referenceElement.current && (
				<ResizeAndDragContainer
					key="container"
					referenceElement={referenceElement.current}
					minHeight={300}
					minWidth={300}
					maxHeight={800}
					maxWidth={800}
					disableDragging
					closeOnOutsideClick
					onClose={onClose}
					onResize={handleResize}
					wrapperRef={handleWrapperElement}
				>
					<ExampleTable cardView={showCardView} />
				</ResizeAndDragContainer>
			)}
		</>
	);
}
