import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ListPage from './pages/ListPage'
import TaskNewPage from './pages/TaskNewPage'
import TaskEditPage from './pages/TaskEditPage'

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/task/new" element={<TaskNewPage />} />
            <Route path="/task/:id" element={<TaskEditPage />} />
        </Routes>
    )
}

export default App
