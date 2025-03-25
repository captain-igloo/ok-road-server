import * as React from 'react';
import { useMap } from 'react-leaflet';

import HtmlLayer from './HtmlLayer';
import type { Tooltip } from './slice';

export default function (props: { tooltip: Tooltip }) {
    const { tooltip } = props;
    const map = useMap();
    const [htmlLayer, setHtmlLayer] = React.useState<HtmlLayer>();

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
