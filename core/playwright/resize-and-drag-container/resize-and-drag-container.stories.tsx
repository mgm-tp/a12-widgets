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

import { useState, useRef, useCallback } from "react";

import type { ResizeAndDragContainerProps } from "../../src/resize-and-drag-container/main/resize-and-drag-container.api.js";
import { ResizeAndDragContainer } from "../../src/resize-and-drag-container/main/resize-and-drag-container.view.js";
import { Button } from "../../src/button/main/button.view.js";
import { ContentBox, ContentBoxElements } from "../../src/contentbox/main/template/contentbox.tpl.view.js";
import { Icon } from "../../src/icon/main/icon.view.js";

export function ExampleResizableContainer(props: Omit<ResizeAndDragContainerProps, "referenceElement">) {
	const [show, setShow] = useState<boolean>(false);
	const referenceElement = useRef<HTMLDivElement | null>(null);

	const toggleShow = useCallback(() => {
		setShow(!show);
	}, [show]);

	const onClose = useCallback(() => {
		setShow(false);
	}, []);

	const headingElements = (
		<ContentBoxElements.Heading>
			<ContentBoxElements.Title text="Resizable Container" />
		</ContentBoxElements.Heading>
	);

	return (
		<>
			<div key="element" ref={referenceElement}>
				<Button icon={<Icon>add</Icon>} title="Show Container" onClick={toggleShow} id="button-trigger-id" />
			</div>
			{show && referenceElement.current && (
				<ResizeAndDragContainer
					{...props}
					key="container"
					referenceElement={referenceElement.current}
					closeOnOutsideClick
					onClose={onClose}
				>
					<ContentBox heading={headingElements}>
						<p>
							Enim enim magna ad sunt fugiat pariatur quis sit. Eu aute ea est fugiat nisi aliquip laboris proident et
							enim et amet culpa. Enim laborum aliquip esse ad reprehenderit officia sunt dolore cillum sit commodo
							dolor. Exercitation sint amet dolor laborum sint in incididunt cillum Lorem voluptate non deserunt qui
							commodo. Enim nisi id enim ipsum ex non dolor nostrud. Veniam sint dolore minim labore velit do consequat
							irure est. Labore proident voluptate quis voluptate deserunt culpa sint officia ex quis consequat dolor.
							Aliqua veniam proident enim deserunt proident non sit aute veniam minim cupidatat dolor sint. Nulla minim
							laboris adipisicing sint elit. Voluptate labore laborum voluptate veniam.
						</p>
					</ContentBox>
				</ResizeAndDragContainer>
			)}
		</>
	);
}
