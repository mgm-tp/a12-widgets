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

import type { FC } from "react";
import { useState } from "react";

import type { Container } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	BulletList,
	Button,
	ButtonGroup,
	ButtonGroupContainer,
	LayoutGrid,
	LoginLayout,
	ModalOverlay,
	TextField,
	ContentBoxElements,
	ActionContentbox,
	noop,
	provider
} from "@com.mgmtp.a12.widgets/widgets-core";

const { Grid, Row, Column } = LayoutGrid;

interface ChangePasswordColumnProps {
	secondary?: boolean;
}

const ChangePasswordColumn: FC<ChangePasswordColumnProps & Container> = (props) => {
	return (
		<Column size={{ sm: 6, md: 6, lg: 6 }} className={props.secondary ? "-sc-background-secondary" : undefined}>
			<div className="-u-padding-md">{props.children}</div>
		</Column>
	);
};

export const ChangePasswordShowcase: FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggleOpenModal = (boolean: boolean): void => {
		setIsOpen(boolean);
	};

	const content = (
		<Grid noGutter>
			<Row>
				<ChangePasswordColumn>
					<LoginLayout.FormItem>
						<TextField label="Current Password" onChange={noop} />
					</LoginLayout.FormItem>
					<LoginLayout.FormItem>
						<TextField label="New Password" onChange={noop} />
					</LoginLayout.FormItem>
					<LoginLayout.FormItem>
						<TextField label="Repeat New Password" onChange={noop} />
					</LoginLayout.FormItem>
				</ChangePasswordColumn>
				<ChangePasswordColumn secondary>
					<strong>Password Conditions</strong>
					<p>Your password should fulfill the following conditions:</p>
					<BulletList.Unordered>
						<BulletList.Item>at least 8 characters</BulletList.Item>
						<BulletList.Item>at least one special character</BulletList.Item>
						<BulletList.Item>at least one uppercase letter</BulletList.Item>
						<BulletList.Item>at least one lowercase letter</BulletList.Item>
						<BulletList.Item>at least one number</BulletList.Item>
						<BulletList.Item>different than your old password</BulletList.Item>
					</BulletList.Unordered>
				</ChangePasswordColumn>
			</Row>
		</Grid>
	);

	return (
		<>
			<Button label="Change Password" primary onClick={(): void => handleToggleOpenModal(true)} />
			{isOpen && (
				<ModalOverlay closeOnOutsideClick={provider.isDesktop()} onClose={(): void => handleToggleOpenModal(false)}>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={1} text="Change Password" />}
						headingButtons={<ContentBoxElements.CloseButton onClick={() => handleToggleOpenModal(false)} />}
						footer={
							<ContentBoxElements.Footer>
								<ButtonGroupContainer>
									<ButtonGroup alignment="right">
										<Button secondary onClick={(): void => handleToggleOpenModal(false)} label="Cancel" />
										<Button primary onClick={(): void => handleToggleOpenModal(false)} label="Save" />
									</ButtonGroup>
								</ButtonGroupContainer>
							</ContentBoxElements.Footer>
						}
						padding={false}
					>
						{content}
					</ActionContentbox>
				</ModalOverlay>
			)}
		</>
	);
};
