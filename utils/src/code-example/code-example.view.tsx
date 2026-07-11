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

import type { CSSProperties, ReactElement } from "react";
import { useState, useRef, useCallback, useContext, useMemo } from "react";
import { styled } from "styled-components";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import dracula from "react-syntax-highlighter/dist/esm/styles/prism/dracula";

import { Icon, Button, Typography, FlyoutMenu, SizeContext, ConnectedToast } from "@com.mgmtp.a12.widgets/widgets-core";

import { AnimationWrapper } from "../animation-wrapper/animation-wrapper.view.js";

import type { SourceCode, CodeExampleProps, CodeModule } from "./code-example.api.js";

SyntaxHighlighter.registerLanguage("jsx", jsx);

export type SourceCodeSectionProps = Omit<CodeExampleProps, "className"> & {
	onToggle?: () => void;
	hasSkeletonCode?: boolean;
	isSkeletonMode?: boolean;
};

const StyledButton = styled(Button)`
	border-radius: 4px;
	position: absolute;
	top: 4px;
`;

const SkeletonButton = styled(StyledButton)`
	right: 44px;
`;

const CopyButton = styled(StyledButton)`
	right: 4px;
`;

export const SourceCodeSection = (props: SourceCodeSectionProps): ReactElement => {
	const [showCopyToast, setShowCopyToast] = useState(false);
	const [currentFileIndex, setCurrentFileIndex] = useState(0);
	const codes: (CodeModule | SourceCode)[] = Array.isArray(props.code) ? props.code : [props.code];

	const currentCode = codes[currentFileIndex];
	const codeToReplace: string =
		"default" in currentCode
			? currentCode.default
			: typeof currentCode.code === "string"
				? currentCode.code
				: currentCode.code.default;

	const codeContent = codeToReplace
		? codeToReplace.replace(/\/\*[\s\S]*?\*\/(?:[\t ]*(?:\r?\n|\r))+/g, "")
		: codeToReplace;

	const copyButtonRef = useRef<HTMLElement | null>(null);

	const getCopyButtonRef = (ref: HTMLElement | null): void => {
		copyButtonRef.current = ref;
	};

	const handleCopyCode = useCallback((codeContent: string) => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(codeContent).then(
				() => {
					setShowCopyToast(true);
				},
				() => {}
			);
		}
	}, []);

	const handleFileChange = useCallback(
		(newIndex: number) => {
			if (newIndex === currentFileIndex) {
				return;
			}

			setCurrentFileIndex(newIndex);
		},
		[currentFileIndex]
	);
	const lineNumberStyles: CSSProperties = useMemo(() => ({ WebkitUserSelect: "none" }), []);
	const codeTagProps = useMemo(
		() => ({
			style: {
				backgroundColor: "unset",
				fontSize: "14px",
				fontFamily: 'Menlo,Consolas,"Droid Sans Mono",monospace'
			}
		}),
		[]
	);

	return (
		<>
			{codes.length > 1 && (
				<FlyoutMenu
					type="horizontal"
					items={codes.map((code: SourceCode | CodeModule, index: number) => ({
						selected: index === currentFileIndex,
						label: "name" in code ? code.name : `file ${index + 1}`,
						onClick: () => handleFileChange(index)
					}))}
				/>
			)}
			<div style={{ position: "relative" }}>
				<SyntaxHighlighter
					language={props.language || "jsx"}
					style={dracula}
					showLineNumbers
					codeTagProps={codeTagProps}
					lineNumberStyle={lineNumberStyles}
					customStyle={props.style}
				>
					{codeContent}
				</SyntaxHighlighter>
				{props.hasSkeletonCode && (
					<SkeletonButton
						secondary
						icon={<Icon>{props.isSkeletonMode ? "expand_more" : "expand_less"}</Icon>}
						title={`${props.isSkeletonMode ? "Show full code" : "Show skeleton code"}`}
						onClick={props.onToggle}
					/>
				)}

				<CopyButton
					secondary
					icon={<Icon>content_copy</Icon>}
					title="Copy the source"
					onClick={() => handleCopyCode(codeContent)}
					buttonRef={getCopyButtonRef}
				/>
			</div>

			{copyButtonRef.current && showCopyToast && (
				<AnimationWrapper show={showCopyToast}>
					<ConnectedToast
						variant={navigator.clipboard ? "success" : "warning"}
						message={
							navigator.clipboard
								? "The source code has been copied."
								: "Sorry, copy only works under HTTPS, please switch protocol to use this function."
						}
						orientation="bottom-end"
						duration={3000}
						referenceElement={copyButtonRef.current}
						onClose={() => setShowCopyToast(false)}
					/>
				</AnimationWrapper>
			)}
		</>
	);
};

export const CodeExample = (props: CodeExampleProps) => {
	const context = useContext(SizeContext);
	const [showSourceCode, setShowSourceCode] = useState(false);

	if (context?.currentSize === "sm" || context?.currentSize === "xs") {
		return null;
	}

	return (
		<div style={props.style} className={props.className}>
			<Typography.Headline
				ariaLevel={5}
				level={5}
				collapsible
				collapsed={!showSourceCode}
				onCollapsingChange={(): void => setShowSourceCode((prevShowSourceCode) => !prevShowSourceCode)}
			>
				Show code
			</Typography.Headline>
			{showSourceCode && (
				<Typography.Body>
					<SourceCodeSection code={props.code} language={props.language} />
				</Typography.Body>
			)}
		</div>
	);
};
