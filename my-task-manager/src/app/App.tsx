import type { AppDispatch, RootState } from '@app/store'
import { getTasks } from '@entities/Task/model/tasksSlice'
import EditPage from '@pages/task-edit/ui/EditPage'
import ListPage from '@pages/task-list/ui/ListPage'
import NewPage from '@pages/task-new/ui/NewPage'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

const App: React.FC = () => {
    const tasks = useSelector(
        (state: RootState) => state.tasks.value,
    )

    const [getInitLoadFinished, setInitLoadFinished] = useState<boolean>(false)

    const dispatch: AppDispatch = useDispatch()

    // Не самое элегантное решение, но... работает жи...
    useEffect(() => {
        if (!getInitLoadFinished) {
            // const lsTasksJson: string | null = localStorage.getItem('myTasks')
            // const lsTasks: Task[] = lsTasksJson
            //     ? JSON.parse(lsTasksJson)
            //     : []
            // lsTasks.forEach((t: Task) => {
            //     dispatch(createTask({ task: t }))
            // })

            dispatch(getTasks({}))

            setInitLoadFinished(true)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('myTasks', JSON.stringify(tasks))
    }, [tasks])

    // if (!getInitLoadFinished) {
    //     return <></>
    // }

    return (
        <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/task/new" element={<NewPage />} />
            <Route path="/task/:id" element={<EditPage />} />
        </Routes>
    )
}

export default App
