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

import type { ReactNode, ReactElement } from "react";
import { Children } from "react";
import { styled, css } from "styled-components";
import type { Options as ReactMarkdownOptions } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { joinClassNames, Typography, provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";
import { SourceCodeSection } from "@com.mgmtp.a12.widgets/widgets-utils";

import { toLink } from "./utils.js";
import { StyledShowcaseLink } from "./showcase-styles.js";

const renderHeadline = (props: { children?: ReactNode }, level: 2 | 1 | 3 | 4 | 5): ReactElement => {
	const childCount = Children.count(props.children);

	if (childCount === 1) {
		const child = Children.toArray(props.children)[0];

		return (
			<Typography.Headline ariaLevel={level} level={level} divider={level <= 3}>
				<div id={toLink(child as string)}>{child}</div>
			</Typography.Headline>
		);
	}

	return (
		<Typography.Headline ariaLevel={level} level={level}>
			{props.children}
		</Typography.Headline>
	);
};

const customRenderers = {
	a: (props: { href?: string; children?: ReactNode }) => (
		<StyledShowcaseLink href={props.href}>{props.children}</StyledShowcaseLink>
	),
	code: (props: { inline?: boolean; className?: string; children?: ReactNode }) => {
		const { inline, className, children, ...rest } = props;
		const match = /language-(\w+)/.exec(className || "");

		return !inline && match ? (
			<SourceCodeSection code={{ code: String(props.children).replace(/\n$/, "") }} />
		) : (
			<code {...rest}>{children}</code>
		);
	},
	h1: (props: { children?: ReactNode }) => renderHeadline(props, 1),
	h2: (props: { children?: ReactNode }) => renderHeadline(props, 2),
	h3: (props: { children?: ReactNode }) => renderHeadline(props, 3),
	h4: (props: { children?: ReactNode }) => renderHeadline(props, 4),
	h5: (props: { children?: ReactNode }) => renderHeadline(props, 5)
};

const StyledReactMarkdown = styled(ReactMarkdown)(({ theme }) => {
	const { colors, typography } = theme;

	return css`
		pre > div {
			background-color: ${theme.colors.background.secondaryBackground} !important;
		}

		table tr:nth-child(2n) {
			background: ${colors.background.secondaryBackground};
		}

		tr {
			border-top: 1px solid ${colors.divider.color};
			background: #fff;
		}

		th,
		td {
			padding: 6px 13px;
			border: 1px solid ${colors.divider.color};
		}

		th {
			font-weight: bold;
		}

		pre > code {
			display: block;
			line-height: ${typography.fontSize.hugeFontSize};
			overflow-x: auto;
		}

		a {
			font-size: ${typography.fontSize.mediumFontSize};
		}
	`;
});

export interface MarkdownViewerProps {
	source: string;
	twoColumnsLayout?: boolean;
	renderers?: ReactMarkdownOptions["components"];
}

export function MarkdownViewer(props: MarkdownViewerProps): ReactElement<{}> {
	return (
		<StyledReactMarkdown
			components={props.renderers ? { ...customRenderers, ...props.renderers } : customRenderers}
			remarkPlugins={[remarkGfm]}
			className={joinClassNames("markdown", {
				["two-columns-layout"]: props.twoColumnsLayout && DeviceDetector.isDesktop()
			})}
		>
			{props.source}
		</StyledReactMarkdown>
	);
}
