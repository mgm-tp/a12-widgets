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
 * Typedoc requires access to Node.js API. Therefore, it is impossible to have a direct import from "typedoc" JS code
 * without breaking webpack bundling process.
 *
 * That's why we have some copies of the types or interfaces which are necessary for showcase implementation.
 */

/**
 * @copy from node_modules/typedoc/dist/lib/models/reflections/kind.d.ts
 */
export enum ReflectionKind {
	Project = 1,
	Module = 2,
	Namespace = 4,
	Enum = 8,
	EnumMember = 16,
	Variable = 32,
	Function = 64,
	Class = 128,
	Interface = 256,
	Constructor = 512,
	Property = 1024,
	Method = 2048,
	CallSignature = 4096,
	IndexSignature = 8192,
	ConstructorSignature = 16384,
	Parameter = 32768,
	TypeLiteral = 65536,
	TypeParameter = 131072,
	Accessor = 262144,
	GetSignature = 524288,
	SetSignature = 1048576,
	TypeAlias = 2097152,
	Reference = 4194304
}
