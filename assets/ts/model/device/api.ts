import { LatLng } from 'leaflet';

export const fetchDevices = async () => {
    const devices = await fetch('/api/v1/devices');
    return devices.json();
};

export const fetchLocations = async (deviceId: number) => {
    const locations = await fetch(`/api/v1/devices/${deviceId}/locations`);
    return locations.json();
};

export const fetchCameras = async () => {
    const cameras = await fetch('/api/v1/cameras');
    return cameras.json();
};

export const fetchSpeedLimit = async (position: LatLng) => {
    const uri = `/api/v1/speed-limit?lng=${position.lng}&lat=${position.lat}`
    const speedLimit = await fetch(uri);
    if (!speedLimit.ok) {
        throw new Error(`Failed to fetch: ${uri}`);
    }
    return speedLimit.json();
};
