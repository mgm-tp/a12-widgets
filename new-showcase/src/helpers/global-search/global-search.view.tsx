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
import { useRef, useContext, useCallback, useEffect } from "react";
import { styled, css } from "styled-components";

import {
	ModalOverlay,
	Button,
	ActionContentbox,
	ContentBoxElements,
	Icon,
	Message,
	TextField,
	ButtonGroup,
	activeAndHover,
	provider as DeviceDetector
} from "@com.mgmtp.a12.widgets/widgets-core";

import { GlobalSearchContext } from "./global-search-context.js";

const isDesktop = DeviceDetector.isDesktop();

const StyledSearchContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const StyledInputShowcase = styled(TextField)(({ theme }) => {
	const { typography } = theme;

	return css`
		[data-role="textline-input-wrapper"] {
			box-shadow: none;
			outline: none;
		}
		[data-role="textline-input"] {
			font-size: ${typography.fontSize.lgFontSize};
		}
	`;
});

const StyledEscHint = styled(Button)(({ theme }) => {
	const { colors, typography, spacing } = theme;

	return css`
		background-color: ${colors.background.primaryBackground};
		border-radius: 4px;
		color: ${colors.interaction.disabled.colorDark};
		font-size: ${typography.fontSize.smallFontSize};
		outline: 1px solid ${colors.divider.color};
		padding: 0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px;
		&& {
			${activeAndHover(css`
				background-color: transparent;
			`)}
			&:focus {
				background-color: transparent;
			}
		}
	`;
});

export function GlobalSearch(): ReactElement {
	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const {
		showModal,
		isOpen,
		closeModal,
		searchText,
		items,
		handleSearchKeyDown,
		handleValueChange,
		initialSearchContent,
		searchContent
	} = useContext(GlobalSearchContext);

	const searchShortcutListenerCallback = useCallback(
		(event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();

				if (!isOpen) {
					showModal();
				}
			}
		},
		[isOpen, showModal]
	);

	useEffect(() => {
		document.addEventListener("keydown", searchShortcutListenerCallback);

		return () => {
			document.removeEventListener("keydown", searchShortcutListenerCallback);
		};
	}, [searchShortcutListenerCallback]);

	const handleSearchInputRef = useCallback((ref: HTMLInputElement | null): void => {
		searchInputRef.current = ref;
	}, []);

	const onModalOpen = useCallback((): void => {
		searchInputRef.current?.focus();
	}, []);

	return (
		<>
			{isOpen && (
				<ModalOverlay
					onClose={closeModal}
					onOpen={onModalOpen}
					closeOnOutsideClick={isDesktop}
					focusOnOpen={false}
					focusBack={false}
				>
					<ActionContentbox
						headingElements={
							<StyledInputShowcase
								id="global-search-input"
								onChange={handleValueChange}
								label="Search"
								hideLabel
								placeholder="Search..."
								addonBefore={<Icon size="big">search</Icon>}
								addonAfter={isDesktop && <StyledEscHint onClick={closeModal}>esc</StyledEscHint>}
								value={searchText}
								inputRef={handleSearchInputRef}
								onKeyDown={handleSearchKeyDown}
								autoComplete="off"
							/>
						}
						footer={
							<ContentBoxElements.Footer>
								<ButtonGroup alignment="right">
									<Button onClick={closeModal}>Close</Button>
								</ButtonGroup>
							</ContentBoxElements.Footer>
						}
						style={{ height: "80vh", maxHeight: 600 }}
						padding="24px"
					>
						{!searchText && initialSearchContent}
						{searchText && <StyledSearchContentWrapper>{searchContent}</StyledSearchContentWrapper>}
						{searchText && items?.length === 0 && (
							<Message className="-u-text-center -u-text-2xl">No results for "{searchText}"</Message>
						)}
					</ActionContentbox>
				</ModalOverlay>
			)}
		</>
	);
}
