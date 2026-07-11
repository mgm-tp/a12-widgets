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

/**
 * The module common contains a variety of different helper tools for the widgets.
 */

import type { CSSProperties, ReactNode, KeyboardEvent, RefCallback, RefObject } from "react";
import { isValidElement, useRef, useEffect } from "react";
import { Key as KeyEnum } from "ts-key-enum";

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;

export type GenericCallback<T extends any[], U = void> = (...args: T) => U;

/**
 * An enum that is not included in "ts-key-enum" library.
 */
export enum Key {
	Space = " "
}

/**
 * In case of custom prefix, we need to configure the build tool to replace this variable.
 * For example, with webpack, we can use webpack's DefinePlugin, and set __A12_PREFIX__: JSON.stringify("a12-")
 */
declare const __A12_PREFIX__: string;

export function addPrefix(...classNames: string[]): string {
	if (classNames.filter(Boolean).length > 0) {
		let PREFIX_NAME = "";

		if (typeof __A12_PREFIX__ !== "undefined") {
			PREFIX_NAME = __A12_PREFIX__;
		}

		if (PREFIX_NAME === "") {
			return classNames.filter(Boolean).join(" ").trim();
		}

		return classNames
			.map((className) => {
				return className
					.split(" ")
					.map((item) => {
						if (item.charAt(0) === "-") {
							return PREFIX_NAME + item.substring(1);
						}

						return PREFIX_NAME + item;
					})
					.filter(Boolean)
					.join(" ")
					.trim();
			})
			.filter(Boolean)
			.join(" ")
			.trim();
	}

	return "";
}

/**
 * Generates an unique id for html elements that need a globally unique id.
 */
export function generateUid(): string {
	return Math.round(Math.random() * Math.pow(2, 32)).toString(16);
}

/**
 * Resolves the width of the scrollbar of a browser, which depends on browser and operation system styles.
 */
export class ScrollbarWidthResolver {
	/**
	 * Cache
	 */
	protected static width: number | undefined;

	/**
	 * Returns the width of the scrollbar if document is accessible otherwise undefined
	 */
	static get(): number | undefined {
		if (!ScrollbarWidthResolver.width) {
			if (typeof document === "undefined" || !document) {
				return (ScrollbarWidthResolver.width = 0);
			}

			const dummyScrollDiv = document.createElement("div");
			dummyScrollDiv.style.width = "100px";
			dummyScrollDiv.style.height = "100px";
			dummyScrollDiv.style.overflow = "scroll";
			dummyScrollDiv.style.position = "fixed";
			dummyScrollDiv.style.top = "-9999px";

			document.body.appendChild(dummyScrollDiv);

			// Get the scrollbar width
			ScrollbarWidthResolver.width = dummyScrollDiv.offsetWidth - dummyScrollDiv.clientWidth;
			document.body.removeChild(dummyScrollDiv);

			if (isNaN(ScrollbarWidthResolver.width)) {
				ScrollbarWidthResolver.width = undefined;
			}
		}

		return ScrollbarWidthResolver.width;
	}
}

/**
 * Executes a task at most once every browser animation frame. If another execution is scheduled before the previous
 * has been executed, the previous execution is cancelled in favor of the new one.
 *
 * @see [MDN]{@link https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame}
 */
export class Throttler {
	/**
	 * Wraps a function into a Throttler.
	 *
	 * @param task - that should be executed
	 */
	static create<T>(task: (arg1: T) => void): (arg1: T) => void;
	static create<T, U>(task: (arg1: T, arg2: U) => void): (arg1: T, arg2: U) => void;
	static create<T, U, V>(task: (arg1: T, arg2: U, arg3: V) => void): (arg1: T, arg2: U, arg3: V) => void;
	static create(task: (...args: any[]) => void): (...args: any[]) => void {
		const throttler = new Throttler(task);

		return (...args: any[]) => {
			throttler.execute(...args);
		};
	}

	protected pendingTask: number | undefined;
	protected throttle = 0;

	/**
	 * @param task - that should be executed
	 */
	constructor(protected task: (...args: any[]) => void) {}

	/**
	 * Executes the given task at most once every browser animation frame. Every other execution is ignored.
	 *
	 * @param args - of the given task on construction
	 */
	execute(...args: any[]): void {
		if (this.pendingTask !== undefined) {
			window.cancelAnimationFrame(this.pendingTask);
		}

		this.pendingTask = window.requestAnimationFrame(() => {
			this.task(...args);
			this.pendingTask = undefined;
		});
	}
}

/**
 * The range class represents an immutable sequence of numbers.
 *
 * * For a positive step, the contents of a range `r` are determined by the formula<br />
 *   `r[i] = start + step * i where i >= 0 and r[i] < end`
 * * For a negative step, the contents of the range are still determined by the formula<br />
 *   `r[i] = start + step * i where i >= 0 and r[i] > end`
 *
 * No value will be returned if `r[0]` does not meet the value constraint.
 */
export class Range implements Iterable<number>, Iterator<number> {
	protected value = 0;
	protected end: number;

	/**
	 * If only start is provided then the start will be interpreted as end.
	 *
	 * @param start - The value of the start parameter. It must be an **integer** value.
	 * @param end - The value of the end parameter. It must be an **integer** value.
	 * @param step - The value of the step parameter. It must be an **integer** value.
	 *
	 * @throws If step is zero
	 */
	constructor(
		start = 0,
		end?: number,
		protected step: number = 1
	) {
		if (step === 0) {
			throw new Error("The step size must not be 0!");
		}

		this.value = end !== undefined ? start : 0;
		this.end = end !== undefined ? end : start;
	}

	public [Symbol.iterator](): Iterator<number> {
		return this;
	}

	public next(): IteratorResult<number> {
		const result = this.value;

		if ((this.step > 0 && result >= this.end) || (this.step < 0 && result <= this.end)) {
			return {
				done: true,
				value: 0
			};
		} else {
			this.value += this.step;

			return {
				done: false,
				value: result
			};
		}
	}
}

export class StringUtils {
	// Format the input string that use a template like "I'm a string with value: {value}"
	public static format(stringToFormat: string, args: { [key: string]: string | number }): string {
		return Object.keys(args).reduce(
			(result, key) => result.replace("{" + key + "}", args[key].toString()),
			stringToFormat
		);
	}

	public static sortIgnoreCase(stringsToSort: string[]): string[] {
		return stringsToSort.sort((current, next) => {
			return current.toLowerCase().localeCompare(next.toLowerCase());
		});
	}

	public static join(...stringsToJoin: any[]): string | undefined {
		return joinClassNames(...stringsToJoin);
	}

	public static hyphenate(stringsToConvert: string): string {
		return stringsToConvert.toString().trim().toLowerCase().replace(/\s/g, "-");
	}

	public static fromCamelToDashed(camel: string): string {
		return camel.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
	}
}

export interface EqualityFunction<T> {
	(value1: T, value2: T): boolean;
}

/**
 * Retrieves the document object associated with a given DOM element.
 * This function is particularly useful for handling elements within iframes, ensuring that the correct document object is returned.
 *
 * @param element - The DOM element for which to get the document object. If not provided, defaults to the global document object.
 * @returns The document object associated with the element's owner document, or the global document object if the element is not provided or its owner document is the global document.
 */
export function getElementDocument(element?: Element | null): Document {
	const ownerDocument = element?.ownerDocument;

	return element && ownerDocument !== document ? ownerDocument || document : document;
}

/**
 * Retrieves the window object associated with a given DOM element.
 * This function is particularly useful for handling elements within iframes, ensuring that the correct window object is returned.
 *
 * @param element - The DOM element for which to get the window object. If not provided, defaults to the global window object.
 * @returns The window object associated with the element's owner document, or the global window object if the element is not provided or its owner document is the global document.
 */
export function getElementWindow(element?: Element | null): Window {
	const ownerDocument = element?.ownerDocument;

	return element && ownerDocument !== document ? element?.ownerDocument.defaultView || window : window;
}

export function getIframeOffset(
	referenceElement: Element | null | undefined,
	portalDocument: Document
): { top: number; left: number } {
	if (!referenceElement) {
		return { top: 0, left: 0 };
	}

	let totalTop = 0;
	let totalLeft = 0;
	let currentDoc: Document = referenceElement.ownerDocument;

	while (currentDoc && currentDoc !== portalDocument) {
		const currentWindow = currentDoc.defaultView;
		const parentWindow = currentWindow?.parent;

		if (!parentWindow || parentWindow === currentWindow) {
			// If we can't access the parent window, look for the iframe inside portalDocument that contains currentDoc.
			const hostIframe = Array.from(portalDocument.querySelectorAll("iframe")).find(
				(iframe) => iframe.contentDocument === currentDoc
			);

			if (hostIframe) {
				const iframeRect = hostIframe.getBoundingClientRect();

				totalTop += iframeRect.top;
				totalLeft += iframeRect.left;
			}

			break;
		}

		const parentDoc = parentWindow.document;
		const hostIframe = Array.from(parentDoc.querySelectorAll("iframe")).find(
			(iframe) => iframe.contentDocument === currentDoc
		);

		if (!hostIframe) {
			break;
		}

		const iframeRect = hostIframe.getBoundingClientRect();

		totalTop += iframeRect.top;
		totalLeft += iframeRect.left;
		currentDoc = parentDoc;
	}

	return { top: totalTop, left: totalLeft };
}

function isInsideViewport(rect: DOMRect | ClientRect): boolean {
	const { top, left, bottom, right } = rect;

	return (
		top >= 0 &&
		left >= 0 &&
		Math.round(bottom) <= (window.innerHeight || document.documentElement.clientHeight) &&
		Math.round(right) <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

export function getBoundingElements(
	rect: DOMRect | ClientRect,
	element?: Element
): {
	topElement: Element | null;
	leftElement: Element | null;
	rightElement: Element | null;
	bottomElement: Element | null;
} | null {
	const document = getElementDocument(element);

	if (typeof document.elementFromPoint !== "function") {
		return null;
	}

	const { top, left, bottom, right } = rect;
	const topElement = document.elementFromPoint((left + right) / 2, Math.ceil(top));
	const leftElement = document.elementFromPoint(Math.ceil(left), (top + bottom) / 2);
	const bottomElement = document.elementFromPoint((left + right) / 2, Math.floor(bottom));
	const rightElement = document.elementFromPoint(Math.floor(right), (top + bottom) / 2);

	return { topElement, leftElement, rightElement, bottomElement };
}

export function isNotFullyOverlapped(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();
	const boundingElements = getBoundingElements(rect, element);

	if (!boundingElements) {
		return true;
	}

	const { topElement, leftElement, rightElement, bottomElement } = boundingElements;

	return (
		element.contains(topElement) ||
		element.contains(leftElement) ||
		element.contains(bottomElement) ||
		element.contains(rightElement)
	);
}

export function isVisibleOnScreen(element: HTMLElement): boolean {
	// For testing purpose
	if (typeof document.elementFromPoint !== "function") {
		return true;
	}

	const rect = element.getBoundingClientRect();

	return isInsideViewport(rect) && isNotFullyOverlapped(element);
}

/**
 * Check if the element is in the container VisibleArea by comparing
 * the top and bottom edge of the element and the container.
 *
 * VisibleArea of Container = from ContainerTop to ContainerBottom
 * @param excludePaddingAndBorder If set to true, treat the element as a content-box element, so only calculate the
 *   content area top & bottom
 * @param topThreshold useful in scrolling handler where we want to check if the element has scroll passed a number of
 *   pixel
 */
export function isElementVisibleInContainer(
	container: HTMLElement,
	element: HTMLElement,
	excludePaddingAndBorder = true,
	topThreshold?: number
): boolean {
	const elementRect = element.getBoundingClientRect();
	const containerRect = container.getBoundingClientRect();
	const elementStyle = window.getComputedStyle(element);

	const containerTop = containerRect.top;
	const containerBottom = containerRect.bottom;

	let elementTop = elementRect.top + parseInt(elementStyle.marginTop, 10);
	let elementBottom = elementRect.bottom - parseInt(elementStyle.marginBottom, 10);

	if (excludePaddingAndBorder) {
		elementTop += parseInt(elementStyle.paddingTop, 10) + parseInt(elementStyle.borderTopWidth, 10);
		elementBottom -= parseInt(elementStyle.paddingBottom, 10) - parseInt(elementStyle.borderBottomWidth, 10);
	}

	return (
		((elementTop > containerTop && elementTop < containerBottom) ||
			(elementTop <= containerTop && elementBottom > containerTop)) &&
		(topThreshold !== undefined ? containerRect.top - elementRect.top < topThreshold : true)
	);
}

export function isElementCompletelyVisibleInContainer(container: HTMLElement, element: HTMLElement): boolean {
	const elementRect = element.getBoundingClientRect();
	const containerRect = (container.nodeName === "#document" ? document.body : container).getBoundingClientRect();

	return elementRect.top > containerRect.top && elementRect.bottom < containerRect.bottom;
}

export function getOverlapElement(element: HTMLElement): Element | null {
	const rect = element.getBoundingClientRect();
	const boundingElements = getBoundingElements(rect);

	if (!boundingElements) {
		return null;
	}

	const { topElement, leftElement, rightElement, bottomElement } = boundingElements;

	if (topElement && !element.contains(topElement)) {
		return topElement;
	}

	if (leftElement && !element.contains(leftElement)) {
		return leftElement;
	}

	if (bottomElement && !element.contains(bottomElement)) {
		return bottomElement;
	}

	if (rightElement && !element.contains(rightElement)) {
		return rightElement;
	}

	return isInsideViewport(rect) ? null : getElementDocument(element).body;
}

export function getVerticalWindowScrollWidth(): number {
	return window.innerWidth - document.documentElement.clientWidth;
}

export function joinClassNames(...classNames: any[]): string | undefined {
	if (classNames.filter(Boolean).length > 0) {
		return (
			classNames
				.map((className) => {
					if (typeof className === "object") {
						const conditionKey = Object.keys(className)[0];

						return className[conditionKey] && conditionKey;
					}

					return className;
				})
				.filter(Boolean)
				.join(" ")
				.trim() || undefined
		);
	}

	return undefined;
}

export function mergeStyles(...styles: any[]): CSSProperties | undefined {
	if (styles.filter(Boolean).length > 0) {
		const filteredStyles = styles
			.map((style) => {
				return typeof style === "object" ? style : undefined;
			})
			.filter(Boolean);

		return Object.assign({}, ...filteredStyles);
	}

	return undefined;
}

export function cloneObject<T>(obj: T): T {
	if (typeof obj === "object") {
		return JSON.parse(JSON.stringify(obj));
	}

	return obj;
}

export function getParentElement(
	element: HTMLElement | null | undefined,
	condition: (currentParent: HTMLElement) => boolean
): HTMLElement | undefined {
	if (!element?.parentElement) {
		return;
	}

	if (condition(element.parentElement)) {
		return element.parentElement;
	}

	return getParentElement(element.parentElement, condition);
}

export function getNearestFocusableParent(element: HTMLElement | null | undefined): HTMLElement | null | undefined {
	if (!element) {
		return null;
	}

	return isElementFocusable(element) ? element : getParentElement(element, isElementFocusable);
}

export function isElementFocusable(element: HTMLElement): boolean {
	const tagNames = ["button", "a", "input", "select", "textarea", "iframe"];

	const focusableByTabIndex = element.hasAttribute("tabindex") && element.tabIndex >= 0;
	const focusableByTagName = !element.hasAttribute("tabindex") && tagNames.includes(element.tagName.toLowerCase());
	const focusableByContentEditable = element.getAttribute("contentEditable") === "true";

	return !element.hasAttribute("disabled") && (focusableByTabIndex || focusableByTagName || focusableByContentEditable);
}

/**
 * Programmatically moves focus to an element that may not be focusable by default
 * (e.g. a `<tr>`). If the element has no `tabindex`, a `tabindex="-1"` is added first
 * so the `focus()` call takes effect without making the element part of the tab order.
 */
export function focusEnsuringTabIndex(element: HTMLElement): void {
	if (!element.hasAttribute("tabindex")) {
		element.setAttribute("tabindex", "-1");
	}

	element.focus();
}

function filterMethods(_this: any, filter: (value: string, index: number) => boolean): string[] {
	const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(_this));
	const methodFilter = filter || (() => true);

	return (
		keys
			.map((key) => {
				const member = _this[key];

				return typeof member === "function" && key;
			})
			.filter(Boolean) as string[]
	).filter(methodFilter);
}

export function bindMethods(_this: any, filter?: (value: string, index: number) => boolean): any {
	if (_this) {
		const methods = filterMethods(_this, filter || ((method) => method !== "constructor"));
		methods.forEach((method) => {
			_this[method] = _this[method].bind(_this);
		});
	}

	return _this;
}

export function getAllFocusableElements(element: HTMLElement): NodeListOf<HTMLElement> {
	return element.querySelectorAll<HTMLElement>(
		'button:not([disabled]):not([tabindex="-1"]),' +
			'[href]:not([tabindex="-1"]),' +
			'a:not([tabindex="-1"]),' +
			'input:not([disabled]):not([tabindex="-1"]),' +
			'select:not([disabled]):not([tabindex="-1"]),' +
			'textarea:not([disabled]):not([tabindex="-1"]),' +
			'iframe:not([tabindex="-1"]),' +
			'[tabindex]:not([tabindex="-1"]),' +
			'[contentEditable=true]:not([tabindex="-1"])'
	);
}

export function getAllInteractiveElements(element: HTMLElement): NodeListOf<HTMLElement> {
	return element.querySelectorAll<HTMLElement>(
		"button," +
			"[href]," +
			"a," +
			"input," +
			"select," +
			"textarea," +
			"iframe," +
			"[tabindex]," +
			"[contentEditable=true]"
	);
}

export function isLastFocusableElement(container: HTMLElement, element: HTMLElement): boolean {
	const focusableElements = getAllFocusableElements(container);

	return focusableElements[focusableElements.length - 1] === element;
}

/**
 * @deprecated This function will be removed in a future major version.
 */
export function isDOMTypeElement(element: ReactNode) {
	return isValidElement(element) && typeof element.type === "string";
}

export function moveItemFocus(
	container: HTMLElement | null,
	from: Element | null,
	selector: string,
	computeNextIndex: (currentIndex: number, elements: Element[]) => number
): void {
	if (!from || !container) {
		return;
	}

	const elements = Array.from(container.querySelectorAll(selector));
	const currentIndex = elements.indexOf(from);
	const nextFocusIndex = computeNextIndex(currentIndex, elements);
	const nextFocusElement = elements[nextFocusIndex] as HTMLElement;

	if (nextFocusElement) {
		nextFocusElement.focus();
	}
}

export function moveItemFocusBack(
	container: HTMLElement | null,
	from: Element | null,
	selector: string,
	stopAtBoundary?: boolean
): void {
	moveItemFocus(container, from, selector, (currentIndex, elements) => {
		return currentIndex > 0 ? currentIndex - 1 : stopAtBoundary ? 0 : elements.length - 1;
	});
}

export function moveItemFocusNext(
	container: HTMLElement | null,
	from: Element | null,
	selector: string,
	stopAtBoundary?: boolean
): void {
	moveItemFocus(container, from, selector, (currentIndex, elements) => {
		return currentIndex >= elements.length - 1 ? (stopAtBoundary ? currentIndex : 0) : currentIndex + 1;
	});
}

export function hasGotFocus(container: HTMLElement | null): boolean {
	return !!container && container.contains(document.activeElement);
}

/** @internal */
export function getNextWrappedIndex(currentIndex: number, length: number, direction: "forward" | "backward"): number {
	if (length === 0) {
		return -1;
	}

	if (direction === "forward") {
		return currentIndex < length - 1 ? currentIndex + 1 : 0;
	}

	return currentIndex > 0 ? currentIndex - 1 : length - 1;
}

/**
 * Finds the first focusable element outside the given container in the specified direction.
 * @internal
 */
export function findFirstFocusableOutside(
	container: HTMLElement,
	direction: "before" | "after"
): HTMLElement | undefined {
	const allFocusable = Array.from(getAllFocusableElements(document.body)).filter((el) => {
		if (container.contains(el) || el.contains(container)) {
			return false;
		}

		const style = getComputedStyle(el);

		return style.visibility !== "hidden" && style.display !== "none";
	});

	if (direction === "after") {
		return allFocusable.find((el) => !!(container.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING));
	}

	return allFocusable
		.reverse()
		.find((el) => !!(container.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING));
}

export function isTypeableCharacter(event: KeyboardEvent): boolean {
	const key = event.key;

	return key !== KeyEnum[key as KeyEnum];
}

export function handleAriaHiddenOfWrapper(addAriaHidden = true): void {
	if (addAriaHidden) {
		document.getElementsByClassName(addPrefix("wrapper"))[0]?.setAttribute("aria-hidden", "true");

		return;
	}

	document.getElementsByClassName(addPrefix("wrapper"))[0]?.removeAttribute("aria-hidden");
}

export function roundDecimalNumber(value: number, decimal = 1): number {
	const unit = Math.pow(10, decimal);

	return Math.round(value * unit) / unit;
}

export function getHorizontalPadding(element: Element | null): number | undefined {
	if (!element) {
		return undefined;
	}

	const elementComputedStyle = window.getComputedStyle(element);
	const paddingRight = elementComputedStyle.getPropertyValue("padding-right");
	const paddingLeft = elementComputedStyle.getPropertyValue("padding-left");

	return parseFloat(paddingRight) + parseFloat(paddingLeft);
}

export function getVerticalPadding(element: Element | null): number | undefined {
	if (!element) {
		return undefined;
	}

	const elementComputedStyle = window.getComputedStyle(element);
	const paddingTop = elementComputedStyle.getPropertyValue("padding-top");
	const paddingBottom = elementComputedStyle.getPropertyValue("padding-bottom");

	return parseFloat(paddingTop) + parseFloat(paddingBottom);
}

export function getHorizontalMargin(element: Element | null): number | undefined {
	if (!element) {
		return undefined;
	}

	const elementComputedStyle = window.getComputedStyle(element);
	const marginRight = elementComputedStyle.getPropertyValue("margin-right");
	const marginLeft = elementComputedStyle.getPropertyValue("margin-left");

	return parseFloat(marginRight) + parseFloat(marginLeft);
}

export function getHorizontalSpace(orientation: "right" | "left", space: string): string | undefined {
	if (space === "") {
		return undefined;
	}

	const stringArray = space.split(" ");

	switch (stringArray.length) {
		case 1:
			return space;
		case 2:
		case 3:
			return stringArray[1];
		case 4:
			return orientation === "left" ? stringArray[3] : stringArray[1];
	}

	return undefined;
}

export function getVerticalSpace(orientation: "top" | "bottom", space: string): string | undefined {
	if (space === "") {
		return undefined;
	}

	const stringArray = space.split(" ");

	switch (stringArray.length) {
		case 1:
			return space;
		case 2:
			return stringArray[0];
		case 3:
		case 4:
			return orientation === "top" ? stringArray[0] : stringArray[2];
	}

	return undefined;
}

/**
 * Nothing but a function that doing nothing
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export type CustomClientRect = {
	left: number;
	right: number;
	top: number;
	bottom: number;
	height: number;
	width: number;
};

export function usePreviousProps<T>(value: T): T | undefined {
	const ref = useRef<T>(undefined);
	useEffect(() => {
		ref.current = value;
	});

	return ref.current;
}

export function convertToArr<T>(objToBeArr: T | T[]): T[] {
	return Array.isArray(objToBeArr) ? objToBeArr : [objToBeArr];
}

/**
 * Determine the value of the role attribute if it is set
 * - string value: use passed value.
 * - false: not set role attribute for the element.
 * - true/undefined: use default value.
 */
export const getRole = (role?: string | boolean, defaultRole?: string): string | undefined =>
	typeof role === "string" ? role : role !== false ? defaultRole : undefined;

export function resolveRef<T>(instance: T, refProp?: RefCallback<T> | RefObject<T>): void {
	if (!refProp) {
		return;
	}

	if (typeof refProp === "function") {
		refProp(instance);
	} else {
		/** This type cast is to ensure the compatability of {@link useRef} */
		(refProp as RefObject<T>).current = instance;
	}
}

/**
 * This function is used to add a suffix "-input" into the input's attribute such as id, classname, data-role.
 */
export function inputWithSuffixName(attributeValue?: string): string | undefined {
	if (!attributeValue) {
		return undefined;
	}

	return `${attributeValue}-input`;
}

/**
 * A helper to observe changes in the intersection of a target element with an ancestor element, or with a top-level document's viewport.
 */
export class IntersectionObserverHelper {
	public visibleElementRect: DOMRect | undefined = undefined;
	public observer: IntersectionObserver | null = null;

	/**
	 * The function to get the visible rectangle of an element if it is partially overlapped.
	 */
	public getVisibleElementRect(element: HTMLElement, callback?: (position: DOMRect | undefined) => void): void {
		if (this.observer) {
			this.observer.disconnect();
		}

		this.observer = new IntersectionObserver(
			(entries) => {
				callback?.(entries[0].boundingClientRect);

				/**
				 * Checks if the element is partially visible in the viewport. It means the intersection ratio of the element with the viewport is greater than 0 but less than 1.
				 * If true, stores the visible part's rectangle in `visibleElementRect`.
				 * Otherwise, sets `visibleElementRect` to `undefined`.
				 */
				if (entries[0].intersectionRatio > 0 && entries[0].intersectionRatio < 1) {
					this.visibleElementRect = entries[0].intersectionRect;
				} else {
					this.visibleElementRect = undefined;
				}
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: [0, 1]
			}
		);

		this.observer.observe(element);
	}

	public disconnectObserver(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
	}
}
