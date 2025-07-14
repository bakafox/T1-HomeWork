import styles from './Taskitem.module.css'
import React, { type ReactNode } from 'react'
import type { Task } from '../types/types'

import { Card, Tag, Typography } from 'antd'
import { ExclamationCircleOutlined, SyncOutlined, CheckCircleOutlined, EditOutlined } from '@ant-design/icons';

const getStatusData = (status: string): { name: ReactNode, color: string } => {
    switch (status) {
        case 'To Do':
            return {
                name: <><ExclamationCircleOutlined /> К выполнению</>,
                color: 'magenta'
            }
        case 'In Progress':
            return {
                name: <><SyncOutlined /> В процессе…</>,
                color: 'gold'
            }
        case 'Done':
            return {
                name: <><CheckCircleOutlined /> Дело сделано!</>,
                color: 'green'
            }
        default:
            return {
                name: <><ExclamationCircleOutlined /> Неизвестно</>,
                color: 'cyan'
            }
    }
}

type Props = {
    task: Task,
    onClicked: () => void
}

const TaskItem: React.FC<Props> = (props) => {
    const { task, onClicked } = props
    const statusData = getStatusData(task.status)

    return (
        <Card tabIndex={0} aria-description={`${task.title} — ${task.description}`}
            className={`
                ${styles.taskitem}
                ${task.priority === 'High' ? styles.high
                : task.priority === 'Low' ? styles.low : styles.medium}
            `} 
            title={<>
                <Tag color={statusData.color}>{statusData.name}</Tag> {task.title}
            </>}
            extra={
                <button className={styles['taskitem-edit']} title='Изменить' aria-label='Кнопка изменения задачи'>
                    <EditOutlined />
                </button>
            }
            onClick={onClicked} size='small' hoverable={true}
        >
            <p className={`
                ${styles['taskitem-text']}
                ${!task.description ? styles.empty : ''}
            `}>
                <Typography.Text>{task.description}</Typography.Text>
            </p>

            <Typography.Text type='secondary'>Категория: </Typography.Text>
            <Tag>{task.category}</Tag>
        </Card>
    )
}

export default TaskItem
