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
import { useRef, useState, useCallback } from "react";
import { useResizeDetector } from "react-resize-detector";
import type { OnResizeCallback, ResizePayload } from "react-resize-detector";

import { DataRoles } from "../../common/main/data-roles.js";

import type { StatusProps } from "./status.api.js";
import {
	StyledStatusContainer,
	StyledStatusIcon,
	StyledStatusLabelWrapper,
	StyledStatusLabel
} from "./status.styled.js";

export function Status(props: StatusProps): ReactElement<StatusProps> {
	const { icon, children, variant = "info", ...rest } = props;
	const iconRef = useRef<HTMLDivElement>(null);
	const [isLongText, setIsLongText] = useState(false);

	const handleSizeChange = useCallback<OnResizeCallback>(
		({ height }: ResizePayload) => {
			if (iconRef.current && height) {
				setIsLongText(height > iconRef.current.getBoundingClientRect().height);
			}
		},
		[iconRef]
	);

	const { ref } = useResizeDetector({
		handleWidth: false,
		onResize: handleSizeChange,
		refreshMode: "debounce",
		refreshRate: 0
	});

	return (
		<StyledStatusContainer variant={variant} data-role={DataRoles.Status} {...rest}>
			{icon && (
				<StyledStatusIcon data-role={DataRoles.Status.Icon} ref={iconRef}>
					{icon}
				</StyledStatusIcon>
			)}
			{children && (
				<StyledStatusLabelWrapper data-role={DataRoles.Status.Label.Wrapper} ref={ref} $longText={isLongText}>
					<StyledStatusLabel data-role={DataRoles.Status.Label}>{children}</StyledStatusLabel>
				</StyledStatusLabelWrapper>
			)}
		</StyledStatusContainer>
	);
}

Status.displayName = "Status";
