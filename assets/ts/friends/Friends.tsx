import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../store';
import { addFriend, deleteFriend, showFriends } from './slice';

export const useAppDispatch: () => AppDispatch = useDispatch;

export default function Friends() {
    const show = useSelector((state: RootState) => state.friends.show);
    const friends = useSelector((state: RootState) => state.friends.friends);
    const addFriendError = useSelector((state: RootState) => state.friends.add_friend_error);
    const [username, setUsername] = React.useState('');
    const dispatch = useAppDispatch();

    const friendsRows = friends.map((f) => {
        return (
            <tr key={f.id}>
                <td>{f.username}</td>
                <td>{f.full_name}</td>
                <td style={{ width: '1px', whiteSpace: 'nowrap' }}>
                    <Button
                        onClick={() => {
                            dispatch(deleteFriend(f.id));
                        }}
                        size="sm"
                        variant="outline-secondary"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                        &nbsp;
                        Delete
                    </Button>
                </td>
            </tr>
        );
    });

    const handleSubmit = () => {
        dispatch(addFriend(username));
    };

    return (
        <Modal onHide={() => { dispatch(showFriends(false)); }} show={show}>
            <Modal.Header closeButton>
                <Modal.Title>Friends</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form method="post" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <InputGroup className="is-valid">
                            <Form.Control
                                name="username"
                                onChange={(event) => { setUsername(event.target.value); }}
                                placeholder="Username"
                                required
                                type="text"
                                value={username}
                            />
                            <Button disabled={username === ''} onClick={handleSubmit} variant="outline-secondary">
                                <FontAwesomeIcon icon={faPlus} />
                                &nbsp;
                                Add
                            </Button>
                        </InputGroup>
                        {addFriendError && (
                            <Form.Control.Feedback className="invalid-feedback">
                                {addFriendError}
                            </Form.Control.Feedback>
                        )}
                        <Form.Text className="text-muted">
                            Enter the username of the person you want to share your location data with.
                        </Form.Text>
                    </Form.Group>
                </Form>
                <Table bordered size="sm" striped>
                    <tbody>
                        {friendsRows}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
}
