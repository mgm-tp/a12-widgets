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
 * Basic event.
 * @deprecated
 */
export abstract class Event {
	/**
	 * Creates an instance of Event.
	 *
	 * **Note:** "...args: any[]" is necessary to enable inheritance that uses arguments in their constructor.
	 * Without this typescript will complain about the inherited class is not assignable to "typeof Event".
	 *
	 * @param args
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(...args: any[]) {
		/** noop */
	}
}

/**
 * Event handler for a type E of Events
 * @deprecated
 */
export interface Handler<E extends Event> {
	(event: E): void;
}

/**
 * A registration for a {@link IReadOnlyBus}, which is need for unsubscribe.
 * @deprecated
 */
export interface Registration {
	/**
	 * Event type
	 */
	readonly type: typeof Event;

	/**
	 * Event handler
	 */
	readonly handler: Handler<Event>;
}

/**
 * Basic event bus.
 * @deprecated
 */
export interface IReadOnlyBus {
	/**
	 * Subscribe the given handler for the given event to the bus.
	 *
	 * @param type - of the event for which the handler will be subscribed
	 * @param handler - for the event
	 * @returns which is need to unsubscribe the handler
	 */
	subscribe(type: typeof Event, handler: Handler<Event>): Registration;

	/**
	 * Unsubscribe the given handler from the bus.
	 *
	 * @param registration - that should be unsubscribed
	 */
	unsubscribe(registration: Registration): void;

	/**
	 * Unsubscribe all handlers from the bus.
	 */
	unsubscribeAll(): void;
}

/**
 * A read and write event bus.
 * @deprecated
 */
export interface IBus extends IReadOnlyBus {
	/**
	 * Publish an event on the bus.
	 */
	publish(event: Event): void;

	getRegistrations(): Registration[];
}

/**
 * Default implementation of a read and write event bus.
 * @deprecated
 */
export class Bus implements IBus {
	private registrations: Registration[] = [];

	public subscribe(type: typeof Event, handler: Handler<Event>): Registration {
		const registration = { type: type, handler: handler };
		this.registrations.push(registration);

		return registration;
	}

	public unsubscribe(registration: Registration): void {
		const index = this.registrations.indexOf(registration);

		if (index >= 0) {
			this.registrations.splice(index, 1);
		} else {
			throw new Error("Registration was already unsubscribed!");
		}
	}

	public publish(event: Event): void {
		this.registrations.forEach((entry) => {
			if (event instanceof entry.type) {
				entry.handler(event);
			}
		});
	}

	public unsubscribeAll(): void {
		this.registrations = [];
	}

	public getRegistrations(): Registration[] {
		return [...this.registrations];
	}
}

/**
 * Basic state changed event.
 * @deprecated
 */
export class StateChangedEvent extends Event {}
