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

import { unstable_NormalPriority as NormalPriority, unstable_runWithPriority as runWithPriority } from "scheduler";
import type { Context, FC, MutableRefObject, Provider } from "react";
import { useContext, useLayoutEffect, useReducer, useRef, createContext as reactCreateContext } from "react";

import type { Container } from "../common/main/base-props.js";

const CONTEXT_VALUE = Symbol();

type Action<T> = { value: T; version: number };
type Listener<T> = (action: Action<T>) => void;

type ContextValue<T> = {
	[CONTEXT_VALUE]: {
		value: MutableRefObject<T>;
		version: MutableRefObject<number>;
		listeners: MutableRefObject<Set<Listener<T>>>;
	};
};

/**
 * Attempt to wrap default React context API to provide an optimized solution to allow context property to be cherry-picked
 * and prevent unnecessary re-rendering. The selector can be used together with {@link useContextSelector} which shares
 * a similar interface with the react-redux package.
 *
 * The function adopts the subscription & listener pattern instead to archive the state cherry-picking ability.
 */
export function createContext<T>(defaultValue: T): Context<T> {
	const context = reactCreateContext<ContextValue<T>>({
		[CONTEXT_VALUE]: {
			value: { current: defaultValue },
			version: { current: -1 },
			listeners: { current: new Set() }
		}
	});

	(context as unknown as Context<T>).Provider = createProvider<T>(context.Provider);
	// We don't want to support Consumer. However, this will only cause runtime error and there won't be any TS error.
	delete (context as unknown as Partial<Context<T>>).Consumer;

	return context as unknown as Context<T>;
}

export function useContextSelector<Value, SelectedValue>(
	context: Context<Value>,
	selector: (context: Value) => SelectedValue
): SelectedValue {
	const contextValue = useContext(context as unknown as Context<ContextValue<Value>>)[CONTEXT_VALUE];
	const { value, version, listeners } = contextValue;

	// We use `useReducer` here to apply a trick that allows accessing `selector` props without affecting the `useLayoutEffect` below
	// See https://overreacted.io/a-complete-guide-to-useeffect section "Why useReducer Is the Cheat Mode of Hooks".
	const [selectedState, dispatch] = useReducer(reducer, value.current, selector);
	function reducer(prevState: SelectedValue, action: Action<Value>): SelectedValue {
		if (action.version !== version.current) {
			return prevState;
		}

		const nextState = selector(action.value);

		if (nextState === prevState) {
			return prevState;
		}

		return nextState;
	}

	useLayoutEffect(() => {
		const listenerRegistry = listeners.current;
		listenerRegistry.add(dispatch);

		return () => {
			listenerRegistry.delete(dispatch);
		};
	}, [listeners]);

	return selectedState;
}

function createProvider<T>(ProviderOriginal: Context<ContextValue<T>>["Provider"]): Provider<T> {
	const ContextProvider: FC<Container & { value: T }> = ({ value, children }) => {
		const valueRef = useRef(value);
		const versionRef = useRef(0);
		const listenerRef = useRef(new Set<Listener<T>>());

		const contextValue = useRef<ContextValue<T>>({
			[CONTEXT_VALUE]: { value: valueRef, version: versionRef, listeners: listenerRef }
		});

		useLayoutEffect(() => {
			valueRef.current = value;
			versionRef.current += 1;

			// We will want to bail out the initial update because the context has already fed with the initial state
			if (versionRef.current === 1) {
				return;
			}

			// Schedule the listeners so that it will not run instantly but rather wait until the child component finished its update cycle
			runWithPriority(NormalPriority, () => {
				contextValue.current[CONTEXT_VALUE].listeners.current.forEach((listener) => {
					listener({ version: versionRef.current, value });
				});
			});
		}, [value]);

		return <ProviderOriginal value={contextValue.current}>{children}</ProviderOriginal>;
	};

	return ContextProvider as unknown as Context<T>["Provider"];
}
