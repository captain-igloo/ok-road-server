import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';

import './Login.css';

interface Props {
    error?: string;
}

export default class Login extends React.Component<Props> {
    public render(): React.ReactNode {
        return (
            <div className="container">
                <div className="inner-container">
                    <h1 className="text-secondary">Please sign in</h1>
                    { this.getError() }
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
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                autoComplete="current-password"
                                name="password"
                                placeholder="Password"
                                type="password"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                label="Remember me"
                                name="_remember_me"
                                type="checkbox"
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

    private getError(): React.ReactNode {
        const { error } = this.props;
        if (error) {
            return <div className="alert alert-danger">{ error }</div>;
        }
        return null;
    }
}
