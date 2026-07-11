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

import type { ChangeEvent, ReactElement } from "react";
import { useState, useCallback } from "react";

import { provider, MessageBox, TextField, Select, Button, LoginLayout } from "@com.mgmtp.a12.widgets/widgets-core";

const { Headline, Form, FormItem, Logo, Footer } = LoginLayout;

const isMobile = provider.isPhone();

export function LoginLayoutExample(): ReactElement {
	const [username, setUsername] = useState("admin");
	const [password, setPassword] = useState("");
	const [language, setLanguage] = useState("en_US");
	const [loading, setLoading] = useState(false);
	const [invalid, setInvalid] = useState(false);

	const onUsernameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	}, []);

	const onPasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	}, []);

	const onLogin = useCallback(() => {
		setLoading(true);

		setTimeout(() => {
			setLoading(false);
			setInvalid(true);
		}, 1000);
	}, []);

	return (
		<LoginLayout mobile={isMobile} backgroundImage="images/login-bg.jpg">
			<Logo>
				<img alt="The A12 application logo" src="images/Logo-A12-Widgets-Showcase.png" />
			</Logo>
			<Headline>Log in to A12</Headline>
			<Form>
				{!loading && invalid && (
					<FormItem>
						<MessageBox variant="error" label="Incorrect username or password. Please try again." />
					</FormItem>
				)}
				<FormItem>
					<TextField
						label="Username"
						value={username}
						onChange={onUsernameChange}
						errorMessage={username ? undefined : "Username is required"}
					/>
				</FormItem>
				<FormItem>
					<TextField
						autoFocus
						label="Password"
						value={password}
						onChange={onPasswordChange}
						inputProps={{ type: "password" }}
						errorMessage={password ? undefined : "Password is required"}
					/>
				</FormItem>
				<FormItem>
					<Select
						label="Language"
						value={language}
						onValueChanged={setLanguage}
						items={[
							{ label: "English (USA)", value: "en_US" },
							{ label: "German (Germany)", value: "de_DE" }
						]}
					/>
				</FormItem>
			</Form>
			<Footer>
				<Button label="Login" primary block disabled={!username || !password} loading={loading} onClick={onLogin} />
			</Footer>
		</LoginLayout>
	);
}
