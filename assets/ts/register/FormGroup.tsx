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
    const [value, setValue] = React.useState(props.defaultValue || '');

    let errors;
    let invalid;
    let valid;
    if (props.errors && props.errors.length > 0) {
        errors = props.errors.map((message, index) => {
            return (
                <Form.Control.Feedback key={index} type="invalid">
                    {message}
                </Form.Control.Feedback>
            );
        });
        invalid = true;
    } else if (value === '' && props.validated) {
        errors = (
            <Form.Control.Feedback type="invalid">
                {props.defaultErrorMessage}
            </Form.Control.Feedback>
        );
        invalid = true;
    } else if (props.validated) {
        valid = true;
    }

    const id = `registration_form_${props.name}`;

    return (
        <Form.Group className="mb-3">
            <Form.Label htmlFor={id}>{props.description}</Form.Label>
            <Form.Control
                autoComplete={props.autoComplete}
                id={id}
                isInvalid={invalid}
                isValid={valid}
                name={`registration_form[${props.name}]`}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                required
                type={props.type}
                value={value}
            />
            {errors}
        </Form.Group>
    );
}
