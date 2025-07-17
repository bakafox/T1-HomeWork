import React from 'react'
import { useState, useEffect } from 'react'
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

    const [getInitLoadFinished, setInitLoadFinished] = useState<boolean>(false)
    
    const dispatch = useDispatch()

    // Не самое элегантное решение, но... работает жи...
    useEffect(() => {
        if (tasks.length <= 0) {
            const lsTasksJson: string | null = localStorage.getItem("myTasks")
            const lsTasks: Task[] = lsTasksJson ? JSON.parse(lsTasksJson)
            : [
                {
                    key: 2, title: 'Реализовать редактирование заданий',
                    category: 'Feature', status: 'Done', priority: 'High'
                },
                {
                    key: 3, title: 'Удалить неприличные выражения в комментариях к коду',
                    description: 'Маты это плохо!!! (хотя в этом коде их нет и не было)',
                    category: 'Refactor', status: 'In Progress', priority: 'Low'
                },
                {
                    key: 1, title: 'Реализовать тёмную тему (nuff said)',
                    category: 'Feature', status: 'To Do', priority: 'Medium'
                },
                {
                    key: 4, title: 'Возможность создавать кастомные категории',
                    category: 'Feature', status: 'To Do', priority: 'Low'
                },
                {
                    key: 5, title: 'Возможность удаления и добавления заданий',
                    description: 'Оказалось, что не все клиенты довольны тем, что для добавления '
                    + 'нового задания (или удаления старого) нужно лезть в исходный код фронта. '
                    + 'Надо срочно что-то предпринять, иначе это вызовет панику среди инвесторов!',
                    category: 'Feature', status: 'Done', priority: 'High'
                },
                {
                    key: 7, title: 'Написать README.MD к этой задаче',
                    category: 'Documentation', status: 'Done', priority: 'Low'
                },
                {
                    key: 6, title: 'Протестировать на умной микроволновке в состоянии нагрузки',
                    category: 'Test', status: 'In Progress', priority: 'Medium'
                },
                {
                    key: 8, title: 'Длинные заголовки у заданий сразу же обрезаются, хотя должны '
                    + 'переносится вплоть до 2 либо 3 линий (как сейчас у описаний задач)',
                    category: 'Bug', status: 'Done', priority: 'Medium'
                },
                {
                    key: 9, title: 'Перестроить архитектуру в соответствие с FSD',
                    category: 'Refactor', status: 'In Progress', priority: 'High'
                },
                {
                    key: 10, title: 'На тач устройствах, ввиду отстутствия :hover, можно тапнуть '
                    + 'на правый нижний угол карточки и тут же совершенно случайно удалить задание!',
                    description: 'Спасибо Полине Королёвой, заметившей багу и сообщившей мне о ней.',
                    category: 'Bug', status: 'Done', priority: 'Medium'
                },
            ]
            
            lsTasks.forEach((t: Task) => {
                dispatch(createTask({ newTask: t }))
            })

            setInitLoadFinished(true)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('myTasks', JSON.stringify(tasks))
    }, [tasks])

    if (!getInitLoadFinished) return <></>
    return (
        <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/task/new" element={<NewPage />} />
            <Route path="/task/:id" element={<EditPage />} />
        </Routes>
    )
}

export default App
