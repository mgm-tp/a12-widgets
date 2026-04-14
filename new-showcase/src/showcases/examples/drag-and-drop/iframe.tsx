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

import { useDrop, useDrag, DndContext } from "react-dnd";
import type { ReactElement, Ref } from "react";
import { useState, useEffect, useContext, createRef, useRef } from "react";
import { createPortal } from "react-dom";

import { provider } from "@com.mgmtp.a12.widgets/widgets-core";

import { StyledDnDContainerShowcase } from "./shared/dnd.styled.js";

const iframeRef = createRef<HTMLIFrameElement>();

function ADragSource(): ReactElement {
	const ref = useRef<HTMLDivElement>(null);

	const [_, drag] = useDrag<any, Ref<HTMLElement>, any>({
		type: "foo-type"
	});
	drag(ref);

	return <div ref={ref}>A Drag Source</div>;
}

function ADropTarget(): ReactElement {
	const ref = useRef<HTMLDivElement>(null);
	const [{ isOver }, drop] = useDrop({
		collect: (monitor) => ({ isOver: monitor.isOver() }),
		accept: "foo-type"
	});
	drop(ref);

	return (
		<div ref={ref} style={{ backgroundColor: isOver ? "green" : "" }}>
			A Drop Target
		</div>
	);
}

export function IFrameExample(): ReactElement {
	const [isIframeLoaded, setIframeLoaded] = useState(false);

	return !provider.hasTouch() ? (
		<StyledDnDContainerShowcase>
			<ADragSource />
			<ADropTarget />
			<iframe title="Example Dnd" ref={iframeRef} src="iframe.html" onLoad={() => setIframeLoaded(true)} />
			{isIframeLoaded &&
				iframeRef &&
				createPortal(
					<AppInIframe />,
					iframeRef.current!.contentWindow!.document.getElementById("topframe-root") as Element
				)}
		</StyledDnDContainerShowcase>
	) : (
		<></>
	);
}

function AppInIframe(): ReactElement {
	const { dragDropManager } = useContext(DndContext);

	useEffect(() => {
		const backend = dragDropManager?.getBackend();

		if (
			iframeRef.current &&
			backend &&
			"addEventListeners" in backend &&
			typeof backend.addEventListeners === "function"
		) {
			backend.addEventListeners(iframeRef.current.contentWindow);
		}
	}, [dragDropManager]);

	return (
		<div>
			<ADragSource />
			<ADropTarget />
		</div>
	);
}
