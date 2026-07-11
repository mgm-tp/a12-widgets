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

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase as ShowcaseData } from "./helpers/definitions.js";
import type { SearchItem } from "./helpers/global-search/search-component.js";
import { SearchComponent } from "./helpers/global-search/search-component.js";
import { isGroupSection, toLink } from "./helpers/utils.js";
import GetStartedBreakingChangesManagement from "./get-started/breaking-changes-management.js";
import GetStartedChangeLog from "./get-started/change-log.js";
import GetStartedInteractionHintInstruction from "./get-started/interaction-hint-instruction.js";
import GetStartedKeyboardNavigationInstruction from "./get-started/keyboard-navigation-instruction.js";
import GetStartedMigrationInstructionsMigrationNotes from "./get-started/migration-instructions/migration-notes.js";
import GetStartedMigrationInstructionsPatchInstruction from "./get-started/migration-instructions/patch-instruction.js";
import GetStartedMigrationInstructionsCodemodInstruction from "./get-started/migration-instructions/codemod-instruction.js";
import GetStartedMigrationInstructionsRichTextEditorMigration from "./get-started/migration-instructions/rich-text-editor-migration.js";
import GetStartedMigrationInstructionsNewTableAndTreeComponents from "./get-started/migration-instructions/new-table-and-tree-components.js";
import GetStartedMigrationInstructionsChartWidgetsToRechartsMigrationOverview from "./get-started/migration-instructions/chart-widgets-to-recharts/migration-overview.js";
import GetStartedMigrationInstructionsChartWidgetsToRechartsBarChartMigration from "./get-started/migration-instructions/chart-widgets-to-recharts/bar-chart-migration.js";
import GetStartedMigrationInstructionsChartWidgetsToRechartsLineChartMigration from "./get-started/migration-instructions/chart-widgets-to-recharts/line-chart-migration.js";
import GetStartedMigrationInstructionsChartWidgetsToRechartsPieChartMigration from "./get-started/migration-instructions/chart-widgets-to-recharts/pie-chart-migration.js";
import GetStartedShowcaseRedesign from "./get-started/showcase-redesign.js";
import GetStartedStyledComponents from "./get-started/styled-components.js";
import GetStartedQuickStart from "./get-started/quick-start.js";
import GetStartedTouchDetection from "./get-started/touch-detection.js";
import GetStartedPlasmaConfig from "./get-started/plasma-config.js";
import ShowcasesAccessibilityAccessibility from "./showcases/accessibility/accessibility.js";
import ShowcasesBasicTheme from "./showcases/basic-theme/index.js";
import ShowcasesBaseThemeOverview from "./showcases/base-theme/index.js";
import ShowcasesBaseThemeQuickStart from "./showcases/base-theme/quick-start.js";
import ShowcasesBaseThemeCustomization from "./showcases/base-theme/customization.js";
import ShowcasesBasicColors from "./showcases/basic-colors/index.js";
import ShowcasesFont from "./showcases/font/index.js";
import ShowcasesSpacing from "./showcases/spacing/index.js";
import ShowcasesHelperClasses from "./showcases/helper-classes/index.js";
import ShowcasesUtilClasses from "./showcases/util-classes/index.js";
import ShowcasesButton from "./showcases/button/index.js";
import ShowcasesButtonGroup from "./showcases/button-group/index.js";
import ShowcasesButtonGroupContainer from "./showcases/button-group-container/index.js";
import ShowcasesToggle from "./showcases/toggle/index.js";
import ShowcasesQuickAccessButton from "./showcases/quick-access-button/index.js";
import ShowcasesIcon from "./showcases/icon/index.js";
import ShowcasesLink from "./showcases/link/index.js";
import ShowcasesPopUpMenu from "./showcases/pop-up-menu/index.js";
import ShowcasesApplicationFrameApplicationFrame from "./showcases/application-frame/application-frame.js";
import ShowcasesCallout from "./showcases/callout/index.js";
import ShowcasesModalOverlay from "./showcases/modal-overlay/index.js";
import ShowcasesResponsiveImageContainer from "./showcases/responsive-image-container/index.js";
import ShowcasesResizeAndDragContainer from "./showcases/resize-and-drag-container/index.js";
import ShowcasesResizeHandler from "./showcases/resize-handler/index.js";
import ShowcasesCollapsiblePanel from "./showcases/collapsible-panel/index.js";
import ShowcasesContentbox from "./showcases/contentbox/index.js";
import ShowcasesMasterDetail from "./showcases/master-detail/index.js";
import ShowcasesLayoutGridTemplate from "./showcases/layout-grid/template/index.js";
import ShowcasesLayoutGridDashboard from "./showcases/layout-grid/dashboard/index.js";
import ShowcasesSplitView from "./showcases/split-view/index.js";
import ShowcasesAccordion from "./showcases/accordion/index.js";
import ShowcasesApplicationHeader from "./showcases/application-header/index.js";
import ShowcasesBreadcrumb from "./showcases/breadcrumb/index.js";
import ShowcasesDropdown from "./showcases/dropdown/index.js";
import ShowcasesMenuFlyoutMenu from "./showcases/menu/flyout-menu/index.js";
import ShowcasesMenuSlidingMenu from "./showcases/menu/sliding-menu/index.js";
import ShowcasesTabPanel from "./showcases/tab-panel/index.js";
import ShowcasesInputsAutocomplete from "./showcases/inputs/autocomplete/index.js";
import ShowcasesInputsCheckboxes from "./showcases/inputs/checkboxes/index.js";
import ShowcasesFileUpload from "./showcases/file-upload/index.js";
import ShowcasesInputsIconPicker from "./showcases/inputs/icon-picker/index.js";
import ShowcasesMultiselect from "./showcases/multiselect/index.js";
import ShowcasesRichTextEditor from "./showcases/rich-text-editor/index.js";
import ShowcasesRadio from "./showcases/radio/index.js";
import ShowcasesSelect from "./showcases/select/index.js";
import ShowcasesInputsSwitch from "./showcases/inputs/switch/index.js";
import ShowcasesInputsTagInput from "./showcases/inputs/tag-input/index.js";
import ShowcasesInputsTextField from "./showcases/inputs/text-field/index.js";
import ShowcasesInputsTextArea from "./showcases/inputs/text-area/index.js";
import ShowcasesDatePicker from "./showcases/date-picker/index.js";
import ShowcasesTimePicker from "./showcases/time-picker/index.js";
import ShowcasesDateTimePicker from "./showcases/date-time-picker/index.js";
import ShowcasesInputsMonthSelector from "./showcases/inputs/month-selector/index.js";
import ShowcasesInputsYearSelector from "./showcases/inputs/year-selector/index.js";
import ShowcasesInputsYearMonthSelector from "./showcases/inputs/year-month-selector/index.js";
import ShowcasesNotificationBadge from "./showcases/notification/badge/index.js";
import ShowcasesBulletListOrderedList from "./showcases/bullet-list/ordered-list/index.js";
import ShowcasesBulletListUnorderedList from "./showcases/bullet-list/unordered-list/index.js";
import ShowcasesBulletListNestedList from "./showcases/bullet-list/nested-list/index.js";
import ShowcasesCard from "./showcases/card/index.js";
import ShowcasesChartBarChart from "./showcases/chart/bar-chart/index.js";
import ShowcasesChartLineChart from "./showcases/chart/line-chart/index.js";
import ShowcasesChartPieChart from "./showcases/chart/pie-chart/index.js";
import ShowcasesCounter from "./showcases/counter/index.js";
import ShowcasesInteractiveTile from "./showcases/interactive-tile/index.js";
import ShowcasesInteractionHint from "./showcases/interaction-hint/index.js";
import ShowcasesList from "./showcases/list/index.js";
import ShowcasesPagination from "./showcases/pagination/index.js";
import ShowcasesStatus from "./showcases/status/index.js";
import ShowcasesDataTable from "./showcases/data-table/index.js";
import ShowcasesDataTreeTable from "./showcases/data-tree-table/index.js";
import ShowcasesTable from "./showcases/table/index.js";
import ShowcasesTag from "./showcases/tag/index.js";
import ShowcasesTextOutput from "./showcases/text-output/index.js";
import ShowcasesTooltip from "./showcases/tooltip/index.js";
import ShowcasesTree from "./showcases/tree/index.js";
import ShowcasesTreeView from "./showcases/tree-view/index.js";
import ShowcasesTreeTable from "./showcases/tree-table/index.js";
import ShowcasesGlobalMessageBox from "./showcases/global-message-box/index.js";
import ShowcasesModalNotification from "./showcases/modal-notification/index.js";
import ShowcasesNotificationToastsToast from "./showcases/notification/toasts/toast/index.js";
import ShowcasesNotificationToastsConnectedToast from "./showcases/notification/toasts/connected-toast/index.js";
import ShowcasesNotificationToastsToastGroup from "./showcases/notification/toasts/toast-group/index.js";
import ShowcasesProgressBar from "./showcases/progress-bar/index.js";
import ShowcasesProgressIndicator from "./showcases/progress-indicator/index.js";
import ShowcasesCssEllipsis from "./showcases/css-ellipsis/index.js";
import ShowcasesLinesEllipsis from "./showcases/lines-ellipsis/index.js";
import ShowcasesMessage from "./showcases/message/index.js";
import ShowcasesAttachedPortal from "./showcases/attached-portal/index.js";
import ShowcasesPortal from "./showcases/portal/index.js";
import ShowcasesTypography from "./showcases/typography/index.js";
import ShowcasesResizeDetector from "./showcases/resize-detector/index.js";
import ShowcasesChat from "./showcases/chat/index.js";
import ShowcasesCommentComment from "./showcases/comment/comment/index.js";
import ShowcasesCommentCommentContainer from "./showcases/comment/comment-container/index.js";
import ShowcasesLoginLayout from "./showcases/login-layout/index.js";
import ShowcasesFacetedSearchFilterBar from "./showcases/faceted-search/filter-bar/index.js";
import ShowcasesFacetedSearchFilterSelector from "./showcases/faceted-search/filter-selector/index.js";
import ShowcasesMessageBox from "./showcases/message-box/index.js";
import ShowcasesValidationBar from "./showcases/validation-bar/index.js";
import ShowcasesWizard from "./showcases/wizard/index.js";
import ExperimentalSlider from "./experimental/slider/index.js";
import ExperimentalDiagramShapes from "./experimental/diagram-shapes/index.js";
import ExperimentalInfiniteScrollTable from "./experimental/infinite-scroll-table/index.js";
import ExperimentalCalendar from "./experimental/calendar/index.js";
import ShowcasesExamplesCollapsibleSidebar from "./showcases/examples/collapsible-sidebar/index.js";
import ShowcasesExamplesDetermineLocation from "./showcases/examples/determine-location/index.js";
import ShowcasesExamplesDragAndDrop from "./showcases/examples/drag-and-drop/index.js";
import ShowcasesExamplesDualPaneLayout from "./showcases/examples/dual-pane-layout/index.js";
import ShowcasesExamplesFilterSelectorNew from "./showcases/examples/filter-selector-new/index.js";
import ShowcasesExamplesGallery from "./showcases/examples/gallery/index.js";
import ShowcasesExamplesMasterDetail from "./showcases/examples/master-detail/index.js";
import ShowcasesExamplesMultilingualField from "./showcases/examples/multilingual-field/index.js";
import {
	BasicMultiselectTableExample,
	AdvancedMultiselectTableExample
} from "./showcases/examples/multiselect-table/index.js";
import ShowcasesExamplesPassword from "./showcases/examples/password/index.js";
import ShowcasesExamplesSidebarWithTabPanel from "./showcases/examples/sidebar-with-tab-panel/index.js";
import ShowcasesExamplesStylingInTree from "./showcases/examples/styling-in-tree/index.js";
import GetStartedContentSecurityPolicies from "./get-started/content-security-policies.js";
import ShowcasesSupportingPanesLayout from "./showcases/supporting-panes-layout/index.js";

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
				label: "Breaking Changes Management",
				component: GetStartedBreakingChangesManagement
			},
			{
				label: "Change Log",
				component: GetStartedChangeLog
			},
			{
				label: "Interaction Hint Usage Instructions",
				component: GetStartedInteractionHintInstruction
			},
			{
				label: "Keyboard Navigation Usage Instructions",
				component: GetStartedKeyboardNavigationInstruction
			},
			{
				label: "Migration Instructions",
				children: [
					{
						label: "Migration Notes",
						component: GetStartedMigrationInstructionsMigrationNotes
					},
					{
						label: "Patch Instruction",
						component: GetStartedMigrationInstructionsPatchInstruction
					},
					{
						label: "Codemod Instruction",
						component: GetStartedMigrationInstructionsCodemodInstruction
					},
					{
						label: "Draft-js to Lexical Editor",
						component: GetStartedMigrationInstructionsRichTextEditorMigration
					},
					{
						label: "New Table and Tree Components",
						component: GetStartedMigrationInstructionsNewTableAndTreeComponents
					},
					{
						label: "Chart Widgets to Recharts",
						children: [
							{
								label: "Overview",
								component: GetStartedMigrationInstructionsChartWidgetsToRechartsMigrationOverview
							},
							{
								label: "Bar Chart Migration",
								component: GetStartedMigrationInstructionsChartWidgetsToRechartsBarChartMigration
							},
							{
								label: "Line Chart Migration",
								component: GetStartedMigrationInstructionsChartWidgetsToRechartsLineChartMigration
							},
							{
								label: "Pie Chart Migration",
								component: GetStartedMigrationInstructionsChartWidgetsToRechartsPieChartMigration
							}
						]
					}
				]
			},
			{
				label: "News",
				children: [
					{
						label: "Showcase Redesign",
						component: GetStartedShowcaseRedesign
					},
					{
						label: "Styled Components",
						component: GetStartedStyledComponents
					}
				]
			},
			{
				label: "Quick Start",
				component: GetStartedQuickStart
			},
			{
				label: "Touch Detection",
				component: GetStartedTouchDetection
			},
			{
				label: "Use And Configure Widgets Style",
				component: GetStartedPlasmaConfig
			}
		]
	},
	{
		label: "Basics",
		children: [
			{
				label: "Accessibility",
				component: ShowcasesAccessibilityAccessibility
			},
			{
				label: "Theme",
				children: [
					{
						label: "Theming",
						component: ShowcasesBasicTheme
					},
					{
						label: "Base Theme",
						children: [
							{
								label: "Overview",
								component: ShowcasesBaseThemeOverview
							},
							{
								label: "Quick Start",
								component: ShowcasesBaseThemeQuickStart
							},
							{
								label: "Customization",
								component: ShowcasesBaseThemeCustomization
							}
						]
					},
					{
						label: "Colors",
						component: ShowcasesBasicColors
					},
					{
						label: "Fonts",
						component: ShowcasesFont
					},
					{
						label: "Spacing",
						component: ShowcasesSpacing
					}
				]
			},
			{
				label: "Helper Classes",
				component: ShowcasesHelperClasses
			},
			{
				label: "Utility Classes",
				component: ShowcasesUtilClasses
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
								component: ShowcasesButton
							},
							{
								label: "Button Group",
								component: ShowcasesButtonGroup
							},
							{
								label: "Button Group Container",
								component: ShowcasesButtonGroupContainer
							},
							{
								label: "Toggle Button",
								component: ShowcasesToggle
							},
							{
								label: "Quick Access Button",
								component: ShowcasesQuickAccessButton
							}
						]
					},
					{
						label: "Icon",
						component: ShowcasesIcon
					},
					{
						label: "Link",
						component: ShowcasesLink
					},
					{
						label: "Popup Menu",
						component: ShowcasesPopUpMenu
					}
				]
			},
			{
				label: "Layout",
				children: [
					{ label: "Application Frame", component: ShowcasesApplicationFrameApplicationFrame },
					{ label: "Callout", component: ShowcasesCallout },
					{ label: "Modal Overlay", component: ShowcasesModalOverlay },
					{
						label: "Responsive Image Container",
						component: ShowcasesResponsiveImageContainer
					},
					{
						label: "Resize and Drag Container",
						component: ShowcasesResizeAndDragContainer
					},
					{
						label: "Resize Handler",
						component: ShowcasesResizeHandler
					},
					{
						label: "Collapsible Panel",
						component: ShowcasesCollapsiblePanel
					},
					{
						label: "Content Box",
						component: ShowcasesContentbox
					},
					{
						label: "Master Detail",
						component: ShowcasesMasterDetail
					},
					{
						label: "Layout Grid",
						children: [
							{
								label: "Template",
								component: ShowcasesLayoutGridTemplate
							},
							{
								label: "Dashboard",
								component: ShowcasesLayoutGridDashboard
							}
						]
					},
					{
						label: "Split View",
						component: ShowcasesSplitView
					},
					{
						label: "Supporting Panes Layout",
						component: ShowcasesSupportingPanesLayout
					}
				]
			},
			{
				label: "Navigation",
				children: [
					{ label: "Accordion", component: ShowcasesAccordion },
					{ label: "Application Header", component: ShowcasesApplicationHeader },
					{ label: "Breadcrumb", component: ShowcasesBreadcrumb },
					{ label: "Dropdown", component: ShowcasesDropdown },
					{
						label: "Menu",
						children: [
							{
								label: "Flyout Menu",
								component: ShowcasesMenuFlyoutMenu
							},
							{
								label: "Sliding Menu",
								component: ShowcasesMenuSlidingMenu
							}
						]
					},
					{ label: "Tab Panel", component: ShowcasesTabPanel }
				]
			},
			{
				label: "Data Entry",
				children: [
					{
						label: "Autocomplete",
						component: ShowcasesInputsAutocomplete
					},
					{
						label: "Checkbox",
						component: ShowcasesInputsCheckboxes
					},
					{
						label: "File Upload",
						component: ShowcasesFileUpload,
						hint: ["Attachment"]
					},
					{
						label: "Icon Picker",
						component: ShowcasesInputsIconPicker
					},
					{
						label: "Multiselect",
						component: ShowcasesMultiselect
					},
					{
						label: "Rich Text Editor",
						component: ShowcasesRichTextEditor,
						hint: ["Rich Text"]
					},
					{
						label: "Radio",
						component: ShowcasesRadio
					},
					{
						label: "Select",
						component: ShowcasesSelect
					},
					{
						label: "Switch",
						component: ShowcasesInputsSwitch
					},
					{
						label: "Tag Input",
						component: ShowcasesInputsTagInput
					},
					{
						label: "Text Field",
						component: ShowcasesInputsTextField
					},
					{
						label: "Text Area",
						component: ShowcasesInputsTextArea
					},
					{
						label: "Pickers",
						children: [
							{
								label: "Date Picker",
								component: ShowcasesDatePicker
							},
							{
								label: "Time Picker",
								component: ShowcasesTimePicker
							},
							{
								label: "Date Time Picker",
								component: ShowcasesDateTimePicker
							}
						]
					},
					{
						label: "Year Month Selector",
						children: [
							{
								label: "Month Selector",
								component: ShowcasesInputsMonthSelector
							},
							{
								label: "Year Selector",
								component: ShowcasesInputsYearSelector
							},
							{
								label: "Year and Month Selector",
								component: ShowcasesInputsYearMonthSelector
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
						component: ShowcasesNotificationBadge
					},
					{
						label: "Bullet List",
						children: [
							{
								label: "Ordered List",
								component: ShowcasesBulletListOrderedList,
								hint: ["Bullet List"]
							},
							{
								label: "Unordered List",
								component: ShowcasesBulletListUnorderedList,
								hint: ["Bullet List"]
							},
							{
								label: "Nested List",
								component: ShowcasesBulletListNestedList,
								hint: ["Bullet List"]
							}
						]
					},
					{
						label: "Card",
						component: ShowcasesCard
					},
					{
						label: "Deprecated Charts",
						children: [
							{
								label: "Deprecated Bar Chart",
								component: ShowcasesChartBarChart
							},
							{
								label: "Deprecated Line Chart",
								component: ShowcasesChartLineChart
							},
							{
								label: "Deprecated Pie Chart",
								component: ShowcasesChartPieChart
							}
						]
					},
					{ label: "Counter", component: ShowcasesCounter },
					{
						label: "Interactive Tile",
						component: ShowcasesInteractiveTile
					},
					{
						label: "Interaction Hint",
						component: ShowcasesInteractionHint
					},
					{ label: "List", component: ShowcasesList },
					{ label: "Pagination", component: ShowcasesPagination },
					{ label: "Status", component: ShowcasesStatus },
					{ label: "Table", component: ShowcasesTable },
					{
						label: "Tag",
						component: ShowcasesTag
					},
					{ label: "Text Output", component: ShowcasesTextOutput },
					{
						label: "Tooltip",
						component: ShowcasesTooltip
					},

					{ label: "Tree", component: ShowcasesTree },
					{
						label: "Tree Table",
						component: ShowcasesTreeTable
					}
				]
			},
			{
				label: "Feedback",
				children: [
					{
						label: "Global Message Box",
						component: ShowcasesGlobalMessageBox
					},
					{
						label: "Modal Notification",
						component: ShowcasesModalNotification
					},
					{
						label: "Toasts",
						children: [
							{
								label: "Toast",
								component: ShowcasesNotificationToastsToast
							},
							{
								label: "Connected Toast",
								component: ShowcasesNotificationToastsConnectedToast
							},
							{
								label: "Toast Group",
								component: ShowcasesNotificationToastsToastGroup
							}
						]
					},
					{
						label: "Progress Bar",
						component: ShowcasesProgressBar
					},
					{
						label: "Progress Indicator",
						component: ShowcasesProgressIndicator
					}
				]
			},
			{
				label: "Utils",
				children: [
					{
						label: "CSS Ellipsis",
						component: ShowcasesCssEllipsis
					},
					{
						label: "Lines Ellipsis",
						component: ShowcasesLinesEllipsis
					},
					{
						label: "Message",
						component: ShowcasesMessage
					},
					{
						label: "Portals",
						children: [
							{
								label: "Attached Portal",
								component: ShowcasesAttachedPortal
							},
							{
								label: "Portal",
								component: ShowcasesPortal
							}
						]
					},
					{
						label: "Typography",
						component: ShowcasesTypography,
						hint: ["Headline"]
					},
					{
						label: "Resize Detector",
						component: ShowcasesResizeDetector
					}
				]
			},
			{
				label: "Business Case",
				children: [
					{
						label: "Chat",
						component: ShowcasesChat
					},
					{
						label: "Comment",
						children: [
							{
								label: "Comment Template",
								component: ShowcasesCommentComment
							},
							{
								label: "Comment Container",
								component: ShowcasesCommentCommentContainer
							}
						]
					},
					{
						label: "Login Layout",
						component: ShowcasesLoginLayout
					},
					{
						label: "Faceted Search",
						children: [
							{ label: "Filter Bar", component: ShowcasesFacetedSearchFilterBar },
							{
								label: "Filter Selector",
								component: ShowcasesFacetedSearchFilterSelector
							}
						]
					},
					{
						label: "Message Box",
						component: ShowcasesMessageBox
					},
					{
						label: "Validation Bar",
						component: ShowcasesValidationBar
					},
					{
						label: "Wizard",
						component: ShowcasesWizard
					}
				]
			}
		]
	},
	{
		label: "Experimental",
		children: [
			{ label: "DataTable", component: ShowcasesDataTable },
			{ label: "DataTreeTable", component: ShowcasesDataTreeTable },
			{ label: "TreeView", component: ShowcasesTreeView },
			{
				label: "Slider",
				component: ExperimentalSlider
			},
			{
				label: "Diagram Shapes",
				component: ExperimentalDiagramShapes
			},
			{
				label: "Infinite Scroll Table",
				component: ExperimentalInfiniteScrollTable
			},
			{
				label: "Calendar",
				component: ExperimentalCalendar
			}
		]
	},
	{
		label: "Examples",
		children: [
			{
				label: "Collapsible Sidebar",
				component: ShowcasesExamplesCollapsibleSidebar
			},
			{
				label: "Determine Location",
				component: ShowcasesExamplesDetermineLocation
			},
			{
				label: "Drag And Drop",
				component: ShowcasesExamplesDragAndDrop
			},
			{
				label: "Dual Pane Layout",
				component: ShowcasesExamplesDualPaneLayout
			},
			{
				label: "Filter Selector",
				component: ShowcasesExamplesFilterSelectorNew
			},
			{
				label: "Gallery",
				component: ShowcasesExamplesGallery
			},
			{
				label: "Master Detail",
				component: ShowcasesExamplesMasterDetail
			},
			{
				label: "Multilingual Field",
				component: ShowcasesExamplesMultilingualField
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
				component: ShowcasesExamplesPassword
			},
			{
				label: "Sidebar with Tab Panel",
				component: ShowcasesExamplesSidebarWithTabPanel
			},
			{
				label: "Styling in Tree",
				component: ShowcasesExamplesStylingInTree
			}
		]
	},
	{
		label: "FAQ",
		children: [
			{
				label: "Content Security Policies (CSPs)",
				component: GetStartedContentSecurityPolicies
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

	export interface ShowcaseModule {
		label: string;
		hint?: string[];
		structure: ShowcaseData[];
		// widgetInfo's TypeDoc declarations don't strictly satisfy JSONOutput.DeclarationReflection at compile time;
		// LayoutShowcaseContentBox treats it as opaque, so we keep it loose here and cast at the render boundary.
		widgetInfo?: unknown;
		useFullPageLayout?: boolean;
		useLargeView?: boolean;
		useFullLayoutWithoutRightNav?: boolean;
	}

	export interface Showcase extends MenuItem {
		component: ShowcaseModule;

		/* Leafs must not have any children */
		children?: undefined;
		hint?: string[];
		label: string;
		fullScreen?: boolean;
	}
}

export namespace Utils {
	export function isSection<T extends IndexMenuItem>(item: T): item is T & IndexMenuItem.Section {
		return "children" in item && item.children !== undefined;
	}

	export function isShowcase<T extends IndexMenuItem>(item: T): item is T & IndexMenuItem.Showcase {
		return !isSection(item);
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
}

export const SiteMap = SiteMapMenuItem.createFromIndexMenuItems(Index);

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
