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

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { useState, useCallback, useMemo } from "react";
import { fn } from "storybook/test";

import { Autocomplete, HintTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

import PerfPanel from "./perf-panel.js";
import { LARGE_ITEM_COUNT, createLargeItemList, useDropdownPerfProbe } from "./perf-probe.js";

const LANGUAGES = [
	"Java",
	"Groovy",
	"JavaScript",
	"TypeScript",
	"C++",
	"C",
	"Scala",
	"Python",
	"PHP",
	"ActionScript",
	"AppleScript",
	"Clojure",
	"COBOL",
	"BASIC",
	"Erlang",
	"Fortran",
	"Haskell",
	"Lisp",
	"Perl",
	"Ruby",
	"Scheme"
];

const meta: Meta<typeof Autocomplete> = {
	title: "Data Entry/Autocomplete",
	component: Autocomplete,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		label: {
			control: "text",
			description: "Label displayed above the autocomplete input"
		},
		inputPlaceHolder: {
			control: "text",
			description: "Placeholder text shown in the input field"
		},
		hintTemplate: {
			control: "text",
			description: 'Template for the hint text, e.g. "{count} matches"'
		},
		disabled: {
			control: "boolean",
			description: "Disables the autocomplete input"
		},
		readonly: {
			control: "boolean",
			description: "Makes the autocomplete input read-only"
		},
		caseSensitive: {
			control: "boolean",
			description: "Only match items with corresponding case when true"
		},
		allowAddingNewItem: {
			control: "boolean",
			description: "Allow the user to enter and submit a value not in the list"
		},
		enableClearButton: {
			control: "boolean",
			description: "Show a clear button to reset the current value"
		},
		openOnFocus: {
			control: "boolean",
			description: "Open the dropdown when the input receives focus"
		},
		mobileModal: {
			control: "select",
			options: ["follow the device", "fullscreen dialog", "attached dropdown"],
			mapping: {
				"follow the device": undefined,
				"fullscreen dialog": true,
				"attached dropdown": false
			},
			description:
				"How the options are presented. Left alone it follows the device — the fullscreen dialog on phones, where an attached dropdown would sit behind the on-screen keyboard, and the attached dropdown everywhere else. Pin one of them to exercise it on any device."
		},
		loading: {
			control: "boolean",
			description: "Show a progress indicator while items are loading"
		},
		errorMessage: {
			control: "text",
			description: "Error message shown below the input"
		},
		warningMessage: {
			control: "text",
			description: "Warning message shown below the input"
		},
		infoMessage: {
			control: "text",
			description: "Info message shown below the input"
		},
		messagePosition: {
			control: "select",
			options: ["above", "below"],
			description:
				'Where the error, warning and info message boxes render: `"above"` (default) between the label and the control, `"below"` directly under the control'
		},
		breakTooltipsToNewLine: {
			control: "select",
			options: [false, true, "above", "below"],
			description:
				'Where tooltips render: `false` (default) inline beside the control, `true` / `"above"` on a new line above the control, `"below"` on a new line below'
		}
	},
	args: {
		// NOTE: do NOT spy `onSearch` here. Supplying `onSearch` switches the widget into async mode,
		// where it stops filtering locally and expects the parent to feed back filtered `items`. A
		// global no-op spy would therefore break inline completion and preselection in every story.
		// See the dedicated `AsyncSearch` story below for the async pattern with a real handler.
		onValueChange: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		id: "autocomplete-playground",
		label: "Programming Language",
		inputPlaceHolder: "Please select or start typing",
		hintTemplate: "{count} matches",
		items: LANGUAGES
	},
	render: (args) => (
		<div style={{ maxWidth: 400 }}>
			<Autocomplete {...args} />
		</div>
	)
};

export const AsyncSearch: Story = {
	render: function AsyncSearchExample() {
		const [items, setItems] = useState<string[]>(LANGUAGES);

		const handleSearch = useCallback((query: string): void => {
			// Simulates a server-side search: the parent owns filtering and feeds `items` back.
			const needle = query.trim().toLowerCase();
			setItems(needle ? LANGUAGES.filter((language) => language.toLowerCase().includes(needle)) : LANGUAGES);
		}, []);

		return (
			<div style={{ maxWidth: 400 }}>
				<Autocomplete
					id="autocomplete-async"
					label="Programming Language"
					inputPlaceHolder="Please select or start typing"
					hintTemplate="{count} matches"
					items={items}
					onSearch={handleSearch}
					onValueChange={fn()}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Supplying `onSearch` switches the widget into async mode: it stops filtering locally and the parent must feed the filtered `items` back (here from an in-memory list). Inline tail-completion is intentionally off in this mode."
			}
		}
	}
};

export const WithInitialValue: Story = {
	args: {
		id: "autocomplete-initial",
		label: "Programming Language",
		inputPlaceHolder: "Please select or start typing",
		hintTemplate: "{count} matches",
		items: LANGUAGES,
		initialValue: "Groovy"
	},
	render: (args) => (
		<div style={{ maxWidth: 400 }}>
			<Autocomplete {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "`initialValue` pre-selects an existing item from `items` when the autocomplete first renders."
			}
		}
	}
};

export const AllowAddingNewItem: Story = {
	render: function AllowAddingNewItemExample() {
		const [value, setValue] = useState<string | undefined>(undefined);
		const [items, setItems] = useState<string[]>(LANGUAGES);

		const handleValueChange = useCallback(
			(newValue: string): void => {
				if (newValue !== "" && !items.includes(newValue)) {
					setItems((prev) => [...prev, newValue]);
				}

				setValue(newValue);
			},
			[items]
		);

		return (
			<div style={{ maxWidth: 400 }}>
				<Autocomplete
					id="autocomplete-add-item"
					label="Programming Language"
					inputPlaceHolder="Type to search or add a new entry"
					hintTemplate="{count} matches"
					items={items}
					value={value}
					onValueChange={(v) => handleValueChange(v as string)}
					allowAddingNewItem
					helperText="Type a new language name and press Enter to add it"
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"With `allowAddingNewItem`, the user may submit a value that is not in `items` — handle `onValueChange` to append it to the source list."
			}
		}
	}
};

export const WithoutClearButton: Story = {
	args: {
		id: "autocomplete-no-clear",
		label: "Programming Language",
		inputPlaceHolder: "Please select or start typing",
		hintTemplate: "{count} matches",
		items: LANGUAGES,
		initialValue: "Python",
		enableClearButton: false
	},
	render: (args) => (
		<div style={{ maxWidth: 400 }}>
			<Autocomplete {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`enableClearButton={false}` hides the clear button that otherwise allows resetting the current value with one click."
			}
		}
	}
};

export const Loading: Story = {
	args: {
		id: "autocomplete-loading",
		label: "Programming Language",
		inputPlaceHolder: "Please select or start typing",
		hintTemplate: "{count} matches",
		items: LANGUAGES,
		loading: true,
		loadingLabel: "Fetching options..."
	},
	render: (args) => (
		<div style={{ maxWidth: 400 }}>
			<Autocomplete {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`loading` shows a progress indicator in the dropdown while items are fetched asynchronously; `loadingLabel` sets its text."
			}
		}
	}
};

export const Disabled: Story = {
	args: {
		id: "autocomplete-disabled",
		label: "Programming Language (disabled)",
		inputPlaceHolder: "Please select or start typing",
		hintTemplate: "{count} matches",
		items: LANGUAGES,
		initialValue: "Java",
		disabled: true
	},
	render: (args) => (
		<div style={{ maxWidth: 400 }}>
			<Autocomplete {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "`disabled` prevents any interaction with the input and the dropdown."
			}
		}
	}
};

export const FullscreenDialog: Story = {
	name: "Fullscreen Dialog (mobile presentation)",
	args: {
		id: "autocomplete-dialog",
		label: "Programming Language",
		inputPlaceHolder: "Please select or start typing",
		hintTemplate: "{count} matches",
		items: LANGUAGES,
		mobileModal: true
	},
	render: (args) => (
		<div style={{ maxWidth: 400 }}>
			<Autocomplete {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`mobileModal` presents the options in a fullscreen dialog instead of a dropdown attached to the field, which is the default on phones — an attached dropdown there ends up behind the on-screen keyboard. The field in the page is a read-only combobox that opens the dialog (`aria-haspopup="dialog"`); the editable combobox with the listbox lives inside the dialog, so only one combobox is ever exposed. Pinned to `true` here so the presentation can be exercised on a desktop; leave the prop off to follow the device.'
			}
		}
	}
};

export const AttachedDropdown: Story = {
	name: "Attached Dropdown (pinned off the dialog)",
	args: {
		id: "autocomplete-attached",
		label: "Programming Language",
		inputPlaceHolder: "Please select or start typing",
		hintTemplate: "{count} matches",
		items: LANGUAGES,
		mobileModal: false
	},
	render: (args) => (
		<div style={{ maxWidth: 400 }}>
			<Autocomplete {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"The mirror of the story above: `mobileModal={false}` keeps the dropdown attached to the field on every device, including the phones that would otherwise get the dialog. This is the presentation `DefaultAutocomplete` pinned, and the one to check when opening Storybook on a real phone — the presentation follows the user agent rather than the viewport, so every other story shows the dialog there and this is the only way to reach the attached dropdown. Expect the on-screen keyboard to cover part of the option list, which is what the dialog exists to avoid — scrolling the list gets it out of the way. The list is portalled to the end of the document, so the field `aria-owns` it while it is open: a screen reader reaching the end of the field walks into the options (input → clear button → options) instead of into the rest of the page."
			}
		}
	}
};

function LargeDatasetExample({ virtualize, id }: { virtualize?: boolean; id: string }): ReactElement {
	const items = useMemo(() => createLargeItemList(LARGE_ITEM_COUNT), []);
	const { samples, reset } = useDropdownPerfProbe();

	return (
		<div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
			{/* Sized as a flex item so it keeps its 400px next to the panel, and still shrinks to a phone. */}
			<div style={{ flex: "0 1 400px", maxWidth: 400 }}>
				<Autocomplete
					id={id}
					label="Location"
					inputPlaceHolder="Please select or start typing"
					hintTemplate="{count} matches"
					items={items}
					virtualize={virtualize}
					helperText={`${items.length.toLocaleString("en-US")} items — ${
						virtualize === false ? "every match is rendered" : "only the matches in view are rendered"
					}`}
					onValueChange={fn()}
				/>
			</div>
			<PerfPanel samples={samples} onReset={reset} />
		</div>
	);
}

export const LargeDataset: Story = {
	name: "Large Dataset (10 000 items)",
	render: () => <LargeDatasetExample id="autocomplete-large-dataset" />,
	parameters: {
		layout: "padded",
		a11y: { disable: true },
		docs: {
			description: {
				story:
					"Performance bench with 10 000 items. Above 150 matches the dropdown windows its options, so only the options in view exist in the DOM and opening or filtering the list costs about the same regardless of how long it is. The panel reports the time from the interaction to the next paint after the listbox changed, together with the number of rendered options — compare it against the story below."
			}
		}
	}
};

export const LargeDatasetWithoutVirtualization: Story = {
	name: "Large Dataset (10 000 items, not windowed)",
	render: () => <LargeDatasetExample id="autocomplete-large-dataset-plain" virtualize={false} />,
	parameters: {
		layout: "padded",
		a11y: { disable: true },
		docs: {
			description: {
				story:
					"The same 10 000 items with `virtualize={false}`, which renders every match. Opening the list unfiltered is the worst case and blocks the main thread for a few hundred milliseconds; each keystroke re-filters and re-renders the whole matched list. Kept as the comparison baseline for the windowed story above."
			}
		}
	}
};

export const ValidationMessages: Story = {
	render: () => (
		<div style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 }}>
			<Autocomplete
				id="autocomplete-error"
				label="Error state"
				inputPlaceHolder="Please select or start typing"
				hintTemplate="{count} matches"
				items={LANGUAGES}
				errorMessage="A selection is required"
			/>
			<Autocomplete
				id="autocomplete-warning"
				label="Warning state"
				inputPlaceHolder="Please select or start typing"
				hintTemplate="{count} matches"
				items={LANGUAGES}
				warningMessage="Consider selecting a more popular language"
			/>
			<Autocomplete
				id="autocomplete-info"
				label="Info state"
				inputPlaceHolder="Please select or start typing"
				hintTemplate="{count} matches"
				items={LANGUAGES}
				infoMessage="Start typing to filter the list"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`errorMessage`, `warningMessage` and `infoMessage` render a validation message below the input with matching styling."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "autocomplete-message-position",
		label: "Programming Language",
		helperText: "Helper text explaining the field",
		inputPlaceHolder: "Please select or start typing",
		hintTemplate: "{count} matches",
		items: LANGUAGES,
		error: true,
		errorMessage: "Please select a language",
		messagePosition: "below"
	},
	render: (args) => (
		<div style={{ width: 400 }}>
			<Autocomplete {...args} />
		</div>
	),
	parameters: {
		controls: { include: ["messagePosition"] },
		docs: {
			description: {
				story:
					'`messagePosition` places the message box relative to the control. This story starts at `"below"`, which renders it directly under the control — switch the control to `"above"` for the default placement between the label and the control.'
			}
		}
	}
};

export const TooltipPosition: Story = {
	args: {
		id: "autocomplete-tooltip-position",
		label: "Programming Language",
		helperText: "Helper text explaining the field",
		inputPlaceHolder: "Please select or start typing",
		hintTemplate: "{count} matches",
		items: LANGUAGES,
		tooltips: <HintTooltip text="This is a hint" id="autocomplete-tooltip-position-hint" />,
		ariaDescribedby: "autocomplete-tooltip-position-hint",
		breakTooltipsToNewLine: "below"
	},
	render: (args) => (
		<div style={{ width: 400 }}>
			<Autocomplete {...args} />
		</div>
	),
	parameters: {
		controls: { include: ["breakTooltipsToNewLine"] },
		docs: {
			description: {
				story:
					'`breakTooltipsToNewLine` places the tooltips relative to the control. This story starts at `"below"`, which puts them on their own line under the control — switch the control to `false` for the default inline placement beside it, or to `"above"` / `true` for a line above.'
			}
		}
	}
};
