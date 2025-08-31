import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons/faArrowRotateRight';
import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons/faDrawPolygon';
import { Icon } from 'leaflet';
import * as React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../store';
import Button from './Button';
import FitBounds from './FitBounds';
import Markers from './Markers';
import Scale from './Scale';
import { fetchLocations, setShowSpeedLimitAreas } from './slice';
import Tooltip from './Tooltip';
import VectorGridLayer from './VectorGridLayer';
import MostRecentMarker from './MostRecentMarker';

interface Props {
    bounds?: [[number, number], [number, number]];
}

export default function Map(props: Props) {
    const { bounds } = props;

    const dispatch = useAppDispatch();
    const features = useSelector((state: RootState) => state.map.features);
    const refreshInProgress = useSelector((state: RootState) => state.map.refreshInProgress);
    const highlightedLocations = useSelector((state: RootState) => state.map.highlightedLocations);
    const speedLimitTilesUrl = useSelector((state: RootState) => state.config.speedLimitTilesUrl);
    const mapConfig = useSelector((state: RootState) => state.config.map);
    const tooltip = useSelector((state: RootState) => state.map.tooltip);
    const showSpeedLimitAreas = useSelector((state: RootState) => state.map.showSpeedLimitAreas);
    const highlightedMarkers: React.ReactNode[] = [];
    highlightedLocations.forEach((highlightedLocation) => {
        const featureIndex = `_${highlightedLocation}`;
        if (featureIndex in features) {
            const feature = features[featureIndex];
            highlightedMarkers.push(
                <Marker
                    icon={new Icon({
                        iconSize: [20, 20],
                        iconUrl: '/img/blue.svg',
                    })}
                    key={`highlighted-location-${feature.id}`}
                    position={[feature.coordinates[1], feature.coordinates[0]]}
                    zIndexOffset={1000}
                />,
            );
        }
    });

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
            <Markers features={features} position={tooltip.position} />
            {highlightedMarkers}
            <MostRecentMarker features={features} />
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
