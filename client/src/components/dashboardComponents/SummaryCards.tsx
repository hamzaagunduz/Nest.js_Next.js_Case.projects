'use client';

import React from 'react';

interface TopCategory {
    categoryName: string;
    total: number;
}

interface SummaryCardsProps {
    totalAmount: number;
    topCategory: TopCategory | null;
}

export default function SummaryCards({ totalAmount, topCategory }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-2">Toplam Harcama</h2>
                {typeof totalAmount === 'number' ? totalAmount.toFixed(2) : '0.00'} ₺
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-2">En Çok Harcanan Kategori</h2>
                {topCategory ? (
                    <>
                        <p className="text-2xl font-semibold">{topCategory.categoryName}</p>
                        <p className="text-lg">{topCategory.total.toFixed(2)} ₺</p>
                    </>
                ) : (
                    <p>Yok</p>
                )}
            </div>
        </div>
    );
}
