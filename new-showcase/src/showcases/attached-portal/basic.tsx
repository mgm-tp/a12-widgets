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

import type { FC, ChangeEvent, FocusEvent } from "react";
import { useState, useRef, useCallback, useMemo } from "react";
import { styled } from "styled-components";

import type { Orientation } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Button,
	AttachedPortal,
	Select,
	TextField,
	Radio,
	ActionContentbox,
	ContentBoxElements,
	ORIENTATION_LIST,
	IntersectionObserverHelper
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const StyledGivenPositionShowcase = styled.div`
	display: flex;
	gap: 12px;
`;

export const Basic: FC = () => {
	const [orientation, setOrientation] = useState("top");
	const [show, setShow] = useState(false);
	const [position, setPosition] = useState<{ top: number; left: number }>();
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const intersectionObserverRef = useRef<IntersectionObserverHelper>(new IntersectionObserverHelper());

	const getButtonRefElement = useCallback((ref: HTMLButtonElement | null) => {
		buttonRef.current = ref;
	}, []);

	const orientations = useMemo(() => ORIENTATION_LIST.map((value) => ({ label: value, value: value })), []);

	const onTopChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setPosition((prevState) => ({
			top: event.target.value ? Number(event.target.value) : 0,
			left: prevState?.left ?? 0
		}));
	}, []);

	const onTopBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
		if (!event.target.value) {
			setPosition((prevState) => ({
				top: 0,
				left: prevState?.left ?? 0
			}));
		}
	}, []);

	const onLeftChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setPosition((prevState) => ({
			left: event.target.value ? Number(event.target.value) : 0,
			top: prevState?.top ?? 0
		}));
	}, []);

	const onLeftBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
		if (!event.target.value) {
			setPosition((prevState) => ({
				top: prevState?.top ?? 0,
				left: 0
			}));
		}
	}, []);

	const onRadioChange = useCallback((value: string) => {
		setPosition(value === "Position" ? { top: 0, left: 0 } : undefined);
	}, []);

	// Example for using IntersectionObserverHelper
	const handleMouseOver = () => {
		if (buttonRef.current) {
			intersectionObserverRef.current.getVisibleElementRect(buttonRef.current);
		}
	};

	const handleMouseLeave = () => {
		intersectionObserverRef.current.disconnectObserver();
	};

	return (
		// ConfigurationView is just a showcase utility. You can safely delete it.
		<ConfigurationView
			configuration={
				<div>
					<Radio inline value={position ? "Position" : "Orientation"} onValueChanged={onRadioChange} id="radio-control">
						<Radio.Item label="Orientation" value="Orientation" />
						<Radio.Item label="Position" value="Position" />
					</Radio>
					<br />
					<Select
						label="Attached Portal Orientation"
						onValueChanged={setOrientation}
						value={orientation}
						items={orientations}
						id="attached-portal-orientation"
						disabled={Boolean(position)}
					/>
					<br />
					<StyledGivenPositionShowcase>
						<TextField
							id="top-position"
							value={position?.top.toString()}
							onChange={onTopChange}
							onBlur={onTopBlur}
							label="Top Position"
							placeholder="Top"
							disabled={!position}
						/>
						<TextField
							id="left-position"
							value={position?.left.toString()}
							onChange={onLeftChange}
							onBlur={onLeftBlur}
							label="Left Position"
							placeholder="Left"
							disabled={!position}
						/>
					</StyledGivenPositionShowcase>
				</div>
			}
		>
			<Button
				label="Show/hide"
				buttonRef={getButtonRefElement}
				onClick={() => setShow((prevState) => !prevState)}
				className="-u-margin-lg"
				onMouseOver={handleMouseOver}
				onMouseLeave={handleMouseLeave}
			/>
			{buttonRef.current && show && (
				<AttachedPortal
					closeOnOutsideClick={{ exception: [buttonRef.current] }}
					referenceElement={position ? undefined : buttonRef.current}
					referenceElementRect={intersectionObserverRef.current.visibleElementRect}
					onVisibilityChange={setShow}
					orientation={position ? undefined : (orientation as Orientation)}
					position={position}
				>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={2} key="title" text="Content box heading title" />}
						boxShadow="always"
					>
						{position ? (
							<p>
								The Portal is positioned according to the values of <strong>top({position.top})</strong>, and{" "}
								<strong>left({position.left})</strong> values.
							</p>
						) : (
							<p>
								The Portal is positioned according to the <strong>{orientation}</strong> position.
							</p>
						)}
					</ActionContentbox>
				</AttachedPortal>
			)}
		</ConfigurationView>
	);
};
