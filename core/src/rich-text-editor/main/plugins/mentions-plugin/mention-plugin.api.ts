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

export interface MentionOption {
	/**
	 * Mention name that display when search for mention.
	 */
	name: string;

	/**
	 * Mention value that display in the editor after add mention.
	 */
	value: string;
}

export interface MentionPluginProps {
	/**
	 * Provide possible options for mention list.
	 */
	suggestions: MentionOption[];

	/**
	 * Key string that triggers the Mention plugin.
	 * @default "@"
	 */
	mentionTrigger?: string;

	/**
	 * Regex string that triggers the Mention plugin.
	 */
	mentionRegExp?: string;

	/**
	 * The function trigger when search for mentions.
	 */
	onSearchChange?(searchValue: string): void;

	/**
	 * The function trigger when add a mention.
	 */
	onAddMention?(mention: MentionOption): void;

	/**
	 * If true, resets the text format (such as bold, italic, underline, and any custom styles) after transforming to the Mention Node.
	 */
	clearTextFormatAfterTransform?: boolean;
}
