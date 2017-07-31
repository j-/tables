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

const markdownWithHeaders = (table: Table, config: Config): string => {
	const { eol } = config;
	const delim = '|';
	const firstRow = table[0];
	const headers = (
		delim + firstRow.map(escapeCell).join(delim) + delim +
		eol +
		delim + firstRow.map(() => '-').join(delim) + delim
	);
	return headers + eol + table.slice(1).map((row, i) => {
		return row.map(escapeCell).join(delim);
	}).map((line) => delim + line + delim).join(eol);
};

const markdownWithoutHeaders = (table: Table, config: Config): string => {
	const { eol } = config;
	const delim = '|';
	const cols = countColumns(table);
	let headers = '';
	for (let i = 0; i < cols; i++) {
		headers += delim + ' ';
	}
	headers += delim + eol;
	for (let i = 0; i < cols; i++) {
		headers += delim + '-';
	}
	headers += delim;
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
