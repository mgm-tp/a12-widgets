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
import { useState } from "react";
import { styled, css, ThemeProvider } from "styled-components";

import type { Container } from "@com.mgmtp.a12.widgets/widgets-core";
import { StyledFieldLabel, Button, Icon, ModalOverlay, ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core";

import { ShowcaseExampleContent } from "./showcase-example-content.js";
import type { Section } from "./definitions.js";
import { showcaseTheme } from "./showcase-theme.js";

export interface ConfigurationViewProps extends Container, Omit<Section, "useConfiguration"> {
	configuration: ReactNode;
	reportLabel?: string;
	enableFullscreen?: boolean;
}

const StyledConfigurationWrapper = styled.div<{ $fullscreen: boolean }>(({ theme, $fullscreen }) => {
	const { spacing, colors } = theme;

	return css`
		align-items: center;
		background: ${colors.background.tertiaryBackground};
		display: flex;
		flex-direction: column;
		justify-content: left;
		padding: ${spacing.spacing.spacingMd}px;
		position: relative;

		${StyledFieldLabel} {
			font-family: "Roboto", sans-serif;
			font-weight: 500;
			font-size: 14px;
		}

		code {
			background: ${colors.background.primaryBackground};
		}

		${!$fullscreen &&
		css`
			border-top-left-radius: 4px;
			border-top-right-radius: 4px;
		`}
	`;
});

const FullScreenButton = styled(Button)`
	align-self: flex-end;
`;

export function ConfigurationView(props: ConfigurationViewProps): ReactElement<ConfigurationViewProps> {
	const [fullscreen, setFullscreen] = useState(false);
	const content = (
		<ThemeProvider theme={showcaseTheme}>
			<StyledConfigurationWrapper $fullscreen={fullscreen}>
				{props.enableFullscreen && !fullscreen && (
					<FullScreenButton
						secondary
						icon={<Icon>fullscreen</Icon>}
						onClick={() => setFullscreen(true)}
						title="Fullscreen"
					/>
				)}
				{props.configuration}
			</StyledConfigurationWrapper>
			<ShowcaseExampleContent
				content={props.children}
				isInConfigurationMode
				label={props.reportLabel}
				fitToSection={props.fitToSection}
				useDarkBackground={props.useDarkBackground}
			/>
		</ThemeProvider>
	);

	return (
		<div>
			{props.enableFullscreen && fullscreen ? (
				<ModalOverlay fullscreen closeOnEsc onClose={() => setFullscreen(false)}>
					<ActionContentbox
						padding={0}
						headingElements={null}
						headingButtons={
							<Button
								secondary
								title="Exit fullscreen"
								icon={<Icon>close_fullscreen</Icon>}
								onClick={() => setFullscreen(false)}
							/>
						}
					>
						{content}
					</ActionContentbox>
				</ModalOverlay>
			) : (
				content
			)}
		</div>
	);
}
