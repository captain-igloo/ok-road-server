import * as React from 'react';
import { useMap } from 'react-leaflet';

import HtmlLayer from './HtmlLayer';

export default function(props: any) {
    const { tooltip } = props;
    const map = useMap();
    const [htmlLayer, setHtmlLayer] = React.useState<HtmlLayer>();

    React.useEffect(() => {
        const htmlLayer = new HtmlLayer();
        htmlLayer.addTo(map);
        setHtmlLayer(htmlLayer);
        return () => {
            htmlLayer.remove();
        }
    }, []);

    React.useEffect(() => {
        if (htmlLayer) {
            htmlLayer.setPosition(tooltip.position);
            htmlLayer.setHtml(tooltip.text);
        }
    }, [htmlLayer, tooltip]);

    return null;
}
