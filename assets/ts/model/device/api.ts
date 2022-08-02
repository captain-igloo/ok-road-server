
export const fetchDevices = async () => {
    const devices = await fetch('/api/v1/devices');
    return await devices.json();
};

export const fetchLocations = async (deviceId: number) => {
    const locations = await fetch(`/api/v1/devices/${deviceId}/locations`);
    return await locations.json();
};
