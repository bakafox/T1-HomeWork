import styles from './TaskForm.module.css'
import React from 'react'
import { category } from '../types/types'
import type { CheckboxGroupProps } from 'antd/es/checkbox'
import type { Task } from '../types/types'

import { Card, Form, Input, Typography, Button, Radio } from 'antd'
import {
    ExclamationCircleOutlined, SyncOutlined, CheckCircleOutlined,
    FlagOutlined, SaveOutlined, CloseOutlined
} from '@ant-design/icons'

const priorityOptions: CheckboxGroupProps<string>['options'] = [
    { label: <><FlagOutlined /> Высокая</>, value: "High", className: styles['option-high'] },
    { label: <><FlagOutlined /> Средняя</>, value: "Medium", className: styles['option-medium'] },
    { label: <><FlagOutlined /> Низкая</>, value: "Low", className: styles['option-low'] },
]
const statusOptions: CheckboxGroupProps<string>['options'] = [
    { label: <><ExclamationCircleOutlined /> К выполнению</>, value: "To Do", className: styles['option-todo'] },
    { label: <><SyncOutlined /> В процессе…</>, value: "In Progress", className: styles['option-progress'] },
    { label: <><CheckCircleOutlined /> Дело сделано!</>, value: "Done", className: styles['option-done'] },
]
const categoryOptions: CheckboxGroupProps<string>['options'] = (
    // Неохота мне все опции расписывать, да и расширяемость в голове держать полезно,
    // поэтому здесь мы будет получать их и парсить их из файла с типами напрямую:
    category.map((c) => ( { label: c, value: c } ))
)

type Props = {
    getTask: Task,
    setTask: (t: Task) => void
    setFinished: (t: boolean) => void
}

const TaskForm: React.FC<Props> = (props) => {
    const { getTask, setTask, setFinished } = props
    const [form] = Form.useForm()

    const onCancel = (): void => {
        setFinished(true)
    }
    const onSubmit = (newTask: Task): void => {
        setTask({ ...newTask, key: getTask.key })
        setFinished(true)
    }

    return (
        <Form form={form} layout="inline" initialValues={getTask} onFinish={(v) => onSubmit(v)}>
            <Card
                className={styles.taskform}
                title={
                    <Form.Item name="title" rules={[{ required: true, message: '' }]}>
                        <Input variant='filled' defaultValue={getTask.title}
                            placeholder='Заголовок задачи'
                        />
                    </Form.Item>
                }
                actions={[
                    <Form.Item className={styles['taskform-footer']}>
                        <Button type="default" shape="round" icon={<CloseOutlined />}
                            onClick={onCancel}>Отменить
                        </Button>
                        <Button type="primary" shape="round" icon={<SaveOutlined />}
                            htmlType='submit'>Сохранить
                        </Button>
                    </Form.Item>
                ]}
            >
                <div className={styles['taskform-inner']}>
                    <Form.Item name="description">
                        <Input.TextArea defaultValue={getTask.description}
                            placeholder='Описание задачи (необязательно)' autoSize={{ minRows: 4, maxRows: 8 }}
                        />
                    </Form.Item>

                    <Form.Item name="priority" rules={[{ required: true, message: 'Выберите приоритет задачи' }]}><span>
                        <Typography.Text type='secondary'>Важность задачи:</Typography.Text>
                        <Radio.Group block optionType="button"
                            options={priorityOptions} defaultValue={getTask.priority}
                        />
                    </span></Form.Item>

                    <Form.Item name="status" rules={[{ required: true, message: 'Выберите статус задачи' }]}><span>
                        <Typography.Text type='secondary'>Статус выполнения задачи:</Typography.Text>
                        <Radio.Group block optionType="button"
                            options={statusOptions} defaultValue={getTask.status}
                        />
                    </span></Form.Item>

                    <Form.Item name="category" rules={[{ required: true, message: 'Выберите категорию задачи' }]}><span>
                        <Typography.Text type='secondary'>Категория задачи:</Typography.Text><br></br>
                        <Radio.Group optionType="default"
                            options={categoryOptions} defaultValue={getTask.category}
                        />
                    </span></Form.Item>
                </div>
            </Card>
        </Form>
    )
}

export default TaskForm
