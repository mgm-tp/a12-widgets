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

import type { ReactElement, FC } from "react";
import { useRef, useCallback, useEffect } from "react";

import { joinClassNames, addPrefix } from "../../../common/main/utils.js";
import type { Ref } from "../../../common/main/base-props.js";
import { useElementSizeDetector, useWindowSize } from "../../size-detector/main/size-detector.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { MasterDetailProps } from "./master-detail.api.js";
import { Body, Header } from "./master-detail.internal.js";
import { StyledMasterDetailLayoutView } from "./master-detail.styled.js";
import { TransitionProvider } from "./master-detail.context.js";

const baseClassName = addPrefix("masterDetailLayout");

/**
 * Master Detail view. See props for configuration.
 */
function MasterDetailTemplate(props: MasterDetailProps & Ref<HTMLDivElement> & { smallView: boolean }): ReactElement {
	return (
		<StyledMasterDetailLayoutView
			smallView={props.smallView}
			className={props.className}
			id={props.id}
			style={props.style}
			data-role={DataRoles.MasterDetail.Layout.View}
			ref={props.wrapperRef}
		>
			{props.title && <Header title={props.title} />}
			<TransitionProvider>
				<Body
					smallView={props.smallView}
					visibleViews={props.visibleViews}
					animation={props.animation}
					onComponentMounted={props.onComponentMounted}
					firstViewResizableOptions={props.firstViewResizableOptions}
				/>
			</TransitionProvider>
		</StyledMasterDetailLayoutView>
	);
}

MasterDetailTemplate.displayName = "MasterDetailTemplate";

export const MasterDetail: FC<MasterDetailProps> = ({
	listenToWindowSize = true,
	onSizeChange,
	breakPoints,
	className,
	...rest
}: MasterDetailProps) => {
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const { breakPoint: windowBreakPoint } = useWindowSize({ breakPoints: breakPoints });

	const { breakPoint: elementBreakPoint } = useElementSizeDetector({
		targetRef: wrapperRef
	});

	const breakPoint = listenToWindowSize ? windowBreakPoint : elementBreakPoint;

	const smallView = breakPoint.size === "sm" || breakPoint.size === "xs";
	const classNames = joinClassNames(baseClassName, { [`${baseClassName}--small-view`]: smallView }, className);

	const getWrapperRef = useCallback((ref: HTMLDivElement | null) => {
		wrapperRef.current = ref;
	}, []);

	useEffect(() => {
		onSizeChange?.(breakPoint);
	}, [breakPoint, onSizeChange]);

	return <MasterDetailTemplate {...rest} smallView={smallView} wrapperRef={getWrapperRef} className={classNames} />;
};

MasterDetail.displayName = "MasterDetail";
