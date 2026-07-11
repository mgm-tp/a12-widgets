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

import { kebabCase } from "lodash-es";

const DATA_ROLES_TREE = {
	Accordion: {
		Details: "",
		Section: "",
		Summary: "",
		Text: ""
	},
	ApplicationFrame: {
		Header: "",
		Content: "",
		Sidebar: { Wrapper: "" },
		Main: "",
		Footer: "",
		ToggleSidebarButton: ""
	},
	CollapsiblePanel: {
		Addon: "add-on",
		Indicator: "",
		Header: "",
		Title: {
			Wrapper: ""
		},
		Info: "",
		Content: ""
	},
	CollapsiblePanelAddons: "collapsiblePanel__add-ons",
	Autocomplete: "",
	AttachedPortal: "",
	Button: {
		Label: ""
	},
	ButtonGroup: "",
	Badge: {
		Content: ""
	},
	Breadcrumb: { List: "", Content: "", Separator: "", Item: "" },
	Diagram: {
		Port: "",
		Node: "",
		Label: "",
		GridMainPoint: "",
		GridSubPoint: ""
	},
	Chat: {
		Message: {
			Content: "",
			Status: "",
			Group: ""
		},
		User: {
			Info: "",
			Avatar: "",
			Name: ""
		},
		AvatarImg: "",
		DateMarker: "",
		Notification: "",
		TypingMarker: ""
	},
	Toggle: {
		Item: "",
		Label: "",
		Wrapper: "",
		SelectedItemOverlay: "",
		OptionButton: "",
		OptionButtons: "",
		ItemContent: ""
	},
	HeaderTrigger: {
		Graphic: "",
		Text: ""
	},
	Contentbox: {
		Title: "",
		Subtitle: "",
		Footer: "",
		Addon: {
			Prefix: "",
			Suffix: ""
		},
		ActionBar: "",
		GroupActionBar: "",
		ActionBarGroup: {
			Divider: "",
			AreaLeft: "",
			AreaRight: ""
		},
		Content: "",
		Heading: "",
		Header: "",
		Notification: "",
		Subheading: {
			TransitionActionBar: "transition-actionBar"
		},
		WizardBar: ""
	},
	Checkbox: {
		Input: {
			Indeterminate: ""
		},
		Label: "",
		HelperText: "",
		ErrorMessage: "",
		InfoMessage: "",
		WarningMessage: "",
		Control: {
			Inner: {
				HiddenLabel: ""
			}
		}
	},
	CheckboxGroup: {
		Label: "",
		ErrorMessage: "",
		InfoMessage: "",
		WarningMessage: ""
	},
	CssEllipsis: {
		Tooltip: "",
		Content: ""
	},
	DatePicker: {
		Root: "",
		NavBar: {
			Next: ""
		},
		DayButton: "",
		Week: {
			Day: ""
		},
		Month: {
			Grid: ""
		},
		Dialog: { Header: "", Title: "", Actions: "" },
		Footer: {
			Action: ""
		},
		YearErrorMessage: ""
	},
	DateTimePicker: {
		Footer: {
			Action: ""
		},
		Header: {
			Actions: ""
		},
		Title: "",
		EditTime: {
			Button: ""
		},
		TimeDisplay: ""
	},
	Picker: {
		Footer: {
			Action: ""
		}
	},
	Month: {
		Selector: {
			Input: ""
		}
	},
	Year: {
		Selector: {
			Input: "",
			Option: ""
		},
		Month: {
			Selector: {
				HelperText: "",
				Label: "",
				ErrorMessage: "",
				WarningMessage: "",
				InfoMessage: "",
				Control: ""
			}
		}
	},
	Dropdown: {
		Content: "",
		Graphic: "",
		Hint: "",
		Item: "",
		LinkItemWrapper: "",
		Links: "",
		SecondaryText: "",
		SectionItem: "",
		Text: ""
	},
	Message: "",
	Modal: {
		Overlay: "",
		OverlayContent: ""
	},
	List: {
		SubHeader: {
			ContentWrapper: "",
			Content: "",
			Graphic: "",
			Meta: ""
		},
		Item: {
			Content: "",
			Graphic: "",
			Text: "",
			SecondaryText: "",
			Meta: ""
		}
	},
	Filter: {
		Options: "",
		Action: "",
		Name: {
			Text: ""
		},
		Content: "",
		Selector: {
			ActionElement: "",
			ActionBar: "",
			List: {
				Item: ""
			}
		},
		Prefix: ""
	},
	Filterbar: {
		Content: "",
		Action: ""
	},
	FilterSelector: {
		ActionBar: "",
		ActionElement: "",
		Content: {
			Primary: "",
			Secondary: ""
		},
		List: { Item: "" },
		Section: "",
		Footer: ""
	},
	FileUpload: {
		Actions: "",
		Control: "",
		Content: {
			Inner: ""
		},
		Divider: "",
		Input: "",
		Label: "",
		PreviewIcon: "",
		InfoMessage: "",
		ErrorMessage: "",
		WarningMessage: "",
		VisibleText: ""
	},
	HiddenText: "",
	Icon: "plasma-icon",
	LinesEllipsis: {
		Wrapper: ""
	},
	IconPicker: "",
	InteractionHint: {
		Content: ""
	},
	Label: {
		Graphic: ""
	},
	GlobalMessageBox: {
		Graphic: "",
		Text: "",
		Actions: ""
	},
	Link: "",
	MasterDetail: {
		Layout: {
			View: "",
			Title: "",
			Pane: "",
			Body: ""
		},
		Header: ""
	},
	Multiselect: "",
	Menu: {
		Wrapper: "",
		Content: "",
		Item: {
			Icon: "",
			Label: "",
			Text: "",
			Placeholder: ""
		}
	},
	SubMenu: { Content: "" },
	Popup: {
		TriggerElement: "",
		HeaderWrapper: "",
		HeaderTitle: "",
		CloseButton: "",
		Menu: "",
		Item: ""
	},
	Pagination: {
		Action: ""
	},
	ProgressIndicator: {
		OuterOverlay: "",
		InnerOverlay: "",
		Circle: "",
		CircleSpinner: "",
		Label: ""
	},
	QuickAccessButton: {
		TriggerElement: "",
		MainAction: "",
		Popup: "",
		Divider: ""
	},
	Radio: {
		Item: "control",
		Input: "",
		Label: "",
		ControlInner: "",
		Group: {
			Label: "",
			HelperText: "",
			ErrorMessage: "",
			WarningMessage: "",
			InfoMessage: ""
		}
	},
	FieldSlider: {
		Label: "",
		ErrorMessage: "",
		Thumb: "",
		BarLabel: "",
		Box: "",
		BarFillLeft: "",
		BarFillRight: "",
		BarTick: "",
		Backdrop: ""
	},
	ResizeAndDragContainer: "resize-and-drag-content",
	SupportingPanesLayoutResizeHandler: "resize-handle",
	RichTextEditor: {
		Toolbar: "",
		ToolbarItem: "",
		Tooltip: "",
		Wrapper: "",
		ToolbarList: "",
		ToolbarListItem: "",
		ContentWrapper: "",
		Input: {
			Field: "",
			Wrapper: ""
		},
		SpellCheckPopup: "",
		MentionSuggestion: {
			Item: ""
		},
		AfterAddon: "",
		ColorDecoration: "",
		ErrorMessage: "",
		WarningMessage: "",
		InfoMessage: "",
		Placeholder: "",
		HelperText: {
			Wrapper: ""
		},
		Label: ""
	},
	SupportingPanesLayout: {
		PrimaryPane: "",
		SecondaryPane: {
			Content: ""
		}
	},
	ResizableHandler: {
		Wrapper: ""
	},
	SplitView: {
		Area: ""
	},
	Table: {
		Viewport: "",
		Header: {
			Row: {
				SegmentLeft: "-left",
				SegmentRight: "-right",
				SegmentScroll: "-scroll"
			},
			Cell: { Content: "", Group: { Children: "", Parent: "" } },
			ResizeHandleRow: ""
		},
		Filter: {
			Row: {
				SegmentLeft: "-left",
				SegmentRight: "-right",
				SegmentScroll: "-scroll"
			},
			Cell: { Content: "" }
		},
		Body: {
			Row: {
				SegmentLeft: "-left",
				SegmentRight: "-right",
				SegmentScroll: "-scroll"
			},
			Cell: { Group: "", CardLabel: "" },
			Content: { Placeholder: "" },
			VirtualizedContainer: ""
		},
		Footer: {
			Row: {
				SegmentLeft: "-left",
				SegmentRight: "-right",
				SegmentScroll: "-scroll"
			},
			Cell: ""
		},
		Row: {
			Group: { Header: "", HeaderToggle: "" },
			Scroller: {
				Scroll: "-scroll"
			},
			ScrollerCell: ""
		},
		Expandable: { Row: { Body: "", Footer: "" }, Wrapper: "" },
		Infinite: { Row: { Group: "" } },
		Column: { ResizeHandler: "", RightResizeHandler: "", LeftResizeHandler: "" },
		DnDHint: "",
		RowOverlay: "",
		ContextMenu: "",
		A11yLiveRegion: ""
	},
	TreeTable: {
		Dnd: { Target: "" },

		/** Wrapper around the tree column's cell content (indent + expand control + label). */
		Cell: "",

		/** The leading icon slot in the tree column, populated via `getIcon`. */
		Icon: "",

		/** The synthetic "load more" row trailing a paginated parent's loaded children. */
		LoadMore: ""
	},
	Tree: {
		Dropdown: {
			HintTop: "",
			HintBottom: "",
			Target: ""
		},
		Nodes: "",
		Node: {
			Actions: "",
			Content: "",
			Expander: "",
			Title: "",
			Icon: "",
			Name: ""
		},
		Subnodes: ""
	},
	TabSandbox: {
		Supporter: ""
	},
	TextField: {
		Input: { Wrapper: "" },
		Control: "",
		ErrorMessage: "",
		WarningMessage: "",
		InfoMessage: "",
		HelperText: "",
		TextAffix: "",
		Prefix: "",
		Suffix: "",
		Label: ""
	},
	Textarea: {
		Control: "",
		Input: "",
		Label: "",
		HelperText: "",
		ErrorMessage: "",
		WarningMessage: "",
		InfoMessage: ""
	},
	TextOutput: {
		Content: "",
		Text: "",
		Paragraph: "",
		Addons: ""
	},
	Typography: {
		Headline: { Label: "", Title: "", Graphic: "", Wrapper: "", Info: "", Divider: "", HeaderActions: "" },
		Body: "",
		Section: "",
		Addons: "",
		Addon: ""
	},
	Tooltip: {
		TriggerWrapper: "",
		Content: ""
	},
	GroupTooltipHint: "",
	Portal: {
		Placeholder: ""
	},
	TabPanel: {
		Header: "",
		Heading: "",
		Suffix: "",
		TabList: "",
		SubTabList: "",
		Tab: "",
		Content: "",
		SubGroupLabel: "",
		Group: {
			TabList: "",
			Divider: ""
		}
	},
	Panel: "",
	SelectionSuffix: "",
	Select: {
		Prefix: "",
		Option: "",
		Wrapper: "",
		Input: "",
		Mobile: {
			Wrapper: ""
		},
		RichLabel: {
			Wrapper: {
				Prefix: ""
			}
		}
	},
	Error: {
		Message: "",
		Text: ""
	},
	Info: {
		Message: "",
		Text: ""
	},
	Warning: {
		Message: "",
		Text: ""
	},
	Toast: {
		Container: "",
		Title: "",
		Content: "",
		Message: "",
		Action: "",
		Collapse: "",
		Footer: "",
		Left: "",
		Right: "",
		Header: "",
		Group: {
			Toolbar: {
				Title: "",
				ItemsGroup: ""
			}
		}
	},
	Switch: {
		Control: "",
		Interactive: "",
		Input: "",
		HelperText: "",
		AddonAfter: "",
		Label: "",
		WarningMessage: "",
		ErrorMessage: "",
		InfoMessage: "",
		UncheckedOption: "",
		CheckedOption: "",
		ThumbIcon: "",
		InlineWrapper: ""
	},
	Calendar: {
		WeekView: {
			Content: "",
			Wrapper: "",
			DayWrapper: "",
			DayHeader: "",
			DayContent: {
				Wrapper: "",
				Item: ""
			},
			DayHeaderItem: ""
		},
		MonthView: {
			Wrapper: "",
			Infinite: {
				ScrollContainer: "",
				Placeholder: ""
			},
			Week: "",
			WeekDayHeader: "",
			WeekDayHeaderItem: "",
			Day: {
				Header: "",
				Content: {
					Wrapper: "",
					Item: ""
				}
			},
			Table: ""
		}
	},
	Status: {
		Icon: "",
		Label: {
			Wrapper: ""
		}
	},
	Tag: {
		Content: "",
		Icon: "",
		HelperText: ""
	},
	Counter: {
		Addon: ""
	},
	Callout: {
		Pointer: "",
		Inner: "",
		Header: {
			Prefix: "",
			Title: "",
			Suffix: ""
		},
		Body: "",
		Footer: ""
	},
	SimplePagination: {
		Action: "",
		Label: ""
	},
	TimePicker: {
		Wrapper: "",
		Input: "",
		Header: {
			Actions: ""
		},
		Title: "",
		Body: "",
		Date: "",
		Setting: "",
		Time: "",
		Am: "",
		Pm: "",
		Pointer: "",
		Clock: {
			Num: ""
		},
		Footer: {
			Action: ""
		}
	},
	ValidationBar: {
		Header: "",
		Content: "",
		Graphic: "",
		Titles: "",
		PrimaryTitle: "",
		SecondaryTitle: "",
		Actions: "",
		Item: ""
	},
	MobileValidation: {
		Overview: {
			Left: "",
			Right: ""
		},
		Graphic: {
			Icon: "",
			Content: ""
		},
		PreviewList: "",
		PreviewItem: "",
		Content: "",
		Actions: {
			Item: ""
		}
	},
	Comment: {
		Meta: "",
		MetaGroup: "",
		Body: "",
		Footer: "",
		Content: "",
		Actions: { Combine: "" },
		Replies: {
			ItemAction: ""
		},
		Text: "",
		Tag: ""
	},
	NewComment: {
		MetaContainer: "",
		Content: "",
		Avatar: "",
		Author: ""
	},
	CommentList: { Item: "" },
	TagGroup: "",
	TagInput: {
		Group: "",
		HelperText: "tag-helper-text",
		Label: "",
		ErrorMessage: "",
		WarningMessage: "",
		InfoMessage: ""
	},
	OrderedBulletList: {},
	UnorderedBulletList: {},
	BulletList: {
		Item: ""
	},
	PieChart: {
		Legend: ""
	},
	BarChart: {
		Legend: ""
	},
	LineChart: {
		Legend: ""
	},
	ResponsiveImageContainer: "",
	LoginLayout: {
		Headline: "",
		Form: "",
		Footer: "",
		Logo: "",
		Graphic: "",
		FormItem: "",
		Container: ""
	},
	LayoutGrid: { Column: "", Row: "" },
	ButtonGroupContainer: "",
	Messagebox: {
		Main: "",
		Label: "",
		Icon: "",
		Title: "",
		Detail: "",
		Graphic: "",
		Text: "",
		Action: ""
	},
	ProgressBar: {
		Track: "",
		Fill: "",
		Label: "",
		Buffer: ""
	},
	Slider: {
		Track: "",
		Thumb: "",
		Label: "",
		Input: ""
	},
	Node: {
		Title: {
			Text: "",
			Icon: ""
		},
		Role: { Info: "", Content: "", Meta: "" },
		Header: "",
		Content: "",
		Footer: ""
	},
	PopUpMenu: {
		Trigger: "",
		Content: ""
	},
	QuickAccessMenu: "",
	ModelGraphDiagram: {
		Node: "",
		Edge: "",
		Canvas: ""
	},
	InteractiveTile: {
		Content: "",
		Actions: ""
	},
	ApplicationHeader: {
		Content: {
			Slot: ""
		}
	},
	Card: {
		Header: "",
		Content: "",
		Footer: "",
		Media: "",
		ActionArea: ""
	},
	Wizard: {
		Content: {
			ContainerWrapper: "",
			Container: ""
		},
		Step: "",
		Previous: "",
		Next: "",
		NavigateButton: ""
	}
};

/** @internal */
export function initialize(obj: object, paths: string[] = []): object {
	const stringify = (): string => paths.map(kebabCase).join("-");

	return new Proxy(obj, {
		get: (target: any, key: string | symbol): string | object | undefined => {
			if (typeof key === "string" && Object.keys(target).includes(key)) {
				const value = target[key];

				if (typeof value === "string") {
					return [...paths, value || key]
						.map((segment, index, array) =>
							value !== "" && index === array.length - 1
								? segment
								: segment.startsWith("-")
									? segment
									: kebabCase(segment)
						)
						.join("-");
				}

				if (typeof value === "object") {
					return initialize(value, [...paths, key]);
				}

				throw new Error("Unexpected type");
			}

			// "suggest" is a special key used by some type-checking tools; returning undefined prevents
			// it from being treated as a data role and avoids unintended proxy recursion
			if (key === "suggest") {
				return undefined;
			}

			// fall back to returning the stringified path for unknown keys
			return stringify;
		}
	});
}

export type DataRoleFromTree<T> = T extends string ? string : { [K in keyof T]: string & DataRoleFromTree<T[K]> };

export const DataRoles = initialize(DATA_ROLES_TREE) as DataRoleFromTree<typeof DATA_ROLES_TREE>;
