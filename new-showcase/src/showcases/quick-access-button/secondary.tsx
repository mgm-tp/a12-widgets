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

import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, Icon, QuickAccessButton } from "@com.mgmtp.a12.widgets/widgets-core";

import { DarkBackgroundContainer } from "../../helpers/showcase-wrapper.js";

export function SecondaryQuickAccessButtonShowcase(): ReactElement {
	const [active, setActive] = useState(false);

	const onVisibilityChange = (isPopupVisible: boolean): void => {
		setActive(isPopupVisible);
	};

	const mainAction = useMemo(() => {
		return ({ iconName, label, ...rest }: ButtonProps & { iconName?: string }): ReactNode => (
			<Button
				{...rest}
				label={label}
				icon={iconName && <Icon>{iconName}</Icon>}
				title={!label && iconName ? iconName : undefined}
			/>
		);
	}, []);

	return (
		<div>
			<ButtonGroup>
				<QuickAccessButton
					secondary
					mainAction={mainAction({ label: "Edit", iconName: "edit", secondary: true })}
					className="-u-margin-b-xs"
					actionItems={[
						{
							text: "Edit calendar",
							graphic: <Icon>event</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Edit notes",
							graphic: <Icon>assignment</Icon>
						},
						{
							text: "Edit contacts",
							graphic: <Icon>contacts</Icon>
						}
					]}
				/>
				<QuickAccessButton
					secondary
					destructive
					mainAction={mainAction({ label: "Delete", iconName: "delete", secondary: true, destructive: true })}
					className="-u-margin-b-xs"
					actionItems={[
						{
							text: "Delete",
							graphic: <Icon>delete</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Delete and close",
							graphic: <Icon>delete</Icon>
						}
					]}
				/>
				<QuickAccessButton
					secondary
					mainAction={mainAction({ label: "Disabled", iconName: "edit", secondary: true, disabled: true })}
					className="-u-margin-b-xs"
					actionItems={[
						{
							text: "Edit calendar",
							graphic: <Icon>event</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Edit notes",
							graphic: <Icon>assignment</Icon>
						},
						{
							text: "Edit contacts",
							graphic: <Icon>contacts</Icon>
						}
					]}
				/>
				<QuickAccessButton
					secondary
					disabled
					mainAction={mainAction({ label: "Disabled", iconName: "edit", secondary: true, disabled: true })}
					className="-u-margin-b-xs"
				/>
			</ButtonGroup>

			<p>Label only</p>
			<ButtonGroup>
				<QuickAccessButton
					secondary
					mainAction={mainAction({ label: "Edit", secondary: true })}
					className="-u-margin-b-xs"
					actionItems={[
						{
							text: "Edit calendar",
							graphic: <Icon>event</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Edit notes",
							graphic: <Icon>assignment</Icon>
						},
						{
							text: "Edit contacts",
							graphic: <Icon>contacts</Icon>
						}
					]}
				/>
				<QuickAccessButton
					secondary
					destructive
					mainAction={mainAction({ label: "Delete", secondary: true, destructive: true })}
					className="-u-margin-b-xs"
					actionItems={[
						{
							text: "Delete",
							graphic: <Icon>delete</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Delete and close",
							graphic: <Icon>delete</Icon>
						}
					]}
				/>
				<QuickAccessButton
					secondary
					mainAction={mainAction({ label: "Disabled", secondary: true, disabled: true })}
					className="-u-margin-b-xs"
					actionItems={[
						{
							text: "Edit calendar",
							graphic: <Icon>event</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Edit notes",
							graphic: <Icon>assignment</Icon>
						},
						{
							text: "Edit contacts",
							graphic: <Icon>contacts</Icon>
						}
					]}
				/>
				<QuickAccessButton
					secondary
					disabled
					mainAction={mainAction({ label: "Disabled", secondary: true, disabled: true })}
					className="-u-margin-b-xs"
				/>
			</ButtonGroup>

			<p>Icon only</p>
			<ButtonGroup>
				<QuickAccessButton
					secondary
					mainAction={mainAction({ iconName: "edit", secondary: true })}
					className="-u-margin-b-xs"
					actionItems={[
						{
							text: "Edit calendar",
							graphic: <Icon>event</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Edit notes",
							graphic: <Icon>assignment</Icon>
						},
						{
							text: "Edit contacts",
							graphic: <Icon>contacts</Icon>
						}
					]}
				/>
				<QuickAccessButton
					secondary
					destructive
					mainAction={mainAction({ iconName: "delete", secondary: true, destructive: true })}
					className="-u-margin-b-xs"
					actionItems={[
						{
							text: "Delete",
							graphic: <Icon>delete</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Delete and close",
							graphic: <Icon>delete</Icon>
						}
					]}
				/>
				<QuickAccessButton
					secondary
					mainAction={mainAction({ iconName: "edit", secondary: true, disabled: true })}
					className="-u-margin-b-xs"
					actionItems={[
						{
							text: "Edit calendar",
							graphic: <Icon>event</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Edit notes",
							graphic: <Icon>assignment</Icon>
						},
						{
							text: "Edit contacts",
							graphic: <Icon>contacts</Icon>
						}
					]}
				/>
				<QuickAccessButton
					secondary
					disabled
					mainAction={mainAction({ iconName: "edit", secondary: true, disabled: true })}
					className="-u-margin-b-xs"
				/>
			</ButtonGroup>

			<p>
				Secondary QuickAccessButton of the <code>invert</code> variant have a white outline and same background color as
				their parent element. They are recommended for use against dark backgrounds.
			</p>
			<DarkBackgroundContainer>
				<QuickAccessButton
					secondary
					invert
					mainAction={mainAction({ label: "Edit", iconName: "edit", secondary: true, invert: true })}
					actionItems={[
						{
							text: "Edit calendar",
							graphic: <Icon>event</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Edit notes",
							graphic: <Icon>assignment</Icon>
						},
						{
							text: "Edit contacts",
							graphic: <Icon>contacts</Icon>
						}
					]}
				/>
			</DarkBackgroundContainer>

			<p>QuickAccessButton with custom trigger icon</p>
			<ButtonGroup className="-u-max-width-xs">
				<QuickAccessButton
					secondary
					menuTriggerIcon={<Icon>{active ? "close" : "more_vert"}</Icon>}
					onVisibilityChange={onVisibilityChange}
					mainAction={mainAction({ label: "Save", iconName: "save", secondary: true })}
					actionItems={[
						{
							text: "Save",
							graphic: <Icon>save</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Save and close",
							graphic: <Icon>save</Icon>
						}
					]}
				/>
			</ButtonGroup>
		</div>
	);
}
