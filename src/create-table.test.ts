import { parseTable, jira } from './create-table';

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

describe('jira()', () => {
	it('formats a single character', () => {
		expect(jira([['a']])).toBe('|a|');
	});

	it('formats two columns of a single row', () => {
		expect(jira([['a', 'b']])).toBe('|a|b|');
	});

	it('formats two columns of two rows', () => {
		expect(jira([['a', 'b'], ['c', 'd']])).toBe('|a|b|\n|c|d|');
	});

	it('can include headers row', () => {
		const table = [['a', 'b'], ['c', 'd']];
		const options = {
			firstRowHeaders: true,
		};
		const actual = jira(table, options);
		expect(actual).toBe('||a||b||\n|c|d|');
	});
});
