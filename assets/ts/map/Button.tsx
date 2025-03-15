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
    title: string;
    variant?: string;
}

export default function Button(props: Props) {
    const {
        className,
        icon,
        onClick,
        title,
        variant,
    } = props;

    const map = useMap();
    const [control, setControl] = React.useState<ButtonControl>();

    React.useEffect(() => {
        const c = new ButtonControl({
            className,
            icon,
            onClick,
            position: 'bottomleft',
            title,
            variant,
        });
        c.addTo(map);
        setControl(c);

        return () => {
            c.remove();
        };
    }, []);

    if (control) {
        control.setClassName(className);
        control.setVariant(variant);
        return control.getPortal();
    }

    return null;
}
