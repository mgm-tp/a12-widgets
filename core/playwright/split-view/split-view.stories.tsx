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
import { useState, useCallback } from "react";

import type { SplitViewProps } from "../../src/layout/split-view/main/split-view.api.js";
import { SplitView } from "../../src/layout/split-view/main/split-view.view.js";
import { ActionContentbox } from "../../src/contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../src/contentbox/main/template/contentbox.tpl.view.js";
import { Icon } from "../../src/icon/main/icon.view.js";

export const ExampleSplitView: FC<{
	singleArea?: boolean;
	widthConfigs?: { firstWidth?: number; secondWidth?: number; containerWidth?: number };
	resizableOptions?: { first?: SplitViewProps.ResizeOptions; second?: SplitViewProps.ResizeOptions };
}> = ({ singleArea, widthConfigs, resizableOptions }) => {
	const [openRightArea, setOpenRightArea] = useState(!singleArea);

	const toggleLeftMenu = useCallback(() => {
		setOpenRightArea((prevState) => !prevState);
	}, []);

	return (
		<div style={{ width: widthConfigs?.containerWidth }}>
			<SplitView>
				<SplitView.Area resizableOptions={resizableOptions?.first} width={widthConfigs?.firstWidth}>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={2} text="Left Area" />}
						headingButtons={
							<ContentBoxElements.HeadingActionButton
								icon={<Icon>menu</Icon>}
								onClick={toggleLeftMenu}
								title="Toggle Area"
								id="toggle-button"
							/>
						}
					>
						Exercitation id eiusmod id eiusmod aute incididunt commodo et. Sunt eu deserunt duis et anim proident et
						irure veniam adipisicing. Amet in minim nisi occaecat in ad exercitation est Lorem voluptate id occaecat qui
						eu. Consequat nostrud magna ut proident. Laboris exercitation cupidatat magna dolor laborum consectetur.
						Incididunt laborum incididunt id id magna commodo cillum minim consequat ut dolor exercitation nostrud
						ullamco. Aliqua voluptate ipsum enim pariatur nulla officia veniam tempor mollit. Sunt consectetur labore
						enim ex proident cupidatat tempor culpa sunt labore consectetur culpa. Nisi incididunt deserunt aliquip
						incididunt quis anim nisi cupidatat proident aute amet irure. Occaecat velit enim et mollit. Occaecat velit
						non irure fugiat consectetur veniam aute occaecat mollit ea cupidatat exercitation.
					</ActionContentbox>
				</SplitView.Area>
				{openRightArea && (
					<SplitView.Area resizableOptions={resizableOptions?.second} width={widthConfigs?.secondWidth}>
						<ActionContentbox headingElements={<ContentBoxElements.Title ariaLevel={2} text="Right Area" />}>
							Cupidatat elit sit mollit aute sint anim elit amet culpa nostrud Lorem laborum. Voluptate aliquip
							incididunt magna sint voluptate reprehenderit consectetur fugiat. Aliquip mollit nostrud consequat sunt
							mollit commodo non. Aliquip tempor reprehenderit mollit amet sunt cupidatat ad in sunt dolore voluptate
							excepteur labore.
						</ActionContentbox>
					</SplitView.Area>
				)}
			</SplitView>
		</div>
	);
};
