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

import type { ReactElement, DetailedHTMLProps, HTMLAttributes } from "react";
import { useContext, forwardRef } from "react";
import { styled, css } from "styled-components";

import { joinClassNames } from "../../../../common/main/utils.js";
import type { Container, Styleable } from "../../../../common/main/base-props.js";
import { StyledFilterBarWrapper } from "../../../../faceted-search/main/filter-bar/filter-bar.styled.js";
import { StyledGrid, StyledGridRow } from "../../../../layout/layout-grid/main/layout-grid.styled.js";
import { StyledButton } from "../../../../button/main/button.styled.js";
import { StyledBreadCrumbWrapper } from "../../../../breadcrumb/main/breadcrumb.styled.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { ContentBoxProps } from "../contentbox.tpl.api.js";
import { StyledSubActionBarTpl } from "../sub-action-bar.tpl.view.js";
import { StyledContentBoxContext } from "../contentbox.context.js";

import { BASE_CONTENTBOX_CLASS_NAME } from "./config.js";

export namespace SubHeadingElements {
	const baseClassName = BASE_CONTENTBOX_CLASS_NAME;

	export const StyledSubHeading = styled.div.withConfig({ displayName: "StyledSubHeading-sc-" })(({ theme }) => {
		const { contentBox } = theme.components;
		const { embedded } = useContext(StyledContentBoxContext);

		return css`
			display: flex;
			flex-direction: column;
			& > *:not(:empty):not(${StyledSubActionBarTpl}) {
				border-bottom: ${contentBox.subHeading.borderBottom};
				border-top: ${contentBox.subHeading.borderTop};
			}

			${StyledFilterBarWrapper} {
				padding: ${contentBox.subHeading.filterBar.padding};
			}
			${StyledBreadCrumbWrapper} {
				background-color: ${contentBox.breadcrumbBackground};
				padding: ${contentBox.subHeading.breadcrumbListPadding};
			}

			${embedded &&
			css`
				& > * {
					background-color: inherit;
					min-height: ${contentBox.embedded.subHeading.minHeight};
					&:not(:empty):not(${StyledSubActionBarTpl}) {
						border-bottom: none;
						border-top: ${contentBox.embedded.subHeading.borderTop};
					}
				}
			`}
		`;
	});

	export function SubHeading(props: ContentBoxProps.BaseProps): ReactElement<ContentBoxProps.BaseProps> {
		const className = joinClassNames(`${baseClassName}__subheading`, props.className);

		return (
			<StyledSubHeading
				id={props.id}
				className={className}
				style={props.style}
				data-role={DataRoles.Contentbox.Subheading}
			>
				{props.children}
			</StyledSubHeading>
		);
	}

	const StyledActionBar = styled.div.withConfig({ displayName: "StyledActionBar-sc-" })(({ theme }) => {
		const { actionBar } = theme.components.contentBox;

		return css`
			align-items: center;
			box-sizing: border-box;
			background-color: ${actionBar.background};
			display: flex;
			min-height: ${actionBar.minHeight};
			padding: ${actionBar.padding};
			& > *:not(:last-child):not(:only-child):not(${StyledGrid}) {
				margin: ${actionBar.margin};
			}
			${StyledGridRow} {
				margin: 0;
			}
		`;
	});

	export function ActionBar(props: ContentBoxProps.BaseProps): ReactElement<ContentBoxProps.BaseProps> {
		const className = joinClassNames(`${baseClassName}__subheadingActionBar`, props.className);

		return (
			<StyledActionBar
				id={props.id}
				className={className}
				style={props.style}
				data-role={DataRoles.Contentbox.ActionBar}
			>
				{props.children}
			</StyledActionBar>
		);
	}

	const StyledSubActionBar = styled.div.withConfig({ displayName: "StyledSubActionBar-sc-" })(({ theme }) => {
		const { subActionBar } = theme.components.contentBox;

		return css`
			background-color: ${subActionBar.background};
			padding: ${subActionBar.padding};
		`;
	});

	export function SubActionBar(props: ContentBoxProps.BaseProps): ReactElement<ContentBoxProps.BaseProps> {
		const className = joinClassNames(`${baseClassName}__subheadingSubActionBar`, props.className);

		return (
			<StyledSubActionBar
				id={props.id}
				className={className}
				style={props.style}
				data-role={DataRoles.Contentbox.ActionBar}
			>
				{props.children}
			</StyledSubActionBar>
		);
	}

	const StyledActionBarGroupArea = styled.div.withConfig({ displayName: "StyledActionBarGroupArea-sc-" })(
		({ theme }) => {
			const { actionBar, actionBarGroupArea } = theme.components.contentBox;

			return css`
				align-items: center;
				box-sizing: border-box;
				background-color: ${actionBarGroupArea.background};
				display: flex;
				min-height: ${actionBarGroupArea.minHeight};
				padding: ${actionBar.padding};
				& > *:not(:empty) {
					align-items: center;
					flex-grow: 1;
					flex-wrap: wrap;
				}
			`;
		}
	);

	const StyledActionBarGroupAreaLeft = styled.div.withConfig({ displayName: "StyledActionBarGroupAreaLeft-sc-" })`
      display: flex;
	  &:not(:only-child) {
	    margin-right: ${(props) => props.theme.spacing.horizontalSpacing.horizWhiteSpacingsm}px;
	  }
	)`;

	const StyledActionBarGroupAreaRight = styled.div.withConfig({ displayName: "StyledActionBarGroupAreaRight-sc-" })`
      display: inline-flex;
      justify-content: flex-end;
	)`;

	const ActionBarGroupAreaSlot = forwardRef<
		HTMLDivElement,
		{
			left?: boolean;
			slotProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
		} & Styleable &
			Container
	>((props, ref) => {
		return props.left ? (
			<StyledActionBarGroupAreaLeft
				{...props.slotProps}
				ref={ref}
				className={joinClassNames(`${baseClassName}__subheadingActionBarGroupArea-left`, props?.className)}
				data-role={DataRoles.Contentbox.ActionBarGroup.AreaLeft}
			>
				{props.children}
			</StyledActionBarGroupAreaLeft>
		) : (
			<StyledActionBarGroupAreaRight
				{...props.slotProps}
				ref={ref}
				className={joinClassNames(`${baseClassName}__subheadingActionBarGroupArea-right`, props?.className)}
				data-role={DataRoles.Contentbox.ActionBarGroup.AreaRight}
			>
				{props.children}
			</StyledActionBarGroupAreaRight>
		);
	});

	export function ActionBarGroupArea(
		props: ContentBoxProps.ActionBarGroupAreaTplProps
	): ReactElement<ContentBoxProps.ActionBarGroupAreaTplProps> {
		const { className, leftSlot, rightSlot, leftSlotProps, rightSlotProps, ...rest } = props;

		return (
			<StyledActionBarGroupArea
				className={joinClassNames(className, `${baseClassName}__subheadingActionBarGroupArea`)}
				data-role={DataRoles.Contentbox.GroupActionBar}
				{...rest}
			>
				{leftSlot && (
					<ActionBarGroupAreaSlot slotProps={leftSlotProps} left>
						{leftSlot}
					</ActionBarGroupAreaSlot>
				)}
				{rightSlot && <ActionBarGroupAreaSlot slotProps={rightSlotProps}>{rightSlot}</ActionBarGroupAreaSlot>}
			</StyledActionBarGroupArea>
		);
	}

	const StyledActionBarGroupDivider = styled.div.withConfig({ displayName: "StyledActionBarGroupDivider-sc-" })(
		({ theme }) => {
			const { divider } = theme.components.contentBox;

			return css`
				background-color: ${divider.background};
				flex-shrink: 0;
				height: ${divider.height};
				margin: ${divider.margin};
				width: ${divider.width};
			`;
		}
	);

	export function ActionBarGroupDivider(props: ContentBoxProps.BaseProps): ReactElement<ContentBoxProps.BaseProps> {
		const { children, className, ...rest } = props;

		return (
			<StyledActionBarGroupDivider
				className={joinClassNames(className, `${baseClassName}__subheadingActionBarGroupDivider`)}
				data-role={DataRoles.Contentbox.ActionBarGroup.Divider}
				{...rest}
			>
				{children}
			</StyledActionBarGroupDivider>
		);
	}

	const StyledActionBarGroup = styled.div.withConfig({ displayName: "StyledActionBarGroup-sc-" })(({ theme }) => {
		const { actionBarGroup } = theme.components.contentBox;

		return css`
			align-items: center;
			display: flex;
			gap: ${actionBarGroup.gap};
			& > ${StyledActionBarGroupDivider} {
				margin: ${actionBarGroup.dividerMargin};
			}
			// Group Level 2
			& > && {
				background-color: ${actionBarGroup.secondLevelBG};
				border-radius: ${actionBarGroup.borderRadius};
				height: auto;
				margin: 0 -6px;
				min-height: 0;
				padding: ${actionBarGroup.secondLevelPadding};
				// Divider Level 2
				& > ${StyledActionBarGroupDivider} {
					background-color: ${actionBarGroup.dividerSecondLevelBG};
					border-radius: 50%;
					height: ${actionBarGroup.dividerSecondLevelHeight};
					width: ${actionBarGroup.dividerSecondLevelWidth};
				}
				${StyledButton} {
					&:disabled {
						border: ${actionBarGroup.secondLevelButton.disabledBorder};
					}
					&:not(:hover):not(:focus):not(:disabled) {
						border: ${actionBarGroup.secondLevelButton.border};
					}
				}
			}
		`;
	});

	export function ActionBarGroup(props: ContentBoxProps.ActionBarGroupProps): ReactElement<ContentBoxProps.BaseProps> {
		const { children, className, ...rest } = props;

		return (
			<StyledActionBarGroup
				className={joinClassNames(className, `${baseClassName}__subheadingActionBarGroup`)}
				data-role={DataRoles.Contentbox.ActionBarGroup}
				{...rest}
			>
				{children}
			</StyledActionBarGroup>
		);
	}
}
