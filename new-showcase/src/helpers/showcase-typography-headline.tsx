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
import { useState, useRef, useContext, useCallback } from "react";
import { styled } from "styled-components";

import type { Container, HeadlineProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, Icon, ConnectedToast, Typography, SizeContext } from "@com.mgmtp.a12.widgets/widgets-core";

import { getHashId } from "./utils.js";

const StyledCopyLinkButton = styled(Button)`
	margin: 0px 8px 0px -42px;
`;

export const StyledShowcaseHeaderWrapper = styled.div`
	margin: 0 -32px;
	padding: 0 32px;
	font-family: "Roboto", sans-serif;
`;

interface ShowcaseTypographyHeadlineProps extends Container, Pick<HeadlineProps, "level"> {
	/**
	 * Path of the showcase.
	 */
	path?: string;

	/**
	 * Path of the section (right nav menu item).
	 */
	sectionPath?: {
		url?: string;
		subSection?: string;
	};
}

export function ShowcaseTypographyHeadline(props: ShowcaseTypographyHeadlineProps): ReactElement {
	const [showCopyLinkButton, setShowCopyLinkButton] = useState(false);
	const [showCopyToast, setShowCopyToast] = useState(false);
	const triggerElementRef = useRef<HTMLButtonElement | null>(null);
	const screenSizeContext = useContext(SizeContext);

	const handleTriggerElementRef = useCallback((ref: HTMLButtonElement) => {
		triggerElementRef.current = ref;
	}, []);

	const handleCopyLink = useCallback(() => {
		if (!navigator.clipboard) {
			return;
		}

		const originUrl = window.location.href.split("#")[0];

		if (props.path) {
			navigator.clipboard.writeText(originUrl + "#" + props.path);
		} else if (props.sectionPath && props.sectionPath.subSection) {
			navigator.clipboard.writeText(
				originUrl + "#" + props.sectionPath.url + "#" + getHashId(props.sectionPath.subSection)
			);
		}

		setShowCopyToast(true);
	}, [props.path, props.sectionPath]);

	if (screenSizeContext.currentSize === "sm" || screenSizeContext.currentSize === "xs") {
		return (
			<Typography.Headline ariaLevel={props.level} level={props.level}>
				{props.children}
			</Typography.Headline>
		);
	}

	return (
		<StyledShowcaseHeaderWrapper
			onMouseOver={() => setShowCopyLinkButton(true)}
			onMouseOut={() => setShowCopyLinkButton(false)}
		>
			<Typography.Headline ariaLevel={props.level} level={props.level}>
				<StyledCopyLinkButton
					icon={<Icon size="big">link</Icon>}
					title="Copy the link"
					onClick={handleCopyLink}
					buttonRef={handleTriggerElementRef}
					className={showCopyLinkButton ? undefined : "-u-invisible"}
				/>
				{triggerElementRef.current && showCopyToast && (
					<ConnectedToast
						variant={navigator.clipboard ? "success" : "warning"}
						message={
							navigator.clipboard
								? "The link has been copied."
								: "Sorry, copy only works under HTTPS, please switch protocol to use this function."
						}
						orientation="bottom-start"
						referenceElement={triggerElementRef.current}
						onClose={() => setShowCopyToast(false)}
						duration={2000}
					/>
				)}
				{props.children}
			</Typography.Headline>
		</StyledShowcaseHeaderWrapper>
	);
}
