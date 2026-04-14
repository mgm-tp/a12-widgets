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
import { useState, useCallback } from "react";
import { styled, css } from "styled-components";

import { Button, ProgressBar } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const ShowcaseWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

const ShowcaseProgressBarWrapper = styled.div<{ $hasBackground?: boolean }>(({ theme, $hasBackground }) => {
	const { colors, spacing } = theme;

	return css`
		${$hasBackground
			? css`
					background-color: ${colors.interaction.secondaryInteractionColor};
					outline: 2px solid transparent;
				`
			: css`
					outline: 2px dotted ${colors.interaction.secondaryInteractionColor};
				`}
		box-sizing: border-box;
		border-radius: ${2 * spacing.spacing.spacingXs}px;
		height: ${spacing.spacing.spacingLg}px;
		position: relative;
		width: 100%;
	`;
});

export function ProgressBarShowcase(): ReactElement {
	const [progressBar, setProgressBar] = useState(false);
	const [percentage, setPercentage] = useState(0);
	const handleClicked = useCallback((): void => {
		setProgressBar(true);
		const interval = setInterval(
			() =>
				setPercentage((oldValue) => {
					const newValue = oldValue + 10;

					if (newValue === 100) {
						setProgressBar(false);
						setPercentage(0);
						clearInterval(interval);
					}

					return newValue;
				}),
			500
		);
	}, []);

	return (
		// ConfigurationView is just a showcase utility. You can safely delete it.
		<ConfigurationView
			configuration={
				<div>
					<Button
						id="trigger-progress-bar-button"
						secondary
						className="-u-margin-b-xs"
						disabled={progressBar}
						onClick={handleClicked}
					>
						Show Progress Bar
					</Button>
				</div>
			}
		>
			<ShowcaseWrapper>
				<div>
					<p>With Background:</p>
					<ShowcaseProgressBarWrapper $hasBackground>
						{progressBar && <ProgressBar percentage={percentage} />}
					</ShowcaseProgressBarWrapper>
				</div>
				<div>
					<p>No Background:</p>
					<ShowcaseProgressBarWrapper>
						{progressBar && <ProgressBar percentage={percentage} />}
					</ShowcaseProgressBarWrapper>
				</div>
			</ShowcaseWrapper>
		</ConfigurationView>
	);
}
