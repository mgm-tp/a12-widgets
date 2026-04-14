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

import type { FC, ReactElement } from "react";
import { useState, useMemo, useCallback } from "react";
import { loremIpsum } from "lorem-ipsum";

import type { ValidationBarVariant } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	provider,
	MobileValidation,
	ValidationBar,
	ModalOverlay,
	Button,
	Icon,
	QuickAccessButton
} from "@com.mgmtp.a12.widgets/widgets-core";

const isMobile = provider.isPhone();

function getValidationContent(
	variant: ValidationBarVariant
): Record<"title" | "validationPath" | "description", string> {
	const validationPath = `Path > to > the > cause > of > ${variant}`;
	const title = variant[0].toUpperCase() + variant.slice(1);

	const description = `${title} description: ${loremIpsum({ units: "sentences", count: 7 })}`;

	return { title, validationPath, description };
}

interface VariantBarProps {
	variant: ValidationBarVariant;
}

const VariantBar: FC<VariantBarProps> = ({ variant }) => {
	const [openContent, setOpenContent] = useState(false);
	const [openDetailViewOnPhone, setOpenDetailViewOnPhone] = useState(false);
	const { title, validationPath, description } = useMemo(() => getValidationContent(variant), [variant]);

	const toggleContent = useCallback(() => setOpenContent((openContent) => !openContent), []);
	const handleOpenDetailViewOnPhone = useCallback((): void => setOpenDetailViewOnPhone(true), []);
	const handleCloseDetailViewOnPhone = useCallback((): void => setOpenDetailViewOnPhone(false), []);

	if (isMobile) {
		return (
			<>
				<MobileValidation.Overview
					variant={variant}
					leftElement={
						<MobileValidation.Graphic variant={variant} a11yTitleSupport>
							1
						</MobileValidation.Graphic>
					}
					rightElement={<Icon>fullscreen</Icon>}
					onClick={handleOpenDetailViewOnPhone}
				/>
				{openDetailViewOnPhone && (
					<ModalOverlay fullscreen>
						<MobileValidation
							variant={variant}
							headingTitle={<MobileValidation.Graphic variant={variant}>{title}</MobileValidation.Graphic>}
							onClose={handleCloseDetailViewOnPhone}
						>
							<MobileValidation.Content>
								{description}
								<div>
									<Button>{validationPath}</Button>
								</div>
							</MobileValidation.Content>
						</MobileValidation>
					</ModalOverlay>
				)}
			</>
		);
	}

	return (
		<ValidationBar
			id={`variations-showcase-${variant}`}
			primaryTitle={openContent ? title : description}
			secondaryTitle={!openContent && validationPath}
			variant={variant}
			quickAccessMenu={
				<QuickAccessButton
					primary
					invert
					mainAction={
						<Button
							primary
							invert
							onClick={openContent ? toggleContent : undefined}
							icon={<Icon>{openContent ? "unfold_less" : "location_searching"}</Icon>}
							title={openContent ? "Collapse message" : "Go to issue"}
							buttonAttributes={{ role: "link" }}
						/>
					}
					actionItems={[
						{
							text: "Go to Cause",
							graphic: <Icon>location_searching</Icon>,
							htmlAttributes: { role: "link" }
						},
						{
							text: openContent ? "Collapse Message" : "Expand Message",
							graphic: <Icon>{openContent ? "unfold_less" : "unfold_more"}</Icon>,
							onClick: toggleContent
						}
					]}
				/>
			}
		>
			{openContent && (
				<>
					<p>{description}</p>
					<div>
						<Button buttonAttributes={{ role: "link" }}>{validationPath}</Button>
					</div>
				</>
			)}
		</ValidationBar>
	);
};

export const VariationsShowcase = (): ReactElement => {
	return (
		<div className="-u-width-full">
			<VariantBar variant="info" />
			<br />
			<VariantBar variant="warning" />
			<br />
			<VariantBar variant="error" />
		</div>
	);
};
