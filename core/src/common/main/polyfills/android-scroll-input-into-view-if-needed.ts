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
 * Scrolling a focused text field into view is the browser's own job, and Android Chrome does it: as
 * the on-screen keyboard shrinks the viewport, it brings the focused field above the keyboard and
 * leaves the rest of the page where it stands.
 *
 * This module used to fill a gap that no longer exists, and filling it did harm. On every `resize` —
 * which on Android means every time the keyboard opens or closes — it called
 * `scrollIntoView(true)` on the focused field, pinning it to the very top of the viewport. That
 * dropped the field behind any fixed or sticky page header, and it overrode what widgets had just
 * done deliberately: a `focus({ preventScroll: true })`, or the scroll position the Autocomplete's
 * fullscreen dialog puts back when it closes.
 *
 * Nothing is installed any more. The export stays so that consumers importing it keep compiling.
 * @deprecated Since 39.1.0 this resolves without installing anything, and it can be dropped from
 * consumer code. Android Chrome scrolls the focused field into view on its own.
 */
export const AndroidScrollInputIntoViewIfNeeded: Promise<void> = Promise.resolve();
