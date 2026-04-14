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
import { useRef, useState } from "react";
import { useDrag, useDragLayer, useDrop } from "react-dnd";

import type { Container } from "@com.mgmtp.a12.widgets/widgets-core";
import { DragAndDropUtils } from "@com.mgmtp.a12.widgets/widgets-core";

import {
	StyledDnDContainerShowcase,
	StyledDnDImageDragLayerShowcase,
	StyledDnDImageShowcase,
	StyledDnDItemShowcase,
	StyledDnDItemSourceShowcase
} from "./shared/dnd.styled.js";

type SimpleDnDPositionType = "left" | "right";

function DragLayerTemplate(props: Container): ReactElement<Container> {
	const { cords, isDragging } = useDragLayer((monitor) => ({
		cords: monitor.getSourceClientOffset(),
		isDragging: monitor.isDragging()
	}));

	if (!isDragging || !cords) {
		return <></>;
	}

	return (
		<StyledDnDImageDragLayerShowcase style={{ top: cords.y, left: cords.x }}>
			{props.children}
		</StyledDnDImageDragLayerShowcase>
	);
}

interface DragObject {
	draggedPosition: SimpleDnDPositionType;
}

interface DragSourceProps {
	position: SimpleDnDPositionType;
	onDropped(position: SimpleDnDPositionType): void;
}

function DragSourceTemplate(props: DragSourceProps): ReactElement<DragSourceProps> {
	const image = <StyledDnDImageShowcase src="images/dnd_image.png" alt="example dnd" />;
	const ref = useRef<HTMLDivElement>(null);

	const [_, drag] = useDrag<DragObject, DropResult, {}>({
		type: "SimpleDragAndDrop",
		item: { draggedPosition: props.position },
		end: (dropResult, monitor) => {
			const droppedPosition = monitor.getDropResult()?.droppedPosition;

			if (monitor.didDrop() && droppedPosition) {
				props.onDropped(droppedPosition);
			}
		}
	});

	drag(ref);

	return (
		<>
			<StyledDnDItemSourceShowcase ref={ref}>{image}</StyledDnDItemSourceShowcase>
			{DragAndDropUtils.canUseDragPreview() && (
				<div>
					<DragLayerTemplate>{image}</DragLayerTemplate>
				</div>
			)}
		</>
	);
}

interface DropResult {
	droppedPosition?: SimpleDnDPositionType;
}

interface DropTargetProps extends Container {
	position: SimpleDnDPositionType;
}

function DropTargetView(props: DropTargetProps): ReactElement<DropTargetProps> {
	const ref = useRef<HTMLDivElement>(null);
	const [_, dropConnector] = useDrop<DragObject, DropResult, {}>({
		accept: "SimpleDragAndDrop",
		drop: () => {
			return { droppedPosition: props.position };
		},
		canDrop: (item) => item.draggedPosition !== props.position
	});
	dropConnector(ref);

	return (
		<div ref={ref}>
			<StyledDnDItemShowcase>{props.children}</StyledDnDItemShowcase>
		</div>
	);
}

export function SimpleDnDExample() {
	const [position, setPosition] = useState<SimpleDnDPositionType>("left");
	const handleDropped = (newPosition: SimpleDnDPositionType) => {
		setPosition(newPosition);
	};

	return (
		<StyledDnDContainerShowcase>
			<DropTargetView position="left">
				{position === "left" && <DragSourceTemplate position={position} onDropped={handleDropped} />}
			</DropTargetView>
			<DropTargetView position="right">
				{position === "right" && <DragSourceTemplate position={position} onDropped={handleDropped} />}
			</DropTargetView>
		</StyledDnDContainerShowcase>
	);
}
