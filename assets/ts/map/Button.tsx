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
    const [portal, setPortal] = React.useState<React.ReactNode>();

    React.useEffect(() => {
        const newControl = new ButtonControl({
            className,
            icon,
            onClick,
            position: 'bottomleft',
            title,
            variant,
        });
        newControl.addTo(map);
        setControl(newControl);
        setPortal(newControl.getPortal());

        return () => {
            newControl.remove();
        };
    }, []);

    React.useEffect(() => {
        if (control) {
            control.setClassName(className);
            setPortal(control.getPortal());
        }
    }, [className]);

    React.useEffect(() => {
        if (control) {
            control.setVariant(variant);
            setPortal(control.getPortal());
        }
    }, [variant]);

    React.useEffect(() => {
        if (control) {
            control.setOnClick(onClick);
            setPortal(control.getPortal());
        }
    }, [onClick]);

    React.useEffect(() => {
        if (control) {
            control.setIcon(icon);
            setPortal(control.getPortal());
        }
    }, [icon]);

    React.useEffect(() => {
        if (control) {
            control.setTitle(title);
            setPortal(control.getPortal());
        }
    }, [title]);

    return portal;
}
