import collect from './collector.js';

const exists = (selector: string) => Boolean(document.querySelector(selector));

collect.set('__urls_that_dont_match__', [

]);

export const isCanvasLMS = (): boolean => exists('meta[name="apple-itunes-app"][content="app-id=480883488"]');

export const is404 = (): boolean => document.title.startsWith('Page not found');

export const is500 = (): boolean => document.title === 'Server Error' || document.title === '504 Gateway Time-out';

export const isPasswordConfirmation = (): boolean => document.title === 'Confirm password' || document.title === 'Confirm access';

export const isDashboard = (): boolean => isCanvasLMS() && document.title === 'Dashboard';

export const isCourse = (url: URL | HTMLAnchorElement | Location = location): boolean => /^courses\/(\d+)$/.test(getCleanPathname(url));
collect.set('isCourse', [
	'https://school.instructure.com/courses/9999',
	'https://notexsist.instructure.com/courses/9999',
]);

export const isAllPages = (url: URL | HTMLAnchorElement | Location = location): boolean => /^courses\/(\d+)\/pages$/.test(getCleanPathname(url));
collect.set('isAllPages', [
	'https://school.instructure.com/courses/9999/pages',
	'https://school.instructure.com/courses/9999/pages//',
]);

export const isPage = (url: URL | HTMLAnchorElement | Location = location): boolean => /^courses\/(\d+)\/pages\/([a-z-_\d])/.test(getCleanPathname(url));
collect.set('isPage', [
	'https://school.instructure.com/courses/9999/pages/canvas-tutorials',
	'https://school.instructure.com/courses/9999/pages/canvas-tutorials//',
]);

export const isSyllabus = (url: URL | HTMLAnchorElement | Location = location): boolean => /^courses\/(\d+)\/assignments\/syllabus/.test(getCleanPathname(url));
collect.set('isSyllabus', [
	'https://school.instructure.com/courses/9999/assignments/syllabus',
	'https://school.instructure.com/courses/9999/assignments/syllabus//',
]);

/** Drop all duplicate slashes */
const getCleanPathname = (url: URL | HTMLAnchorElement | Location = location): string => url.pathname.replace(/\/+/g, '/').slice(1, url.pathname.endsWith('/') ? -1 : undefined);

export const utils = {
	getCleanPathname,
};
