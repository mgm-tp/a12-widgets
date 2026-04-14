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
import { useRef, useState, useCallback } from "react";

import {
	Button,
	ButtonGroup,
	Callout,
	noop,
	Icon,
	TextField,
	ButtonGroupContainer,
	LayoutGrid
} from "@com.mgmtp.a12.widgets/widgets-core";

const { Grid, Row, Column } = LayoutGrid;

export function ResizableAndDraggableCallout(): ReactElement {
	const referenceElement = useRef<HTMLButtonElement | null>(null);
	const [show, setShow] = useState(false);

	const handleClose = useCallback(() => setShow(false), []);

	const showContainer = useCallback(() => setShow(!show), [show]);

	const handleReferenceElement = useCallback((ref: HTMLButtonElement | null) => {
		referenceElement.current = ref;
	}, []);

	return (
		<>
			<Button buttonRef={handleReferenceElement} onClick={showContainer} label="Show Callout" />
			{show && referenceElement.current && (
				<Callout
					id="resizable-draggable-callout"
					referenceElement={referenceElement.current}
					closeOnClickReferenceElement={false}
					onClose={handleClose}
					header={{
						title: <p>Resizable and Draggable Callout</p>,
						suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={handleClose} />
					}}
					footer={
						<ButtonGroupContainer>
							<ButtonGroup alignment="right">
								<Button label="Cancel" destructive />
								<Button label="Send" primary />
							</ButtonGroup>
						</ButtonGroupContainer>
					}
					resizeAndDragOptions={{
						referenceElement: referenceElement.current,
						minWidth: 320,
						minHeight: 280
					}}
				>
					<Grid className="form__section">
						<Row>
							<Column size={{ sm: 6, md: 6, lg: 6 }}>
								<TextField label="Title" onChange={noop} />
							</Column>
							<Column size={{ sm: 6, md: 6, lg: 6 }}>
								<TextField label="Sub Title" onChange={noop} />
							</Column>
							<Column size={{ sm: 12, md: 12, lg: 12 }}>
								<TextField label="Description" onChange={noop} />
							</Column>
						</Row>
					</Grid>
				</Callout>
			)}
		</>
	);
}
