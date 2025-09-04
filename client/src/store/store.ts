'use client';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import expensesReducer from '../features/expenses/expensesSlice'; // ✅ Expenses slice ekledik
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import categoryReducer from '../features/category/categorySlice';

export const store = configureStore({
    reducer: {
        category: categoryReducer,
        counter: counterReducer,
        expenses: expensesReducer,
        dashboard: dashboardReducer,


    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
