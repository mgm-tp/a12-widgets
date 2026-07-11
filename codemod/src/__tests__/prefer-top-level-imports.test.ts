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

import { expect, it } from "vitest";

import { testRecipe } from "@com.mgmtp.a12.devtools/codemod";

import { preferTopLevelImportsRecipe } from "../recipes/prefer-top-level-imports.js";

it("should prefer top-level imports", async () => {
	await expect(
		testRecipe(
			preferTopLevelImportsRecipe,
			`
import type {
	BaseColumnType,
	RowStyleGetter,
	RowEventHandlerGetter,
	TableRenderPropsType
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/index.js";
import { Table, DefaultTableComponentRenderers } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/index.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/index.js";
import { ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/button-group/index.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
import { PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/pop-up-menu/index.js";
import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list/index.js";
import { provider } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";
`
		)
	).resolves.toMatchInlineSnapshot(`
		"
		import {
			type BaseColumnType,
			type RowStyleGetter,
			type RowEventHandlerGetter,
			type TableRenderPropsType, Table, DefaultTableComponentRenderers, Icon, ButtonGroup, Button, PopUpMenu, List, provider } from "@com.mgmtp.a12.widgets/widgets-core";
		"
	`);

	await expect(
		testRecipe(
			preferTopLevelImportsRecipe,
			`
import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";
import type {
	ResizeEventHandler,
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/index.js";
import { ExternalLink, MailtoLink } from "@com.mgmtp.a12.widgets/widgets-core/lib/link/index.js";
`
		)
	).resolves.toMatchInlineSnapshot(`
		"
		import { provider as DeviceDetector, ExternalLink, MailtoLink, type ColumnResizeEventHandler as ResizeEventHandler } from "@com.mgmtp.a12.widgets/widgets-core";
		"
	`);

	await expect(
		testRecipe(
			preferTopLevelImportsRecipe,
			`
import { Tooltip } from "@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/plugins/tooltip-plugin/view/tooltip.view.js";
import type { ResizeEventHandler } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/index.js";
import type { TooltipProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/plugins/tooltip-plugin/view/tooltip.api.js";
import { BodyCell, BodyContent } from "@com.mgmtp.a12.widgets/widgets-core/lib/tree-table/main/tree-table.view.js";


const tooltipProps: TooltipProps = {};
const handler: ResizeEventHandler = {};
const plugin: Tooltip = {};

const Content = () => <BodyContent />
const Cell = () => <BodyCell />
`
		)
	).resolves.toMatchInlineSnapshot(`
		"import type { ColumnResizeEventHandler as ResizeEventHandler, TooltipPluginProps as TooltipProps } from "@com.mgmtp.a12.widgets/widgets-core";
		import { TooltipPlugin as Tooltip, TreeTableBodyCell as BodyCell, TreeTableBodyContent as BodyContent } from "@com.mgmtp.a12.widgets/widgets-core";

		const tooltipProps: TooltipProps = {};
		const handler: ResizeEventHandler = {};
		const plugin: Tooltip = {};

		const Content = () => <BodyContent />
		const Cell = () => <BodyCell />
		"
	`);
});
