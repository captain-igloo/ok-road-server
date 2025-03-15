import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons/faArrowRotateRight';
import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons/faDrawPolygon';
import { Icon } from 'leaflet';
import 'leaflet.vectorgrid';
import * as React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../store';
import Button from './Button';
import FitBounds from './FitBounds';
import Markers from './Markers';
import { fetchLocations } from './slice';
import Tooltip from './Tooltip';
import VectorGridLayer from './VectorGridLayer';

interface Props {
    bounds?: [[number, number], [number, number]];
}

export const useAppDispatch: () => AppDispatch = useDispatch;

export default function Map(props: Props) {
    const { bounds } = props;

    const dispatch = useAppDispatch();
    const features = useSelector((state: RootState) => state.okRoad.features);
    const refreshInProgress = useSelector((state: RootState) => state.okRoad.refreshInProgress);
    const highlightedLocation = useSelector((state: RootState) => state.okRoad.highlightedLocation);
    const speedLimitTilesUrl = useSelector((state: RootState) => state.config.speedLimitTilesUrl);
    const mapConfig = useSelector((state: RootState) => state.config.map);
    const tooltip = useSelector((state: RootState) => state.okRoad.tooltip);
    const [showSpeedLimitAreas, setShowSpeedLimitAreas] = React.useState<boolean>(false);

    let highlightedMarker;

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
        <MapContainer center={[mapConfig.center.lat, mapConfig.center.lng]} className="map" zoom={mapConfig.zoom}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                className="gray"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { showSpeedLimitAreas && speedLimitTilesUrl && <VectorGridLayer speedLimitTilesUrl={speedLimitTilesUrl} /> }
            <Tooltip tooltip={tooltip} />
            <Markers />
            {highlightedMarker}
            <FitBounds bounds={bounds} />

            <Button
                className={refreshInProgress ? 'spin' : ''}
                icon={faArrowRotateRight}
                onClick={() => {
                    dispatch(fetchLocations());
                }}
                title="Refresh locations"
            />
            <Button
                icon={faDrawPolygon}
                onClick={() => {
                    setShowSpeedLimitAreas(show => !show);
                }}
                title="Show speed limit areas"
                variant={showSpeedLimitAreas ? 'primary' : undefined}
            />
        </MapContainer>
    );
}
