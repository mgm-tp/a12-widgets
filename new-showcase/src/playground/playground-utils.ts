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

import type { DefaultThemeType } from "@com.mgmtp.a12.widgets/widgets-core";

import { ShowcaseThemes } from "../themes/themes.js";

/** Relative URL of the sandboxed preview document (its own rsbuild entry / opaque-origin iframe). */
export const SANDBOX_PATH = "sandbox.html";

/** postMessage envelope tags — used to authenticate messages between the playground and its sandbox. */
export const SANDBOX_REQUEST_SOURCE = "a12-playground";
export const SANDBOX_REPLY_SOURCE = "a12-playground-sandbox";

/** Parent → sandbox: render this code under the given theme. */
export interface SandboxRunMessage {
	source: typeof SANDBOX_REQUEST_SOURCE;
	type: "run";
	code: string;

	/** Name of the theme to render the preview with (see PLAYGROUND_THEME_OPTIONS). */
	themeName: string;

	/**
	 * Full registry path of the showcase file this code was opened from (e.g. "showcases/drag-and-drop/basic").
	 * Used to disambiguate same-directory relative imports like "./basic.js".
	 */
	sourceName?: string;

	/** When true, the preview uses a dark background (#dbdfe8) - mirrors the showcase's `useDarkBackground` section config. */
	darkBackground?: boolean;
}

const playgroundThemes = ShowcaseThemes.getThemes();

/** Name of the theme the playground opens with when no `?theme=` is present. */
export const DEFAULT_PLAYGROUND_THEME = (playgroundThemes.find((theme) => theme.default) ?? playgroundThemes[0]).name;

/** Themes offered by the playground theme picker (current, non-deprecated themes). */
export const PLAYGROUND_THEME_OPTIONS = playgroundThemes
	.filter((theme) => !theme.deprecated)
	.map((theme) => ({ name: theme.name, label: theme.label ?? theme.name, subLabel: theme.subLabel }));

/**
 * Resolves a theme name to its widgets-core theme object, falling back to the default theme so an
 * unknown/stale `?theme=` value never breaks the preview. Used by the sandbox to theme what it renders.
 */
export function getPlaygroundTheme(name: string): DefaultThemeType {
	const found = playgroundThemes.find((theme) => theme.name === name);
	const resolved = found ?? playgroundThemes.find((theme) => theme.default) ?? playgroundThemes[0];

	return resolved.theme as DefaultThemeType;
}

/** Whether `name` is a selectable playground theme (validates `?theme=` before use). */
export function isPlaygroundTheme(name: string | null | undefined): name is string {
	return !!name && PLAYGROUND_THEME_OPTIONS.some((option) => option.name === name);
}

/** Sandbox → parent: it has mounted and is listening for run messages. */
export interface SandboxReadyMessage {
	source: typeof SANDBOX_REPLY_SOURCE;
	type: "ready";
}

export const DEFAULT_CODE = `import { useState } from "react";
import { styled } from "styled-components";
import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const StyledCounter = styled.div\`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 24px;
\`;

export default function CounterExample() {
  const [count, setCount] = useState(0);

  return (
    <StyledCounter>
      <Button icon={<Icon>remove</Icon>} onClick={() => setCount(count - 1)} />
      <span>{count}</span>
      <Button icon={<Icon>add</Icon>} onClick={() => setCount(count + 1)} />
    </StyledCounter>
  );
}
`;
