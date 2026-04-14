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
import { useMemo, useContext, useCallback } from "react";
import { styled, css } from "styled-components";

import { provider, createPseudoElement } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Section } from "./definitions.js";
import { ThemeSelector } from "./theme-selector.js";
import { ShowcaseExampleToolbar } from "./showcase-example-toolbar.js";
import { ShowcaseExampleContext } from "./showcase-example-context.js";

type ShowcaseExampleContentProps = Section & {
	isInConfigurationMode?: boolean;
};

export const StyledShowcaseExampleWrapper = styled.div<{
	$isInConfigurationMode?: boolean;
	$useDarkBackground?: boolean;
	$fullSize?: boolean;
	$isOnMobile?: boolean;
}>(({ theme, $isInConfigurationMode, $useDarkBackground, $fullSize, $isOnMobile }) => {
	const { colors, spacing } = theme;

	return css`
		align-items: center;
		background-color: ${$useDarkBackground ? "#dbdfe8" : colors.background.secondaryBackground};
		border: 1px solid #dbdfe8;
		border-bottom: 0;
		border-radius: 4px 4px 0 0;
		display: flex;
		justify-content: center;
		margin-top: 32px;
		padding: ${$isOnMobile ? spacing.spacing.spacingSm : spacing.spacing.spacingXl}px;
		position: relative;
		${createPseudoElement(":before")}

		&:focus:before {
			outline: 2px solid ${colors.interaction.focus.color};
		}

		& > * {
			position: relative;
		}

		${$isInConfigurationMode &&
		css`
			border-radius: unset;
		`}
		${$fullSize &&
		css`
			display: block;
			padding: 0;
		`}
	`;
});

const StyledShowcaseExampleContentWrapper = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;

const StyledContentFitToParent = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 70vh;
	width: 100%;
	overflow: auto;
`;

export function ShowcaseExampleContent(
	props: ShowcaseExampleContentProps
): ReactElement<ShowcaseExampleContentProps> | null {
	const {
		content,
		label,
		code,
		isInConfigurationMode,
		fitToSection,
		fullSize,
		useDarkBackground,
		toggleBetweenPartialAndFullCode
	} = props;
	const isOnMobile = useMemo(() => {
		return provider.isPhone();
	}, []);
	const { setShouldContentWrapperFocusable, shouldContentWrapperFocusable, contentWrapperRef } =
		useContext(ShowcaseExampleContext);

	const handleContentWrapperRef = useCallback(
		(ref: HTMLDivElement | null) => {
			if (contentWrapperRef) {
				contentWrapperRef.current = ref;
			}
		},
		[contentWrapperRef]
	);

	const handleContentWrapperBlur = useCallback(
		() => setShouldContentWrapperFocusable?.(false),
		[setShouldContentWrapperFocusable]
	);

	return content ? (
		<>
			<StyledShowcaseExampleWrapper
				data-role="section-content"
				ref={handleContentWrapperRef}
				tabIndex={shouldContentWrapperFocusable ? 0 : undefined}
				onBlur={handleContentWrapperBlur}
				$isInConfigurationMode={isInConfigurationMode}
				$useDarkBackground={useDarkBackground}
				$fullSize={fullSize}
				$isOnMobile={isOnMobile}
			>
				{fitToSection ? (
					<StyledContentFitToParent>
						<ThemeSelector>{content}</ThemeSelector>
					</StyledContentFitToParent>
				) : (
					<ThemeSelector>
						<StyledShowcaseExampleContentWrapper>{content}</StyledShowcaseExampleContentWrapper>
					</ThemeSelector>
				)}
			</StyledShowcaseExampleWrapper>

			{!isInConfigurationMode && (
				<ShowcaseExampleToolbar
					code={code}
					label={label}
					toggleBetweenPartialAndFullCode={toggleBetweenPartialAndFullCode}
				/>
			)}
		</>
	) : null;
}
