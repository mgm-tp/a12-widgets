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

/**
 * The shared inner content of a "load more" affordance, rendered after a paginated parent's loaded
 * children. Host-agnostic: the `DataTreeTable` wrapper's grid-spanning sentinel row renders it; the host
 * owns the surrounding row/cell chrome. Renders a consumer `renderLoadMore`, else a progress indicator
 * while a page loads, else "Load more" / "Load all N" links.
 * @module
 */

import type { ReactElement, ReactNode } from "react";
import { useContext } from "react";
import { css, styled } from "styled-components";

import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { PseudoLink } from "../../link/main/pseudo-link/pseudo-link.view.js";
import { ProgressIndicator } from "../../progress-indicator/main/progress-indicator.view.js";
import { addPrefix } from "../../common/main/utils.js";

/** Lays out the load-more links in a row, separated by a standalone {@link StyledLoadMoreDivider}. */
export const StyledLoadMoreActions = styled.span(
	({ theme }) => css`
		display: inline-flex;
		align-items: center;
		gap: ${theme.spacing.horizontalSpacing.horizWhiteSpacingsm}px;
	`
);

/** A standalone vertical divider between load-more links — a separate element, not part of either link. */
export const StyledLoadMoreDivider = styled.span(
	({ theme }) => css`
		align-self: stretch;
		border-left: 1px solid ${theme.colors.interaction.disabled.color};
	`
);

const loadingClassName = addPrefix("loading");

/**
 * Wraps the inline {@link ProgressIndicator} shown while a page is loading. The indicator's inner overlay
 * is themed for full-screen use (it carries `vertWhiteSpacingsm` padding plus circle margins), which makes
 * it taller than the short load-more row. `display: contents` keeps the overlay's positioning context on
 * the row's content cell while letting us strip that padding/margin so it fits within the row height.
 */
export const StyledLoadMoreProgress = styled.span`
	display: contents;

	.${loadingClassName}__innerOverlay {
		padding: 0;
	}

	.${loadingClassName}__circle {
		margin: 0;
	}
`;

/**
 * Parameters handed to a consumer's `renderLoadMore` override (parity across {@link TreeView} and the
 * `DataTreeTable` wrapper): the parent node, whether a page is in flight, the bound page loaders and the
 * total child count if the source reported one.
 *
 * @internal
 */
export interface TreeLoadMoreRenderParams<RowType = unknown> {
	/** The parent node whose next page these affordances load. */
	row: RowType;

	/** Whether a subsequent page is currently loading. */
	loading: boolean;

	/** Loads the next page of the parent's children. */
	loadMore: () => void;

	/** Drains all remaining pages of the parent's children. */
	loadAll: () => void;

	/** Total child count reported by the paginated source, if known. */
	total?: number;
}

/** Props for {@link TreeLoadMoreContent}. @internal */
export interface TreeLoadMoreContentProps<RowType = unknown> extends TreeLoadMoreRenderParams<RowType> {
	/** Consumer override for the affordance; falls back to the built-in links / progress indicator. */
	renderLoadMore?: (params: TreeLoadMoreRenderParams<RowType>) => ReactNode;

	/** Label for the "load next page" link. Defaults to `"Load more"`. */
	loadMoreLabel?: string;

	/** Label for the "drain all pages" link; the `total` child count (if known) is appended. Defaults to `"Load all"`. */
	loadAllLabel?: string;
}

/**
 * The inner content of a "load more" sentinel — rendered by the `DataTreeTable` wrapper's spanning
 * sentinel row: a consumer `renderLoadMore`, else a {@link ProgressIndicator} while a page loads, else
 * "Load more" / "Load all N" links. Link labels come from the `loadMoreLabel` / `loadAllLabel` props
 * (defaulting to `"Load more"` / `"Load all"`). The host owns the surrounding row/cell chrome.
 *
 * @internal
 */
export function TreeLoadMoreContent<RowType>(props: TreeLoadMoreContentProps<RowType>): ReactElement {
	const { row, loading, loadMore, loadAll, total, renderLoadMore, loadMoreLabel, loadAllLabel } = props;
	const { progressIndicatorTitles } = useContext<A11yDefinition>(A11YLanguageContext);

	if (renderLoadMore) {
		return <>{renderLoadMore({ row, loading, loadMore, loadAll, total })}</>;
	}

	if (loading) {
		return (
			<StyledLoadMoreProgress>
				<ProgressIndicator
					size="small"
					singleOverlay
					useLoadingDots
					innerOverlayVariant="bright"
					outerOverlayVariant="bright"
					noTabIndex
					fastAppear
					type="horizontal"
					label={progressIndicatorTitles?.loadingLabel ?? "Loading"}
				/>
			</StyledLoadMoreProgress>
		);
	}

	const loadAllText = `${loadAllLabel ?? "Load all"}${total !== undefined ? ` ${total}` : ""}`;

	return (
		<StyledLoadMoreActions>
			<PseudoLink onClick={loadMore}>{loadMoreLabel ?? "Load more"}</PseudoLink>
			<StyledLoadMoreDivider aria-hidden="true" />
			<PseudoLink onClick={loadAll}>{loadAllText}</PseudoLink>
		</StyledLoadMoreActions>
	);
}
