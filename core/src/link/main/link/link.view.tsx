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

import { styled, css } from "styled-components";
import type { ReactElement, MouseEvent, KeyboardEvent } from "react";
import { useCallback, useRef } from "react";

import { joinClassNames, addPrefix, Key as CustomKey } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { active as activeMixin, activeAndHover, hover as hoverMixin } from "../../../theme/base/mixins/_interaction.js";
import { useInteractionHint } from "../../../interaction-hint/main/use-interaction-hint.js";
import { createBorder } from "../../../theme/base/mixins/_borderEffects.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";

import type { LinkProps } from "./link.api.js";

export const StyledLink = styled.a.withConfig({ displayName: "StyledLink-sc-" })<{ $disabled?: boolean }>(
	({ theme, $disabled }) => {
		const {
			backgroundSize,
			color,
			fontWeight,
			fontFamily,
			fontSize,
			icon,
			visitedColor,
			active,
			hover,
			focus,
			transitionTiming
		} = theme.components.link;

		return css`
			background-position: -10000% bottom;
			background-repeat: no-repeat;
			background-size: ${backgroundSize};
			color: ${color};
			font-family: ${fontFamily};
			font-size: ${fontSize};
			font-weight: ${fontWeight};
			outline: none;
			text-decoration: none;

			${StyledIconWrapper} {
				color: inherit;
				display: inline;
				font-size: ${icon.fontSize};
				margin: ${icon.margin};
				vertical-align: ${icon.verticalAlign};
			}

			${!$disabled &&
			css`
				&:visited {
					color: ${visitedColor};
				}

				${activeAndHover(css`
					background-position: left bottom;
					transition: background-position ${transitionTiming};
				`)}

				${activeMixin(css`
					background-image: ${active.backgroundImage};
					color: ${active.color};
					text-decoration: ${active.textDecoration};
				`)}

				${hoverMixin(css`
					background-image: ${hover.backgroundImage};
					color: ${hover.color};
					cursor: pointer;
					text-decoration: ${hover.textDecoration};
				`)}

        	&:focus {
					background-image: ${focus.backgroundImage};
					background-position: left bottom;
					color: ${focus.color};
					outline: ${focus.outline};
					text-decoration: ${focus.textDecoration};
					${focus.customBorder &&
					css`
						${createBorder(focus.customBorder)};
					`}
				}
			`}
		`;
	}
);

export function Link(props: LinkProps): ReactElement<LinkProps> {
	const {
		className,
		children,
		wrapperRef,
		href,
		onClick,
		title,
		useAsButton,
		showHiddenText = true,
		linkAttributes,
		...rest
	} = props;
	const isDisabled = !!linkAttributes?.["aria-disabled"];

	// Prevent dragging of Link while allow selection
	const linkRef = useRef<HTMLAnchorElement | null>(null);
	const ariaLabel = linkAttributes?.["aria-label"];
	const linkTitle = title ?? linkAttributes?.["title"];
	const linkAriaLabel =
		ariaLabel && linkTitle && ariaLabel !== linkTitle ? `${ariaLabel} ${linkTitle}` : (ariaLabel ?? linkTitle);

	const { title: resolvedTitle, hintRenderer } = useInteractionHint({
		title: showHiddenText ? linkTitle : undefined,
		componentKey: "link",
		referenceElementRef: linkRef
	});

	// Due to React ban of javascript: URL, we need to see if the href is not set and prevent navigation
	const handleClick = useCallback(
		(event: MouseEvent<HTMLAnchorElement>): void => {
			if (!href) {
				event.preventDefault();
			}

			onClick?.(event);
		},
		[href, onClick]
	);

	// If the link is used as a button, the click event can be triggered by the Spacebar.
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLAnchorElement>): void => {
			if (useAsButton && event.key === CustomKey.Space) {
				event.preventDefault();
				linkRef.current?.click();
			}
		},
		[useAsButton]
	);

	const handleRef = useCallback(
		(instance: HTMLAnchorElement | null) => {
			linkRef.current = instance;
			wrapperRef?.(instance);
		},
		[wrapperRef]
	);

	return (
		<StyledLink
			className={joinClassNames(addPrefix("link"), className)}
			tabIndex={isDisabled ? -1 : 0}
			title={resolvedTitle}
			href={href || "#"}
			data-role={DataRoles.Link}
			role={useAsButton ? "button" : undefined}
			ref={handleRef}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			$disabled={isDisabled}
			{...linkAttributes}
			{...rest}
		>
			{children}
			{linkAriaLabel && showHiddenText && !!hintRenderer && <HiddenText>{linkAriaLabel}</HiddenText>}
			{hintRenderer?.()}
		</StyledLink>
	);
}

Link.displayName = "Link";
