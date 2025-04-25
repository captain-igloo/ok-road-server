import '../setup';

import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons/faDrawPolygon';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';

import Button from '../../ts/map/Button';
import ButtonControl from '../../ts/map/ButtonControl';

jest.mock('../../ts/map/ButtonControl');

describe('Button component', () => {
    afterEach(() => {
        (ButtonControl as any).mockClear();
    });

    test('Mount button should add control to map', () => {
        render(<Button icon={faDrawPolygon} onClick={() => {}} title="title" />);
        const buttonControl = (ButtonControl as any).mock.instances[0];
        expect(buttonControl.addTo).toBeCalled();
    });

    test('Change className should call setClassName()', () => {
        const { rerender } = render(<Button icon={faDrawPolygon} onClick={() => {}} title="title" />);
        rerender(<Button className="test" icon={faDrawPolygon} onClick={() => {}} title="title" />);
        const buttonControl = (ButtonControl as any).mock.instances[0];
        expect(buttonControl.setClassName).toBeCalledWith('test');
    });

    test('Change variant should call setVariant()', () => {
        const { rerender } = render(<Button icon={faDrawPolygon} onClick={() => {}} title="title" />);
        rerender(<Button icon={faDrawPolygon} onClick={() => {}} title="title" variant="primary" />);
        const buttonControl = (ButtonControl as any).mock.instances[0];
        expect(buttonControl.setVariant).toBeCalledWith('primary');
    });

    test('Change onClick should call setOnClick()', () => {
        const onClick = () => {};
        const { rerender } = render(<Button icon={faDrawPolygon} onClick={() => {}} title="title" />);
        rerender(<Button icon={faDrawPolygon} onClick={onClick} title="title" />);
        const buttonControl = (ButtonControl as any).mock.instances[0];
        expect(buttonControl.setOnClick).toBeCalledWith(onClick);
    });

    test('Change icon should call setIcon()', () => {
        const { rerender } = render(<Button icon={faDrawPolygon} onClick={() => {}} title="title" />);
        rerender(<Button icon={faGlobe} onClick={() => {}} title="title" />);
        const buttonControl = (ButtonControl as any).mock.instances[0];
        expect(buttonControl.setIcon).toBeCalledWith(faGlobe);
    });

    test('Change title should call setTitle()', () => {
        const { rerender } = render(<Button icon={faDrawPolygon} onClick={() => {}} title="title" />);
        rerender(<Button icon={faDrawPolygon} onClick={() => {}} title="new title" />);
        const buttonControl = (ButtonControl as any).mock.instances[0];
        expect(buttonControl.setTitle).toBeCalledWith('new title');
    });
});
