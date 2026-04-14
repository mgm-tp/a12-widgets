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

import type { ReactElement, MouseEvent, TouchEvent, KeyboardEvent } from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import { styled, css } from "styled-components";

import { active, darkFocus, hover } from "../../theme/base/mixins/_interaction.js";
import {
	joinClassNames,
	addPrefix,
	isElementFocusable,
	getParentElement,
	getAllInteractiveElements
} from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { CardProps } from "./card.api.js";

const baseClassName = addPrefix("card");

const cardContainerLayout = css`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const StyledMediaWrapper = styled.div.withConfig({ displayName: "StyledMediaWrapper-sc-" })(({ theme }) => {
	const { media } = theme.components.card;

	return css`
		box-sizing: border-box;
		background-color: ${media.backgroundColor};
		max-height: ${media.maxHeight};
		min-height: ${media.minHeight};
		overflow: hidden;
		padding: ${media.padding};
		display: flex;
		align-items: center;
		justify-content: center;
	`;
});

const StyledContentWrapper = styled.div.withConfig({ displayName: "StyledContentWrapper-sc-" })(({ theme }) => {
	const { fontSize, fontFamily } = theme.components.card.content;

	return css`
		font-family: ${fontFamily};
		font-size: ${fontSize};
		position: relative;
	`;
});

const cardElementSpacing = css`
	${StyledContentWrapper}:last-child {
		padding-bottom: 4px;
	}

	> *:not(:only-child) {
		&:not(:nth-of-type(1)) {
			margin: ${({ theme }) => theme.components.card.childMargin};
		}
		&:nth-of-type(1) {
			margin: ${({ theme }) => theme.components.card.firstChildMargin};
		}
	}
`;

const StyledCardWrapper = styled.div`
	${cardElementSpacing}
	${cardContainerLayout}
    box-sizing: border-box;
	height: 100%;
	// Add this padding to take spaces for outline, prevent cutting off problem
	padding: ${({ theme }) =>
		theme.focusStyles.focusedBoundaryDark !== "inherit" && theme.focusStyles.focusedBoundaryDark.split(" ")[0]};
`;

const StyledActionAreaWrapper = styled.div.withConfig({ displayName: "StyledActionAreaWrapper-sc-" })<{
	noEffect?: boolean;
}>(({ theme, noEffect }) => {
	const { actionArea } = theme.components.card;

	return css`
		${cardElementSpacing}
		${cardContainerLayout}
		color: inherit;
		cursor: pointer;
		position: relative;
		flex-grow: 1;
		overflow: hidden;
		&:before {
			content: "";
			bottom: 0;
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
		}
		${!noEffect &&
		css`
			${active(css`
				&:before {
					border: ${actionArea.activeBorder};
				}
			`)}
			${hover(css`
				&:before {
					border: ${actionArea.hoverBorder};
				}
			`)}

		&:focus {
				box-shadow: ${actionArea.focusBoxShadow};
				${darkFocus}
				&:before {
					border: ${actionArea.focusBorder};
				}
			}
		`}

		${StyledContentWrapper}:last-child {
			padding-bottom: 4px;
		}
	`;
});

export function Card(props: CardProps): ReactElement<CardProps> {
	return (
		<StyledCardWrapper
			id={props.id}
			style={props.style}
			className={joinClassNames(baseClassName, props.className)}
			data-role={DataRoles.Card}
		>
			{props.children}
		</StyledCardWrapper>
	);
}

Card.displayName = "Card";

export namespace Card {
	export function Media(props: CardProps.MediaProps): ReactElement<CardProps.MediaProps> {
		const classNames = joinClassNames(`${baseClassName}__media`, props.className);

		return (
			<StyledMediaWrapper id={props.id} className={classNames} style={props.style} data-role={DataRoles.Card.Media}>
				{props.children}
			</StyledMediaWrapper>
		);
	}

	Media.displayName = "Card.Media";

	export function Content(props: CardProps.ContentProps): ReactElement<CardProps.ContentProps> {
		return (
			<StyledContentWrapper
				id={props.id}
				style={props.style}
				className={joinClassNames(`${baseClassName}__content`, props.className)}
				data-role={DataRoles.Card.Content}
			>
				{props.children}
			</StyledContentWrapper>
		);
	}

	Content.displayName = "Card.Content";

	export function ActionArea(props: CardProps.ActionAreaProps): ReactElement<CardProps.ActionAreaProps> {
		const { onClick, onKeyDown, id, style, className, children, useLinkRole = true } = props;
		const actionAreaRef = useRef<HTMLDivElement | null>(null);
		const [noEffect, setNoEffect] = useState<boolean>(false);

		const handleCardHoverAndTouch = useCallback(
			(event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
				if (
					event.target &&
					event.target !== actionAreaRef.current &&
					(isElementFocusable(event.target as HTMLElement) ||
						getParentElement(
							event.target as HTMLElement,
							(p) => !!(actionAreaRef.current?.contains(p) && isElementFocusable(p) && actionAreaRef.current !== p)
						))
				) {
					actionAreaRef.current?.classList.add(`${baseClassName}__action-area--no-effect`);
					setNoEffect(true);
				} else {
					actionAreaRef.current?.classList.remove(`${baseClassName}__action-area--no-effect`);
					setNoEffect(false);
				}
			},
			[actionAreaRef]
		);

		const removeNoEffectClass = useCallback(() => {
			actionAreaRef.current?.classList.remove(`${baseClassName}__action-area--no-effect`);
			setNoEffect(false);
		}, [actionAreaRef]);

		const handleKeyDown = useCallback(
			(event: KeyboardEvent<HTMLElement>): void => {
				if (onClick && event.key === "Enter") {
					onClick(event as any);
				}

				onKeyDown?.(event);
			},
			[onClick, onKeyDown]
		);

		useEffect(() => {
			if (actionAreaRef.current && getAllInteractiveElements(actionAreaRef.current).length) {
				actionAreaRef.current?.removeAttribute("role");
			}
		}, []);

		return (
			<StyledActionAreaWrapper
				noEffect={noEffect}
				ref={actionAreaRef}
				role={useLinkRole ? "link" : undefined}
				id={id}
				style={style}
				className={joinClassNames(`${baseClassName}__action-area`, className)}
				tabIndex={0}
				data-role={DataRoles.Card.ActionArea}
				onClick={onClick}
				onMouseOver={handleCardHoverAndTouch}
				onMouseLeave={removeNoEffectClass}
				onTouchStart={handleCardHoverAndTouch}
				onTouchEnd={removeNoEffectClass}
				onKeyDown={handleKeyDown}
			>
				{children}
			</StyledActionAreaWrapper>
		);
	}

	ActionArea.displayName = "Card.ActionArea";
}
