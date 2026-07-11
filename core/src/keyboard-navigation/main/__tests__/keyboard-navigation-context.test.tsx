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

import { describe, test, expect } from "vitest";
import { render } from "test-utils";

import {
	DEFAULT_KEYBOARD_NAV_CONTEXT_VALUE,
	KeyboardNavigationConfigProvider,
	resolveKeyboardNavConfig,
	useKeyboardNavigationMode
} from "../keyboard-navigation-context.js";
import type { KeyboardNavigationComponentKey } from "../keyboard-navigation.api.js";

function ReadMode({ componentKey }: { componentKey?: KeyboardNavigationComponentKey }) {
	const mode = useKeyboardNavigationMode(componentKey);

	return <span data-testid="mode">{mode}</span>;
}

describe("com.mgmtp.a12.widgets.keyboard-navigation", () => {
	describe("resolveKeyboardNavConfig", () => {
		describe("global configuration", () => {
			test("returns global mode when no componentKey", () => {
				const config = resolveKeyboardNavConfig({ mode: "arrow-only" });
				expect(config.mode).toBe("arrow-only");
			});

			test("returns default mode from DEFAULT_CONTEXT_VALUE", () => {
				const config = resolveKeyboardNavConfig(DEFAULT_KEYBOARD_NAV_CONTEXT_VALUE);
				expect(config.mode).toBe("default");
			});
		});

		describe("component-specific configuration", () => {
			const componentKeys: KeyboardNavigationComponentKey[] = [
				"popUpMenu",
				"buttonGroupContainer",
				"quickAccessButton",
				"fileUpload",
				"richTextEditor",
				"typography",
				"comment",
				"validationBar",
				"horizontalFlyoutMenu",
				"verticalFlyoutMenu",
				"slidingMenu",
				"tree",
				"tabPanelSubTablist"
			];

			test.each(componentKeys)("component string config '%s' overrides global mode", (key) => {
				const config = resolveKeyboardNavConfig({ mode: "default", componentConfigs: { [key]: "arrow-only" } }, key);
				expect(config.mode).toBe("arrow-only");
			});

			test.each(componentKeys)("component object config '%s' overrides global mode", (key) => {
				const config = resolveKeyboardNavConfig(
					{ mode: "default", componentConfigs: { [key]: { mode: "arrow-only" } } },
					key
				);
				expect(config.mode).toBe("arrow-only");
			});

			test("falls back to global mode when component key is not in componentConfigs", () => {
				const config = resolveKeyboardNavConfig(
					{ mode: "arrow-only", componentConfigs: { horizontalFlyoutMenu: "default" } },
					"tree"
				);
				expect(config.mode).toBe("arrow-only");
			});

			test("component config overrides global even when global is arrow-only", () => {
				const config = resolveKeyboardNavConfig({ mode: "arrow-only", componentConfigs: { tree: "default" } }, "tree");
				expect(config.mode).toBe("default");
			});
		});
	});

	describe("KeyboardNavigationConfigProvider", () => {
		test("returns 'default' when no provider is present", () => {
			const { getByTestId } = render(<ReadMode />);
			expect(getByTestId("mode").textContent).toBe("default");
		});

		test("provides 'arrow-only' mode to consumers", () => {
			const { getByTestId } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<ReadMode />
				</KeyboardNavigationConfigProvider>
			);
			expect(getByTestId("mode").textContent).toBe("arrow-only");
		});

		test("provides 'default' mode explicitly", () => {
			const { getByTestId } = render(
				<KeyboardNavigationConfigProvider mode="default">
					<ReadMode />
				</KeyboardNavigationConfigProvider>
			);
			expect(getByTestId("mode").textContent).toBe("default");
		});

		test("nested provider overrides outer provider", () => {
			const { getByTestId } = render(
				<KeyboardNavigationConfigProvider mode="arrow-only">
					<KeyboardNavigationConfigProvider mode="default">
						<ReadMode />
					</KeyboardNavigationConfigProvider>
				</KeyboardNavigationConfigProvider>
			);
			expect(getByTestId("mode").textContent).toBe("default");
		});

		test("returns 'default' when provider is present but mode is not set", () => {
			const { getByTestId } = render(
				<KeyboardNavigationConfigProvider>
					<ReadMode />
				</KeyboardNavigationConfigProvider>
			);
			expect(getByTestId("mode").textContent).toBe("default");
		});

		describe("with componentConfigs", () => {
			test("returns global mode when no component config exists for the key", () => {
				const { getByTestId } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only">
						<ReadMode componentKey="tree" />
					</KeyboardNavigationConfigProvider>
				);
				expect(getByTestId("mode").textContent).toBe("arrow-only");
			});

			test("returns global mode when componentKey is not provided", () => {
				const { getByTestId } = render(
					<KeyboardNavigationConfigProvider mode="arrow-only" componentConfigs={{ tree: "default" }}>
						<ReadMode />
					</KeyboardNavigationConfigProvider>
				);
				expect(getByTestId("mode").textContent).toBe("arrow-only");
			});

			test("returns component-specific mode from string config", () => {
				const { getByTestId } = render(
					<KeyboardNavigationConfigProvider mode="default" componentConfigs={{ tree: "arrow-only" }}>
						<ReadMode componentKey="tree" />
					</KeyboardNavigationConfigProvider>
				);
				expect(getByTestId("mode").textContent).toBe("arrow-only");
			});

			test("returns component-specific mode from object config", () => {
				const { getByTestId } = render(
					<KeyboardNavigationConfigProvider
						mode="default"
						componentConfigs={{ horizontalFlyoutMenu: { mode: "arrow-only" } }}
					>
						<ReadMode componentKey="horizontalFlyoutMenu" />
					</KeyboardNavigationConfigProvider>
				);
				expect(getByTestId("mode").textContent).toBe("arrow-only");
			});

			test("component config does not affect other components", () => {
				const { getByTestId } = render(
					<KeyboardNavigationConfigProvider mode="default" componentConfigs={{ tree: "arrow-only" }}>
						<ReadMode componentKey="horizontalFlyoutMenu" />
					</KeyboardNavigationConfigProvider>
				);
				expect(getByTestId("mode").textContent).toBe("default");
			});
		}); // with componentConfigs
	});
});
