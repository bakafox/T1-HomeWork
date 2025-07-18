import type { Task } from '@entities/Task/model/types'

import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface TasksState {
    value: Task[],
}
const tasksInitialState: TasksState = {
    value: [],
}

const tasksSlice = createSlice({
    name: 'tasks',

    initialState: tasksInitialState,

    reducers: {
        createTask(state, action: PayloadAction<{ newTask: Task }>) {
            // console.log(state, action)

            if (!action.payload.newTask.title)
                return

            const newTaskId = (action.payload.newTask.key)
                ? action.payload.newTask.key
                : (state.value.length > 0)
                        ? state.value[state.value.length - 1].key + 1
                        : 1 // С нуля обычные люди, в отличие от нас, не считают :)

            state.value.push({
                ...action.payload.newTask,
                key: newTaskId,
            })
        },

        deleteTask(state, action: PayloadAction<{ taskId: number }>) {
            // console.log(state, action)

            state.value = state.value.filter((t: Task) => (
                t.key !== action.payload.taskId
            ))
        },

        updateTask(state, action: PayloadAction<{ newTask: Task, taskId: number }>) {
            // console.log(state, action)

            state.value = state.value.map((t: Task) => {
                if (t.key === action.payload.taskId) {
                    return action.payload.newTask
                }
                return t
            })
        },
    },
})

export const {
    createTask,
    deleteTask,
    updateTask,
} = tasksSlice.actions

export default tasksSlice.reducer
