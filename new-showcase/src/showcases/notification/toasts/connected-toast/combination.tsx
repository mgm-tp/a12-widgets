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

import type { ConnectedToastType, Orientation } from "@com.mgmtp.a12.widgets/widgets-core";
import { ConnectedToast, ORIENTATION_LIST, Radio, Select, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { AnimationWrapper } from "@com.mgmtp.a12.widgets/widgets-utils/lib/animation-wrapper/index.js";

import { ConfigurationView } from "../../../../helpers/configuration-view.js";

const message = loremIpsum({
	units: "words",
	count: 30
});

export interface CombineShowcaseState {
	show?: boolean;
	variant?: string;
	duration?: string;
	type?: ConnectedToastType;
	orientation: string;
	longText: boolean;
}

const orientations = ORIENTATION_LIST.map((orientation) => ({ label: orientation, value: orientation }));
const customIcon = <Icon>history</Icon>;

export function Combination(): ReactElement {
	const [show, setShow] = useState(false);
	const [orientation, setOrientation] = useState<Orientation>("top");
	const [type, setType] = useState<ConnectedToastType>("temporary");
	const [duration, setDuration] = useState<string>("300000");
	const referenceElement = useRef<HTMLButtonElement | null>(null);

	const setButtonRef = useCallback((ref: HTMLButtonElement | null): void => {
		referenceElement.current = ref;
	}, []);

	const toggleShow = useCallback((): void => setShow(!show), [show]);

	const onToastClose = useCallback((): void => setShow(false), []);

	const changeOrientation = useCallback((val: string): void => {
		setOrientation(val as Orientation);
		setShow(false);
	}, []);

	const changeDuration = useCallback((val: string): void => {
		setDuration(val);
		setShow(false);
	}, []);

	const changeType = useCallback((val: string): void => {
		setType(val as ConnectedToastType);
		setShow(false);
	}, []);

	return (
		// ConfigurationView is just a showcase utility. You can safely delete it.
		<ConfigurationView
			configuration={
				<div>
					<Select
						label="Toast orientation"
						onValueChanged={changeOrientation}
						value={orientation}
						items={orientations}
					/>
					<br />
					<Radio inline label="Toast type:" value={type} onValueChanged={changeType}>
						<Radio.Item label="Permanent" value="permanent" />
						<Radio.Item label="Temporary" value="temporary" />
					</Radio>
					<Radio
						inline
						label="Toast duration"
						onValueChanged={changeDuration}
						value={duration}
						style={{ marginTop: "20px" }}
						disabled={type === "permanent"}
					>
						<Radio.Item label="5 seconds" value="5000" />
						<Radio.Item label="10 seconds" value="10000" />
						<Radio.Item label="30 seconds" value="30000" />
						<Radio.Item label="5 minutes" value="300000" />
					</Radio>
				</div>
			}
		>
			<Button primary label="Show/hide" buttonRef={setButtonRef} onClick={toggleShow} />
			{referenceElement.current && (
				<AnimationWrapper show={show}>
					<ConnectedToast
						referenceElement={referenceElement.current}
						orientation={orientation}
						duration={Number(duration)}
						type={type}
						message={message}
						onClose={onToastClose}
						hideOnReferenceElementPositionChange={false}
						icon={customIcon}
					/>
				</AnimationWrapper>
			)}
		</ConfigurationView>
	);
}
