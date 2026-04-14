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

import { Button, Callout, Icon, provider } from "@com.mgmtp.a12.widgets/widgets-core";

import { Text } from "../../helpers/text-generator.js";

export function BasicCallout(): ReactElement {
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
					id="basic-callout"
					referenceElement={referenceElement.current}
					closeOnClickReferenceElement={false}
					closeOnOutsideClick={provider.isDesktop()}
					onClose={handleClose}
					header={{
						title: <p>Default Callout</p>,
						suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={handleClose} />
					}}
				>
					<span>{Text.PARAGRAPH}</span>
				</Callout>
			)}
		</>
	);
}
