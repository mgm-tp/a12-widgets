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
import { $getSelection, $isRangeSelection } from "lexical";
import type { ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@com.mgmtp.a12.widgets/widgets-core";
import { MarkdownEditor } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import type {
	MarkdownEditorHandle,
	MarkdownEditorOptionalFeatures,
	MarkdownEditorProps
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { ControlledMarkdownEditor, MarkdownValuePanel } from "./helpers.js";
import { markdownEditorArgs, markdownEditorArgTypes, sandboxArgTypes } from "./story-args.js";

/*
 * The editor itself. Two features the host has to set up on its own have their own
 * files next to this one, because each one needs an extension, a plugin, or both:
 *
 * - `ImageUpload.stories.tsx` — sending an image file to the host's own backend.
 * - `InfoPanel.stories.tsx` — the `:::info` callout blocks.
 * - `CustomExtension.stories.tsx` — an extension and a plugin written by a consumer.
 *
 * `MarkdownEditor.mdx` is the docs page. It embeds stories from all four files.
 */

/*
 * The document most of the stories start from.
 *
 * It only uses markdown the editor reads with no `features` prop at all: CommonMark plus
 * GFM. The four HTML-tag formats are off by default, so they live in the playground
 * document below instead — here they would come back escaped, which is right but reads
 * like a bug in a first look at the editor.
 */
const SAMPLE_MARKDOWN = `# Markdown editor

Write **rich** text and get _clean_ markdown back. The host application keeps the
\`value\` and hears about every edit through \`onChange\`.

## What it reads and writes

- CommonMark: headings, lists, quotes, code, links and images
- GFM: ~~strikethrough~~, task lists, tables, and bare links like https://geta12.com
- Nesting, kept the way you wrote it:
  - two spaces in
    - and a third level under that

1. Ordered lists,
2. with the numbers you typed,
3. left alone.

- [x] read the markdown from the host
- [x] report edits through \`onChange\`
- [ ] switch to source mode and see this text

## The three modes

| Mode       | What you see              | Toolbar |
| ---------- | ------------------------- | ------- |
| \`edit\`     | rich text                 |     yes |
| \`source\`   | the markdown, highlighted |     yes |
| \`view\`     | rendered, read-only       |      no |

## Code

Inline \`code\` in a sentence, and a block of it:

\`\`\`tsx
<MarkdownEditor value={markdown} onChange={setMarkdown} />
\`\`\`

> Quotes hold anything a paragraph holds: **bold**, \`code\` and
> [links](https://geta12.com). An image is a link with a \`!\` in front of it —
> \`![A12 logo](https://geta12.com/logo.svg)\`.

---

Markdown the editor does not know stays as plain text, so nothing is ever lost.
`;

/**
 * The playground document: everything above, plus the four formats markdown has no
 * syntax for. They only read as formatting because the story asks for them by name.
 */
const PLAYGROUND_MARKDOWN = `${SAMPLE_MARKDOWN}
## Asked for by name

<mark>Highlight</mark>, <u>underline</u>, H<sub>2</sub>O and E = mc<sup>2</sup> are off
until you list them in \`features\`, because markdown has no syntax for them — the editor
writes them as \`<mark>\`, \`<u>\`, \`<sub>\` and \`<sup>\` HTML tags.
`;

/**
 * Every optional feature on. Five of them are off by default: `htmlTags`, and the four
 * that markdown has no syntax for and the editor writes as HTML tags - highlight,
 * underline, subscript and superscript. Their toolbar buttons show up once they are on.
 *
 * Typed as `Required<...>`, so a new feature in the library breaks this story until it
 * is listed here too.
 */
const ALL_FEATURES: Required<MarkdownEditorOptionalFeatures> = {
	strikethrough: true,
	taskList: true,
	table: true,
	autolink: true,
	htmlTags: true,
	highlight: true,
	underline: true,
	subscript: true,
	superscript: true
};

const meta: Meta<typeof MarkdownEditor> = {
	title: "Data Entry/MarkdownEditor",
	component: MarkdownEditor,
	render: (args) => <ControlledMarkdownEditor {...args} showValuePanel />,
	parameters: {
		layout: "padded",
		// Stories pass elements and object graphs as props; the serialized element would show
		// all of it. The story source says what a consumer writes.
		docs: { source: { type: "code" } }
	},
	argTypes: markdownEditorArgTypes,
	args: markdownEditorArgs
};

export default meta;
type Story = StoryObj<typeof meta>;

/*
 * The two sandboxes below keep the markdown themselves, so `value` is theirs to set.
 * Everything else comes from the controls panel, which is why they take the story args
 * and spread them: without that the panel is dead, and `allowedModes` never reaches the
 * editor, so the mode menu has nothing to offer and stays hidden.
 */
type SandboxProps = MarkdownEditorProps;

export const Playground: Story = {
	args: {
		id: "playground-markdown-editor",
		label: "Description",
		value: PLAYGROUND_MARKDOWN,
		placeholder: "Start typing Markdown…",
		minHeight: 400,
		maxHeight: 480,
		features: ALL_FEATURES
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);

<MarkdownEditor id="description" label="Description" value={markdown} onChange={setMarkdown}
	placeholder="Start typing Markdown…"
	allowedModes={["edit", "source", "view"]}
	// HTML in the markdown and the four HTML-tag formats are off by default.
	features={{ htmlTags: true, highlight: true, underline: true, subscript: true, superscript: true }}
	minHeight={400}
	maxHeight={480}
/>`
			},
			description: {
				story:
					"The whole editor with every optional feature on, so the toolbar also shows the highlight, underline, subscript and superscript buttons. Those four are off by default because markdown has no syntax for them — the editor writes them as `<mark>`, `<u>`, `<sub>` and `<sup>` HTML tags. `htmlTags` is on here too, so HTML written in the markdown is drawn instead of shown as text. Use the controls panel to try the props: change `initialMode`, hide the toolbar, set an `errorMessage`, or change `emitMode` and see the value panel below update sooner or later."
			}
		}
	}
};

export const SourceMode: Story = {
	args: {
		id: "source-markdown-editor",
		label: "Markdown source",
		value: SAMPLE_MARKDOWN,
		initialMode: "source",
		minHeight: 240,
		maxHeight: 480
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Opens on the raw markdown. The user can still switch through the mode menu.
<MarkdownEditor id="description" label="Description" value={markdown} onChange={setMarkdown} initialMode="source" allowedModes={["edit", "source", "view"]} />`
			},
			description: {
				story:
					'`initialMode: "source"` opens the raw-markdown surface, with syntax highlighting. The toolbar still works and writes markdown syntax at the caret: select a word and click bold, or click a heading, a list, a link or a table to insert the syntax for it. What you type here is what the host gets, character for character — source mode never rewrites the document. Use the mode switcher to move between Edit, Source and Preview.'
			}
		}
	}
};

export const WithoutToolbar: Story = {
	args: {
		id: "no-toolbar-markdown-editor",
		label: "Description",
		value: SAMPLE_MARKDOWN,
		showToolbar: false,
		minHeight: 200
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// No toolbar means no mode menu either, so the host drives the mode itself if it needs to.
<MarkdownEditor id="description" label="Description" value={markdown} onChange={setMarkdown} showToolbar={false} />`
			},
			description: {
				story:
					"`showToolbar: false` hides the toolbar and keeps everything else. Formatting still works from the keyboard: `Ctrl/Cmd+B`, `Ctrl/Cmd+I`, and the markdown shortcuts — type `## `, `- `, `1. ` or `> ` at the start of a line, or put `**` around a word."
			}
		}
	}
};

export const CustomToolbar: Story = {
	args: {
		id: "custom-toolbar-markdown-editor",
		label: "Description",
		value: SAMPLE_MARKDOWN,
		minHeight: 240,
		toolbar: (
			<MarkdownEditor.Toolbar>
				<MarkdownEditor.ToolbarGroup>
					<MarkdownEditor.BoldButton />
					<MarkdownEditor.ItalicButton />
					<MarkdownEditor.StrikeButton />
				</MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.ToolbarSeparator />
				<MarkdownEditor.ToolbarGroup>
					<MarkdownEditor.HeadingMenu />
					<MarkdownEditor.BulletListButton />
					<MarkdownEditor.OrderedListButton />
				</MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.ToolbarSeparator />
				<MarkdownEditor.ToolbarGroup>
					<MarkdownEditor.LinkButton />
					<MarkdownEditor.ToolbarButton
						icon="signature"
						title="Insert signature"
						onClick={({ richEditor, sourceCommands }) =>
							sourceCommands
								? sourceCommands.insertText("\n\n---\n\n*Kind regards*\n")
								: richEditor.update(() => {
										const selection = $getSelection();

										if ($isRangeSelection(selection)) {
											selection.insertParagraph();
											selection.insertText("Kind regards");
										}
									})
						}
					/>
				</MarkdownEditor.ToolbarGroup>
				{/* A custom toolbar gets no mode menu for free — put it where you want it. */}
				<MarkdownEditor.ModeMenu />
			</MarkdownEditor.Toolbar>
		)
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `<MarkdownEditor id="description" label="Description" value={markdown} onChange={setMarkdown}
	toolbar={
		<MarkdownEditor.Toolbar>
			<MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.BoldButton />
				<MarkdownEditor.ItalicButton />
				<MarkdownEditor.StrikeButton />
			</MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.ToolbarSeparator />
			<MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.HeadingMenu />
				<MarkdownEditor.BulletListButton />
				<MarkdownEditor.OrderedListButton />
			</MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.ToolbarSeparator />
			<MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.LinkButton />
				{/* A custom control gets the toolbar context. Source mode holds plain text, so it inserts markdown there. */}
				<MarkdownEditor.ToolbarButton
					icon="signature"
					title="Insert signature"
					onClick={({ richEditor, sourceCommands }) =>
						sourceCommands
							? sourceCommands.insertText("\\n\\n---\\n\\n*Kind regards*\\n")
							: richEditor.update(() => $getSelection()?.insertText("Kind regards"))
					}
				/>
			</MarkdownEditor.ToolbarGroup>
			{/* A custom toolbar gets no mode menu for free. */}
			<MarkdownEditor.ModeMenu />
		</MarkdownEditor.Toolbar>
	}
/>`
			},
			description: {
				story:
					"The `toolbar` prop replaces the built-in toolbar with your own set of the `MarkdownEditor.*` components: leave out the controls you do not want, regroup the rest, and add your own with `MarkdownEditor.ToolbarButton`. Its `onClick` gets the toolbar context — `richEditor`, `state`, `sourceCommands` and the dialog openers — so a custom button can do the right thing in both modes, like the signature button here. Every built-in control still wires itself up: active state, enabled state, source-mode behaviour and the toolbar's arrow-key navigation all keep working."
			}
		}
	}
};

export const WithHelperAndError: Story = {
	args: {
		id: "validation-markdown-editor",
		label: "Description",
		value: "",
		placeholder: "Start typing Markdown…",
		helperText: "Provide a description of at least 20 characters.",
		errorMessage: "This field is required.",
		minHeight: 160
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `<MarkdownEditor id="description" label="Description" value={markdown} onChange={setMarkdown}
	placeholder="Start typing Markdown…"
	helperText="Provide a description of at least 20 characters."
	error
	errorMessage="This field is required."
/>`
			},
			description: {
				story:
					"`helperText` sits under the editor as guidance, and `errorMessage` puts the field into its error state: a red border, the message in place of the helper text, and `aria-invalid` plus `aria-describedby` on the editing surface, the same way `TextField` does it. Clear the `errorMessage` control to get the helper text back."
			}
		}
	}
};

export const Disabled: Story = {
	args: {
		id: "disabled-markdown-editor",
		label: "Description",
		value: SAMPLE_MARKDOWN,
		disabled: true,
		minHeight: 200
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `<MarkdownEditor id="description" label="Description" value={markdown} onChange={setMarkdown} disabled />`
			},
			description: {
				story:
					"`disabled` greys the whole field out: the surface takes no caret, the formatting controls do nothing and `autoFocus` is ignored. The mode menu keeps working, so the markdown can still be read as rich text, as source or as a preview."
			}
		}
	}
};

export const Readonly: Story = {
	args: {
		id: "readonly-markdown-editor",
		label: "Description",
		value: SAMPLE_MARKDOWN,
		readonly: true,
		minHeight: 200
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Readonly is always the view mode: no toolbar, no caret.
<MarkdownEditor id="description" label="Description" value={markdown} onChange={setMarkdown} readonly />`
			},
			description: {
				story:
					"`readonly` forces `view` mode: the markdown is rendered, and the toolbar with it — no formatting controls and no mode menu. It differs from `disabled` in that the text still looks normal and can be selected, so it reads as content and not as a dead control."
			}
		}
	}
};

/*
 * The mode round-trip, shown instead of asserted.
 *
 * The document below is the same awkward one the `value-untouched` tests use: syntax a
 * serializer is tempted to tidy up. Switching modes must not change a byte of it. The
 * first real edit writes the whole document again in the editor's own style.
 */
const AWKWARD_MARKDOWN = [
	"title: Release notes",
	"tags: [markdown, editor]",
	"# Release notes",
	"Straight after the heading, with no blank line between them.",
	"",
	"",
	"",
	"Three blank lines above this one.",
	"",
	"Setext heading",
	"==============",
	"",
	"Another one",
	"-----------",
	"",
	"* asterisk bullet",
	"* still an asterisk",
	"  * two-space nesting",
	"     * five-space nesting",
	"+ plus bullet",
	"",
	"1) paren ordinal",
	"2) second",
	"   1. three-space nested ordinal",
	"",
	"- [ ] open task",
	"- [x] done task",
	"\t- tab-indented child",
	"",
	"> A quote",
	"> with a lazy",
	"continuation line.",
	"",
	"Inline: **bold**, *italic*, `code`, ~~struck~~, <mark>marked</mark>, H<sub>2</sub>O,",
	"a literal backslash-n \\n, an entity &amp; and a numeric one &#42;.",
	"",
	"A hard break lives at the end of this line.  ",
	"So this is still the same paragraph.",
	"",
	"| One  | Two    | Three |",
	"| ---- | ------ | ----- |",
	"| a    | `b|c`  |     1 |",
	"",
	"```js",
	'const fence = "holds ``` inside a string";',
	"```",
	"",
	"    an indented code block",
	"    second line",
	"",
	"See [the reference][ref] and ![an image][img].",
	"A bare autolink: https://example.com and <https://example.org>.",
	"",
	"A footnote reference[^note].",
	"",
	'<div class="raw">',
	"  <span>an HTML block</span>",
	"</div>",
	"",
	"---",
	"",
	"***",
	"",
	"___",
	"",
	'[ref]: https://example.com/reference "With a title"',
	"[img]: https://example.com/a.png",
	"",
	"[^note]: The footnote body.",
	""
].join("\n");

interface LineDifference {
	line: number;
	before: string;
	after: string;
}

/** The first line that differs, so a change is easy to find in a long document. */
function findFirstDifference(original: string, current: string): LineDifference | null {
	const originalLines = original.split("\n");
	const currentLines = current.split("\n");
	const lineCount = Math.max(originalLines.length, currentLines.length);

	for (let index = 0; index < lineCount; index += 1) {
		if (originalLines[index] !== currentLines[index]) {
			return {
				line: index + 1,
				before: originalLines[index] ?? "(end of document)",
				after: currentLines[index] ?? "(end of document)"
			};
		}
	}

	return null;
}

const SANDBOX_LAYOUT_STYLE = { display: "flex", flexDirection: "column", gap: 12 } as const;

const SANDBOX_NOTE_STYLE = {
	margin: 0,
	fontSize: 12,
	opacity: 0.6,
	fontFamily: "ui-monospace, monospace",
	maxWidth: "78ch"
} as const;

const ROUND_TRIP_BADGE_STYLE = {
	padding: "8px 12px",
	borderRadius: 6,
	border: "1px solid currentColor",
	fontFamily: "ui-monospace, monospace",
	fontSize: 13
} as const;

/**
 * Keeps the markdown the way a form does, and says, live, whether what it holds is
 * still the text it started with.
 */
function RoundTripSandbox({ onChange, value, ...args }: SandboxProps): ReactElement {
	const [markdown, setMarkdown] = useState(AWKWARD_MARKDOWN);
	const [modeSwitchCount, setModeSwitchCount] = useState(0);

	const unchanged = markdown === AWKWARD_MARKDOWN;
	const difference = unchanged ? null : findFirstDifference(AWKWARD_MARKDOWN, markdown);

	return (
		<div style={SANDBOX_LAYOUT_STYLE}>
			<div style={ROUND_TRIP_BADGE_STYLE}>
				<strong>{unchanged ? "✅ Value untouched — byte for byte" : "✏️ Value re-written by an edit"}</strong>
				<div style={{ opacity: 0.75, marginTop: 4 }}>
					{markdown.length.toLocaleString()} characters · {modeSwitchCount} mode switches so far
				</div>
				{difference ? (
					<div style={{ marginTop: 8 }}>
						First difference on line {difference.line}:
						<div style={{ marginTop: 4 }}>
							<div>
								before: <code>{JSON.stringify(difference.before)}</code>
							</div>
							<div>
								after:&nbsp; <code>{JSON.stringify(difference.after)}</code>
							</div>
						</div>
					</div>
				) : null}
			</div>
			<p style={SANDBOX_NOTE_STYLE}>
				Switch between Edit, Source and Preview as often as you like — the badge stays green. Then type one character
				anywhere and see the whole document take the editor&apos;s own style: a blank line after the heading, three
				blank lines turned into one, <code>&amp;amp;</code> decoded, <code>snake_case</code> escaped. Save again and
				nothing more changes.
			</p>
			<MarkdownEditor
				id="round-trip-markdown-editor"
				label="Release notes"
				{...args}
				value={markdown}
				onChange={(next) => {
					setMarkdown(next);
					onChange(next);
				}}
				onModeChange={() => setModeSwitchCount((count) => count + 1)}
			/>
			<MarkdownValuePanel markdown={markdown} unchanged={unchanged} />
		</div>
	);
}

export const ModeRoundTrip: Story = {
	argTypes: sandboxArgTypes,
	// The badge has to move on the keystroke that changes the document, so this one emits per edit.
	args: {
		emitMode: "change",
		maxHeight: 620,
		minHeight: 420
	},
	render: (args) => <RoundTripSandbox {...args} />,
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// "change" emits on every edit, so the value panel follows each keystroke and each mode switch.
<MarkdownEditor id="description" label="Description" value={markdown} onChange={setMarkdown} emitMode="change" allowedModes={["edit", "source", "view"]} />`
			},
			description: {
				story:
					"A round-trip between the three modes, with a live comparison against the original text. The document is the awkward one from the automated tests: front matter, three blank lines in a row, setext headings, `*` and `+` bullets, two- and five-space nesting, tab-indented items, `1)` ordinals, a lazy quote continuation, HTML entities, a hard break, a table with an escaped pipe inside a code span, and a fenced block that holds a fence inside a string. Switch modes as often as you like — the badge stays green and the value does not move by a byte, because looking is not editing. Type one character and the badge flips: the editor writes the whole document again in its own style (blank line after a heading, blank lines collapsed, entities decoded, `_` and `<` escaped). Nothing is lost — only the spelling of the markdown changes — and it happens once: edit again and the output stays put."
			}
		}
	}
};

/**
 * The size the editor is documented as staying smooth at: about 100,000 characters,
 * which is also about 25,000 words, because the sentences below use short words.
 *
 * The counted limits are pinned by `performance/scalability.test.tsx` in `widgets-core`,
 * and `performance/benchmark.test.tsx` there prints the milliseconds quoted below.
 */
const SMOOTH_CEILING_CHARACTERS = 100_000;

/** The sizes the sandbox offers, in characters, because that is how the limit is written. */
const DOCUMENT_SIZES = [25_000, 50_000, SMOOTH_CEILING_CHARACTERS, 200_000];

/**
 * The size the sandbox opens with. It is a quarter of the ceiling, so the story is ready
 * to type in right away; click a bigger size to load one.
 */
const STARTING_CHARACTERS = 25_000;

/** How many keystrokes the sandbox keeps, so one slow frame does not decide the number. */
const KEYSTROKE_SAMPLE_COUNT = 10;

/** Words the way a person counts them. This prose runs about six characters to a word. */
function countWords(text: string): number {
	return text.split(/\s+/u).filter(Boolean).length;
}

/**
 * Sentences the document is built from, carrying bold, italic, code, strikethrough and a link.
 *
 * The limit is written as a pair — about 100,000 characters, about 25,000 words — and only short
 * words put both on one document: 100,000 over 25,000 is four characters a word, counting the
 * space. Ordinary prose runs nearer six and would need about 150,000 characters to hold 25,000
 * words. These sentences say something and still average four, which is why they read plainly.
 *
 * Markup costs characters but adds no words, so the link is kept short and a few plain sentences
 * are here to balance it. Together they land within half a percent of four.
 */
const SENTENCES = [
	"The **cat** sat on the mat and had a nap in the sun.",
	"We can go by bus or by car, but not on foot.",
	"He put the box on the *top* shelf and shut the door.",
	"She had a cup of tea and read the news for an hour.",
	"The ~~dog~~ fox ran out the gate and did not come back.",
	"You may use the `old` map if you can not find the new one.",
	"It was a fine day, so we sat by the sea and ate.",
	"Ask him for the [key](/docs) and let me know.",
	"The bus was late, so I ran all the way to work.",
	"Put the pen on my desk and tell her I am *not* in.",
	"They dug a hole in the mud and put a **tin** box in it.",
	"I can not see the top of the hill from the road.",
	"He is not in yet, so I put it on his desk.",
	"We had to go, as it was too wet to sit out.",
	"She let me use her pen for a bit."
];

/** The sentence at `position`, so two loads build the same document. */
function sentenceAt(position: number): string {
	return SENTENCES[position % SENTENCES.length]!;
}

/**
 * One block of the generated document.
 *
 * The mix is here so the surface has every shape to draw and the tokenizer every construct to
 * find: headings, fenced code, tables, quotes, task lists, bullet lists and plain paragraphs.
 * The first match wins, so the rarer shapes are checked first.
 */
function buildMarkdownBlock(index: number): string {
	if (index % 12 === 0) {
		return `## Part ${index}`;
	}

	if (index % 23 === 0) {
		return "```js\nconst sum = a + b;\nreturn sum;\n```";
	}

	if (index % 19 === 0) {
		return `| Day | Rate |\n| --- | --- |\n| Mon | ${index} |\n| Tue | ${index + 1} |`;
	}

	if (index % 17 === 0) {
		return `> ${sentenceAt(index)}`;
	}

	if (index % 13 === 0) {
		return `- [ ] ${sentenceAt(index)}\n- [x] ${sentenceAt(index + 3)}`;
	}

	if (index % 7 === 0) {
		return `- ${sentenceAt(index)}\n- ${sentenceAt(index + 5)}`;
	}

	return `${sentenceAt(index * 3)} ${sentenceAt(index * 3 + 1)}`;
}

/** Builds a document of about `characters` characters out of the same block mix. */
function buildMarkdownOfLength(characters: number): string {
	const blocks: string[] = [];
	let length = 0;

	for (let index = 0; length < characters; index += 1) {
		const block = buildMarkdownBlock(index);
		blocks.push(block);
		length += block.length + 2;
	}

	return blocks.join("\n\n");
}

/** `100000` reads as `100K`, which is how the sizes are written on the buttons. */
function formatThousands(characters: number): string {
	return `${Math.round(characters / 1000)}K`;
}

function medianOf(values: readonly number[]): number {
	const sorted = [...values].sort((left, right) => left - right);

	return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

/**
 * Waits for the frame that shows the change, then says how long it took since
 * `startedAt`.
 *
 * Two frames are needed. The first one is the frame the browser is already drawing when
 * we ask; the second is the one that holds the new text.
 */
function reportWhenPainted(startedAt: number, report: (milliseconds: number) => void): void {
	requestAnimationFrame(() => requestAnimationFrame(() => report(performance.now() - startedAt)));
}

const SIZE_BUTTON_ROW_STYLE = {
	display: "flex",
	gap: 8,
	alignItems: "center",
	flexWrap: "wrap",
	fontFamily: "ui-monospace, monospace",
	fontSize: 13
} as const;

function sizeButtonStyle(selected: boolean): Record<string, string | number> {
	return {
		padding: "3px 10px",
		borderRadius: 6,
		border: "1px solid currentColor",
		cursor: "pointer",
		fontFamily: "ui-monospace, monospace",
		fontSize: 13,
		opacity: selected ? 1 : 0.6,
		fontWeight: selected ? 700 : 400,
		background: "transparent",
		color: "inherit"
	};
}

/**
 * A sandbox for big documents: pick a size to load the editor with that much markdown,
 * then type into it and watch the two readouts.
 *
 * Both numbers are rough in-browser readings, taken at the frame the browser painted,
 * and they belong to the machine you are on. They are here to be felt, not quoted —
 * `benchmark.test.tsx` in `widgets-core` is where the real numbers come from.
 */
function LargeDocumentSandbox({ onChange, value, ...args }: SandboxProps): ReactElement {
	const [documentSize, setDocumentSize] = useState(STARTING_CHARACTERS);
	const [markdown, setMarkdown] = useState(() => buildMarkdownOfLength(STARTING_CHARACTERS));
	const [loadCount, setLoadCount] = useState(0);
	const [loadMilliseconds, setLoadMilliseconds] = useState<number | null>(null);
	const [keystrokeMilliseconds, setKeystrokeMilliseconds] = useState<number | null>(null);

	const loadStartedAt = useRef(performance.now());
	const keystrokeSamples = useRef<number[]>([]);
	const surroundingElement = useRef<HTMLDivElement | null>(null);

	const load = useCallback((size: number): void => {
		loadStartedAt.current = performance.now();
		keystrokeSamples.current = [];
		setLoadMilliseconds(null);
		setKeystrokeMilliseconds(null);
		setDocumentSize(size);
		setMarkdown(buildMarkdownOfLength(size));
		setLoadCount((count) => count + 1);
	}, []);

	// Runs on the first render and after every load, because the `key` below builds a
	// new editor each time.
	useEffect(() => {
		reportWhenPainted(loadStartedAt.current, setLoadMilliseconds);
	}, [loadCount]);

	/*
	 * Keystroke latency, from the key going down to the frame that shows the letter.
	 *
	 * The listener is added by hand instead of with an `onKeyDown` prop: the editor has
	 * no such prop, and a `div` that handles keys is not something a11y lint allows.
	 */
	useEffect(() => {
		const element = surroundingElement.current;

		if (!element) {
			return undefined;
		}

		const onKeyDown = (): void => {
			const startedAt = performance.now();

			reportWhenPainted(startedAt, (milliseconds) => {
				const samples = [...keystrokeSamples.current, milliseconds].slice(-KEYSTROKE_SAMPLE_COUNT);
				keystrokeSamples.current = samples;
				setKeystrokeMilliseconds(medianOf(samples));
			});
		};

		element.addEventListener("keydown", onKeyDown);

		return (): void => element.removeEventListener("keydown", onKeyDown);
	}, [loadCount]);

	const pastTheLimit = documentSize > SMOOTH_CEILING_CHARACTERS;
	const loadReadout = loadMilliseconds === null ? "loading…" : `load ≈ ${Math.round(loadMilliseconds)} ms`;
	const keystrokeReadout =
		keystrokeMilliseconds === null
			? "type to measure a keystroke"
			: `keystroke ≈ ${keystrokeMilliseconds.toFixed(1)} ms`;

	return (
		<div style={SANDBOX_LAYOUT_STYLE}>
			<div style={SIZE_BUTTON_ROW_STYLE}>
				<strong>Load characters:</strong>
				{DOCUMENT_SIZES.map((size) => (
					<button key={size} type="button" onClick={() => load(size)} style={sizeButtonStyle(size === documentSize)}>
						{formatThousands(size)}
						{size === SMOOTH_CEILING_CHARACTERS ? " ✓" : ""}
					</button>
				))}
				<span style={{ opacity: 0.75 }}>
					{markdown.length.toLocaleString()} chars · {countWords(markdown).toLocaleString()} words ·{" "}
					{markdown.split("\n\n").length.toLocaleString()} blocks
					{pastTheLimit ? " · past the supported size" : ""} · {loadReadout} · {keystrokeReadout}
				</span>
			</div>
			<p style={SANDBOX_NOTE_STYLE}>
				Click a size to load the editor with that much markdown, then type in the middle of it. The editor is supported
				up to about 100,000 characters — about 25,000 words — which is the size marked ✓. It opens at 25K so it is ready
				to type in right away. 200K is past the limit on purpose, so the drop-off can be felt: loading takes about twice
				as long, while typing stays about the same. Both readouts are rough numbers for this machine; the measured ones
				live in <code>benchmark.test.tsx</code>.
			</p>
			<div key={loadCount} ref={surroundingElement}>
				<MarkdownEditor
					id="large-document-markdown-editor"
					label="Large document"
					{...args}
					value={markdown}
					onChange={(next) => {
						setMarkdown(next);
						onChange(next);
					}}
				/>
			</div>
		</div>
	);
}

export const LargeDocument: Story = {
	argTypes: sandboxArgTypes,
	args: {
		initialMode: "edit",
		maxHeight: 600,
		minHeight: 360
	},
	render: (args) => <LargeDocumentSandbox {...args} />,
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Nothing special on the editor side. The sandbox generates the document and times the keystrokes.
<MarkdownEditor id="description" label="Description" value={markdown} onChange={setMarkdown} allowedModes={["edit", "source", "view"]} minHeight={360} maxHeight={600} />`
			},
			description: {
				story:
					"How the editor holds up as the document grows. Pick a size to load that much markdown, then type in the middle of it and watch the keystroke readout.\n\nThe supported size is about **100,000 characters (~25,000 words, ~1,150 blocks)** — the size marked ✓. The words are short on purpose, so one document reaches both halves of the limit at once; ordinary prose runs nearer six characters to a word and would need about 150,000 characters to hold 25,000 words.\n\nMeasured at the same character count in headless Chromium: loading the whole widget about **185 ms**, one keystroke in edit mode about **8 ms**, one in source mode about **6 ms**, and a switch from Edit to Source about **380 ms**. Typing does not get slower as the document grows (8.3 ms at 100K against 8.4 ms at 10K), because a keystroke never reads the whole document: only the block the caret is in is parsed again, and the markdown for the host is built on a debounce instead of once per key. What does grow is the one-off work — loading and switching modes — which is why the limit sits where it does. At 200K the load takes about twice as long, so that size is here to be felt, not supported.\n\nBoth readouts are rough in-browser numbers for the machine you are on. The millisecond figures above come from `performance/benchmark.test.tsx` in `widgets-core`, whose document uses longer words, so it holds fewer blocks than this one and its readings sit a little lower. The counted promises are pinned by `performance/scalability.test.tsx`."
			}
		}
	}
};

function EditorHandleSandbox({ value, onChange, ...args }: SandboxProps): ReactElement {
	const [markdown, setMarkdown] = useState(value);
	const [log, setLog] = useState<string[]>([]);
	const editor = useRef<MarkdownEditorHandle>(null);

	const record = (entry: string): void => setLog((entries) => [...entries.slice(-4), entry]);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
				<Button label="Insert heading" onClick={() => editor.current?.insertMarkdown("## Inserted\n")} />
				<Button
					label="Read selection"
					onClick={() => record(`selection: ${JSON.stringify(editor.current?.getSelectedMarkdown() ?? "")}`)}
				/>
				<Button label="Flush" onClick={() => editor.current?.flush()} />
				<Button label="Undo" onClick={() => editor.current?.undo()} />
				<Button label="Redo" onClick={() => editor.current?.redo()} />
				<Button label="Focus" onClick={() => editor.current?.focus()} />
				<Button label="Read mode" onClick={() => record(`mode: ${editor.current?.mode ?? "none"}`)} />
			</div>
			<MarkdownEditor
				{...args}
				editorRef={editor}
				value={markdown}
				onChange={(next) => {
					setMarkdown(next);
					onChange(next);
				}}
			/>
			<pre style={{ margin: 0, fontSize: 12 }}>{log.join("\n") || "Click a button above."}</pre>
			<MarkdownValuePanel markdown={markdown} />
		</div>
	);
}

export const EditorHandle: Story = {
	args: {
		id: "editor-handle-markdown-editor",
		label: "Description",
		value: SAMPLE_MARKDOWN,
		allowedModes: ["edit", "source", "view"],
		minHeight: 240
	},
	render: (args) => <EditorHandleSandbox {...args} />,
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `const editor = useRef<MarkdownEditorHandle>(null);

<Button label="Insert heading" onClick={() => editor.current?.insertMarkdown("## Inserted\\n")} />
<Button label="Flush" onClick={() => editor.current?.flush()} />

<MarkdownEditor
	editorRef={editor}
	value={markdown}
	onChange={setMarkdown}
	allowedModes={["edit", "source", "view"]}
/>`
			},
			description: {
				story:
					"`editorRef` fills a `MarkdownEditorHandle`. Every method works on the surface the user can see: " +
					"insert in edit mode and the heading appears as rich text; insert in source mode and it lands as " +
					"raw markdown at the caret. `flush` sends a pending debounced edit at once — type, click it, and " +
					"the value panel catches up without waiting. In view mode the writing methods do nothing and " +
					"reading still works."
			}
		}
	}
};
