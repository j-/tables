import * as React from 'react';
import { Checkbox, Intent } from '@blueprintjs/core';
import TableInput from './TableInput';
import { Formatter, parseTable, jira, markdown } from '../create-table';
import toaster from '../toaster';
import './Converter.css';

const copy = require('clipboard-copy');

interface State {
	input: string;
	firstRowHeaders: boolean;
}

export default class Converter extends React.Component<{}, State> {
	state: State = {
		input: '',
		firstRowHeaders: false,
	};

	render () {
		return (
			<div className="Converter">
				<div className="Converter-input-container">
					<TableInput
						value={this.state.input}
						onChange={this.handleChangeInput}
					/>
				</div>
				<div className="Converter-actions">
					<Checkbox
						checked={this.state.firstRowHeaders}
						label="First row is headers"
						onChange={this.handleChangeFirstRowHeaders}
					/>
					<div className="Converter-actions-action">
						<button
							className="Converter-action pt-button pt-large pt-icon-clipboard"
							type="button"
							onClick={this.copyJira}
						>
							Copy JIRA format
						</button>
						<a
							className="Converter-help pt-button pt-minimal pt-icon-help"
							href="https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=tables"
							target="_blank"
							rel="noopener"
							title="JIRA tables documentation"
						/>
					</div>
					<div className="Converter-actions-action">
						<button
							className="Converter-action pt-button pt-large pt-icon-clipboard"
							type="button"
							onClick={this.copyMarkdown}
						>
							Copy markdown format
						</button>
						<a
							className="Converter-help pt-button pt-minimal pt-icon-help"
							href="https://help.github.com/articles/organizing-information-with-tables/"
							target="_blank"
							rel="noopener"
							title="Markdown tables documentation"
						/>
					</div>
				</div>
			</div>
		);
	}

	private handleChangeInput = (value: string) => {
		this.setState(() => ({
			input: value,
		}));
	}

	private handleChangeFirstRowHeaders = (e: React.FormEvent<HTMLInputElement>) => {
		const { checked } = e.currentTarget;
		this.setState(() => ({
			firstRowHeaders: checked,
		}));
	}

	private copy = (formatter: Formatter, name: string) => {
		const { input } = this.state;
		const parsed = parseTable(input);
		try {
			const formatted = formatter(parsed, {
				headerCount: this.state.firstRowHeaders ? 1 : 0,
			});
			copy(formatted);
			toaster.show({
				message: `Copied ${name} format to clipboard`,
			});
		} catch (err) {
			toaster.show({
				intent: Intent.DANGER,
				action: {
					text: 'Submit issue',
					onClick: () => this.submitIssue(err),
				},
				message: `Error copying ${name} format to clipboard`,
			});
		}
	}

	private copyJira = () => {
		this.copy(jira, 'JIRA');
	}

	private copyMarkdown = () => {
		this.copy(markdown, 'markdown');
	}

	private submitIssue = (err: Error) => {
		const title = `Error formatting table: ${err.message}`;
		const body = err.stack;
		const url = `https://github.com/j-/tables/issues/new?title=${title}&body=${body}`;
		const target = '_blank';
		window.open(url, target);
	}
}
