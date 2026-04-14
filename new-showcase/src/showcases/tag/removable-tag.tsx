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

import type { ReactElement } from "react";
import { useCallback } from "react";

import { Tag, TagGroup, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

export function RemovableTagShowcase(): ReactElement {
	const removeTag = useCallback((): void => {
		alert("Remove button is clicked");
	}, []);

	return (
		<TagGroup>
			<Tag removable onRemove={removeTag} id="hp-envy" color="#c91d1d">
				HP Envy x360 13
			</Tag>
			<Tag
				removable
				onRemove={removeTag}
				id="lenovo-yoga"
				color="#2f9d2f"
				icon={<Icon iconTheme="outlined">laptop</Icon>}
			>
				Lenovo Yoga 9i
			</Tag>
			<Tag removable onRemove={removeTag} id="dell-xps" color="#079AEA" icon={<Icon iconTheme="outlined">laptop</Icon>}>
				Dell XPS 17 9720
			</Tag>
			<Tag
				removable
				onRemove={removeTag}
				id="lenovo-ideaPad-flex"
				color="#2f9d2f"
				icon={<Icon iconTheme="outlined">laptop</Icon>}
			>
				Lenovo IdeaPad Flex 5 2-in-1 Chromebook
			</Tag>
			<Tag removable disabledRemoveButton id="macbook-pro">
				MacBook Pro 2022
			</Tag>
		</TagGroup>
	);
}
