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

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Tooltip, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const createIframeDocument = (level: string): string =>
	`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Tooltip Storybook IFrame Shell ${level}</title><style>html,body{margin:0;min-height:100%;}</style></head><body></body></html>`;

const meta: Meta<typeof Tooltip> = {
	title: "Data Display/Tooltip/Advanced",
	component: Tooltip,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

function useIframeBody(iframeRef: RefObject<HTMLIFrameElement | null>, iframeLevel: string): HTMLElement | null {
	const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);

	useEffect(() => {
		const currentIframe = iframeRef.current;
		let animationFrameId: number | undefined;
		let timeoutId: number | undefined;
		const iframeSrc = URL.createObjectURL(new Blob([createIframeDocument(iframeLevel)], { type: "text/html" }));

		if (!currentIframe) {
			return;
		}

		const iframe = currentIframe;

		setIframeBody(null);

		function syncIframeBody() {
			const body = iframe.contentDocument?.body;

			if (body) {
				setIframeBody(body);

				return true;
			}

			return false;
		}

		function scheduleSync() {
			if (syncIframeBody()) {
				return;
			}

			animationFrameId = window.requestAnimationFrame(() => {
				animationFrameId = undefined;

				if (syncIframeBody()) {
					return;
				}

				timeoutId = window.setTimeout(() => {
					timeoutId = undefined;
					syncIframeBody();
				}, 0);
			});
		}

		function onLoad() {
			scheduleSync();
		}

		iframe.addEventListener("load", onLoad);

		if (iframe.getAttribute("src") !== iframeSrc) {
			iframe.setAttribute("src", iframeSrc);
		}

		scheduleSync();

		return () => {
			iframe.removeEventListener("load", onLoad);

			if (animationFrameId !== undefined) {
				window.cancelAnimationFrame(animationFrameId);
			}

			if (timeoutId !== undefined) {
				window.clearTimeout(timeoutId);
			}

			if (iframeSrc) {
				URL.revokeObjectURL(iframeSrc);
			}
		};
	}, [iframeRef, iframeLevel]);

	return iframeBody;
}

function TooltipInIframe(): ReactElement {
	const title = "Tooltip";

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px" }}>
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				A short text:
				<Tooltip text="This is a short text">
					<Button
						icon={
							<Icon title={title} showTitleAsTooltip={false}>
								edit
							</Icon>
						}
					/>
				</Tooltip>
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				A long text:
				<Tooltip text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
					<Button
						icon={
							<Icon title={title} showTitleAsTooltip={false}>
								edit
							</Icon>
						}
					/>
				</Tooltip>
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				Disabled:
				<Tooltip disabled text="This is a short text">
					<Button
						disabled
						icon={
							<Icon title={title} showTitleAsTooltip={false}>
								edit
							</Icon>
						}
					/>
				</Tooltip>
			</div>
		</div>
	);
}

function MiddleIframeContent(): ReactElement {
	const innermostIframeRef = useRef<HTMLIFrameElement | null>(null);
	const innermostIframeBody = useIframeBody(innermostIframeRef, "inner");

	return (
		<div>
			<div
				style={{
					height: "40px",
					background: "#e8f0fa",
					display: "flex",
					alignItems: "center",
					padding: "0 16px",
					marginBottom: "8px"
				}}
			>
				Content inside middle iframe (adds third-level offset)
			</div>
			<iframe
				ref={innermostIframeRef}
				title="Tooltip in innermost iframe"
				style={{ width: "100%", height: "150px", border: "1px dashed #8888aa" }}
			/>
			{innermostIframeBody && createPortal(<TooltipInIframe />, innermostIframeBody)}
		</div>
	);
}

function OuterIframeContent(): ReactElement {
	const middleIframeRef = useRef<HTMLIFrameElement | null>(null);
	const middleIframeBody = useIframeBody(middleIframeRef, "middle");

	return (
		<div>
			<div
				style={{
					height: "60px",
					background: "#e8f4e8",
					display: "flex",
					alignItems: "center",
					padding: "0 16px",
					marginBottom: "8px"
				}}
			>
				Content inside outer iframe (adds second-level offset)
			</div>
			<iframe
				ref={middleIframeRef}
				title="Tooltip in middle iframe"
				style={{ width: "100%", height: "250px", border: "1px dashed #88aa88" }}
			/>
			{middleIframeBody && createPortal(<MiddleIframeContent />, middleIframeBody)}
		</div>
	);
}

function TooltipInIframeShowcase(): ReactElement {
	const outerIframeRef = useRef<HTMLIFrameElement | null>(null);
	const outerIframeBody = useIframeBody(outerIframeRef, "outer");

	return (
		<div>
			<p style={{ margin: "0 0 8px" }}>
				The tooltip is rendered inside a <strong>nested</strong> <code>&lt;iframe&gt;</code> (3 levels deep). The outer
				iframe is positioned below some page content. Hover over the button to verify the tooltip text appears at the
				correct position.
			</p>
			<div
				style={{
					height: "120px",
					background: "#f5f5f5",
					display: "flex",
					alignItems: "center",
					padding: "0 16px",
					marginBottom: "8px"
				}}
			>
				Content above the outer iframe (creates first-level vertical offset)
			</div>
			<iframe
				ref={outerIframeRef}
				title="Outer iframe"
				style={{ width: "100%", height: "300px", border: "1px dashed #aaa" }}
			/>
			{outerIframeBody && createPortal(<OuterIframeContent />, outerIframeBody)}
		</div>
	);
}

export const InNestedIframe: Story = {
	name: "Tooltip in Nested IFrame",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				story:
					"When a tooltip is triggered inside an `<iframe>`, the portal that renders the tooltip text lives in the parent document. The reference element's `getBoundingClientRect()` returns iframe-relative coordinates, while the portal-placeholder offset is in parent-document coordinates. Without accounting for the iframe's position, the calculated `top` becomes negative and the tooltip is hidden above the viewport."
			}
		}
	},
	render: () => <TooltipInIframeShowcase />
};
