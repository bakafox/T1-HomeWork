import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Task } from '../types/types'

interface TasksState {
    value: Task[]
}
const initialState: TasksState = {
    value: []
}

const tasksSlice = createSlice({
    name: 'tasks',

    initialState: initialState,

    reducers: {
        createTask(state,
            action: PayloadAction<{ newTask: Task }>
        ) {
            console.log(state, action)

            const newTaskId = state.value.length
            state.value.push({
                ...action.payload.newTask,
                key: newTaskId
            })
        },

        deleteTask(state,
            action: PayloadAction<{ taskId: number }>
        ) {
            console.log(state, action)

            state.value = state.value.filter((t: Task) => (
                t.key !== action.payload.taskId
            ))
        },

        updateTask(state,
            action: PayloadAction<{ newTask: Task, taskId: number }>
        ) {
            console.log(state, action)

            state.value = state.value.map((t: Task) => {
                if (t.key === action.payload.taskId) {
                    return action.payload.newTask
                }
                return t
            })
        }
    }
})

export const {
    createTask, deleteTask, updateTask
} = tasksSlice.actions

export default tasksSlice.reducer
