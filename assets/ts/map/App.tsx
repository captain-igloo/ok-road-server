import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';

import Chart from './Chart';
import Locations from './Locations';
import Map from './Map';
import Search from './Search';
import Header from '../Header';
import { AppDispatch, RootState } from '../store';

export const useAppDispatch: () => AppDispatch = useDispatch;

export default function App() {
    const bounds = useSelector((state: RootState) => state.okRoad.bounds);
    const user = useSelector((state: RootState) => state.okRoad.user);

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
        </>
    );
}
