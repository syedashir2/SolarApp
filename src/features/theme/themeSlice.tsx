import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// export interface CounterState {
//   value: number
// }

const initialState = {
    color: '',
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeColor: (state, action: PayloadAction<string>) => {
            state.color = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { changeColor } = themeSlice.actions

export default themeSlice.reducer