import type { AppDispatch } from '@app/store'
import type { Task } from '@entities/Task/model/types'
import { deleteTask } from '@entities/Task/model/tasksSlice'
import TaskItem from '@entities/Task/ui/TaskItem'

import { Divider, Typography } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import styles from './TaskList.module.css'

interface Props {
    listName: string,
    tasks: Task[],
}

const TaskList: React.FC<Props> = (props) => {
    const { listName, tasks } = props

    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()

    const tasksCountLabelRules = new Intl.PluralRules('ru-RU').select(tasks.length)

    const tasksCountLabel = (
        tasksCountLabelRules === 'one'
            ? 'задача'
            : tasksCountLabelRules === 'few'
                ? 'задачи'
                : 'задач'
    )

    return (
        <div className={styles.tasklist}>
            <Divider orientation="left" orientationMargin="0" className={styles.divider}>
                <Typography.Title level={4}>{`${listName}: ${tasks.length} ${tasksCountLabel}`}</Typography.Title>
            </Divider>

            {tasks.map(t => (
                <TaskItem
                    task={t}
                    key={t.id}
                    onEdit={() => navigate(`/task/${t.id}`)}
                    onDelete={() => dispatch(deleteTask({ taskId: t.id }))}
                />
            )).reverse() /* <-- Чтобы самые новые задачи были наверху */}
        </div>
    )
}

export default TaskList
