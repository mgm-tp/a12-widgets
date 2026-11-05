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
import { useState } from "react";

import type { MessagePosition, TooltipPosition } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Checkbox,
	FieldDefaultConfigProvider,
	HintTooltip,
	Radio,
	Select,
	Switch,
	TextAreaStateless,
	TextField,
	TextOutput
} from "@com.mgmtp.a12.widgets/widgets-core";

const MESSAGE_ITEMS = [
	{ value: "above", label: "above" },
	{ value: "below", label: "below" }
];

const TOOLTIP_ITEMS = [
	{ value: "beside", label: "beside" },
	{ value: "above", label: "above" },
	{ value: "below", label: "below" }
];

const COUNTRIES = [
	{ value: "de", label: "Germany" },
	{ value: "cz", label: "Czechia" },
	{ value: "vn", label: "Vietnam" }
];

export function ProviderPlayground(): ReactElement {
	const [messagePosition, setMessagePosition] = useState<MessagePosition>("below");
	const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>("below");
	const [country, setCountry] = useState("de");
	const [subscribed, setSubscribed] = useState(false);
	const [contactMethod, setContactMethod] = useState<string | undefined>("email");
	const [twoFactor, setTwoFactor] = useState(false);

	return (
		<div className="-u-flex -u-flex-col -u-width-full" style={{ gap: 24 }}>
			<div className="-u-flex -u-flex-wrap" style={{ gap: 16 }}>
				<Select
					id="provider-message-position"
					label="messagePosition"
					items={MESSAGE_ITEMS}
					value={messagePosition}
					onValueChanged={(value) => setMessagePosition(value as MessagePosition)}
					fitToParent={false}
				/>
				<Select
					id="provider-tooltip-position"
					label="tooltipPosition"
					items={TOOLTIP_ITEMS}
					value={tooltipPosition}
					onValueChanged={(value) => setTooltipPosition(value as TooltipPosition)}
					fitToParent={false}
				/>
			</div>

			<FieldDefaultConfigProvider messagePosition={messagePosition} tooltipPosition={tooltipPosition}>
				<div className="-u-flex -u-flex-col -u-width-full" style={{ gap: 16 }}>
					<TextField
						id="provider-name"
						label="Name"
						errorMessage="This field is required"
						helperText="As it appears on your passport."
						onChange={() => undefined}
					/>
					<Select
						id="provider-country"
						label="Country"
						items={COUNTRIES}
						value={country}
						onValueChanged={setCountry}
						tooltips={<HintTooltip id="provider-country-hint" text="Decides which tax rules apply." />}
						ariaDescribedby="provider-country-hint"
					/>
					<TextAreaStateless
						id="provider-notes"
						label="Notes"
						infoMessage="This field is optional"
						helperText="Anything the reviewer should know."
						onChange={() => undefined}
					/>
					<Checkbox
						id="provider-subscribe"
						label="Subscribe to the newsletter"
						checked={subscribed}
						onChange={setSubscribed}
						tooltips={<HintTooltip id="provider-subscribe-hint" text="You can unsubscribe at any time." />}
						ariaDescribedby="provider-subscribe-hint"
					/>
					<Radio
						id="provider-contact"
						name="provider-contact"
						label="Preferred contact method"
						value={contactMethod}
						onValueChanged={setContactMethod}
						warningMessage="Please double-check this value"
					>
						<Radio.Item label="Email" value="email" />
						<Radio.Item label="Phone" value="phone" />
					</Radio>
					<TextOutput
						id="provider-customer-number"
						label="Customer number"
						tooltips={<HintTooltip id="provider-customer-number-hint" text="Quote this when contacting support." />}
					>
						CZ-4711-0042
					</TextOutput>
					<Switch
						id="provider-two-factor"
						label="Two-factor authentication"
						checked={twoFactor}
						onChange={setTwoFactor}
						tooltips={<HintTooltip id="provider-two-factor-hint" text="Asks for a code at every sign-in." />}
						ariaDescribedby="provider-two-factor-hint"
					/>
				</div>
			</FieldDefaultConfigProvider>
		</div>
	);
}
