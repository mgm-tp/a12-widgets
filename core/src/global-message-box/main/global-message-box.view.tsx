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

import type { ContextType, FC, ReactElement, ReactNode } from "react";
import { PureComponent, useContext, useEffect, useRef } from "react";

import type { GlobalMessageBoxTitles } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { provider as DeviceDetector } from "../../common/main/device-detector.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { bindMethods, joinClassNames, addPrefix } from "../../common/main/utils.js";
import { Icon } from "../../icon/main/icon.view.js";

import type { GlobalMessageBoxVariant, GlobalMessageBoxProps } from "./global-message-box.api.js";
import {
	StyledGlobalMessageBoxWrapper,
	StyledGlobalMessageBoxContent,
	StyledGlobalMessageBoxGraphic,
	StyledGlobalMessageBoxText,
	StyledGlobalMessageBoxActions
} from "./global-message-box.styled.js";

const baseClassName = addPrefix("global-message-box");
const isMobile: boolean = DeviceDetector.isPhone();

const GlobalMessageBoxImpl: FC<GlobalMessageBoxProps> = ({
	variant = "info",
	icon,
	className,
	style,
	id,
	content,
	actions,
	ellipsis = true,
	focusOnMount = true,
	role = "heading",
	ariaLevel
}): ReactElement => {
	const { globalMessageBoxTitles: a11yTitles } = useContext(A11YLanguageContext);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (focusOnMount) {
			wrapperRef.current?.focus();
		}
		// oxlint-disable-next-line react-hooks/exhaustive-deps -- focus only on mount, matching the previous componentDidMount
	}, []);

	const classNames = joinClassNames(
		baseClassName,
		`${baseClassName}--${variant}`,
		{ [`${baseClassName}--mobile`]: DeviceDetector.isPhone() },
		{ [`${baseClassName}--multiline`]: !ellipsis },
		className
	);
	const hiddenText = getHiddenText(a11yTitles, variant);

	return (
		<StyledGlobalMessageBoxWrapper
			variant={variant}
			isMobile={isMobile}
			ellipsis={ellipsis}
			id={id}
			className={classNames}
			style={style}
			ref={wrapperRef}
			tabIndex={-1}
			data-role={DataRoles.GlobalMessageBox}
		>
			<StyledGlobalMessageBoxContent ellipsis={ellipsis} className={`${baseClassName}__content`}>
				<StyledGlobalMessageBoxGraphic
					className={`${baseClassName}__graphic`}
					data-role={DataRoles.GlobalMessageBox.Graphic}
					$variant={variant}
				>
					{icon || renderIcon(variant)}
				</StyledGlobalMessageBoxGraphic>
				<StyledGlobalMessageBoxText
					className={`${baseClassName}__text`}
					role={role || undefined}
					aria-level={role ? (ariaLevel ?? 2) : undefined}
					data-role={DataRoles.GlobalMessageBox.Text}
					$ellipsis={ellipsis}
					$variant={variant}
				>
					{hiddenText && <HiddenText>{hiddenText}</HiddenText>}
					{content}
				</StyledGlobalMessageBoxText>
			</StyledGlobalMessageBoxContent>
			<StyledGlobalMessageBoxActions
				className={`${baseClassName}__actions`}
				data-role={DataRoles.GlobalMessageBox.Actions}
				$isMobile={isMobile}
				$ellipsis={ellipsis}
				$variant={variant}
			>
				{actions}
			</StyledGlobalMessageBoxActions>
		</StyledGlobalMessageBoxWrapper>
	);
};

GlobalMessageBoxImpl.displayName = "GlobalMessageBoxImpl";

/**
 * Displays a page-level message with a variant icon, a text and optional actions.
 *
 * @remarks
 * The implementation is a function component built on hooks. `GlobalMessageBox` itself stays a thin `PureComponent`
 * shell that renders it, so consumers that hold a `ref` to the component instance, annotate `typeof GlobalMessageBox`
 * as a class, subclass it or read `GlobalMessageBox.defaultProps` keep compiling and working, and re-rendering is still
 * skipped for shallow-equal props. New code should not rely on any of these.
 */
export class GlobalMessageBox extends PureComponent<GlobalMessageBoxProps> {
	static displayName = "GlobalMessageBox";
	static contextType = A11YLanguageContext;
	declare context: ContextType<typeof A11YLanguageContext>;
	static defaultProps = {
		ellipsis: true,
		focusOnMount: true,
		role: "heading"
	};

	constructor(props: GlobalMessageBoxProps) {
		super(props);
		// Subclasses relied on the base constructor to bind their own methods to the instance.
		bindMethods(this);
	}

	/**
	 * @deprecated Focus handling moved into the function implementation; this is only a no-op so that subclasses
	 * calling `super.componentDidMount()` keep working. Do not call it from new code.
	 */
	componentDidMount(): void {
		// Intentionally empty, see the deprecation note above.
	}

	render(): ReactNode {
		return <GlobalMessageBoxImpl {...this.props} />;
	}
}

function getHiddenText(a11yTitles?: GlobalMessageBoxTitles, variant?: GlobalMessageBoxVariant): string | undefined {
	switch (variant) {
		case "info":
			return a11yTitles?.infoElement;
		case "success":
			return a11yTitles?.successElement;
		case "warning":
			return a11yTitles?.warningElement;
		default:
			return a11yTitles?.errorElement;
	}
}

function renderIcon(variant?: GlobalMessageBoxVariant): ReactNode {
	switch (variant) {
		case "success":
			return <Icon>check_circle</Icon>;
		case "warning":
			return <Icon iconTheme="outlined">warning_amber</Icon>;
		case "error":
			return <Icon iconTheme="custom">error</Icon>;
		default:
			return <Icon>info</Icon>;
	}
}
