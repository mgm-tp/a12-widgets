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

import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";
import DefaultFileUploadAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/file-upload/main/default/default-file-upload.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { Combination } from "./combination.js";
import { CustomSize } from "./custom-size.js";
import { Basic } from "./default.js";
import { States } from "./states.js";
import { FileNameBasic } from "./file-name/basic.js";
import { FileNameCombination } from "./file-name/combination.js";
import { FileNameStates } from "./file-name/states.js";
import { PlaceHolderIcon } from "./placeholder-icon.js";
import { InteractiveReadOnly } from "./interactive-read-only.js";
import { CustomTextFileUploadShowcase } from "./custom-text.js";
import { HiddenLabelAndTexts } from "./hidden-label-and-texts.js";

import combinationCode from "!./combination.tsx?raw";
import customSizeCode from "!./custom-size.tsx?raw";
import basicCode from "!./default.tsx?raw";
import statesCode from "!./states.tsx?raw";
import fileNameBasicCode from "!./file-name/basic.tsx?raw";
import fileNameCombinationCode from "!./file-name/combination.tsx?raw";
import fileNameStatesCode from "!./file-name/states.tsx?raw";
import placeHolderIconCode from "!./placeholder-icon.tsx?raw";
import fileNameBaseTemplateCode from "!./file-name/base-template.tsx?raw";
import interactiveReadOnlyCode from "!./interactive-read-only.tsx?raw";
import customTextFileUploadShowcaseCode from "!./custom-text?raw";
import hiddenLabelAndTextsCode from "!./hidden-label-and-texts.js?raw";

const showcases: Showcase[] = [
	{
		label: "File Upload",
		description: (
			<p>
				The <strong>File Upload</strong> Widget is the input component that allows users to upload file(s) by choosing
				from the picker or dragging file(s) from the library into the upload input.
			</p>
		),
		sections: {
			basic: {
				label: "Default",
				sections: [
					{
						label: "Basic",
						content: <Basic />,
						description: {
							info: (
								<>
									<p>
										By default, the <strong>DefaultFileUpload</strong> fits the parent that contains it. However, if the{" "}
										<code>uploadAreaSize</code> property is used to give a specific size, the{" "}
										<strong>DefaultFileUpload</strong> will prioritize the new size.
									</p>
									<p>
										If a file has not yet been uploaded, a default placeholder icon will be shown. It can be a different
										icon corresponding to the different file type. If you don't want to have it, set the{" "}
										<code>placeholderIcon</code> to <code>none</code>. Visit the{" "}
										<Link href="#/widgets/data-entry/file-upload#placeholder-icon">Placeholder Icon</Link> to see more
										different icons and acceptable file types as well.
									</p>
									<p>
										In this example, we set the <code>multiple</code> property to <code>true</code> that allows the user
										to select multiple files.
									</p>
								</>
							),
							note: (
								<p>
									To fully support accessibility, the <strong>File Upload</strong> should have its own <code>id</code>.
									It will be used for creating <strong>id</strong> for the additional elements such as label, error
									message, warning message, and info message. Those ids will also be linked to the{" "}
									<strong>aria-labelledby</strong> attribute. Besides, you can link external ids such as the ids of the
									tooltips by using the <code>ariaLabelledby</code> property.
								</p>
							)
						},
						code: { name: "default.tsx", code: basicCode }
					},
					{
						label: "Custom Text",
						content: <CustomTextFileUploadShowcase />,
						description: {
							info: (
								<p>
									You can customize the file upload text by using the <code>label</code>, <code>title</code>,{" "}
									<code>descriptionText</code>, and <code>buttonText</code> (on desktop) or{" "}
									<code>mobileButtonText</code> (on tablet and mobile) properties.
								</p>
							),
							note: (
								<p>
									The <code>title</code> attribute provides a tooltip on hover and is read by screen readers when the
									file upload is focused. By default, it's set to <strong>Upload file</strong> or{" "}
									<strong>Dokument hochladen</strong>. To hide it and remove both the tooltip and screen reader text,
									assign it an empty string. This is recommended only if the <code>descriptionText</code> or{" "}
									<code>buttonText</code> clearly conveys the file upload functionality.
								</p>
							)
						},
						code: { code: customTextFileUploadShowcaseCode }
					},
					{
						label: "Hidden Label, Description and Button Text",
						content: <HiddenLabelAndTexts />,
						description: (
							<p>
								The recommended way to hide the label, description text and button text while still supporting{" "}
								accessibility is to pass the <code>label</code>, <code>descriptionText</code>, <code>buttonText</code>{" "}
								values and set <code>hideLabel</code>, <code>hideDescriptionText</code>, <code>hideButtonText</code> to{" "}
								<strong>true</strong>.
							</p>
						),
						code: { code: hiddenLabelAndTextsCode }
					},
					{
						label: "Custom Size",
						description: (
							<p>
								Use the <code>uploadAreaSize</code> property to adjust <strong>the size of the upload area</strong>{" "}
								which is rounded by a border.
							</p>
						),
						content: <CustomSize />,
						useConfiguration: true,
						code: { name: "custom-size.tsx", code: customSizeCode },
						toggleBetweenPartialAndFullCode: true
					},
					{
						label: "Placeholder Icon",
						content: <PlaceHolderIcon />,
						description: (
							<>
								<p>
									The <code>placeholderIcon</code> property can be used to display an icon when the file has not yet
									been uploaded.
								</p>
								<p>
									You can also set the title for the placeholder icon by using the <code>placeholderIconTitle</code>{" "}
									property for better accessibility.
								</p>
								<p>
									To show the icon in preview mode, set the <code>showPlaceholderIconAsPreview</code> property to{" "}
									<code>true</code>.
								</p>
							</>
						),
						useConfiguration: true,
						code: { name: "placeholder-icon.tsx", code: placeHolderIconCode },
						toggleBetweenPartialAndFullCode: true
					},
					{
						label: "States",
						content: <States />,
						description: (
							<>
								<p>
									Besides the default state, the <strong>File Upload</strong> can also be <code>readonly</code> or{" "}
									<code>disabled</code>.
								</p>
								<p>
									In addition, the <code>infoMessage</code>, <code>warningMessage</code> and <code>errorMessage</code>{" "}
									properties can be used to display different messages (one or multiple messages can be shown at once).
									Using any of these three properties will also modify the state of the <strong>File Upload</strong> to
									either <code>info</code>, <code>warning</code>, or <code>error</code>.
								</p>
							</>
						),
						code: { name: "states.tsx", code: statesCode }
					},
					{
						label: "Interactive Read Only",
						content: <InteractiveReadOnly />,
						description: (
							<>
								<p>This demonstration shows you how to download a file from a readOnly file upload.</p>
								<p>
									When the <strong>File Upload</strong> is set to <code>readOnly</code>, the download feature is still
									accessible. This means:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>It is reachable via the Tab key and can receive focus.</BulletList.Item>
									<BulletList.Item>
										The <code>aria-disabled</code> attribute is set to <strong>false</strong>.
									</BulletList.Item>
									<BulletList.Item>
										Screen readers can detect the button as a functional interactive element, ensuring users are aware
										of its existence and can download files using it.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									To enable downloads in <strong>readOnly</strong> mode, you need to use the{" "}
									<strong>onUploadAreaClick</strong> handler.
								</p>
								<p>
									For the full functionality of File Upload, visit{" "}
									<Link href="#/widgets/data-entry/file-upload/default#combination">Combination</Link>.
								</p>
							</>
						),
						code: { name: "interactive-read-only.tsx", code: interactiveReadOnlyCode }
					},
					{
						label: "Combination",
						content: <Combination />,
						description: (
							<>
								<p>
									This demonstration shows you how to combine multiple functionalities and simulate an uploading
									process. This file upload only accepts images and will show a dummy image after uploading.
								</p>
								<p>
									While the upload is processing, the loading state can be shown by setting the <code>loading</code>{" "}
									property to <code>true</code>. To cancel the upload process, provide an <code>onCancel</code> event.
								</p>
								<p>
									When the process is finished, the <code>actionItem</code> property can be used to display additional
									actions for the user to take such as replacing, deleting or removing the uploaded file. Usually we use
									the <Link href="#/widgets/general/popup-menu">Popup Menu</Link> to group multiple actions for a better
									user experience.
								</p>
							</>
						),
						code: { name: "combination.tsx", code: combinationCode }
					}
				]
			},
			advanced: {
				label: "Compact",
				sections: [
					{
						label: "Basic",
						content: <FileNameBasic />,
						description: {
							info: (
								<div>
									<p>
										The <strong>File Name</strong> is an optimized version of the <strong>File Upload</strong> that
										should be used for the document type so that lots of space can be saved.
									</p>
									<p>
										Before uploading, the <strong>File Upload</strong> will be displayed with smaller size. After
										uploading, the chosen file will be displayed as a link. The action button will also be placed next
										to the file name area.
									</p>
									<p>
										To utilize this feature, use the <code>compact</code> and <code>fileOptions</code> properties.
									</p>
									<BulletList.Unordered>
										<BulletList.Item>
											<code>compact</code>: displays the normal file upload before uploading but with smaller height.
											The action item and tooltips are also placed next to the input.
										</BulletList.Item>
										<BulletList.Item>
											<code>fileOptions</code>: returns a type of <code>DefaultFileUploadProps.FileOptions</code> which
											contains:
											<BulletList.Unordered type="circle">
												<BulletList.Item>
													<strong>name</strong>: Label of the link.
												</BulletList.Item>
												<BulletList.Item>
													<strong>icon</strong>: An icon is placed in front of the name.
												</BulletList.Item>
												<BulletList.Item>
													<strong>linkProps</strong>: Properties of link such as title, event handlers,...
												</BulletList.Item>
												<BulletList.Item>
													<strong>textOnlyDisplay</strong>: Whether the link should be placed inside the{" "}
													<code>TextOutput</code> and if it should be truncated or not. It should be used with the{" "}
													<code>readonly</code> file upload.
												</BulletList.Item>
											</BulletList.Unordered>
										</BulletList.Item>
									</BulletList.Unordered>
									<p>
										The functionality of the link and the wrapper itself would be provided by users via properties{" "}
										<code>onClick</code> of the <code>fileOptions.linkProps</code> and <code>onUploadAreaClick</code> of
										the FileUpload.
									</p>
									<p>
										Other behaviors such as loading, info, warning, error, readonly and disabled remain the same as the{" "}
										<code>DefaultFileUpload</code>.
									</p>
								</div>
							),
							note: (
								<>
									The area that surrounds the link can be clicked and should have the same functionality of the link but
									without keyboard events. Only the link would get focus on TAB and also have keyboard events like
									ENTER.
								</>
							)
						},
						code: [
							{ name: "file-name/basic.tsx", code: fileNameBasicCode },
							{ name: "file-name/base-template.tsx", code: fileNameBaseTemplateCode }
						]
					},
					{
						label: "States",
						description: (
							<>
								<p>
									Besides the default state, the <strong>File Upload</strong> in compact mode also has the same variants
									as the <strong>DefaultFileUpload</strong>.
								</p>
								<p>
									The <strong>File Name</strong> also provides a property called <code>textOnlyDisplay</code> that
									combines with <code>readOnly</code> to display the link only after uploading. That link will be placed
									inside the <code>TextOutput</code> widget and the full text will be shown. In the case no file has
									been uploaded yet, you can set <code>showAsLink</code> to <code>false</code> to just display the plain
									element which is defined by the <code>name</code> property instead of a link.
								</p>
							</>
						),
						content: <FileNameStates />,
						code: [
							{ name: "file-name/states.tsx", code: fileNameStatesCode },
							{ name: "file-name/base-template.tsx", code: fileNameBaseTemplateCode }
						]
					},
					{
						label: "Combination",
						content: <FileNameCombination />,
						description: (
							<>
								<p>
									This example is a combination of some other features of the file upload and shows how to deal with an
									upload process with upload, replace and delete functionalities provided.
								</p>
								<p>
									The <code>onUploadAreaClick</code> event will be triggered when the upload area is clicked. You can
									return <code>false</code> within the event to prevent the dialog from opening.
								</p>
								<p>
									While the upload is processing, the loading state can be shown by setting the <code>loading</code>{" "}
									property to <code>true</code>. To show the label of the loading state, use the{" "}
									<code>loadingLabel</code> property. To cancel the process, provide an <code>onCancel</code> event.
								</p>
							</>
						),
						code: { name: "file-name/combination.tsx", code: fileNameCombinationCode }
					}
				]
			}
		}
	}
];

export default {
	label: "File Upload",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: DefaultFileUploadAPI }],
		themingConfiguration: "fileUpload"
	}
};
