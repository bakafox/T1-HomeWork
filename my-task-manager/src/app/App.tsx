import React from 'react'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import type { Task } from '@entities/Task/model/types'

import { useDispatch, useSelector } from 'react-redux'
import { createTask } from '@entities/Task/model/tasksSlice'
import type { RootState } from '@app/store'

import ListPage from '@pages/task-list/ui/ListPage'
import NewPage from '@pages/task-new/ui/NewPage'
import EditPage from '@pages/task-edit/ui/EditPage'

const App: React.FC = () => {
    const tasks = useSelector(
        (state: RootState) => state.tasks.value
    )
    
    const dispatch = useDispatch()

    // Не самое элегантное решение, но... работает жи...
    useEffect(() => {
        if (tasks.length <= 0) {
            const lsTasksJson: string | null = localStorage.getItem("myTasks")
            const lsTasks: Task[] = lsTasksJson ? JSON.parse(lsTasksJson)
            : [
                {
                    key: 1, title: 'Реализовать редактирование заданий',
                    category: 'Feature', status: 'Done', priority: 'High'
                },
                {
                    key: 2, title: 'Удалить неприличные выражения в комментариях к коду',
                    description: 'Маты это плохо!!! (хотя конкретно в этом коде их и не было)',
                    category: 'Refactor', status: 'In Progress', priority: 'Low'
                },
                {
                    key: 0, title: 'Реализовать тёмную тему (nuff said)',
                    category: 'Feature', status: 'To Do', priority: 'Medium'
                },
                {
                    key: 3, title: 'Возможность добавлять новые категории к задачам',
                    category: 'Feature', status: 'Done', priority: 'Medium'
                },
                {
                    key: 4, title: 'Возможность удаления и добавления заданий',
                    description: 'Оказалось, что не все клиенты довольны тем, что для добавления '
                    + 'нового задания нужно лезть в исходный код фронта. Надо что-то предпринять!',
                    category: 'Feature', status: 'To Do', priority: 'High'
                },
                {
                    key: 5, title: 'Протестировать на умной микроволновке в состоянии нагрузки',
                    category: 'Test', status: 'In Progress', priority: 'Medium'
                },
                {
                    key: 6, title: 'Написать README.MD к этой задаче',
                    category: 'Documentation', status: 'Done', priority: 'Low'
                },
                {
                    key: 7, title: 'Добавить возможность удаления и создания заданий',
                    category: 'Feature', status: 'Done', priority: 'High'
                },
                {
                    key: 8, title: 'Перестроить архитектуру в соответствие с FSD',
                    category: 'Feature', status: 'In Progress', priority: 'High'
                },
            ]
            
            lsTasks.forEach((t: Task) => {
                dispatch(createTask({ newTask: t }))
            })
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('myTasks', JSON.stringify(tasks))
    }, [tasks])

    return (
        <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/task/new" element={<NewPage />} />
            <Route path="/task/:id" element={<EditPage />} />
        </Routes>
    )
}

export default App
