import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		"jjeff.smartenQuotes",
		() => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const document = editor.document;
				const selection = editor.selection;
				const text = document.getText(selection);

				const convertedText = convertStraightQuotesToCurly(text);

				editor.edit((editBuilder) => {
					editBuilder.replace(selection, convertedText);
				});
			}
		}
	);

	context.subscriptions.push(disposable);
}

/**
 * Converts straight quotes to curly quotes in the given text.
 *
 * This function will not convert quotes inside HTML tags, or
 * Markdown inline code, code blocks, or links.
 *
 * @param text - The text to convert.
 * @returns The text with straight quotes replaced by curly quotes.
 */
export function convertStraightQuotesToCurly(text: string): string {
	const regex = /(<[^>]+>)|(`[^`]*`)|(```[\s\S]*?```)|(\[[^\]]*\]\([^\)]+(?: "[^"]*")?\))|("([^"]*)")|('([^']*)')/g;
	return text.replace(regex, (match, tag, inlineCode, codeBlock, linkOrImage: string, dblQuotes, dblContent, sngQuotes, sngContent) => {
		if (tag || inlineCode || codeBlock) {
			return match; // Return these matches unchanged
		} else if (linkOrImage) {
			// Process link text and leave title unchanged
			return linkOrImage.replace(/(\[[^\]]*\])\(([^"]*)(?: "([^"]*)")?\)/, (match, p1, p2, p3) => {
				const linkText = convertStraightQuotesToCurly(p1); // Convert quotes in link text
				const linkUrl = p2; // Leave URL unchanged
				const linkTitle = p3 ? ` "${p3}"` : ''; // Leave title unchanged if present
				return `${linkText}(${linkUrl}${linkTitle})`;
			});
		} else if (dblQuotes) {
			return `“${dblContent}”`; // Replace double quotes outside protected contexts
		} else if (sngQuotes) {
			return `‘${sngContent}’`; // Replace single quotes outside protected contexts
		}
		return match; // Fallback, should not be reached
	});

}

export function deactivate() { }
