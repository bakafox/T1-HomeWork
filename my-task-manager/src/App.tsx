import React from 'react'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import type { Task } from './types/types'

import ListView from './views/ListView'
import TaskView from './views/TaskView'

const App: React.FC = () => {
    const [getTasks, setTasks] = useState<Task[]>([
        {
            key: 1, title: 'Реализовать редактирование заданий',
            category: 'Feature', status: 'In Progress', priority: 'High'
        },
        {
            key: 2, title: 'Удалить неприличные выражения в комментариях к коду',
            description: 'Маты это плохо!!! (хотя конкретно в этом коде их и не было)',
            category: 'Refactor', status: 'Done', priority: 'Low'
        },
        {
            key: 0, title: 'Реализовать тёмную тему (nuff said)',
            category: 'Feature', status: 'To Do', priority: 'Medium'
        },
        {
            key: 3, title: 'Возможность добавлять категории к задачам',
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
            category: 'Documentation', status: 'To Do', priority: 'Low'
        },
    ])

    return (
        <Routes>
            <Route path="/" element={<ListView getTasks={getTasks} />} />
            <Route path="/task/:id" element={<TaskView getTasks={getTasks} setTasks={setTasks} />} />
        </Routes>
    )
}

export default App
