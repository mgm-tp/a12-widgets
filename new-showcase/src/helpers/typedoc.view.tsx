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

import type { FC, ReactNode, ReactElement } from "react";
import { useCallback } from "react";
import { useTheme } from "styled-components";

import type { DefaultComponentsType } from "@com.mgmtp.a12.widgets/widgets-core";
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import { SourceCodeSection } from "@com.mgmtp.a12.widgets/widgets-utils";

import { ShowcaseTypographyHeadline } from "./showcase-typography-headline.js";
import { StyledCodeName, TypedocAPIComponent } from "./template/typedoc-api.view.js";
import type { WidgetInfo } from "./definitions.js";
import { getHashId } from "./utils.js";
import { ThemeSelector } from "./theme-selector.js";

interface ShowcaseTypedocProps {
	label: string;
	sectionUrl?: string;
	widgetInfo?: WidgetInfo;
}
export const ShowcaseTypedoc: FC<ShowcaseTypedocProps> = (props): ReactElement => {
	const renderTypedocTables = useCallback((): ReactNode => {
		return props.widgetInfo?.typedoc?.map((reference, index) => {
			return (
				<TypedocAPIComponent
					key={index}
					interfaceName={reference.name}
					moduleDeclaration={reference.declaration}
					filter={reference.filter}
				/>
			);
		});
	}, [props.widgetInfo?.typedoc]);

	return (
		<div id={getHashId(props.label + " api")} className="-u-padding-b-md">
			<ShowcaseTypographyHeadline
				sectionPath={{
					url: props?.sectionUrl,
					subSection: props.label.toLowerCase() + "-api"
				}}
				level={2}
			>
				API
			</ShowcaseTypographyHeadline>
			<div className="-u-margin-t-sm">
				<strong>Note:</strong>{" "}
				<BulletList.Unordered>
					{props.widgetInfo?.typedoc.find((apiInstance) => !!apiInstance.filter) && (
						<BulletList.Item>
							This API section only displays some of the most remarkable properties of the{" "}
							<strong>{props.label}</strong> widget. To find a full set of properties, please make use of an IDE to
							explore the Widget's source code.
						</BulletList.Item>
					)}
					<BulletList.Item>
						<code>
							prop<strong>*</strong>
						</code>{" "}
						is required.
					</BulletList.Item>
					<BulletList.Item>
						<StyledCodeName $deprecated>prop</StyledCodeName> is deprecated.
					</BulletList.Item>
				</BulletList.Unordered>
			</div>
			{renderTypedocTables()}
			{props.widgetInfo?.themingConfiguration && (
				<div id={getHashId(props.label + " theme-configuration")}>
					<ShowcaseTypographyHeadline
						sectionPath={{
							url: props?.sectionUrl,
							subSection: props.label.toLowerCase() + "-theme-configuration"
						}}
						level={2}
					>
						Theming configuration
					</ShowcaseTypographyHeadline>
					<ThemeSelector>
						<ThemeConfigurationView
							label={props.label}
							path={props.widgetInfo.themingConfiguration}
							note={props.widgetInfo.inheritedThemeConfigurationNote}
						/>
					</ThemeSelector>
				</div>
			)}
		</div>
	);
};

const ThemeConfigurationView = (props: {
	label: string;
	path: keyof DefaultComponentsType | (keyof DefaultComponentsType)[];
	note?: ReactNode;
}) => {
	const { path } = props;
	const currentTheme = useTheme();
	let sourceCode = "";

	if (Array.isArray(path)) {
		path.forEach((component) => {
			sourceCode =
				sourceCode + `"${component}": ` + JSON.stringify(currentTheme.components[component], undefined, 4) + `,\n`;
		});
	} else {
		const sourceJSON = JSON.stringify(currentTheme.components[path], undefined, 4);
		sourceCode = sourceJSON && `"${path}": ${sourceJSON}`;
	}

	return (
		<>
			{sourceCode ? (
				<>
					{props?.note}
					<p>
						{props?.note
							? "Additionally, the component provides built-in theme variables that can be used to customize itself:"
							: "The following theme variables can be used to customize the component:"}
					</p>
					<SourceCodeSection
						code={{ code: sourceCode }}
						style={{ maxHeight: "550px", overflowY: "auto", borderRadius: "4px" }}
					/>
				</>
			) : (
				(props?.note ?? <p>This component has no theme configuration (yet).</p>)
			)}
		</>
	);
};
