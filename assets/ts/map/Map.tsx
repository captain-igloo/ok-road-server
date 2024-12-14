import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons/faArrowRotateRight';
import { Icon } from 'leaflet';
import * as React from 'react';
import {
    MapContainer,
    Marker,
    TileLayer,
} from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../store';
import Button from './Button';
import FitBounds from './FitBounds';
import Markers from './Markers';
import { fetchLocations } from './slice';

interface Props {
    bounds?: [[number, number], [number, number]];
}

export const useAppDispatch: () => AppDispatch = useDispatch;

export default function Map(props: Props) {
    const { bounds } = props;

    const dispatch = useAppDispatch();
    const features = useSelector((state: RootState) => state.okRoad.features);
    const refreshInProgress = useSelector((state: RootState) => state.okRoad.refreshInProgress);

    let highlightedMarker;

    const highlightedLocation = useSelector((state: RootState) => state.okRoad.highlightedLocation);

    if (highlightedLocation !== undefined && highlightedLocation in features) {
        const feature = features[highlightedLocation];
        highlightedMarker = (
            <Marker
                icon={new Icon({
                    iconSize: [20, 20],
                    iconUrl: '/img/blue.svg',
                })}
                key="highlighted-location"
                position={[feature.coordinates[1], feature.coordinates[0]]}
                zIndexOffset={1000}
            />
        );
    }

    return (
        <MapContainer center={[-41, 174]} className="map" zoom={5} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                className="gray"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Markers />
            {highlightedMarker}
            <FitBounds bounds={bounds} />
            <Button
                className={refreshInProgress ? 'spin' : ''}
                icon={faArrowRotateRight}
                onClick={() => {
                    dispatch(fetchLocations());
                }}
            />
        </MapContainer>
    );
}
