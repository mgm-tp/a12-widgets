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
import { useContext, useCallback, useEffect, isValidElement, useState, useRef, useMemo } from "react";
import type { Options } from "react-element-to-jsx-string";
import reactElementToJSXString from "react-element-to-jsx-string";
import { styled } from "styled-components";

import type { Container } from "@com.mgmtp.a12.widgets/widgets-core";

import { ShowcaseTypographyHeadline } from "./showcase-typography-headline.js";
import type { Section } from "./definitions.js";
import { getHashId } from "./utils.js";
import { ThemeSelector } from "./theme-selector.js";
import { ShowcaseDescription } from "./showcase-description.js";
import { ShowcaseExampleContent } from "./showcase-example-content.js";
import { ShowcaseExampleToolbar } from "./showcase-example-toolbar.js";
import { ShowcaseExampleContext } from "./showcase-example-context.js";

export const StyledWrapper = styled.div`
	box-sizing: border-box;
	display: flex;
	gap: 8px;
`;

interface ShowcaseExampleProps extends Section {
	reportLabel?: string;
	sectionUrl?: string;
}

type NamespaceOption = {
	name: string;
	subComponents: string[];
};

interface ShowcaseCodeSnippetGeneratorProps extends Container {
	options?: Options;
	namespaceOptions?: NamespaceOption[];
	useFlexboxLayout?: boolean;
}

export const ShowcaseExampleContextProvider = ShowcaseExampleContext.Provider;

/**
 * This custom hook is for generating code snippets with showcases that requires configuration.
 * Notice: Please avoid using {generateUid()} to generate ids for Elements passed into this custom hook,
 * since this custom hook works based on useEffect, generating dynamic ids may lead to an infinite re-render loop.
 */
export function CodeSnippetGenerationWrapper(
	props: ShowcaseCodeSnippetGeneratorProps
): ReactElement<ShowcaseExampleProps> {
	const { children, options, namespaceOptions } = props;
	const { setGeneratedCodeSnippet } = useContext(ShowcaseExampleContext);

	const displayName = useCallback(
		(element: ReactNode): string => {
			const elementType = (element as ReactElement)?.type as any;
			const typeDisplayName = elementType?.displayName;
			const typeName = elementType?.name;

			const matchedOption = namespaceOptions?.find((option) =>
				option.subComponents.includes(typeDisplayName || typeName)
			);

			return matchedOption?.name
				? `${matchedOption.name}.${typeDisplayName || typeName}`
				: typeDisplayName || typeName || elementType;
		},
		[namespaceOptions]
	);

	useEffect(() => {
		const codeSnippet = reactElementToJSXString(isValidElement(children) ? children : <>{children}</>, {
			maxInlineAttributesLineLength: 80,
			showFunctions: true,
			...options,
			displayName: namespaceOptions ? displayName : options?.displayName
		});

		setGeneratedCodeSnippet?.(codeSnippet);
	}, [children, displayName, namespaceOptions, options, setGeneratedCodeSnippet]);

	return props.useFlexboxLayout ? <StyledWrapper>{children}</StyledWrapper> : <>{children}</>;
}

export function ShowcaseExample(props: ShowcaseExampleProps): ReactElement<ShowcaseExampleProps> {
	const {
		label,
		description,
		content,
		code,
		useConfiguration,
		reportLabel,
		fitToSection,
		fullSize,
		useDarkBackground,
		sectionUrl,
		featuredWidgets,
		toggleBetweenPartialAndFullCode
	} = props;
	const [generatedCodeSnippet, setGeneratedCodeSnippet] = useState<string>("");
	const [shouldContentWrapperFocusable, setShouldContentWrapperFocusable] = useState(false);
	const contentWrapperRef = useRef<HTMLDivElement | null>(null);

	const renderedContent = useMemo((): ReactNode => {
		return useConfiguration ? (
			<>
				<ThemeSelector>{content}</ThemeSelector>
				{content && (
					<ShowcaseExampleToolbar
						code={code}
						label={label}
						toggleBetweenPartialAndFullCode={toggleBetweenPartialAndFullCode}
					/>
				)}
			</>
		) : (
			<ShowcaseExampleContent
				content={content}
				label={reportLabel}
				code={code}
				useDarkBackground={useDarkBackground}
				fitToSection={fitToSection}
				fullSize={fullSize}
				toggleBetweenPartialAndFullCode={toggleBetweenPartialAndFullCode}
			/>
		);
	}, [
		code,
		content,
		fitToSection,
		fullSize,
		label,
		reportLabel,
		toggleBetweenPartialAndFullCode,
		useConfiguration,
		useDarkBackground
	]);

	return (
		<ShowcaseExampleContextProvider
			value={{
				generatedCodeSnippet,
				setGeneratedCodeSnippet,
				shouldContentWrapperFocusable,
				setShouldContentWrapperFocusable,
				contentWrapperRef
			}}
		>
			{label && (
				<ShowcaseTypographyHeadline
					sectionPath={{ url: sectionUrl, subSection: getHashId(props.label ?? "") }}
					level={2}
				>
					{label}
				</ShowcaseTypographyHeadline>
			)}
			<ShowcaseDescription description={description} featuredWidgets={featuredWidgets} />
			{renderedContent}
		</ShowcaseExampleContextProvider>
	);
}
