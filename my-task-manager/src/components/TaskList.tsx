import styles from './TaskList.module.css'
import React from 'react'
import { useNavigate } from "react-router"
import type { Task } from '../types/types'

import TaskItem from './TaskItem'
import { Typography, Divider } from 'antd'


type Props = {
    listName: string,
    getTasks: Task[]
    // setTasks: (t: Task[]) => void
}

const TaskList: React.FC<Props> = (props) => {
    const { listName, getTasks } = props
    
    const navigate = useNavigate()

    return (
        <div className={styles.tasklist}>
            <Divider orientation="left" orientationMargin="0" className={styles.divider}>
                <Typography.Title level={4}>{`${listName}: ${getTasks.length} задач`}</Typography.Title>
            </Divider>
            
            {getTasks.map((t) => (
                <TaskItem onClicked={() => navigate(`/task/${t.key}`)} task={t} key={t.key} />
            ))}
        </div>
    )
}

export default TaskList
