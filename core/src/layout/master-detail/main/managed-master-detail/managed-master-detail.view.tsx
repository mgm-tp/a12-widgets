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

import type { ReactNode } from "react";
import { Component } from "react";
import { remove } from "lodash-es";

import { bindMethods } from "../../../../common/main/utils.js";
import type { SizeDetectorProps } from "../../../../layout/size-detector/main/size-detector.api.js";

import { MasterDetail } from "../master-detail.view.js";
import type { VisibleView, Animation } from "../master-detail.api.js";
import { MasterDetailLayout } from "../master-detail.api.js";
import { FocusLastLayout } from "../master-detail.default-model.js";

import type { ManagedMasterDetailType, ManagedMasterDetailView } from "./managed-master-detail.api.js";

type InternalManagedMasterDetailView = ManagedMasterDetailView & {
	openedByElementId?: string;
	fullscreenButtonId?: string;
};

export interface ManagedMasterDetailState {
	index: number;
	prevIndex?: number;
	fullScreen?: boolean;
	fullScreenToggled?: boolean;
	lastVisibleView?: ManagedMasterDetailView;
	latestAddedView?: InternalManagedMasterDetailView; // The latest view has been added or replaced
	latestClosedView?: InternalManagedMasterDetailView; // The latest view has been closed
	addedViews: InternalManagedMasterDetailView[];
	smallView?: boolean;
}

export class ManagedMasterDetail extends Component<ManagedMasterDetailType, ManagedMasterDetailState> {
	static displayName = "ManagedMasterDetail";

	constructor(props: ManagedMasterDetailType) {
		super(props);

		this.state = {
			index: this.props.startIndex || 0,
			addedViews: [],
			fullScreen: this.props.fullScreenable ? this.props.fullscreen : this.props.fullScreenable,
			lastVisibleView: undefined
		};

		bindMethods(this);
	}

	componentDidMount(): void {
		this.setState((state) => {
			const index =
				this.props.fullScreenable && !this.props.fullscreen && this.props.startIndex !== 0 && !state.smallView
					? this.props.startIndex || 1
					: state.index;

			return {
				index,
				fullScreenToggled: state.fullScreen,
				latestAddedView: this.props.views[index],
				addedViews: this.props.views.filter((_, i) => i <= index)
			};
		});
	}

	private focusOnElement(expectedID?: string): void {
		const currentViewId = expectedID ?? this.state.addedViews[this.state.index]?.id;

		if (currentViewId) {
			document.getElementById(currentViewId)?.focus();
		}
	}

	private handleSizeChanged(breakPoint: SizeDetectorProps.BreakPoint): void {
		this.setState({ smallView: breakPoint.size === "sm" || breakPoint.size === "xs" });
		this.props.onSizeChange?.(breakPoint);
	}

	private getAnimation(): Animation | undefined {
		if (!this.state.smallView && !this.state.fullScreen && this.props.columnCount && this.props.columnCount > 1) {
			return this.props.animation;
		}

		return {
			...this.props.animation,
			animateSingleItem: this.state.prevIndex && this.state.index < this.state.prevIndex ? "ltr" : "rtl"
		};
	}

	private onPrevious(currentView: ManagedMasterDetailView, isFirstView: boolean): void {
		if (!isFirstView) {
			const currentViewIndex = this.props.views.indexOf(currentView);
			const previousViewIndex = currentViewIndex - 1;
			const previousView = this.props.views[previousViewIndex];
			this.setState(
				(state) => {
					return {
						index: previousViewIndex,
						prevIndex: state.index,
						fullScreen: this.props.views.indexOf(previousView) === 0 ? true : state.fullScreen,
						fullScreenToggled: state.fullScreenToggled && state.fullScreen,
						lastVisibleView: previousView,
						latestAddedView: state.addedViews[previousViewIndex],
						latestClosedView: state.addedViews[currentViewIndex],
						// Remove view has been closed
						addedViews: remove(state.addedViews, (view, idx) => idx <= previousViewIndex)
					};
				},
				() => {
					const triggerElementVisible =
						this.state.latestClosedView?.openedByElementId &&
						document.getElementById(this.state.latestClosedView.openedByElementId);

					this.focusOnElement(triggerElementVisible ? this.state.latestClosedView?.openedByElementId : undefined);
				}
			);
		}
	}

	private onNext(options?: { triggerElementId?: string }): void {
		const i = this.state.index < this.props.views.length - 1 ? this.state.index + 1 : this.state.index;
		this.setState((state) => {
			const matchedView = this.props.views.find((value) => value.id === this.props.views[i].id);
			let newAddedViews = [...state.addedViews];

			if (matchedView) {
				const viewToBeUpdated = state.addedViews.find((value) => value.id === matchedView.id);

				if (viewToBeUpdated) {
					newAddedViews = state.addedViews.map((view) =>
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

			return {
				index: i,
				prevIndex: state.index,
				fullScreen: state.fullScreenToggled && state.fullScreen,
				fullScreenToggled: state.fullScreenToggled && state.fullScreen,
				latestAddedView: newAddedViews[newAddedViews.length - 1],
				latestClosedView: undefined,
				addedViews: newAddedViews
			};
		}, this.focusOnElement);
	}

	private onGoTo(index: number): void {
		if (index < this.props.views.length) {
			this.setState(
				(state) => ({
					index,
					prevIndex: state.index,
					fullScreenToggled: false
				}),
				this.focusOnElement
			);
		}
	}

	private onFullScreenToggled(
		index: number,
		lastVisibleView: ManagedMasterDetailView,
		fullscreenButtonId?: string
	): void {
		this.setState(
			(state) => {
				const indexOfLastVisibleView = state.lastVisibleView ? this.props.views.indexOf(state.lastVisibleView) : -1;
				const addedViews = state.addedViews.map((view, idx) =>
					idx === index ? { ...view, fullscreenButtonId } : view
				);

				if (
					index === addedViews.length - 1 &&
					state.fullScreen &&
					state.lastVisibleView &&
					!state.addedViews.some((view) => view.id === state.lastVisibleView?.id)
				) {
					addedViews.push(state.lastVisibleView);
				}

				const { views } = this.props;
				const columnCount = this.props.columnCount ?? 1;
				const isMinimizingFirstView = index === 0 && state.fullScreen;
				const newIndex =
					index < indexOfLastVisibleView && state.fullScreen
						? indexOfLastVisibleView
						: isMinimizingFirstView
							? columnCount
								? columnCount - 1
								: 1
							: index;

				// Update addedViews after minimizing the first view in order to display the next views
				if (isMinimizingFirstView && state.addedViews.length === 1) {
					const newViewsToPush = views.filter((view, idx) => view.id !== views[0].id && idx > 0 && idx <= newIndex);

					if (newViewsToPush.length > 0) {
						addedViews.push(...newViewsToPush);
					}
				}

				return {
					lastVisibleView,
					index: newIndex,
					prevIndex: state.index,
					fullScreen: !state.fullScreen,
					fullScreenToggled: true,
					latestAddedView: addedViews[addedViews.length - 1],
					latestClosedView: undefined,
					addedViews
				};
			},
			() => {
				// Focus on the fullscreen button after maximizing/minimizing
				this.focusOnElement(this.state.addedViews.find((_value, idx) => idx === index)?.fullscreenButtonId);
			}
		);
	}

	private onReplace(currentId: string, replacerId: string): void {
		this.setState(
			(state) => {
				const replacer = this.props.views.find((view) => view.id === replacerId);
				const currentView = state.addedViews.find((view) => view.id === currentId);
				const existedReplacer = state.addedViews.find((view) => view.id === replacerId);
				const updatedViews = state.addedViews.map<InternalManagedMasterDetailView>((view) => {
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

				return {
					latestAddedView: replacer,
					latestClosedView: undefined,
					addedViews: updatedViews
				};
			},
			() => {
				this.focusOnElement(replacerId);
			}
		);
	}

	render(): ReactNode {
		// initialize and run layout manager
		const layoutManager = new FocusLastLayout<ManagedMasterDetailView>(this.props.views);
		layoutManager.goto(this.props.views[this.state.index]);
		layoutManager.columnCount = (this.state.fullScreen || this.state.smallView ? 1 : this.props.columnCount) || 1;

		const layout = layoutManager.layout();
		const lastVisibleView = layout.items[layout.items.length - 1].layoutable;
		const visibleSlots = MasterDetailLayout.visible(layout);

		const visibleViews: VisibleView[] = visibleSlots.map((view, i) => {
			const isFirstView = this.props.views.indexOf(view.layoutable) === 0;

			return {
				id: view.layoutable.id,
				width: view.width,
				key: view.layoutable.key,
				element: (
					<view.layoutable.content
						key={view.layoutable.key || `content_${i}`}
						onPrevious={() => this.onPrevious(view.layoutable, isFirstView)}
						onNext={this.onNext}
						onGoTo={this.onGoTo}
						onFullscreenToggled={(index: number, fullscreenButtonId): void =>
							this.onFullScreenToggled(index, lastVisibleView, fullscreenButtonId)
						}
						onReplace={this.onReplace}
						fullScreen={this.state.fullScreen}
						fullScreenable={this.props.fullScreenable}
						tabIndex={this.props.viewTabIndex || -1}
					/>
				),
				resizableOptions: view.layoutable.resizableOptions
			};
		});

		return (
			<MasterDetail
				{...this.props}
				title={this.props.title}
				visibleViews={visibleViews}
				animation={this.getAnimation()}
				onSizeChange={this.handleSizeChanged}
				onComponentMounted={this.focusOnElement}
			/>
		);
	}
}
