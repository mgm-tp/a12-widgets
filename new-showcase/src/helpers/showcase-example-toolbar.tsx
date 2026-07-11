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

import type { KeyboardEvent, ReactElement } from "react";
import { useContext, useState, useCallback, useMemo, useRef, createRef } from "react";
import { styled, css } from "styled-components";
import { Key } from "ts-key-enum";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { moveItemFocusBack, moveItemFocusNext, Button, ButtonGroup, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { SourceCode } from "@com.mgmtp.a12.widgets/widgets-utils";
import { SourceCodeSection } from "@com.mgmtp.a12.widgets/widgets-utils";

import { getCurrentTheme } from "./theme-selector.js";
import type { Section } from "./definitions.js";
import { ShowcaseExampleContext } from "./showcase-example-context.js";

declare const __A12_VERSION__: string;
const codeSectionClassName = "code-section";

const StyledShowcaseExampleToolbar = styled.div<{ $inFullLayoutMode?: boolean }>(({ theme, $inFullLayoutMode }) => {
	const { spacing, colors } = theme;

	return css`
		background: ${!$inFullLayoutMode && colors.background.secondaryBackground};
		border: 1px solid #dbdfe8;
		border-radius: 0 0 4px 4px;
		display: flex;
		padding: ${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px;
	`;
});

const StyledSourceCodeTransitionGroup = styled(TransitionGroup)<{ $multipleCode?: boolean }>(({
	$multipleCode,
	theme
}) => {
	return css`
		${$multipleCode &&
		css`
			padding-top: ${theme.spacing.verticalSpacing.vertWhiteSpacingxs}px;
		`}
		.${codeSectionClassName}-enter {
			max-height: 0;
			opacity: 0;
		}
		.${codeSectionClassName}-enter-active {
			max-height: 800px;
			opacity: 1;
			transition: all 400ms;
		}
		.${codeSectionClassName}-exit {
			max-height: 800px;
			opacity: 1;
		}
		.${codeSectionClassName}-exit-active {
			max-height: 0;
			opacity: 0;
			transition: all 400ms;
		}
	`;
});

export const ShowcaseExampleToolbar = (
	props: Pick<Section, "label" | "code" | "toggleBetweenPartialAndFullCode"> & {
		hideResetButton?: boolean;
		inFullLayoutMode?: boolean;
	}
): ReactElement => {
	const { setShouldContentWrapperFocusable, contentWrapperRef, generatedCodeSnippet } =
		useContext(ShowcaseExampleContext);
	const [showCode, setShowCode] = useState(false);
	const [isSkeletonMode, setIsSkeletonCodeMode] = useState(true);

	const removeSelectedLinesOfCode = useCallback(
		(code: SourceCode): SourceCode => {
			let codeAsLineArray: string[];

			if (typeof code.code === "string") {
				codeAsLineArray = code.code.split(/\r?\n/);
			} else {
				codeAsLineArray = code.code.default.split(/\r?\n/);
			}

			const resultAsLineArray = [];
			const tabSize = "    ";
			let shouldAddSelectedLine = true;
			let indentationAmountOfReturnLine;

			for (let i = 0; i < codeAsLineArray.length; i++) {
				if (codeAsLineArray[i].match(/\/\/\s*start\s+code\s+removal/)) {
					shouldAddSelectedLine = false;
					continue;
				} else if (codeAsLineArray[i].match(/\/\/\s*end\s+code\s+removal/)) {
					shouldAddSelectedLine = true;
					continue;
				}

				if (codeAsLineArray[i].match(/.*return\s*\(.*/) && shouldAddSelectedLine) {
					indentationAmountOfReturnLine = codeAsLineArray[i].match(/.*return\s*\(.*/)?.index;
					resultAsLineArray.push(codeAsLineArray[i]);
					shouldAddSelectedLine = false;
					continue;
				}

				if (codeAsLineArray[i].search(/.*\).*/) === indentationAmountOfReturnLine && shouldAddSelectedLine) {
					const generatedCodeSnippetArray = generatedCodeSnippet.split(/\r?\n/);
					const formattedGeneratedCode = generatedCodeSnippetArray
						.map((value) => tabSize.repeat(2) + value)
						.join("\r\n");
					resultAsLineArray.push(formattedGeneratedCode);
					shouldAddSelectedLine = true;
				}

				if (shouldAddSelectedLine) {
					resultAsLineArray.push(codeAsLineArray[i]);
				}
			}

			// the replacement removes all the text related to mgm copyright at the top of each file.
			return { code: resultAsLineArray.join("\r\n").replace(/\/\*[\s\S]*?\*\/(?:[\t ]*(?:\r?\n|\r))+/g, "") };
		},
		[generatedCodeSnippet]
	);

	const codeToShow = useMemo(() => {
		if (props.toggleBetweenPartialAndFullCode && generatedCodeSnippet) {
			if (!isSkeletonMode && props.code) {
				if (Array.isArray(props.code)) {
					return props.code.map((code) => removeSelectedLinesOfCode(code));
				}

				return removeSelectedLinesOfCode(props.code);
			}

			return { code: generatedCodeSnippet };
		}

		return props.code ? props.code : generatedCodeSnippet !== "" ? { code: generatedCodeSnippet } : undefined;
	}, [
		props.code,
		props.toggleBetweenPartialAndFullCode,
		generatedCodeSnippet,
		isSkeletonMode,
		removeSelectedLinesOfCode
	]);

	const [currentFocusedItemIndex, setCurrentFocusedItemIndex] = useState(0);

	const toolbarWrapperRef = useRef<HTMLDivElement | null>(null);
	const showCodeSectionWrapperRef = createRef<HTMLDivElement>();

	const getCurrentFocusedElementIndex = useCallback((): number => {
		const elements = toolbarWrapperRef.current?.querySelectorAll("[data-role=button]");

		if (!elements || elements.length === 0 || !document.activeElement) {
			return 0;
		}

		const toolbarItems = Array.from(elements);

		return toolbarItems.indexOf(document.activeElement as HTMLButtonElement);
	}, []);

	const handleToolbarWrapperRef = useCallback((ref: HTMLDivElement | null) => {
		toolbarWrapperRef.current = ref;
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent): void => {
			if (!toolbarWrapperRef.current?.contains(document.activeElement)) {
				return;
			}

			if (event.key === Key.ArrowLeft || event.key === Key.ArrowRight) {
				event.preventDefault();
				const moveFocus = event.key === Key.ArrowLeft ? moveItemFocusBack : moveItemFocusNext;
				moveFocus(toolbarWrapperRef.current, document.activeElement, "[tabindex]");
				setCurrentFocusedItemIndex(getCurrentFocusedElementIndex());
			}
		},
		[getCurrentFocusedElementIndex]
	);

	const handleShowCodeButtonClick = useCallback(() => setShowCode(!showCode), [showCode]);

	const handleReportBugButtonClick = useCallback(() => {
		const mailAddress = "a12-widgets-team@mgm-tp.com";
		const subject = `Bug report: ${props.label}`;
		const bugInfo = [
			`Version: ${__A12_VERSION__}`,
			`Theme: ${getCurrentTheme()}`,
			`Browser and device: ${window.navigator.userAgent}`,
			`Showcase link: ${window.location.href}`
		].join("%0D%0A- ");

		window.open(
			`mailto:${mailAddress}?subject=${subject}&body=Bug Info:%0D%0A- ${bugInfo}%0D%0A%0D%0AAdditional details:`
		);
	}, [props.label]);

	const handleResetFocusButtonClick = useCallback(() => {
		setShouldContentWrapperFocusable?.(true);
		setTimeout(() => contentWrapperRef?.current?.focus());
	}, [contentWrapperRef, setShouldContentWrapperFocusable]);

	const handleToggleCodeMode = useCallback(() => {
		setIsSkeletonCodeMode(!isSkeletonMode);
	}, [isSkeletonMode]);

	return (
		<>
			<StyledShowcaseExampleToolbar
				ref={handleToolbarWrapperRef}
				onKeyDown={handleKeyDown}
				$inFullLayoutMode={props.inFullLayoutMode}
			>
				<ButtonGroup alignment="right">
					{codeToShow && (
						<Button
							active={showCode}
							icon={<Icon>code</Icon>}
							onClick={handleShowCodeButtonClick}
							title={showCode ? "Hide source code" : "Show source code"}
							tabIndex={currentFocusedItemIndex === 0 ? 0 : -1}
						/>
					)}
					{!props.hideResetButton && (
						<Button
							icon={<Icon>center_focus_weak</Icon>}
							onClick={handleResetFocusButtonClick}
							title="Reset focus to test keyboard navigation"
							tabIndex={currentFocusedItemIndex === 2 ? 0 : -1}
						/>
					)}

					<Button
						icon={<Icon>bug_report</Icon>}
						onClick={handleReportBugButtonClick}
						title="Report bug"
						tabIndex={currentFocusedItemIndex === 1 ? 0 : -1}
					/>
				</ButtonGroup>
			</StyledShowcaseExampleToolbar>
			<StyledSourceCodeTransitionGroup $multipleCode={showCode && Array.isArray(codeToShow) && codeToShow.length > 1}>
				{showCode && codeToShow && (
					<CSSTransition
						nodeRef={showCodeSectionWrapperRef}
						timeout={400}
						classNames={codeSectionClassName}
						in={showCode}
					>
						<div ref={showCodeSectionWrapperRef}>
							<SourceCodeSection
								code={codeToShow}
								onToggle={handleToggleCodeMode}
								hasSkeletonCode={!!generatedCodeSnippet}
								isSkeletonMode={isSkeletonMode}
								style={{
									minHeight: "100px",
									maxHeight: "550px",
									overflowY: "auto",
									borderRadius: "4px",
									marginTop: "0"
								}}
							/>
						</div>
					</CSSTransition>
				)}
			</StyledSourceCodeTransitionGroup>
		</>
	);
};
