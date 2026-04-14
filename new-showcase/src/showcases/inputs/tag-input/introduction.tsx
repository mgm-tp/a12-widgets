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
import { useState, useCallback } from "react";
import { styled } from "styled-components";

import { BulletList, CollapsiblePanel } from "@com.mgmtp.a12.widgets/widgets-core";

const StyledShowcaseTextInCollapsiblePanel = styled.p`
	font-size: 16px;
	font-family: "Roboto", sans-serif;
`;

export function Introduction(): ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const toggleCollapsiblePanel = useCallback(() => setIsOpen(!isOpen), [isOpen]);

	return (
		<>
			<p>
				The <strong>Tag Input</strong> Widget provides an input that you can use to create tags.
			</p>
			<p>
				You can use the <code>Left Arrow</code>/<code>Right Arrow</code> keys or click via mouse to select a tag, and
				the <code>Backspace</code> or <code>Delete</code> keys to remove selected tags.
			</p>
			<strong>Here are some key properties you should take note of:</strong>
			<BulletList.Unordered>
				<BulletList.Item>
					<code>keys</code>: A list of the characters you can use to create a tag.
					<br />
					If you don't pass any <code>keys</code>, tags will be created by pressing the <code>comma</code> key. In this
					showcase, you can use the <code>comma</code>, <code>enter</code> or <code>semicolon</code> keys to create a
					tag.
					<br />
					Be aware that you won't be able to use the <code>comma</code> key to create a tag if you have a{" "}
					<code>keys</code> list, but it doesn't include <code>comma</code>.
				</BulletList.Item>
				<BulletList.Item>
					<code>popularTags</code>: The list of most-used tags that will display when the input of the
					<code>TagInput</code> is focused.
				</BulletList.Item>
				<BulletList.Item>
					<code>suggestionTags</code>: The list of tags that will display as suggestions when the user types a word
					similar to those inside the suggestion list.
				</BulletList.Item>
			</BulletList.Unordered>

			<CollapsiblePanel title="Touch Device Properties" onClick={toggleCollapsiblePanel}>
				{isOpen && (
					<>
						<StyledShowcaseTextInCollapsiblePanel>
							On touch devices, a modal will open when the <strong>TagInput</strong> is clicked. That modal will have a
							footer with 2 buttons:
						</StyledShowcaseTextInCollapsiblePanel>
						<BulletList.Unordered>
							<BulletList.Item>
								<strong>Save</strong>: Saves any changes (adding or removing of tags) and closes the modal.
							</BulletList.Item>
							<BulletList.Item>
								<strong>Cancel</strong>: Cancels any changes made (if any) and closes the modal.
							</BulletList.Item>
						</BulletList.Unordered>
						<StyledShowcaseTextInCollapsiblePanel>
							These 2 buttons are icon buttons by default, but they can be customized using the <code>modalFooter</code>{" "}
							property.
						</StyledShowcaseTextInCollapsiblePanel>
					</>
				)}
			</CollapsiblePanel>
		</>
	);
}
