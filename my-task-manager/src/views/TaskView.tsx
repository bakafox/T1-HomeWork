import styles from './TaskView.module.css'
import React from 'react'
import { useState, useEffect } from 'react'
import type { Task } from '../types/types'
import { useParams, useNavigate } from "react-router";

import { Typography } from 'antd'
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import TaskDetails from '../components/TaskDetails'

type Props = {
    getTasks: Task[],
    setTasks: (t: Task[]) => void
}

const TaskView: React.FC<Props> = (props) => {
    const { getTasks, setTasks } = props

    const params = useParams()
    const taskId = +(params?.id || -1)
    const navigate = useNavigate()

    const [getTaskNotFound, setTaskNotFound] = useState<boolean>(false)
    const [getTaskSaved, setTaskSaved] = useState<boolean>(false)

    const [getCurrTask, setCurrTask] = useState<Task>((): Task => {
        const currTask = getTasks.filter((t) => t.key === taskId)
        console.log(currTask)

        if (currTask.length <= 0) {
            setTaskNotFound(true)

            // Просто чтобы не было ошибки, все равно её юзер не увидит
            return getTasks[0]
        }
        return currTask[0]
    })

    useEffect(() => {
        if (getTaskNotFound) navigate('/')
    }, [getTaskNotFound])

    useEffect(() => {
        setTasks(getTasks.map(t => t.key === getCurrTask.key ? getCurrTask : t))
        console.log(getCurrTask)
        if (getTaskSaved) navigate('/')
    }, [getTaskSaved])    

    return (
        <>
            <header>
                <Typography.Title level={2}><i>Редактирование задачи</i></Typography.Title>
            </header>

            {/* Почему в React нет v-if v-else как во Vue? Неудобно */}
            <main className={(getTaskNotFound || getTaskSaved) ? styles.hidden : ''}>
                <TaskDetails getTask={getCurrTask} setTask={setCurrTask} setFinished={setTaskSaved} />
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

export default TaskView
