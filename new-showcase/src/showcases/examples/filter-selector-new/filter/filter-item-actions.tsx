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

import { AttachedPortal, Button, ButtonGroup, DataRoles, Icon, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

import { StyledFilterOptionsTemplate, StyledFilterItemDivider } from "./filter-configuration.js";

export interface FilterConfigItem {
	label: string;
	content: ReactNode;
}

interface FilterItemActionsProps {
	active: boolean;
	onReset: () => void;
	configItems?: FilterConfigItem[];
	filterId: string;
	onConfigOpenChange?: (open: boolean) => void;
}

export const FilterItemActions: FC<FilterItemActionsProps> = ({
	active,
	onReset,
	configItems,
	filterId,
	onConfigOpenChange
}) => {
	const configButtonRef = useRef<HTMLButtonElement | null>(null);
	const resetButtonRef = useRef<HTMLButtonElement | null>(null);
	const [isConfigOpen, setIsConfigOpen] = useState(false);
	const hasConfig = !!configItems?.length;

	const handleSetConfigOpen = (open: boolean): void => {
		setIsConfigOpen(open);
		onConfigOpenChange?.(open);
	};

	const focusHeading = (): void => {
		requestAnimationFrame(() => {
			const header = resetButtonRef.current?.closest(`[data-role="${DataRoles.CollapsiblePanel.Header}"]`);
			const label = header?.querySelector(
				`[data-role="${DataRoles.CollapsiblePanel.Title.Wrapper}"]`
			) as HTMLElement | null;
			label?.focus();
		});
	};

	return (
		<>
			<ButtonGroup>
				<Button
					icon={<Icon>replay</Icon>}
					disabled={!active}
					title="Reset this filter"
					buttonRef={(ref): void => {
						resetButtonRef.current = ref;
					}}
					onClick={(e): void => {
						e.stopPropagation();
						onReset();
						focusHeading();
					}}
				/>
				{hasConfig && (
					<Button
						icon={<Icon>build</Icon>}
						title="Configure this filter"
						buttonRef={(ref): void => {
							configButtonRef.current = ref;
						}}
						onClick={(e): void => {
							e.stopPropagation();
							handleSetConfigOpen(!isConfigOpen);
						}}
					/>
				)}
			</ButtonGroup>
			{isConfigOpen && hasConfig && configButtonRef.current && (
				<AttachedPortal
					closeOnOutsideClick={{ exception: [configButtonRef.current] }}
					referenceElement={configButtonRef.current}
					onVisibilityChange={(visible): void => {
						if (!visible) {
							handleSetConfigOpen(false);
						}
					}}
					orientationList={["bottom-start"]}
					closeOnClickReferenceElement={false}
					focusOnReferenceElementAfterClose
				>
					<StyledFilterOptionsTemplate
						id={`filter-config-popup-${filterId}`}
						secondaryContent={
							<>
								{configItems!.map((item, index) => (
									<Fragment key={index}>
										<Typography.Section>
											<Typography.Headline level={5} compact>
												{item.label}
											</Typography.Headline>
											<Typography.Body>{item.content}</Typography.Body>
										</Typography.Section>
										{index < configItems!.length - 1 && <StyledFilterItemDivider />}
									</Fragment>
								))}
							</>
						}
					/>
				</AttachedPortal>
			)}
		</>
	);
};
