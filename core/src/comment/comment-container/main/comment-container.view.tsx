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
import { Component, isValidElement } from "react";
import { css, styled } from "styled-components";

import { provider as DeviceDetector } from "../../../common/main/device-detector.js";
import { addPrefix, bindMethods, joinClassNames } from "../../../common/main/utils.js";
import type { Orientation } from "../../../common/main/alignment.js";
import type { CalloutHeaderProps } from "../../../callout/main/template/callout.tpl.api.js";
import { Callout } from "../../../callout/main/callout.view.js";
import { StyledCalloutBody, StyledCalloutFooter } from "../../../callout/main/template/callout.tpl.view.js";
import { StyledCommentListWrapper } from "../../comment.styled.js";

import type { CommentContainerProps } from "./comment-container.api.js";

const baseClassName = addPrefix("comment-container");
export interface CommentContainerState {
	smallViewClassName: string | undefined;
}

const StyledCallout = styled(Callout).withConfig({ displayName: "StyledCallout-sc-" })<{
	$isSmallView: boolean;
	$isPhone: boolean;
}>(
	({
		theme,
		$isSmallView,

		$isPhone
	}) => {
		const { body, header } = theme.components.callout;

		return (
			$isSmallView &&
			css`
				${StyledCommentListWrapper} {
					flex: none;
				}
				${StyledCalloutBody}:not(:empty) {
					min-height: ${body.smallViewMinHeight};
					& + ${StyledCalloutFooter} {
						max-height: calc(100% - ${body.smallViewMinHeight} - ${header.minHeight});
					}
				}

				${$isPhone &&
				css`
					max-height: 100%;
				`}
			`
		);
	}
);

export class CommentContainer extends Component<CommentContainerProps, CommentContainerState> {
	static displayName = "CommentContainer";
	static defaultProps = {
		closeOnClickReferenceElement: true,
		closeOnOutsideClick: DeviceDetector.isDesktop(),
		padding: false,
		isPointerVisible: true
	};

	private commentContainerRef: HTMLElement | null = null;
	private readonly minHeight: number;
	private orientations: Orientation[] = ["bottom-start", "bottom-end", "top-start", "top-end", "left", "right"];

	constructor(props: CommentContainerProps) {
		super(props);

		this.state = {
			smallViewClassName: undefined
		};

		this.minHeight = this.props.minHeight || 300;
		bindMethods(this);
	}

	private getClassNameForSmallComponent(): string | undefined {
		if (this.commentContainerRef) {
			return this.commentContainerRef.clientHeight <= this.minHeight ? `${baseClassName}--smallView` : undefined;
		}

		return undefined;
	}

	private getWrapperRef(ref: HTMLElement | null): void {
		this.commentContainerRef = ref;
	}

	componentDidMount(): void {
		setTimeout(() => {
			const newSmallClass = this.getClassNameForSmallComponent();

			if (newSmallClass) {
				this.setState({ smallViewClassName: newSmallClass });
			}
		});
	}

	componentDidUpdate(_: CommentContainerProps, prevState: CommentContainerState): void {
		const newSmallClass = this.getClassNameForSmallComponent();

		if (newSmallClass !== prevState.smallViewClassName) {
			this.setState({ smallViewClassName: newSmallClass });
		}
	}

	render(): ReactNode {
		const { resizeAndDragOptions, isPointerVisible, header, closeOnOutsideClick, className, ...rest } = this.props;
		const isPhone = DeviceDetector.isPhone();
		const isNotResizeAndDrag = !isPhone && !resizeAndDragOptions;

		const isNotCalloutHeader =
			!header || isValidElement(header) || typeof header === "string" || header instanceof Array;

		return (
			<StyledCallout
				padding
				minHeight={this.minHeight}
				wrapperRef={!isPhone ? this.getWrapperRef : undefined}
				className={isNotResizeAndDrag ? joinClassNames(this.state.smallViewClassName, className) : className}
				closeOnOutsideClick={closeOnOutsideClick}
				resizeAndDragOptions={resizeAndDragOptions}
				header={isNotCalloutHeader ? { title: header } : (header as CalloutHeaderProps)}
				orientationList={this.orientations}
				isPointerVisible={isPointerVisible && !resizeAndDragOptions}
				$isSmallView={isNotResizeAndDrag && !!this.state.smallViewClassName}
				$isPhone={isPhone}
				{...rest}
			/>
		);
	}
}
