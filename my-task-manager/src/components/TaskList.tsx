import styles from './TaskList.module.css'
import React from 'react'
import { useNavigate } from "react-router"
import type { Task } from '../types/types'

import { useDispatch } from 'react-redux'
import { deleteTask } from '../store/tasksSlice'

import TaskItem from './TaskItem'
import { Typography, Divider } from 'antd'


type Props = {
    listName: string,
    tasks: Task[]
}

const TaskList: React.FC<Props> = (props) => {
    const { listName, tasks } = props
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return (
        <div className={styles.tasklist}>
            <Divider orientation="left" orientationMargin="0" className={styles.divider}>
                <Typography.Title level={4}>{`${listName}: ${tasks.length} задач`}</Typography.Title>
            </Divider>
            
            {tasks.map((t) => (
                <TaskItem task={t} key={t.key}
                    onEdit={() => navigate(`/task/${t.key}`)}
                    onDelete={() => dispatch(deleteTask({ taskId: t.key }))}
                />
            )).reverse() /* <-- Чтобы самые новые задачи были наверху */}
        </div>
    )
}

export default TaskList
