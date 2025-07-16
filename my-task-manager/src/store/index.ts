import { configureStore } from "@reduxjs/toolkit"

import tasksReducer from './tasksSlice'

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
    }
})

// Чтобы компилятор не ругался
export type RootState = ReturnType<typeof store.getState>
