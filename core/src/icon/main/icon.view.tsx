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
import { useContext } from "react";
import { styled, css } from "styled-components";

import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { StyledBreadcrumbSeparator } from "../../breadcrumb/main/breadcrumb.styled.js";
import { StyledTooltipTriggerWrapper } from "../../tooltip/main/tooltip.styled.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { CUSTOM_ICONS } from "./custom-icons-data.js";
import type { IconProps } from "./icon.api.js";
import { IconMappingContext, getMappedIconDefinition } from "./icon-mapping-context.js";

export const StyledIconWrapper = styled.i.withConfig({
	displayName: "StyledIconWrapper-sc-"
})<IconProps>(({ theme, iconTheme }) => {
	const { icon, breadcrumb } = theme.components;
	let fontFamily;
	let fontVariationSettings;

	switch (iconTheme) {
		case "custom":
			fontFamily = "custom-icons";
			fontVariationSettings = "normal";
			break;
		case "outlined":
			fontFamily = "Material Symbols Outlined";
			fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
			break;
		case "rounded":
			fontFamily = "Material Symbols Rounded";
			fontVariationSettings = "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24";
			break;
		default:
			fontFamily = "Material Symbols Outlined";
			fontVariationSettings = "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24";
	}

	return css`
		box-sizing: border-box;
		color: ${icon.color};
		display: inline-block;
		direction: ltr;
		font-family: ${fontFamily};
		font-variation-settings: ${fontVariationSettings};
		font-size: ${icon.fontSize};
		font-style: normal;
		font-weight: ${theme.typography.fontWeight.regularFontWeight};
		letter-spacing: normal;
		line-height: 1;
		text-transform: none;
		white-space: nowrap;
		word-wrap: normal;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
		-moz-osx-font-smoothing: grayscale;
		font-feature-settings: "liga";

		> span {
			display: inline-block;
		}

		&& {
			max-width: unset;
		}

		${StyledTooltipTriggerWrapper} & {
			color: inherit;
		}

		${StyledBreadcrumbSeparator} & {
			font-size: ${breadcrumb.separator.iconFontSize};
			line-height: ${breadcrumb.separator.lineHeight};
			margin: ${breadcrumb.separator.margin};
			vertical-align: middle;
		}
	`;
});

export const StyledBigIconWrapper = styled(StyledIconWrapper).withConfig({ displayName: "StyledBigIconWrapper-sc-" })(
	({ theme, size }) => {
		return (
			size === "big" &&
			css`
				&&&,
				${StyledTooltipTriggerWrapper} &&& {
					font-size: ${theme.typography.fontSize.hugeFontSize};
				}
			`
		);
	}
);

export const StyledVariantIconWrapper = styled(StyledBigIconWrapper).withConfig({
	displayName: "StyledVariantIconWrapper-sc-"
})(({ theme, variant }) => {
	const { icon } = theme.components;
	let color: string;

	switch (variant) {
		case "info":
			color = icon.variant.info;
			break;
		case "success":
			color = icon.variant.success;
			break;
		case "warning":
			color = icon.variant.warning;
			break;
		case "error":
			color = icon.variant.error;
			break;
		default:
			color = icon.color;
	}

	return css`
		&& {
			color: ${color};
		}
	`;
});

/**
 * Icon for text fields using Google Material Symbols.
 * You can define a title for tooltips.
 *
 * @see {@link https://fonts.google.com/icons}
 */
export function Icon(props: IconProps): ReactElement<IconProps> {
	const {
		size,
		variant,
		iconTheme,
		className,
		children,
		iconRef,
		showTitleAsTooltip,
		title,
		hiddenText,
		dataRole,
		onClick,
		htmlAttributes
	} = props;

	const baseClassName = addPrefix("plasma-icon");
	const iconClasses = joinClassNames(
		baseClassName,
		{ [`${baseClassName}--big`]: size === "big" },
		{ [`${baseClassName}--${variant}`]: variant },
		{ [`${baseClassName}--${iconTheme}`]: iconTheme },
		className
	);
	const mappingContext = useContext(IconMappingContext);
	const mappedIconDef = getMappedIconDefinition(mappingContext, {
		originalIcon: children as string,
		theme: iconTheme
	});
	const iconLabel = mappedIconDef?.mappedIcon || (typeof children === "string" ? children : undefined);

	const codePoint = iconLabel && iconTheme === "custom" ? CUSTOM_ICONS[iconLabel] : undefined;
	const hiddenTextContent = hiddenText ?? title;

	const StyledIconRendered = variant ? StyledVariantIconWrapper : StyledBigIconWrapper;

	return (
		<StyledIconRendered
			{...props}
			{...htmlAttributes}
			ref={iconRef}
			className={iconClasses}
			title={showTitleAsTooltip === false ? undefined : title?.trim()}
			data-role={dataRole ?? DataRoles.Icon}
			onClick={onClick}
		>
			<span aria-hidden="true">
				{iconTheme === "custom" && codePoint ? String.fromCodePoint(codePoint) : iconLabel}
			</span>
			{hiddenTextContent && <HiddenText>{hiddenTextContent}</HiddenText>}
		</StyledIconRendered>
	);
}

Icon.displayName = "Icon";
