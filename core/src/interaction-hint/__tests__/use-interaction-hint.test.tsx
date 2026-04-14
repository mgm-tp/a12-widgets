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

import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { createRef } from "react";
import { describe, expect, test } from "vitest";

import {
	DEFAULT_CONTEXT_VALUE,
	type InteractionHintConfigContextProps,
	InteractionHintConfigProvider
} from "../main/interaction-hint-context.js";
import { useInteractionHint, resolveHintConfig } from "../main/use-interaction-hint.js";
import type { InteractionHintComponentConfigMap } from "../main/interaction-hint.api.js";

type DeepRequired<T> = {
	[K in keyof T]-?: T[K];
};

function createTestConfig(
	overrides: Partial<InteractionHintConfigContextProps> = {}
): DeepRequired<InteractionHintConfigContextProps> {
	return {
		...DEFAULT_CONTEXT_VALUE,
		...overrides
	} as DeepRequired<InteractionHintConfigContextProps>;
}

describe("resolveHintConfig", () => {
	describe("global configuration", () => {
		test("respects global enableInteractionHint flag", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true
				})
			);

			expect(config.enabled).toBe(true);
			expect(config.followCursor).toBe(false);
			expect(config.hideArrow).toBe(false);
		});

		test("respects global followCursor setting", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true,
					followCursor: true
				})
			);

			expect(config.enabled).toBe(true);
			expect(config.followCursor).toBe(true);
			expect(config.hideArrow).toBe(false);
		});

		test("respects global hideArrow setting", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true,
					hideArrow: true
				})
			);

			expect(config.enabled).toBe(true);
			expect(config.hideArrow).toBe(true);
			expect(config.followCursor).toBe(false);
		});

		test("combines all global settings", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true,
					followCursor: true,
					hideArrow: true
				})
			);

			expect(config.enabled).toBe(true);
			expect(config.followCursor).toBe(true);
			expect(config.hideArrow).toBe(true);
		});
	});

	describe("component-specific configuration", () => {
		const interactionHintComponentKeys = [
			"button",
			"link",
			"iconButton",
			"counter",
			"tabPanel",
			"list",
			"fileUpload",
			"collapsiblePanel",
			"toggle",
			"wizard",
			"interactiveTile",
			"horizontalFlyoutMenu",
			"verticalFlyoutMenu",
			"accordion",
			"slidingMenu"
		] as const satisfies readonly (keyof InteractionHintComponentConfigMap)[];

		interactionHintComponentKeys.forEach((componentKey) => {
			test(`${componentKey} - boolean true overrides global enableInteractionHint false`, () => {
				const config = resolveHintConfig(
					createTestConfig({
						componentConfigs: { [componentKey]: true }
					}),
					componentKey
				);

				expect(config.enabled).toBe(true);
				expect(config.followCursor).toBe(false);
				expect(config.hideArrow).toBe(false);
			});

			test(`${componentKey} - boolean false overrides global enableInteractionHint true`, () => {
				const config = resolveHintConfig(
					createTestConfig({
						enableInteractionHint: true,
						componentConfigs: { [componentKey]: false }
					}),
					componentKey
				);

				expect(config.enabled).toBe(false);
				expect(config.followCursor).toBe(false);
				expect(config.hideArrow).toBe(false);
			});

			test(`${componentKey} - object config overrides global settings`, () => {
				const config = resolveHintConfig(
					createTestConfig({
						componentConfigs: {
							[componentKey]: {
								enabled: true,
								followCursor: true,
								hideArrow: true
							}
						}
					}),
					componentKey
				);

				expect(config.enabled).toBe(true);
				expect(config.followCursor).toBe(true);
				expect(config.hideArrow).toBe(true);
			});
		});

		test("component config partial object merges with global settings", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true,
					componentConfigs: {
						button: {
							followCursor: true
						}
					}
				}),
				"button"
			);

			expect(config.enabled).toBe(true);
			expect(config.followCursor).toBe(true);
			expect(config.hideArrow).toBe(false);
		});

		test("no component config uses global settings only", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true,
					followCursor: true,
					hideArrow: true
				}),
				"button"
			);

			expect(config.enabled).toBe(true);
			expect(config.followCursor).toBe(true);
			expect(config.hideArrow).toBe(true);
		});
	});

	describe("position configuration", () => {
		test("includes position from componentConfigs for accordion", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true,
					componentConfigs: { accordion: { enabled: true, position: "left" } }
				}),
				"accordion"
			);

			expect(config.enabled).toBe(true);
			expect(config.position).toBe("left");
			expect(config.followCursor).toBe(false);
			expect(config.hideArrow).toBe(false);
		});

		test("includes position from componentConfigs for flyoutMenu", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true,
					componentConfigs: { verticalFlyoutMenu: { enabled: true, position: "right" } }
				}),
				"verticalFlyoutMenu"
			);

			expect(config.enabled).toBe(true);
			expect(config.position).toBe("right");
			expect(config.followCursor).toBe(false);
			expect(config.hideArrow).toBe(false);
		});

		test("includes position from componentConfigs for slidingMenu", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true,
					componentConfigs: { slidingMenu: { position: "left" } }
				}),
				"slidingMenu"
			);

			expect(config.enabled).toBe(true);
			expect(config.position).toBe("left");
			expect(config.followCursor).toBe(false);
			expect(config.hideArrow).toBe(false);
		});

		test("returns undefined position for components without position config", () => {
			const config = resolveHintConfig(
				createTestConfig({
					enableInteractionHint: true,
					componentConfigs: { accordion: { enabled: true, position: "left" } }
				}),
				"button"
			);

			expect(config.enabled).toBe(true);
			expect(config.position).toBeUndefined();
			expect(config.followCursor).toBe(false);
			expect(config.hideArrow).toBe(false);
		});
	});

	test("deep merge preserves all properties from both global and component config", () => {
		const config = resolveHintConfig(
			createTestConfig({
				enableInteractionHint: true,
				followCursor: true,
				componentConfigs: {
					accordion: {
						hideArrow: true,
						position: "left"
					}
				}
			}),
			"accordion"
		);

		expect(config.enabled).toBe(true);
		expect(config.followCursor).toBe(true);
		expect(config.hideArrow).toBe(true);
		expect(config.position).toBe("left");
	});
});

describe("useInteractionHint hook", () => {
	describe("with default values", () => {
		test("returns null hintRenderer and no a11y changes when disabled by default", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider>{children}</InteractionHintConfigProvider>
			);

			const { result } = renderHook(
				() =>
					useInteractionHint({
						title: "Test Title",
						componentKey: "button",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(result.current.hintRenderer).toBeNull();
			expect(result.current.title).toBe("Test Title");
		});
	});

	describe("with global configuration", () => {
		test("returns hintRenderer when globally enabled", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider enableInteractionHint>{children}</InteractionHintConfigProvider>
			);

			const { result } = renderHook(
				() =>
					useInteractionHint({
						title: "Test Title",
						componentKey: "button",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(result.current.hintRenderer).not.toBeNull();
			expect(result.current.title).toBe(undefined);
		});
	});

	describe("with component-specific configuration", () => {
		test("component config boolean true enables hint", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider componentConfigs={{ button: true }}>{children}</InteractionHintConfigProvider>
			);

			const { result } = renderHook(
				() =>
					useInteractionHint({
						title: "Test Title",
						componentKey: "button",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(result.current.hintRenderer).not.toBeNull();
			expect(result.current.title).toBe(undefined);
		});

		test("component config boolean false disables hint even when globally enabled", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ button: false }}>
					{children}
				</InteractionHintConfigProvider>
			);

			const { result } = renderHook(
				() =>
					useInteractionHint({
						title: "Test Title",
						componentKey: "button",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(result.current.hintRenderer).toBeNull();
			expect(result.current.title).toBe("Test Title");
		});

		test("component config object overrides global settings", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider
					enableInteractionHint={false}
					componentConfigs={{
						button: {
							enabled: true,
							followCursor: true,
							hideArrow: true
						}
					}}
				>
					{children}
				</InteractionHintConfigProvider>
			);

			const { result } = renderHook(
				() =>
					useInteractionHint({
						title: "Test Title",
						componentKey: "button",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(result.current.hintRenderer).not.toBeNull();
			expect(result.current.title).toBe(undefined);
		});

		test("different components can have different configs", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider
					componentConfigs={{
						button: true,
						link: false
					}}
				>
					{children}
				</InteractionHintConfigProvider>
			);

			const { result: buttonResult } = renderHook(
				() =>
					useInteractionHint({
						title: "Button Title",
						componentKey: "button",
						referenceElementRef
					}),
				{ wrapper }
			);

			const { result: linkResult } = renderHook(
				() =>
					useInteractionHint({
						title: "Link Title",
						componentKey: "link",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(buttonResult.current.hintRenderer).not.toBeNull();
			expect(linkResult.current.hintRenderer).toBeNull();
		});
	});

	describe("accessibility behavior", () => {
		test("suppresses native title and returns undefined ariaLabel when hint is enabled without explicit ariaLabel", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider enableInteractionHint>{children}</InteractionHintConfigProvider>
			);

			const { result } = renderHook(
				() =>
					useInteractionHint({
						title: "Test Title",
						componentKey: "button",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(result.current.title).toBe(undefined);
			expect(result.current.hintRenderer).not.toBeNull();
		});

		test("does not render hint when no title is provided", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider enableInteractionHint>{children}</InteractionHintConfigProvider>
			);

			const { result } = renderHook(
				() =>
					useInteractionHint({
						componentKey: "button",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(result.current.hintRenderer).toBeNull();
			expect(result.current.title).toBe(undefined);
		});
	});

	describe("without component type", () => {
		test("uses only global config when no componentKey specified", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider enableInteractionHint>{children}</InteractionHintConfigProvider>
			);

			const { result } = renderHook(
				() =>
					useInteractionHint({
						title: "Test Title",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(result.current.hintRenderer).not.toBeNull();
			expect(result.current.title).toBe(undefined);
		});

		test("component configs have no effect when componentKey is not specified", () => {
			const referenceElementRef = createRef<HTMLDivElement>();
			const wrapper = ({ children }: { children: ReactNode }) => (
				<InteractionHintConfigProvider
					enableInteractionHint
					componentConfigs={{
						button: false
					}}
				>
					{children}
				</InteractionHintConfigProvider>
			);

			const { result } = renderHook(
				() =>
					useInteractionHint({
						title: "Test Title",
						referenceElementRef
					}),
				{ wrapper }
			);

			expect(result.current.hintRenderer).not.toBeNull();
			expect(result.current.title).toBe(undefined);
		});
	});
});
