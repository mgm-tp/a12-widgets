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
import { useContext, useRef } from "react";
import { styled, css, keyframes } from "styled-components";

import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { joinClassNames, addPrefix, usePreviousProps } from "../../common/main/utils.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { fadeIn } from "../../theme/base/mixins/_animation.js";
import { active, darkFocus, hover } from "../../theme/base/mixins/_interaction.js";
import { useInteractionHint } from "../../interaction-hint/main/use-interaction-hint.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { CounterProps } from "./counter.api.js";

const baseClassName = addPrefix("counter");

const slideInDown = keyframes`
  0% {
    transform: translate3d(0, -3px, 0);
  }
  100% {
    transform: translateZ(0);
  }
`;

const slideInUp = keyframes`
  0% {
    transform: translate3d(0, 3px, 0);
  }
  100% {
    transform: translateZ(0);
  }
`;

export const StyledCounter = styled.span.withConfig({ displayName: "StyledCounter-sc-" })<{
	secondary?: boolean;
	interactive?: boolean;
	counterType?: "default" | "constructive" | "destructive";
}>(({ theme, secondary, interactive, counterType = "default" }) => {
	const { counter } = theme.components;

	return css`
		align-items: center;
		background-color: ${counter.background.default};
		border-radius: ${counter.borderRadius};
		color: ${counter.color};
		display: inline-flex;
		font-family: ${counter.fontFamily};
		font-size: ${counter.fontSize};
		font-weight: ${counter.fontWeight};
		justify-content: center;
		outline: 1px solid transparent;
		padding: ${counter.padding};
		vertical-align: middle;

		> * {
			flex-shrink: 0;
		}

		${(counterType === "destructive" || counterType === "constructive") &&
		css`
			background-color: ${counter.background[counterType]};
			color: ${counter.variantColor};
		`}

		${interactive &&
		css`
			cursor: pointer;

			&:focus {
				background-color: ${counter.focus.backgroundColor};
				color: ${counter.focus.color};
				${darkFocus}
			}

			${active(css`
				background-color: ${counter.active.backgroundColor};
				color: ${counter.active.color};
			`)}

			${hover(css`
				background-color: ${counter.hover.backgroundColor};
				color: ${counter.hover.color};
			`)}
		`}

		${secondary &&
		css`
			background: transparent;
			color: inherit;
			padding: 0;

			${StyledIconWrapper} {
				color: inherit;
			}

			${interactive &&
			css`
				&:focus {
					background-color: transparent;
					color: ${counter.secondary.focusColor};
				}

				${active(css`
					background-color: transparent;
					color: ${counter.secondary.activeColor};
				`)}
				${hover(css`
					background-color: transparent;
					color: ${counter.secondary.hoverColor};
				`)}
			`}
		`}
	`;
});

const StyledCounterAddon = styled.span.withConfig({ displayName: "StyledCounterAddon-sc-" })<{ addonAfter?: boolean }>(
	({ theme, addonAfter }) => {
		const { counter } = theme.components;

		return css`
			display: inline-flex;

			> * {
				flex-shrink: 0;
			}

			${StyledIconWrapper} {
				color: inherit;
			}

			${addonAfter
				? css`
						margin-left: ${counter.iconMargin};
					`
				: css`
						margin-right: ${counter.iconMargin};
					`}
		`;
	}
);

const StyledCounterItem = styled.span.withConfig({ displayName: "StyledCounterItem-sc-" })<{ isIncreased?: boolean }>(
	({ theme, isIncreased }) => {
		const { counter } = theme.components;

		return css`
			height: auto;
			line-height: 1rem;
			margin: 0;
			padding: 0;
			animation:
				${fadeIn()} ${counter.timing},
				${isIncreased ? slideInUp : slideInDown} ${counter.timing};
		`;
	}
);

export const Counter: FC<CounterProps> = (props: CounterProps): ReactElement<CounterProps> => {
	const { counterTitles } = useContext<A11yDefinition>(A11YLanguageContext);
	const counterRef = useRef<HTMLSpanElement | null>(null);
	const { placeholder, value, type, title, ...rest } = props;
	const prevValue = usePreviousProps(value);

	const { title: resolvedTitle, hintRenderer } = useInteractionHint({
		title: props.interactive ? title : undefined,
		componentKey: "counter",
		referenceElementRef: counterRef
	});

	const valueInReversedOrder = value !== undefined ? value.toString().split("") : [placeholder];
	const displayOverFlow =
		value !== undefined && props.overflowCount !== undefined && Number(value) > props.overflowCount;
	const hiddenValue = !displayOverFlow ? (value ?? placeholder) : `${props.overflowCount}+`;

	const wrapperClassNames = joinClassNames(
		baseClassName,
		{ [`${baseClassName}--constructive`]: type === "constructive" && !props.secondary },
		{ [`${baseClassName}--destructive`]: type === "destructive" && !props.secondary },
		{ [`${baseClassName}--secondary`]: props.secondary },
		{ [`${baseClassName}--interactive`]: props.interactive },
		props.className
	);

	const getCounterRef = (ref: HTMLSpanElement): void => {
		counterRef.current = ref;
	};

	return (
		<StyledCounter
			{...rest}
			counterType={type}
			data-role={props.dataRole ?? DataRoles.Counter}
			className={wrapperClassNames}
			tabIndex={props.interactive ? 0 : undefined}
			role={props.interactive ? "button" : undefined}
			title={resolvedTitle}
			ref={getCounterRef}
			{...props.htmlAttributes}
		>
			{props.addonBefore && (
				<StyledCounterAddon
					className={`${baseClassName}__addon ${baseClassName}__addon--before`}
					data-role={DataRoles.Counter.Addon}
				>
					{props.addonBefore}
				</StyledCounterAddon>
			)}
			{props.hiddenDescription && <HiddenText>&nbsp;{props.hiddenDescription}&nbsp;</HiddenText>}
			<HiddenText>{`${hiddenValue} ${counterTitles?.counterUnit}`}</HiddenText>
			{props.interactive && title && !!hintRenderer && <HiddenText>{`, ${title}`}</HiddenText>}
			{!displayOverFlow && (
				<span aria-hidden={true} role="presentation">
					{valueInReversedOrder.map((val, index) => {
						return (
							<StyledCounterItem
								className={`${baseClassName}__item`}
								key={`${index}-${val}`}
								isIncreased={!!value > !!prevValue || (value !== undefined && prevValue === undefined)}
							>
								{val}
							</StyledCounterItem>
						);
					})}
				</span>
			)}
			{displayOverFlow && (
				<StyledCounterItem
					className={`${baseClassName}__item`}
					aria-hidden={true}
					role="presentation"
				>{`${props.overflowCount}+`}</StyledCounterItem>
			)}
			{props.addonAfter && (
				<StyledCounterAddon className={`${baseClassName}__addon ${baseClassName}__addon--after`} addonAfter>
					{props.addonAfter}
				</StyledCounterAddon>
			)}
			{props.interactive && hintRenderer?.()}
		</StyledCounter>
	);
};

Counter.displayName = "Counter";
