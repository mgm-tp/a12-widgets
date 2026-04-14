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

import { BulletList, MessageBox, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import {
	StyledShowcaseBulletListInMessageBox,
	StyledShowcaseExternalLinkInMessageBox
} from "../../helpers/showcase-styles.js";

import { AlignContentUtilClassShowcase } from "./align-content.js";
import { AlignItemsUtilClassShowcase } from "./align-items.js";
import { AlignSelfUtilClassShowcase } from "./align-self.js";
import { BackgroundUtilClassShowcase } from "./background.js";
import { BorderUtilClassShowcase } from "./border.js";
import { DisplayUtilClassShowcase } from "./display.js";
import { FlexDirectionUtilClassShowcase } from "./flex-direction.js";
import { FlexWrapUtilClassShowcase } from "./flex-wrap.js";
import { FloatUtilClassShowcase } from "./float.js";
import { FontsUtilClassShowcase } from "./fonts.js";
import { FlexGrowAndShrinkUtilClassShowcase } from "./flex-grow-and-shrink.js";
import { HeightsUtilClassShowcase } from "./heights.js";
import { HyphensUtilClassShowcase } from "./hyphens.js";
import { JustifyContentUtilClassShowcase } from "./justify-content.js";
import { LineHeightUtilClassShowcase } from "./line-height.js";
import { ListUtilClassShowcase } from "./list.js";
import { MarginUtilClassShowcase } from "./margin.js";
import { OutlineUtilClassShowcase } from "./outline.js";
import { OverflowUtilClassShowcase } from "./overflow.js";
import { PaddingUtilClassShowcase } from "./padding.js";
import { PositionUtilClassShowcase } from "./position.js";
import { TextUtilClassShowcase } from "./text.js";
import { UserSelectUtilClassShowcase } from "./user-select.js";
import { UnseenButReadUtilClassShowcase } from "./unseen-but-read.js";
import { VerticalAlignUtilClassShowcase } from "./vertical-align.js";
import { VisibilityUtilClassShowcase } from "./visibility.js";
import { WhiteSpaceUtilClassShowcase } from "./white-space.js";
import { WidthsUtilClassShowcase } from "./widths.js";
import { WordBreakUtilClassShowcase } from "./word-break.js";

const showcases: Showcase[] = [
	{
		label: "Utility Classes",
		description: (
			<>
				<p>
					<strong>Utility Classes</strong> can be used by developers who would like to quickly put components together
					or reduce the effort needed to apply customizations for specific situations.
				</p>
				<MessageBox label={<strong>NOTE</strong>} variant="warning">
					<div>
						CSS properties defined inline are given priority over those defined via Utility Classes. Also note that
						these Utility Classes should be wrapped inside of <code>addPrefix()</code> to ensure they work even if your
						project's CSS prefix changes.
					</div>
				</MessageBox>
			</>
		),
		sections: [
			{
				label: "Align Content",
				content: <AlignContentUtilClassShowcase />,
				description: {
					info: (
						<>
							<p>
								<strong>Align Content</strong> Utility Classes can help you to sets the distribution of space between
								and around content items along a cross axis, similar to <code>justify-content</code>.
							</p>
							<p>
								Widgets provides the following classes related to the <strong>Align Content</strong> aspect:
							</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<code>-u-content-start</code>: Pack items from the start of the container.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-content-end</code>: Pack items from the end of the container.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-content-center</code>: Pack items around the center of the container.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-content-between</code>: Distributes the lines in an evenly spaced fashion with the first line
									being at the start of the container and the last line being at the end.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-content-around</code>: Distributes the lines with equal space between each of them.
								</BulletList.Item>
							</BulletList.Unordered>
						</>
					),
					note: (
						<p>
							All of the <strong>Align Content</strong> utility classes can only be applied to components that have a{" "}
							<strong>flex</strong> property. These utility classes will not have any effect when the flexbox layout has
							only a single line.
						</p>
					)
				},
				useConfiguration: true
			},
			{
				label: "Align Items",
				content: <AlignItemsUtilClassShowcase />,
				description: {
					info: (
						<>
							<p>
								<strong>Align Items</strong> Utility Classes can help you to control the alignment of items on the Cross
								Axis.
							</p>
							<p>
								Widgets provides the following classes related to the <strong>Align Items</strong> aspect:
							</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<code>-u-items-start</code>: The items are packed flush to each other toward the start edge of the
									alignment container in the appropriate axis.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-items-end</code>: The items are packed flush to each other toward the end edge of the
									alignment container in the appropriate axis.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-items-center</code>: The flex items' margin boxes are centered within the line on the
									cross-axis. If the cross-size of an item is larger than the flex container, it will overflow equally
									in both directions.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-items-baseline</code>: The item with the largest distance between its cross-start margin edge
									and its baseline is flushed with the cross-start edge of the line.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-items-stretch</code>: Flex items are stretched such that the cross-size of the item's margin
									box is the same as the line while respecting width and height constraints.
								</BulletList.Item>
							</BulletList.Unordered>
						</>
					),
					note: (
						<p>
							All of the <strong>Align Items</strong> utility classes can only be applied to components that have a{" "}
							<strong>flex</strong> property. These utility classes will not have any effect when the flexbox layout has
							only a single line.
						</p>
					)
				},
				useConfiguration: true
			},
			{
				label: "Align Self",
				content: <AlignSelfUtilClassShowcase />,
				description: {
					info: (
						<>
							<p>
								<strong>Align Self</strong> Utility Classes can help you to overrides the flex item's{" "}
								<strong>align-items</strong> value.
							</p>
							<p>
								Widgets provides the following classes related to the <strong>Align Self</strong> aspect:
							</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<code>-u-self-start</code>: Aligns the items to be flush with the edge of the alignment container
									corresponding to the item's start side in the cross axis.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-self-end</code>: Aligns the items to be flush with the edge of the alignment container
									corresponding to the item's end side in the cross axis.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-self-center</code>: The flex item's margin box is centered within the line on the cross-axis.
									If the cross-size of the item is larger than the flex container, it will overflow equally in both
									directions.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-self-baseline</code>: The item with the largest distance between its cross-start margin edge
									and its baseline is flushed with the cross-start edge of the line.
								</BulletList.Item>
								<BulletList.Item>
									<code>-u-self-stretch</code>: If the combined size of the items along the cross axis is less than the
									size of the alignment container and the item is auto-sized, its size is increased equally (not
									proportionally), while still respecting the constraints imposed by max-height/max-width (or equivalent
									functionality), so that the combined size of all auto-sized items exactly fills the alignment
									container along the cross axis.
								</BulletList.Item>
							</BulletList.Unordered>
						</>
					),
					note: (
						<p>
							All of the <strong>Align Self</strong> utility classes can only be applied to components that have a{" "}
							<strong>flex</strong> property. These utility classes will not have any effect when the flexbox layout has
							only a single line.
						</p>
					)
				},
				useConfiguration: true
			},
			{
				label: "Backgrounds",
				content: <BackgroundUtilClassShowcase />,
				description: (
					<p>
						<strong>Background</strong> Utility Classes cover the <strong>background-attachment</strong>,{" "}
						<strong>background-color</strong>, <strong>background-position</strong>, <strong>background-repeat</strong>{" "}
						and <strong>background-size</strong> aspects. You can use the following example to try the different{" "}
						<strong>Background</strong> Classes provided by Widgets.
					</p>
				),
				useConfiguration: true
			},
			{
				label: "Border",
				content: <BorderUtilClassShowcase />,
				description: (
					<p>
						<strong>Border</strong> Utility Classes cover the <strong>border-color</strong>,{" "}
						<strong>border-style</strong>, <strong>border-radius</strong> and <strong>border-width</strong> aspects. You
						can use the following example to try the different <strong>Border</strong> Classes provided by Widgets.
					</p>
				),
				useConfiguration: true
			},
			{
				label: "Display",
				content: <DisplayUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Display</strong> Utility Classes are classes for setting an element's display type, which
							includes:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-block</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-inline-block</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-inline</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-table</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-table-row</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-table-cell</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-hidden</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-inline-flex</code>
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Flex Direction",
				content: <FlexDirectionUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Flex Direction</strong> Utility Classes allow you to establishe the main-axis, thus defining the
							direction flex items are placed in the flex container, which includes:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-flex-row</code>: Defines the container's main-axis to be the same as the text direction.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-row-reverse</code>: Defines the container's main-axis opposite the text direction.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-col</code>: defines the container's main-axis same as is the same as the block-axis. The
								main-start and main-end points are the same as the content direction.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-col-reverse</code>: behaves the same way as the <code>-u-flex-col</code> but the
								main-start and main-end points are opposite to the content direction.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Flex Grow and Flex Shrink",
				content: <FlexGrowAndShrinkUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Flex Grow</strong> and <strong>Flex Shrink</strong> Utility Classes allow you to set the flex grow
							and shrink factor of a flex item's main size, which includes:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-flex-1</code>: Makes the item flexible and receive the specified proportion of the remaining
								space.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-auto</code>: Applies the <code>flex: 1 1 auto</code> style. It sizes the item according to
								its width and height properties while still remaining flexible.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-initial</code>: Applies the <code>flex: 0 1 auto</code> style. It sizes the items
								according to its width and height, but does not grow to absorb any extra free space in the flex
								container.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-none</code>: Applies the <code>flex: 0 1 auto</code> style. It sizes the items according
								to its width and height, but does not allow items to grow or shrink.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-grow</code>: Allows the flex items to grow to fill any available space.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-no-grow</code>: Prevents the flex items from growing.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-shrink</code>: Allows the flex items to shrink if needed.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-no-shrink</code>: Prevents the flex items from shrinking.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Flex Wrap",
				content: <FlexWrapUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Flex Wrap</strong> Utility Classes allow you to define whether flex items are forced onto one line
							or can wrap onto multiple lines, which includes:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-flex-no-wrap</code>: Forces the flex items into one line which may cause the container to
								overflow.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-wrap</code>: Allows the flex items to break across multiple lines. The direction is
								defined by the <strong>flex-direction</strong> value.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-flex-wrap-reverse</code>: Allows the flex items to break across multiple lines. The direction
								of the items being wrapped will be the opposite of the direction defined by the{" "}
								<strong>flex-direction</strong> value.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Float",
				content: <FloatUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Float</strong> Utility Classes are classes for positioning and formatting content, e.g. floating
							an image to the left of the text in a container, which includes:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-float-right</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-float-left</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-float-none</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-clearfix</code>: No floating elements allowed on either side of the container.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Fonts",
				content: <FontsUtilClassShowcase />,
				description: (
					<p>
						<strong>Font</strong> Utility Classes cover the <strong>font-size</strong> and <strong>font-weight</strong>{" "}
						aspects. You can use the following example to try the different <strong>Font</strong> Classes provided by
						Widgets.
					</p>
				),
				useConfiguration: true
			},
			{
				label: "Heights",
				content: <HeightsUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Height</strong> Utility Classes cover the <strong>height</strong>, <strong>max-height</strong> and{" "}
							<strong>min-height</strong> aspects:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<strong>height</strong>:
								<BulletList.Unordered>
									<BulletList.Item>
										<code>-u-height-auto</code>: Allows the browser to determine the height for the specified element.
									</BulletList.Item>
									<BulletList.Item>
										<code>-u-height-full</code>: Allows the specified element to have 100% height of its parent, as long
										as the parent has a defined height.
									</BulletList.Item>
									<BulletList.Item>
										<code>-u-height-screen</code>: Allows the specified element to span the entire height of the
										viewport.
									</BulletList.Item>
									<BulletList.Item>
										<code>{`-u-height-{number}`}</code>: The specified element's height is calculated with the formula:{" "}
										<code>height = (number / 4)rem</code> viewport. <br /> You can also use the{" "}
										<code>-u-height-px</code> utility class to set the height to 1px.
									</BulletList.Item>
								</BulletList.Unordered>
							</BulletList.Item>
							<BulletList.Item>
								<strong>max-height</strong>:
								<BulletList.Unordered>
									<BulletList.Item>
										<code>-u-max-height-full</code>: Applies the <code>max-height: 100%</code> style to the specified
										element.
									</BulletList.Item>
									<BulletList.Item>
										<code>-u-max-height-screen</code>: Applies the <code>max-height: 100vh</code> style to the specified
										element.
									</BulletList.Item>
								</BulletList.Unordered>
							</BulletList.Item>
							<BulletList.Item>
								<strong>min-height</strong>:
								<BulletList.Unordered>
									<BulletList.Item>
										<code>-u-min-height-0</code>: Applies the <code>min-height: 0px</code> style to the specified
										element.
									</BulletList.Item>
									<BulletList.Item>
										<code>-u-min-height-full</code>: Applies the <code>min-height: 100%</code> style to the specified
										element.
									</BulletList.Item>
									<BulletList.Item>
										<code>-u-min-height-screen</code>: Applies the <code>min-height: 100vh</code> style to the specified
										element.
									</BulletList.Item>
								</BulletList.Unordered>
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							You can use the following example to try the different <strong>Height</strong> Classes that Widgets is
							currently provide.
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Hyphens",
				content: <HyphensUtilClassShowcase />,
				description: {
					info: (
						<p>
							The <strong>Hyphens</strong> Utility Class helps to hyphenates long words that wrap across multiple lines.
						</p>
					),
					note: (
						<StyledShowcaseBulletListInMessageBox>
							<BulletList.Item>
								The{" "}
								<code>
									<strong>-u-hyphens</strong>
								</code>{" "}
								currently supports for most modern browsers, including Chrome, Edge, Firefox, and Safari.
							</BulletList.Item>
							<BulletList.Item>
								German is fully supported. To enable proper syllable breaks according to German hyphenation rules, set
								the language attribute{" "}
								<code>
									<strong>lang="de"</strong>
								</code>{" "}
								in your HTML elements.
							</BulletList.Item>
							<BulletList.Item>
								For detailed compatibility information, check out the{" "}
								<StyledShowcaseExternalLinkInMessageBox href="https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens">
									hyphens documentation
								</StyledShowcaseExternalLinkInMessageBox>
								.
							</BulletList.Item>
						</StyledShowcaseBulletListInMessageBox>
					)
				},
				useConfiguration: true
			},
			{
				label: "Justify Content",
				content: <JustifyContentUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Justify Content</strong> Utility Classes allow you to define how the browser distributes space
							between and around content items along the main-axis of a flex container, which includes:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-justify-start</code>: The items are packed flush to each other toward{" "}
								<strong>the start edge</strong> of the alignment container in the main axis.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-justify-end</code>: The items are packed flush to each other toward{" "}
								<strong>the end edge</strong> of the alignment container in the main axis.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-justify-center</code>: The items are packed flush to each other toward{" "}
								<strong>the center</strong> of the alignment container along the main axis.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-justify-between</code>: The first item is flush with the main-start edge, and the last item is
								flush with the main-end edge.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-justify-around</code>: The empty space before the first and after the last item equals half of
								the space between each pair of adjacent items.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Line Height",
				content: <LineHeightUtilClassShowcase />,
				description: (
					<>
						<p>
							The <strong>Line Height</strong> Utility Class are built-in classes for setting the height of a line box,
							with four variants:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-leading-none</code>: Applies the <code>line-height: 1</code> style to the specified element.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-leading-tight</code>: Applies the <code>line-height: 1.25</code> style to the specified
								element.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-leading-normal</code>: Applies the <code>line-height: 1.5</code> style to the specified
								element.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-leading-loose</code>: Applies the <code>line-height: 2</code> style to the specified element.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "List",
				content: <ListUtilClassShowcase />,
				description: (
					<p>
						Widgets provides the <code>-u-list-reset</code> utility class to set the <code>list-style: none</code> style
						to the specified element.
					</p>
				),
				useConfiguration: true
			},
			{
				label: "Margin",
				content: <MarginUtilClassShowcase />,
				description: (
					<>
						<p>
							The <strong>Margin</strong> Utility Classes are built-in classes for controlling an element's margin.
						</p>
						<p>
							It's built based on the margin direction and <Link href="#/basics/theme/spacing">spacing</Link> system.
						</p>
						<p>This type of utility class subscribes to the following patterns:</p>
						<BulletList.Unordered>
							<BulletList.Item>
								Positive margin: <code>-u-margin-&#123;direction&#125;-&#123;spacing-value&#125;</code>
							</BulletList.Item>
							<BulletList.Item>
								Negative margin: <code>-u-negative-margin-&#123;direction&#125;-&#123;spacing-value&#125;</code>
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Outline",
				content: <OutlineUtilClassShowcase />,
				description: (
					<p>
						<strong>Outline</strong> Utility Classes cover the <strong>outline-color</strong>,{" "}
						<strong>outline-offset</strong>, <strong>outline-style</strong> and <strong>outline-width</strong> aspects.
						You can use the following example to try the different <strong>Outline</strong> Classes provided by Widgets.
					</p>
				),
				useConfiguration: true
			},
			{
				label: "Overflow",
				content: <OverflowUtilClassShowcase />,
				description: (
					<>
						<p>
							The <strong>Overflow</strong> Utility Classes are built-in classes to specify what should happen if
							content overflows an element's box, they include:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-overflow-auto</code>: If overflow is clipped, a scrollbar will be added.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-overflow-hidden</code>: Content is clipped if necessary to fit the box. No scrollbars are
								provided.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-overflow-visible</code>: Content is not clipped and may be rendered outside the box.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-overflow-scroll</code>: Scrollbars are always displayed whether or not any content is actually
								clipped.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-overflow-x-auto</code>: If overflow is clipped, a horizontal scrollbar will be added.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-overflow-y-auto</code>: If overflow is clipped, a vertical scrollbar will be added.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-overflow-x-scroll</code>: Horizontal scrollbar is always displayed.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-overflow-y-scroll</code>: Vertical scrollbar is always displayed.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							<strong>NOTE:</strong> The following <strong>Overflow</strong> Utility Classes are only available in
							Safari for iOS. The <code>overflow</code> property also needs to be set to <code>scroll</code> for the
							below classes to have any effect.
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>scrolling-touch</code>: Uses momentum-based scrolling, where the content continues to scroll for a
								while after the scroll gesture has finished and the finger has been removed from the touchscreen.
							</BulletList.Item>
							<BulletList.Item>
								<code>scrolling-auto</code>: Uses "regular" scrolling, where the content immediately ceases to scroll
								after you remove your finger from the touchscreen.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Padding",
				content: <PaddingUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Padding</strong> Utility Classes are built-in classes for controlling an element's padding.
						</p>
						<p>
							The classes were built based on the padding direction and{" "}
							<Link href="#/basics/theme/spacing">spacing</Link> system.
						</p>
						<p>
							This type of utility class subscribes to the following pattern:{" "}
							<code>-u-padding-&#123;direction&#125;-&#123;spacing-value&#125;</code>
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Position",
				content: <PositionUtilClassShowcase />,
				description: (
					<>
						<p>
							The <strong>Position</strong> Utility Classes are built-in classes for setting how an element is
							positioned in a document, including:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-static</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-fixed</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-absolute</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-relative</code>
							</BulletList.Item>
						</BulletList.Unordered>
						<p>The following properties specify offsets from the edges of the element's containing block.</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-pin-none</code>: All offsets are <code>auto</code>.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-pin</code>: All offsets are <code>0</code>.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-pin-y</code>: Vertical offsets (top, bottom) are <code>0</code>.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-pin-x</code>: Horizontal offsets (left, right) are <code>0</code>.
							</BulletList.Item>
							<BulletList.Item>
								<code>pin-t</code>: Offset top is <code>0</code>.
							</BulletList.Item>
							<BulletList.Item>
								<code>pin-r</code>: Offset right is <code>0</code>.
							</BulletList.Item>
							<BulletList.Item>
								<code>pin-b</code>: Offset bottom is <code>0</code>.
							</BulletList.Item>
							<BulletList.Item>
								<code>pin-l</code>: Offset left is <code>0</code>.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Text",
				content: <TextUtilClassShowcase />,
				description: (
					<p>
						<strong>Text</strong> Utility Classes cover the <strong>text-align</strong>, <strong>text-color</strong> and{" "}
						<strong>text-style</strong> aspects. You can use the following example to try the different{" "}
						<strong>Text</strong> Classes provided by Widgets.
					</p>
				),
				useConfiguration: true
			},
			{
				label: "User Select",
				content: <UserSelectUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>User Select</strong> Utility Classes can help you to control whether the user can select text.
							They include:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-user-select-none</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-user-select-text</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-user-select-auto</code>
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-user-select-inherit</code>
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Unseen But Read",
				description: (
					<p>
						The <code>-u-unseenButRead</code> Utility Class should be applied in cases when screen readers should read
						the content of the specified element, but said content won't be visible to normal users.
						<br />
						We recommend using the <code>HiddenText</code> component to apply this functionality.
					</p>
				),
				content: <UnseenButReadUtilClassShowcase />,
				useConfiguration: true
			},
			{
				label: "Vertical Align",
				content: <VerticalAlignUtilClassShowcase />,
				description: (
					<>
						<p>
							The <strong>Vertical Align</strong> Utility Classes are built-in classes for controlling the vertical
							alignment of inline, inline-block, and table-cell elements.
						</p>
						<p>
							This type of utility class subscribes to the following pattern: <code>{`-u-align-{alignment}`}</code>
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-align-baseline</code>: The element is aligned with the baseline of the parent. This is the
								default.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-align-top</code>: The element is aligned with the top of the tallest element on the line.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-align-middle</code>: The element is placed in the middle of the parent element.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-align-bottom</code>: The element is aligned with the lowest element on the line.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-align-text-top</code>: The element is aligned with the top of the parent element's font.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-align-text-bottom</code>: The element is aligned with the bottom of the parent element's font.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Visibility",
				content: <VisibilityUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Visibility</strong> Utility classes are built-in classes for controlling the visibility of an
							element, including:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-visible</code>: makes an element visible by applying the <code>visibility: visible</code>{" "}
								style.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-invisible</code>: hides an element's content by applying the <code>visibility: hidden</code>{" "}
								style, but still maintains the container's place in the DOM, thus affecting the layout of other elements
								(whereas{" "}
								<Link href="#/basics/utility-classes/display">
									<code>-u-hidden</code>
								</Link>{" "}
								hides both the content and the container itself).
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "White Space",
				content: <WhiteSpaceUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>White Space</strong> Utility classes are built-in classes for controlling how white space inside
							an element is handled, including:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-whitespace-normal</code>: Causes text to wrap normally within an element. Newlines and spaces
								will be collapsed.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-whitespace-no-wrap</code>: Prevents text from wrapping within an element. Newlines and spaces
								will be collapsed.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-whitespace-no-wrap</code>: Prevents text from wrapping within an element. Newlines and spaces
								will be collapsed.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-whitespace-pre</code>: Preserves newlines and spaces within an element. Text will not be
								wrapped.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-whitespace-pre-line</code>: Preserves newlines but not spaces within an element. Text will be
								wrapped normally.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-whitespace-pre-wrap</code>: Preserves newlines and spaces within an element. Text will be
								wrapped normally.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Widths",
				content: <WidthsUtilClassShowcase />,
				description: (
					<>
						<p>
							<strong>Width</strong> Utility Classes cover the <strong>width</strong>, <strong>max-width</strong> and{" "}
							<strong>min-width</strong> aspects:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<strong>width</strong>:
								<BulletList.Unordered>
									<BulletList.Item>
										<code>-u-width-auto</code>: Allows the browser to determine the width for the specified element.
									</BulletList.Item>
									<BulletList.Item>
										<code>-u-width-full</code>: Allows the specified element to have 100% width of its parent, as long
										as the parent has a defined width.
									</BulletList.Item>
									<BulletList.Item>
										<code>-u-width-screen</code>: Allows the specified element to span the entire width of the viewport.
									</BulletList.Item>
									<BulletList.Item>
										<code>{`-u-width-{number}`}</code>: The specified element's width is calculated with the formula:{" "}
										<code>width = (number / 4)rem</code> viewport. <br /> You can also use the <code>-u-width-px</code>{" "}
										utility class to set the height to 1px.
									</BulletList.Item>
									<BulletList.Item>
										<code>{`-u-width-{fraction}`}</code>: The specified element's width is calculated into percentage
										based on the fraction.
									</BulletList.Item>
								</BulletList.Unordered>
							</BulletList.Item>
							<BulletList.Item>
								<strong>max-width</strong>: Set the maximum width of an element using the{" "}
								<code>{`-u-max-width-{size}`}</code> utility classes.
							</BulletList.Item>
							<BulletList.Item>
								<strong>min-width</strong>:
								<BulletList.Unordered>
									<BulletList.Item>
										<code>-u-min-width-0</code>: Applies the <code>min-width: 0px</code> style to the specified element.
									</BulletList.Item>
									<BulletList.Item>
										<code>-u-min-width-full</code>: Applies the <code>min-width: 100%</code> style to the specified
										element.
									</BulletList.Item>
								</BulletList.Unordered>
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							You can use the following example to try the different <strong>Width</strong> Classes that Widgets
							currently provides.
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Word Break",
				content: <WordBreakUtilClassShowcase />,
				description: (
					<>
						<p>
							Widgets provides three Utility Classes for you to customize the <strong>Word Break</strong>:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>-u-break-normal</code>: Only adds line breaks at normal word break points.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-break-words</code>: Adds line breaks mid-word if needed.
							</BulletList.Item>
							<BulletList.Item>
								<code>-u-truncate</code>: Truncates overflowing text with an ellipsis (…) if needed.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				useConfiguration: true
			}
		]
	}
];

export default {
	label: "Utility Classes",
	structure: showcases
};
