import type { Task } from '@entities/Task/model/types'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// eslint-disable-next-line prefer-template
const API_ROOT = import.meta.env.VITE_API_ROOT + 'tasks'

// https://redux-toolkit.js.org/api/createAsyncThunk
// Сначала описываем Thunk-и (обёртки для fetch, я так понимаю)

const getTasks = createAsyncThunk(
    'tasks/getTasks', // <-- Не имя API эндпоинта, а имя для RTK!
    async (
        { query }: { query?: string },
    ): Promise<Task[]> => {
        const json = await fetch(
            `${API_ROOT}?q=${query ?? ''}`,
        )

        if (!json.ok) {
            console.error(json)
            return [] as Task[]
        }

        const data: Task[] = await json.json()
        // console.log('getTasks', json, data)
        return data
    },
)

// const getTask = createAsyncThunk(
//     'tasks/getTask', // <-- Не имя API эндпоинта, а имя для RTK!
//     async (
//         { taskId }: { taskId: number },
//     ): Promise<Task> => {
//         const json = await fetch(
//             `${API_ROOT}/${taskId}`,
//         )

//         if (!json.ok) {
//             console.error(json)
//             return {} as Task
//         }

//         const data: Task = await json.json()
//         // console.log('getTask', json, data)
//         return data
//     },
// )

const deleteTask = createAsyncThunk(
    'tasks/deleteTask', // <-- Не имя API эндпоинта, а имя для RTK!
    async (
        { taskId }: { taskId: number },
    ): Promise<Task> => {
        const json = await fetch(
            `${API_ROOT}/${taskId}`,
            {
                method: 'DELETE'
            },
        )

        if (!json.ok) {
            console.error(json)
            return {} as Task
        }

        const data: Task = await json.json()
        // console.log('deleteTask', json, data)
        return data
    },
)

const updateTask = createAsyncThunk(
    'tasks/updateTask', // <-- Не имя API эндпоинта, а имя для RTK!
    async (
        { taskId, task }: { taskId: number, task: Task },
    ): Promise<Task> => {
        const json = await fetch(
            `${API_ROOT}/${taskId}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            },
        )

        if (!json.ok) {
            console.error(json)
            return {} as Task
        }

        const data: Task = await json.json()
        // console.log('updateTask', json, data)
        return data
    },
)

const createTask = createAsyncThunk(
    'tasks/createTask', // <-- Не имя API эндпоинта, а имя для RTK!
    async (
        { task }: { task: Task },
    ): Promise<Task> => {
        const json = await fetch(
            `${API_ROOT}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            },
        )

        if (!json.ok) {
            console.error(json)
            return {} as Task
        }

        const data: Task = await json.json()
        // console.log('createTask', json, data)
        return data
    },
)

// Теперь все наши Thunk-и оборачиваем в особые редюсеры, которые
// можут иметь доступ к действия, произошедшим не внутри слайса
interface TasksState {
    value: Task[],
}
const tasksInitialState: TasksState = {
    value: [],
}

const tasksSlice = createSlice({
    name: 'tasks',

    initialState: tasksInitialState,

    reducers: {},

    extraReducers(builder) {
        builder
            .addCase(getTasks.fulfilled, (state, action) => {
                console.log(state, action)
                state.value = action.payload
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                console.log(state, action)
                state.value = state.value.filter(
                    (t: Task) => t.id !== action.payload.id,
                )
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                console.log(state, action)
                state.value = state.value.map((t: Task) => {
                    if (t.id === action.payload.id) {
                        return action.payload
                    }
                    return t
                })
            })
            .addCase(createTask.fulfilled, (state, action) => {
                console.log(state, action)
                state.value.push(action.payload)
            })
    },
})

// То есть логика в том, что мы вызываем сами внешние фукнции,
// (которые тоже возвращают какие-то данные), а extra reducer
// их наблюдает, и, когда они выполняются, делает определённые
// действия со значенинем внутри слайса.
export {
    getTasks,
    // getTask,
    deleteTask,
    updateTask,
    createTask,
}

export default tasksSlice.reducer
