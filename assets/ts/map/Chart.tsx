import {
    BarElement,
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import moment from 'moment';
import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import { RootState } from '../store';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export const options = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
    responsive: true,
};

const bucketCount = 60;

export default function Chart() {
    const features = useSelector((state: RootState) => state.map.features);
    const fromDate = useSelector((state: RootState) => state.map.fromDate);
    const toDate = useSelector((state: RootState) => state.map.toDate);

    const values = Array(bucketCount).fill(0);
    const labels = [];
    const bucketSize = (toDate - fromDate) / bucketCount;

    if (bucketSize > 0) {
        features.forEach((feature) => {
            const index = Math.floor(((feature.timestamp * 1000) - fromDate) / bucketSize);
            if (index >= 0 && index < bucketCount) {
                values[index] += 1;
            }
        });
        for (let t = fromDate; t < toDate; t += bucketSize) {
            labels.push(moment(new Date(t)).format('h:mm a'));
        }
    }

    return (
        <div className="chart-container">
            <Bar
                options={options}
                data={{
                    labels,
                    datasets: [{
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        data: values,
                    }],
                }}
            />
        </div>
    );
}
