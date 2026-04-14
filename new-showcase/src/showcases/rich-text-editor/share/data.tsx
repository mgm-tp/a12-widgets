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

import type { InlineButtonProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	BoldButton,
	createButtonGroup,
	createInlineButton,
	ItalicButton,
	UnderlineButton,
	BulletListButton,
	IndentDecreaseButton,
	IndentIncreaseButton,
	NumberListButton,
	Separator,
	AlignButtonGroup,
	Icon
} from "@com.mgmtp.a12.widgets/widgets-core";

const markTextType: InlineButtonProps[] = [
	{
		nodeClassName: "editor-text-mark-1",
		className: "editor-text-mark-1",
		label: <span className="editor-text-mark-1">Mark 1</span>,
		title: "Mark One - bold and green",
		nodeIsolate: true,
		allowCollapseStyle: false,
		allowMultipleChoice: false
	},
	{
		nodeClassName: "editor-text-mark-2",
		className: "editor-text-mark-2",
		label: <span className="editor-text-mark-2">Mark 2</span>,
		title: "Mark Two - italic and red",
		nodeIsolate: true,
		allowCollapseStyle: false,
		allowMultipleChoice: false
	}
];

const formatTextType: InlineButtonProps[] = [
	{
		nodeClassName: "editor-text-strikethrough",
		label: "Strikethrough"
	},
	{
		nodeClassName: "editor-text-monospace",
		label: "Monospace"
	}
];

export const customInlineButtons = formatTextType.map((format: InlineButtonProps) => {
	return createInlineButton({
		nodeClassName: format.nodeClassName,
		label: (
			<span className={`${format.nodeClassName}`}>
				{(format.label as string)?.replace(/\b\w/g, (c) => c.toUpperCase())}
			</span>
		),
		className: format.nodeClassName
	});
});

export const TextFormatButtonGroup = createButtonGroup({
	icon: <Icon>text_format</Icon>,
	buttons: customInlineButtons,
	title: "More"
});

export const MarkButtonGroup = createButtonGroup({
	icon: <Icon>code</Icon>,
	buttons: markTextType.map(createInlineButton),
	title: "Mark text"
});

export const BUTTONS = [
	BoldButton,
	ItalicButton,
	UnderlineButton,
	TextFormatButtonGroup,
	Separator,
	BulletListButton,
	NumberListButton,
	Separator,
	IndentDecreaseButton,
	IndentIncreaseButton,
	Separator,
	AlignButtonGroup,
	Separator,
	MarkButtonGroup
];
