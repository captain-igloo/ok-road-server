import * as React from 'react';
import * as ReactLeaflet from 'react-leaflet';

import { Feature } from './slice';

interface Props {
    features: { [key: string]: Feature };
}

export default function MostRecentMarker(props: Props) {
    const { features } = props;

    let mostRecent: {
        position: [number, number];
        timestamp: number;
    } | undefined;

    Object.keys(features).forEach((featureId) => {
        if (mostRecent === undefined || features[featureId].timestamp > mostRecent.timestamp) {
            mostRecent = {
                position: [features[featureId].coordinates[1], features[featureId].coordinates[0]],
                timestamp: features[featureId].timestamp,
            };
        }
    });

    if (mostRecent !== undefined) {
        return (
            <ReactLeaflet.Marker
                position={mostRecent.position}
            />
        );
    }
    
    return null;
}
