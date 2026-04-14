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
import { useMemo } from "react";

import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, Icon, QuickAccessButton } from "@com.mgmtp.a12.widgets/widgets-core";

export function PreserveMainActionStylesShowcase(): ReactElement {
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
		<ButtonGroup className="-u-margin-b-m">
			<QuickAccessButton
				primary
				preserveMainActionStyles
				mainAction={mainAction({ label: "Save", iconName: "save", primary: true })}
				actionItems={[
					{
						text: "Save",
						graphic: <Icon>save</Icon>,
						meta: <Icon>check</Icon>
					},
					{
						text: "Save and close",
						graphic: <Icon>save</Icon>
					},
					{
						text: "Save as draft",
						graphic: <Icon>drafts</Icon>
					}
				]}
			/>
			<QuickAccessButton
				primary
				destructive
				preserveMainActionStyles
				mainAction={mainAction({ label: "Delete", iconName: "delete", primary: true, destructive: true })}
				actionItems={[
					{
						text: "Delete",
						graphic: <Icon>delete</Icon>,
						meta: <Icon>check</Icon>
					},
					{
						text: "Delete permanently",
						graphic: <Icon>delete_forever</Icon>
					},
					{
						text: "Move to trash",
						graphic: <Icon>delete_sweep</Icon>
					}
				]}
			/>
			<QuickAccessButton
				secondary
				preserveMainActionStyles
				mainAction={mainAction({ label: "Edit", iconName: "edit", secondary: true })}
				actionItems={[
					{
						text: "Edit",
						graphic: <Icon>edit</Icon>,
						meta: <Icon>check</Icon>
					},
					{
						text: "Edit calendar",
						graphic: <Icon>event</Icon>
					},
					{
						text: "Edit notes",
						graphic: <Icon>assignment</Icon>
					}
				]}
			/>
		</ButtonGroup>
	);
}
