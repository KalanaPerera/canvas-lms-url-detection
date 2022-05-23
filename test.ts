import test from 'ava';
import {JSDOM} from 'jsdom';
import stripIndent from 'strip-indent';
import collector from './collector.js';
import * as pageDetect from '.';

const {window} = new JSDOM('…');

(global as any).document = window.document;
(global as any).location = new URL('https://school.instructure.com/');

const allUrls = new Set<string>([...collector.values()].flat());
allUrls.delete('combinedTestOnly');

for (const [detectName, detect] of Object.entries(pageDetect)) {
	if (typeof detect !== 'function') {
		continue;
	}

	const validURLs = collector.get(detectName);

	if (validURLs === 'combinedTestOnly' || String(detect).startsWith('() =>')) {
		continue;
	}

	test(detectName + ' has tests', t => {
		t.true(
			Array.isArray(validURLs),
			`The function \`${detectName}\` doesn’t have any tests. Set them via \`collect.set()\``,
		);
	});

	if (!Array.isArray(validURLs)) {
		continue;
	}

	for (const url of validURLs) {
		test(`${detectName} ${url.replace('https://school.instructure.com', '')}`, t => {
			t.true(
				detect(new URL(url)),
				stripIndent(`
					Is this URL \`${detectName}\`?
						${url.replace('https://school.instructure.com', '')}

					• Yes? The \`${detectName}\` test is wrong and should be fixed.
					• No? Remove it from its \`collect.set()\` array.
				`),
			);
		});
	}

	// Skip negatives for this one, it's too long
	if (detectName === 'isRepo') {
		continue;
	}

	for (const url of allUrls) {
		if (!validURLs.includes(url)) {
			test(`${detectName} NO ${url}`, t => {
				t.false(
					detect(new URL(url)),
					stripIndent(`
						Is this URL \`${detectName}\`?
							${url.replace('https://school.instructure.com', '')}

						• Yes? Add it to the \`collect.set()\` array.
						• No? The \`${detectName}\` test is wrong and should be fixed.
					`),
				);
			});
		}
	}
}

test('is404', t => {
	document.title = 'Page not found';
	t.true(pageDetect.is404());
});

test('is500', t => {
	document.title = 'Server Error';
	t.true(pageDetect.is500());

	document.title = '504 Gateway Time-out';
	t.true(pageDetect.is500());
});
