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

interface TextTypes {
	content: string;
	title: string;
}

interface TranslatedTexts {
	EN: TextTypes;
	DE: TextTypes;
	FR: TextTypes;
}

export interface Language {
	name: string;
	value: "EN" | "DE" | "FR";
}

export const data: Language[] = [
	{
		name: "English",
		value: "EN"
	},
	{
		name: "Deutsch",
		value: "DE"
	},
	{
		name: "Français",
		value: "FR"
	}
];

export const translatedTexts: TranslatedTexts = {
	EN: {
		content:
			"This is content text. It can be translated by changing the language in the popup menu. We hope you are enjoying using the Widgets library. Did you know A12 has been around since 2012? That's a long time. Widgets have also been around for several years.",
		title: "Title"
	},
	DE: {
		content:
			"Dies ist Inhaltstext. Es kann übersetzt werden, indem Sie die Sprache im Popup-Menü ändern. Wir hoffen, dass Ihnen die Verwendung der Widgets-Bibliothek gefällt. Wussten Sie, dass es A12 seit 2012 gibt? Das ist eine lange Zeit. Auch Widgets gibt es schon seit einigen Jahren.",
		title: "Titel"
	},
	FR: {
		content:
			"Ceci est un texte de contenu. Il peut être traduit en changeant la langue dans le menu contextuel. Nous espérons que vous appréciez l'utilisation de la bibliothèque Widgets. Saviez-vous que A12 existe depuis 2012 ? C'est une longue période. Les widgets existent également depuis plusieurs années.",
		title: "Titre"
	}
};
