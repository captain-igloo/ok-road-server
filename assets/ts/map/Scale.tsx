import L from 'leaflet';
import * as React from 'react';
import { useMap } from 'react-leaflet';

export default function Scale() {
    const map = useMap();
    
    React.useEffect(() => {
        L.control.scale({
            imperial: false,
            position: 'bottomright',
        }).addTo(map);
    }, []);

    return null;
}
