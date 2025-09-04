// src/features/dashboard/dashboardSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/apiClient';

// --- Tipler ---

// Expense tipi
interface DashboardExpense {
    id: string;
    title: string;
    amount: number;
    category: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

// Top kategori tipi
interface TopCategory {
    total: number;
    categoryId: string;
    categoryName: string;
}

// Günlük / Aylık istatistik tipleri
interface DailyStat {
    _id: string; // YYYY-MM-DD
    total: number;
}

interface MonthlyStat {
    _id: string; // YYYY-MM
    total: number;
}

// Slice state tipi
interface DashboardState {
    expenses: DashboardExpense[];
    totalAmount: number;
    topCategory: TopCategory | null;
    daily: DailyStat[];
    monthly: MonthlyStat[];
    paginatedExpenses: PaginatedExpenses | null; // ← burayı ekledik

    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// --- Thunks ---

// Tüm harcamalar
export const fetchDashboardExpenses = createAsyncThunk<DashboardExpense[]>(
    'dashboard/fetchExpenses',
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient.get('/expenses');
            if (res.data.success) {
                return res.data.data as DashboardExpense[];
            } else {
                return rejectWithValue('Dashboard verileri çekilemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

// En çok harcanan kategori
export const fetchTopCategory = createAsyncThunk<TopCategory>(
    'dashboard/fetchTopCategory',
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient.get('/expenses/summary/top-category');
            if (res.data.success) {
                return res.data.data as TopCategory;
            } else {
                return rejectWithValue('En çok harcanan kategori getirilemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

// Günlük / Aylık istatistikler
export const fetchStats = createAsyncThunk<
    { daily: DailyStat[]; monthly: MonthlyStat[] },
    void,
    { rejectValue: string }
>('dashboard/fetchStats', async (_, { rejectWithValue }) => {
    try {
        const res = await apiClient.get('/expenses/summary/stats');
        if (res.data.success) {
            return res.data.data as { daily: DailyStat[]; monthly: MonthlyStat[] };
        } else {
            return rejectWithValue('İstatistik verileri çekilemedi');
        }
    } catch (err: any) {
        return rejectWithValue(err.message || 'Bir hata oluştu');
    }
});

// --- Thunk: Kullanıcı bazlı toplam harcama ---
export const fetchTotalAmount = createAsyncThunk<number>(
    'dashboard/fetchTotalAmount',
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient.get('/expenses/summary/total');
            if (res.data.success) {
                return res.data.data.totalSpent; // burası önemli
            } else {
                return rejectWithValue('Toplam harcama getirilemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);
// --- Pagination tipi ---
interface PaginatedExpenses {
    data: DashboardExpense[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// --- Thunk: Sayfalı kullanıcı bazlı harcamalar ---
export const fetchPaginatedExpenses = createAsyncThunk<
    PaginatedExpenses,
    { page: number; limit: number },
    { rejectValue: string }
>(
    'dashboard/fetchPaginatedExpenses',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const res = await apiClient.get(`/expenses/summary/expenses?page=${page}&limit=${limit}`);
            if (res.data.success) {
                return res.data.data as PaginatedExpenses;
            } else {
                return rejectWithValue('Sayfalı harcama verileri çekilemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

// --- Initial State ---
const initialState: DashboardState = {
    expenses: [],
    totalAmount: 0,
    topCategory: null,
    daily: [],
    monthly: [],
    status: 'idle',
    error: null,
    paginatedExpenses: null, // initial null

};

// --- Slice ---
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // EXPENSES
            .addCase(fetchDashboardExpenses.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDashboardExpenses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.expenses = action.payload;
                state.totalAmount = action.payload.reduce((sum, exp) => sum + exp.amount, 0);
            })
            .addCase(fetchDashboardExpenses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // TOP CATEGORY
            .addCase(fetchTopCategory.fulfilled, (state, action) => {
                state.topCategory = action.payload;
            })
            .addCase(fetchTopCategory.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // STATS
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.daily = action.payload.daily;
                state.monthly = action.payload.monthly;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.error = action.payload || 'Bir hata oluştu';
            })
            // TOTAL AMOUNT
            .addCase(fetchTotalAmount.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTotalAmount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.totalAmount = action.payload;
            })
            .addCase(fetchTotalAmount.rejected, (state, action) => {
                state.status = 'failed';
            })
            .addCase(fetchPaginatedExpenses.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPaginatedExpenses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paginatedExpenses = action.payload;
            })
            .addCase(fetchPaginatedExpenses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Bir hata oluştu';
            });


    },
});

export default dashboardSlice.reducer;
