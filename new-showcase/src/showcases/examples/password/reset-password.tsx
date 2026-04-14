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
import { useState, useMemo } from "react";

import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Button,
	LayoutGrid,
	LoginLayout,
	TextField,
	Icon,
	BulletList,
	noop
} from "@com.mgmtp.a12.widgets/widgets-core";

const { Form, FormItem, Headline, Footer, Container } = LoginLayout;
const { Grid, Row, Column } = LayoutGrid;

export function ResetPasswordShowcase(): ReactElement {
	const [breakpoint, setBreakpoint] = useState<SizeDetectorProps.BreakPoint | undefined>(undefined);
	const [showPasswordTips, setShowPasswordTips] = useState<boolean>(false);

	const isNarrowView = useMemo((): boolean => {
		return breakpoint?.size === "xs" || breakpoint?.size === "sm";
	}, [breakpoint]);

	const togglePasswordTipsButton = (): void => {
		setShowPasswordTips((show) => !show);
	};

	const renderPasswordForm = (): ReactNode => (
		<Container>
			<Headline>Reset Password</Headline>
			<div className="-u-margin-b-sm">
				You have successfully verified your account.
				<br />
				Please enter a new password.
			</div>
			<Form>
				<FormItem>
					<TextField label="New Password" autoFocus onChange={noop} />
				</FormItem>
				<FormItem>
					<TextField label="Repeat New Password" onChange={noop} />
				</FormItem>
			</Form>
			<Footer>
				<Button label="Submit & Login" primary block />
				{isNarrowView && (
					<Button icon={<Icon>help</Icon>} label="Password Tips" block onClick={togglePasswordTipsButton} />
				)}
			</Footer>
		</Container>
	);

	const renderPasswordTips = (): ReactNode => (
		<Container secondary>
			<Headline>Password Tips</Headline>
			<div>
				Here are some suggestions to create a secure password:
				<br />
				<br />
				<span>Use</span>
				<BulletList.Unordered>
					<BulletList.Item>(long) sentences</BulletList.Item>
					<BulletList.Item>unicode characters</BulletList.Item>
					<BulletList.Item>uppercase & lowercase letters</BulletList.Item>
					<BulletList.Item>a mix of letters & numbers</BulletList.Item>
					<BulletList.Item>special characters, e.g. "#"</BulletList.Item>
				</BulletList.Unordered>
				<span>Don't use</span>
				<BulletList.Unordered>
					<BulletList.Item>common words, e.g. "winter"</BulletList.Item>
					<BulletList.Item>common passwords, e.g. "Iloveyou"</BulletList.Item>
					<BulletList.Item>characters that are sequential alphabetically, e.g. "abc"</BulletList.Item>
					<BulletList.Item>characters that are next to each other on the keyboard, e.g. "asd"</BulletList.Item>
				</BulletList.Unordered>
				{isNarrowView && (
					<Button label="Back" secondary block icon={<Icon>chevron_left</Icon>} onClick={togglePasswordTipsButton} />
				)}
			</div>
		</Container>
	);

	return (
		<LoginLayout mobile={isNarrowView} style={{ flex: 1 }} noGutter backgroundImage="images/login-bg.jpg">
			<Grid noGutter className="-u-flex" onBreakPointChanged={setBreakpoint}>
				{isNarrowView ? (
					showPasswordTips ? (
						renderPasswordTips()
					) : (
						renderPasswordForm()
					)
				) : (
					<Column size={{ sm: 12, md: 12, lg: 12 }}>
						<Row style={{ flexShrink: 1 }}>
							<Column size={{ sm: 6, md: 6, lg: 6 }} className="-u-flex -u-justify-end">
								{renderPasswordForm()}
							</Column>
							<Column size={{ sm: 6, md: 6, lg: 6 }} className="-u-flex -u-justify-start">
								{renderPasswordTips()}
							</Column>
						</Row>
					</Column>
				)}
			</Grid>
		</LoginLayout>
	);
}
