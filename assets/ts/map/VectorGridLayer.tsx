import L, { LeafletMouseEvent } from 'leaflet';
import 'leaflet.vectorgrid';
import * as React from 'react';
import { useMap } from 'react-leaflet';

import { useAppDispatch } from '../store';
import Polygon from '../util/Polygon';
import { setTooltip } from './slice';

interface Props {
    speedLimitTilesUrl: string;
}

export default function VectorGridLayer(props: Props) {
    const map = useMap();
    const dispatch = useAppDispatch();
    const polygonCache = React.useRef<Map<string, Map<string, Polygon>>>(new Map());
    const previousHighlightedFeature = React.useRef<number>(null);

    React.useEffect(() => {
        const { speedLimitTilesUrl } = props;
        const layer = L.vectorGrid.protobuf(speedLimitTilesUrl, {
            interactive: true,
            getFeatureId: (feature: any) => feature.properties.id,
            vectorTileLayerStyles: {
                speed_limit: {
                    color: 'blue',
                    fill: true,
                    fillColor: 'rgba(0, 0, 255, 0.1)',
                    weight: 1,
                },
            },
        });
        layer.on('tileunload', (e) => {
            polygonCache.current.delete(`${e.coords.x}:${e.coords.y}:${e.coords.z}`);
        });

        layer.addTo(map);

        const onMouseMove = (e: LeafletMouseEvent) => {
            const point = map.project(e.latlng, map.getZoom());
            const tileX = Math.floor(point.x / 256);
            const tileY = Math.floor(point.y / 256);
            const descriptions: string[] = [];

            const maxTileX = 2 ** map.getZoom();
            const unwrappedTileX = tileX >= maxTileX ? tileX - maxTileX : tileX;
            const tileId = `${unwrappedTileX}:${tileY}:${map.getZoom()}`;
            const features = (layer as any)._vectorTiles[tileId]?._features;
            if (features !== undefined) {
                Object.keys(features).forEach((id) => {
                    const feature = features[id];
                    if (feature.feature._parts !== undefined) {
                        if (!polygonCache.current.has(tileId)) {
                            polygonCache.current.set(tileId, new Map());
                        }

                        let polygon = polygonCache.current.get(tileId)?.get(id);
                        if (polygon === undefined) {
                            polygon = new Polygon(feature.feature._parts);
                            polygonCache.current.get(tileId)?.set(id, polygon);
                        }
                        if (
                            polygon.intersectsPoint({ x: point.x - (tileX * 256), y: point.y - (tileY * 256) })
                            && feature.feature.properties.speed_limit !== undefined
                            && feature.feature.properties.description !== undefined
                        ) {
                            if (previousHighlightedFeature.current !== null) {
                                layer.setFeatureStyle(previousHighlightedFeature.current, {
                                    color: 'blue',
                                    fill: true,
                                    fillColor: 'rgba(0, 0, 255, 0.1)',
                                    weight: 1,
                                });
                            }
                            layer.setFeatureStyle(feature.feature.properties.id, {
                                color: 'red',
                                fill: true,
                                fillColor: 'rgba(255, 0, 0, 0.1)',
                                weight: 1,
                            });
                            previousHighlightedFeature.current = feature.feature.properties.id;
                            descriptions.push(`${feature.feature.properties.speed_limit}km/h `
                                + `${feature.feature.properties.description}`);
                        }
                    }
                });
            }

            dispatch(setTooltip({ text: { 'Speed Limit': descriptions } }));
        };

        map.on('mousemove', onMouseMove);

        return () => {
            dispatch(setTooltip({ text: { 'Speed Limit': [] } }));
            layer.remove();
            map.off('mousemove', onMouseMove);
        };
    }, [map]);

    return null;
}
