import * as React from 'react';

import { useMap } from 'react-leaflet';

interface Props {
    bounds?: [[number, number], [number, number]];
}

export default function FitBounds(props: Props) {
    const { bounds } = props;
    const map = useMap();
    React.useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [bounds]);
    return null;
}
