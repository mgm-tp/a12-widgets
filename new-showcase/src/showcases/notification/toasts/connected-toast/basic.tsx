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
import { loremIpsum } from "lorem-ipsum";

import type { CommonToastProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { ConnectedToast, Radio, Button } from "@com.mgmtp.a12.widgets/widgets-core";
import { AnimationWrapper } from "@com.mgmtp.a12.widgets/widgets-utils/lib/animation-wrapper/index.js";

import { ConfigurationView } from "../../../../helpers/configuration-view.js";

const content = loremIpsum({
	units: "sentences",
	count: 3
});

const timeout = 5000000;

export function Basic(): ReactElement {
	const [show, setShow] = useState(false);
	const [variant, setVariant] = useState<CommonToastProps["variant"]>("info");
	const referenceElement = useRef<HTMLButtonElement | null>(null);

	const toggleShow = useCallback((): void => setShow((prevSate) => !prevSate), []);

	const changeVariant = (val: string): void => {
		setVariant(val as CommonToastProps["variant"]);
		setShow(false);
	};

	const setButtonRef = useCallback((ref: HTMLButtonElement | null): void => {
		referenceElement.current = ref;
	}, []);

	const onToastClose = useCallback((): void => setShow(false), []);

	return (
		// ConfigurationView is just a showcase utility. You can safely delete it.
		<ConfigurationView
			configuration={
				<div>
					<Radio inline label="Toast variant" onValueChanged={changeVariant} value={variant}>
						<Radio.Item label="Info" value="info" />
						<Radio.Item label="Success" value="success" />
						<Radio.Item label="Warning" value="warning" />
						<Radio.Item label="Error" value="error" />
					</Radio>
				</div>
			}
		>
			<Button primary label="Show/hide" buttonRef={setButtonRef} onClick={toggleShow} />
			{referenceElement.current && (
				<AnimationWrapper show={show}>
					<ConnectedToast
						referenceElement={referenceElement.current}
						message={content}
						duration={timeout}
						onClose={onToastClose}
						variant={variant}
					/>
				</AnimationWrapper>
			)}
		</ConfigurationView>
	);
}
