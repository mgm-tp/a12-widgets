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
 * Demo of the ManagedMasterDetailLayout. Layouts a sequence of (generated) placeholder components.
 */
import type { FC } from "react";
import { useState, useCallback } from "react";

import type { ContentProps, SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Select, ManagedMasterDetail } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

import { DummyContent } from "./dummy-content.js";
import type { MasterDetailComponent } from "./showcase-master-detail.api.js";

const VIEWS: MasterDetailComponent[] = [
	{ id: "managed-pane_1", label: "Pane 1" },
	{ id: "managed-pane_2", label: "Pane 2" },
	{ id: "managed-pane_3", label: "Pane 3" },
	{ id: "managed-pane_4", label: "Pane 4" }
];

export const ManagedMasterDetailShowcase: FC = () => {
	const [columnCount, setColumnCount] = useState(2);
	const [smallView, setSmallView] = useState(false);
	const [views, setViews] = useState(VIEWS);

	const handleReplace = useCallback(
		(currentId: string, replacerId: string): void => {
			// Find view to be replaced
			const currentViewIndex = views.findIndex((value) => value.id === currentId);

			// Find view to replace
			const viewToReplaceIndex = views.findIndex((value) => value.id === replacerId);

			const newViews = [...views];
			// Exchange position together
			newViews[currentViewIndex] = { ...views[viewToReplaceIndex], replacedByViewId: currentId };
			newViews[viewToReplaceIndex] = { ...views[currentViewIndex], replacedByViewId: replacerId };
			setViews(newViews);
		},
		[views]
	);

	const handleWindowSizeChanged = useCallback((breakPoint: SizeDetectorProps.BreakPoint): void => {
		setSmallView(breakPoint.size === "sm" || breakPoint.size === "xs");
	}, []);

	return (
		<ConfigurationView
			configuration={
				<Select
					value={`${columnCount}`}
					label="Maximum number of visible views"
					onValueChanged={(value): void => {
						setColumnCount(Number(value));
					}}
					items={VIEWS.map((_, index) => {
						const columnCount = index + 1;

						return {
							label: `${columnCount} Columns`,
							value: `${columnCount}`
						};
					})}
					disabled={smallView}
				/>
			}
			useDarkBackground
		>
			<ManagedMasterDetail
				style={{ maxHeight: 600 }}
				title="Managed Master Detail Layout"
				views={views.map((view, i) => {
					return {
						id: view.id,
						label: view.label,
						key: view.id,
						content: (props: ContentProps) => {
							const index = i + 1;

							return (
								<DummyContent
									id={view.id}
									name={view.label}
									fullscreen={props.fullScreen}
									fullscreenable={props.fullScreenable}
									smallView={!!smallView}
									titleAriaLevel={index}
									onNext={index < views.length ? (triggerElementId) => props.onNext({ triggerElementId }) : undefined}
									onPrevious={index > 1 ? props.onPrevious : undefined}
									onFullscreenToggled={(fullscreenButtonId): void =>
										props.onFullscreenToggled(index - 1, fullscreenButtonId)
									}
									views={views}
									replacement={{ currentViewId: view.id, replacerViewId: view.replacedByViewId }}
									handleReplace={(currentId, replacerId) => {
										handleReplace(currentId, replacerId);
										props.onReplace?.(currentId, replacerId);
									}}
								/>
							);
						}
					};
				})}
				columnCount={columnCount}
				fullScreenable={columnCount > 1}
				onSizeChange={handleWindowSizeChanged}
			/>
		</ConfigurationView>
	);
};
