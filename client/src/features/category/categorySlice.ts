import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/apiClient';

// Tipler slice içinde tanımlandı
interface Category {
    _id: string;
    name: string;
    user: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface CategoryState {
    categories: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// GET
export const fetchCategories = createAsyncThunk<Category[]>(
    'category/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient.get('/categories/my-categories', {

            });

            if (res.data.success) {
                return res.data.data as Category[];
            } else {
                return rejectWithValue('Veri çekilemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);


// CREATE
export const createCategory = createAsyncThunk<Category, { name: string }>(
    'category/createCategory',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await apiClient.post('/categories/category', payload);
            if (res.data.success) {
                return res.data.data as Category;
            } else {
                return rejectWithValue('Kategori oluşturulamadı');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

// UPDATE
export const updateCategory = createAsyncThunk<
    Category,
    { id: string; name: string }
>(
    'category/updateCategory',
    async ({ id, name }, { rejectWithValue }) => {
        try {
            const res = await apiClient.put(`/categories/${id}`, { name });
            if (res.data.success) {
                return res.data.data as Category;
            } else {
                return rejectWithValue('Kategori güncellenemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

// DELETE
export const deleteCategory = createAsyncThunk<string, string>(
    'category/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const res = await apiClient.delete(`/categories/${id}`);
            if (res.data.success) {
                return id; // silinen id döndürülüyor
            } else {
                return rejectWithValue('Kategori silinemedi');
            }
        } catch (err: any) {
            return rejectWithValue(err.message || 'Bir hata oluştu');
        }
    }
);

const initialState: CategoryState = {
    categories: [],
    status: 'idle',
    error: null
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // CREATE
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })

            // UPDATE
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(
                    (cat) => cat._id === action.payload._id
                );
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })

            // DELETE
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(
                    (cat) => cat._id !== action.payload
                );
            });
    }
});

export default categorySlice.reducer;
