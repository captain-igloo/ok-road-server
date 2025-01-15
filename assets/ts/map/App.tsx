import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useDispatch, useSelector } from 'react-redux';

import Chart from './Chart';
import Locations from './Locations';
import Map from './Map';
import { removeNotification } from './slice';
import Search from './Search';
import Header from '../Header';
import { AppDispatch, RootState } from '../store';

export const useAppDispatch: () => AppDispatch = useDispatch;

export default function App() {
    const bounds = useSelector((state: RootState) => state.okRoad.bounds);
    const user = useSelector((state: RootState) => state.okRoad.user);
    const notifications = useSelector((state: RootState) => state.okRoad.notifications);
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
            <Header showMap={false} user={user} />
            <Container className="main-container" fluid>
                <Row className="main-container--row">
                    <Col className="left-container" md={6} sm={12} xl={4}>
                        <Search />
                        <Locations />
                    </Col>
                    <Col className="right-container" md={6} sm={12} xl={8}>
                        <Map bounds={bounds} />
                        <Chart />
                    </Col>
                </Row>
            </Container>
            {toastContainer}
        </>
    );
}
