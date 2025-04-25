import { Icon } from 'leaflet';
import moment from 'moment';
import * as React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useSelector } from 'react-redux';

import { RootState } from '../store';

const formatDate = (date: Date) => moment(date).format('MMM Do YYYY h:mm:ss a');

export default function Markers() {
    const features = useSelector((state: RootState) => state.map.features);

    let mostRecent: {
        index: number;
        timestamp: number;
    } | undefined;
    features.forEach((feature, index) => {
        if (mostRecent === undefined || feature.timestamp > mostRecent.timestamp) {
            mostRecent = {
                index,
                timestamp: feature.timestamp,
            };
        }
    });

    const markers = [];
    for (let i = features.length - 1; i >= 0; i -= 1) {
        const feature = features[i];
        let speedLimit;
        let image = 'gray.svg';
        if (feature.speedLimit !== undefined) {
            if (feature.velocity > feature.speedLimit.speedLimit) {
                image = 'red.svg';
            } else {
                image = 'green.svg';
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

        const markerProps: { icon?: Icon } = {};
        if (mostRecent === undefined || mostRecent.index !== i) {
            markerProps.icon = new Icon({
                iconSize: [20, 20],
                iconUrl: `/img/${image}`,
            });
        }
        markers.push(
            <Marker
                {...markerProps}
                key={feature.id}
                position={[feature.coordinates[1], feature.coordinates[0]]}
            >
                <Popup>
                    <p>
                        <strong>Date:</strong>
                        {' '}
                        {formatDate(new Date(feature.timestamp * 1000))}
                    </p>
                    <p>
                        <strong>Message received:</strong>
                        {' '}
                        {formatDate(new Date(feature.insertTimestamp * 1000))}
                    </p>
                    <p>
                        <strong>Speed:</strong>
                        {' '}
                        {feature.velocity}
                        km/h
                    </p>
                    {speedLimit}
                </Popup>
            </Marker>,
        );
    }
    return <>markers</>;
}
