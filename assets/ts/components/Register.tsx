import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';

import './Login.css';

interface Props {
}

export default class Register extends React.Component<Props> {
    public render(): React.ReactNode {
        return (
            <div className="container">
                <div className="inner-container">
                    <h1 className="text-secondary">Register</h1>
                    <Form method="POST">
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                autoComplete="email"
                                autoFocus
                                name="email"
                                placeholder="Enter email"
                                required
                                type="email"
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                autoComplete="new-password"
                                name="password"
                                placeholder="Password"
                                required
                                type="password"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                autoComplete="new-password"
                                name="confirm_password"
                                placeholder="Confirm password"
                                required
                                type="password"
                            />
                        </Form.Group>
                        <input name="_csrf_token" value={ (window as any).configuration.csrf } type="hidden" />
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}
