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

import { remove } from "lodash-es";
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";

import type { SizeDetectorProps } from "../../../../layout/size-detector/main/size-detector.api.js";
import type { VisibleView, Animation } from "../master-detail.api.js";
import { MasterDetailLayout } from "../master-detail.api.js";
import { FocusLastLayout } from "../master-detail.default-model.js";
import { MasterDetail } from "../master-detail.view.js";

import type { ManagedMasterDetailType, ManagedMasterDetailView } from "./managed-master-detail.api.js";

export type InternalManagedMasterDetailView = ManagedMasterDetailView & {
	openedByElementId?: string;
	fullscreenButtonId?: string;
};

interface PaneState {
	index: number;
	prevIndex?: number;
	fullScreen?: boolean;
	fullScreenToggled?: boolean;
	lastVisibleView?: ManagedMasterDetailView;
	latestAddedView?: InternalManagedMasterDetailView;
	latestClosedView?: InternalManagedMasterDetailView;
	addedViews: InternalManagedMasterDetailView[];
}

/** @deprecated Internal component state. No replacement. */
export type ManagedMasterDetailState = PaneState & { smallView?: boolean };

export function ManagedMasterDetail(props: ManagedMasterDetailType): ReactElement {
	const { views, startIndex, fullScreenable, fullscreen, columnCount, viewTabIndex, animation, onSizeChange } = props;

	const [smallView, setSmallView] = useState(false);
	const [paneState, setPaneState] = useState<PaneState>(() => ({
		index: startIndex || 0,
		addedViews: [],
		fullScreen: fullScreenable ? fullscreen : false,
		lastVisibleView: undefined
	}));

	const pendingFocusRef = useRef<string | null>(null);

	useEffect(() => {
		setPaneState((prev) => {
			const index = fullScreenable && !fullscreen && startIndex !== 0 && !smallView ? startIndex || 1 : prev.index;

			return {
				...prev,
				index,
				fullScreenToggled: prev.fullScreen,
				latestAddedView: views[index],
				addedViews: views.filter((_, i) => i <= index)
			};
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (pendingFocusRef.current) {
			document.getElementById(pendingFocusRef.current)?.focus();
			pendingFocusRef.current = null;
		}
	});

	const focusOnElement = useCallback(
		(expectedID?: string) => {
			const currentViewId = expectedID ?? paneState.addedViews[paneState.index]?.id;

			if (currentViewId) {
				pendingFocusRef.current = currentViewId;
			}
		},
		[paneState.addedViews, paneState.index]
	);

	const handleSizeChanged = useCallback(
		(breakPoint: SizeDetectorProps.BreakPoint) => {
			setSmallView(breakPoint.size === "sm" || breakPoint.size === "xs");
			onSizeChange?.(breakPoint);
		},
		[onSizeChange]
	);

	const getAnimation = (): Animation | undefined => {
		if (!smallView && !paneState.fullScreen && columnCount && columnCount > 1) {
			return animation;
		}

		const isGoingToPrevious = paneState.prevIndex !== undefined && paneState.index < paneState.prevIndex;

		return {
			...animation,
			animateSingleItem: isGoingToPrevious ? "ltr" : "rtl"
		};
	};

	const handlePrevious = (currentView: ManagedMasterDetailView, isFirstView: boolean): void => {
		if (!isFirstView) {
			const currentViewIndex = views.indexOf(currentView);
			const previousViewIndex = currentViewIndex - 1;
			const previousView = views[previousViewIndex];

			setPaneState((prev) => {
				const newAddedViews = remove([...prev.addedViews], (_view, idx) => idx <= previousViewIndex);
				const closedView = prev.addedViews[currentViewIndex];

				const triggerElementVisible =
					closedView?.openedByElementId && document.getElementById(closedView.openedByElementId);

				pendingFocusRef.current = triggerElementVisible
					? closedView.openedByElementId!
					: (newAddedViews[previousViewIndex]?.id ?? null);

				return {
					...prev,
					index: previousViewIndex,
					prevIndex: prev.index,
					fullScreen: views.indexOf(previousView) === 0 ? true : prev.fullScreen,
					fullScreenToggled: prev.fullScreenToggled && prev.fullScreen,
					lastVisibleView: previousView,
					latestAddedView: prev.addedViews[previousViewIndex],
					latestClosedView: closedView,
					addedViews: newAddedViews
				};
			});
		}
	};

	const handleNext = (options?: { triggerElementId?: string }): void => {
		setPaneState((prev) => {
			const i = prev.index < views.length - 1 ? prev.index + 1 : prev.index;
			const matchedView = views.find((value) => value.id === views[i].id);
			let newAddedViews = [...prev.addedViews];

			if (matchedView) {
				const viewToBeUpdated = prev.addedViews.find((value) => value.id === matchedView.id);

				if (viewToBeUpdated) {
					newAddedViews = prev.addedViews.map((view) =>
						viewToBeUpdated.id === view.id
							? {
									...view,
									openedByElementId: options?.triggerElementId
								}
							: view
					);
				} else {
					newAddedViews.push({ ...matchedView, openedByElementId: options?.triggerElementId });
				}
			}

			pendingFocusRef.current = newAddedViews[i]?.id ?? null;

			return {
				...prev,
				index: i,
				prevIndex: prev.index,
				fullScreen: prev.fullScreenToggled && prev.fullScreen,
				fullScreenToggled: prev.fullScreenToggled && prev.fullScreen,
				latestAddedView: newAddedViews[newAddedViews.length - 1],
				latestClosedView: undefined,
				addedViews: newAddedViews
			};
		});
	};

	const handleGoTo = (index: number): void => {
		if (index < views.length) {
			setPaneState((prev) => {
				pendingFocusRef.current = prev.addedViews[index]?.id ?? null;

				return {
					...prev,
					index,
					prevIndex: prev.index,
					fullScreenToggled: false
				};
			});
		}
	};

	const handleFullScreenToggled = (
		index: number,
		lastVisible: ManagedMasterDetailView,
		fullscreenButtonId?: string
	): void => {
		setPaneState((prev) => {
			const indexOfLastVisibleView = prev.lastVisibleView ? views.indexOf(prev.lastVisibleView) : -1;
			const addedViews = prev.addedViews.map((view, idx) => (idx === index ? { ...view, fullscreenButtonId } : view));

			if (
				index === addedViews.length - 1 &&
				prev.fullScreen &&
				prev.lastVisibleView &&
				!prev.addedViews.some((view) => view.id === prev.lastVisibleView?.id)
			) {
				addedViews.push(prev.lastVisibleView);
			}

			const colCount = columnCount ?? 1;
			const isMinimizingFirstView = index === 0 && prev.fullScreen;
			const newIndex =
				index < indexOfLastVisibleView && prev.fullScreen
					? indexOfLastVisibleView
					: isMinimizingFirstView
						? colCount
							? colCount - 1
							: 1
						: index;

			// Update addedViews after minimizing the first view in order to display the next views
			if (isMinimizingFirstView && prev.addedViews.length === 1) {
				const newViewsToPush = views.filter((view, idx) => view.id !== views[0].id && idx > 0 && idx <= newIndex);

				if (newViewsToPush.length > 0) {
					addedViews.push(...newViewsToPush);
				}
			}

			pendingFocusRef.current = addedViews.find((_value, idx) => idx === index)?.fullscreenButtonId ?? null;

			return {
				...prev,
				lastVisibleView: lastVisible,
				index: newIndex,
				prevIndex: prev.index,
				fullScreen: !prev.fullScreen,
				fullScreenToggled: true,
				latestAddedView: addedViews[addedViews.length - 1],
				latestClosedView: undefined,
				addedViews
			};
		});
	};

	const handleReplace = (currentId: string, replacerId: string): void => {
		setPaneState((prev) => {
			const replacer = views.find((view) => view.id === replacerId);
			const currentView = prev.addedViews.find((view) => view.id === currentId);
			const existedReplacer = prev.addedViews.find((view) => view.id === replacerId);
			const updatedViews = prev.addedViews.map<InternalManagedMasterDetailView>((view) => {
				if (view.id === currentId && replacer) {
					return {
						...replacer,
						openedByElementId: existedReplacer?.openedByElementId
					};
				}

				if (view.id === replacerId && currentView) {
					return currentView;
				}

				return view;
			});

			pendingFocusRef.current = replacerId;

			return {
				...prev,
				latestAddedView: replacer,
				latestClosedView: undefined,
				addedViews: updatedViews
			};
		});
	};

	const layoutManager = new FocusLastLayout<ManagedMasterDetailView>(views);
	layoutManager.goto(views[paneState.index]);
	layoutManager.columnCount = (paneState.fullScreen || smallView ? 1 : columnCount) || 1;

	const layout = layoutManager.layout();
	const lastVisibleView = layout.items[layout.items.length - 1].layoutable;
	const visibleSlots = MasterDetailLayout.visible(layout);

	const visibleViews: VisibleView[] = visibleSlots.map((view, i) => {
		const isFirstView = views.indexOf(view.layoutable) === 0;

		return {
			id: view.layoutable.id,
			width: view.width,
			key: view.layoutable.key ?? view.layoutable.id,
			element: (
				<view.layoutable.content
					key={view.layoutable.key || `content_${i}`}
					onPrevious={() => handlePrevious(view.layoutable, isFirstView)}
					onNext={handleNext}
					onGoTo={handleGoTo}
					onFullscreenToggled={(index: number, fullscreenButtonId): void =>
						handleFullScreenToggled(index, lastVisibleView, fullscreenButtonId)
					}
					onReplace={handleReplace}
					fullScreen={paneState.fullScreen}
					fullScreenable={fullScreenable}
					tabIndex={viewTabIndex || -1}
				/>
			),
			resizableOptions: view.layoutable.resizableOptions
		};
	});

	return (
		<MasterDetail
			{...props}
			title={props.title}
			visibleViews={visibleViews}
			animation={getAnimation()}
			onSizeChange={handleSizeChanged}
			onComponentMounted={focusOnElement}
		/>
	);
}

ManagedMasterDetail.displayName = "ManagedMasterDetail";
