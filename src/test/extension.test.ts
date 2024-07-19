import * as assert from 'assert';
import * as vscode from 'vscode';
import { activate, convertStraightQuotesToCurly } from '../extension';

suite('Smarten Quotes Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	suite('convertStraightQuotesToCurly', () => {

		test('Converts straight quotes to curly quotes', () => {
			const straight = 'This is a "test" of straight quotes.';
			const curly = 'This is a “test” of straight quotes.';
			assert.strictEqual(curly, convertStraightQuotesToCurly(straight));

		});

		test('Does not convert quotes inside HTML tags', () => {
			const html = '<p class="test">This is a "test" of straight quotes.</p>';
			const curly = '<p class="test">This is a “test” of straight quotes.</p>';
			assert.strictEqual(curly, convertStraightQuotesToCurly(html));
		});

		test('Does not convert quotes inside Markdown inline code', () => {
			const md = 'This is a `"test"` of straight quotes.';
			assert.strictEqual(md, convertStraightQuotesToCurly(md));
		});

		test('Does not convert quotes inside Markdown code blocks', () => {
			const md = '```\nThis is a "test" of straight quotes.\n```';
			assert.strictEqual(md, convertStraightQuotesToCurly(md));
		});

		test('Converts quotes inside Markdown links', () => {
			const md = '[This is a "test" of straight quotes.](https://example.com)';
			const curly = '[This is a “test” of straight quotes.](https://example.com)';
			assert.strictEqual(curly, convertStraightQuotesToCurly(md));
		});

		test('Converts quotes inside Markdown links with title', () => {
			const md = '[This is a "test" of straight quotes.](https://example.com "Title")';
			const curly = '[This is a “test” of straight quotes.](https://example.com "Title")';
			assert.strictEqual(curly, convertStraightQuotesToCurly(md));
		});
	});
});