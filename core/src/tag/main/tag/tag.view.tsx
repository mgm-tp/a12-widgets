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

import type { MouseEvent, ReactElement } from "react";
import { useContext, useRef, useState, useEffect } from "react";
import { styled, css, keyframes } from "styled-components";

import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { Icon, StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { Button } from "../../../button/main/button.view.js";
import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { active, hover } from "../../../theme/base/mixins/_interaction.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { TagProps } from "./tag.api.js";

const baseClassName = addPrefix("tag");

const slideOutLeft = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

export const StyledTagWrapper = styled.div.withConfig({ displayName: "StyledTagWrapper-sc-" })<
	Pick<TagProps, "removable">
>(({ theme, removable }) => {
	const { tag } = theme.components;

	return css`
		background-color: ${tag.backgroundColor};
		border-radius: ${tag.borderRadius};
		display: inline-block;
		min-height: ${tag.minHeight};
		overflow: hidden;
		position: relative;

		${removable &&
		css`
			> ${StyledTagContent} {
				padding-right: ${tag.removable.contentPaddingRight};
			}
		`}
		&--focus ${StyledTagContent} {
			border-color: ${tag.content.focusBorderColor};
		}

		&.${baseClassName}--exit {
			border-color: transparent;
			margin: ${tag.exitTransition.margin};
			transition: border-color ${tag.exitTransition.duration} cubic-bezier(0.96, 0.01, 0.95, 0.01);
			vertical-align: bottom;

			${StyledTagIcon}, ${StyledTagContent}, ${StyledRemovableButton} {
				line-height: 0;
				margin: 0;
				max-height: ${tag.minHeight};
				opacity: 0;
				overflow: hidden;
				padding: 0;
				transition:
					padding ${tag.exitTransition.duration} cubic-bezier(0.215, 0.61, 0.355, 1),
					opacity ${tag.exitTransition.duration} cubic-bezier(0.215, 0.61, 0.355, 1);
				width: 0;
			}
		}

		&.${baseClassName}--exit-animation {
			animation: ${slideOutLeft} ${tag.exitTransition.duration};
			animation-fill-mode: both;
		}
	`;
});

const StyledTagIcon = styled.div.withConfig({ displayName: "StyledTagIcon-sc-" })<{ bgColor?: string }>(
	({ theme, bgColor }) => {
		const { tag } = theme.components;

		return css`
			align-items: center;
			background-color: ${bgColor ?? tag.icon.backgroundColor};
			border-radius: 0 50% 50% 0;
			display: flex;
			flex: 0 0 auto;
			height: ${tag.icon.size};
			width: ${tag.icon.size};
			justify-content: center;
			position: absolute;

			${StyledIconWrapper} {
				color: ${tag.icon.color};
				font-size: ${tag.icon.fontSize};
			}

			& + ${StyledTagContent} {
				padding-left: ${tag.icon.contentPaddingLeft};
			}
		`;
	}
);

export const StyledTagContent = styled.div.withConfig({ displayName: "StyledTagContent-sc-" })<{
	borderColor?: string;
}>(({ theme, borderColor }) => {
	const { tag } = theme.components;

	return css`
		border: ${tag.content.border};
		border-color: ${borderColor};
		border-radius: inherit;
		color: ${tag.content.color.default};
		cursor: default;
		display: table-cell;
		flex: 0 1 auto;
		font-family: ${tag.content.fontFamily};
		font-size: ${tag.content.fontSize};
		min-height: ${tag.minHeight};
		line-height: ${tag.content.lineHeight};
		padding: ${tag.content.padding};
		vertical-align: middle;

		a {
			color: ${tag.content.linkColor};
			text-decoration: none;

			${active(css`
				color: ${tag.content.color.active};
			`)}
			${hover(css`
				color: ${tag.content.color.hover};
			`)}
        	&:focus {
				color: ${tag.content.color.focus};
			}
		}
		> ${StyledIconWrapper} {
			vertical-align: top; /* Removes the extra white space below the baseline */
		}
	`;
});

const StyledRemovableButton = styled(Button).withConfig({ displayName: "StyledRemovableButton-sc-" })<{
	isSingleLine?: boolean;
}>(({ theme, isSingleLine }) => {
	const { tag } = theme.components;

	return css`
		font-size: ${tag.removable.closeButton.fontSize};
		position: absolute;
		right: 0;
		top: 0;
		min-height: 0;
		height: ${tag.removable.closeButton.size};
		width: ${tag.removable.closeButton.size};
		padding: ${tag.removable.closeButton.padding};

		&:hover {
			border-top-right-radius: inherit;
			${isSingleLine &&
			css`
				border-bottom-right-radius: inherit;
			`}
		}
	`;
});

export function Tag(props: TagProps): ReactElement<TagProps> {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const contentRef = useRef<HTMLDivElement | null>(null);
	const removableButtonRef = useRef<HTMLButtonElement | null>(null);
	const [isSingleLine, setIsSingleLine] = useState(false);
	const a11yTitles = languageContext.tagTitles;
	const {
		removable,
		className,
		id,
		icon,
		color,
		children,
		disabledRemoveButton,
		tabIndex,
		noWaiAria,
		wrapperRef,
		onRemove,
		onMouseDown,
		onClick,
		onKeyDown,
		...rest
	} = props;
	const classNames = joinClassNames(baseClassName, { [`${baseClassName}--removable`]: removable }, className);
	const ariaRole = noWaiAria ? undefined : "listitem";

	const leftIcon = icon && (
		<StyledTagIcon className={`${baseClassName}__icon`} bgColor={color} data-role={DataRoles.Tag.Icon}>
			{icon}
		</StyledTagIcon>
	);

	const handleContentRef = (element: HTMLDivElement | null): void => {
		contentRef.current = element;
	};

	const handleRemovableButtonRef = (element: HTMLButtonElement | null): void => {
		removableButtonRef.current = element;
	};

	const checkSingleLineContent = (): void => {
		setTimeout(() => {
			if (contentRef.current && removableButtonRef.current) {
				const contentHeight = contentRef.current?.getBoundingClientRect().height;
				const removableButtonHeight = removableButtonRef.current?.getBoundingClientRect().height;

				setIsSingleLine(contentHeight <= removableButtonHeight);
			}
		}, 600); // make sure the content finishes rendering to get its correct height
	};

	useEffect(() => {
		window.addEventListener("resize", checkSingleLineContent);

		return (): void => {
			window.removeEventListener("resize", checkSingleLineContent);
		};
	}, []);

	useEffect(() => {
		checkSingleLineContent();
	}, [contentRef]);

	const ids = id
		? {
				content: `${id}-content`,
				buttonTitleHiddenText: `${id}-button-title-hidden-text`
			}
		: undefined;

	const removeButtonLabelledBy = ids && `${ids.buttonTitleHiddenText} ${ids.content}`;

	return (
		<StyledTagWrapper
			className={classNames}
			id={id}
			onClick={onClick}
			onKeyDown={onKeyDown}
			onMouseDown={(event: MouseEvent<HTMLElement>) => {
				onMouseDown?.(id || "", event);
			}}
			tabIndex={tabIndex}
			data-role={DataRoles.Tag}
			role={ariaRole}
			aria-hidden={noWaiAria}
			ref={wrapperRef}
			removable={removable}
			{...rest}
		>
			{leftIcon}
			<StyledTagContent
				className={`${baseClassName}__content`}
				borderColor={color}
				data-role={DataRoles.Tag.Content}
				ref={handleContentRef}
				id={ids?.content}
			>
				{children}
			</StyledTagContent>
			{removable && (
				<StyledRemovableButton
					tabIndex={tabIndex}
					icon={<Icon>close</Icon>}
					title={a11yTitles && a11yTitles.deleteTagButton}
					disabled={disabledRemoveButton}
					isSingleLine={isSingleLine}
					buttonRef={handleRemovableButtonRef}
					onClick={(event) => {
						event.stopPropagation();
						onRemove?.();
					}}
					onMouseDown={(event) => event.stopPropagation()}
					buttonAttributes={{
						"aria-labelledby": removeButtonLabelledBy
					}}
				>
					{ids?.buttonTitleHiddenText && a11yTitles?.deleteTagButton && (
						<HiddenText id={ids.buttonTitleHiddenText}>{a11yTitles.deleteTagButton}</HiddenText>
					)}
				</StyledRemovableButton>
			)}
		</StyledTagWrapper>
	);
}

Tag.displayName = "Tag";
