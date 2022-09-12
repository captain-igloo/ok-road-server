import { DivIcon, LatLng } from 'leaflet';
import * as React from 'react';
import { Form } from 'react-bootstrap';
import { MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../model/app/actions';
import { Actions, State, Dispatch } from '../model/app/types';
import { Device } from '../model/device/types';
import './Map.css';

interface Props {
    actions: Actions;
    device: any;
}

class Map extends React.PureComponent<Props> {
    public render(): React.ReactNode {
        const { actions, device } = this.props;
        return (
            <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                <div style={{ width: '300px' }}>
                    <h2>Devices</h2>
                    { this.getDevices() }
                    <h2>Speed Limit</h2>
                    { device.speedLimit.description } 
                </div>
                <MapContainer center={[-40, 174]} zoom={8}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    { this.getMarkers() }
                    { /* this.getCameras() */ }
                    <Marker
                        draggable
                        eventHandlers={{
                            dragend: (e) => {
                                // console.log('drag end', e.target.getLatLng());
                                actions.setMarkerPosition(e.target.getLatLng());
                            }
                        }}
                        position={device.speedLimit.position}
                    />
                    { this.getPolygons() }
                    { /*device.polygons.map((polygon: any, index: number) => {
                        return (
                            <Polygon key={index} positions={ polygon } />
                        );
                    }) */ }
                </MapContainer>
            </div>
        );
    }

    private getPolygons(): React.ReactNode[] {
        const { device } = this.props;
        return device.speedLimit.polygons.map((positions: any, index: number) => {
            return (
                <Polygon
                    key={index}
                    positions={positions}
                />
            );
        });
        /* return [
            <Polygon
                key={99}
                positions={[new LatLng(-40, 174), new LatLng(-40, 175), new LatLng(-39, 174.5), new LatLng(-40, 174)]}
            />
        ];*/
    }
    
    private getCameras(): React.ReactNode[] {
        const { device } = this.props;
        const markers: React.ReactNode[] = [];
        Object.keys(device.cameras).forEach((key) => {
            const camera = device.cameras[key];
            markers.push(
                <Marker
                    key={camera.id}
                    position={camera.location}
                />
            );
        });
        return markers;
    }

    private getMarkers(): React.ReactNode[] {
        const { device } = this.props;
        const markers: React.ReactNode[] = [];
        Object.keys(device.devices).forEach((key) => {
            Object.keys(device.devices[key].locations).forEach((locationId) => {
                const location = device.devices[key].locations[locationId];
                const divIcon = new DivIcon({
                    html: `${location.speed} km/h`,
                });
                markers.push(
                    <Marker
                        icon={divIcon}
                        key={location.id}
                        position={location.location}
                    >
                        <Popup>asdf</Popup>
                    </Marker>,
                );
            });
        });
        /* markers.push(
            <Marker
                key="adfasdf"
                position={new LatLng(-41.231780, 174.809850)} 
            />
        );
        markers.push(
            <Marker
                key="fsefsef"
                position={new LatLng(-41.242505, 174.813068)} 
            />
        );*/
        return markers;
    }

    private getDevices(): React.ReactNode {
        const { device } = this.props;
        return Object.keys(device.devices).map((key) => {
            return (
                <Form.Group className="mb-3" controlId="formBasicCheckbox" key={key}>
                    <Form.Check
                        checked={device.devices[key].active}
                        label={device.devices[key].macAddress}
                        onChange={() => { this.onChange(device.devices[key]); }}
                        type="checkbox"
                    />
                </Form.Group>
            );
        });
    }

    private onChange(device: Device): void
    {
        const { actions } = this.props;
        actions.activateDevice(device, !device.active);
    }
}

export default connect<State, {}, any, State>((state: State): State => state, (dispatch: Dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
}))(Map);
