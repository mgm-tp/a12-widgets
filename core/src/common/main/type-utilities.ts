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
 * A utility type that makes specific properties of a given type `T` required, while leaving the rest unchanged.
 *
 * @template T - The base type whose properties are being modified.
 * @template U - The keys within `T` that should be made required.
 *
 * This type works by combining:
 * - `Required<Pick<T, U>>`: Makes the properties listed in `U` required.
 * - `Omit<T, U>`: Removes the properties listed in `U` from `T`.
 *
 * The final result is a type where:
 * - The properties specified by `U` are required.
 * - All other properties from `T` remain as originally defined (optional or required).
 */
export type MakeRequired<T, U extends keyof T> = Required<Pick<T, U>> & Omit<T, U>;

/**
 * A utility type that represents a duration value in specific formats.
 *
 * The `Duration` type supports:
 * - Template literal types for durations:
 *   - `${number}${"ms" | "s"}`: A number followed by "ms" (milliseconds) or "s" (seconds).
 *     Examples: "100ms", "2s".
 * - Specific string literals:
 *   - "initial": Represents an initial or default duration value.
 *   - "0": Represents a zero duration.
 *
 * This type ensures type safety for duration values, commonly used in animations or transitions.
 */
export type Duration = `${number}${"ms" | "s"}` | "initial" | "0";
