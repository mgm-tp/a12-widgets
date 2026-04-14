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
 * Demo of the MasterDetailLayout. Layouts a sequence of (generated) placeholder components.
 */
import type { FC } from "react";
import { useState, useCallback, useMemo, useEffect } from "react";

import type {
	Layoutable,
	LayoutResult,
	VisibleView,
	ViewWidth,
	SizeDetectorProps
} from "@com.mgmtp.a12.widgets/widgets-core";
import { FocusLastLayout, MasterDetail, MasterDetailLayout, provider } from "@com.mgmtp.a12.widgets/widgets-core";

import { DummyContent } from "./dummy-content.js";

interface ModelComponent extends Layoutable {
	id: string;
	name: string;
}

const PANES: ModelComponent[] = [
	{ id: "template-pane_1", name: "Pane 1" },
	{ id: "template-pane_2", name: "Pane 2", preferredWidth: 5 },
	{ id: "template-pane_3", name: "Pane 3" },
	{ id: "template-pane_4", name: "Pane 4" }
];

interface MasterDetailShowcaseLayoutState {
	position: ModelComponent;
	fullScreen: boolean;
	fullScreenToggled?: boolean;
	firstVisibleView?: ModelComponent;
	smallView: boolean;
	animationDirection?: "rtl" | "ltr";
}

export const MasterDetailShowcase: FC = () => {
	const [{ fullScreen, fullScreenToggled, smallView, position, animationDirection }, setState] =
		useState<MasterDetailShowcaseLayoutState>({
			position: !provider.isPhone() ? PANES[1] : PANES[0],
			fullScreen: false,
			smallView: false
		});

	const handleWindowSizeChanged = useCallback((breakPoint: SizeDetectorProps.BreakPoint): void => {
		setState((prevState) => ({ ...prevState, smallView: breakPoint.size === "sm" || breakPoint.size === "xs" }));
	}, []);

	const focusOnElement = useCallback((id?: string): void => {
		if (!id) {
			return;
		}

		setTimeout(() => {
			document.getElementById(id)?.focus();
		});
	}, []);

	const gotoView = useCallback(
		(view: ModelComponent, isPrevious?: boolean, shouldFocusOnView = true): void => {
			const triggerId = isPrevious ? `${view.id}-expandButton` : undefined;
			setState((prevState) => ({
				...prevState,
				position: view,
				fullScreenToggled: prevState.fullScreenToggled && prevState.fullScreen,
				fullScreen: PANES.indexOf(view) === 0 ? true : prevState.fullScreen,
				animationDirection: prevState.fullScreen || prevState.smallView ? (isPrevious ? "ltr" : "rtl") : undefined
			}));

			if (isPrevious && triggerId) {
				focusOnElement(triggerId);

				return;
			}

			if (shouldFocusOnView) {
				focusOnElement(view.id);
			}
		},
		[focusOnElement]
	);

	const gotoNextFunc = useCallback(
		(layoutable: ModelComponent, shouldFocusOnView = true): void => {
			const nextView = PANES[PANES.indexOf(layoutable) + 1];

			if (PANES.indexOf(nextView) === 1 && !fullScreenToggled) {
				setState((prevState) => ({ ...prevState, fullScreen: false }));
			}

			gotoView(nextView, false, shouldFocusOnView);
		},
		[fullScreenToggled, gotoView]
	);

	const gotoPreviousFunc = useCallback(
		(isFirstView: boolean, layoutable: ModelComponent): undefined | (() => void) => {
			if (!isFirstView) {
				return () => {
					const previousView = PANES[PANES.indexOf(layoutable) - 1];

					if (PANES.indexOf(layoutable) === 1) {
						setState((prevState) => ({ ...prevState, fullScreen: true }));
					}

					gotoView(previousView, true);
				};
			}

			return undefined;
		},
		[gotoView]
	);

	const onFullscreenToggled = useCallback(
		(props: {
			layoutItems: LayoutResult<ModelComponent>;
			layoutable: ModelComponent;
			isLastVisibleView: boolean;
			isLastView: boolean;
			fullscreenButtonId?: string;
		}): void => {
			const { layoutItems, layoutable, isLastVisibleView, isLastView, fullscreenButtonId } = props;
			// Get the first visible view to keep the current visible views when toggling it
			const firstVisibleView = layoutItems.items[layoutItems.items.length - 2];

			setState((prevState) => ({
				...prevState,
				firstVisibleView: firstVisibleView ? firstVisibleView.layoutable : prevState.firstVisibleView,
				fullScreenToggled: true,
				fullScreen: !prevState.fullScreen,
				position:
					prevState.fullScreen &&
					layoutItems.items[layoutItems.items.length - 1].layoutable === prevState.firstVisibleView
						? PANES[PANES.indexOf(layoutable) + 1]
						: layoutable,
				animationDirection: undefined
			}));

			if (PANES.indexOf(layoutable) === 0 && isLastVisibleView && !isLastView) {
				gotoNextFunc(layoutable, false);
			}

			if (fullscreenButtonId) {
				focusOnElement(fullscreenButtonId);
			}
		},
		[focusOnElement, gotoNextFunc]
	);

	const layout = useMemo(() => {
		const layoutManager = new FocusLastLayout<ModelComponent>(PANES);
		layoutManager.goto(position);
		layoutManager.columnCount = fullScreen || smallView ? 1 : 2;

		return layoutManager.layout();
	}, [fullScreen, position, smallView]);

	const visibleSlots = useMemo(() => MasterDetailLayout.visible(layout), [layout]);

	const visibleViews: VisibleView[] = useMemo(
		() =>
			visibleSlots.map((v, i) => {
				const isFirstVisibleView = PANES.indexOf(v.layoutable) === visibleSlots.length - 1;
				const isLastView = PANES.indexOf(v.layoutable) === PANES.length - 1;
				const isLastVisibleView = i === visibleSlots.length - 1;
				const isFirstView = PANES.indexOf(v.layoutable) === 0;

				const isOnlyVisibleView = isFirstVisibleView && isLastVisibleView;

				return {
					width: !isOnlyVisibleView ? (v.width as ViewWidth) : undefined,
					key: v.layoutable.id,
					element: (
						<DummyContent
							key={v.layoutable.name}
							name={v.layoutable.name.toUpperCase()}
							id={v.layoutable.id}
							onNext={isLastVisibleView && !isLastView ? () => gotoNextFunc(v.layoutable) : undefined}
							onPrevious={gotoPreviousFunc(isFirstView, v.layoutable)}
							fullscreenable
							fullscreen={fullScreen}
							onFullscreenToggled={(fullscreenButtonId): void => {
								onFullscreenToggled({
									layoutItems: layout,
									layoutable: v.layoutable,
									isLastVisibleView,
									isLastView,
									fullscreenButtonId
								});
							}}
							smallView={smallView}
							titleAriaLevel={i + 1}
						/>
					)
				};
			}),
		[fullScreen, gotoNextFunc, gotoPreviousFunc, layout, onFullscreenToggled, smallView, visibleSlots]
	);

	useEffect(() => {
		if (fullScreen) {
			setState((prevState) => ({ ...prevState, fullScreenToggled: true }));
		}

		focusOnElement(position.id);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<MasterDetail
			title="Master Detail Layout Title"
			visibleViews={visibleViews}
			style={{ maxHeight: 600 }}
			animation={{ animateSingleItem: animationDirection }}
			onSizeChange={handleWindowSizeChanged}
		/>
	);
};
