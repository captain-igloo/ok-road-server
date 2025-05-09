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
import Scale from './Scale';
import { fetchLocations, setShowSpeedLimitAreas } from './slice';
import Tooltip from './Tooltip';
import VectorGridLayer from './VectorGridLayer';

interface Props {
    bounds?: [[number, number], [number, number]];
}

export const useAppDispatch: () => AppDispatch = useDispatch;

export default function Map(props: Props) {
    const { bounds } = props;

    const dispatch = useAppDispatch();
    const features = useSelector((state: RootState) => state.map.features);
    const refreshInProgress = useSelector((state: RootState) => state.map.refreshInProgress);
    const highlightedLocation = useSelector((state: RootState) => state.map.highlightedLocation);
    const speedLimitTilesUrl = useSelector((state: RootState) => state.config.speedLimitTilesUrl);
    const mapConfig = useSelector((state: RootState) => state.config.map);
    const tooltip = useSelector((state: RootState) => state.map.tooltip);
    const showSpeedLimitAreas = useSelector((state: RootState) => state.map.showSpeedLimitAreas);

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

    const onClickFetchLocations = React.useMemo(() => () => {
        dispatch(fetchLocations());
    }, []);

    const onClickShowSpeedLimitAreas = React.useMemo(() => () => {
        dispatch(setShowSpeedLimitAreas(!showSpeedLimitAreas));
    }, [showSpeedLimitAreas]);

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
            <Scale />
            <Button
                className={refreshInProgress ? 'spin' : ''}
                icon={faArrowRotateRight}
                onClick={onClickFetchLocations}
                title="Refresh locations"
            />
            <Button
                icon={faDrawPolygon}
                onClick={onClickShowSpeedLimitAreas}
                title="Show speed limit areas"
                variant={showSpeedLimitAreas ? 'primary' : undefined}
            />
        </MapContainer>
    );
}
