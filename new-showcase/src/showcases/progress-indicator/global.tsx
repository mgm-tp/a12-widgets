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

import type { FC } from "react";
import { useState, useCallback, useEffect } from "react";

import { Button, ProgressIndicator, provider } from "@com.mgmtp.a12.widgets/widgets-core";

export const GlobalProgressIndicatorShowcase: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [seconds, setSeconds] = useState(0);
	const isNotDesktop = !provider.isDesktop();

	const escKeyListener = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape") {
				isOpen && setIsOpen(false);
			}
		},
		[isOpen]
	);

	useEffect(() => {
		document.addEventListener("keydown", escKeyListener, false);

		return () => {
			document.removeEventListener("keydown", escKeyListener, false);
		};
	}, [escKeyListener]);

	const handleIsOpen = (): void => {
		setIsOpen(true);

		if (isNotDesktop) {
			setSeconds(3);
		}
	};

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;

		if (isOpen && isNotDesktop) {
			intervalId = setInterval(() => {
				setSeconds((prevSeconds) => {
					if (prevSeconds === 1) {
						setIsOpen(false);
					}

					return prevSeconds - 1;
				});
			}, 1000);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isOpen, isNotDesktop]);

	return (
		<div>
			<Button primary label="Show Progress Indicator" onClick={handleIsOpen} />
			{isOpen && <ProgressIndicator global label={isNotDesktop ? `closing in ${seconds}` : "Loading..."} />}
		</div>
	);
};
