// C:\Users\Hamza\Desktop\case\client\src\features\expenses/expensesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/apiClient';

interface Expense {
    user: any;
    _id: string;
    title: string;
    amount: number;
    category: string;
    createdAt: string;
    updatedAt: string;
}

interface ExpenseState {
    expenses: Expense[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// GET by category
export const fetchExpensesByCategory = createAsyncThunk<Expense[], string>(
    'expenses/fetchExpensesByCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            const res = await apiClient.get(`/expenses/categorId/${categoryId}`);
            if (res.data.success) {
                return res.data.data as Expense[];
            } else {
                return rejectWithValue('Harcamalar çekilemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

// CREATE
export const createExpense = createAsyncThunk<Expense, { title: string; amount: number; category: string }>(
    'expenses/createExpense',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await apiClient.post('/expenses/category', payload);
            if (res.data.success) {
                return res.data.data as Expense;
            } else {
                return rejectWithValue('Harcama oluşturulamadı');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

// DELETE
export const deleteExpense = createAsyncThunk<string, string>(
    'expenses/deleteExpense',
    async (id, { rejectWithValue }) => {
        try {
            const res = await apiClient.delete(`/expenses/${id}`);
            if (res.data.success) {
                return id;
            } else {
                return rejectWithValue('Harcama silinemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

const initialState: ExpenseState = {
    expenses: [],
    status: 'idle',
    error: null
};
// UPDATE
export const updateExpense = createAsyncThunk<
    Expense,
    { id: string; title: string; amount: number; category: string }
>(
    'expenses/updateExpense',
    async ({ id, title, amount, category }, { rejectWithValue }) => {
        try {
            const res = await apiClient.put(`/expenses/${id}`, { title, amount, category });
            if (res.data.success) {
                return res.data.data as Expense;
            } else {
                return rejectWithValue('Harcama güncellenemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchExpensesByCategory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchExpensesByCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.expenses = action.payload;
            })
            .addCase(fetchExpensesByCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // CREATE
            .addCase(createExpense.fulfilled, (state, action) => {
                state.expenses.push(action.payload);
            })

            // DELETE
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.expenses = state.expenses.filter(exp => exp._id !== action.payload);
            })
            // UPDATE
            .addCase(updateExpense.fulfilled, (state, action) => {
                const index = state.expenses.findIndex(exp => exp._id === action.payload._id);
                if (index !== -1) {
                    state.expenses[index] = action.payload;
                }
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.error = action.payload as string;
            });

    }
});

export default expensesSlice.reducer;
