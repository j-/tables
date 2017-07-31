export type Table = string[][];

export interface Config {
	headerCount?: number;
	eol?: string;
}

export type Formatter = (table: Table, config?: Config) => string;

const DEFAULT_CONFIG = {
	headerCount: 0,
	eol: '\n',
};

export const escapeCell = (input: string): string => {
	return input.replace(/\|/g, '\\|');
};

export const parseTable = (input: string): Table => {
	return input.trim().split(/\r?\n/g).map((line) => (
		line.split(/\t/g)
	));
};

export const countColumns = (table: Table) => {
	return table.reduce((max, row) => (
		Math.max(max, row.length)
	), 0);
};

export const jira: Formatter = (table: Table, config: Config = {}): string => {
	const mergedConfig = {
		...DEFAULT_CONFIG,
		...config,
	};
	const { headerCount, eol } = mergedConfig;
	return table.map((row, i) => {
		const delim = i < headerCount ? '||' : '|';
		return delim + row.map(escapeCell).join(delim) + delim;
	}).join(eol);
};

const markdownEmptyRow = (table: Table, config: Config): string => {
	const delim = '|';
	const cols = countColumns(table);
	let result = '';
	for (let i = 0; i < cols; i++) {
		result += delim + ' ';
	}
	result += delim;
	return result;
};

const markdownSplitterRow = (table: Table, config: Config): string => {
	const delim = '|';
	const cols = countColumns(table);
	let result = '';
	for (let i = 0; i < cols; i++) {
		result += delim + '-';
	}
	result += delim;
	return result;
};

const markdownWithHeaders = (table: Table, config: Config): string => {
	const { headerCount, eol } = config;
	const delim = '|';
	const headers = table.slice(0, headerCount).map((row) => (
		delim + row.map(escapeCell).join(delim) + delim
	)).join(eol) + eol + markdownSplitterRow(table, config);
	return (headers + eol + table.slice(headerCount).map((row, i) => {
		return row.map(escapeCell).join(delim);
	}).map((line) => delim + line + delim).join(eol)).trim();
};

const markdownWithoutHeaders = (table: Table, config: Config): string => {
	const { eol } = config;
	const delim = '|';
	const headers = markdownEmptyRow(table, config) + eol + markdownSplitterRow(table, config);
	return headers + eol + table.map((row, i) => {
		return row.map(escapeCell).join(delim);
	}).map((line) => delim + line + delim).join(eol);
};

export const markdown: Formatter = (table: Table, config: Config = {}): string => {
	const mergedConfig = {
		...DEFAULT_CONFIG,
		...config,
	};
	const { headerCount } = mergedConfig;
	if (headerCount) {
		return markdownWithHeaders(table, mergedConfig);
	} else {
		return markdownWithoutHeaders(table, mergedConfig);
	}
};
