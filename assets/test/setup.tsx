import { jest } from '@jest/globals';
import fetchMock from 'fetch-mock';
import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

fetchMock.mockGlobal();

global.ResizeObserver = ResizeObserver;

const mock = ({ children }) => <div>{children}</div>;

jest.mock('react-bootstrap', () => { 
    const origBootstrap = jest.requireActual('react-bootstrap'); 
    // mock the Modal component
    const mockModal = ({ children }) => <div>{children}</div>; 

    // mock the sub-components of the Modal
    mockModal.Header = mock; 
    mockModal.Body = mock; 
    mockModal.Footer = mock; 
    mockModal.Title = mock; 
    
    // return your modified boostrap library instance with mocked Modal
    return {
        __esModule: true,
        ...origBootstrap,
        Modal: mockModal,
    };
});

jest.mock('react-leaflet', () => {
    const actual = jest.requireActual('react-leaflet');
    return {
        ...actual,
        useMap: jest.fn(),
    };
});
