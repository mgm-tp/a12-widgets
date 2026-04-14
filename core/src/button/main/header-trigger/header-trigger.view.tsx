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

import type { FC } from "react";
import { useContext, useRef, useCallback } from "react";

import { joinClassNames, addPrefix } from "../../../common/main/utils.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { useInteractionHint } from "../../../interaction-hint/main/use-interaction-hint.js";
import { DataRoles } from "../../../common/index.js";

import type { HeaderTriggerProps } from "./header-trigger.api.js";
import {
	StyledHeaderTriggerContainer,
	StyledHeaderTriggerGraphicIcon,
	StyledHeaderTriggerMetaIcon,
	StyledHeaderTriggerText,
	StyledHeaderTriggerTextAbbreviation
} from "./header-trigger.styled.js";

const baseClassName = addPrefix("header-trigger");

export const HeaderTrigger: FC<HeaderTriggerProps> = (props) => {
	const a11yContext = useContext(A11YLanguageContext);
	const {
		buttonRef,
		className,
		children,
		text,
		textTitle,
		graphic,
		meta,
		active,
		dataRole,
		disabled,
		multilingual,
		vertical,
		light,
		hideHiddenText,
		...rest
	} = props;

	const a11yTitles = a11yContext.headerTriggerTitles;
	const { "aria-expanded": isExpanded, title } = rest as { "aria-expanded": boolean; title: string };
	const headerTriggerTitle =
		`${textTitle || ""} ${title ?? (isExpanded ? a11yTitles?.buttonTriggerClose : (a11yTitles?.buttonTrigger ?? a11yTitles?.buttonTriggerOpen))}`.trim();

	const buttonElementRef = useRef<HTMLButtonElement | null>(null);
	const { title: resolvedTitle, hintRenderer } = useInteractionHint({
		title: headerTriggerTitle,
		componentKey: "button",
		referenceElementRef: buttonElementRef
	});

	const getButtonRef = useCallback(
		(ref: HTMLButtonElement) => {
			buttonRef?.(ref);
			buttonElementRef.current = ref;
		},
		[buttonRef]
	);

	return (
		<StyledHeaderTriggerContainer
			{...rest}
			ref={getButtonRef}
			type="button"
			className={joinClassNames(baseClassName, { [`${baseClassName}--activated`]: active }, className)}
			title={resolvedTitle}
			aria-label={text ? undefined : headerTriggerTitle}
			data-role={dataRole ?? DataRoles.HeaderTrigger}
			disabled={disabled}
			$activated={active}
			$disabled={disabled}
			$multilingual={multilingual}
			$vertical={vertical}
			$light={light}
			$onlyMetaIcon={!!meta && !text}
			$onlyGraphicIcon={!!graphic && !text}
		>
			{children ? (
				<>{children}</>
			) : (
				<>
					{graphic && (
						<StyledHeaderTriggerGraphicIcon
							key="graphic"
							className={`${baseClassName}__graphic`}
							dataRole={DataRoles.HeaderTrigger.Graphic}
							$multilingual={multilingual}
							$vertical={vertical}
						>
							{graphic}
						</StyledHeaderTriggerGraphicIcon>
					)}
					{text && (
						<StyledHeaderTriggerText
							key="text"
							className={`${baseClassName}__text`}
							data-role={DataRoles.HeaderTrigger.Text}
						>
							{!hideHiddenText && a11yTitles?.headerTriggerText && (
								<HiddenText>{a11yTitles?.headerTriggerText}</HiddenText>
							)}
							<StyledHeaderTriggerTextAbbreviation $vertical={vertical && multilingual}>
								{text}
							</StyledHeaderTriggerTextAbbreviation>
							{!hideHiddenText && !!hintRenderer && <HiddenText>{headerTriggerTitle}</HiddenText>}
						</StyledHeaderTriggerText>
					)}
					{meta && (
						<StyledHeaderTriggerMetaIcon key="meta" className={`${baseClassName}__meta`}>
							{meta}
						</StyledHeaderTriggerMetaIcon>
					)}
				</>
			)}
			{hintRenderer?.()}
		</StyledHeaderTriggerContainer>
	);
};

HeaderTrigger.displayName = "HeaderTrigger";
