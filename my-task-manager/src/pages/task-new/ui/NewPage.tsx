import type { AppDispatch } from '@app/store'
import type { Task } from '@entities/Task/model/types'
import type { TaskStatus } from '@widgets/task-form/model/types'
import { CheckCircleOutlined } from '@ant-design/icons'
import { createTask } from '@entities/Task/model/tasksSlice'
import TaskForm from '@widgets/task-form/ui/TaskForm'

import { Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import styles from './NewPage.module.css'

const TaskNewPage: React.FC = () => {
    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()

    const [getTaskStatus, setTaskStatus] = useState<TaskStatus>('editing')

    // key теперь будем назначать внутри Action-а createTask
    const newTask = {} as Task
    const [getNewTask, setNewTask] = useState<Task>(newTask)

    useEffect(() => {
        if (getTaskStatus === 'saved') {
            dispatch(createTask({ task: getNewTask }))
            navigate('/')
        }
        else if (getTaskStatus === 'cancelled') {
            navigate('/')
        }
    }, [getTaskStatus])

    return (
        <>
            <header className={styles.header}>
                <Typography.Title level={2}><i>Новая задача</i></Typography.Title>
            </header>

            <main className={getTaskStatus !== 'editing' ? styles.hidden : ''}>
                <TaskForm getTask={getNewTask} setTask={setNewTask} setStatus={setTaskStatus} />
            </main>

            <main className={getTaskStatus === 'saved' ? '' : styles.hidden}>
                <Typography.Title level={4} type="success">
                    <CheckCircleOutlined /> Изменения сохранены!
                </Typography.Title>
            </main>
        </>
    )
}

export default TaskNewPage
