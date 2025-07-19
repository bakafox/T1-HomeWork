import tasksReducer from '@entities/Task/model/tasksSlice'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
    },
})

// Чтобы компилятор не ругался
export type RootState = ReturnType<typeof store.getState>
