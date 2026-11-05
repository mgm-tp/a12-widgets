import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

/**
 * The same treatment `ApplicationFrame` gives the viewport meta on a phone (see
 * `application-frame.view.tsx`): iOS zooms into any field whose font size is under 16px as it takes
 * the focus, and Android lets the on-screen keyboard cover the content instead of resizing for it.
 * Storybook renders widgets bare, with no frame around them to do this — so a story tested on a
 * device behaves worse than the same widget in an application would.
 *
 * It goes into both documents: the preview iframe, which is what to open directly on a device, and
 * the manager shell that embeds it — a meta viewport only ever governs its own top-level document.
 */
const MOBILE_VIEWPORT_FIX = `<script>
	(function () {
		var meta = document.querySelector("meta[name=viewport]");
		var content = meta && meta.getAttribute("content");

		if (!content) {
			return;
		}

		var userAgent = navigator.userAgent || navigator.vendor;

		if (/iPad|iPhone/.test(userAgent) && !content.includes("maximum-scale")) {
			meta.setAttribute("content", content + ", maximum-scale=1");
		}

		if (/android/i.test(userAgent) && !content.includes("interactive-widget")) {
			meta.setAttribute("content", content + ", interactive-widget=resizes-content");
		}
	})();
</script>`;

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
	framework: "@storybook/react-vite",
	previewHead: (head) => `${head}${MOBILE_VIEWPORT_FIX}`,
	managerHead: (head) => `${head}${MOBILE_VIEWPORT_FIX}`
};
export default config;
