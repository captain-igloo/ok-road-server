import { LeafletMouseEvent } from 'leaflet';
import * as React from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

import { useAppDispatch } from '../store';
import HtmlLayer from './HtmlLayer';
import { setTooltip, Tooltip } from './slice';

export default function (props: { tooltip: Tooltip }) {
    const { tooltip } = props;
    const map = useMap();
    const [htmlLayer, setHtmlLayer] = React.useState<HtmlLayer>();

    const dispatch = useAppDispatch();

    const mouseHandler = React.useMemo(() => (e: LeafletMouseEvent) => {
        dispatch(setTooltip({
            position: {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            },
        }));
    }, []);

    useMapEvents({
        click: mouseHandler,
        mousemove: mouseHandler,
    });

    React.useEffect(() => {
        const newHtmlLayer = new HtmlLayer({ className: 'map-tooltip' });
        newHtmlLayer.addTo(map);
        setHtmlLayer(newHtmlLayer);
        return () => {
            newHtmlLayer.remove();
        };
    }, []);

    React.useEffect(() => {
        if (htmlLayer) {
            htmlLayer.setPosition(tooltip.position);
            htmlLayer.setHtml(tooltip.text);
        }
    }, [htmlLayer, tooltip]);

    return null;
}
