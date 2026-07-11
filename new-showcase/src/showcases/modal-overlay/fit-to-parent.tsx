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
import { useCallback, useRef, useState } from "react";
import { loremIpsum } from "lorem-ipsum";

import {
	ButtonGroup,
	ModalOverlay,
	Button,
	ContentBoxElements,
	ActionContentbox,
	provider
} from "@com.mgmtp.a12.widgets/widgets-core";

const isPhone = provider.isPhone();
const longText = loremIpsum({ units: "sentences", count: isPhone ? 20 : 50 });

const shortText = loremIpsum({ units: "sentences", count: 10 });

export function FitToParent(): ReactElement {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
	const showModalButtonRef = useRef<HTMLButtonElement | null>(null);
	const handleShowModalButtonRef = useCallback((ref: HTMLButtonElement | null) => {
		showModalButtonRef.current = ref;
	}, []);

	const showModal = (): void => {
		setOpenModal(true);
	};

	const closeModal = (): void => {
		setOpenModal(false);
	};

	const showConfirmation = (): void => {
		setOpenConfirmation(true);
	};

	const closeConfirmation = (): void => {
		setOpenConfirmation(false);
	};

	const closeAll = (): void => {
		showModalButtonRef.current?.focus();
		setOpenConfirmation(false);
		setOpenModal(false);
	};

	return (
		<div className="-u-width-full">
			<ActionContentbox
				headingElements={<ContentBoxElements.Title key="title" text="Content Box" />}
				style={{ maxHeight: 450 }}
			>
				<Button
					className="-u-margin-t-sm"
					label="Show Modal"
					primary
					onClick={showModal}
					buttonRef={handleShowModalButtonRef}
				/>
				<p>{longText}</p>
				{openModal && (
					<ModalOverlay closeOnOutsideClick fitToParent onClose={closeModal}>
						<ActionContentbox
							headingElements={<ContentBoxElements.Title ariaLevel={1} text="Modal" />}
							footer={
								<ContentBoxElements.Footer>
									<ButtonGroup alignment="right">
										<Button label="Cancel" destructive onClick={showConfirmation} />
										<Button primary label="Save" onClick={closeModal} />
									</ButtonGroup>
								</ContentBoxElements.Footer>
							}
						>
							<p>{shortText}</p>
						</ActionContentbox>
					</ModalOverlay>
				)}
				{openConfirmation && (
					<ModalOverlay onClose={closeConfirmation} closeOnOutsideClick fitToParent>
						<ActionContentbox
							headingElements={<ContentBoxElements.Title ariaLevel={1} text="Confirmation" />}
							footer={
								<ContentBoxElements.Footer>
									<ButtonGroup alignment="right">
										<Button label="No" destructive onClick={closeConfirmation} />
										<Button primary label="Yes" onClick={closeAll} />
									</ButtonGroup>
								</ContentBoxElements.Footer>
							}
						>
							<p>irure quis fugiat excepteur laborum</p>
						</ActionContentbox>
					</ModalOverlay>
				)}
			</ActionContentbox>
		</div>
	);
}
