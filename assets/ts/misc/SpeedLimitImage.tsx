import * as React from 'react';

export default function SpeedLimitImage(props: { speedLimit?: number }) {
    const { speedLimit } = props;
    if (speedLimit !== undefined) {
        return (<img height={20} src={`/img/${speedLimit}.svg`} width={20} />);
    }
    return null;
};