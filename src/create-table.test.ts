import { parseTable, countColumns, jira, markdown } from './create-table';

describe('parseTable()', () => {
	it('parses a single character', () => {
		expect(parseTable('a')).toEqual([['a']]);
	});

	it('parses two columns of a single row', () => {
		expect(parseTable('a\tb')).toEqual([['a', 'b']]);
	});

	it('parses two columns of two rows', () => {
		expect(parseTable('a\tb\nc\td')).toEqual([['a', 'b'], ['c', 'd']]);
	});
});

describe('countColumns()', () => {
	it('counts a 0x0 table', () => {
		expect(countColumns([])).toEqual(0);
	});

	it('counts a 1x0 table', () => {
		expect(countColumns([[]])).toEqual(0);
	});

	it('counts a single cell', () => {
		expect(countColumns([['a']])).toEqual(1);
	});

	it('counts two columns', () => {
		expect(countColumns([['a', 'b']])).toEqual(2);
	});

	it('counts an uneven table', () => {
		expect(countColumns([['a', 'b'], ['c', 'd', 'e'], ['f']])).toEqual(3);
	});
});

describe('jira()', () => {
	it('formats a single character', () => {
		const table = parseTable('a');
		const actual = jira(table);
		expect(actual).toBe('|a|');
	});

	it('formats two columns of a single row', () => {
		const table = parseTable('a	b');
		const actual = jira(table);
		expect(actual).toBe('|a|b|');
	});

	it('formats two columns of two rows', () => {
		const table = parseTable(`a	b
c	d`);
		const actual = jira(table);
		expect(actual).toBe('|a|b|\n|c|d|');
	});

	it('can include headers row', () => {
		const table = parseTable(`a	b
c	d`);
		const options = {
			headerCount: 1,
		};
		const actual = jira(table, options);
		expect(actual).toBe('||a||b||\n|c|d|');
	});

	it('can include multiple headers rows', () => {
		const table = parseTable(`a	b
c	d`);
		const options = {
			headerCount: 2,
		};
		const actual = jira(table, options);
		expect(actual).toBe('||a||b||\n||c||d||');
	});

	it('escapes pipe characters', () => {
		const table = parseTable(`|	|
|	|`);
		const actual = jira(table);
		expect(actual).toBe('|\\||\\||\n|\\||\\||');
	});

	it('formats empty cells correctly', () => {
		const table = parseTable('a		b');
		const actual = jira(table);
		expect(actual).toBe('|a| |b|');
	});
});

describe('markdown()', () => {
	it('formats a single character', () => {
		const table = parseTable('a');
		const actual = markdown(table);
		expect(actual).toBe('| |\n|-|\n|a|');
	});

	it('formats two columns of a single row', () => {
		const table = parseTable('a	b');
		const actual = markdown(table);
		expect(actual).toBe('| | |\n|-|-|\n|a|b|');
	});

	it('formats two columns of two rows', () => {
		const table = parseTable(`a	b
c	d`);
		const actual = markdown(table);
		expect(actual).toBe('| | |\n|-|-|\n|a|b|\n|c|d|');
	});

	it('can include headers row', () => {
		const table = parseTable(`a	b
c	d`);
		const options = {
			headerCount: 1,
		};
		const actual = markdown(table, options);
		expect(actual).toBe('|a|b|\n|-|-|\n|c|d|');
	});

	it('can include multiple headers rows', () => {
		const table = parseTable(`a	b
c	d`);
		const options = {
			headerCount: 2,
		};
		const actual = markdown(table, options);
		expect(actual).toBe('|a|b|\n|c|d|\n|-|-|');
	});

	it('escapes pipe characters', () => {
		const table = parseTable(`|	|
|	|`);
		const actual = markdown(table);
		expect(actual).toBe('| | |\n|-|-|\n|\\||\\||\n|\\||\\||');
	});
});
