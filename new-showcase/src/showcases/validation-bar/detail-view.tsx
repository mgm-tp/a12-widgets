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

import type { RefCallback, SetStateAction, Dispatch, ReactNode } from "react";
import { useRef, useCallback } from "react";

import { ModalOverlay, MobileValidation, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Issue } from "./showcase-validation-bar.api.js";

const { Actions, ActionsItem, Content, Graphic } = MobileValidation;

interface DetailViewProps {
	issues: Issue[];
	selectedIssue: Issue;
	selectedIssueIndex: number;
	getValidationBarModalRef: RefCallback<HTMLElement>;
	setSelectedIssueIndex: Dispatch<SetStateAction<number>>;
	onClose?(): void;
	onGoToIssue?(): void;
	showAllErrors?(): void;
}

export const DetailView = (props: DetailViewProps): ReactNode => {
	const {
		issues,
		selectedIssue,
		getValidationBarModalRef,
		selectedIssueIndex,
		onClose,
		onGoToIssue,
		setSelectedIssueIndex,
		showAllErrors
	} = props;

	const showAllButtonRef = useRef<HTMLButtonElement | null>(null);

	const { variant, fieldName, message } = selectedIssue;

	const handleNext = (): void => {
		const index = Math.min(selectedIssueIndex + 1, issues.length - 1);

		setSelectedIssueIndex(index);

		if (index === issues.length - 1) {
			showAllButtonRef.current?.focus();
		}
	};

	const handlePrevious = (): void => {
		const index = Math.max(selectedIssueIndex - 1, 0);

		setSelectedIssueIndex(index);

		if (index === 0) {
			showAllButtonRef.current?.focus();
		}
	};

	const headingTitle = [
		variant === "error" ? "Error" : "Warning",
		`(${issues.indexOf(selectedIssue) + 1}/${issues.length})`
	].join(" ");

	const getShowAllButtonRef = useCallback((ref: HTMLButtonElement | null) => {
		showAllButtonRef.current = ref;
	}, []);

	return (
		<ModalOverlay focusBack={false} fullscreen>
			<MobileValidation
				wrapperRef={getValidationBarModalRef}
				variant={variant}
				headingTitle={<Graphic variant={variant}>{headingTitle}</Graphic>}
				onClose={onClose}
				footer={
					<Actions>
						<ActionsItem>
							{selectedIssueIndex > 0 && (
								<Button
									block
									vertical
									label="Previous"
									icon={<Icon>keyboard_arrow_left</Icon>}
									onClick={handlePrevious}
								/>
							)}
						</ActionsItem>
						<ActionsItem>
							<Button
								buttonRef={getShowAllButtonRef}
								block
								vertical
								label="Show All"
								icon={<Icon>view_list</Icon>}
								onClick={showAllErrors}
							/>
						</ActionsItem>
						<ActionsItem>
							{selectedIssueIndex < issues.length - 1 && (
								<Button block vertical label="Next" icon={<Icon>keyboard_arrow_right</Icon>} onClick={handleNext} />
							)}
						</ActionsItem>
					</Actions>
				}
			>
				<Content>
					{message}
					<div>
						<Button onClick={onGoToIssue}>{`Go to ${fieldName}`}</Button>
					</div>
				</Content>
			</MobileValidation>
		</ModalOverlay>
	);
};
