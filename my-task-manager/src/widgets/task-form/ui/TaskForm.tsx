import type { Task } from '@entities/Task/model/types'
import type { CheckboxGroupProps } from 'antd/es/checkbox'
import type { TaskStatus } from '../model/types'
import { CheckCircleOutlined, CloseOutlined, DeleteOutlined, ExclamationCircleOutlined, FlagOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons'
import { category } from '@entities/Task/model/types'
import { Button, Card, Form, Input, Radio, Typography } from 'antd'

import React from 'react'
import styles from './TaskForm.module.css'

const priorityOptions: CheckboxGroupProps<string>['options'] = [
    { label: <><FlagOutlined /> Высокая</>, value: 'High', className: styles['option-high'] },
    { label: <><FlagOutlined /> Средняя</>, value: 'Medium', className: styles['option-medium'] },
    { label: <><FlagOutlined /> Низкая</>, value: 'Low', className: styles['option-low'] },
]
const statusOptions: CheckboxGroupProps<string>['options'] = [
    { label: <><ExclamationCircleOutlined /> К выполнению</>, value: 'To Do', className: styles['option-todo'] },
    { label: <><SyncOutlined /> В процессе…</>, value: 'In Progress', className: styles['option-progress'] },
    { label: <><CheckCircleOutlined /> Дело сделано!</>, value: 'Done', className: styles['option-done'] },
]
const categoryOptions: CheckboxGroupProps<string>['options'] = (
    // Неохота мне все опции расписывать, да и расширяемость в голове держать полезно,
    // поэтому здесь мы будет получать их и парсить их из файла с типами напрямую:
    category.map(c => ({ label: c, value: c }))
)

interface Props {
    getTask: Task
    setTask: (t: Task) => void
    setStatus: (s: TaskStatus) => void
}

const TaskForm: React.FC<Props> = (props) => {
    const { getTask, setTask, setStatus } = props
    const [form] = Form.useForm()

    const onSubmit = (newTask: Task): void => {
        setTask({ ...newTask, key: getTask.key })
        setStatus('saved')
    }

    return (
        <Form form={form} layout="inline" initialValues={getTask} onFinish={v => onSubmit(v)}>
            <Card
                className={styles.taskform}
                title={(
                    <Form.Item name="title" rules={[{ required: true, message: '' }]}>
                        <Input
                            variant="filled"
                            defaultValue={getTask.title}
                            placeholder="Заголовок задачи"
                        />
                    </Form.Item>
                )}
                actions={[
                    // eslint-disable-next-line react/no-missing-key
                    <Form.Item className={styles['taskform-footer']}>
                        <Button
                            danger
                            shape="round"
                            icon={<DeleteOutlined />}
                            className={!getTask.key ? styles.hidden : ''}
                            onClick={() => setStatus('deleted')}
                        >
                            Удалить
                        </Button>
                        <Button
                            shape="round"
                            icon={<CloseOutlined />}
                            onClick={() => setStatus('cancelled')}
                        >
                            Отменить
                        </Button>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<SaveOutlined />}
                            htmlType="submit"
                        >
                            Сохранить
                        </Button>
                    </Form.Item>,
                ]}
            >
                <div className={styles['taskform-inner']}>
                    <Form.Item name="description">
                        <Input.TextArea
                            defaultValue={getTask.description}
                            placeholder="Описание задачи (необязательно)"
                            autoSize={{ minRows: 4, maxRows: 8 }}
                        />
                    </Form.Item>

                    <Form.Item name="priority" rules={[{ required: true, message: 'Выберите приоритет задачи' }]}>
                        <Typography.Text type="secondary">
                            Важность задачи:
                        </Typography.Text>
                        <Radio.Group
                            block
                            optionType="button"
                            options={priorityOptions}
                            defaultValue={getTask.priority}
                        />
                    </Form.Item>

                    <Form.Item name="status" rules={[{ required: true, message: 'Выберите статус задачи' }]}>
                        <Typography.Text type="secondary">
                            Статус выполнения задачи:
                        </Typography.Text>
                        <Radio.Group
                            block
                            optionType="button"
                            options={statusOptions}
                            defaultValue={getTask.status}
                        />
                    </Form.Item>

                    <Form.Item name="category" rules={[{ required: true, message: 'Выберите категорию задачи' }]}>
                        <Typography.Text type="secondary">
                            Категория задачи:
                        </Typography.Text>
                        <br />
                        <Radio.Group
                            optionType="default"
                            options={categoryOptions}
                            defaultValue={getTask.category}
                        />
                    </Form.Item>
                </div>
            </Card>
        </Form>
    )
}

export default TaskForm
