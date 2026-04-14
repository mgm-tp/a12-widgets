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

import type { FC, SyntheticEvent, ReactNode } from "react";
import { useRef, useState, useCallback, useEffect } from "react";

import {
	Chat,
	Icon,
	ResizeAndDragContainer,
	Button,
	ContentBox,
	ContentBoxElements
} from "@com.mgmtp.a12.widgets/widgets-core";

const { Container, Message, MessageGroup } = Chat;

interface ContainerProps {
	id: number;
	zIndex: number;
}

export const MultipleContainers: FC = () => {
	const referenceElement = useRef<HTMLDivElement | null>(null);

	const [containers, setContainers] = useState<ContainerProps[]>([]);
	const [nextContainerId, setNextContainerId] = useState<number>(1);

	const addContainer = useCallback((): void => {
		const newContainer = {
			id: nextContainerId,
			zIndex: containers.length
		};
		setContainers([...containers, newContainer]);
		setNextContainerId(nextContainerId + 1);
	}, [containers, nextContainerId]);

	const onClose = useCallback(
		(id: number, event?: SyntheticEvent<HTMLElement>): void => {
			if (event) {
				event.stopPropagation();
			}

			setContainers([...containers.filter((item) => item.id !== id)]);
		},
		[containers]
	);

	useEffect(() => {
		const rndContainers = document.querySelectorAll("[data-role=resize-and-drag-content]");

		if (rndContainers && rndContainers.length > 0) {
			(rndContainers.item(rndContainers.length - 1) as HTMLElement).focus();
		}
	}, [containers]);

	const handleClick = useCallback(
		(id: number): void => {
			const container = containers.find((item) => item.id === id);

			if (container) {
				const newContainerList = [...containers.filter((item) => item.id !== id), container];
				newContainerList.forEach((item, index) => (item.zIndex = index));
				setContainers(newContainerList);
			}
		},
		[containers]
	);

	const generateHeadingElements = useCallback(
		(item: ContainerProps): ReactNode => {
			return (
				<ContentBoxElements.Heading
					className="handle"
					suffixes={<ContentBoxElements.CloseButton onClick={(event) => onClose(item.id, event)} />}
				>
					<ContentBoxElements.Title text={"Peter (Container Nr. " + item.id + ")"} />
				</ContentBoxElements.Heading>
			);
		},
		[onClose]
	);

	return (
		<>
			<div key="element" className="h_inlineBlock" ref={referenceElement}>
				<Button icon={<Icon>add</Icon>} title="Show Container" onClick={addContainer} />
			</div>
			{containers.map(
				(item) =>
					referenceElement.current && (
						<ResizeAndDragContainer
							referenceElement={referenceElement.current}
							minHeight={200}
							minWidth={300}
							maxWidth={500}
							key={item.id}
							style={{ zIndex: item.zIndex }}
							cancel="button"
							focusOnReferenceElementAfterEsc={containers.length === 1}
							onClose={() => {
								if (containers.length > 0) {
									onClose(item.id);
								}
							}}
							onClick={() => handleClick(item.id)}
							onResizeStart={() => handleClick(item.id)}
							onDragStart={() => handleClick(item.id)}
						>
							<ContentBox heading={generateHeadingElements(item)} padding={false}>
								<Container>
									<MessageGroup>
										<Message status="11:11 am">Hello, my name is Peter. How can I help you?</Message>
									</MessageGroup>
									<MessageGroup position="right">
										<Message status="11:13 am">Hello! I have a question about room service.</Message>
									</MessageGroup>
									<MessageGroup>
										<Message status="11:13 am">Could you please tell me which service you're asking about?</Message>
									</MessageGroup>
									<MessageGroup position="right">
										<Message status="11:14 am">It's about pet services.</Message>
										<Message status="11:15 am">
											My puppies are staying with me and I would like to request food and in-room cleaning services.
										</Message>
									</MessageGroup>
									<MessageGroup>
										<Message status="11:16 am">
											Yes, sure. Please check the attached files with all the information about our pet services:
										</Message>
										<Message status="11:16 am">
											Pet Services Policy and Agreement <Icon>attachment</Icon>
										</Message>
										<Message status="11:16 am">
											Pet Services Registration <Icon>attachment</Icon>
										</Message>
									</MessageGroup>
									<MessageGroup position="right">
										<Message status="11:17 am">Great. I'll take a look.</Message>
									</MessageGroup>
								</Container>
							</ContentBox>
						</ResizeAndDragContainer>
					)
			)}
		</>
	);
};
