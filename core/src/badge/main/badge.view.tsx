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

import type { FC, ReactElement } from "react";
import { useContext, useRef, useCallback, useEffect, useMemo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { styled, css } from "styled-components";

import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { BadgeProps } from "./badge.api.js";
import { getBadgeTitle } from "./badge-utils.js";

const baseClassName = addPrefix("badge");
const wrapperBaseClassName = addPrefix("badge-wrapper");

export const StyledBadge = styled.span.withConfig({ displayName: "StyledBadge-sc-" })<BadgeProps>(
	({ theme, tiny, variant, light }) => {
		const { badge } = theme.components;

		return css`
			align-items: center;
			border-radius: ${badge.borderRadius};
			box-shadow: ${badge.boxShadow};
			display: inline-flex;
			flex-shrink: 0;
			font-family: ${badge.fontFamily};
			font-size: ${badge.fontSize};
			font-weight: ${badge.fontWeight};
			height: ${badge.height};
			line-height: normal;
			outline: 1px solid transparent; //support a visual indication when customizing the color settings on browser
			padding: ${badge.padding};
			transform: scale(1);
			transition: ${badge.transition};

			${light && variant == "info"
				? css`
						background-color: ${badge.background.light};
						color: ${badge.colorVariant?.light};
					`
				: variant &&
					css`
						background-color: ${badge.background[variant]};
						color: ${badge.colorVariant?.[variant]};
					`}

			${tiny &&
			css`
				height: ${badge.tiny.height};
				padding: 0;
				width: ${badge.tiny.width};
			`}
		`;
	}
);

export const StyledBadgeWrapper = styled.span.withConfig({ displayName: "StyledBadgeWrapper-sc-" })<BadgeProps>(
	({ theme, standalone, tiny, position }) => {
		const { badge } = theme.components;
		const shouldIgnoreDefaultPosition = position && !standalone;

		return css`
			display: inline-flex;
			position: ${standalone ? "static" : "absolute"};

			${shouldIgnoreDefaultPosition
				? css`
						&&& {
							top: ${position?.top !== undefined ? `${position?.top}px` : "unset"};
							right: ${position?.right !== undefined ? `${position?.right}px` : "unset"};
							bottom: ${position?.bottom !== undefined ? `${position?.bottom}px` : "unset"};
							left: ${position?.left !== undefined ? `${position?.left}px` : "unset"};
						}
					`
				: !standalone &&
					!tiny &&
					css`
						top: calc(${badge.height} * -0.675);
					`}

			&.${wrapperBaseClassName}-exit-active ${StyledBadge} {
				transform: scale(0);
			}

			&.${wrapperBaseClassName}-enter ${StyledBadge} {
				transform: scale(0);
			}

			&.${wrapperBaseClassName}-enter-active ${StyledBadge} {
				transform: scale(1);
			}
		`;
	}
);

export const StyledTinyBadgeWrapper = styled(StyledBadgeWrapper).withConfig({
	displayName: "StyledTinyBadgeWrapper-sc-"
})(({ theme, tiny }) => {
	const { badge } = theme.components;

	return css`
		${tiny &&
		css`
			right: calc(${badge.tiny.width} * -0.5);
			top: calc(${badge.tiny.height} * -0.5);
		`}
	`;
});

export const Badge: FC<BadgeProps> = (props: BadgeProps): ReactElement<BadgeProps> => {
	const { variant = "info", overflowCount = 9999, title, tiny, count, enabledInteractionHint } = props;
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const badgeWrapperRef = useRef<HTMLElement | null>(null);
	const parentRef = useRef<HTMLElement | null>(null);
	const parentPrevPosition = useRef<string>("");

	const badgeTitle = getBadgeTitle({ title, count, tiny, variant }, languageContext.badgeTitles);

	const calculatePosition = useCallback(() => {
		if (badgeWrapperRef.current) {
			const shouldIgnoreDefaultPosition = props.position && !props.standalone;

			parentRef.current = badgeWrapperRef.current.parentElement;
			const parentElementDataRole = parentRef.current?.dataset.role || "";

			if (!parentRef.current || ["menu-item-icon", "menu-item-text"].includes(parentElementDataRole)) {
				return;
			}

			parentPrevPosition.current = parentRef.current.style.position;
			parentRef.current.style.position = "relative";

			if (!props.tiny && !shouldIgnoreDefaultPosition) {
				const { width } = badgeWrapperRef.current.getBoundingClientRect();
				badgeWrapperRef.current.style.right = Math.floor(width * -0.5) + "px";
			}
		}
	}, [props.position, props.standalone, props.tiny]);

	useEffect(() => {
		window.addEventListener("load", calculatePosition);

		return (): void => {
			window.removeEventListener("load", calculatePosition);

			if (parentRef.current) {
				parentRef.current.style.position = parentPrevPosition.current;
			}
		};
	}, []); // eslint-disable-line

	useEffect(() => {
		calculatePosition();
	}, [calculatePosition, props.hidden]);

	const BadgeWrapper = useMemo(() => (props.tiny ? StyledTinyBadgeWrapper : StyledBadgeWrapper), [props.tiny]);
	const hiddenText = `${props.standalone ? "" : ","} ${badgeTitle}`.trim();

	return (
		<TransitionGroup component={null}>
			{!props.hidden && (
				<CSSTransition
					classNames={wrapperBaseClassName}
					timeout={props.animationTimeout || 250}
					nodeRef={badgeWrapperRef}
				>
					<BadgeWrapper
						ref={badgeWrapperRef}
						id={props.id}
						style={props.style}
						className={joinClassNames(
							wrapperBaseClassName,
							{ [`${wrapperBaseClassName}--standalone`]: props.standalone },
							{ [`${wrapperBaseClassName}--tiny`]: props.tiny },
							props.className
						)}
						data-role={DataRoles.Badge}
						standalone={props.standalone}
						tiny={props.tiny}
						position={props.position}
						title={enabledInteractionHint ? undefined : badgeTitle}
					>
						{badgeTitle && <HiddenText>{hiddenText}</HiddenText>}
						<StyledBadge
							className={joinClassNames(baseClassName, `${baseClassName}--${variant}`, {
								[`${baseClassName}--light`]: props.light
							})}
							data-role={DataRoles.Badge.Content}
							data-type={`${variant}-${DataRoles.Badge}`} // For styling in Flyout Menu
							variant={variant}
							aria-hidden={true}
							light={props.light}
							tiny={props.tiny}
						>
							{overflowCount && props.count && props.count > overflowCount ? `${overflowCount}+` : props.count}
						</StyledBadge>
					</BadgeWrapper>
				</CSSTransition>
			)}
		</TransitionGroup>
	);
};

Badge.displayName = "Badge";
