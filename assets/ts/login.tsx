import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import * as ReactDOM from 'react-dom/client';

import Header from './Header';

const element = document.getElementById('login');

if (element) {
    const root = ReactDOM.createRoot(element);

    let alert;
    if ((window as any).error) {
        alert = <Alert variant="danger">{(window as any).error}</Alert>;
    }

    root.render(
        <>
            <Header showSignIn={false} />
            <Card
                style={{
                    width: '30rem',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
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
