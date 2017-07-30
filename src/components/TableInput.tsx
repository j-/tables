import * as React from 'react';

export interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default class TableInput extends React.Component<Props> {
	private textarea: HTMLTextAreaElement;

	componentDidMount () {
		window.addEventListener('paste', this.handleWindowPaste);
		this.textarea.addEventListener('paste', this.handleTextareaPaste);
		window.addEventListener('keypress', this.handleWindowKeypress);
	}

	componentWillUnmount () {
		window.removeEventListener('paste', this.handleWindowPaste);
		this.textarea.removeEventListener('paste', this.handleTextareaPaste);
		window.removeEventListener('keypress', this.handleWindowKeypress);
	}

	render () {
		return (
			<textarea
				className="TableInput pt-input pt-fill"
				value={this.props.value}
				onChange={this.handleChange}
				ref={this.setRef}
			/>
		);
	}

	private setRef = (ref: HTMLTextAreaElement) => (
		this.textarea = ref
	)

	private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => (
		this.props.onChange(
			e.currentTarget.value
		)
	)

	private handleWindowPaste = (e: ClipboardEvent) => {
		e.preventDefault();
		this.props.onChange(
			e.clipboardData.getData('text/plain')
		);
		this.textarea.focus();
	}

	private handleTextareaPaste = (e: ClipboardEvent) => {
		e.stopPropagation();
	}

	private handleWindowKeypress = (e: KeyboardEvent) => {
		this.textarea.focus();
	}
}
