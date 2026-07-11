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

import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import {
	ActionContentbox,
	NavigationContentboxContext
} from "../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../contentbox/main/template/contentbox.tpl.view.js";
import { CssEllipsis } from "../../css-ellipsis/main/css-ellipsis.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { StyledMobileValidationBar } from "./validation-bar.styled.js";
import type { MobileValidationProps } from "./validation-bar.mobile.api.js";
import { renderValidationIcon } from "./validation-bar.view.js";
import { ValidationBarContext } from "./validation-bar.context.js";

const baseClassName = addPrefix("mobile-validation");

const {
	StyledMobileValidationActionItem,
	StyledMobileValidationWrapper,
	StyledMobileValidationActions,
	StyledMobileValidationContent,
	StyledMobileValidationGraphic,
	StyledMobileValidationGraphicContent,
	StyledMobileValidationGraphicIcon,
	StyledMobileValidationOverview,
	StyledMobileValidationOverviewLeft,
	StyledMobileValidationOverviewRight,
	StyledPreviewList,
	StyledPreviewListItem
} = StyledMobileValidationBar;

export function MobileValidation(props: MobileValidationProps): ReactElement<MobileValidationProps> {
	const {
		className,
		style,
		id,
		children,
		headingTitle,
		headingSuffixes,
		headingPrefixes,
		footer,
		variant = "error",
		onClose
	} = props;

	const classNames = joinClassNames(baseClassName, `${baseClassName}--${variant}`, className);

	return (
		<ValidationBarContext.Provider value={{ variant }}>
			<StyledMobileValidationWrapper
				$variant={variant}
				className={classNames}
				style={style}
				id={id}
				ref={props.wrapperRef}
				tabIndex={-1}
				role="dialog"
				data-role={DataRoles.MobileValidation}
			>
				<NavigationContentboxContext.Provider value={{ onCloseButtonClicked: onClose }}>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title text={headingTitle} role={false} />} //eslint-disable-line jsx-a11y/aria-role
						headingPrefixes={headingPrefixes}
						headingButtons={headingSuffixes}
						footer={footer}
						padding={false}
						listenToNavigationContext={!!onClose}
					>
						{children}
					</ActionContentbox>
				</NavigationContentboxContext.Provider>
			</StyledMobileValidationWrapper>
		</ValidationBarContext.Provider>
	);
}

MobileValidation.displayName = "MobileValidation";

export namespace MobileValidation {
	export function Overview(
		props: MobileValidationProps.OverviewProps
	): ReactElement<MobileValidationProps.OverviewProps> {
		const baseOverviewClassName = `${baseClassName}-overview`;
		const { variant = "error", className, style, id, leftElement, rightElement, onClick, onKeyDown } = props;
		const classNames = joinClassNames(baseOverviewClassName, `${baseOverviewClassName}--${variant}`, className);
		const a11yTitles = useContext<A11yDefinition>(A11YLanguageContext).validationBarTitles;

		return (
			<ValidationBarContext.Provider value={{ variant }}>
				<StyledMobileValidationOverview
					$variant={variant}
					className={classNames}
					style={style}
					id={id}
					data-role={DataRoles.MobileValidation.Overview}
					onClick={onClick}
					onKeyDown={onKeyDown}
					aria-label={a11yTitles?.sectionAriaLabel}
				>
					{leftElement && (
						<StyledMobileValidationOverviewLeft
							className={`${baseOverviewClassName}__left`}
							data-role={DataRoles.MobileValidation.Overview.Left}
						>
							{leftElement}
						</StyledMobileValidationOverviewLeft>
					)}
					{rightElement && (
						<StyledMobileValidationOverviewRight
							className={`${baseOverviewClassName}__right`}
							data-role={DataRoles.MobileValidation.Overview.Right}
						>
							{rightElement}
						</StyledMobileValidationOverviewRight>
					)}
				</StyledMobileValidationOverview>
			</ValidationBarContext.Provider>
		);
	}

	export function Graphic(props: MobileValidationProps.GraphicProps): ReactElement<MobileValidationProps.GraphicProps> {
		const baseOverviewClassName = `${baseClassName}-overview`;
		const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
		const validationBarContext = useContext(ValidationBarContext);

		const { variant = "error", icon, className, style, id, children, a11yTitleSupport = false } = props;

		const baseGraphicClassName = `${baseOverviewClassName}__graphic`;
		const classNames = joinClassNames(baseGraphicClassName, className);
		const a11yTitles = languageContext.validationBarTitles;
		let textTitle;

		switch (variant) {
			case "warning":
				textTitle = a11yTitles?.warningOverviewText;
				break;
			case "info":
				textTitle = a11yTitles?.infoOverviewText;
				break;
			default:
				textTitle = a11yTitles?.errorOverviewText;
		}

		return (
			<StyledMobileValidationGraphic
				className={classNames}
				style={style}
				id={id}
				data-role={DataRoles.MobileValidation.Graphic}
			>
				<StyledMobileValidationGraphicIcon
					className={`${baseOverviewClassName}__icon`}
					data-role={DataRoles.MobileValidation.Graphic.Icon}
				>
					{icon ? icon : renderValidationIcon(variant, validationBarContext.variant)}
				</StyledMobileValidationGraphicIcon>
				{children && (
					<StyledMobileValidationGraphicContent
						className={`${baseOverviewClassName}__text`}
						data-role={DataRoles.MobileValidation.Graphic.Content}
					>
						{children}
						{a11yTitleSupport && textTitle && <HiddenText>{textTitle}</HiddenText>}
					</StyledMobileValidationGraphicContent>
				)}
			</StyledMobileValidationGraphic>
		);
	}

	export function PreviewList(
		props: MobileValidationProps.PreviewListProps
	): ReactElement<MobileValidationProps.PreviewListProps> {
		const { children, className, id, style } = props;
		const classNames = joinClassNames(`${baseClassName}-preview-list`, className);

		return (
			<StyledPreviewList
				divider
				className={classNames}
				id={id}
				style={style}
				dataRole={DataRoles.MobileValidation.PreviewList}
			>
				{children}
			</StyledPreviewList>
		);
	}

	export function PreviewListItem(
		props: MobileValidationProps.PreviewListItemProps
	): ReactElement<MobileValidationProps.PreviewListItemProps> {
		const { icon, meta, variant = "error", text, maxLineOfText = 3, onClick, className, id, style } = props;
		const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
		const a11yTitles = languageContext.validationBarTitles;
		let variantTitle;

		switch (variant) {
			case "warning":
				variantTitle = a11yTitles?.errorElement;
				break;
			case "info":
				variantTitle = a11yTitles?.infoElement;
				break;
			default:
				variantTitle = a11yTitles?.errorElement;
		}

		const itemClassNames = joinClassNames(
			`${baseClassName}-preview-list-item`,
			`${baseClassName}-preview-list-item--${variant}`,
			className
		);

		return (
			<StyledPreviewListItem
				id={id}
				style={style}
				className={itemClassNames}
				graphic={icon ? icon : renderValidationIcon(variant)}
				text={
					<>
						{variantTitle && <HiddenText>{variantTitle}</HiddenText>}
						<CssEllipsis maxLine={maxLineOfText}>{text}</CssEllipsis>
					</>
				}
				meta={meta ? meta : <Icon>navigate_next</Icon>}
				dataRole={DataRoles.MobileValidation.PreviewItem}
				onClick={onClick}
			/>
		);
	}

	export function Content(props: MobileValidationProps.ContentProps): ReactElement<MobileValidationProps.ContentProps> {
		const { className, style, id, children } = props;
		const classNames = joinClassNames(`${baseClassName}-content`, className);

		return (
			<StyledMobileValidationContent
				className={classNames}
				style={style}
				id={id}
				data-role={DataRoles.MobileValidation.Content}
			>
				{children}
			</StyledMobileValidationContent>
		);
	}

	export function Actions(props: MobileValidationProps.ActionsProps): ReactElement<MobileValidationProps.ActionsProps> {
		const { className, style, id, children } = props;
		const classNames = joinClassNames(`${baseClassName}-actions`, className);

		return (
			<ContentBoxElements.Footer>
				<StyledMobileValidationActions
					className={classNames}
					style={style}
					id={id}
					data-role={DataRoles.MobileValidation.Actions}
				>
					{children}
				</StyledMobileValidationActions>
			</ContentBoxElements.Footer>
		);
	}

	export function ActionsItem(
		props: MobileValidationProps.ActionsItemProps
	): ReactElement<MobileValidationProps.ActionsItemProps> {
		const { className, style, id, children } = props;
		const classNames = joinClassNames(`${baseClassName}-actions__item`, className);

		return (
			<StyledMobileValidationActionItem
				className={classNames}
				style={style}
				id={id}
				data-role={DataRoles.MobileValidation.Actions.Item}
			>
				{children}
			</StyledMobileValidationActionItem>
		);
	}
}
