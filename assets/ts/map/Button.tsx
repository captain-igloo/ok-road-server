import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as React from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import ButtonControl from './ButtonControl';

export const useAppDispatch: () => AppDispatch = useDispatch;

interface Props {
    className?: string;
    icon: IconProp;
    onClick: () => void;
}

export default function Button(props: Props) {
    const { className, icon, onClick } = props;

    const map = useMap();
    const [control, setControl] = React.useState<ButtonControl>();

    React.useEffect(() => {
        const c = new ButtonControl({
            className,
            icon,
            onClick,
            position: 'bottomleft',
        });
        c.addTo(map);
        setControl(c);

        return () => {
            c.remove();
        };
    }, []);

    if (control) {
        control.setClassName(className);
        return control.getPortal();
    }

    return null;
}
