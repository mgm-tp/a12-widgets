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

import { Fragment, useRef, useState } from "react";
import type { FC, ReactNode } from "react";
import { styled, css } from "styled-components";

import {
	AttachedPortal,
	Button,
	ButtonGroup,
	DataRoles,
	FilterSelectorTemplate,
	Icon,
	StyledFilterSelectorBody,
	Typography
} from "@com.mgmtp.a12.widgets/widgets-core";

import { StyledFilterSection, StyledResetButton } from "./filter.styled.js";

export const StyledToggleShowcaseWrapper = styled.div.withConfig({ displayName: "StyledToggleWrapper-sc-" })(
	({ theme }) => {
		const { item, content } = theme.components.toggle;

		return css`
			[data-role="${DataRoles.Toggle.Wrapper}"] {
				min-height: ${content.hover.minHeight};
			}
			[data-role="${DataRoles.Toggle.SelectedItemOverlay}"] {
				font-weight: 700;
				color: ${item.withOverlay.selected.color};
			}

			[data-role="${DataRoles.Toggle.Item}"] {
				font-weight: 700;

				&:hover,
				&:focus,
				&:active {
					text-decoration: none;
				}
			}
		`;
	}
);

export const StyledFilterItemDivider = styled.div(({ theme }) => {
	const { divider } = theme.colors;
	const { spacingMd, spacingSm } = theme.spacing.spacing;

	return css`
		border-bottom: 1px solid ${divider.color};
		margin: ${spacingMd}px 0 ${spacingSm}px 0;
	`;
});

export const StyledFilterOptionsTemplate = styled(FilterSelectorTemplate).withConfig({
	displayName: "StyledFilterOptionsTemplate-sc-"
})(({ theme }) => {
	const { spacingSm, spacingXs } = theme.spacing.spacing;
	const { menu } = theme.components.popupMenu;

	return css`
		background: ${menu.background};
		border-radius: ${spacingXs}px;
		overflow: hidden;

		[data-role="${DataRoles.Typography.Headline}"],
		[data-role="${DataRoles.Typography.Body}"] {
			margin: 0;
			padding: 0;
		}

		${StyledFilterSelectorBody} {
			min-height: 0;
			padding: ${spacingSm}px;
		}
	`;
});

const StyledSlideViewport = styled.div`
	overflow: hidden;
`;

const StyledSlider = styled.div<{ $showConfig: boolean }>`
	display: flex;
	transition: transform 0.25s ease;
	transform: ${({ $showConfig }): string => ($showConfig ? "translateX(-100%)" : "translateX(0)")};
`;

const StyledSlidePanel = styled.div(({ theme }) => {
	const { spacingXs } = theme.spacing.spacing;

	return css`
		flex: 0 0 100%;
		min-width: 0;

		[data-role="${DataRoles.Typography.Body}"] {
			padding: ${spacingXs}px;
		}
	`;
});

const StyledConfigPanelHeader = styled.div(({ theme }) => {
	const { spacingSm } = theme.spacing.spacing;
	const { divider } = theme.colors;

	return css`
		display: flex;
		align-items: center;
		gap: ${spacingSm}px;
		padding-bottom: ${spacingSm}px;
		margin-bottom: ${spacingSm}px;
		border-bottom: 1px solid ${divider.color};
	`;
});

export interface FilterItem {
	headingTitle: string;
	content: ReactNode;
}

interface FilterOptionsMenuProps {
	filterList?: FilterItem[];
	onApply?: () => void;
	onReset?: () => void;
	onVisibilityChange?: (isOpen: boolean) => void;
	referenceElement?: HTMLElement | null;
	isOpen?: boolean;
	isConfiguration?: boolean;
	configurationFilterList?: FilterItem[];
	configurationTitle?: string;
	onConfigurationReset?: () => void;
	onConfigurationApply?: () => void;
	isMainDirty?: boolean;
	isConfigDirty?: boolean;
	hasMainData?: boolean;
}

export const FilterOptionsMenu: FC<FilterOptionsMenuProps> = ({
	filterList,
	onApply,
	onReset,
	onVisibilityChange,
	referenceElement,
	isOpen,
	isConfiguration = true,
	configurationFilterList,
	configurationTitle = "Configuration",
	onConfigurationReset,
	onConfigurationApply,
	isMainDirty,
	isConfigDirty,
	hasMainData
}) => {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [internalShow, setInternalShow] = useState(false);
	const [showConfig, setShowConfig] = useState(false);

	const isControlled = referenceElement !== undefined;
	const show = isControlled ? (isOpen ?? false) : internalShow;
	const anchorElement = isControlled ? referenceElement : buttonRef.current;
	const hasConfig = !!configurationFilterList?.length;

	const renderFilterItems = (items: FilterItem[], withConfigButton: boolean, headingLevel?: 2 | 3 | 4 | 5): ReactNode =>
		items.map((filter, index) => (
			<Fragment key={index}>
				<StyledFilterSection $showHeaderActions={withConfigButton}>
					<Typography.Headline
						level={headingLevel ?? (isConfiguration ? 5 : 2)}
						compact
						{...(withConfigButton && {
							headerActions: (
								<Button
									icon={<Icon>build</Icon>}
									title={configurationTitle}
									onClick={(e): void => {
										e.stopPropagation();
										setShowConfig(true);
									}}
								/>
							)
						})}
					>
						{filter.headingTitle}
					</Typography.Headline>
					<Typography.Body>{filter.content}</Typography.Body>
				</StyledFilterSection>
				{index < items.length - 1 && <StyledFilterItemDivider />}
			</Fragment>
		));

	const renderFooter = (
		onResetCb?: () => void,
		onApplyCb?: () => void,
		isDirty?: boolean,
		hasData?: boolean
	): ReactNode => {
		if (!onResetCb && !onApplyCb) {
			return undefined;
		}

		const isDisabled = isDirty === false && !hasData;

		return (
			<ButtonGroup alignment="right">
				{onResetCb && (
					<StyledResetButton label="RESET" onClick={onResetCb} icon={<Icon>replay</Icon>} disabled={isDisabled} />
				)}
				{onApplyCb && <Button label="APPLY" primary onClick={onApplyCb} disabled={isDisabled} />}
			</ButtonGroup>
		);
	};

	const handleVisibilityChange = (isMenuOpen: boolean): void => {
		if (!isControlled) {
			setInternalShow(isMenuOpen);
		}

		if (!isMenuOpen) {
			setShowConfig(false);
		}

		onVisibilityChange?.(isMenuOpen);
	};

	const handleMainApply = (): void => {
		onApply?.();
	};

	const handleMainReset = (): void => {
		onReset?.();
	};

	const handleConfigApply = (): void => {
		onConfigurationApply?.();
		setShowConfig(false);
	};

	const handleConfigReset = (): void => {
		onConfigurationReset?.();
		setShowConfig(false);
	};

	const mainPanel = (
		<StyledSlidePanel>{filterList?.length ? renderFilterItems(filterList, hasConfig) : null}</StyledSlidePanel>
	);

	const configPanel = hasConfig ? (
		<StyledSlidePanel>
			<StyledConfigPanelHeader>
				<Button
					icon={<Icon>chevron_left</Icon>}
					title="Back"
					onClick={(e): void => {
						e.stopPropagation();
						setShowConfig(false);
					}}
				/>
				<Typography.Headline level={2} compact>
					{configurationTitle}
				</Typography.Headline>
			</StyledConfigPanelHeader>
			{renderFilterItems(configurationFilterList, false, 5)}
		</StyledSlidePanel>
	) : null;

	const slidingContent = hasConfig ? (
		<StyledSlideViewport>
			<StyledSlider $showConfig={showConfig}>
				{mainPanel}
				{showConfig && configPanel}
			</StyledSlider>
		</StyledSlideViewport>
	) : filterList?.length ? (
		renderFilterItems(filterList, false)
	) : null;

	const footer = showConfig
		? renderFooter(
				onConfigurationReset ? handleConfigReset : undefined,
				onConfigurationApply ? handleConfigApply : undefined,
				isConfigDirty
			)
		: renderFooter(
				onReset ? handleMainReset : undefined,
				onApply ? handleMainApply : undefined,
				isMainDirty,
				hasMainData
			);

	return (
		<>
			{!isControlled && (
				<Button
					icon={<Icon>build</Icon>}
					title="Filter options"
					buttonRef={(ref) => {
						buttonRef.current = ref;
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleVisibilityChange(!internalShow);
					}}
				/>
			)}
			{anchorElement && show && (
				<AttachedPortal
					closeOnOutsideClick
					referenceElement={anchorElement}
					onVisibilityChange={handleVisibilityChange}
					focusOnReferenceElementAfterClose
				>
					<StyledFilterOptionsTemplate
						id="filter-options-popup"
						secondaryContent={slidingContent}
						{...(footer && { footerContent: footer })}
					/>
				</AttachedPortal>
			)}
		</>
	);
};
