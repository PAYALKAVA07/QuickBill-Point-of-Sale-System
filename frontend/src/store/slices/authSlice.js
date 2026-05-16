import { createSlice } from '@reduxjs/toolkit'

const initialState = { token: localStorage.getItem('token') || null }

const slice = createSlice({ name: 'auth', initialState, reducers: {
  setToken(state, action){ state.token = action.payload; localStorage.setItem('token', action.payload); },
  clearToken(state){ state.token = null; localStorage.removeItem('token'); }
}})

export const { setToken, clearToken } = slice.actions
export default slice.reducer
