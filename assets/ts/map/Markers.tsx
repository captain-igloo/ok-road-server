import type { GeoJSON } from 'geojson';
import geojsonvt from 'geojson-vt';
import { LatLng } from 'leaflet';
import moment from 'moment';
import * as React from 'react';
import * as ReactLeaflet from 'react-leaflet';

import { useAppDispatch } from '../store';
import CanvasLayer from './CanvasLayer';
import {
    GEOJSONVT_EXTENT,
    MARKER_RADIUS,
    TILE_HEIGHT,
    TILE_WIDTH,
} from './constants';
import { Feature, highlightLocations, setTooltip } from './slice';

interface Props {
    features: {[key: string]: Feature};
    position?: { lat: number; lng: number };
}

const convertToGeoJson = (features: {[key: string]: Feature}): GeoJSON => ({
    type: 'FeatureCollection',
    features: Object.keys(features).map((index) => ({
        geometry: {
            coordinates: features[index].coordinates,
            type: 'Point',
        },
        properties: {
            id: features[index].id,
            speedLimit: features[index].speedLimit?.speedLimit,
            timestamp: features[index].timestamp,
            velocity: features[index].velocity,
        },
        type: 'Feature',
    })),
});

export default function Markers(props: Props) {
    const { features, position } = props;
    const [tileIndex, setTileIndex] = React.useState<ReturnType<typeof geojsonvt>>();
    const [canvasLayer, setCanvasLayer] = React.useState<CanvasLayer>();
    const map = ReactLeaflet.useMap();
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        const canvasLayer = new CanvasLayer();
        canvasLayer.addTo(map);
        setCanvasLayer(canvasLayer);
        return () => {
            map.removeLayer(canvasLayer);
        };
    }, [map]);

    React.useEffect(() => {
        if (position && tileIndex) {
            const highlightPoint = map.project(new LatLng(position.lat, position.lng), map.getZoom());
            const tileX = Math.floor(highlightPoint.x / TILE_WIDTH);
            const tileY = Math.floor(highlightPoint.y / TILE_HEIGHT);
            const maxTileX = 2 ** map.getZoom();
            const unwrappedTileX = tileX >= maxTileX ? tileX - maxTileX : tileX;
            const features = tileIndex.getTile(map.getZoom(), unwrappedTileX, tileY)?.features;

            const descriptions: string[] = [];
            const tileScale = GEOJSONVT_EXTENT / TILE_WIDTH;

            const featureIdsToHighlight: number[] = [];
            if (features) {
                features.forEach((feature) => {
                    if (feature.type === 1) {
                        feature.geometry.forEach((point) => {
                            if (
                                Math.abs(highlightPoint.x - ((tileX * TILE_WIDTH) + (point[0] / tileScale))) <= MARKER_RADIUS
                                && Math.abs(highlightPoint.y - ((tileY * TILE_HEIGHT) + (point[1] / tileScale))) <= MARKER_RADIUS
                            ) {
                                const timestamp = feature.tags?.timestamp;
                                const velocity = feature.tags?.velocity;
                                if (timestamp !== undefined && velocity !== undefined) {
                                    let description = `Speed: ${velocity} km/h`;
                                    const speedLimit = feature.tags?.speedLimit;
                                    if (speedLimit !== undefined) {
                                        description += `; Speed Limit: ${speedLimit} km/h`;
                                    }
                                    description += `; ${moment(new Date(timestamp * 1000)).format('MMM D YYYY H:mm')}`;
                                    descriptions.push(description);
                                }
                                const f = props.features[`_${feature.tags?.id}`];
                                if (f) {
                                    featureIdsToHighlight.push(f.id);
                                }
                            }
                        });
                    }
                });
            }
            dispatch(highlightLocations(featureIdsToHighlight));
            dispatch(setTooltip({
                text: {
                    Locations: descriptions,
                },
            }));
        }
    }, [position, tileIndex]);

    React.useEffect(() => {
        const tileIndex = geojsonvt(convertToGeoJson(features), {
            buffer: (GEOJSONVT_EXTENT / TILE_HEIGHT) * MARKER_RADIUS,
            extent: GEOJSONVT_EXTENT,
            maxZoom: 20,
        });
        setTileIndex(tileIndex);
        if (canvasLayer) {
            canvasLayer.setTileIndex(tileIndex);
        }
    }, [canvasLayer, features]);

    return null;
}
