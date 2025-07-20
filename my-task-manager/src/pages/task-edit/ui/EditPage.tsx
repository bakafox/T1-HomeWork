import type { AppDispatch, RootState } from '@app/store'
import type { Task } from '@entities/Task/model/types'
import type { TaskStatus } from '@widgets/task-form/model/types'
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { deleteTask, updateTask } from '@entities/Task/model/tasksSlice'
import TaskForm from '@widgets/task-form/ui/TaskForm'

import { Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import styles from './EditPage.module.css'

const TaskEditPage: React.FC = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()

    const tasks = useSelector(
        (state: RootState) => state.tasks.value,
    )
    const taskId = +(params?.id || -1)

    const [getTaskNotFound, setTaskNotFound] = useState<boolean>(false)
    const [getTaskStatus, setTaskStatus] = useState<TaskStatus>('editing')

    const [getNewTask, setNewTask] = useState<Task>((): Task => {
        const currTask = tasks.filter((t: Task) => t.id === taskId)

        if (currTask.length <= 0) {
            setTaskNotFound(true)
            // Просто чтобы не было ошибки, все равно её юзер не увидит
            return tasks[0]
        }
        return currTask[0]
    })

    useEffect(() => {
        if (getTaskNotFound)
            navigate('/')
    }, [getTaskNotFound])

    useEffect(() => {
        if (getTaskStatus === 'saved') {
            dispatch(updateTask({ taskId, task: getNewTask }))
            navigate('/')
        }
        else if (getTaskStatus === 'deleted') {
            dispatch(deleteTask({ taskId }))
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
                <Typography.Title level={4} type="danger">
                    <ExclamationCircleOutlined /> Задача не найдена!
                </Typography.Title>
            </main>

            <main className={getTaskStatus === 'saved' ? '' : styles.hidden}>
                <Typography.Title level={4} type="success">
                    <CheckCircleOutlined /> Изменения сохранены!
                </Typography.Title>
            </main>
        </>
    )
}

export default TaskEditPage
