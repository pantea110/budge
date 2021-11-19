import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const createAccount = createAsyncThunk('accounts/create', async ({ name, accountType, budgetId }) => {
  return await api.createAccount(name, accountType, budgetId);
})

export const fetchAccounts = createAsyncThunk('accounts/fetch', async ({ budgetId }) => {
  return await api.fetchAcounts(budgetId);
})

export const createPayee = createAsyncThunk('payees/create', async ({ name, budgetId }) => {
  return await api.createPayee(name, budgetId);
})

export const fetchPayees = createAsyncThunk('accounts/fetchPayees', async (_, { getState }) => {
  const store = getState()
  return await api.fetchPayees(store.budgets.activeBudget.id)
})

const accountsSlice = createSlice({
  name: 'accounts',

  initialState: {
    accounts: [],
    accountById: {},
    payees: [],
  },

  reducers: {
    setAccounts: (state, { payload }) => {
      state.accounts = payload

      // Map all accounts to make lookups faster
      payload.map(account => {
        accountsSlice.caseReducers.mapIdToAccount(state, { payload: { accountId: account.id, account } })
      })
    },

    mapIdToAccount: (state, { payload: { accountId, account }}) => {
      state.accountById[accountId] = account
    },
  },

  extraReducers: {
    [createAccount.fulfilled]: (state, { payload }) => {
      state.accounts.push(payload)
      state.accountById[payload.id] = payload
    },

    [fetchAccounts.fulfilled]: (state, { payload }) => {
      state.accounts = payload
    },

    [createPayee.fulfilled]: (state, { payload }) => {
      state.payees.push(payload)
    },

    [fetchPayees.fulfilled]: (state, { payload }) => {
      state.payees = payload
    },
  },
})

export const { setAccounts, mapIdToAccount } = accountsSlice.actions

export default accountsSlice
