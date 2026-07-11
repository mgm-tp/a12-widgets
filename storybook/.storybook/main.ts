import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@storybook/addon-themes",
		"@storybook/addon-vitest",
		"@storybook/addon-a11y",
		{
			name: "@storybook/addon-docs",
			options: {
				mdxPluginOptions: {
					mdxCompileOptions: {
						// Enable GitHub-flavored markdown so MDX tables (pipe syntax) render as <table>.
						remarkPlugins: [remarkGfm]
					}
				}
			}
		}
	],
	framework: "@storybook/react-vite"
};
export default config;
