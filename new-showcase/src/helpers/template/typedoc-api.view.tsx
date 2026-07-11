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

import type { ReactNode, ReactElement, FC } from "react";
import { useState, useMemo } from "react";
import { styled, css } from "styled-components";
import type { JSONOutput } from "typedoc";

import { BulletList, Typography, ExternalLink } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn, DataTableColumnResizingOptions } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { MarkdownViewer } from "../markdown-viewer.js";
import { ReflectionKind } from "../typedoc-type.js";

type RowType = {
	name: ReactNode;
	type: string;
	default?: ReactNode;
	description?: ReactNode;
	params?: string;
	deprecated?: boolean;
};

export const StyledCodeName = styled.code<{ $deprecated?: boolean }>(({ theme, $deprecated }) => {
	return css`
		${$deprecated &&
		css`
			color: ${theme.colors.variant.errorColor};
		`};
	`;
});

const COLUMNS: DataTableColumn<RowType>[] = [
	{
		label: "Property",
		dataKey: "name",
		pinning: "left",
		width: 1,
		verticalAlignment: "middle",
		renderCell: ({ value, row }) => value && <StyledCodeName $deprecated={row.deprecated}>{value}</StyledCodeName>
	},
	{
		label: "Type",
		dataKey: "type",
		width: 1.6,
		verticalAlignment: "middle",
		renderCell: ({ value, row }) => value && <StyledCodeName $deprecated={row.deprecated}>{value}</StyledCodeName>
	},
	{
		label: "Description",
		dataKey: "description",
		width: 3,
		verticalAlignment: "middle"
	}
];

type APIDeclarationType = JSONOutput.DeclarationReflection;

export interface TypedocAPIProps {
	interfaceName?: string;
	moduleDeclaration: APIDeclarationType;

	/*
	 * If specified, the given API(s) will be shown.
	 * If empty or undefined, all API(s) will be shown.
	 */
	filter?: string[];
}

const StyledBulletListItem = styled(BulletList.Item)`
	line-height: 1.5;
`;

const APITable = (props: { data: { name: string; declaration?: RowType[] } }): ReactElement => {
	const [columns, setColumns] = useState(COLUMNS);

	const columnResizingOptions = useMemo<DataTableColumnResizingOptions<DataTableColumn<RowType>>>(() => {
		return {
			onEndResize: ({ resizedWidthsGetter }): void => {
				setColumns((oldColumns) =>
					oldColumns.map((column) => {
						const newWidth = resizedWidthsGetter?.(column);

						if (newWidth !== undefined) {
							return { ...column, width: newWidth };
						}

						return column;
					})
				);
			}
		};
	}, []);

	return (
		<DataTable<RowType>
			className="-u-border -u-border-grey -u-border-solid"
			data={props.data.declaration}
			columns={columns}
			columnResizingOptions={columnResizingOptions}
		/>
	);
};

const ContentMarkdown: FC<{ source: string }> = (props) => (
	<MarkdownViewer
		source={props.source}
		renderers={{
			a: (props: { href?: string; children?: ReactNode }) => (
				<ExternalLink href={props.href} className="-u-text-xs">
					{props.children}
				</ExternalLink>
			)
		}}
	/>
);

export function TypedocAPIComponent(props: TypedocAPIProps): ReactElement {
	const typedocData = useMemo(() => {
		const interfaces: { name: string; declaration?: RowType[] }[] = [];
		const typeAliases: { name: string; declaration?: RowType }[] = [];
		const flattenModuleDeclaration: APIDeclarationType[] = [];

		if (props.moduleDeclaration.children?.find((child) => child.kind === ReflectionKind.Namespace)) {
			props.moduleDeclaration.children?.forEach((declaration) => {
				if (declaration.kind === ReflectionKind.Namespace) {
					declaration.children?.forEach((subDeclaration) => {
						flattenModuleDeclaration.push({ ...subDeclaration, name: `${declaration.name}.${subDeclaration.name}` });
					});
				} else {
					flattenModuleDeclaration.push(declaration);
				}
			});
		} else if (props.moduleDeclaration.children) {
			flattenModuleDeclaration.push(...props.moduleDeclaration.children);
		}

		if (flattenModuleDeclaration.length > 0) {
			flattenModuleDeclaration.forEach((child) => {
				if (!props.filter || props.filter.includes(child.name)) {
					if (child.kind === ReflectionKind.TypeAlias) {
						const typeDeclaration = new Declaration(child);
						const typeAlias = typeDeclaration.getTypeAlias();
						const declaration = {
							name: typeDeclaration.getName(),
							type: typeAlias.type,
							params: typeAlias.params,
							description: typeDeclaration.getDescription()
						};
						typeAliases.push({ name: child.name, declaration });
					} else {
						// Filter the type of function which is for type guard purpose
						const tableData = child?.children
							?.filter((subChild) => subChild.signatures?.[0].type?.type !== "predicate")
							?.map((subChild) => {
								const declaration = new Declaration(subChild);

								return {
									name: declaration.getName(),
									type: declaration.getType(),
									description: declaration.getDescription(),
									deprecated: declaration.isDeprecated()
								};
							});

						if (tableData && tableData.length > 0) {
							interfaces.push({
								name: child.name,
								declaration: tableData
							});
						}
					}
				}
			});
		}

		return { interfaces, typeAliases };
	}, [props.filter, props.moduleDeclaration.children]);

	return (
		<div>
			{props.interfaceName && (
				<Typography.Headline ariaLevel={3} level={3} divider>
					{props.interfaceName}
				</Typography.Headline>
			)}
			{typedocData.typeAliases.length > 0 && (
				<div className="-u-margin-b-md">
					<Typography.Headline ariaLevel={4} level={4}>
						Types
					</Typography.Headline>
					<BulletList.Unordered>
						{typedocData.typeAliases.map((data, index) => {
							return (
								<StyledBulletListItem key={`${data.name}-${index}`} className="-u-margin-b-xs">
									<code>
										{data.name +
											(data.declaration?.type !== NOT_IMPLEMENTED ? "<" + data.declaration?.type + "> " : "") +
											" = " +
											data.declaration?.params}
									</code>
								</StyledBulletListItem>
							);
						})}
					</BulletList.Unordered>
				</div>
			)}
			{typedocData.interfaces.map((data, index) => {
				return (
					<div key={`${data.name}-${index}`} className="-u-margin-b-md">
						<Typography.Headline ariaLevel={4} level={4}>
							{data.name}
						</Typography.Headline>
						<APITable data={data} />
					</div>
				);
			})}
		</div>
	);
}

const NOT_IMPLEMENTED = "Not implemented";
const UNKNOWN_TYPE = "Unknown type";

class Declaration {
	constructor(public declaration: JSONOutput.DeclarationReflection) {}

	getName(): ReactNode {
		return (
			<>
				{this.declaration.name}
				{this.isRequired() ? <strong>*</strong> : ""}
			</>
		);
	}

	private convertHtmlStr(htmlStr?: string): string {
		return (
			htmlStr
				?.replace(/\{@link ((?!http).+?)\}/g, "`$1`")
				.replace(/\{@link http(.+?)\}/g, "http$1")
				.replace(/\*(.+?)\*+/g, "**$1**") ?? ""
		);
	}

	private concatPlainDescription(summary?: JSONOutput.CommentDisplayPart[]): string | undefined {
		if (!summary) {
			return undefined;
		}

		let description = "";
		summary.forEach((val) => {
			const text =
				val.text.startsWith("```ts") && val.text.endsWith("```")
					? val.text.split("```ts\n")[1]?.split("\n```")[0]
					: val.text;

			switch (val.kind) {
				case "inline-tag":
					description += ` {@link ${text}}`;
					break;
				default:
					description += ` ${text}`;
					break;
			}
		});

		return description.trim();
	}

	getDescription(): ReactNode {
		let description: string | undefined;

		if (this.declaration.comment?.summary) {
			description = this.concatPlainDescription(this.declaration.comment.summary);
		} else if (this.declaration.kind === ReflectionKind.Method) {
			description = this.concatPlainDescription(this.declaration.signatures?.[0].comment?.summary);
		} else if (this.declaration.type?.type === "reflection") {
			description = this.concatPlainDescription(this.declaration.type.declaration?.signatures?.[0].comment?.summary);
		} else if (this.declaration.inheritedFrom) {
			description = `Inherited from {@link ${this.declaration.inheritedFrom.name}}`;
		}

		let content: ReactNode;

		if (description) {
			content = <ContentMarkdown source={this.convertHtmlStr(description)} />;
		}

		const blockTags = [
			...(this.declaration.comment?.blockTags ?? this.declaration.signatures?.[0]?.comment?.blockTags ?? []),
			...(this.declaration?.signatures?.[0]?.parameters?.flatMap((param) => {
				return param.comment?.summary?.length
					? [{ tag: "@param", name: param.name, content: param.comment.summary }]
					: [];
			}) ?? [])
		];

		const tags = blockTags.flatMap((blockTag, blockTagIndex) => {
			if (blockTag.tag === "@see") {
				return this.concatPlainDescription(blockTag.content)
					?.split("\n")
					.flatMap((line, lineIndex) => {
						const link = line.match(/@link ([^}]*)/)?.[1]?.trim();
						const title = line.match(/\[(.*?)\]/)?.[1]?.trim() || link;

						return link || title ? (
							<ContentMarkdown key={`see-${blockTagIndex}-${lineIndex}`} source={`See [${title}](${link})`} />
						) : (
							[]
						);
					});
			}

			const markdownContent = this.convertHtmlStr(this.concatPlainDescription(blockTag.content));

			return (
				markdownContent && (
					<ContentMarkdown
						key={blockTagIndex}
						source={`**${blockTag.tag}**`.concat(blockTag.name ? ` ${blockTag.name} ` : " ", markdownContent)}
					/>
				)
			);
		});

		const hasTags = tags.length > 0;

		return (
			(content || hasTags) && (
				<div>
					{content}
					{hasTags && <div className={content ? "-u-margin-t-xs" : undefined}>{tags}</div>}
				</div>
			)
		);
	}

	isRequired(): boolean {
		return !this.declaration.flags.isOptional && !this.declaration.inheritedFrom;
	}

	isDeprecated(): boolean {
		return !!this.declaration.comment?.blockTags?.find((tag) => tag.tag === "@deprecated");
	}

	getType(): string {
		if (this.declaration.type) {
			return Declaration.resolveType(this.declaration.type);
		}

		if (this.declaration.signatures) {
			return Declaration.resolveSignature(this.declaration.signatures?.[0]);
		}

		return NOT_IMPLEMENTED;
	}

	getTypeAlias(): { type: string; params?: string } {
		const result = Declaration.resolveTypeAlias(this.declaration);

		let resolvedParams: string | undefined = undefined;

		switch (this.declaration.type?.type) {
			case "reflection": {
				if (this.declaration.type?.declaration?.signatures) {
					resolvedParams = Declaration.resolveSignature(this.declaration.type.declaration.signatures?.[0]);
				} else if (this.declaration.type?.declaration?.children) {
					resolvedParams = Declaration.resolveReflection(this.declaration.type?.declaration?.children);
				}

				break;
			}

			case "union":
			case "reference":
			case "intersection":
			case "literal":
			case "intrinsic": {
				resolvedParams = Declaration.resolveType(this.declaration.type);
				break;
			}

			case "array": {
				if (this.declaration.type.elementType.type === "reflection") {
					resolvedParams = Declaration.resolveReflection(this.declaration.type.elementType.declaration);
				}

				break;
			}

			default:
				resolvedParams = undefined;
		}

		return {
			type: result.type ?? NOT_IMPLEMENTED,
			params: resolvedParams
		};
	}

	static resolveType(type: JSONOutput.DeclarationReflection["type"]): string {
		if (!type) {
			return UNKNOWN_TYPE;
		}

		switch (type.type) {
			case "unknown":
			case "intrinsic":
				return type.name;
			case "union":
				return type.types
					.map((subType) => {
						const resolvedType = Declaration.resolveType(subType);

						return subType.type === "literal" ? `"${resolvedType}"` : resolvedType;
					})
					.join(" | ");
			case "literal":
				return String(type.value);
			case "array":
				return `${Declaration.resolveType(type.elementType)}[]`;
			case "reference": {
				const typeArgs = type.typeArguments?.map(Declaration.resolveType).join(", ");
				const name = type.name ?? type.qualifiedName;

				return !name ? UNKNOWN_TYPE : name + (typeArgs ? `<${typeArgs}>` : "");
			}

			case "reflection":
				return Declaration.resolveReflection(type.declaration);
			case "intersection":
				return type.types.map(Declaration.resolveType).join(" & ");
			case "typeOperator":
				return Declaration.resolveTypeOperator(type);
			default:
				return NOT_IMPLEMENTED;
		}
	}

	static resolveSignature(signature: JSONOutput.SignatureReflection): string {
		const params =
			signature.parameters?.map((param) => {
				return `${param.name}${param.flags.isOptional ? "?" : ""}: ${Declaration.resolveType(param.type)}`;
			}) ?? [];
		const returnType = Declaration.resolveType(signature.type);

		return params.length > 0 ? `(${params.join(", ")}) => ${returnType}` : returnType;
	}

	static resolveReflection(
		reflection: JSONOutput.DeclarationReflection | JSONOutput.DeclarationReflection[] | undefined
	): string {
		if (!reflection) {
			return NOT_IMPLEMENTED;
		}

		if (Array.isArray(reflection) && reflection.length > 0) {
			return `{ ${reflection?.map((e) => this.resolveReflection(e)).join(", ")} }`;
		}

		if (!Array.isArray(reflection)) {
			if (reflection.kind === ReflectionKind.TypeLiteral) {
				if (reflection.signatures?.length === 1) {
					const signature = reflection.signatures[0];

					if (signature.kind === ReflectionKind.CallSignature) {
						if (signature.parameters) {
							const params = signature.parameters?.[0];

							if (params.type?.type === "union" && params.type?.types[1].type === "reference") {
								const type =
									typeof params.type.types[1].target !== "number"
										? params.type.types[1].target.qualifiedName
										: undefined;

								return `React.RefCallback<${type}>`;
							}

							if (params.kind === ReflectionKind.Parameter) {
								return this.resolveType(params.type);
							}
						} else if (signature.type?.type === "intrinsic") {
							return this.resolveType(signature.type);
						}
					}
				}

				if (reflection.indexSignatures) {
					const indexSignature = reflection.indexSignatures[0];
					const params = indexSignature.parameters
						?.map((param) => {
							const paramType = this.resolveType(param.type);

							return paramType === UNKNOWN_TYPE || paramType === NOT_IMPLEMENTED
								? NOT_IMPLEMENTED
								: `${param.name}: ${paramType}`;
						})
						.join(", ");
					const signatureType = this.resolveType(indexSignature.type);

					return signatureType === UNKNOWN_TYPE || signatureType === NOT_IMPLEMENTED
						? NOT_IMPLEMENTED
						: `{ [${params}]: ${signatureType} }`;
				}
			}

			if (reflection.kind === ReflectionKind.TypeLiteral && reflection.children) {
				return `{ ${reflection.children?.map((e) => this.resolveReflection(e)).join(", ")} }`;
			}

			if (reflection.kind === ReflectionKind.Property) {
				return `${reflection.name}: ${this.resolveType(reflection.type)}`;
			}

			if (reflection.kind === ReflectionKind.Method && reflection.signatures) {
				return `${reflection.name}: ${this.resolveSignature(reflection.signatures[0])}`;
			}
		}

		return NOT_IMPLEMENTED;
	}

	static resolveTypeAlias(reflection: JSONOutput.DeclarationReflection | undefined): { type: string; params?: string } {
		if (!reflection) {
			return {
				type: NOT_IMPLEMENTED
			};
		}

		const result: { type: string; params?: string } = { type: NOT_IMPLEMENTED };

		if (reflection.typeParameters) {
			result.type = reflection.typeParameters
				?.map((param) => param.name + (param.type ? ` extends ${this.resolveType(param.type)}` : ""))
				.join(", ");
		}

		if (reflection.type) {
			result.params = this.resolveType(reflection.type);
		}

		return result;
	}

	static resolveTypeOperator(operatorType: JSONOutput.TypeOperatorType): string {
		switch (operatorType.operator) {
			case "keyof":
				return operatorType.target.type === "reference"
					? `${operatorType.operator} ${operatorType.target.name}`
					: UNKNOWN_TYPE;
			case "readonly":
				return operatorType.target.type === "array"
					? `ReadonlyArray<${this.resolveType(operatorType.target.elementType)}>`
					: UNKNOWN_TYPE;
			default:
				return NOT_IMPLEMENTED;
		}
	}
}
