import * as React from 'react';
import { parseTable, jira } from '../create-table';
import './Converter.css';

const copy = require('clipboard-copy');

interface State {
	input: string;
}

export default class Converter extends React.Component<{}, State> {
	state: State = {
		input: '',
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
					<button
						className="pt-button pt-fill pt-large pt-icon-clipboard"
						type="button"
						onClick={this.copyJira}
					>
						Copy JIRA format
					</button>
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

	private copyJira = () => {
		const { input } = this.state;
		const parsed = parseTable(input);
		const formatted = jira(parsed);
		copy(formatted);
	}
}
