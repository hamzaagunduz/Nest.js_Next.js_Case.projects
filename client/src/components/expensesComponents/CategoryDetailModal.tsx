'use client';
import React, { useState } from 'react';
import { Trash2, Edit2, X, TrendingUp, Calendar, CreditCard } from "lucide-react";

interface Expense {
    _id: string;
    title: string;
    amount: number;
    categoryId?: string;
    category: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

interface CategoryDetailModalProps {
    onClose: () => void;
    expenses: Expense[];
    onDeleteExpense?: (id: string) => void;
    onUpdateExpense?: (id: string, updatedTitle: string, updatedAmount: number, category: string) => void;
}

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
    onClose,
    expenses,
    onDeleteExpense,
    onUpdateExpense,
}) => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Güncelleme modal state
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newAmount, setNewAmount] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState<string>("");
    const [editingAmount, setEditingAmount] = useState<number>(0);
    const [editingCategory, setEditingCategory] = useState<string>("");

    const handleOpenEdit = (id: string, title: string, amount: number, category: string) => {
        setEditingId(id);
        setEditingTitle(title);
        setEditingAmount(amount);
        setEditingCategory(category);
    };


    const handleSaveEdit = () => {
        if (editingId && onUpdateExpense) {
            onUpdateExpense(editingId, editingTitle, editingAmount, editingCategory);
            // Modalı kapat ve state’leri temizle
            setEditingId(null);
            setEditingTitle("");
            setEditingAmount(0);
            setEditingCategory("");
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Siyah overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Ana Modal */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col animate-[fadeIn_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Başlık */}
                <div className="flex justify-between items-center px-6 py-5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full flex items-center justify-center">
                            <CreditCard size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Harcama Detayları</h2>
                            <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                                <TrendingUp size={14} className="text-white/80" />
                                Toplam: {totalAmount.toFixed(2)}₺
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/20 transition-all duration-200 text-white flex items-center"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* İçerik */}
                <div className="flex-1 overflow-auto p-4">
                    {expenses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="bg-purple-100 p-4 rounded-full mb-4 flex items-center justify-center">
                                <CreditCard size={32} className="text-purple-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Harcama bulunamadı</h3>
                            <p className="text-gray-500">Bu kategoriye ait henüz bir harcama kaydı yok.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto max-h-[60vh]">
                            <table className="w-full text-sm border-separate border-spacing-y-2">
                                <thead className="text-left">
                                    <tr className="bg-gradient-to-r from-purple-50 to-indigo-50 text-gray-600">
                                        <th className="p-4 rounded-l-xl">Başlık</th>
                                        <th className="p-4">Kategori</th>
                                        <th className="p-4">Tutar</th>
                                        <th className="p-4">Tarih</th>
                                        <th className="p-4 rounded-r-xl text-center">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((exp, index) => (
                                        <tr key={index} className="group hover:shadow-md transition-all duration-200">
                                            <td className="p-4 bg-white rounded-l-lg border-l-4 border-purple-500 group-hover:border-indigo-400 transition-colors">
                                                <span className="font-medium">{exp.title}</span>
                                            </td>
                                            <td className="p-4 bg-white">
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                    {exp.category}
                                                </span>
                                            </td>
                                            <td className="p-4 bg-white font-semibold text-green-600">
                                                {exp.amount.toFixed(2)}₺
                                            </td>
                                            <td className="p-4 bg-white text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} className="text-gray-500" />
                                                    {new Date(exp.createdAt).toLocaleDateString('tr-TR')}
                                                </div>
                                            </td>
                                            <td className="p-4 bg-white rounded-r-lg text-center">
                                                <div className="flex justify-center gap-2">
                                                    {onUpdateExpense && (
                                                        <button
                                                            onClick={() => handleOpenEdit((exp as any).id, exp.title, exp.amount, exp.categoryId || "1")}
                                                            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                        >
                                                            <Edit2 size={16} /> Güncelle
                                                        </button>
                                                    )}
                                                    {onDeleteExpense && (
                                                        <button
                                                            onClick={() => onDeleteExpense && onDeleteExpense((exp as any).id)}
                                                            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                        >
                                                            <Trash2 size={16} /> Sil
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Alt kapat butonu */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        Toplam <span className="font-semibold text-purple-600">{expenses.length}</span> harcama
                    </p>
                    <button
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        onClick={onClose}
                    >
                        <X size={18} />
                        Kapat
                    </button>
                </div>
            </div>

            {/* Güncelleme Modal */}
            {/* Güncelleme Modal */}
            {editingId && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setEditingId(null)}
                    />
                    <div
                        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-[fadeIn_0.3s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-4">Harcamayı Güncelle</h3>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                placeholder="Başlık"
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                value={editingAmount}
                                onChange={(e) => setEditingAmount(parseFloat(e.target.value))}
                                placeholder="Tutar"
                                className="border p-2 rounded"
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CategoryDetailModal;
