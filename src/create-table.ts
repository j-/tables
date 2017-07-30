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

export const jira = (table: Table, config?: Config): string => {
	const mergedConfig = {
		...DEFAULT_CONFIG,
		...config,
	};
	return table.map((row, i) => {
		const delim = mergedConfig.firstRowHeaders && i === 0 ? '||' : '|';
		return delim + row.join(delim) + delim;
	}).join(mergedConfig.eol);
};
