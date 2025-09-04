'use client';

import React, { useEffect } from 'react';
import AddCategory from '@/components/expensesComponents/AddCategory';
import CategoryCard from '@/components/expensesComponents/CategoryCard';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
    fetchCategories,
    updateCategory,
    deleteCategory,
} from '@/features/category/categorySlice';

export default function ExpensesPage() {
    const dispatch = useAppDispatch();
    const { categories, status, error } = useAppSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);


    const handleDeleteCategory = (id: string) => {
        dispatch(deleteCategory(id));
    };

    const handleUpdateCategory = (id: string, newName: string) => {
        dispatch(updateCategory({ id, name: newName }));
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Harcama Takibi</h1>

            <AddCategory />

            {status === 'loading' && <p>Yükleniyor...</p>}
            {status === 'failed' && <p className="text-red-500">{error}</p>}

            {status === 'succeeded' && categories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                        <CategoryCard
                            key={cat._id}
                            categoryId={cat._id}
                            categoryName={cat.name}
                            onDeleteCategory={() => handleDeleteCategory(cat._id)}
                            onUpdateCategory={(newName) => handleUpdateCategory(cat._id, newName)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
