import { Icon } from 'leaflet';
import * as React from 'react';
import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
} from 'react-leaflet';
import { useSelector } from 'react-redux';

import { RootState } from '../store';
import Markers from './Markers';

interface Props {
    bounds?: [[number, number], [number, number]];
}

function FitBounds(props: Props) {
    const { bounds } = props;
    const map = useMap();
    React.useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [bounds]);
    return null;
}

export default function Map(props: Props) {
    const { bounds } = props;

    const features = useSelector((state: RootState) => state.okRoad.features);

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
        </MapContainer>
    );
}
