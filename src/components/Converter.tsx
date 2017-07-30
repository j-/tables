import * as React from 'react';
import { Checkbox } from '@blueprintjs/core';
import { parseTable, jira, markdown } from '../create-table';
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
					<textarea
						className="Converter-input pt-input pt-fill"
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

	private handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.currentTarget;
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

	private copyJira = () => {
		const { input } = this.state;
		const parsed = parseTable(input);
		const formatted = jira(parsed, {
			firstRowHeaders: this.state.firstRowHeaders,
		});
		copy(formatted);
		toaster.show({
			message: 'Copied JIRA format to clipboard',
		});
	}

	private copyMarkdown = () => {
		const { input } = this.state;
		const parsed = parseTable(input);
		const formatted = markdown(parsed, {
			firstRowHeaders: this.state.firstRowHeaders,
		});
		copy(formatted);
		toaster.show({
			message: 'Copied markdown format to clipboard',
		});
	}
}
