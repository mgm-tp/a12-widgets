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

import type { ReactNode, RefCallback } from "react";

import type { ValidationBarVariant } from "@com.mgmtp.a12.widgets/widgets-core";
import { ModalOverlay, MobileValidation } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Issue } from "./showcase-validation-bar.api.js";

const { PreviewListItem, PreviewList } = MobileValidation;

interface SummaryViewProps {
	issues: Issue[];
	headingTitle: ReactNode;
	getValidationBarModalRef?: RefCallback<HTMLElement>;
	variant?: ValidationBarVariant;
	onClose(): void;
	onPreviewItemClick(issue: Issue): void;
}

export const SummaryView = (props: SummaryViewProps): ReactNode => {
	return (
		<ModalOverlay focusBack={false} fullscreen>
			<MobileValidation
				wrapperRef={props.getValidationBarModalRef}
				variant={props.variant}
				headingTitle={props.headingTitle}
				onClose={props.onClose}
			>
				<PreviewList>
					{props.issues.map((issue) => (
						<PreviewListItem
							key={issue.fieldName}
							onClick={() => props.onPreviewItemClick(issue)}
							text={issue.message}
							variant={issue.variant}
						/>
					))}
				</PreviewList>
			</MobileValidation>
		</ModalOverlay>
	);
};
