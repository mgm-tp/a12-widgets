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

import type { FC, ReactElement } from "react";
import { isRouteErrorResponse, useLocation, useRouteError } from "react-router";
import { styled, css } from "styled-components";

const Container = styled.div(({ theme }) => {
	const { spacing, colors, typography } = theme;

	return css`
		padding: ${spacing.verticalSpacing.vertWhiteSpacinglg}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px;
		color: ${colors.text.color};
		font-family: "Roboto", sans-serif;

		h1 {
			font-size: ${typography.fontSize.bigFontSize};
			margin: 0 0 ${spacing.spacing.spacingMd}px;
		}

		p {
			margin: 0 0 ${spacing.spacing.spacingSm}px;
		}

		pre {
			background: ${colors.background.primaryBackground};
			padding: ${spacing.spacing.spacingSm}px;
			border-radius: 4px;
			overflow: auto;
			white-space: pre-wrap;
		}
	`;
});

export const ShowcaseErrorBoundary: FC = (): ReactElement => {
	const error = useRouteError();
	const { pathname } = useLocation();
	const message = isRouteErrorResponse(error)
		? `${error.status} ${error.statusText}`
		: error instanceof Error
			? error.message
			: String(error);
	const stack = error instanceof Error ? error.stack : undefined;

	return (
		<Container data-role="showcase-error-boundary">
			<h1>This showcase failed to render</h1>
			<p>
				Route: <code>{pathname}</code>
			</p>
			<p>{message}</p>
			{stack && <pre>{stack}</pre>}
		</Container>
	);
};
