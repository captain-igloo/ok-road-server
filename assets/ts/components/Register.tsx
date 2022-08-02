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
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                autoComplete="email"
                                autoFocus
                                defaultValue={(window as any).configuration.last_username}
                                name="email"
                                placeholder="Enter email"
                                required
                                type="email"
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        );
    }
}
