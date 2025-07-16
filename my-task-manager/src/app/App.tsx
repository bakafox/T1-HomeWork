import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ListPage from '@pages/task-list/ui/ListPage'
import NewPage from '@pages/task-new/ui/NewPage'
import EditPage from '@pages/task-edit/ui/EditPage'

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/task/new" element={<NewPage />} />
            <Route path="/task/:id" element={<EditPage />} />
        </Routes>
    )
}

export default App
