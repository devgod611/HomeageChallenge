import { createSlice } from '@reduxjs/toolkit'

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    tab: '/',
  },
  reducers: {
    setTab: (state, action) => {
      state.tab = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTab } = navigationSlice.actions

export default navigationSlice.reducer