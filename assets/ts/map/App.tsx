import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useSelector } from 'react-redux';

import Timeline from './Timeline';
import LocationsSummary from './LocationsSummary';
import Map from './Map';
import Search from './Search';
import { removeNotification } from '../notifications/slice';
import Header from '../Header';
import { RootState, useAppDispatch } from '../store';

export default function App() {
    const bounds = useSelector((state: RootState) => state.map.bounds);
    const user = useSelector((state: RootState) => state.map.user);
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const demo = useSelector((state: RootState) => state.config.demo);
    const dispatch = useAppDispatch();

    let toastContainer;
    if (Object.keys(notifications).length > 0) {
        toastContainer = (
            <ToastContainer className="p-3" position="top-end">
                {Object.keys(notifications).map((notificationId) => {
                    const notification = notifications[notificationId];
                    return (
                        <Toast
                            key={notificationId}
                            onClose={() => {
                                dispatch(removeNotification(parseInt(notificationId, 10)));
                            }}
                        >
                            <Toast.Header>
                                <strong className="me-auto">{notification}</strong>
                            </Toast.Header>
                        </Toast>
                    );
                })}
            </ToastContainer>
        );
    }

    return (
        <>
            <Header showDemo={!demo} showMap={!!demo} showRegister={!!demo} showSignIn={!!demo} user={user} />
            <Container className="main-container" fluid>
                <Row className="main-container--row">
                    <Col className="left-container" md={6} sm={12} xl={4}>
                        <Search />
                        <LocationsSummary />
                    </Col>
                    <Col className="right-container" md={6} sm={12} xl={8}>
                        <Map bounds={bounds} />
                        <Timeline />
                    </Col>
                </Row>
            </Container>
            {toastContainer}
        </>
    );
}
