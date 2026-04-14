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

import type { ReactElement, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import type { Layoutable, VisibleView } from "../../src/layout/master-detail/main/master-detail.api.js";
import { FocusLastLayout } from "../../src/layout/master-detail/main/master-detail.default-model.js";
import { ContentBoxElements } from "../../src/contentbox/main/template/contentbox.tpl.view.js";
import { MasterDetail } from "../../src/layout/master-detail/main/master-detail.view.js";
import type { SizeDetectorProps } from "../../src/layout/size-detector/main/size-detector.api.js";
import { ActionContentbox } from "../../src/contentbox/main/action-contentbox/action-contentbox.view.js";
import { Button } from "../../src/button/main/button.view.js";

export type LayoutIdentifier = "OverView" | "Detail";

type LayoutIdentifierGeneralType = LayoutIdentifier & Layoutable;

const layoutManager: FocusLastLayout<LayoutIdentifierGeneralType> = new FocusLastLayout<LayoutIdentifierGeneralType>([
	"OverView",
	"Detail"
]);

export const MasterDetailExample = ({
	resizeOptions
}: {
	resizeOptions: {
		minWidth: string | number;
		maxWidth: string | number;
	};
}): ReactElement => {
	const [openDetailView, setOpenDetailView] = useState<boolean>(false);
	const [smallView, setSmallView] = useState<boolean>(false);

	layoutManager.columnCount = useMemo(() => (smallView ? 1 : 2), [smallView]);
	layoutManager.goto("OverView");

	const onCloseDetailView = (): void => {
		setOpenDetailView(false);
	};

	layoutManager.goto(openDetailView ? "Detail" : "OverView");

	const overView = useCallback(() => {
		return {
			key: "OverView",
			element: (
				<ContentBoxWrapper title="OverView" key="OverView">
					<div id="overview-test">
						Overview{" "}
						<Button onClick={() => setOpenDetailView(true)} id="open-detail-test">
							Click to open Detail View
						</Button>
					</div>
				</ContentBoxWrapper>
			),
			resizableOptions: resizeOptions
		};
	}, [resizeOptions]);

	const detailView = useCallback(
		() => ({
			key: "Detail",
			element: (
				<ContentBoxWrapper
					title="Detail"
					onBack={smallView ? () => setOpenDetailView(false) : undefined}
					onClose={!smallView ? onCloseDetailView : undefined}
					key="Detail"
				>
					{openDetailView && <div>Detail view</div>}
				</ContentBoxWrapper>
			)
		}),
		[openDetailView, smallView]
	);

	const handleWindowSizeChanged = useCallback((breakPoint: SizeDetectorProps.BreakPoint): void => {
		setSmallView(breakPoint.size === "sm" || breakPoint.size === "xs");
	}, []);

	const visibleViews = useCallback(() => {
		const updatedViews: VisibleView[] = [];

		if (smallView) {
			updatedViews[0] = openDetailView ? detailView() : overView();
		} else {
			updatedViews[0] = overView();

			if (openDetailView) {
				updatedViews[1] = detailView();
			}
		}

		return updatedViews;
	}, [detailView, openDetailView, overView, smallView]);

	return (
		<div style={{ width: "100%" }}>
			<MasterDetail visibleViews={visibleViews()} onSizeChange={handleWindowSizeChanged} listenToWindowSize={false} />
		</div>
	);
};

export interface ContentBoxWrapperProps {
	title: string;
	children?: ReactNode;
	footerContent?: ReactNode;
	onBack?(): void;
	onClose?(): void;
}

export function ContentBoxWrapper(props: ContentBoxWrapperProps): ReactElement<ContentBoxWrapperProps> {
	return (
		<ActionContentbox
			padding={true}
			headingPrefixes={props.onBack && <ContentBoxElements.BackButton onClick={props.onBack} />}
			headingElements={<ContentBoxElements.Title text={props.title} />}
			headingButtons={
				props.onClose && <ContentBoxElements.CloseButton id="close-button-test" onClick={props.onClose} />
			}
			footer={<ContentBoxElements.Footer>{props.footerContent}</ContentBoxElements.Footer>}
			role="form"
			ariaLabel="Detail form"
			tabIndex={-1}
		>
			{props.children}
		</ActionContentbox>
	);
}
