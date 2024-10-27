import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import Header from '../Header';
import FormGroup from './FormGroup';

interface Props {
    form: {
        errors?: string[];
        fields: { [key: string]: {
            errors?: string[];
            value?: string;
        } };
        token: string;
    };
}

export default function Register(props: Props) {
    const { form } = props;

    const [validated, setValidated] = React.useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        const formToSubmit = event.currentTarget;
        if (formToSubmit instanceof HTMLFormElement && formToSubmit.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        }
    };

    const errors = form.errors?.map((error) => (
        <Alert key={error} variant="danger">{error}</Alert>
    ));

    return (
        <>
            <Header showRegister={false} />
            <Card className="register-container">
                <Card.Header>Register</Card.Header>
                <Card.Body>
                    <Form
                        method="post"
                        name="registration_form"
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        {errors}
                        <FormGroup
                            defaultErrorMessage="Please choose a username."
                            defaultValue={form.fields.username?.value}
                            description="Username"
                            errors={form.fields.username?.errors}
                            name="username"
                            type="text"
                            validated={validated}
                        />
                        <FormGroup
                            defaultErrorMessage="Please enter your email address."
                            defaultValue={form.fields.email?.value}
                            description="Email"
                            errors={form.fields.email?.errors}
                            name="email"
                            type="text"
                            validated={validated}
                        />
                        <FormGroup
                            defaultErrorMessage="Please enter your full name."
                            defaultValue={form.fields.fullName?.value}
                            description="Name"
                            errors={form.fields.fullName?.errors}
                            name="fullName"
                            type="text"
                            validated={validated}
                        />
                        <FormGroup
                            autoComplete="new-password"
                            defaultErrorMessage="Please choose a password."
                            description="Password"
                            errors={form.fields.plainPassword?.errors}
                            name="plainPassword"
                            type="password"
                            validated={validated}
                        />
                        <input name="registration_form[_token]" type="hidden" value={form.token} />
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
