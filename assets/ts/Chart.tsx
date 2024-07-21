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
import * as moment from 'moment';
import * as React from 'react';
import { Bar } from "react-chartjs-2";
import { useSelector } from 'react-redux';

import { RootState } from './store';

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

export default function Chart() {
    const features = useSelector((state: RootState) => state.okRoad.features);

    const keys = Object.keys(features);
    const values = Array(60).fill(0);
    const labels = [];

    if (keys.length > 0) {
        const diff = features[keys[keys.length - 1]].timestamp - features[keys[0]].timestamp;
        const first = features[keys[0]].timestamp;
        const a = diff / 59;
        if (a > 0) {
            keys.forEach((key) => {
                const timestamp = features[key].timestamp;
                const index = Math.floor((timestamp - first) / a);
                values[index]++;
            });

            for (let i = first; i <= features[keys[keys.length - 1]].timestamp; i += a) {
                labels.push(moment(new Date(i * 1000)).format('h:mm a'));
            }
        }
    }

    return (
        <div className="chart-container">
            <Bar options={options} data={{
                labels,
                datasets: [{
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    data: values,
                }],
            }} />
        </div>
    );
}