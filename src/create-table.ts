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
	return table.map((row, i) => {
		const delim = mergedConfig.firstRowHeaders && i === 0 ? '||' : '|';
		return delim + row.join(delim) + delim;
	}).join(mergedConfig.eol);
};

export const markdown = (table: Table, config: Config = {}): string => {
	const mergedConfig = {
		...DEFAULT_CONFIG,
		...config,
	};
	const delim = '|';
	let prefix;
	let rows;
	if (mergedConfig.firstRowHeaders) {
		const firstRow = table[0];
		prefix = (
			delim + firstRow.join(delim) + delim +
			mergedConfig.eol +
			delim + firstRow.map(() => '-').join(delim) + delim
		);
		rows = table.slice(1);
	} else {
		prefix = '';
		const cols = countColumns(table);
		for (let i = 0; i < cols; i++) {
			prefix += delim + ' ';
		}
		prefix += delim + mergedConfig.eol;
		for (let i = 0; i < cols; i++) {
			prefix += delim + '-';
		}
		prefix += delim;
		rows = table;
	}
	return prefix + mergedConfig.eol + rows.map((row, i) => {
		return row.join(delim);
	}).map((line) => delim + line + delim).join(mergedConfig.eol);
};
