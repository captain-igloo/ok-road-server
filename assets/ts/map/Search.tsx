import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong } from '@fortawesome/free-solid-svg-icons/faRightLong';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons/faLeftLong';
import moment from 'moment';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../store';
import Devices from './Devices';
import {
    decrementDate,
    incrementDate,
    setFromDate,
    setToDate,
} from './slice';

export default function Search() {
    const fromDate = useSelector((state: RootState) => state.map.fromDate);
    const toDate = useSelector((state: RootState) => state.map.toDate);
    const dispatch = useAppDispatch();

    return (
        <Card>
            <Card.Header>Search</Card.Header>
            <Card.Body>
                <Form>
                    <Devices />
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>From:</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                aria-label="From"
                                onChange={(e) => {
                                    dispatch(setFromDate((new Date(e.target.value)).getTime()));
                                }}
                                type="datetime-local"
                                value={moment(new Date(fromDate)).format('Y-MM-DDTHH:mm')}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>To:</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                aria-label="To"
                                onChange={(e) => {
                                    dispatch(setToDate((new Date(e.target.value)).getTime()));
                                }}
                                type="datetime-local"
                                value={moment(new Date(toDate)).format('Y-MM-DDTHH:mm')}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Col sm={3} />
                        <Col sm={9}>
                            <ButtonGroup>
                                <Button
                                    onClick={() => {
                                        dispatch(decrementDate());
                                    }}
                                    variant="secondary"
                                >
                                    <FontAwesomeIcon icon={faLeftLong} />
                                    <span className="display-small">
                                        &nbsp;
                                        Previous
                                    </span>
                                </Button>
                                <Button
                                    onClick={() => {
                                        dispatch(incrementDate());
                                    }}
                                    variant="secondary"
                                >
                                    <FontAwesomeIcon icon={faRightLong} />
                                    <span className="display-small">
                                        &nbsp;
                                        Next
                                    </span>
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
}
