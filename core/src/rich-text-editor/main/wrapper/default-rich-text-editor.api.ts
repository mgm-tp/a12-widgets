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

import type { RichTextEditorProps } from "../rich-text-editor.api.js";
import type { TooltipPluginConfig } from "../plugins/tooltip-plugin/tooltip-plugin.api.js";
import type { MentionPluginProps } from "../plugins/mentions-plugin/mention-plugin.api.js";
import type { SpellCheckConfig, SpellCheckPopupProps } from "../plugins/spell-check-plugin/spell-check-plugin.api.js";
import type { AutoLinkPluginProps } from "../plugins/auto-link-plugin/auto-link.api.js";
import type { FollowLinkPopupProps } from "../plugins/follow-link-popup-plugin/follow-link-popup-plugin.api.js";
import type { OutPutPluginProps } from "../plugins/output-plugin/output-plugin.api.js";

export interface DefaultRichTextEditorProps extends Partial<RichTextEditorProps> {
	/**
	 * Configuration for the tooltip plugin.
	 */
	tooltipPluginConfig?: TooltipPluginConfig;

	/**
	 * Configuration for the mention plugin.
	 */
	mentionPluginConfig?: MentionPluginProps;

	/**
	 * Configuration for the spell check plugin.
	 */
	spellCheckPluginConfig?: SpellCheckPluginConfig;

	/**
	 * Configuration for the link plugin.
	 */
	linkPluginConfig?: LinkPluginConfig;

	/**
	 * Configuration for the output plugin.
	 */
	outputConfig?: OutPutPluginProps;
}

export interface LinkPluginConfig extends AutoLinkPluginProps {
	popupRenderer: FollowLinkPopupProps["render"];
}

export type SpellCheckPluginConfig = SpellCheckConfig & SpellCheckPopupProps;
