import * as React from 'react';
import Form from 'react-bootstrap/Form';

interface Props {
    autoComplete?: 'new-password';
    defaultErrorMessage: string;
    defaultValue?: string;
    description: string;
    errors?: string[];
    name: string;
    type: 'password' | 'text';
    validated: boolean;
}

export default function FormGroup(props: Props) {
    const {
        autoComplete,
        defaultErrorMessage,
        defaultValue,
        description,
        errors,
        name,
        validated,
        type,
    } = props;

    const [value, setValue] = React.useState(defaultValue || '');

    let feedback;
    let invalid;
    let valid;
    if (errors && errors.length > 0) {
        feedback = errors.map((message, index) => (
            <Form.Control.Feedback key={index} type="invalid">
                {message}
            </Form.Control.Feedback>
        ));
        invalid = true;
    } else if (value === '' && validated) {
        feedback = (
            <Form.Control.Feedback type="invalid">
                {defaultErrorMessage}
            </Form.Control.Feedback>
        );
        invalid = true;
    } else if (validated) {
        valid = true;
    }

    const id = `registration_form_${name}`;

    return (
        <Form.Group className="mb-3">
            <Form.Label htmlFor={id}>{description}</Form.Label>
            <Form.Control
                autoComplete={autoComplete}
                id={id}
                isInvalid={invalid}
                isValid={valid}
                name={`registration_form[${name}]`}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                required
                type={type}
                value={value}
            />
            {feedback}
        </Form.Group>
    );
}
