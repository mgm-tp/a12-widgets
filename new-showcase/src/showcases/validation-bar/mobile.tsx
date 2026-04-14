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

import type { FC, ReactNode } from "react";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";

import { MobileValidation, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import type { FieldName, Issue, ValidationResult } from "./showcase-validation-bar.api.js";
import { SummaryView } from "./summary-view.js";
import { DetailView } from "./detail-view.js";

const { Overview, Graphic } = MobileValidation;

interface ValidationBarMobileProps extends ValidationResult {
	contentBoxWrapperRef?: HTMLElement | null;
	goToField(fieldName: FieldName): void;
}

type ViewKind = "summary" | "detail";

export const ValidationBarMobile: FC<ValidationBarMobileProps> = (props) => {
	const { goToField, contentBoxWrapperRef, errors, warnings, issues = [] } = props;
	const validationBarModalRef = useRef<HTMLDivElement | null>(null);
	const [viewKind, setViewKind] = useState<ViewKind>();
	const [selectedIssueIndex, setSelectedIssueIndex] = useState(-1);

	// Reset selected issue and selected index if data has changed, else still keeping the current selected validation.
	useEffect(() => {
		setSelectedIssueIndex(-1);
	}, [issues]);

	const handleValidationBarModalFocus = useCallback(() => {
		// To make VoiceOver (iOS) can focus on the modal on opening overview/detail view,
		// blur the old active element before set focus to the new one.
		(document.activeElement as HTMLElement)?.blur();
		setTimeout(() => validationBarModalRef.current?.focus());
	}, []);

	useEffect(() => {
		if (viewKind) {
			handleValidationBarModalFocus();
		}
	}, [handleValidationBarModalFocus, viewKind]);

	const selectedIssue: Issue | undefined = useMemo(
		() => (selectedIssueIndex < 0 ? undefined : issues[selectedIssueIndex]),
		[issues, selectedIssueIndex]
	);

	const getValidationBarModalRef = useCallback((ref: HTMLDivElement | null): void => {
		validationBarModalRef.current = ref;
	}, []);

	const focusBackOnParent = useCallback((): void => {
		setTimeout(() => contentBoxWrapperRef?.focus());
	}, [contentBoxWrapperRef]);

	const onPreviewIssueClick = useCallback(
		(issue: Issue): void => {
			setSelectedIssueIndex(issues.indexOf(issue));
			setViewKind("detail");
		},
		[issues]
	);

	const onOpenView = useCallback((): void => {
		if (selectedIssue) {
			onPreviewIssueClick(selectedIssue);
		} else {
			setViewKind("summary");
		}
	}, [onPreviewIssueClick, selectedIssue]);

	const leftOverviewElement = useCallback(
		(a11ySupport?: boolean): ReactNode => {
			return (
				<>
					{errors?.length && <Graphic a11yTitleSupport={a11ySupport}>{errors.length}</Graphic>}
					{warnings?.length && (
						<Graphic a11yTitleSupport={a11ySupport} variant="warning">
							{warnings.length}
						</Graphic>
					)}
				</>
			);
		},
		[errors, warnings]
	);

	const onCloseValidation = (): void => {
		setViewKind(undefined);
		focusBackOnParent();
	};

	const closeDetailView = (): void => {
		setViewKind(undefined);
		focusBackOnParent();
	};

	const onGoToIssue = (): void => {
		setViewKind(undefined);
		selectedIssue && goToField(selectedIssue.fieldName);
	};

	const showAllErrors = (): void => {
		setViewKind("summary");
		setSelectedIssueIndex(-1);
	};

	return (
		<>
			<Overview
				variant={issues[0].variant}
				leftElement={leftOverviewElement(true)}
				rightElement={<Icon>fullscreen</Icon>}
				onClick={onOpenView}
			/>
			{viewKind === "summary" ? (
				<SummaryView
					issues={issues}
					headingTitle={leftOverviewElement()}
					variant={issues[0].variant}
					getValidationBarModalRef={getValidationBarModalRef}
					onClose={onCloseValidation}
					onPreviewItemClick={onPreviewIssueClick}
				/>
			) : viewKind === "detail" && !!selectedIssue ? (
				<DetailView
					issues={issues}
					selectedIssue={selectedIssue}
					selectedIssueIndex={selectedIssueIndex}
					getValidationBarModalRef={getValidationBarModalRef}
					setSelectedIssueIndex={setSelectedIssueIndex}
					onClose={closeDetailView}
					onGoToIssue={onGoToIssue}
					showAllErrors={showAllErrors}
				/>
			) : null}
		</>
	);
};
