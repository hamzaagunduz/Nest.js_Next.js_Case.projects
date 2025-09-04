'use client';

import React from 'react';

interface Expense {
    id: string;
    title: string;
    category: string;
    amount: number;
    createdAt: string;
}

interface PaginatedExpensesProps {
    data: Expense[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function PaginatedExpenses({ data, page, totalPages, onPageChange }: PaginatedExpensesProps) {
    return (
        <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Harcama Listesi</h2>

            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">Başlık</th>
                        <th className="p-2 text-left">Kategori</th>
                        <th className="p-2 text-right">Miktar</th>
                        <th className="p-2 text-left">Tarih</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((exp) => (
                        <tr key={exp.id} className="border-t border-gray-200">
                            <td className="p-2">{exp.title}</td>
                            <td className="p-2">{exp.category}</td>
                            <td className="p-2 text-right">{exp.amount.toFixed(2)} ₺</td>
                            <td className="p-2">{new Date(exp.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Önceki
                </button>

                <span>
                    Sayfa {page} / {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
}
