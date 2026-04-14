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

import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { IconWrapperShowcase } from "./basic.js";

export function CustomIcons() {
	return (
		<IconWrapperShowcase>
			<Icon title="Clear Filter" iconTheme="custom">
				clear_filter
			</Icon>

			<Icon title="Error" iconTheme="custom">
				error
			</Icon>

			<Icon title="Edit Outline" iconTheme="custom">
				edit_outline
			</Icon>

			<Icon title="Insert Below" iconTheme="custom">
				insert_below
			</Icon>

			<Icon title="Insert Above" iconTheme="custom">
				insert_above
			</Icon>

			<Icon title="Insert As Child" iconTheme="custom">
				insert_as_child
			</Icon>

			<Icon title="Check" iconTheme="custom">
				check_dashed
			</Icon>

			<Icon title="Error Collapsed" iconTheme="custom">
				error_collapsed
			</Icon>

			<Icon title="Warning Collapsed" iconTheme="custom">
				warning_collapsed
			</Icon>

			<Icon title="And" iconTheme="custom">
				and
			</Icon>

			<Icon title="Or" iconTheme="custom">
				or
			</Icon>

			<Icon title="Datatype Audio" iconTheme="custom">
				datatype_audio
			</Icon>

			<Icon title="Datatype Default" iconTheme="custom">
				datatype_default
			</Icon>

			<Icon title="Datatype Image" iconTheme="custom">
				datatype_image
			</Icon>

			<Icon title="Datatype PDF" iconTheme="custom">
				datatype_pdf
			</Icon>

			<Icon title="Datatype Spreadsheet" iconTheme="custom">
				datatype_spreadsheet
			</Icon>

			<Icon title="Datatype Text" iconTheme="custom">
				datatype_text
			</Icon>

			<Icon title="Datatype Video" iconTheme="custom">
				datatype_video
			</Icon>

			<Icon title="Settings Panel Opened" iconTheme="custom">
				settings_panel_open
			</Icon>

			<Icon title="Settings Panel Closed" iconTheme="custom">
				settings_panel_closed
			</Icon>

			<Icon title="Delete Hint" iconTheme="custom">
				delete_hint
			</Icon>

			<Icon title="Unpin" iconTheme="custom">
				unpin
			</Icon>

			<Icon title="Version" iconTheme="custom">
				version
			</Icon>
		</IconWrapperShowcase>
	);
}
