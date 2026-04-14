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

import type { FC, ChangeEvent } from "react";
import { useState } from "react";
import { loremIpsum } from "lorem-ipsum";

import { ModalOverlay, Button, ContentBoxElements, ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";
import { ShowcaseSlider } from "../../helpers/showcase-slider.js";

export const MaxWidthModalExample: FC = () => {
	const [isOpen, setOpen] = useState(false);
	const [width, setWidth] = useState(720);

	const handleWidth = (event: ChangeEvent<HTMLInputElement>): void => {
		setWidth((1200 * parseFloat(event.target.value)) / 100);
	};

	const showModal = (): void => {
		setOpen(true);
	};

	const closeModal = (): void => {
		setOpen(false);
	};

	return (
		<ConfigurationView
			configuration={
				<div className="-u-width-full -u-flex -u-justify-center">
					<ShowcaseSlider
						label={`Max width: ${width}px`}
						range={{ min: 20, step: 10 }}
						defaultValue={60}
						onChange={handleWidth}
					/>
				</div>
			}
		>
			<Button label="Show Modal" primary onClick={showModal} />
			{isOpen && (
				<ModalOverlay maxWidth={width} onClose={closeModal}>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={1} text="Simple Modal" />}
						headingButtons={<ContentBoxElements.CloseButton onClick={closeModal} />}
						style={{ maxHeight: "500px" }}
					>
						<p>{loremIpsum({ units: "sentences", count: 100 })}</p>
					</ActionContentbox>
				</ModalOverlay>
			)}
		</ConfigurationView>
	);
};
