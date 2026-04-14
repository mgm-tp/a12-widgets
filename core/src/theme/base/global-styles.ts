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

import { createGlobalStyle } from "styled-components";

import { addPrefix } from "../../common/main/utils.js";

import { helperClasses } from "./helpers/helper-classes.js";
import { utilClasses } from "./utils/util-classes.js";
import {
	formLegacyStyles,
	formLegacyStylesForFormEngine,
	formLegacyTypoHeadlineStyles,
	formSectionStyles,
	formTextCellStyles
} from "./legacy/form.js";

export const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }

  .${addPrefix("base")} {
    h1 {
      font-size: 2em;
      margin: 0.67em 0;
    }

    hr {
      box-sizing: content-box;
      height: 0;
      overflow: visible;
    }

    pre {
      font-family: monospace, monospace;
      font-size: 1em;
    }

    a {
      background-color: transparent;
    }

    abbr[title] {
      border-bottom: none;
    }

    b, strong {
      font-weight: bolder;
    }

    code, kbd, samp {
      font-family: monospace, monospace;
      font-size: 1em;
    }

    small {
      font-size: 80%;
    }

    sub, sup {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
    }

    sup {
      top: -0.5em;
    }

    img {
      border-style: none;
    }

    input, optgroup, select, textarea {
      font-family: inherit;
      font-size: 100%;
      margin: 0;
      line-height: 1.45;
      outline: none;
    }

    button, input {
      overflow: visible;
    }

    button, [type="button"], [type="reset"], [type="submit"] {
      -webkit-appearance: button;
    }

    button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner {
      border-style: none;
      padding: 0;
    }

    button:-moz-focusring, [type="button"]:-moz-focusring, [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring {
      outline: 1px dotted ButtonText;
    }

    fieldset {
      padding: 0.35em 0.75em 0.625em;
    }

    legend {
      box-sizing: border-box;
      color: inherit;
      display: table;
      max-width: 100%;
      padding: 0;
      white-space: normal;
    }

    progress {
      vertical-align: baseline;
    }

    [type="checkbox"], [type="radio"] {
      box-sizing: border-box;
      padding: 0;
    }

    [type="number"]::-webkit-inner-spin-button, [type="number"]::-webkit-outer-spin-button {
      height: auto;
    }

    [type="search"] {
      -webkit-appearance: textfield;
      outline-offset: -2px;
    }

    [type="search"]::-webkit-search-decoration {
      -webkit-appearance: none;
    }

    &::-webkit-file-upload-button {
      -webkit-appearance: button;
      font: inherit;
    }

    details {
      display: block;
    }

    summary {
      display: list-item;
    }

    template {
      display: none;
    }

    [hidden] {
      display: none;
    }

    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    -webkit-overflow-scrolling: touch;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    color: ${({ theme }) => theme.applicationStyles.color};
    font-family: ${({ theme }) => theme.applicationStyles.fontFamily};
    font-size: ${({ theme }) => theme.applicationStyles.fontSize};
    height: 100%;
    line-height: 1.45;
    margin: 0;
    padding: 0;

    *, *:before, *:after {
      box-sizing: border-box;
    }

    textarea {
      appearance: none;
      overflow: auto;
    }

    main {
      height: calc(100% - 50px);
      padding: 20px;
    }

    table:not(.${addPrefix("DayPicker-Table")}) {
      border-spacing: 0;
    }

    input:not(.${addPrefix("debug-timetravel-panel-slider")}) {
      appearance: none;
      -moz-appearance: none;
      -ms-appearance: none;
      -webkit-appearance: none;
    }

    select {
      appearance: none;
      -moz-appearance: none;
      -ms-appearance: none;
      -webkit-appearance: none;
    }

    option {
      appearance: none;

      &:focus {
        border: none;
      }
    }
  }

  ${helperClasses}

  ${utilClasses}

  //Form styles
  ${formSectionStyles}
  ${formTextCellStyles}
  ${formLegacyStyles}
  ${formLegacyStylesForFormEngine}
  ${formLegacyTypoHeadlineStyles}
`;
