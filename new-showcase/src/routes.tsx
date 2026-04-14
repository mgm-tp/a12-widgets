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

import type { ComponentType } from "react";
import type { RouteComponentProps } from "react-router";

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";

import MigrationNotes from "./get-started/migration-instructions/migration-notes.js";
import StyledComponentMigration from "./get-started/migration-instructions/styled-component-migration.js";
import PatchInstruction from "./get-started/migration-instructions/patch-instruction.js";
import CodemodInstruction from "./get-started/migration-instructions/codemod-instruction.js";
import ContentSecurityPolicies from "./get-started/content-security-policies.js";
import ShowcaseRedesign from "./get-started/showcase-redesign.js";
import StyledComponents from "./get-started/styled-components.js";
import ConfigurePlasmaShowcase from "./get-started/plasma-config.js";
import AboutTouchDetection from "./get-started/touch-detection.js";
import QuickStart from "./get-started/quick-start.js";
import ChangeLog from "./get-started/change-log.js";
import type { Showcase as ShowcaseData } from "./helpers/definitions.js";
import ButtonShowcase from "./showcases/button/index.js";
import ButtonGroupShowcase from "./showcases/button-group/index.js";
import IconShowcase from "./showcases/icon/index.js";
import LinkShowcase from "./showcases/link/index.js";
import PopupShowcase from "./showcases/pop-up-menu/index.js";
import ButtonGroupContainerShowcase from "./showcases/button-group-container/index.js";
import ToggleButtonShowcase from "./showcases/toggle/index.js";
import QuickAccessButtonShowcase from "./showcases/quick-access-button/index.js";
import TableShowcase from "./showcases/table/index.js";
import AccordionShowcase from "./showcases/accordion/index.js";
import AutocompleteShowcase from "./showcases/inputs/autocomplete/index.js";
import CheckboxShowcase from "./showcases/inputs/checkboxes/index.js";
import IconPickerShowcase from "./showcases/inputs/icon-picker/index.js";
import CollapsiblePanelShowcase from "./showcases/collapsible-panel/index.js";
import ContentBoxShowCase from "./showcases/contentbox/index.js";
import GlobalMessageBoxShowcase from "./showcases/global-message-box/index.js";
import ModalNotificationShowcase from "./showcases/modal-notification/index.js";
import ApplicationFrameShowcase from "./showcases/application-frame/application-frame.js";
import ApplicationHeaderShowcase from "./showcases/application-header/index.js";
import BreadcrumbShowcase from "./showcases/breadcrumb/index.js";
import DropdownShowcase from "./showcases/dropdown/index.js";
import TabPanelShowcase from "./showcases/tab-panel/index.js";
import CalloutShowcase from "./showcases/callout/index.js";
import CssEllipsisShowcase from "./showcases/css-ellipsis/index.js";
import LinesEllipsisShowcase from "./showcases/lines-ellipsis/index.js";
import MessageShowcase from "./showcases/message/index.js";
import TypographyShowcase from "./showcases/typography/index.js";
import LayoutGridTemplateShowcase from "./showcases/layout-grid/template/index.js";
import DashboardShowcase from "./showcases/layout-grid/dashboard/index.js";
import ResponsiveImageContainerShowcase from "./showcases/responsive-image-container/index.js";
import FlyoutMenuShowcase from "./showcases/menu/flyout-menu/index.js";
import SlidingMenuShowcase from "./showcases/menu/sliding-menu/index.js";
import ModalOverlayShowcase from "./showcases/modal-overlay/index.js";
import ResizeAndDragContainerShowcase from "./showcases/resize-and-drag-container/index.js";
import RadioShowcase from "./showcases/radio/index.js";
import MultiselectShowcase from "./showcases/multiselect/index.js";
import SelectShowcase from "./showcases/select/index.js";
import SwitchShowcase from "./showcases/inputs/switch/index.js";
import TagInputShowcase from "./showcases/inputs/tag-input/index.js";
import type { SearchItem } from "./helpers/global-search/search-component.js";
import { SearchComponent } from "./helpers/global-search/search-component.js";
import { isGroupSection, toLink } from "./helpers/utils.js";
import MasterDetailShowcase from "./showcases/master-detail/index.js";
import SplitViewShowcase from "./showcases/split-view/index.js";
import ResizeHandlerShowcase from "./showcases/resize-handler/index.js";
import SupportingPanesLayoutShowcase from "./experimental/supporting-panes-layout/index.js";
import Calendar from "./experimental/calendar/index.js";
import MasterDetailExample from "./showcases/examples/master-detail/index.js";
import MultilingualFieldExample from "./showcases/examples/multilingual-field/index.js";
import PasswordExample from "./showcases/examples/password/index.js";
import SidebarWithTabPanel from "./showcases/examples/sidebar-with-tab-panel/index.js";
import StylingInTree from "./showcases/examples/styling-in-tree/index.js";
import {
	BasicMultiselectTableExample,
	AdvancedMultiselectTableExample
} from "./showcases/examples/multiselect-table/index.js";
import BadgeShowcase from "./showcases/notification/badge/index.js";
import CardShowcase from "./showcases/card/index.js";
import OrderedListShowcase from "./showcases/bullet-list/ordered-list/index.js";
import UnorderedListShowcase from "./showcases/bullet-list/unordered-list/index.js";
import NestedListShowcase from "./showcases/bullet-list/nested-list/index.js";
import TagsShowcase from "./showcases/tag/index.js";
import TooltipShowcase from "./showcases/tooltip/index.js";
import InteractionHintShowcase from "./showcases/interaction-hint/index.js";
import TextFieldShowcase from "./showcases/inputs/text-field/index.js";
import TextAreaShowcase from "./showcases/inputs/text-area/index.js";
import TextOutputShowcase from "./showcases/text-output/index.js";
import ListShowcase from "./showcases/list/index.js";
import CounterShowcase from "./showcases/counter/index.js";
import PaginationShowcase from "./showcases/pagination/index.js";
import StatusShowcase from "./showcases/status/index.js";
import ChatShowcase from "./showcases/chat/index.js";
import FilterBarShowcase from "./showcases/faceted-search/filter-bar/index.js";
import FilterSelectorShowcase from "./showcases/faceted-search/filter-selector/index.js";
import SliderShowcase from "./experimental/slider/index.js";
import DiagramShowcase from "./experimental/diagram-shapes/index.js";
import InfiniteScrollTableShowcase from "./experimental/infinite-scroll-table/index.js";
import BarChartShowcase from "./showcases/chart/bar-chart/index.js";
import LineChartShowcase from "./showcases/chart/line-chart/index.js";
import PieChartsShowcase from "./showcases/chart/pie-chart/index.js";
import FileUploadShowcase from "./showcases/file-upload/index.js";
import WizardShowcase from "./showcases/wizard/index.js";
import AttachedPortalShowcase from "./showcases/attached-portal/index.js";
import PortalShowcase from "./showcases/portal/index.js";
import MessageBoxShowcase from "./showcases/message-box/index.js";
import DatePickerShowcase from "./showcases/date-picker/index.js";
import TimePickerShowcase from "./showcases/time-picker/index.js";
import ValidationBarShowcase from "./showcases/validation-bar/index.js";
import DualPaneLayoutExample from "./showcases/examples/dual-pane-layout/index.js";
import LoginLayoutShowcase from "./showcases/login-layout/index.js";
import YearMonthSelectorShowcase from "./showcases/inputs/year-month-selector/index.js";
import YearSelectorShowcase from "./showcases/inputs/year-selector/index.js";
import MonthSelectorShowcase from "./showcases/inputs/month-selector/index.js";
import TreeShowcase from "./showcases/tree/index.js";
import TreeTableShowcase from "./showcases/tree-table/index.js";
import DetermineLocationShowcase from "./showcases/examples/determine-location/index.js";
import GalleryShowcase from "./showcases/examples/gallery/index.js";
import DragAndDropExample from "./showcases/examples/drag-and-drop/index.js";
import CommentShowcase from "./showcases/comment/comment/index.js";
import CommentContainerShowcase from "./showcases/comment/comment-container/index.js";
import DateTimePickerShowcase from "./showcases/date-time-picker/index.js";
import ProgressBarShowcase from "./showcases/progress-bar/index.js";
import ProgressIndicatorShowcase from "./showcases/progress-indicator/index.js";
import ConnectedToastShowcase from "./showcases/notification/toasts/connected-toast/index.js";
import ToastShowcase from "./showcases/notification/toasts/toast/index.js";
import ToastGroupShowcase from "./showcases/notification/toasts/toast-group/index.js";
import AccessibilityShowcase from "./showcases/accessibility/accessibility.js";
import BasicColorsShowcase from "./showcases/basic-colors/index.js";
import FontsShowcase from "./showcases/font/index.js";
import HelperClassesShowcase from "./showcases/helper-classes/index.js";
import SpacingShowcase from "./showcases/spacing/index.js";
import UtilityClassesShowcase from "./showcases/util-classes/index.js";
import ResizeDetectorShowcase from "./showcases/resize-detector/index.js";
import ThemingShowcase from "./showcases/basic-theme/index.js";
import CollapsibleSidebar from "./showcases/examples/collapsible-sidebar/index.js";
import RichTextEditorShowcase from "./showcases/rich-text-editor/index.js";
import InteractiveTileShowcase from "./showcases/interactive-tile/index.js";
import RichTextEditorMigration from "./get-started/migration-instructions/rich-text-editor-migration.js";
import InteractionHintInstruction from "./get-started/interaction-hint-instruction.js";
import ChartWidgetsToRechartsOverview from "./get-started/migration-instructions/chart-widgets-to-recharts/migration-overview.js";
import BarChartMigration from "./get-started/migration-instructions/chart-widgets-to-recharts/bar-chart-migration.js";
import LineChartMigration from "./get-started/migration-instructions/chart-widgets-to-recharts/line-chart-migration.js";
import PieChartMigration from "./get-started/migration-instructions/chart-widgets-to-recharts/pie-chart-migration.js";

/*
 * *********************************************************************************************************************
 * Below you can find the menu structure
 * *********************************************************************************************************************
 */

const Index: IndexMenuItem.Section[] = [
	{
		label: "Get Started",
		children: [
			{
				label: "News",
				children: [
					{
						label: "Showcase Redesign",
						component: ShowcaseRedesign
					},
					{
						label: "Styled Components",
						component: StyledComponents
					}
				]
			},
			{
				label: "Migration Instructions",
				children: [
					{
						label: "Migration Notes",
						component: MigrationNotes
					},
					{
						label: "Patch Instruction",
						component: PatchInstruction
					},
					{
						label: "Codemod Instruction",
						component: CodemodInstruction
					},
					{
						label: "Migration to styled-components",
						component: StyledComponentMigration
					},
					{
						label: "Draft-js to Lexical Editor",
						component: RichTextEditorMigration
					},
					{
						label: "Chart Widgets to Recharts",
						children: [
							{ label: "Overview", component: ChartWidgetsToRechartsOverview },
							{ label: "Bar Chart Migration", component: BarChartMigration },
							{ label: "Line Chart Migration", component: LineChartMigration },
							{ label: "Pie Chart Migration", component: PieChartMigration }
						]
					}
				]
			},
			{
				label: "Interaction Hint Usage Instructions",
				component: InteractionHintInstruction
			},
			{
				label: "Use And Configure Widgets Style",
				component: ConfigurePlasmaShowcase
			},
			{
				label: "Touch Detection",
				component: AboutTouchDetection
			},
			{
				label: "Quick Start",
				component: QuickStart
			},
			{
				label: "Change Log",
				component: ChangeLog
			}
		]
	},
	{
		label: "Basics",
		children: [
			{
				label: "Accessibility",
				component: AccessibilityShowcase
			},
			{
				label: "Theme",
				children: [
					{
						label: "Theming",
						component: ThemingShowcase
					},
					{
						label: "Colors",
						component: BasicColorsShowcase
					},
					{
						label: "Fonts",
						component: FontsShowcase
					},
					{
						label: "Spacing",
						component: SpacingShowcase
					}
				]
			},
			{
				label: "Helper Classes",
				component: HelperClassesShowcase
			},
			{
				label: "Utility Classes",
				component: UtilityClassesShowcase
			}
		]
	},
	{
		label: "Widgets",
		children: [
			{
				label: "General",
				children: [
					{
						label: "Buttons",
						children: [
							{
								label: "Button",
								component: ButtonShowcase
							},
							{
								label: "Button Group",
								component: ButtonGroupShowcase
							},
							{
								label: "Button Group Container",
								component: ButtonGroupContainerShowcase
							},
							{
								label: "Toggle Button",
								component: ToggleButtonShowcase
							},
							{
								label: "Quick Access Button",
								component: QuickAccessButtonShowcase
							}
						]
					},
					{
						label: "Icon",
						component: IconShowcase
					},
					{
						label: "Link",
						component: LinkShowcase
					},
					{
						label: "Popup Menu",
						component: PopupShowcase
					}
				]
			},
			{
				label: "Layout",
				children: [
					{ label: "Application Frame", component: ApplicationFrameShowcase },
					{ label: "Callout", component: CalloutShowcase },
					{ label: "Modal Overlay", component: ModalOverlayShowcase },
					{
						label: "Responsive Image Container",
						component: ResponsiveImageContainerShowcase
					},
					{
						label: "Resize and Drag Container",
						component: ResizeAndDragContainerShowcase
					},
					{
						label: "Resize Handler",
						component: ResizeHandlerShowcase
					},
					{
						label: "Collapsible Panel",
						component: CollapsiblePanelShowcase
					},
					{
						label: "Content Box",
						component: ContentBoxShowCase
					},
					{
						label: "Master Detail",
						component: MasterDetailShowcase
					},
					{
						label: "Layout Grid",
						children: [
							{
								label: "Template",
								component: LayoutGridTemplateShowcase
							},
							{
								label: "Dashboard",
								component: DashboardShowcase
							}
						]
					},
					{
						label: "Split View",
						component: SplitViewShowcase
					}
				]
			},
			{
				label: "Navigation",
				children: [
					{ label: "Accordion", component: AccordionShowcase },
					{ label: "Application Header", component: ApplicationHeaderShowcase },
					{ label: "Breadcrumb", component: BreadcrumbShowcase },
					{ label: "Dropdown", component: DropdownShowcase },
					{
						label: "Menu",
						children: [
							{
								label: "Flyout Menu",
								component: FlyoutMenuShowcase
							},
							{
								label: "Sliding Menu",
								component: SlidingMenuShowcase
							}
						]
					},
					{ label: "Tab Panel", component: TabPanelShowcase }
				]
			},
			{
				label: "Data Entry",
				children: [
					{
						label: "Autocomplete",
						component: AutocompleteShowcase
					},
					{
						label: "Checkbox",
						component: CheckboxShowcase
					},
					{
						label: "File Upload",
						component: FileUploadShowcase,
						hint: ["Attachment"]
					},
					{
						label: "Icon Picker",
						component: IconPickerShowcase
					},
					{
						label: "Multiselect",
						component: MultiselectShowcase
					},
					{
						label: "Rich Text Editor",
						component: RichTextEditorShowcase,
						hint: ["Rich Text"]
					},
					{
						label: "Radio",
						component: RadioShowcase
					},
					{
						label: "Select",
						component: SelectShowcase
					},
					{
						label: "Switch",
						component: SwitchShowcase
					},
					{
						label: "Tag Input",
						component: TagInputShowcase
					},
					{
						label: "Text Field",
						component: TextFieldShowcase
					},
					{
						label: "Text Area",
						component: TextAreaShowcase
					},
					{
						label: "Pickers",
						children: [
							{
								label: "Date Picker",
								component: DatePickerShowcase
							},
							{
								label: "Time Picker",
								component: TimePickerShowcase
							},
							{
								label: "Date Time Picker",
								component: DateTimePickerShowcase
							}
						]
					},
					{
						label: "Year Month Selector",
						children: [
							{
								label: "Month Selector",
								component: MonthSelectorShowcase
							},
							{
								label: "Year Selector",
								component: YearSelectorShowcase
							},
							{
								label: "Year and Month Selector",
								component: YearMonthSelectorShowcase
							}
						]
					}
				]
			},
			{
				label: "Data Display",
				children: [
					{
						label: "Badge",
						component: BadgeShowcase
					},
					{
						label: "Bullet List",
						children: [
							{
								label: "Ordered List",
								component: OrderedListShowcase,
								hint: ["Bullet List"]
							},
							{
								label: "Unordered List",
								component: UnorderedListShowcase,
								hint: ["Bullet List"]
							},
							{
								label: "Nested List",
								component: NestedListShowcase,
								hint: ["Bullet List"]
							}
						]
					},
					{
						label: "Card",
						component: CardShowcase
					},
					{
						label: "Deprecated Charts",
						children: [
							{
								label: "Deprecated Bar Chart",
								component: BarChartShowcase
							},
							{
								label: "Deprecated Line Chart",
								component: LineChartShowcase
							},
							{
								label: "Deprecated Pie Chart",
								component: PieChartsShowcase
							}
						]
					},
					{ label: "Counter", component: CounterShowcase },
					{
						label: "Interactive Tile",
						component: InteractiveTileShowcase
					},
					{
						label: "Interaction Hint",
						component: InteractionHintShowcase
					},
					{ label: "List", component: ListShowcase },
					{ label: "Pagination", component: PaginationShowcase },
					{ label: "Status", component: StatusShowcase },
					{ label: "Table", component: TableShowcase },
					{
						label: "Tag",
						component: TagsShowcase
					},
					{ label: "Text Output", component: TextOutputShowcase },
					{
						label: "Tooltip",
						component: TooltipShowcase
					},

					{ label: "Tree", component: TreeShowcase },
					{
						label: "Tree Table",
						component: TreeTableShowcase
					}
				]
			},
			{
				label: "Feedback",
				children: [
					{
						label: "Global Message Box",
						component: GlobalMessageBoxShowcase
					},
					{
						label: "Modal Notification",
						component: ModalNotificationShowcase
					},
					{
						label: "Toasts",
						children: [
							{
								label: "Toast",
								component: ToastShowcase
							},
							{
								label: "Connected Toast",
								component: ConnectedToastShowcase
							},
							{
								label: "Toast Group",
								component: ToastGroupShowcase
							}
						]
					},
					{
						label: "Progress Bar",
						component: ProgressBarShowcase
					},
					{
						label: "Progress Indicator",
						component: ProgressIndicatorShowcase
					}
				]
			},
			{
				label: "Utils",
				children: [
					{
						label: "CSS Ellipsis",
						component: CssEllipsisShowcase
					},
					{
						label: "Lines Ellipsis",
						component: LinesEllipsisShowcase
					},
					{
						label: "Message",
						component: MessageShowcase
					},
					{
						label: "Portals",
						children: [
							{
								label: "Attached Portal",
								component: AttachedPortalShowcase
							},
							{
								label: "Portal",
								component: PortalShowcase
							}
						]
					},
					{
						label: "Typography",
						component: TypographyShowcase,
						hint: ["Headline"]
					},
					{
						label: "Resize Detector",
						component: ResizeDetectorShowcase
					}
				]
			},
			{
				label: "Business Case",
				children: [
					{
						label: "Chat",
						component: ChatShowcase
					},
					{
						label: "Comment",
						children: [
							{
								label: "Comment Template",
								component: CommentShowcase
							},
							{
								label: "Comment Container",
								component: CommentContainerShowcase
							}
						]
					},
					{
						label: "Login Layout",
						component: LoginLayoutShowcase
					},
					{
						label: "Faceted Search",
						children: [
							{ label: "Filter Bar", component: FilterBarShowcase },
							{ label: "Filter Selector", component: FilterSelectorShowcase }
						]
					},
					{
						label: "Message Box",
						component: MessageBoxShowcase
					},
					{
						label: "Validation Bar",
						component: ValidationBarShowcase
					},
					{
						label: "Wizard",
						component: WizardShowcase
					}
				]
			}
		]
	},
	{
		label: "Experimental",
		children: [
			{
				label: "Slider",
				component: SliderShowcase
			},
			{
				label: "Diagram Shapes",
				component: DiagramShowcase
			},
			{
				label: "Infinite Scroll Table",
				component: InfiniteScrollTableShowcase
			},
			{
				label: "Supporting Panes Layout",
				component: SupportingPanesLayoutShowcase
			},
			{
				label: "Calendar",
				component: Calendar
			}
		]
	},
	{
		label: "Examples",
		children: [
			{
				label: "Collapsible Sidebar",
				component: CollapsibleSidebar
			},
			{
				label: "Determine Location",
				component: DetermineLocationShowcase
			},
			{
				label: "Drag And Drop",
				component: DragAndDropExample
			},
			{
				label: "Dual Pane Layout",
				component: DualPaneLayoutExample
			},
			{
				label: "Gallery",
				component: GalleryShowcase
			},
			{
				label: "Master Detail",
				component: MasterDetailExample
			},
			{
				label: "Multilingual Field",
				component: MultilingualFieldExample
			},
			{
				label: "Multiselect Table",
				children: [
					{
						label: "Basic",
						component: BasicMultiselectTableExample
					},
					{
						label: "Advanced",
						component: AdvancedMultiselectTableExample
					}
				]
			},
			{
				label: "Password",
				component: PasswordExample
			},
			{
				label: "Sidebar with Tab Panel",
				component: SidebarWithTabPanel
			},
			{
				label: "Styling in Tree",
				component: StylingInTree
			}
		]
	},
	{
		label: "FAQ",
		children: [
			{
				label: "Content Security Policies (CSPs)",
				component: ContentSecurityPolicies
			}
		]
	}
];

/*
 * *********************************************************************************************************************
 * Below you can find all necessary interfaces and utility functions
 * *********************************************************************************************************************
 */

export type IndexMenuItem = IndexMenuItem.Section | IndexMenuItem.Showcase;
export namespace IndexMenuItem {
	export interface Section extends MenuItem {
		children: IndexMenuItem[];
		hint?: string[];
		label: string;
		fullScreen?: boolean;
	}

	export interface Showcase extends MenuItem {
		component:
			| ComponentType<RouteComponentProps<object>>
			| {
					label: string;
					hint?: string[];
					structure: ShowcaseData[];
			  };

		/* Leafs must not have any children */
		children?: undefined;
		hint?: string[];
		label: string;
		fullScreen?: boolean;
	}
}

export namespace Utils {
	export function isSection<T extends IndexMenuItem>(item: T): item is T & IndexMenuItem.Section {
		if (Object.prototype.hasOwnProperty.call(item, "component") && item.children === undefined) {
			return false;
		} else if (!Object.prototype.hasOwnProperty.call(item, "component") && item.children !== undefined) {
			return true;
		} else {
			throw new Error("item is nether Section nor Showcase");
		}
	}

	export function isShowcase<T extends IndexMenuItem>(item: T): item is T & IndexMenuItem.Showcase {
		if (Object.prototype.hasOwnProperty.call(item, "component") && item.children === undefined) {
			return true;
		} else if (!Object.prototype.hasOwnProperty.call(item, "component") && item.children !== undefined) {
			return false;
		} else {
			throw new Error("item is nether Section nor Showcase");
		}
	}
}

export type SiteMapMenuItem = SiteMapMenuItem.Section | SiteMapMenuItem.Showcase;
export namespace SiteMapMenuItem {
	export interface Section extends IndexMenuItem.Section {
		path: string;
		children: SiteMapMenuItem[];
	}

	export interface Showcase extends IndexMenuItem.Showcase {
		path: string;
	}

	export function createFromIndexMenuItems(items: IndexMenuItem.Section[], path?: string): SiteMapMenuItem.Section[];
	export function createFromIndexMenuItems(items: IndexMenuItem.Showcase[], path?: string): SiteMapMenuItem.Showcase[];
	export function createFromIndexMenuItems(items: IndexMenuItem[], path?: string): SiteMapMenuItem[];
	export function createFromIndexMenuItems(items: IndexMenuItem[], path = ""): SiteMapMenuItem[] {
		return items.map((item) => {
			const newPath = `${path}/${toLink(item.label)}`;

			if (Utils.isShowcase(item)) {
				return {
					...item,
					path: newPath
				};
			} else {
				return {
					...item,
					path: newPath,
					children: createFromIndexMenuItems(item.children, newPath)
				};
			}
		});
	}

	export function createListOfPaths(
		items: IndexMenuItem[],
		path = "",
		currentResult?: { [path: string]: IndexMenuItem }
	): { [path: string]: IndexMenuItem } {
		const result: { [path: string]: IndexMenuItem } = currentResult ?? {};
		function isObject(value: [Section]): boolean {
			return typeof value === "object" && value !== null && !Array.isArray(value);
		}

		items.forEach((item) => {
			const newPath = `${path}/${toLink(item.label)}`;
			result[newPath] = item;

			const sections = (item as any)?.component?.structure[0]?.sections;

			if (isObject(sections)) {
				const sectionKeys = Object.keys(sections);

				for (let i = 0; i <= sectionKeys.length; i++) {
					if (i === sectionKeys.length) {
						const sectionPath = `${newPath}/api`;
						result[sectionPath] = item;
						break;
					}

					const sectionKey = sectionKeys[i];
					const sectionPath = `${newPath}/${toLink(sections[sectionKey]["label"] || sectionKey)}`;
					result[sectionPath] = item;
				}
			}

			if (!Utils.isShowcase(item)) {
				createListOfPaths(item.children, newPath, result);
			}
		});

		return result;
	}
}

export const SiteMap = SiteMapMenuItem.createFromIndexMenuItems(Index);

export const ListOfPathsArray = Object.keys(SiteMapMenuItem.createListOfPaths(Index));

function toProperCase(text: string): string {
	return text.replace(/\w\S*/g, (sub) => sub.charAt(0).toUpperCase() + sub.substring(1).toLowerCase());
}

type LeavesOfComponentsTree = {
	searchItem: SearchItem[];
};

function lookupLeavesOfComponentsTree(
	root: IndexMenuItem & { link?: string; parent?: string }
): LeavesOfComponentsTree {
	const link = `${root.link}/${toLink(root.label)}`;

	if (root.children) {
		const found: LeavesOfComponentsTree = { searchItem: [] };

		for (const child of root.children) {
			const data = lookupLeavesOfComponentsTree({
				...child,
				link,
				parent: root.parent ? `${root.parent}/${root.label}` : root.label
			});
			found.searchItem.push(...data.searchItem);
		}

		if (root.hint && root.hint.length > 0) {
			found.searchItem.push({
				title: root.label,
				text: root.label,
				link,
				hint: root.hint,
				location: root.parent
			});
		}

		return found;
	}

	const ret: LeavesOfComponentsTree = {
		searchItem: [
			{
				title: root.label,
				link,
				text: root.label,
				hint: root.hint,
				location: root.parent
			}
		]
	};
	const component = (root as any).component;
	const structure = component && component.structure;
	const sectionIndicator = "#";

	if (structure) {
		for (const showcase of structure) {
			if (showcase.sections) {
				if (component.widgetInfo) {
					const apiLink = !isGroupSection(showcase.sections) ? `#${toLink(showcase.label + " api")}` : "/api";

					ret.searchItem.push({
						title: `${root.label} > API`,
						text: `${showcase.label} API`,
						link: `${link}${apiLink}`,
						hint: [`${root.hint} api`],
						location: root.parent ? `${root.parent}` : root.label
					});
				}

				if (!isGroupSection(showcase.sections) && showcase.sections.length > 1) {
					showcase.sections.forEach((section: any) => {
						if (section.label) {
							ret.searchItem.push({
								title: `${root.label} > ${section.label}`,
								text: section.label,
								link: `${link}${sectionIndicator}${toLink(section.label)}`,
								hint: undefined,
								location: root.parent ? `${root.parent}` : root.label
							});
						}
					});
				} else {
					for (const tabKey in showcase.sections) {
						const showcaseTab = showcase.sections[tabKey];
						showcaseTab.sections?.forEach((section: any) => {
							if (section.label) {
								ret.searchItem.push({
									title: `${root.label} > ${showcaseTab.label ?? toProperCase(tabKey)} > ${section.label}`,
									text: section.label,
									link: `${link}/${toLink(showcaseTab.label ?? tabKey)}${sectionIndicator}${toLink(section.label)}`,
									hint: undefined,
									location: root.parent ? `${root.parent}` : root.label
								});
							}
						});
					}
				}
			} else if (root.label !== showcase.label) {
				ret.searchItem.push({
					title: `${root.label} > ${showcase.label}`,
					text: showcase.label,
					link: `${link}/${toLink(showcase.label)}${sectionIndicator}${toLink(showcase.label)}`,
					hint: undefined,
					location: root.parent ? `${root.parent}` : root.label
				});
			}
		}
	}

	return ret;
}

function registerSearchComponents(): void {
	const sections = Index;
	const allComponents: SearchItem[] = [];
	sections.forEach((section) => {
		const result = lookupLeavesOfComponentsTree({ ...section, link: "" });
		allComponents.push(...result.searchItem);
	});
	SearchComponent.default.reset();
	SearchComponent.default.register(...allComponents);
}

registerSearchComponents();
