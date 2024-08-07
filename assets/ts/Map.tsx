import { Icon } from 'leaflet';
import * as moment from 'moment';
import * as React from 'react';
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from 'react-leaflet';
import { useSelector } from 'react-redux';

import { RootState } from './store';

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

const formatDate = (date: Date) => {
    return moment(date).format('MMM Do YYYY h:mm:ss a');
};

export default function Map(props: Props) {
    const { bounds } = props;

    const features = useSelector((state: RootState) => state.okRoad.features);
    const markers = Object.keys(features).map((featureId) => {
        const feature = features[featureId];
        let speedLimit;
        let image = 'gray.svg';
        let zIndexOffset = 1;
        if (feature.speedLimit !== undefined) {
            if (feature.velocity > feature.speedLimit.speedLimit) {
                image = 'red.svg';
                zIndexOffset = 3;
            } else {
                image = 'green.svg';
                zIndexOffset = 2;
            }
            speedLimit = (
                <>
                    <p>
                        <strong>Speed Limit:</strong>
                        {' '}
                        {feature.speedLimit.speedLimit}
                        km/h
                    </p>
                    <p>
                        <strong>Speed Limit Area:</strong>
                        {' '}
                        {feature.speedLimit.description}
                    </p>
                </>
            );
        }

        return (
            <Marker
                icon={new Icon({
                    iconSize: [20, 20],
                    iconUrl: `/img/${image}`,
                })}
                key={featureId}
                position={[features[featureId].coordinates[1], features[featureId].coordinates[0]]}
                zIndexOffset={zIndexOffset}
            >
                <Popup>
                    <p>
                        <strong>Date:</strong>
                        {' '}
                        {formatDate(new Date(features[featureId].timestamp * 1000))}
                    </p>
                    <p>
                        <strong>Speed:</strong>
                        {' '}
                        {features[featureId].velocity}
                        km/h
                    </p>
                    {speedLimit}
                </Popup>
            </Marker>
        );
    });

    return (
        <MapContainer center={[-41, 174]} className="map" zoom={5} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
            <FitBounds bounds={bounds} />
        </MapContainer>
    );
}
