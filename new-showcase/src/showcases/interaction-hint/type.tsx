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
import { useRef } from "react";
import { styled, css } from "styled-components";

import { InteractionHint, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { ShowcaseFlexBox } from "../../helpers/showcase-flex-box.js";

const ShowcaseStyledInteractiveElement = styled.span(({ theme }) => {
	const { focus, hover } = theme.colors.interaction;

	const commonStyles = css`
		outline: none;
		overflow: hidden;
	`;

	return css`
		border: 2px solid transparent;
		border-radius: 50%;
		cursor: pointer;
		display: flex;

		&:focus {
			border: 2px solid ${focus.color};
			${commonStyles}

			> * {
				color: ${focus.color};
			}
		}

		&:hover {
			border: 2px solid ${hover.color};
			${commonStyles}

			> * {
				color: ${hover.color};
			}
		}
	`;
});
export function InteractionHintTypeShowcase(): ReactElement {
	const buttonHintRef = useRef<HTMLElement | null>(null);
	const buttonSuccessRef = useRef<HTMLElement | null>(null);
	const buttonWarningRef = useRef<HTMLElement | null>(null);
	const buttonErrorRef = useRef<HTMLElement | null>(null);
	const hintText = "This is an interaction hint";

	return (
		<div className="-u-flex -u-flex-col">
			<ShowcaseFlexBox>
				Info Hint:
				<ShowcaseStyledInteractiveElement role="button" tabIndex={0} aria-label={hintText} ref={buttonHintRef}>
					<Icon size="big" variant="info">
						info
					</Icon>
					<InteractionHint title={hintText} referenceElementRef={buttonHintRef} variant="hint" />
				</ShowcaseStyledInteractiveElement>
			</ShowcaseFlexBox>
			<ShowcaseFlexBox>
				Success Hint:
				<ShowcaseStyledInteractiveElement role="button" tabIndex={0} aria-label={hintText} ref={buttonSuccessRef}>
					<Icon size="big" variant="success">
						check_circle
					</Icon>
					<InteractionHint title={hintText} referenceElementRef={buttonSuccessRef} variant="success" />
				</ShowcaseStyledInteractiveElement>
			</ShowcaseFlexBox>
			<ShowcaseFlexBox>
				Warning Hint:
				<ShowcaseStyledInteractiveElement role="button" tabIndex={0} aria-label={hintText} ref={buttonWarningRef}>
					<Icon size="big" variant="warning">
						warning
					</Icon>
					<InteractionHint title={hintText} referenceElementRef={buttonWarningRef} variant="warning" />
				</ShowcaseStyledInteractiveElement>
			</ShowcaseFlexBox>
			<ShowcaseFlexBox>
				Error Hint:
				<ShowcaseStyledInteractiveElement role="button" tabIndex={0} aria-label={hintText} ref={buttonErrorRef}>
					<Icon size="big" variant="error">
						error
					</Icon>
					<InteractionHint title={hintText} referenceElementRef={buttonErrorRef} variant="error" />
				</ShowcaseStyledInteractiveElement>
			</ShowcaseFlexBox>
		</div>
	);
}
