'use client';
import React, { useState, useEffect } from 'react';
import { MoreVertical } from "lucide-react";
import CategoryDetailModal from './CategoryDetailModal';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { createExpense, fetchExpensesByCategory, deleteExpense, updateExpense } from '@/features/expenses/expensesSlice';

interface CategoryCardProps {
    categoryName: string;
    categoryId: string;
    onDeleteCategory?: () => void;
    onUpdateCategory?: (newName: string) => void;
}



const CategoryCard: React.FC<CategoryCardProps> = ({
    categoryName,
    categoryId,
    onDeleteCategory,
    onUpdateCategory
}) => {
    const dispatch = useAppDispatch();
    const expenses = useAppSelector(state => state.expenses.expenses);
    const [isOpen, setIsOpen] = useState(false);
    const [expenseText, setExpenseText] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [editName, setEditName] = useState(categoryName);
    const [detailOpen, setDetailOpen] = useState(false);

    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');


    useEffect(() => {
        if (detailOpen) {
            console.log("📡 GET isteği atılıyor, categoryId:", categoryId);
            dispatch(fetchExpensesByCategory(categoryId))
                .unwrap()
                .then((res) => {
                    // console.log("✅ Gelen veriler:", res);
                })
                .catch((err) => {
                    console.error("❌ Hata:", err);
                });
        }
    }, [dispatch, categoryId, detailOpen]);



    const handleAdd = async () => {
        if (expenseTitle.trim() && expenseAmount) {
            await dispatch(createExpense({
                title: expenseTitle,
                amount: parseFloat(expenseAmount),
                category: categoryId
            }));
            setExpenseTitle('');
            setExpenseAmount('');
            setIsOpen(false);
        }
    };


    const handleUpdate = () => {
        if (editName.trim() !== '' && onUpdateCategory) {
            onUpdateCategory(editName);
            setIsUpdateOpen(false);
        }
    };

    const handleDeleteExpense = (id: string) => {
        console.log("Silinecek ID:", id);
        dispatch(deleteExpense(id))
            .unwrap()
            .then(() => {
                console.log("✅ Harcama silindi:", id);
                setDetailOpen(false); // Modal kapat
            })
            .catch((err) => {
                console.error("❌ Silme hatası:", err);
            });
    };

    const handleUpdateExpense = (id: string, title: string, amount: number, category: string) => {
        dispatch(updateExpense({ id, title, amount, category }))
            .unwrap()
            .then((updatedExpense) => {
                console.log("Güncelleme başarılı:", updatedExpense);
                setDetailOpen(false); // Modal kapat

            })
            .catch((error) => {
                console.error("Güncelleme hatası:", error);
            });
    };

    return (
        <>
            <div
                className="relative bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-5 shadow-lg mb-4 hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => setDetailOpen(true)}
            >
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl">{categoryName}</h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen((prev) => !prev);
                        }}
                        className="p-1 rounded hover:bg-white/20"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                {menuOpen && (
                    <div
                        className="absolute right-3 top-10 bg-white text-black rounded shadow-md z-20 w-32"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => { setIsUpdateOpen(true); setMenuOpen(false); }}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                        >
                            Güncelle
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onDeleteCategory) onDeleteCategory();
                                setMenuOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                        >
                            Sil
                        </button>
                    </div>
                )}

                <button
                    onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                    className="mt-3 bg-white/20 px-3 py-1 rounded hover:bg-white/30"
                >
                    Harcama Ekle
                </button>
            </div>

            {/* Harcama ekleme modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Harcama Ekle - {categoryName}</h2>
                        <input
                            type="text"
                            placeholder="Harcama başlığı"
                            className="border rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={expenseTitle}
                            onChange={(e) => setExpenseTitle(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Harcama miktarı"
                            className="border rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600"
                            >
                                Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Kategori güncelleme modal */}
            {isUpdateOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Kategori Güncelle</h2>
                        <input
                            type="text"
                            placeholder="Yeni kategori adı"
                            className="border rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsUpdateOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Harcama detay modal */}
            {/* Harcama detay modal */}
            {detailOpen && (
                <CategoryDetailModal
                    key={categoryId} // <-- bu önemli
                    onClose={() => setDetailOpen(false)}
                    expenses={expenses}
                    onDeleteExpense={handleDeleteExpense}
                    onUpdateExpense={handleUpdateExpense}
                />



            )}





        </>
    );
};

export default CategoryCard;
