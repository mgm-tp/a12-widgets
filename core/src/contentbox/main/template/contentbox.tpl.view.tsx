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

import type { ReactNode } from "react";
import { Component } from "react";
import { styled, css } from "styled-components";

import { addPrefix, bindMethods, joinClassNames, Throttler } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { StyledContentBoxContext } from "./contentbox.context.js";
import { StyledContentBoxHeader, StyledContentBox, StyledContentBoxContent } from "./contentbox.tpl.styled.js";
import type { ContentBoxProps } from "./contentbox.tpl.api.js";
import { HeadingAddonTpl, HeadingTpl } from "./elements/heading.tpl.view.js";
import { TitleTpl } from "./elements/title.tpl.view.js";
import { SubHeadingElements } from "./elements/sub-heading.tpl.view.js";
import { FooterTpl } from "./elements/footer.tpl.view.js";
import {
	BackButtonTpl,
	CloseButtonTpl,
	ActionButtonTpl,
	HeadingActionButtonTpl
} from "./elements/button-action.tpl.view.js";
import { NotificationAreaTpl } from "./elements/notification-area.tpl.view.js";
import { SubtitleTpl } from "./elements/subtitle.tpl.view.js";

const baseClassName = addPrefix("contentbox");

export namespace ContentBoxElements {
	export const Heading = HeadingTpl;

	export const HeadingAddon = HeadingAddonTpl;

	export const NotificationArea = NotificationAreaTpl;

	export const Title = TitleTpl;
	export const Subtitle = SubtitleTpl;
	export const SubHeading = SubHeadingElements.SubHeading;
	export const ActionBar = SubHeadingElements.ActionBar;
	export const SubActionBar = SubHeadingElements.SubActionBar;
	export const ActionBarGroupArea = SubHeadingElements.ActionBarGroupArea;
	export const ActionBarGroup = SubHeadingElements.ActionBarGroup;
	export const ActionBarGroupDivider = SubHeadingElements.ActionBarGroupDivider;
	export const Footer = FooterTpl;
	export const BackButton = BackButtonTpl;
	export const CloseButton = CloseButtonTpl;
	export const ActionButton = ActionButtonTpl;
	export const HeadingActionButton = HeadingActionButtonTpl;
}

const StyledContentBoxWizardBar = styled.div<{ collapsed?: boolean }>(({ theme, collapsed }) => {
	const { contentBox } = theme.components;

	return css`
		display: flex;
		flex-direction: column;
		overflow: hidden;
		max-height: 200px;
		transition: max-height 0.6s ease-in-out;
		border-bottom: ${contentBox.wizardBar.borderBottom};
		${collapsed &&
		css`
			max-height: 0;
			transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
		`}
	`;
});

export class ContentBox extends Component<ContentBoxProps, { isWizardCollapsed: boolean }> {
	static displayName = "ContentBox";
	private wizardRef: HTMLDivElement | null = null;
	private contentBoxContentRef: HTMLDivElement | null = null;
	private lastScrollPosition: number | null = null;
	private originalWizardHeight = 0;
	private readonly wizardBorderWidth = 1;

	static defaultProps = {
		padding: true
	};

	constructor(props: ContentBoxProps) {
		super(props);
		this.state = {
			isWizardCollapsed: false
		};

		bindMethods(this);
	}

	private handleWizardRef(ref: HTMLDivElement | null): void {
		this.wizardRef = ref;

		if (ref) {
			this.originalWizardHeight = ref.offsetHeight;
		}
	}

	private handleContentBoxContentRef(ref: HTMLDivElement | null): void {
		this.contentBoxContentRef = ref;

		if (this.props.contentRef) {
			this.props.contentRef(ref);
		}
	}

	private scrollHandler: EventListener = Throttler.create(() => {
		if (this.wizardRef && this.contentBoxContentRef && this.lastScrollPosition !== null) {
			const currentScrollPosition = this.contentBoxContentRef.scrollTop;
			const wizardHeight = this.originalWizardHeight;

			const isAtTop = currentScrollPosition <= 0;
			const isAtBottom =
				currentScrollPosition + this.contentBoxContentRef.offsetHeight + this.wizardBorderWidth >=
				this.contentBoxContentRef.scrollHeight;

			if (isAtTop || isAtBottom) {
				this.lastScrollPosition = this.contentBoxContentRef.scrollTop;

				return;
			}

			if (currentScrollPosition !== this.lastScrollPosition) {
				const diff = currentScrollPosition - this.lastScrollPosition;
				const wizardScrollHeight = parseInt(getComputedStyle(this.wizardRef).height || "0", 10);

				if (currentScrollPosition > wizardHeight) {
					if (diff > 0 && !this.state.isWizardCollapsed && this.wizardRef.offsetHeight === this.originalWizardHeight) {
						this.collapseWizard();
					} else if (diff < 0 && this.state.isWizardCollapsed && wizardScrollHeight <= this.wizardBorderWidth) {
						this.expandWizard();
					}
				}
			}

			this.lastScrollPosition = this.contentBoxContentRef.scrollTop;
		}
	});

	private collapseWizard(): void {
		this.setState({ isWizardCollapsed: true });
	}

	private expandWizard(): void {
		this.setState({ isWizardCollapsed: false });
	}

	private handleLoaded(): void {
		if (this.wizardRef) {
			this.originalWizardHeight = this.wizardRef.offsetHeight;
		}
	}

	private shouldContentFocusable(): boolean {
		return (
			this.props.tabIndex === undefined &&
			!!this.contentBoxContentRef &&
			this.contentBoxContentRef.scrollHeight - this.contentBoxContentRef.clientHeight > 0
		);
	}

	componentDidMount(): void {
		if (this.props.hideWizardBarOnScroll && this.contentBoxContentRef) {
			this.contentBoxContentRef.addEventListener("scroll", this.scrollHandler, true);
			this.lastScrollPosition = this.contentBoxContentRef.scrollTop;
		}

		if (this.contentBoxContentRef && this.shouldContentFocusable()) {
			this.contentBoxContentRef.tabIndex = 0;
		}

		window.addEventListener("load", this.handleLoaded);
	}

	componentWillUnmount(): void {
		window.removeEventListener("load", this.handleLoaded);

		if (this.props.hideWizardBarOnScroll && this.contentBoxContentRef) {
			this.contentBoxContentRef.removeEventListener("scroll", this.scrollHandler);
		}
	}

	render(): ReactNode {
		const {
			id,
			children,
			className,
			tile,
			padding,
			style,
			heading,
			notificationArea,
			subHeading,
			wizardBar,
			footer,
			embedded,
			wrapperRef,
			tabIndex,
			onKeyDown,
			onFocus,
			onBlur,
			role,
			ariaLabel,
			boxShadow = "default"
		} = this.props;

		const contentBoxClassName = joinClassNames(
			baseClassName,
			{ [`${baseClassName}--tile`]: tile },
			{ [`${baseClassName}--embedded`]: embedded },
			className
		);

		const contentBoxContentClassName = joinClassNames(`${baseClassName}__content`, {
			[`${baseClassName}__content--initial-padding`]: padding === true
		});

		return (
			<StyledContentBoxContext.Provider value={{ embedded }}>
				<StyledContentBox
					ref={wrapperRef}
					onKeyDown={onKeyDown}
					onFocus={onFocus}
					onBlur={onBlur}
					id={id}
					className={contentBoxClassName}
					style={style}
					tabIndex={-1}
					data-role={DataRoles.Contentbox}
					role={role}
					aria-label={ariaLabel}
					$boxShadow={boxShadow}
				>
					{(heading || wizardBar || notificationArea || subHeading) && (
						<StyledContentBoxHeader className={`${baseClassName}__header`} data-role={DataRoles.Contentbox.Header}>
							{heading}
							{wizardBar && (
								<StyledContentBoxWizardBar
									className={joinClassNames(`${baseClassName}__wizard-bar`, {
										[`${baseClassName}__wizard-bar--collapsed`]: this.state.isWizardCollapsed
									})}
									ref={this.handleWizardRef}
									data-role={DataRoles.Contentbox.WizardBar}
									collapsed={this.state.isWizardCollapsed}
								>
									{wizardBar}
								</StyledContentBoxWizardBar>
							)}
							{notificationArea}
							{subHeading}
						</StyledContentBoxHeader>
					)}
					<StyledContentBoxContent
						className={contentBoxContentClassName}
						style={typeof padding !== "boolean" ? { padding } : {}}
						ref={this.handleContentBoxContentRef}
						data-role={DataRoles.Contentbox.Content}
						tabIndex={tabIndex}
						padding={padding}
						$nonFooter={!footer}
					>
						{children}
					</StyledContentBoxContent>
					{footer}
				</StyledContentBox>
			</StyledContentBoxContext.Provider>
		);
	}
}
