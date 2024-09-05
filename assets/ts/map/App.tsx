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
                    <Col className="left-container" xs={3}>
                        <Search />
                        <Locations />
                    </Col>
                    <Col className="right-container" xs={9}>
                        <Map bounds={bounds} />
                        <Chart />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
