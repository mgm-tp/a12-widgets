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

import type { KeyboardEvent, ReactNode, ReactElement } from "react";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { AttachedPortal } from "../../src/attached-portal/main/attached-portal.view.js";
import { Button } from "../../src/button/main/button.view.js";
import { ActionContentbox } from "../../src/contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../src/contentbox/main/template/contentbox.tpl.view.js";
import { InteractionHintConfigProvider } from "../../src/interaction-hint/main/interaction-hint-context.js";

export const ExampleAttachedPortal = ({
	hideOnReferenceElementPositionChange,
	hasReferenceElement,
	position,
	hasSubPortal,
	title,
	hasPortal = true
}: {
	hideOnReferenceElementPositionChange?: boolean;
	hasReferenceElement?: boolean;
	position?: {
		top: number;
		left: number;
	};
	hasSubPortal?: boolean;
	title?: string;
	hasPortal?: boolean;
}): ReactNode => {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [show, setShow] = useState(false);
	const [addNewElement, setAddNewElement] = useState(false);
	const [openSubPortal, setOpenSubPortal] = useState(false);
	const buttonSubPortalRef = useRef<HTMLButtonElement | null>(null);

	const getSubButtonRef = (ref: HTMLButtonElement): void => {
		buttonSubPortalRef.current = ref;
	};

	const getButtonRef = (ref: HTMLButtonElement): void => {
		buttonRef.current = ref;
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
		if (event.key === "Enter" && buttonRef.current) {
			buttonRef.current.style.position = "absolute";
			buttonRef.current.style.top = "200px";
			buttonRef.current.style.left = "200px";
		}
	};

	return (
		<InteractionHintConfigProvider enableInteractionHint>
			<Button dataRole="trigger-change-position" onClick={() => setAddNewElement((prevState) => !prevState)}>
				Change Position
			</Button>
			{addNewElement && <div style={{ height: "100px", width: "100px", backgroundColor: "pink" }} />}
			<Button
				buttonRef={getButtonRef}
				dataRole="trigger-button"
				title={title}
				onClick={() => setShow((prevState) => !prevState)}
				onKeyDown={handleKeyDown}
			>
				Trigger Button
			</Button>
			{buttonRef.current && show && hasPortal && (
				<AttachedPortal
					hideOnReferenceElementPositionChange={hideOnReferenceElementPositionChange}
					onVisibilityChange={setShow}
					referenceElement={hasReferenceElement ? buttonRef.current : undefined}
					position={position}
				>
					<div
						style={{
							height: "500px",
							width: "500px",
							backgroundColor: "green"
						}}
						data-role="portal-element"
					/>
					{hasSubPortal && !openSubPortal && (
						<Button
							dataRole="sub-menu-button"
							buttonRef={getSubButtonRef}
							onClick={() => setOpenSubPortal((prevState) => !prevState)}
						>
							Open sub portal
						</Button>
					)}
				</AttachedPortal>
			)}
			{hasSubPortal && buttonSubPortalRef.current && openSubPortal && (
				<AttachedPortal onVisibilityChange={setShow} position={{ top: 0, left: 0 }}>
					<div
						style={{
							height: "300px",
							width: "300px",
							backgroundColor: "pink"
						}}
					/>
				</AttachedPortal>
			)}
		</InteractionHintConfigProvider>
	);
};

function AppInIframe() {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [show, setShow] = useState(false);

	return (
		<div style={{ height: "90vh", position: "absolute" }}>
			<Button
				label="Show/hide Attached Portal"
				buttonRef={(ref) => {
					buttonRef.current = ref;
				}}
				onClick={() => setShow((prevState) => !prevState)}
				className="-u-margin-lg"
			/>
			{buttonRef.current && show && (
				<AttachedPortal closeOnOutsideClick referenceElement={buttonRef.current} onVisibilityChange={setShow}>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={2} key="title" text="Content box heading title" />}
						boxShadow="always"
						style={{ background: "red" }}
					>
						<p>The Portal is positioned according to the position.</p>
					</ActionContentbox>
				</AttachedPortal>
			)}
		</div>
	);
}

export function IFrameExample(): ReactElement {
	const [isIframeLoaded, setIframeLoaded] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		if (iframeRef.current) {
			iframeRef.current.style.height = "1000px"; // Set the desired height,
			iframeRef.current.style.width = "1000px"; // Set the desired height,
			iframeRef.current.style.padding = "10px 0 0 10px"; // Set the desired height,
			iframeRef.current.style.border = "1px solid black"; // Set the desired height,
		}
	}, [isIframeLoaded]);

	return (
		<iframe title="Parent Iframe" ref={iframeRef} src="iframe.html" onLoad={() => setIframeLoaded(true)}>
			{isIframeLoaded &&
				iframeRef.current &&
				createPortal(<AppInIframe />, iframeRef.current!.contentWindow!.document.body)}
		</iframe>
	);
}
