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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { css, styled } from "styled-components";

import {
	HeaderTrigger,
	List,
	type MenuItem,
	PopUpMenu,
	Button,
	FlyoutMenu,
	Icon,
	provider,
	SplitView
} from "@com.mgmtp.a12.widgets/widgets-core";

import { LazyMonacoEditor, useEditorBeforeMount } from "../helpers/lazy-editor.js";
import { ShowcaseLogo } from "../helpers/template/header.view.js";

import {
	DEFAULT_CODE,
	DEFAULT_PLAYGROUND_THEME,
	isPlaygroundTheme,
	PLAYGROUND_THEME_OPTIONS
} from "./playground-utils.js";
import { SandboxPreview } from "./sandbox-preview.js";
import { buildPlaygroundHref, compressCode, decompressCode, PLAYGROUND_QUERY_PARAMS } from "./share-code.js";
import Item = List.Item;

const StyledPlayground = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
`;

const StyledHeader = styled.div(({ theme }) => {
	const { colors, spacing } = theme;

	return css`
		align-items: center;
		background: ${colors.background.secondaryBackground};
		border-bottom: 1px solid #dbdfe8;
		display: flex;
		gap: ${spacing.spacing.spacingMd}px;
		padding: ${spacing.spacing.spacingSm}px ${spacing.spacing.spacingMd}px;
		flex-shrink: 0;
	`;
});

const StyledTitle = styled.span`
	font-size: 16px;
	font-weight: 600;
`;

const StyledHint = styled.span`
	color: #888;
	font-size: 13px;
	flex: 1;
`;

const StyledBody = styled.div`
	display: flex;
	flex: 1;
	min-height: 0;

	[data-role="resizable-handler"]::before {
		background-color: #dbdfe8;
	}
`;

const StyledMobileHeader = styled.div(({ theme }) => {
	const { spacing } = theme;

	return css`
		align-items: center;
		display: flex;
		gap: ${spacing.spacing.spacingSm}px;
		justify-content: space-between;
		padding-right: ${spacing.spacing.spacingSm}px;
		flex-shrink: 0;
	`;
});

const StyledMobileContent = styled.div`
	display: flex;
	flex: 1;
	min-height: 0;
`;

const StyledEditorPane = styled.div<{ $fullWidth?: boolean }>(
	({ $fullWidth }) => css`
		display: flex;
		flex-direction: column;
		height: 100%;
		min-width: 0;

		${
			$fullWidth &&
			css`
				flex: 1;
			`
		}
	`
);

const StyledPreviewPane = styled.div<{ $fullWidth?: boolean }>`
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: 0;
	${({ $fullWidth }) => $fullWidth && "flex: 1;"};
`;

type MobileTab = "code" | "preview";

function buildMobileMenuItems(activeTab: MobileTab, onSelect: (tab: MobileTab) => void): MenuItem[] {
	return [
		{
			label: "Code",
			icon: <Icon>code</Icon>,
			selected: activeTab === "code",
			onClick: () => onSelect("code")
		},
		{
			label: "Preview",
			icon: <Icon>visibility</Icon>,
			selected: activeTab === "preview",
			onClick: () => onSelect("preview")
		}
	];
}

export default function Playground(): ReactElement {
	const [searchParams, setSearchParams] = useSearchParams();
	// Seed once from a shared `?code=` param (a shareable link); fall back to the default example. The
	// lazy initializer reads `searchParams` a single time on mount — thereafter the editor owns the code.
	const [editableCode, setEditableCode] = useState(
		() => decompressCode(searchParams.get(PLAYGROUND_QUERY_PARAMS.code)) ?? DEFAULT_CODE
	);
	// `previewCode` lags `editableCode` by a debounce so the sandbox is not re-rendered on every keystroke.
	const [previewCode, setPreviewCode] = useState(editableCode);
	// The preview theme, likewise seeded once from `?theme=` (validated) and thereafter owned by the picker.
	const [themeName, setThemeName] = useState(() => {
		const seed = searchParams.get(PLAYGROUND_QUERY_PARAMS.theme);

		return isPlaygroundTheme(seed) ? seed : DEFAULT_PLAYGROUND_THEME;
	});
	const [mobileTab, setMobileTab] = useState<MobileTab>("code");
	const [copied, setCopied] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isMobile = useMemo(() => provider.isPhone(), []);
	const sourceName = searchParams.get(PLAYGROUND_QUERY_PARAMS.source) ?? undefined;
	const darkBackground = searchParams.get(PLAYGROUND_QUERY_PARAMS.darkBackground) === "true";

	useEffect(() => {
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}

			if (copiedTimerRef.current) {
				clearTimeout(copiedTimerRef.current);
			}
		};
	}, []);

	const handleCodeChange = useCallback(
		(value: string | undefined) => {
			const newCode = value ?? "";
			setEditableCode(newCode);
			setCopied(false);

			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}

			debounceRef.current = setTimeout(() => {
				setPreviewCode(newCode);
				// Keep the URL shareable as the user types. `replace` avoids flooding history; the default
				// example writes no param so a pristine playground keeps a clean URL.
				setSearchParams(
					(prev) => {
						const next = new URLSearchParams(prev);

						if (newCode === DEFAULT_CODE) {
							next.delete(PLAYGROUND_QUERY_PARAMS.code);
						} else {
							next.set(PLAYGROUND_QUERY_PARAMS.code, compressCode(newCode));
						}

						return next;
					},
					{ replace: true }
				);
			}, 300);
		},
		[setSearchParams]
	);

	const handleThemeChange = useCallback(
		(name: string) => {
			setThemeName(name);
			setCopied(false);
			// Persist the theme to the URL immediately (unlike code, there is nothing to debounce). The
			// default theme writes no param so a pristine playground keeps a clean URL.
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev);

					if (name === DEFAULT_PLAYGROUND_THEME) {
						next.delete(PLAYGROUND_QUERY_PARAMS.theme);
					} else {
						next.set(PLAYGROUND_QUERY_PARAMS.theme, name);
					}

					return next;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	const handleShare = useCallback(() => {
		// Build the link from the live editor content + theme (not location.href) so it is correct even
		// before the debounced URL sync has run.
		const shareUrl =
			window.location.href.split("#")[0] + buildPlaygroundHref(editableCode, themeName, sourceName, darkBackground);

		void navigator.clipboard.writeText(shareUrl).then(() => {
			setCopied(true);

			if (copiedTimerRef.current) {
				clearTimeout(copiedTimerRef.current);
			}

			copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
		});
	}, [editableCode, themeName, sourceName, darkBackground]);

	const backButton = (
		<ShowcaseLogo key="logo" className="logo logo--flat" href="#/" aria-label="logo" tabIndex={0}>
			<img src="images/Logo-A12-Widgets-Showcase.png" alt="A12 Widgets Showcase" />
		</ShowcaseLogo>
	);

	const [isPopupButtonActive, setPopupButtonActive] = useState(false);

	const themePicker = (
		<PopUpMenu
			key="version"
			headerTitle="Theme"
			triggerElement={<HeaderTrigger active={isPopupButtonActive} text="Theme Selector" meta="keyboard_arrow_down" />}
			triggerButtonTitle="Open theme menu"
			triggerButtonCloseTitle="Close theme menu"
			onVisibilityChange={setPopupButtonActive}
		>
			<List paddedRight>
				{PLAYGROUND_THEME_OPTIONS.map((option) => (
					<Item
						key={option.name}
						text={option.label}
						secondaryText={option.subLabel}
						meta={themeName === option.name && <Icon>check</Icon>}
						selected={themeName === option.name}
						onClick={() => handleThemeChange(option.name)}
					/>
				))}
			</List>
		</PopUpMenu>
	);

	const shareButton = (
		<Button
			secondary
			icon={<Icon>{copied ? "check" : "share"}</Icon>}
			label={copied ? "Copied!" : "Share"}
			onClick={handleShare}
			title="Copy a shareable link to this code"
		/>
	);

	const handleEditorBeforeMount = useEditorBeforeMount();

	const mobileMenuItems = useMemo(() => buildMobileMenuItems(mobileTab, setMobileTab), [mobileTab]);

	const editorContent = (
		<StyledEditorPane $fullWidth={isMobile}>
			<LazyMonacoEditor
				height="100%"
				defaultLanguage="typescript"
				// file:/// path so the TS worker resolves bare imports against the virtual node_modules
				// where the widgets-core types are mounted (see useEditorBeforeMount → addExtraLib).
				path="file:///playground.tsx"
				value={editableCode}
				onChange={handleCodeChange}
				beforeMount={handleEditorBeforeMount}
				theme="vs-dark"
				options={{
					minimap: { enabled: false },
					fontSize: 13,
					lineNumbers: "on",
					scrollBeyondLastLine: false,
					automaticLayout: true,
					tabSize: 2,
					padding: { top: 12 }
				}}
			/>
		</StyledEditorPane>
	);

	const previewContent = (
		<StyledPreviewPane $fullWidth={isMobile}>
			<SandboxPreview
				code={previewCode}
				themeName={themeName}
				sourceName={sourceName}
				darkBackground={darkBackground}
			/>
		</StyledPreviewPane>
	);

	return (
		<StyledPlayground>
			{isMobile ? (
				<>
					<StyledMobileHeader>
						{backButton}
						<FlyoutMenu id="playground-mobile-tabs" type="horizontal" items={mobileMenuItems} />
						{shareButton}
					</StyledMobileHeader>
					<StyledMobileContent>{mobileTab === "code" ? editorContent : previewContent}</StyledMobileContent>
				</>
			) : (
				<>
					<StyledHeader>
						{backButton}
						<StyledTitle>Playground</StyledTitle>
						<StyledHint>Write code with real imports — all registered modules are available</StyledHint>
						{themePicker}
						{shareButton}
					</StyledHeader>
					<StyledBody>
						<SplitView style={{ gap: 6 }}>
							<SplitView.Area resizableOptions={{ minWidth: 400, maxWidth: "80%" }}>{editorContent}</SplitView.Area>
							<SplitView.Area>{previewContent}</SplitView.Area>
						</SplitView>
					</StyledBody>
				</>
			)}
		</StyledPlayground>
	);
}
