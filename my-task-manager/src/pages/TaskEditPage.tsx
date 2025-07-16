import styles from './TaskPages.module.css'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router"
import type { Task } from '../types/types'

import { useDispatch, useSelector } from 'react-redux'
import { updateTask } from '../store/tasksSlice'

import { Typography } from 'antd'
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import TaskForm from '../components/TaskForm'

const TaskEditPage: React.FC = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const tasks = useSelector(
        state => state.tasks.value
    )
    const taskId = +(params?.id || -1)

    const [getTaskNotFound, setTaskNotFound] = useState<boolean>(false)
    const [getTaskSaved, setTaskSaved] = useState<boolean>(false)

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
        if (getTaskSaved) {
            dispatch(updateTask({ taskId: taskId, newTask: getNewTask }))
            navigate('/')
        }
    }, [getTaskSaved])    

    return (
        <>
            <header>
                <Typography.Title level={2}><i>Редактирование задачи</i></Typography.Title>
            </header>

            {/* Почему в React нет v-if v-else как во Vue? Неудобно >_< */}
            <main className={(getTaskNotFound || getTaskSaved) ? styles.hidden : ''}>
                <TaskForm getTask={getNewTask} setTask={setNewTask} setFinished={setTaskSaved} />
            </main>

            <main className={getTaskNotFound ? '' : styles.hidden}>
                <Typography.Title level={4} type='danger'>
                    <ExclamationCircleOutlined /> Задача не найдена!
                </Typography.Title>
            </main>

            <main className={getTaskSaved ? '' : styles.hidden}>
                <Typography.Title level={4} type='success'>
                    <CheckCircleOutlined /> Изменения сохранены!
                </Typography.Title>
            </main>
        </>
    )
}

export default TaskEditPage
