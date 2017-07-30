import * as React from 'react';
import { parseTable, jira } from '../create-table';

interface State {
	input: string;
	output: string;
}

export default class Converter extends React.Component<{}, State> {
	state: State = {
		input: '',
		output: '',
	};

	render () {
		return (
			<form className="Converter" onSubmit={this.handleSubmit}>
				<div className="Converter-input-container">
					<textarea
						value={this.state.input}
						onChange={this.handleChangeInput}
					/>
				</div>
				<div className="Converter-actions">
					<button type="submit">
						Convert
					</button>
				</div>
				<div className="Converter-output-container">
					<textarea
						value={this.state.output}
						readOnly={true}
					/>
				</div>
			</form>
		);
	}

	private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.convertInput();
	}

	private handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.currentTarget;
		this.setState(() => ({
			input: value,
		}));
	}

	private convertInput () {
		const { input } = this.state;
		const parsed = parseTable(input);
		const formatted = jira(parsed);
		this.setState(() => ({
			output: formatted,
		}));
	}
}
