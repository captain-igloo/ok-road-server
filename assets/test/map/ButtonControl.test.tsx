import '../setup';

import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons/faArrowRotateRight';
import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons/faDrawPolygon';
import {
    describe,
    expect,
    jest,
    test,
} from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';

import ButtonControl from '../../ts/map/ButtonControl';

describe('ButtonControl', () => {
    test('ButtonControl should render properly', () => {
        const buttonControl = new ButtonControl({
            className: 'className',
            icon: faDrawPolygon,
            onClick: () => {},
            title: 'title',
            variant: 'variant',
        });
        buttonControl.addTo({
            _controlCorners: {
                topright: {
                    appendChild: () => {},
                },
            },
            on: () => {},
        });
        render(buttonControl.getPortal());
        expect((buttonControl as any).div).toMatchSnapshot();
    });

    test('setClassName() should set className', () => {
        const buttonControl = new ButtonControl({
            icon: faDrawPolygon,
            onClick: () => {},
        });
        buttonControl.setClassName('className');
        render(buttonControl.getPortal());
        expect((buttonControl as any).div).toMatchSnapshot();
    });

    test('setVariant() should set variant', () => {
        const buttonControl = new ButtonControl({
            icon: faDrawPolygon,
            onClick: () => {},
        });
        buttonControl.setVariant('variant');
        render(buttonControl.getPortal());
        expect((buttonControl as any).div).toMatchSnapshot();
    });

    test('setTitle() should set title', () => {
        const buttonControl = new ButtonControl({
            icon: faDrawPolygon,
            onClick: () => {},
        });
        buttonControl.setTitle('title');
        render(buttonControl.getPortal());
        expect((buttonControl as any).div).toMatchSnapshot();
    });

    test('setIcon() should set icon', () => {
        const buttonControl = new ButtonControl({
            icon: faDrawPolygon,
            onClick: () => {},
        });
        buttonControl.setIcon(faArrowRotateRight);
        render(buttonControl.getPortal());
        expect((buttonControl as any).div).toMatchSnapshot();
    });

    test('setOnClick() should set onClick', () => {
        const buttonControl = new ButtonControl({
            icon: faDrawPolygon,
            onClick: () => {},
            title: 'title',
        });
        const onClick = jest.fn();
        buttonControl.setOnClick(onClick);
        render(buttonControl.getPortal());
        fireEvent.click((buttonControl as any).div.getElementsByTagName('button').item(0));
        expect(onClick).toHaveBeenCalled();
    });
});
