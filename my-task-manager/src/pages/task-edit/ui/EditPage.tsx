import styles from './EditPage.module.css'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router"
import type { Task } from '@entities/Task/model/types'
import type { TaskStatus } from '@widgets/task-form/model/types'

import { useDispatch, useSelector } from 'react-redux'
import { deleteTask, updateTask } from '@entities/Task/model/tasksSlice'
import type { RootState } from '@app/store'

import { Typography } from 'antd'
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import TaskForm from '@widgets/task-form/ui/TaskForm'

const TaskEditPage: React.FC = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const tasks = useSelector(
        (state: RootState) => state.tasks.value
    )
    const taskId = +(params?.id || -1)

    const [getTaskNotFound, setTaskNotFound] = useState<boolean>(false)
    const [getTaskStatus, setTaskStatus] = useState<TaskStatus>('editing')

    const [getNewTask, setNewTask] = useState<Task>((): Task => {
        const currTask = tasks.filter((t: Task) => t.key === taskId)

        if (currTask.length <= 0) {
            setTaskNotFound(true)
            // Просто чтобы не было ошибки, все равно её юзер не увидит
            return tasks[0]
        }
        return currTask[0]
    })

    useEffect(() => {
        if (getTaskNotFound) navigate('/')
    }, [getTaskNotFound])

    useEffect(() => {
        if (getTaskStatus === 'saved') {
            dispatch(updateTask({ taskId: taskId, newTask: getNewTask }))
            navigate('/')
        }
        else if (getTaskStatus === 'deleted') {
            dispatch(deleteTask({ taskId: taskId }))
            navigate('/')
        }
        else if (getTaskStatus === 'cancelled') {
            navigate('/')
        }
    }, [getTaskStatus])    

    return (
        <>
            <header className={styles.header}>
                <Typography.Title level={2}><i>Редактирование задачи</i></Typography.Title>
            </header>

            {/* Почему в React нет v-if v-else как во Vue? Неудобно >_< */}
            <main className={(getTaskNotFound || getTaskStatus !== 'editing') ? styles.hidden : ''}>
                <TaskForm getTask={getNewTask} setTask={setNewTask} setStatus={setTaskStatus} />
            </main>

            <main className={getTaskNotFound ? '' : styles.hidden}>
                <Typography.Title level={4} type='danger'>
                    <ExclamationCircleOutlined /> Задача не найдена!
                </Typography.Title>
            </main>

            <main className={getTaskStatus === 'saved' ? '' : styles.hidden}>
                <Typography.Title level={4} type='success'>
                    <CheckCircleOutlined /> Изменения сохранены!
                </Typography.Title>
            </main>
        </>
    )
}

export default TaskEditPage
