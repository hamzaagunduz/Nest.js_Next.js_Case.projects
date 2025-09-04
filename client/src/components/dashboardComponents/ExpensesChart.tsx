'use client';

import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExpenseData {
    _id: string;
    total: number;
}

interface ExpensesChartProps {
    view: 'daily' | 'monthly';
    daily: ExpenseData[];
    monthly: ExpenseData[];
}

export default function ExpensesChart({ view, daily, monthly }: ExpensesChartProps) {
    const chartData = useMemo(() => {
        const labels = view === 'daily' ? daily.map((d) => d._id) : monthly.map((m) => m._id);
        const data = view === 'daily' ? daily.map((d) => d.total) : monthly.map((m) => m.total);

        return {
            labels,
            datasets: [
                {
                    label: view === 'daily' ? 'Günlük Harcama' : 'Aylık Harcama',
                    data,
                    backgroundColor: 'rgba(99, 102, 241, 0.7)',
                },
            ],
        };
    }, [view, daily, monthly]);

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: view === 'daily' ? 'Günlük Harcama' : 'Aylık Harcama',
                },
            },
        }),
        [view]
    );

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
}
