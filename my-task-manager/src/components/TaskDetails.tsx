import styles from './TaskDetails.module.css'
import React from 'react'
import { useState } from 'react'
import type { Task } from '../types/types'
import { category } from '../types/types'
import type { CheckboxGroupProps } from 'antd/es/checkbox'

import { Card, Input, Typography, Button, Radio } from 'antd'
import {
    ExclamationCircleOutlined, SyncOutlined, CheckCircleOutlined,
    FlagOutlined, SaveOutlined, CloseOutlined
} from '@ant-design/icons'

const priorityOptions: CheckboxGroupProps<string>['options'] = [
    { label: <><FlagOutlined /> Высокий</>, value: "High", className: styles['option-high'] },
    { label: <><FlagOutlined /> Средний</>, value: "Medium", className: styles['option-medium'] },
    { label: <><FlagOutlined /> Низкий</>, value: "Low", className: styles['option-low'] },
]
const statusOptions: CheckboxGroupProps<string>['options'] = [
    { label: <><ExclamationCircleOutlined /> К выполнению</>, value: "To Do", className: styles['option-todo'] },
    { label: <><SyncOutlined /> В процессе…</>, value: "In Progress", className: styles['option-progress'] },
    { label: <><CheckCircleOutlined /> Дело сделано!</>, value: "Done", className: styles['option-done'] },
]
const categoryOptions: CheckboxGroupProps<string>['options'] = (
    // Неохота мне все опции расписывать, да и расширяемость в голове держать полезно,
    // поэтому здесь мы будет получать их и парсить их из файла с типами напрямую:
    category.map((c, i) => ( { label: c, value: c } ))
)

type Props = {
    getTask: Task,
    setTask: (t: Task) => void
    setFinished: (t: boolean) => void
}

const TaskDetails: React.FC<Props> = (props) => {
    const { getTask, setTask, setFinished } = props

    const [getNewTask, setNewTask] = useState<Task>({ ...getTask })

    const onCancel = (): void => {
        setFinished(true)
    }

    const onSubmit = (): void => {
        setTask({ ...getNewTask })
        setFinished(true)
    }


    return (
        <form>
            <Card
                className={styles.taskdetails}
                title={
                    <Input variant='filled' value={getNewTask.title}
                        onChange={(e) => setNewTask({ ...getNewTask, title: e.target.value })}
                        placeholder='Заголовок задачи' required
                    />
                }
                actions={[
                    <footer className={styles['taskdetails-footer']}>
                        <Button type="default" onClick={onCancel}><CloseOutlined /> Отменить</Button>
                        <Button type="primary" onClick={onSubmit}><SaveOutlined /> Сохранить</Button>
                    </footer>
                ]}
            >
                <div className={styles['taskdetails-inner']}>
                    <Input.TextArea value={getNewTask.description}
                        onChange={(e) => setNewTask({ ...getNewTask, description: e.target.value })}
                        placeholder='Описание задачи (необязательно)'
                        autoSize={{ minRows: 3, maxRows: 9 }}
                    />

                    <div className={styles['taskdetails-inner__seg']}>
                        <Typography.Text type='secondary'>Приоритет задачи:</Typography.Text>
                        <Radio.Group block optionType="button" buttonStyle="solid"
                            options={priorityOptions} value={getNewTask.priority}
                            onChange={(e) => setNewTask({ ...getNewTask, priority: e.target.value })}
                        />
                    </div>

                    <div className={styles['taskdetails-inner__seg']}>
                        <Typography.Text type='secondary'>Статус выполнения задачи:</Typography.Text>
                        <Radio.Group block optionType="button"
                            options={statusOptions} value={getNewTask.status}
                            onChange={(e) => setNewTask({ ...getNewTask, status: e.target.value })}
                        />
                    </div>

                    <div className={styles['taskdetails-inner__seg']}>
                        <Typography.Text type='secondary'>Категория задачи:</Typography.Text>
                        <Radio.Group optionType="default"
                            options={categoryOptions} value={getNewTask.category}
                            onChange={(e) => setNewTask({ ...getNewTask, category: e.target.value })}
                        />
                    </div>
                </div>
            </Card>
        </form>
    )
}

export default TaskDetails
