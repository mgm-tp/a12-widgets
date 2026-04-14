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

import type { ReactNode, ReactElement } from "react";

import {
	ActionContentbox,
	ContentBoxElements,
	Button,
	ButtonGroup,
	Icon,
	ModalNotification,
	ModalOverlay,
	TextLineStateless
} from "@com.mgmtp.a12.widgets/widgets-core";

export namespace Elements {
	interface RefreshModalProps {
		onClose(): void;
		children: ReactNode;
		title?: string;
		padding?: number | string | boolean;
	}
	export function InfoModal(props: RefreshModalProps): ReactElement<RefreshModalProps> {
		return (
			<ModalNotification
				focusBack={false}
				onClose={props.onClose}
				variant="info"
				closeOnOutsideClick
				title={props.title}
				padding={props.padding}
			>
				{props.children}
			</ModalNotification>
		);
	}

	interface ActionModalProps {
		title: string;
		children: ReactNode;
		actionButtonClick(): void;
		onClose(): void;
		disabledActionButton?: boolean;
	}
	export function ActionModal(props: ActionModalProps): ReactElement<ActionModalProps> {
		return (
			<ModalOverlay onClose={props.onClose}>
				<ActionContentbox
					padding={24}
					headingElements={<ContentBoxElements.Title ariaLevel={1} text={props.title} />}
					footer={
						<ContentBoxElements.Footer>
							<ButtonGroup alignment="right">
								<Button secondary label="Ok" onClick={props.actionButtonClick} disabled={props.disabledActionButton} />
								<Button secondary label="Cancel" destructive onClick={props.onClose} />
							</ButtonGroup>
						</ContentBoxElements.Footer>
					}
				>
					{props.children}
				</ActionContentbox>
			</ModalOverlay>
		);
	}

	interface ActionBarProps {
		leftSlot?: ReactNode;
		onClickRefresh?(): void;
	}
	export function ActionBar(props: ActionBarProps): ReactElement<ActionBarProps> {
		const { ActionBarGroupArea, ActionBarGroup, ActionBarGroupDivider } = ContentBoxElements;

		return (
			<ActionBarGroupArea
				leftSlot={[
					<ActionBarGroup key={1}>
						<TextLineStateless onChange={() => undefined} placeholder="Search..." suffixes={<Icon>search</Icon>} />
						<Button icon={<Icon>filter_list</Icon>} title="Filter button" />
					</ActionBarGroup>,
					<ActionBarGroupDivider key={2} />,
					<ActionBarGroup key={3}>{props.leftSlot}</ActionBarGroup>
				]}
				rightSlot={[
					<ActionBarGroup key={4}>
						<Button icon={<Icon>refresh</Icon>} secondary title="Refresh" onClick={props.onClickRefresh} />
					</ActionBarGroup>,
					<ActionBarGroupDivider key={5} />,
					<ActionBarGroup key={6}>
						<Button secondary disabled label="Add entry" />
					</ActionBarGroup>
				]}
			/>
		);
	}
}
