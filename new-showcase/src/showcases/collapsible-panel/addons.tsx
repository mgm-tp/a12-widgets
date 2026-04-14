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

import type { FC, MouseEvent, KeyboardEvent } from "react";
import { useContext, useState, useCallback } from "react";
import { Key } from "ts-key-enum";

import {
	Button,
	CollapsiblePanel,
	CollapsiblePanelElements,
	Icon,
	Checkbox
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ThemeContext } from "../../helpers/theme-selector.js";
import { Text } from "../../helpers/text-generator.js";
import { ConfigurationView } from "../../helpers/configuration-view.js";

export const Addons: FC = () => {
	const { theme } = useContext(ThemeContext);
	const isInFlatTheme = theme.includes("flat");
	const [toggleIndex, setToggleIndex] = useState<number | undefined>(undefined);
	const [swapAddonsPosition, setSwapAddonsPosition] = useState<boolean>(false);

	const onCollapsiblePanelClick = useCallback(
		(index: number): void => {
			setToggleIndex(index === toggleIndex ? undefined : index);
		},
		[toggleIndex]
	);

	const handleAddonClick = (event: MouseEvent<HTMLElement>): void => {
		event.stopPropagation();
		event.preventDefault();
	};

	const handleAddonKeyUp = (event: KeyboardEvent<HTMLElement>): void => {
		if (event.key === Key.Enter) {
			event.stopPropagation();
			event.preventDefault();
		}
	};

	return (
		<ConfigurationView
			configuration={
				<Checkbox
					checked={swapAddonsPosition}
					onChange={setSwapAddonsPosition}
					label="Swap icon and addons positions"
					title="Swap positions of graphic icon and addons"
					fitToParent={false}
				/>
			}
		>
			<div className="-u-width-full">
				<CollapsiblePanel
					title={<span>Title</span>}
					swapAddonsPosition={swapAddonsPosition}
					addons={
						<CollapsiblePanelElements.Addon>
							<Button
								icon={<Icon iconTheme="outlined">print</Icon>}
								title="Home Work"
								invert={!isInFlatTheme}
								onClick={handleAddonClick}
								onKeyUp={handleAddonKeyUp}
							/>
						</CollapsiblePanelElements.Addon>
					}
					onClick={() => onCollapsiblePanelClick(2)}
				>
					{toggleIndex === 2 && <p>{Text.SENTENCE}</p>}
				</CollapsiblePanel>
			</div>
		</ConfigurationView>
	);
};
