'use client';
import React, { useState } from 'react';
import { useAppDispatch } from '@/store/store';
import { createCategory } from '@/features/category/categorySlice';

const AddCategory: React.FC = () => {
    const [categoryName, setCategoryName] = useState('');
    const dispatch = useAppDispatch();

    const handleAdd = () => {
        if (categoryName.trim() !== '') {
            dispatch(createCategory({ name: categoryName }));
            setCategoryName('');
        }
    };

    return (
        <div className="flex gap-2 mb-6">
            <input
                type="text"
                placeholder="Yeni kategori ekle"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
            />
            <button
                onClick={handleAdd}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
                Ekle
            </button>
        </div>
    );
};

export default AddCategory;
