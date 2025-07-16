import styles from './Taskitem.module.css'
import React, { type ReactNode } from 'react'
import type { Task } from '../types/types'

import { Card, Tag, Typography, Button } from 'antd'
import {
    ExclamationCircleOutlined, SyncOutlined, CheckCircleOutlined,
    EditOutlined, DeleteOutlined
} from '@ant-design/icons'

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
    onEdit: () => void,
    onDelete: () => void
}

const TaskItem: React.FC<Props> = (props) => {
    const { task, onEdit, onDelete } = props
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
                <Typography.Text type='secondary'>#{task.key}</Typography.Text>
            }
            size='small' hoverable={true} onClick={onEdit}
        >
            <p className={`
                ${styles['taskitem-text']}
                ${!task.description ? styles.empty : ''}
            `}>
                <Typography.Text>{task.description}</Typography.Text>
            </p>

            <footer className={styles['taskitem-footer']}>
                <span>
                    <Typography.Text type='secondary'>Категория: </Typography.Text>
                    <Tag>{task.category}</Tag>
                </span>
                <span className={styles['taskitem-footer__actions']}>
                    <Button shape="round" icon={<EditOutlined />}
                        onClick={(e) => { e.stopPropagation(); onEdit() }}
                        title='Изменить' aria-label='Кнопка изменения задачи'
                    >Изменить</Button>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        onClick={(e) => { e.stopPropagation(); onDelete() }}
                        title='Удалить' aria-label='Кнопка удаления задачи'
                    ></Button>
                </span>
            </footer>
        </Card>
    )
}

export default TaskItem
