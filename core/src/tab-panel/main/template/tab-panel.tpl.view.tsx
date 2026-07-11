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

import type { KeyboardEvent, ReactElement } from "react";
import { useRef, useState, useContext, useEffect, useCallback, useMemo, cloneElement, isValidElement } from "react";

import { addPrefix, joinClassNames, Key as CustomKey, StringUtils } from "../../../common/main/utils.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { CssEllipsis } from "../../../css-ellipsis/index.js";
import { useInteractionHint } from "../../../interaction-hint/main/use-interaction-hint.js";
import type { BadgeProps } from "../../../badge/index.js";

import type { TabPanelTemplateProps } from "./tab-panel.tpl.api.js";
import {
	BaseTabPanelAddonSuffix,
	BaseTabPanelHeader,
	BaseTabPanelTab,
	BaseTabPanelTabContent,
	StyledTabPanelHeading
} from "./tab-panel.tpl.styled.js";

export const TAB_PANEL_CLASS_NAME = addPrefix("tab-panel");

export namespace TabPanelTemplate {
	export function Tab(props: TabPanelTemplateProps.TabProps): ReactElement {
		const {
			ariaDescribedby,
			ariaLabelledby,
			icon,
			className,
			value,
			onClick,
			selected,
			highlighted,
			disabled,
			ariaControls,
			title,
			id,
			children,
			wrapperRef,
			dataRole,
			tabIndex,
			orientation = "vertical",
			label,
			mobileSubListLayout,
			...rest
		} = props;
		const tabItemRef = useRef<HTMLLIElement | null>(null);
		const [badgeTitle, setBadgeTitle] = useState<string | null>();
		const { badgeTitles: badgeTitleContext } = useContext<A11yDefinition>(A11YLanguageContext);

		const hintText = badgeTitle ? `${title}${badgeTitle}` : title;
		const { title: resolvedTitle, hintRenderer } = useInteractionHint({
			title: hintText,
			componentKey: "tabPanel",
			referenceElementRef: tabItemRef
		});

		const isSelected = !disabled && selected;
		const isHighlighted = !disabled && highlighted;
		const isActivatedTab = isSelected && isHighlighted;

		useEffect(() => {
			const badgeHiddenText = tabItemRef.current?.querySelector(
				`[data-role=${DataRoles.Badge}] [data-role=${DataRoles.HiddenText}]`
			)?.textContent;

			if (badgeHiddenText !== badgeTitle) {
				setBadgeTitle(badgeHiddenText);
			}
		}, [badgeTitle, badgeTitleContext]);

		const getTabItemRef = (ref: HTMLLIElement | null): void => {
			wrapperRef?.(ref);
			tabItemRef.current = ref;
		};

		const handleKeyDown = useCallback(
			(event: KeyboardEvent<HTMLElement>) => {
				if ((event.key === "Enter" || event.key === CustomKey.Space) && !disabled) {
					event.preventDefault();
					onClick?.(event);
				}
			},
			[disabled, onClick]
		);

		const newId = useMemo(() => {
			const trimValue = (value ?? "").trim();

			return id ?? (trimValue !== "" ? trimValue.toLowerCase().replace(/\s/g, "-") : undefined);
		}, [id, value]);

		return (
			<BaseTabPanelTab
				{...rest}
				className={joinClassNames(
					`${TAB_PANEL_CLASS_NAME}__tab`,
					{ [`${TAB_PANEL_CLASS_NAME}__tab--selected`]: isSelected },
					{ [`${TAB_PANEL_CLASS_NAME}__tab--highlighted`]: isHighlighted },
					{ [`${TAB_PANEL_CLASS_NAME}__tab--disabled`]: disabled },
					className
				)}
				onClick={!disabled ? onClick : undefined}
				tabIndex={!disabled ? tabIndex : undefined}
				role="tab"
				ref={getTabItemRef}
				aria-selected={!!selected}
				aria-current={isActivatedTab || isHighlighted ? "page" : "false"}
				aria-controls={ariaControls}
				aria-disabled={disabled}
				aria-label={title}
				title={resolvedTitle}
				onKeyDown={handleKeyDown}
				id={newId}
				data-role={dataRole ?? DataRoles.TabPanel.Tab}
				aria-labelledby={StringUtils.join(
					{
						[`${newId}-hidden-title`]: newId && title
					},
					ariaLabelledby ?? ariaDescribedby
				)}
				$disabled={disabled}
				$highlighted={isHighlighted}
				$selected={isSelected}
				$orientation={orientation}
				$mobileSubListLayout={mobileSubListLayout}
			>
				<BaseTabPanelTabContent
					className={`${TAB_PANEL_CLASS_NAME}__tab_content`}
					$mobileSubListLayout={mobileSubListLayout}
				>
					{newId && title && <HiddenText id={`${newId}-hidden-title`}>{title}</HiddenText>}
					{icon}
					{isValidElement<BadgeProps>(children)
						? cloneElement(children, { enabledInteractionHint: !!hintRenderer })
						: children}
				</BaseTabPanelTabContent>
				{hintRenderer?.()}
			</BaseTabPanelTab>
		);
	}

	export function PanelHeader(props: TabPanelTemplateProps.PanelHeaderProps): ReactElement {
		const { suffixes, heading, ariaLevel = 2, ...rest } = props;

		return (
			<BaseTabPanelHeader
				{...rest}
				className={joinClassNames(`${TAB_PANEL_CLASS_NAME}__header`, props.className)}
				data-role={DataRoles.TabPanel.Header}
			>
				{heading && (
					<StyledTabPanelHeading role="heading" aria-level={ariaLevel} data-role={DataRoles.TabPanel.Heading}>
						<CssEllipsis maxLine={1}>{heading}</CssEllipsis>
					</StyledTabPanelHeading>
				)}
				{suffixes && (
					<BaseTabPanelAddonSuffix className={`${TAB_PANEL_CLASS_NAME}__addon-suffix`}>
						{suffixes.map((suffix, index) => (
							<div
								className={`${TAB_PANEL_CLASS_NAME}__suffix`}
								key={`tab-panel-suffix-${index}`}
								data-role={DataRoles.TabPanel.Suffix}
							>
								{suffix}
							</div>
						))}
					</BaseTabPanelAddonSuffix>
				)}
			</BaseTabPanelHeader>
		);
	}
}
