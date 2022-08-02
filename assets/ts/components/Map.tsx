import { Record } from 'immutable';
import { DivIcon } from 'leaflet';
import * as React from 'react';
import { Form } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../model/app/actions';
import { Actions, State, Dispatch } from '../model/app/types';
import { DeviceProps, LocationProps } from '../model/device/types';
import './Map.css';

interface Props {
    actions: Actions;
    device: any;
}

class Map extends React.PureComponent<Props> {
    public render(): React.ReactNode {
        const { device } = this.props;
        return (
            <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                <div style={{ width: '300px' }}>
                    <h2>Devices</h2>
                    { this.getDevices() }
                </div>
                <MapContainer center={[-40, 174]} zoom={8}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    { this.getMarkers() }
                </MapContainer>
            </div>
        );
    }

    private getMarkers(): React.ReactNode[] {
        const { device } = this.props;
        const markers: React.ReactNode[] = [];
        device.get('devices').forEach((d: any) => {
            d.get('locations').forEach((location: Record<LocationProps>) => {
                const divIcon = new DivIcon({
                    html: `${location.get('speed')} km/h`,
                });
                markers.push(
                    <Marker
                        icon={divIcon}
                        key={location.get('id')}
                        position={location.get('location')}
                    >
                        <Popup>asdf</Popup>
                    </Marker>,
                );
            });
        });
        return markers;
    }

    private getDevices(): React.ReactNode {
        const { device } = this.props;
        return device.get('devices').map((d: any, index: number) => {
            return (
                <Form.Group className="mb-3" controlId="formBasicCheckbox" key={index}>
                    <Form.Check label={d.get('macAddress')} onChange={() => { this.onChange(d); }} type="checkbox" />
                </Form.Group>
            );
        }).toIndexedSeq().toArray();
    }

    private onChange(device: Record<DeviceProps>): void 
    {
        const { actions } = this.props;
        actions.fetchLocations(device);
    }
}

export default connect<State, {}, any, State>((state: State): State => state, (dispatch: Dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
}))(Map);
