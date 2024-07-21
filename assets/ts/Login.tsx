import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import Header from './Header';

export default function Login() {
    let alert;
    if (window.error) {
        alert = <Alert variant="danger">{window.error}</Alert>;
    }

    return (
        <>
            <Header />
            <Card style={{
                width: '30rem',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <Card.Header>Log In</Card.Header>
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
                        <input name="_csrf_token" type="hidden" value={(window as any).token} />
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
