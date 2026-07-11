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

import { describe, expect, it } from "vitest";

import { testRecipe } from "@com.mgmtp.a12.devtools/codemod";

import { enforceTopLevelExportsRecipe } from "../recipes/enforce-top-level-exports.js";

describe("enforce-top-level-exports", () => {
	it("should migrate deep JS imports with .js extension to root barrel", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			import { Button, Icon, InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";
			"
		`);
	});

	it("should migrate deep JS imports without .js extension to root barrel", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view";
import { Badge } from "@com.mgmtp.a12.widgets/widgets-core/lib/badge/main/badge.view";
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			import { InteractionHintConfigProvider, Icon, Badge } from "@com.mgmtp.a12.widgets/widgets-core";
			"
		`);
	});

	it("should migrate CSS imports to ./styles/ paths", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";
import "@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/themes/rich-text-editor.css";
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			import "@com.mgmtp.a12.widgets/widgets-core/styles/basic.css";
			import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";
			"
		`);
	});

	it("should migrate widgets-utils deep imports to root barrel", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import { SourceCodeSection } from "@com.mgmtp.a12.widgets/widgets-utils/lib/code-example/index.js";
import type { SourceCode } from "@com.mgmtp.a12.widgets/widgets-utils/lib/code-example/index.js";
import { AnimationWrapper } from "@com.mgmtp.a12.widgets/widgets-utils/lib/animation-wrapper/index.js";
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			import { SourceCodeSection, type SourceCode, AnimationWrapper } from "@com.mgmtp.a12.widgets/widgets-utils";
			"
		`);
	});

	it("should rename TextLineStateless to TextField", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import { TextLineStateless } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.view.js";
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";

const field: TextLineStatelessProps = {};
const Component = () => <TextLineStateless />;
`
			)
		).resolves.toMatchInlineSnapshot(`
			"import type { TextFieldProps as TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";
			import { TextField as TextLineStateless } from "@com.mgmtp.a12.widgets/widgets-core";

			const field: TextLineStatelessProps = {};
			const Component = () => <TextLineStateless />;
			"
		`);
	});

	it("should handle mixed JS and CSS imports in the same file", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import "@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/themes/rich-text-editor.css";
import { RichTextEditor } from "@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/rich-text-editor.view.js";
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";
			import { RichTextEditor } from "@com.mgmtp.a12.widgets/widgets-core";
			"
		`);
	});

	it("should not modify imports that are already top-level", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import "@com.mgmtp.a12.widgets/widgets-core/styles/basic.css";
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
			import "@com.mgmtp.a12.widgets/widgets-core/styles/basic.css";
			"
		`);
	});

	it("should rename removed deprecated APIs from top-level barrel", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import { TextLineStateless, IconPicker, Tooltip, TooltipProps, TooltipWrapperProps, commonTileConfigs, BodyCell, BodyContent, walk } from "@com.mgmtp.a12.widgets/widgets-core";
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			import { IconPicker, TextField as TextLineStateless, TooltipPlugin as Tooltip, TooltipPluginProps as TooltipProps, TooltipPluginWrapperProps as TooltipWrapperProps, commonInteractiveTileFlatConfigs as commonTileConfigs, TreeTableBodyCell as BodyCell, TreeTableBodyContent as BodyContent, walkTreeNode as walk, type TextFieldProps as TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";
			"
		`);
	});

	it("should rename IconPicker imported from a11y-localization/index.js to IconPickerTitles", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import { IconPicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization/index.js";
`
			)
		).resolves.toMatchInlineSnapshot(`
			"import { IconPickerTitles as IconPicker } from "@com.mgmtp.a12.widgets/widgets-core";
			"
		`);
	});

	it("should rename IconPicker imported from a11y-key-definition.api.js to IconPickerTitles", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import { IconPicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization/a11y-key-definition.api.js";
`
			)
		).resolves.toMatchInlineSnapshot(`
			"import { IconPickerTitles as IconPicker } from "@com.mgmtp.a12.widgets/widgets-core";
			"
		`);
	});

	it("should rename DataRoles.Textline to DataRoles.TextField", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
const input = DataRoles.Textline.Input;
const wrapper = DataRoles.Textline.Input.Wrapper;
const root = DataRoles.Textline;
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			const input = DataRoles.TextField.Input;
			const wrapper = DataRoles.TextField.Input.Wrapper;
			const root = DataRoles.TextField;
			"
		`);
	});

	it("should replace textline data-role strings with text-field", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
const input = getByDataRole(container, "textline-input");
const wrapper = getByDataRole(container, "textline-input-wrapper");
const el = document.querySelector('[data-role="textline"]');
const selector = \`[data-role="textline-input"]\`;
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			const input = getByDataRole(container, "text-field-input");
			const wrapper = getByDataRole(container, "text-field-input-wrapper");
			const el = document.querySelector('[data-role="text-field"]');
			const selector = \`[data-role="text-field-input"]\`;
			"
		`);
	});

	it("should rename theme.components.textLine to textField", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
const height = theme.components.textLine.mobile?.height;
const { textLine } = theme.components;
const fontSize = textLine.mobile?.fontSize;
createTheme({ components: { textLine: { textSuffix: {} } } });
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			const height = theme.components.textField.mobile?.height;
			const { textField } = theme.components;
			const fontSize = textField.mobile?.fontSize;
			createTheme({ components: { textField: { textSuffix: {} } } });
			"
		`);
	});

	describe("import type preservation", () => {
		it("should preserve import type as standalone declaration when only type imports exist", async () => {
			await expect(
				testRecipe(
					enforceTopLevelExportsRecipe,
					`
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import type { IconProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.api.js";
`
				)
			).resolves.toMatchInlineSnapshot(`
				"
				import type { ButtonProps, IconProps } from "@com.mgmtp.a12.widgets/widgets-core";
				"
			`);
		});

		it("should use inline type specifiers when merging type and value imports", async () => {
			await expect(
				testRecipe(
					enforceTopLevelExportsRecipe,
					`
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
`
				)
			).resolves.toMatchInlineSnapshot(`
				"
				import { type ButtonProps, Button } from "@com.mgmtp.a12.widgets/widgets-core";
				"
			`);
		});

		it("should preserve import type with entity rename during migration", async () => {
			await expect(
				testRecipe(
					enforceTopLevelExportsRecipe,
					`
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";
`
				)
			).resolves.toMatchInlineSnapshot(`
				"import type { TextFieldProps as TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";
				"
			`);
		});

		it("should preserve import type for top-level barrel renames", async () => {
			await expect(
				testRecipe(
					enforceTopLevelExportsRecipe,
					`
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";
`
				)
			).resolves.toMatchInlineSnapshot(`
				"import type { TextFieldProps as TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";
				"
			`);
		});

		it("should handle multiple type-only declarations from different deep paths", async () => {
			await expect(
				testRecipe(
					enforceTopLevelExportsRecipe,
					`
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import type { IconProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.api.js";
`
				)
			).resolves.toMatchInlineSnapshot(`
				"
				import type { ButtonProps, IconProps, TextFieldProps as TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";
				"
			`);
		});

		it("should separate type and value imports when mixing renamed types with values", async () => {
			await expect(
				testRecipe(
					enforceTopLevelExportsRecipe,
					`
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";
import { TextLineStateless } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.view.js";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";
`
				)
			).resolves.toMatchInlineSnapshot(`
				"
				import { type ButtonProps, Button, TextField as TextLineStateless, type TextFieldProps as TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core";
				"
			`);
		});
	});

	it("should rename TextLineConfigType and textLineConfig", async () => {
		await expect(
			testRecipe(
				enforceTopLevelExportsRecipe,
				`
import type { TextLineConfigType } from "@com.mgmtp.a12.widgets/widgets-core";
import { textLineConfig } from "@com.mgmtp.a12.widgets/widgets-core";
const config: TextLineConfigType = textLineConfig(theme);
`
			)
		).resolves.toMatchInlineSnapshot(`
			"
			import type { TextFieldConfigType } from "@com.mgmtp.a12.widgets/widgets-core";
			import { textFieldConfig } from "@com.mgmtp.a12.widgets/widgets-core";
			const config: TextFieldConfigType = textFieldConfig(theme);
			"
		`);
	});
});
