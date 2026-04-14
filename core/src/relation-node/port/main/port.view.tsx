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

import type { ComponentType, SyntheticEvent, ReactElement } from "react";
import { useCallback } from "react";

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import type { Container, Styleable } from "../../../common/main/base-props.js";

import type { PortProps } from "./port.api.js";

const portBaseClassName = addPrefix("relationship-port");

/**
 * @deprecated since 38.2.0. Use {@link DiagramPort} from model-graph-diagram instead.
 * @see {@link DiagramPort}
 * @see {@link ModelDiagramPortProps}
 *
 * A Higher-Order Component that add A12 port class to the Target.
 * We do it this way to avoid dependency on react-diagrams
 */
export function createPort<InProps extends Styleable & Container, OutProps extends InProps & PortProps>(
	Target: ComponentType<InProps>
): ComponentType<OutProps> {
	// Display name will be set when using the HOC

	return function PortWidget(props: OutProps): ReactElement<OutProps> {
		const { portConnected, onClick, position, className } = props;
		const handleClick = useCallback(
			(event: SyntheticEvent<HTMLElement>) => {
				event.stopPropagation();
				event.preventDefault();
				onClick?.(event);
			},
			[onClick]
		);

		return (
			<Target
				{...props}
				className={joinClassNames(
					`${portBaseClassName}__${position}`,
					{ [`${portBaseClassName}__connected`]: portConnected },
					className
				)}
			>
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
				<div className={`${portBaseClassName}__inner`} onClick={handleClick} tabIndex={0} data-role="port">
					<div className={`${portBaseClassName}__dot`} />
				</div>
			</Target>
		);
	};
}
