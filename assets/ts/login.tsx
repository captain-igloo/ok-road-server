import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import * as ReactDOM from 'react-dom/client';

import Header from './Header';

declare global {
    interface Window {
        error: string;
        token: string;
    }
}

const element = document.getElementById('login');

if (element) {
    const root = ReactDOM.createRoot(element);

    let alert;
    if (window.error) {
        alert = <Alert variant="danger">{window.error}</Alert>;
    }

    root.render(
        <>
            <Header showSignIn={false} />
            <Card className="login-container">
                <Card.Header>Sign In</Card.Header>
                <Card.Body>
                    {alert}
                    <Form method="post">
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control name="_username" required type="text" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="_password" required type="password" />
                        </Form.Group>
                        <input name="_csrf_token" type="hidden" value={window.token} />
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>,
    );
}
