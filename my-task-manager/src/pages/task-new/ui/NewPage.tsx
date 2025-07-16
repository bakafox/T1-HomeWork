import styles from './NewPage.module.css'
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router"
import type { Task } from '@entities/Task/model/types'

import { useDispatch } from 'react-redux'
import { createTask } from '@entities/Task/model/tasksSlice'

import { Typography } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import TaskForm from '@widgets/task-form/ui/TaskForm'

const TaskNewPage: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [getTaskSaved, setTaskSaved] = useState<boolean>(false)

    // key теперь будем назначать внутри Action-а createTask
    const newTask = {} as Task
    const [getNewTask, setNewTask] = useState<Task>(newTask)

    useEffect(() => {
        if (getTaskSaved) {
            dispatch(createTask({ newTask: getNewTask }))
            navigate('/')
        }
    }, [getTaskSaved])

    return (
        <>
            <header className={styles.header}>
                <Typography.Title level={2}><i>Новая задача</i></Typography.Title>
            </header>

            <main className={getTaskSaved ? styles.hidden : ''}>
                <TaskForm getTask={getNewTask} setTask={setNewTask} setFinished={setTaskSaved} />
            </main>

            <main className={getTaskSaved ? '' : styles.hidden}>
                <Typography.Title level={4} type='success'>
                    <CheckCircleOutlined /> Изменения сохранены!
                </Typography.Title>
            </main>
        </>
    )
}

export default TaskNewPage
