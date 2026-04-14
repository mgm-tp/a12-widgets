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
import { styled, css } from "styled-components";

import { Icon, Status } from "@com.mgmtp.a12.widgets/widgets-core";

const ShowcaseStatusWrapper = styled.div(({ theme }) => {
	return css`
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: ${theme.spacing.baseSpacing.BASE_HORIZONTAL_WHITE_SPACING}px;

		&:not(:last-child) {
			margin-bottom: ${theme.spacing.spacing.spacingMd}px;
		}
	`;
});
export function StatusShowcase(): ReactElement {
	return (
		<div>
			<p>Icon Only:</p>
			<ShowcaseStatusWrapper>
				<Status icon={<Icon title="Info">info</Icon>} variant="info" />
				<Status icon={<Icon title="Success">check_circle</Icon>} variant="success" />
				<Status
					icon={
						<Icon title="Warning" iconTheme="outlined">
							warning_amber
						</Icon>
					}
					variant="warning"
				/>
				<Status icon={<Icon title="Error">error</Icon>} variant="error" />
			</ShowcaseStatusWrapper>
			<p>Text Only:</p>
			<ShowcaseStatusWrapper>
				<Status variant="info">Info</Status>
				<Status variant="success">Success</Status>
				<Status variant="warning">Warning</Status>
				<Status variant="error">Error</Status>
			</ShowcaseStatusWrapper>
			<p>Icon and Text:</p>
			<ShowcaseStatusWrapper>
				<Status icon={<Icon title="Info">info</Icon>} variant="info">
					Info
				</Status>
				<Status icon={<Icon title="Success">check_circle</Icon>} variant="success">
					Success
				</Status>
				<Status
					icon={
						<Icon title="Warning" iconTheme="outlined">
							warning_amber
						</Icon>
					}
					variant="warning"
				>
					Warning
				</Status>
				<Status icon={<Icon title="Error">error</Icon>} variant="error">
					Error
				</Status>
			</ShowcaseStatusWrapper>
			<p>With long text:</p>
			<ShowcaseStatusWrapper>
				<div style={{ maxWidth: "120px" }}>
					<Status icon={<Icon title="Info">info</Icon>} variant="info">
						Status with long text
					</Status>
				</div>
				<div style={{ maxWidth: "90px" }}>
					<Status variant="info">Status with long text</Status>
				</div>
			</ShowcaseStatusWrapper>
		</div>
	);
}
