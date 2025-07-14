import styles from './ListView.module.css'
import React from 'react'
import { useState } from 'react'
import type { Task } from '../types/types'
import { category, status, priority } from '../types/types'

import { Typography, Divider, Segmented } from 'antd'
import { AppstoreOutlined, BarsOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import TaskList from '../components/TaskList'

type Props = {
    getTasks: Task[]
    // setTasks: (t: Task[]) => void
}

const ListView: React.FC<Props> = (props) => {
    const { getTasks } = props

    // Пусть у нас таски сортируются либо по категориям,
    // либо по статусу выполнения, либо по приоритету:
    const [getSortTasksBy, setSortTasksBy] = useState<
        'category' | 'status' | 'priority'
    >('status')

    // const sortedTasks = (
    //     (getSortTasksBy === 'status') ? [...getTasks].sort((t1, t2) => {
    //         if (t1.status === 'Done' || t2.status === 'To Do') return 1
    //         if (t2.status === 'Done' || t1.status === 'To Do') return -1
    //         return 0
    //     })
    //     : (getSortTasksBy === 'priority') ? [...getTasks].sort((t1, t2) => {
    //         if (t1.priority === t2.priority) return 0
    //         if (t1.priority === 'High' || t2.priority === 'Low') return -1
    //         if (t2.priority === 'High' || t1.priority === 'Low') return 1
    //         return 0
    //     })
    //     : [...getTasks].sort((t1, t2) => {
    //         return category.indexOf(t1.category) > category.indexOf(t2.category)
    //     })
    // )

    const tasksByCat = (
        (getSortTasksBy === 'status') ? status.map((s) => {
            return {
                name: s,
                tasks: getTasks.filter((t) => t.status === s)
            }
        })
        : (getSortTasksBy === 'priority') ? [...priority].reverse().map((p) => {
            return {
                name: p,
                tasks: getTasks.filter((t) => t.priority === p)
            }
        })
        : category.map((c) => {
            return {
                name: c,
                tasks: getTasks.filter((t) => t.category === c)
            }
        })
    )
    console.log(tasksByCat)

    return (
        <>
            <header>
                <Typography.Title level={2}><i>Менеджер задач!</i></Typography.Title>

                <div className={styles['sortby-controls']}>
                    <Typography.Text>Фильтровать по: </Typography.Text>
                    <Segmented value={getSortTasksBy} onChange={(v) => setSortTasksBy(v)}
                        options={[
                            { label: 'Статусу', value: 'status', icon: <BarsOutlined /> },
                            { label: 'Важности', value: 'priority', icon: <ExclamationCircleOutlined /> },
                            { label: 'Категории', value: 'category', icon: <AppstoreOutlined /> },
                        ]}
                        />
                </div>
            </header>

            <main>
                {/* <Button type="primary">Primary Button</Button> */}

                <Divider orientation="center">
                    <Typography.Text strong>Всего задач: {getTasks.length}</Typography.Text>
                </Divider>

                {/* В идеале эту логику вынести в отдельный компонент, но */}
                {/* по ТЗ нам можно использовать только 3 данных компонента */}
                {/* (аналогично с реализацией пикера типа фильтрации задач) */}
                {tasksByCat.map((c, i) => {
                    if (c.tasks.length > 0) {
                        return <TaskList listName={c.name} getTasks={c.tasks} key={c.name} />
                    }
                    return <></>
                })}
            </main>
        </>
    )
}

export default ListView
