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
import { useState, useRef, useCallback, useEffect } from "react";
import { loremIpsum } from "lorem-ipsum";

import type { ToastGroupProps, ToastProps, ToastType, Variant } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Button,
	LayoutGrid,
	provider as DeviceDetector,
	Radio,
	Toast,
	ToastGroup,
	Checkbox,
	Link,
	ButtonGroup,
	LinesEllipsis
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../../../helpers/configuration-view.js";

const { Grid, Row, Column } = LayoutGrid;
type ToastOptions = ToastProps & { key: string; minimized?: boolean; visible?: boolean };
const TOAST_VARIANTS: Variant[] = ["info", "success", "warning", "error"];
const NORMAL_TEXT = loremIpsum({ units: "sentences", count: 1 });
const HTML_SAMPLE = (
	<div>
		<div>This is a div tag</div>
		<p>
			This is a p tag contains a <a href="https://example.com">link</a>
		</p>
		<strong>This is a strong tag</strong>
		<br />
		Todo List:
		<ul>
			<li>Task 1</li>
			<li>Task 2</li>
			<li>Task 3</li>
		</ul>
	</div>
);

export function ApplicationLevelToastGroupShowcase(): ReactElement {
	const [toasts, setToasts] = useState<ToastOptions[]>([]);
	const [position, setPosition] = useState<ToastGroupProps.Position>("top-right");
	const [type, setType] = useState<ToastType>("permanent");
	const [collapsible, setCollapsible] = useState<boolean>(true);
	const [minimized, setMinimized] = useState<undefined | boolean>(undefined);
	const [previousMinimizedToastIndex, setPreviousMinimizedToastIndex] = useState<number | undefined>(undefined);
	const [focusOnMount, setFocusOnMount] = useState<boolean>(true);
	const [stackable, setStackable] = useState<boolean>(true);
	const [stacking, setStacking] = useState<boolean | undefined>(true);
	const toastIndex = useRef(0);
	const toggleStackHandler = useRef<() => boolean | undefined>(undefined);
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const isMobile = DeviceDetector.isPhone();
	const mounted = useRef<boolean | undefined>(undefined);

	const generateToastOptions = useCallback(
		(key = `toast-${toastIndex.current++}`): ToastOptions => {
			const variant = TOAST_VARIANTS[Math.round(Math.random() * 3)];
			const options: ToastOptions = {
				key,
				variant,
				type,
				header: (variant as string).charAt(0).toUpperCase() + (variant as string).slice(1),
				minimized: collapsible,
				footer:
					toastIndex.current === 3 || toastIndex.current === 6 ? (
						<ButtonGroup alignment="right">
							<Button label="Update later" />
							<Button label="Update now" primary />
						</ButtonGroup>
					) : undefined,
				collapse: collapsible,
				focusOnMount: focusOnMount
			};

			return options;
		},
		[collapsible, focusOnMount, type]
	);

	const addToast = useCallback((): void => {
		const newToast = generateToastOptions();
		const cloneToasts = toasts.map((value) => {
			return {
				...value,
				visible: !isMobile
			};
		});
		cloneToasts.push({
			...newToast,
			visible: true
		});
		setToasts(cloneToasts);
	}, [generateToastOptions, isMobile, toasts]);

	const getWrapperRef = useCallback(
		(ref: HTMLDivElement | null) => {
			wrapperRef.current = ref;
		},
		[wrapperRef]
	);

	const toggleMinimizedState = useCallback((index: number, minimized?: boolean): void => {
		setMinimized(minimized === undefined ? !minimized : minimized);
		setPreviousMinimizedToastIndex(index);
	}, []);

	const onPositionChange = useCallback(
		(newPosition: string): void => {
			if (!toasts.length) {
				setPosition(newPosition as ToastGroupProps.Position);

				return;
			}

			setToasts([]);
			setPosition(newPosition as ToastGroupProps.Position);
		},
		[toasts.length]
	);

	const onTypeChange = useCallback((newType: string): void => setType(newType as ToastType), []);

	const renderToasts = useCallback(() => {
		return toasts.map((toast) => {
			const toastKey = Number(toast.key.split("-")[1]);
			toast.minimized = previousMinimizedToastIndex === toastKey ? minimized : toast.minimized;
			const renderMessage =
				toast.minimized && toast.type !== "temporary" ? <LinesEllipsis htmlSupport text={HTML_SAMPLE} /> : HTML_SAMPLE;

			const actionContent =
				toast.collapse && toast.type !== "temporary" ? (toast.minimized ? "READ MORE" : "READ LESS") : undefined;
			const toastWithLongMessage = toastKey % 2 !== 0;
			const updatedToast = { ...toast, shouldHideToastWhenAdding: isMobile && !toast.visible };

			const closeToast = (): void => {
				setToasts((prevState) => {
					const filteredToasts: ToastOptions[] = prevState
						.filter((toastItem) => toastItem.key !== toast.key)
						.map((value, index, array) => {
							return {
								...value,
								visible: isMobile ? index === array.length - 1 : true
							};
						});

					if (filteredToasts.length > 0 && wrapperRef?.current?.contains(document.activeElement)) {
						wrapperRef?.current?.focus();
					}

					return filteredToasts;
				});
			};

			const { key: toastItemKey, ...toastProps } = updatedToast;

			return (
				<Toast
					key={toastItemKey}
					{...toastProps}
					message={toastWithLongMessage ? renderMessage : NORMAL_TEXT}
					collapse={
						toastWithLongMessage && (
							<Link useAsButton onClick={(): void => toggleMinimizedState(toastKey, !toast.minimized)}>
								{actionContent}
							</Link>
						)
					}
					onClose={closeToast}
				/>
			);
		});
	}, [isMobile, minimized, previousMinimizedToastIndex, toasts, toggleMinimizedState]);

	const clear = useCallback((): void => setToasts([]), []);

	const closeFirstToast = useCallback(() => {
		if (toasts.length) {
			const newToasts = toasts.splice(1, toasts.length);
			setToasts(newToasts);
		}
	}, [toasts]);

	const onCloseToast = useCallback(() => {
		if (toasts.length) {
			closeFirstToast();
		}
	}, [closeFirstToast, toasts.length]);

	const handleToggleStack = useCallback(() => {
		if (toggleStackHandler.current) {
			setStacking(toggleStackHandler.current());
		}
	}, []);

	const handleOnToggleStack = useCallback((handler: () => boolean) => {
		toggleStackHandler.current = handler;
	}, []);

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
		} else {
			if (!stacking && toasts.length < 2) {
				setStacking(true);
			}
		}
	}, [stacking, toasts.length]);

	return (
		// ConfigurationView is just a showcase utility. You can safely delete it.
		<ConfigurationView
			configuration={
				<div>
					<Grid>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }}>
								{!isMobile && (
									<Radio inline label="ToastGroup position:" value={position} onValueChanged={onPositionChange}>
										<Radio.Item label="Left top" value="top-left" />
										<Radio.Item label="Right top" value="top-right" />
										<Radio.Item label="Left bottom" value="bottom-left" />
										<Radio.Item label="Right bottom" value="bottom-right" />
									</Radio>
								)}
							</Column>
						</Row>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }}>
								<Radio inline label="Toast type:" value={type} onValueChanged={onTypeChange}>
									<Radio.Item label="Permanent" value="permanent" />
									<Radio.Item label="Temporary" value="temporary" />
								</Radio>
							</Column>
						</Row>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }}>
								<strong>Toast extensions:</strong>
								<br />
								<Checkbox
									checked={collapsible && type !== "temporary"}
									onChange={setCollapsible}
									label="Collapsible"
									id="collapsible"
									disabled={type !== "permanent"}
								/>
								{!isMobile && <Checkbox checked={stackable} onChange={setStackable} label="Stackable" id="stackable" />}
							</Column>
							{!isMobile && (
								<Column size={{ sm: 12, md: 12, lg: 12 }}>
									<Checkbox
										checked={!stackable && focusOnMount}
										onChange={setFocusOnMount}
										disabled={stackable}
										label="Focus On Mount"
									/>
								</Column>
							)}
						</Row>
					</Grid>
				</div>
			}
		>
			<ButtonGroup>
				<Button className="-u-margin-b-base -u-block" label="Add toast" primary onClick={addToast} />
				<Button className="-u-margin-b-base -u-block" label="Clear" primary destructive onClick={clear} />
			</ButtonGroup>
			<ToastGroup
				mobile={isMobile}
				wrapperRef={getWrapperRef}
				position={position}
				onClose={onCloseToast}
				stackable={
					stackable && {
						toolbarTitle: `Notifications: ${toasts.length}`,
						toolbarItems: [
							<Button label={stacking ? "Expand all" : "Collapse all"} onClick={handleToggleStack} secondary key={1} />,
							<Button key={2} label="Close all" secondary onClick={clear} />
						],
						onToggleStack: handleOnToggleStack
					}
				}
			>
				{renderToasts()}
			</ToastGroup>
		</ConfigurationView>
	);
}
