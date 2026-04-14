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
import { useState } from "react";

import { ModalOverlay } from "../../src/modal-overlay/main/modal-overlay.view.js";
import { Button } from "../../src/button/main/button.view.js";
import { ActionContentbox } from "../../src/contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../src/contentbox/main/template/contentbox.tpl.view.js";

interface ModalOverlayExampleProps {
	closeOnOutsideClick?: boolean;
	onCloseESC?: boolean;
	focusBack?: boolean;
}

export const ModalOverlayExample = ({
	closeOnOutsideClick,
	onCloseESC,
	focusBack
}: ModalOverlayExampleProps): ReactElement => {
	const [isOpen, setOpen] = useState<boolean>(false);

	const showModal = (): void => setOpen(true);
	const closeModal = (): void => setOpen(false);

	return (
		<div className="-u-width-full -u-flex -u-justify-center">
			<Button label="Show Modal" primary onClick={showModal} />
			{isOpen && (
				<ModalOverlay
					focusBack={focusBack}
					closeOnOutsideClick={closeOnOutsideClick}
					closeOnEsc={onCloseESC}
					onClose={closeModal}
				>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={1} text="Simple Modal" />}
						headingButtons={<ContentBoxElements.CloseButton onClick={closeModal} />}
					>
						<p>This is a modal</p>
					</ActionContentbox>
				</ModalOverlay>
			)}
		</div>
	);
};
