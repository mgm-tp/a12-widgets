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

import type { ReactNode } from "react";
import type { JSONOutput } from "typedoc";

import type { SourceCode } from "@com.mgmtp.a12.widgets/widgets-utils/lib/code-example/index.js";
import type { DefaultComponentsType } from "@com.mgmtp.a12.widgets/widgets-core";

export interface FeaturedWidget {
	name: string;
	url: string;
	description?: string;
}

export interface Description {
	info?: ReactNode;
	note?: ReactNode;
	warning?: ReactNode;
}

export interface Showcase {
	label: string;
	description?: Description | ReactNode;
	sections: Section[] | GroupSections;
	path?: string;
	code?: ReactNode;
	featuredWidgets?: FeaturedWidget[];
}

export interface Section {
	label?: string;
	description?: ReactNode | Description;
	content?: ReactNode;
	code?: SourceCode | SourceCode[];

	/**
	 * Declare this property if the widget behave & configured differently on small screen
	 */
	smallScreen?: Section;

	/**
	 * To display the plain {@link content} passed in which should use ConfigurationView component.
	 */
	useConfiguration?: boolean;

	/**
	 * To display the full size component
	 */
	fullSize?: boolean;

	/**
	 * To display the plain {@link content} passed in inside a wrapper with dark background.
	 */
	useDarkBackground?: boolean;

	/**
	 * To fits the plain {@link content} passed in with the width and height of the wrapper.
	 */
	fitToSection?: boolean;

	/**
	 * List of widgets which are used for the examples.
	 */
	featuredWidgets?: FeaturedWidget[];

	/**
	 * When this mode is enabled, the user is able to toggle between displaying a skeleton code snippet or displaying the full source code.
	 */
	toggleBetweenPartialAndFullCode?: boolean;
}

export interface GroupSection {
	label?: string;
	description?: Description | ReactNode;
	sections: Section[];
}

export interface GroupSections {
	basic?: GroupSection;

	advanced?: GroupSection;

	complex?: GroupSection;
}

export interface WidgetInfo {
	/**
	 * Link to the typedoc
	 */
	typedoc: {
		name?: string;
		declaration: JSONOutput.DeclarationReflection;

		/*
		 * If specified, the given API(s) will be shown.
		 * If empty or undefined, all API(s) will be shown.
		 */
		filter?: string[];
	}[];
	themingConfiguration?: keyof DefaultComponentsType | (keyof DefaultComponentsType)[];

	/**
	 * Description for the component which inherits the style configuration of another component.
	 */
	inheritedThemeConfigurationNote?: ReactNode;
}

interface FullAddress {
	streetA: string;
	streetB: string;
	streetC: string;
	streetD: string;
	city: string;
	state: string;
	county: string;
	zipcode: string;
	geo: Geo;
}

interface Geo {
	lat: number;
	lng: number;
}

interface Company {
	name: string;
	catchPhrase: string;
	bs: string;
}

interface Post {
	words: string;
	sentence: string;
	sentences: string;
	paragraph: string;
}

interface Address {
	street: string;
	suite: string;
	city: string;
	state: string;
	zipcode: string;
	geo: Geo;
}

export interface Card {
	name: string;
	username: string;
	email: string;
	address: FullAddress;
	phone: string;
	website: string;
	company: Company;
	posts: Post[];
	accountHistory: string[];
}

export interface UserCard {
	name: string;
	username: string;
	email: string;
	address: Address;
	phone: string;
	website: string;
	company: Company;
}

export interface ContextualCard {
	name: string;
	username: string;
	avatar: string;
	email: string;
	dob: string;
	phone: string;
	address: Address;
	website: string;
	company: Company;
}

export interface Transaction {
	amount: string;
	date: string;
	business: string;
	name: string;
	type: string;
	account: string;
}
