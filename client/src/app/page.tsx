'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchTotalAmount, fetchTopCategory, fetchStats, fetchPaginatedExpenses } from '@/features/dashboard/dashboardSlice';
import SummaryCards from '@/components/dashboardComponents/SummaryCards';
import ViewToggle from '@/components/dashboardComponents/ViewToggle';
import ExpensesChart from '@/components/dashboardComponents/ExpensesChart';
import PaginatedExpenses from '@/components/dashboardComponents/PaginatedExpenses';

export default function ExpensesDashboard() {
  const dispatch = useAppDispatch();
  const { totalAmount, topCategory, daily, monthly, paginatedExpenses, status, error } = useAppSelector((state) => state.dashboard);
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const [page, setPage] = useState(1);
  const limit = 3;

  useEffect(() => {
    dispatch(fetchTotalAmount());
    dispatch(fetchTopCategory());
    dispatch(fetchStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPaginatedExpenses({ page, limit }));
  }, [dispatch, page]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Harcama Dashboard</h1>

      <SummaryCards totalAmount={totalAmount} topCategory={topCategory} />
      <ViewToggle view={view} setView={setView} />
      <ExpensesChart view={view} daily={daily} monthly={monthly} />

      {status === 'loading' && <p>Yükleniyor...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {paginatedExpenses && (
        <PaginatedExpenses
          data={paginatedExpenses.data}
          page={paginatedExpenses.page}
          totalPages={paginatedExpenses.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
