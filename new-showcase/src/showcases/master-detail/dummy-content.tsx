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

import { loremIpsum } from "lorem-ipsum";
import type { FC, ReactElement } from "react";
import { useState, useCallback, useMemo } from "react";

import { Button, ContentBox, ContentBoxElements, Icon, Select, TextField } from "@com.mgmtp.a12.widgets/widgets-core";

import type { MasterDetailComponent } from "./showcase-master-detail.api.js";

export interface DummyContentProps {
	readonly name: string;
	id: string;
	onNext?(triggerElementId?: string): void;
	onPrevious?(): void;
	fullscreenable?: boolean; // To decide whether the component should have fullscreen feature or not
	fullscreen?: boolean; // To handle whether the component is collapsed or fullscreen
	onFullscreenToggled?(fullscreenButtonId?: string): void;
	smallView: boolean;
	titleAriaLevel: number;
	tabIndex?: number;
	views?: MasterDetailComponent[];
	replacement?: {
		currentViewId?: string;
		replacerViewId?: string;
	};
	handleReplace?(currentId: string, replacerId: string): void;
}

export const DummyContent: FC<DummyContentProps> = (props: DummyContentProps) => {
	const [value, setValue] = useState("");
	const { id, handleReplace, views, replacement, onNext } = props;

	const getColumnCountFromId = useCallback((id: string): number => {
		return Number(id.split("_")[1]);
	}, []);

	const replaceView = useCallback(
		(replacerId: string): void => {
			handleReplace?.(id, replacerId);
		},
		[id, handleReplace]
	);

	const dummyText = useMemo((): string => loremIpsum({ count: 5, units: "paragraphs" }), []);

	const content = useMemo(() => {
		const newContent: ReactElement[] = [];

		if (onNext) {
			const buttonId = id ? `${id}-expandButton` : undefined;
			newContent.push(
				<div className="-u-margin-t-sm" key="next">
					Click &nbsp;
					<Button id={buttonId} onClick={() => onNext?.(buttonId)}>
						here
					</Button>
					&nbsp; to open the next detail.
				</div>
			);
		}

		if (views && views.length > 0) {
			const components = [...views];
			newContent.push(
				<div className="-u-margin-b-base -u-margin-t-base" key="replace">
					<Select
						value={replacement?.currentViewId}
						label={
							replacement?.replacerViewId && replacement?.currentViewId
								? `Component ${getColumnCountFromId(replacement.replacerViewId)} is replaced by`
								: "Replaced by"
						}
						onValueChanged={replaceView}
						placeholder="Select component to replace"
						items={components
							.sort((item1, item2) => {
								return Number(item1.label.split(" ")[1]) - Number(item2.label.split(" ")[1]);
							})
							.map((view) => ({
								label: view.label,
								value: view.id
							}))}
					/>
				</div>
			);
		}

		newContent.push(
			<TextField
				key="input"
				className="-u-margin-t-base"
				label="Sample TextField"
				value={value}
				onChange={(event) => setValue(event.target.value)}
			/>
		);

		newContent.push(
			<div key="info">
				<p>
					The Master Detail Layout allows you to display additional information (Detail View) to any item listed in the
					previous Detail View or Master View.
				</p>
				<p>
					In this example the Master View is represented by Component 1. After selecting an item (by clicking on “here”)
					its Detail View will be opened (represented by Component 2). Clicking on an item in this Detail View will open
					the next one (Component 3). The master view will be minimized to a "chip" above the first view. Clicking on an
					item in the 2nd detail view will open the 3rd detail view, etc. Detail views not shown will be minimized next
					to the master “chip”. Clicking on this "chip" will provide a shortcut back to the related view.
					<br />
					On mobile devices each view will be displayed full screen. Views not shown will be grouped in a select above.
				</p>
				<p>
					For better usability we recommend that the height of the views doesn’t exceed the height of the viewport. The
					Master and Detail views altogether should take up 100% of the viewport’s height. This guarantees that the user
					has access to all actions of a view, executable via buttons in the view’s content box header and/or footer,
					without any page scrolling.
				</p>
				<p>
					<strong>This is just a dummy text. </strong>
					{dummyText}
				</p>
			</div>
		);

		return newContent;
	}, [getColumnCountFromId, id, onNext, replaceView, replacement, value, views, dummyText]);

	const previous = props.onPrevious;
	const fullscreenButtonID = props.id ? `${props.id}-fullscreenButton` : undefined;

	return (
		<ContentBox
			id={props.id}
			tabIndex={props.tabIndex}
			heading={
				<ContentBoxElements.Heading
					prefixes={props.smallView && previous && <ContentBoxElements.BackButton onClick={previous} />}
					suffixes={
						!props.smallView && (
							<>
								{props.fullscreenable && (
									<ContentBoxElements.HeadingActionButton
										id={fullscreenButtonID}
										icon={props.fullscreen ? <Icon>fullscreen_exit</Icon> : <Icon>fullscreen</Icon>}
										title={props.fullscreen ? "Minimize" : "Maximize"}
										onClick={() => props.onFullscreenToggled?.(fullscreenButtonID)}
									/>
								)}
								{previous && <ContentBoxElements.CloseButton onClick={previous} />}
							</>
						)
					}
				>
					<ContentBoxElements.Title ariaLevel={props.titleAriaLevel} text={props.name} />
				</ContentBoxElements.Heading>
			}
			footer={<ContentBoxElements.Footer />}
		>
			{content}
		</ContentBox>
	);
};
