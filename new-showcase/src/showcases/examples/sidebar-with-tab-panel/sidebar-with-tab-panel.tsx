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

import type { FC } from "react";
import { useMemo, useState, useRef, useContext, useCallback } from "react";
import { styled, css } from "styled-components";

import type { TabPanelTemplateProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	ApplicationHeader,
	ApplicationFrame,
	useElementSizeDetector,
	DataRoles
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ThemeContext } from "../../../helpers/theme-selector.js";

import { MasterDetailExample } from "../master-detail/master-detail.js";

import { tabPanelData } from "./data.js";
import { TabPanelExample } from "./tab-panel.js";

const StyledShowcaseApplicationFrame = styled(ApplicationFrame)<{ $useFlatStyle: boolean }>(({
	theme,
	$useFlatStyle,
	subExpanded
}) => {
	const { responsive } = theme.applicationStyles;
	const { sidebar } = theme.components.applicationFrame;

	return css`
		[data-role="${DataRoles.ApplicationFrame.Header}"] {
			position: relative;
		}

		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			position: relative;
			height: 100%;

			[data-role="${DataRoles.ApplicationFrame.Header}"] {
				box-shadow: unset;
			}

			[data-role="${DataRoles.ApplicationFrame.Sidebar.Wrapper}"] {
				transform: translateX(0);
				visibility: visible;
			}

			[data-role="${DataRoles.ApplicationFrame.Main}"] {
				position: absolute;
				left: ${sidebar.width};
				width: calc(100% - ${sidebar.width});
				visibility: ${subExpanded && "hidden"};

				[data-role="${DataRoles.MasterDetail.Layout.View}"] {
					border-radius: unset;

					[data-role="${DataRoles.Contentbox}"] [data-role="${DataRoles.Contentbox.Heading}"] {
						padding: 0 5px;
						border-top: ${$useFlatStyle && `1px solid ${sidebar.background}`};
						border-radius: unset;
					}
				}
			}
		}
	`;
});

export const SidebarWithTabPanel: FC = () => {
	const children = useMemo(() => <MasterDetailExample />, []);

	const [maximized, setMaximized] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [tab, setTab] = useState<TabPanelTemplateProps.TabProps | undefined>(tabPanelData[0]);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const { theme } = useContext(ThemeContext);
	const useFlatStyle = theme === "flat" || theme === "flat-compact";

	const handleCloseTab = useCallback(() => {
		setTab(undefined);
		setCollapsed(true);
	}, []);

	const handleToggleMaximized = useCallback(() => {
		setMaximized((oldValue) => !oldValue);
	}, []);

	const handleSelect = useCallback(
		(newTab: TabPanelTemplateProps.TabProps) => {
			if (newTab.value === tab?.value) {
				handleCloseTab();

				return;
			}

			setTab(newTab);
			setCollapsed(false);
		},
		[handleCloseTab, tab]
	);

	const { breakPoint } = useElementSizeDetector({
		targetRef: wrapperRef
	});

	return (
		<div className="-u-relative -u-width-full -u-height-full">
			<StyledShowcaseApplicationFrame
				wrapperRef={(ref) => {
					wrapperRef.current = ref;
				}}
				content={children}
				className="-u-margin-b-sm"
				main={<ApplicationHeader leftSlots="Sidebar with Tab Panel" />}
				$useFlatStyle={useFlatStyle}
				sub={
					<TabPanelExample
						title={tab?.title}
						onToggleMaximized={handleToggleMaximized}
						onClose={handleCloseTab}
						value={tab?.value}
						onSelect={handleSelect}
						maximized={maximized}
						isMobile={breakPoint.size === "sm" || breakPoint.size === "xs"}
					/>
				}
				subResizableOptions={{ minWidth: 200, maxWidth: "40%" }}
				disableCollapsingSub
				subExpanded={!collapsed}
				subExpandedState={maximized ? "maximized" : "minimized"}
			/>
		</div>
	);
};
