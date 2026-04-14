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
import { useContext, Children, isValidElement, createRef, cloneElement } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { styled } from "styled-components";

import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { StyledTagWrapper, Tag } from "./tag/tag.view.js";
import type { TagGroupProps } from "./tag-group.api.js";
import type { TagProps } from "./tag/tag.api.js";

const baseClassName = addPrefix("tag");

export const StyledTagGroup = styled.div.withConfig({ displayName: "StyledTagGroup-sc-" })`
	box-sizing: border-box;

	${StyledTagWrapper} {
		margin: ${({ theme }) => theme.components.tag.group.margin};
		vertical-align: middle;
	}
`;

export const TagGroup: FC<TagGroupProps> = ({
	animationTimeout = 300,
	children,
	className,
	id,
	noWaiAria,
	onBlur,
	onFocus,
	onClick,
	onKeyDown,
	onMouseLeave,
	onMouseOver,
	onTouchEnd,
	onTouchStart,
	style,
	tabIndex,
	wrapperRef
}: TagGroupProps): ReactElement<TagGroupProps> => {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const tagTitles = languageContext.tagTitles;
	const tagChildren: ReactElement[] = [];
	//  in case of using Tag Group in Tag Input,
	// there will be child elements that are not Tag elements and should not be included inside the Tags list
	const otherChildren: any = [];

	Children.forEach(children, (child, index) => {
		if (isValidElement<TagProps>(child) && child.type === Tag) {
			const nodeRef = child.props.wrapperRef ?? createRef<HTMLDivElement>();

			tagChildren.push(
				<CSSTransition
					key={child.key || "tag-" + index}
					classNames={{
						enter: `${baseClassName}-enter`,
						exit: `${baseClassName}--exit`,
						exitActive: `${baseClassName}--exit-animation`
					}}
					timeout={animationTimeout}
					nodeRef={nodeRef}
				>
					{/* @ts-expect-error Fix this ref code because it's incorrect to create ref this way */}
					{cloneElement(child, { wrapperRef: nodeRef })}
				</CSSTransition>
			);
		} else {
			otherChildren.push(child);
		}
	});

	const ariaRole = noWaiAria ? "none" : "list";
	const ariaLabel = noWaiAria ? undefined : tagTitles?.ariaLabel;

	return (
		<StyledTagGroup
			id={id}
			style={style}
			className={joinClassNames(`${baseClassName}-group`, className)}
			onKeyDown={onKeyDown}
			tabIndex={tabIndex}
			data-role={DataRoles.TagGroup}
			role={ariaRole}
			aria-label={ariaLabel}
			ref={wrapperRef}
			onFocus={onFocus}
			onClick={onClick}
			onBlur={onBlur}
			onMouseOver={onMouseOver}
			onMouseLeave={onMouseLeave}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
		>
			<TransitionGroup component={null}>{tagChildren}</TransitionGroup>
			{otherChildren}
		</StyledTagGroup>
	);
};

TagGroup.displayName = "TagGroup";
