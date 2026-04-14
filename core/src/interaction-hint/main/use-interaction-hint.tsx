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

import type React from "react";
import { useContext, useMemo } from "react";
import merge from "deepmerge";

import type {
	InteractionHintComponentKey,
	InteractionHintConfig,
	InteractionHintProps
} from "./interaction-hint.api.js";
import type { InteractionHintConfigContextProps } from "./interaction-hint-context.js";
import { InteractionHintConfigContext } from "./interaction-hint-context.js";
import { InteractionHint } from "./interaction-hint.view.js";

/** @internal */
export function resolveHintConfig(
	context: InteractionHintConfigContextProps,
	componentKey?: InteractionHintComponentKey
): InteractionHintConfig {
	const baseConfig = {
		enabled: context.enableInteractionHint,
		followCursor: context.followCursor,
		hideArrow: context.hideArrow
	};

	if (!componentKey) {
		return baseConfig;
	}

	const componentConfig = context.componentConfigs?.[componentKey];

	if (componentConfig === undefined) {
		return baseConfig;
	}

	if (typeof componentConfig === "boolean") {
		return merge(baseConfig, { enabled: componentConfig });
	}

	return merge(baseConfig, componentConfig);
}

/** @internal */
export interface UseInteractionHintResult {
	title?: string;
	hintRenderer: (() => React.ReactElement | null) | null;
}

/** @internal */
export function useInteractionHint(
	props: InteractionHintProps & { title?: string; componentKey?: InteractionHintComponentKey }
): UseInteractionHintResult {
	const { title, componentKey } = props;

	const context = useContext(InteractionHintConfigContext);

	const config = useMemo(() => resolveHintConfig(context, componentKey), [componentKey, context]);

	const hintRenderer = useMemo(() => {
		if (!config.enabled || !title) {
			return null;
		}

		return () => <InteractionHint {...props} {...config} />;
	}, [config, props, title]);

	return {
		title: config.enabled && title ? undefined : title,
		hintRenderer
	};
}
