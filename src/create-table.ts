export type Table = string[][];

export interface Config {
	firstRowHeaders?: boolean;
	eol?: string;
}

const DEFAULT_CONFIG = {
	firstRowHeaders: false,
	eol: '\n',
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

export const jira = (table: Table, config: Config = {}): string => {
	const mergedConfig = {
		...DEFAULT_CONFIG,
		...config,
	};
	const { firstRowHeaders, eol } = mergedConfig;
	return table.map((row, i) => {
		const delim = firstRowHeaders && i === 0 ? '||' : '|';
		return delim + row.join(delim) + delim;
	}).join(eol);
};

const markdownWithHeaders = (table: Table, config: Config): string => {
	const { eol } = config;
	const delim = '|';
	const firstRow = table[0];
	const headers = (
		delim + firstRow.join(delim) + delim +
		eol +
		delim + firstRow.map(() => '-').join(delim) + delim
	);
	return headers + eol + table.slice(1).map((row, i) => {
		return row.join(delim);
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
		return row.join(delim);
	}).map((line) => delim + line + delim).join(eol);
};

export const markdown = (table: Table, config: Config = {}): string => {
	const mergedConfig = {
		...DEFAULT_CONFIG,
		...config,
	};
	const { firstRowHeaders } = mergedConfig;
	if (firstRowHeaders) {
		return markdownWithHeaders(table, mergedConfig);
	} else {
		return markdownWithoutHeaders(table, mergedConfig);
	}
};
