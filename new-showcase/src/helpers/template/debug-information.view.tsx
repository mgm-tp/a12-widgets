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
import { useState, useContext, useRef, useCallback, useEffect } from "react";

import { Button, HintTooltip, Tooltip, Icon, List, PopUpMenu, Switch } from "@com.mgmtp.a12.widgets/widgets-core";

import {
	getLocalStorage,
	removeLocalStorage,
	setLocalStorage,
	defaultProvider as DefaultDeviceDetector
} from "../../helpers/utils.js";

import { ThemeContext } from "../theme-selector.js";
import type { InteractionHintSettingProps } from "../use-interaction-hint-settings.js";
import type { KeyboardNavigationSettingProps } from "../use-keyboard-navigation-settings.js";

import { ThemeUpload } from "./theme-upload.view.js";

export interface DebugInformationProps {
	touchSupport?: boolean;
	onTouchSupportToggle?(): void;
	onA11yLanguageChange?(locale: string): void;
	interactionHintSettings?: InteractionHintSettingProps;
	keyboardNavigationSettings?: KeyboardNavigationSettingProps;
}

export function DebugInformation(props: DebugInformationProps): ReactElement | null {
	const a11yLanguageKey = "a11yLanguage";
	const { Item, SubHeader } = List;
	const device = DefaultDeviceDetector.get();
	const [developmentMode, setDevelopmentMode] = useState(getLocalStorage("mode") === "development");
	const {
		onA11yLanguageChange,
		keyboardNavigationSettings: { mode: keyboardNavMode, setDefaultMode, setArrowOnlyMode } = {},
		interactionHintSettings: {
			enableInteractionHint,
			followCursor,
			hideArrow,
			toggleEnableInteractionHint,
			toggleFollowCursor,
			toggleHideArrow
		} = {}
	} = props;

	const { setTheme } = useContext(ThemeContext);

	/**
	 * This is a key combination that allows for easy switching
	 * between production and development showcase mode.
	 */
	const developmentModeCapturedKeysRef = useRef({ shiftLeft: false, shiftRight: false });

	const handleKeydownListener = useCallback(
		(event: KeyboardEvent) => {
			if (event.code === "ShiftLeft") {
				developmentModeCapturedKeysRef.current.shiftLeft = true;
			} else if (event.code === "ShiftRight") {
				developmentModeCapturedKeysRef.current.shiftRight = true;
			}

			if (developmentModeCapturedKeysRef.current.shiftLeft && developmentModeCapturedKeysRef.current.shiftRight) {
				const mode = getLocalStorage("mode");

				if (mode === "development") {
					removeLocalStorage("mode");
					setDevelopmentMode(false);
					setTheme?.("default");
				} else {
					setLocalStorage("mode", "development");
					setDevelopmentMode(true);
				}
			}
		},
		[setTheme]
	);

	const handleKeyupListener = useCallback((event: KeyboardEvent) => {
		if (event.code === "ShiftLeft") {
			developmentModeCapturedKeysRef.current.shiftLeft = false;
		} else if (event.code === "ShiftRight") {
			developmentModeCapturedKeysRef.current.shiftRight = false;
		}
	}, []);

	const handleLocaleChange = useCallback(
		(locale: string): void => {
			setLocalStorage(a11yLanguageKey, locale);
			onA11yLanguageChange?.(locale);
		},
		[onA11yLanguageChange]
	);

	const locale = getLocalStorage(a11yLanguageKey);

	useEffect(() => {
		window.addEventListener("keydown", handleKeydownListener);
		window.addEventListener("keyup", handleKeyupListener);

		return (): void => {
			window.removeEventListener("keydown", handleKeydownListener);
			window.removeEventListener("keyup", handleKeyupListener);
		};
	}, [handleKeydownListener, handleKeyupListener]);

	return developmentMode ? (
		<>
			<PopUpMenu headerTitle="Menu" key="version" icon={<Icon iconTheme="filled">settings</Icon>}>
				<List paddedRight>
					<SubHeader fill>Device info</SubHeader>
					<Item text="Type:" meta={<span style={{ textTransform: "capitalize" }}>{device}</span>} readonly />
					<Item
						text="Touch available"
						meta={
							<Tooltip text="Indicate if the device has touch capabilities">
								<Button
									icon={
										DefaultDeviceDetector.hasTouch() ? (
											<Icon variant="success">check_circle</Icon>
										) : (
											<Icon variant="error">cancel</Icon>
										)
									}
								/>
							</Tooltip>
						}
						readonly
					/>
					{DefaultDeviceDetector.hasTouch() && (
						<Item
							readonly
							text="Touch support"
							meta={<Switch onChange={() => props.onTouchSupportToggle?.()} checked={props.touchSupport} />}
						/>
					)}
					<SubHeader fill>
						A11y Language &nbsp;
						<HintTooltip text="For accessibility hidden text, use the list below to change the language. This doesn't change UI language." />
					</SubHeader>
					<Item
						text="English"
						meta={(!locale || locale === "en") && <Icon>check</Icon>}
						selected={!locale || locale === "en"}
						onClick={() => handleLocaleChange("en")}
					/>
					<Item
						text="German"
						meta={locale === "de" && <Icon>check</Icon>}
						selected={locale === "de"}
						onClick={() => handleLocaleChange("de")}
					/>
					<SubHeader fill>Keyboard Navigation</SubHeader>
					<Item
						text="Default"
						meta={keyboardNavMode === "default" && <Icon>check</Icon>}
						selected={keyboardNavMode === "default"}
						onClick={setDefaultMode}
					/>
					<Item
						text="Arrow Only"
						meta={keyboardNavMode === "arrow-only" && <Icon>check</Icon>}
						selected={keyboardNavMode === "arrow-only"}
						onClick={setArrowOnlyMode}
					/>
					<SubHeader fill>Interaction Hint Config</SubHeader>
					<Item
						text="Enable Hint"
						meta={enableInteractionHint && <Icon>check</Icon>}
						selected={enableInteractionHint}
						onClick={toggleEnableInteractionHint}
					/>
					<Item
						text="Follow Cursor"
						meta={followCursor && <Icon>check</Icon>}
						selected={followCursor}
						onClick={toggleFollowCursor}
						disabled={!enableInteractionHint}
					/>
					<Item
						text="Hide Arrow"
						meta={hideArrow && <Icon>check</Icon>}
						selected={hideArrow}
						onClick={toggleHideArrow}
						disabled={!enableInteractionHint}
					/>
				</List>
			</PopUpMenu>
			{device === "desktop" && <ThemeUpload />}
		</>
	) : null;
}
