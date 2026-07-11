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
import { useState, useRef } from "react";
import { fn } from "storybook/test";

import { Toast, ToastGroup, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Toast> = {
	title: "Feedback/Toasts",
	component: Toast,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["info", "success", "warning", "error"],
			description: "Visual variant — controls color and icon of the toast"
		},
		type: {
			control: "select",
			options: ["temporary", "permanent"],
			description: 'Whether the toast auto-dismisses ("temporary") or stays until closed manually ("permanent")'
		},
		duration: {
			control: { type: "number", min: 500, max: 10000, step: 500 },
			description: "Auto-dismiss delay in milliseconds (only applies to temporary toasts)"
		},
		message: {
			control: "text",
			description: "Main body text of the toast"
		},
		header: {
			control: "text",
			description: "Optional header text displayed above the message"
		},
		onClose: {
			description: "Callback invoked when the toast is closed"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: "info",
		header: "Info",
		message: "Your session will expire in 5 minutes.",
		onClose: fn()
	}
};

export const Info: Story = {
	args: {
		variant: "info",
		header: "Info",
		message: "Your session will expire in 5 minutes.",
		onClose: fn()
	}
};

export const Success: Story = {
	args: {
		variant: "success",
		header: "Success",
		message: "Your changes have been saved successfully.",
		onClose: fn()
	}
};

export const Warning: Story = {
	args: {
		variant: "warning",
		header: "Warning",
		message: "Your storage is almost full. Consider removing unused files.",
		onClose: fn()
	}
};

export const Error: Story = {
	args: {
		variant: "error",
		header: "Error",
		message: "Failed to save changes. Please try again.",
		onClose: fn()
	}
};

export const WithFooterActions: Story = {
	args: {
		variant: "info",
		header: "Update Available",
		message: "A new version of the application is ready to install.",
		footer: (
			<div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
				<Button label="Later" />
				<Button label="Update now" primary />
			</div>
		),
		onClose: fn()
	}
};

export const PermanentToast: Story = {
	args: {
		variant: "warning",
		type: "permanent",
		header: "Action Required",
		message: "Please review and confirm the pending changes before proceeding.",
		onClose: fn()
	}
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
			<Toast variant="info" header="Info" message="This is an informational message." onClose={fn()} />
			<Toast variant="success" header="Success" message="The operation completed successfully." onClose={fn()} />
			<Toast
				variant="warning"
				header="Warning"
				message="Please check the following before continuing."
				onClose={fn()}
			/>
			<Toast variant="error" header="Error" message="Something went wrong. Please try again." onClose={fn()} />
		</div>
	)
};

export const InteractiveToastGroup: Story = {
	render: () => {
		const InteractiveDemo = () => {
			const [toasts, setToasts] = useState<
				Array<{ key: string; variant: "info" | "success" | "warning" | "error"; message: string }>
			>([]);
			const counterRef = useRef<number>(toasts.length);

			const addToast = (variant: "info" | "success" | "warning" | "error") => {
				const messages: Record<string, string> = {
					info: "Your report is being generated.",
					success: "Changes saved successfully.",
					warning: "Disk space is running low.",
					error: "Connection to server lost."
				};
				counterRef.current += 1;
				setToasts((prev) => [
					...prev,
					{ key: `toast-${Date.now()}-${counterRef.current}`, variant, message: messages[variant] }
				]);
			};

			const removeToast = (key: string) => {
				setToasts((prev) => prev.filter((t) => t.key !== key));
			};

			return (
				<div style={{ minHeight: "200px", position: "relative" }}>
					<div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
						<Button label="Info toast" onClick={() => addToast("info")} />
						<Button label="Success toast" onClick={() => addToast("success")} />
						<Button label="Warning toast" onClick={() => addToast("warning")} />
						<Button label="Error toast" destructive onClick={() => addToast("error")} />
					</div>

					<ToastGroup position="top-right">
						{toasts.map((toast) => (
							<Toast
								key={toast.key}
								variant={toast.variant}
								header={toast.variant.charAt(0).toUpperCase() + toast.variant.slice(1)}
								message={toast.message}
								type="permanent"
								onClose={() => removeToast(toast.key)}
							/>
						))}
					</ToastGroup>
				</div>
			);
		};

		return <InteractiveDemo />;
	}
};

export const TemporaryToastDemo: Story = {
	render: () => {
		const TemporaryDemo = () => {
			const [toasts, setToasts] = useState<Array<{ key: string; message: string }>>([]);

			const addTemporaryToast = () => {
				const key = `toast-${Date.now()}`;
				setToasts((prev) => [...prev, { key, message: "This toast will disappear in 3 seconds." }]);
			};

			const removeToast = (key: string) => {
				setToasts((prev) => prev.filter((t) => t.key !== key));
			};

			return (
				<div style={{ minHeight: "150px", position: "relative" }}>
					<Button label="Show temporary toast" primary icon={<Icon>notifications</Icon>} onClick={addTemporaryToast} />

					<ToastGroup position="top-right">
						{toasts.map((toast) => (
							<Toast
								key={toast.key}
								variant="info"
								header="Notification"
								message={toast.message}
								type="temporary"
								duration={3000}
								onClose={() => removeToast(toast.key)}
							/>
						))}
					</ToastGroup>
				</div>
			);
		};

		return <TemporaryDemo />;
	}
};
