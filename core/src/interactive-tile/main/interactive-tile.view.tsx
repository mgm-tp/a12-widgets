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

import type { FunctionComponent } from "react";
import { useRef } from "react";

import { useEnterAndSpaceKeyTrigger } from "../../common/main/hooks.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";

import { StyledInteractiveTile, StyledSelectedTileIcon } from "./interactive-tile.styled.js";
import type { InteractiveTileProps } from "./interactive-tile.api.js";

export const InteractiveTile: FunctionComponent<InteractiveTileProps> = (props) => {
	const {
		primary,
		secondary,
		active,
		selected,
		disabled,
		tabIndex,
		title,
		disableAriaLabel,
		dataRole,
		children,
		htmlAttributes,
		onClick,
		...rest
	} = props;

	const interactiveTileRef = useRef<HTMLDivElement | null>(null);
	const { title: resolvedTitle, hintRenderer } = useInteractionHint({
		title,
		componentKey: "interactiveTile",
		referenceElementRef: interactiveTileRef,
		focusable: !disabled
	});

	useEnterAndSpaceKeyTrigger({
		elementRef: interactiveTileRef,
		enableSpaceKeyTrigger: !htmlAttributes?.role || htmlAttributes?.role === "button",
		disabled
	});

	const baseDataRole = dataRole ?? DataRoles.InteractiveTile;
	const ariaLabel =
		htmlAttributes?.["aria-label"] && title && !!hintRenderer
			? `${htmlAttributes["aria-label"]}, ${title}`
			: (htmlAttributes?.["aria-label"] ?? title);
	const extendedHtmlAttributes = { ...htmlAttributes, "aria-label": disableAriaLabel ? undefined : ariaLabel };

	return (
		<StyledInteractiveTile
			aria-disabled={disabled}
			data-role={baseDataRole}
			tabIndex={tabIndex ?? (disabled ? -1 : 0)}
			role="button"
			ref={interactiveTileRef}
			onClick={!disabled ? onClick : undefined}
			$primary={primary}
			$secondary={secondary}
			$active={active}
			$selected={selected}
			$disabled={disabled}
			title={resolvedTitle}
			{...rest}
			{...extendedHtmlAttributes}
		>
			{selected && (
				<StyledSelectedTileIcon $primary={primary} $secondary={secondary}>
					check_circle
				</StyledSelectedTileIcon>
			)}
			{children}
			{hintRenderer?.()}
			{title && !!hintRenderer && <>{disableAriaLabel && <HiddenText>{`, ${title}`}</HiddenText>}</>}
		</StyledInteractiveTile>
	);
};

InteractiveTile.displayName = "InteractiveTile";
