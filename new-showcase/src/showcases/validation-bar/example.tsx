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
import { useState, useRef, useCallback, useMemo } from "react";

import type { CheckboxProps, TextFieldProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	ActionContentbox,
	ContentBoxElements,
	Button,
	ButtonGroup,
	Checkbox as WidgetCheckbox,
	Icon,
	LayoutGrid,
	Link,
	TextField as WidgetsTextField,
	Typography,
	provider,
	ValidationBar,
	QuickAccessButton,
	BulletList
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ValidationBarMobile } from "./mobile.js";
import { useForm } from "./use-form.js";
import type { FieldName, ValidationResult } from "./showcase-validation-bar.api.js";

const { Grid, Row, Column } = LayoutGrid;

const isMobile = provider.isPhone();

interface DesktopValidationBarProps extends ValidationResult {
	goToField(fieldName: FieldName): void;
}

const DesktopValidationBar: FC<DesktopValidationBarProps> = (props) => {
	const { goToField, errors, warnings, issues = [] } = props;

	const [openValidationContent, setOpenValidationContent] = useState(false);

	const actionItemTriggerRef = useRef<HTMLButtonElement | null>(null);
	const validationBarTitleRef = useRef<HTMLElement | null>(null);

	const handleValidationBarTitleRef = useCallback((ref: HTMLElement | null): void => {
		if (ref) {
			ref.onblur = (): void => {
				validationBarTitleRef.current?.removeAttribute("tabindex");
			};

			validationBarTitleRef.current = ref;
		}
	}, []);

	const toggleValidationContent = useCallback((focusTriggerElement = false): void => {
		if (focusTriggerElement) {
			actionItemTriggerRef.current?.focus();
		}

		setOpenValidationContent((openContent) => !openContent);
	}, []);

	const issuedFieldNames = useMemo(() => issues?.map(({ fieldName }) => fieldName), [issues]);

	const goToFirstIssue = useCallback(() => {
		if (issuedFieldNames?.length) {
			goToField(issuedFieldNames[0]);
		}
	}, [goToField, issuedFieldNames]);

	if (!issues.length) {
		return null;
	}

	return (
		<ValidationBar
			titleRef={handleValidationBarTitleRef}
			primaryTitle={errors?.length ? "Error" : warnings?.length ? "Warning" : undefined}
			secondaryTitle={!openValidationContent && <em>{String(issues.length).padStart(2, "0")} issue(s)</em>}
			variant={errors?.length ? "error" : warnings?.length ? "warning" : undefined}
			quickAccessMenu={
				<QuickAccessButton
					primary
					invert
					focusOnTriggerElementAfterClose={false}
					triggerElementButtonRef={(ref) => {
						actionItemTriggerRef.current = ref;
					}}
					mainAction={
						<Button
							primary
							invert
							buttonAttributes={!openValidationContent && issues.length === 1 ? { role: "link" } : undefined}
							onClick={(): void => {
								issues.length !== 1 || openValidationContent ? toggleValidationContent() : goToFirstIssue?.();
							}}
							icon={
								<Icon>
									{openValidationContent ? "unfold_less" : issues.length === 1 ? "location_searching" : "unfold_more"}
								</Icon>
							}
							title={
								!openValidationContent && issues.length === 1
									? "Go to issue"
									: openValidationContent
										? "Collapse Message"
										: "Expand Message"
							}
						/>
					}
					actionItems={[
						{
							text: "Go to first issue",
							graphic: <Icon>location_searching</Icon>,
							disabled: !goToFirstIssue,
							onClick: goToFirstIssue
						},
						{
							text: openValidationContent ? "Collapse Message" : "Expand Message",
							graphic: <Icon>{openValidationContent ? "unfold_less" : "unfold_more"}</Icon>,
							onClick: () => toggleValidationContent(true)
						}
					]}
				/>
			}
		>
			{openValidationContent && (
				<>
					There are <strong>{String(issues.length).padStart(2, "0")}</strong> issue(s) in the following field(s):
					<BulletList.Unordered>
						{issuedFieldNames?.map((fieldName) => (
							<BulletList.Item key={fieldName}>
								<Button label={fieldName} onClick={(): void => goToField(fieldName)} />
							</BulletList.Item>
						))}
					</BulletList.Unordered>
				</>
			)}
		</ValidationBar>
	);
};

const Checkbox: FC<Omit<CheckboxProps, "checked"> & { value: boolean }> = (props) => {
	return <WidgetCheckbox {...props} checked={props.value} />;
};

const TextField: FC<TextFieldProps & { onChange(value: string): void }> = (props) => {
	return <WidgetsTextField {...props} onChange={(event): void => props.onChange(event.target.value)} />;
};

export const ExampleShowcase = (): ReactElement => {
	const contentBoxWrapperRef = useRef<HTMLElement | null>(null);
	const handleContentBoxWrapperRef = useCallback((ref: HTMLElement | null): void => {
		if (ref) {
			contentBoxWrapperRef.current = ref;
		}
	}, []);

	const { register, goToField, errors, warnings, issues } = useForm({
		fullName: "Shane Bailey",
		email: "shanebailey@",
		password: "abcd",
		agreement: false
	});

	return (
		<ActionContentbox
			wrapperRef={handleContentBoxWrapperRef}
			headingElements={<ContentBoxElements.Title text="Sign up with email" />}
			padding="12px 24px"
			style={{ maxWidth: "450px" }}
			notificationArea={
				issues?.length ? (
					isMobile ? (
						<ValidationBarMobile
							contentBoxWrapperRef={contentBoxWrapperRef.current}
							goToField={goToField}
							errors={errors}
							issues={issues}
							warnings={warnings}
						/>
					) : (
						<DesktopValidationBar goToField={goToField} errors={errors} issues={issues} warnings={warnings} />
					)
				) : null
			}
		>
			<Typography.Section role="form">
				<Grid>
					<Row>
						<Column size={{ sm: 12, md: 12, lg: 12 }}>
							<TextField
								placeholder="John Doe"
								label="Full name"
								{...register("fullName", (value: string) => ({
									errorMessage: !value.length && "Full name is required."
								}))}
							/>
						</Column>

						<Column size={{ sm: 12, md: 12, lg: 12 }}>
							<TextField
								placeholder="johndoe@mail.com"
								label="Email"
								{...register("email", (value: string) => ({
									errorMessage: !value.length
										? "Email is required."
										: !/^\S+@\S+\.\S+$/.test(value)
											? "Your email is invalid. Please provide a valid one."
											: undefined
								}))}
							/>
						</Column>

						<Column size={{ sm: 12, md: 12, lg: 12 }}>
							<TextField
								inputProps={{ type: "password" }}
								label="Password"
								{...register("password", (value: string) => {
									const errorMessage = !value.length && "Password is required.";

									return {
										errorMessage,
										warningMessage:
											!errorMessage &&
											!/^(?=.*[A-Z])(?=.*\d).{8,}$/gm.test(value) &&
											"Your password is too easy to guess. Please use at least 8 characters with a mix of numbers, lower and upper letters."
									};
								})}
							/>
						</Column>

						<Column size={{ sm: 12, md: 12, lg: 12 }}>
							<Checkbox
								label={
									<>
										I agree to the <Link>Terms of Services</Link> and <Link>Privacy Policy</Link>
									</>
								}
								title="Agreement"
								{...register("agreement", (value: boolean) => ({
									errorMessage: !value && "You have to agree to our terms to create the account."
								}))}
							/>
						</Column>

						<Column size={{ sm: 12, md: 12, lg: 12 }}>
							<ButtonGroup className="-u-justify-center">
								<Button disabled={!!errors?.length} label="Create account" primary />
							</ButtonGroup>
						</Column>
					</Row>
				</Grid>
			</Typography.Section>
		</ActionContentbox>
	);
};
