import tasksReducer from '@entities/Task/model/tasksSlice'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
