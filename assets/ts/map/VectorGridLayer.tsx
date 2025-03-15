import L from 'leaflet';
import * as React from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import Polygon from '../util/Polygon';
import { setTooltip } from './slice';

interface Props {
    speedLimitTilesUrl: string;
}

const useAppDispatch: () => AppDispatch = useDispatch;

export default function (props: Props) {
    const map = useMap();
    const dispatch = useAppDispatch();
    const polygonCache = React.useRef<Map<string, Map<string, Polygon>>>(new Map());

    React.useEffect(() => {
        const layer = L.vectorGrid.protobuf(props.speedLimitTilesUrl, {
            interactive: true,
            getFeatureId: (feature: any) => {
                return feature.properties.id;
            },
            vectorTileLayerStyles: {
                'speed_limit': {
                    color: 'blue',
                    fill: true,
                    fillColor: 'rgba(0, 0, 255, 0.1)',
                    weight: 1,
                }
            }
        });

        layer.on('tileunload', (e) => {
            polygonCache.current.delete(`${e.coords.x}:${e.coords.y}:${e.coords.z}`);
        });

        layer.addTo(map);

        const onMouseMove = (e: any) => {
            const point = map.project(e.latlng, map.getZoom());
        
            const tileX = Math.floor(point.x / 256);
            const tileY = Math.floor(point.y / 256);
    
            const descriptions: string[] = [];

            const tileId = `${tileX}:${tileY}:${map.getZoom()}`;
            const features = (layer as any)._vectorTiles[tileId]?._features;
            if (features !== undefined) {
                Object.keys(features).forEach((id) => {
                    const feature = features[id];

                    if (!polygonCache.current.has(tileId)) {
                        polygonCache.current.set(tileId, new Map());
                    }

                    let polygon = polygonCache.current.get(tileId)?.get(id);
                    if (polygon === undefined) {
                        polygon = new Polygon(feature.feature._parts);
                        polygonCache.current.get(tileId)?.set(id, polygon);
                    }
                    
                    if (polygon.intersectsPoint({
                        x: point.x - (tileX * 256),
                        y: point.y - (tileY * 256),
                    })) {
                        descriptions.push(`${feature.feature.properties.speed_limit}km/h ${feature.feature.properties.description}`);
                    }
                });
            }

            dispatch(setTooltip({ position: {lat: e.latlng.lat, lng: e.latlng.lng}, text: descriptions }));
        };

        map.on('mousemove', onMouseMove);

        return () => {
            layer.remove();
            map.off('mousemove', onMouseMove);
        };
    }, [map]);

    return null;
}
