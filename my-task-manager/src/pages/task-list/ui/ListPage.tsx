import type { AppDispatch } from '@app/store'
import { getTasks } from '@entities/Task/model/tasksSlice'
import styles from './ListPage.module.css'
import React from 'react'
import { useState, useEffect } from 'react'
import { category, status, priority } from '@entities/Task/model/types'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import type { Task } from '@entities/Task/model/types'

import { useSelector } from 'react-redux'
import type { RootState } from '@app/store'

import { Typography, Divider, Segmented, Button, Input } from 'antd'
import { AppstoreOutlined, BarsOutlined, ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import TaskList from '@features/task-list/ui/TaskList'

type FilterBy = 'category' | 'status' | 'priority'

const ListPage: React.FC = () => {
    const tasks = useSelector(
        (state: RootState) => state.tasks.value
    )

    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()

    // Пусть у нас таски сортируются либо по категориям,
    // либо по статусу выполнения, либо по приоритету:
    const [getFilterBy, setFilterBy] = useState<FilterBy>(() => {
        const lsFilterByJson: string | null = localStorage.getItem("myFilterBy")
        return lsFilterByJson ? JSON.parse(lsFilterByJson) : 'status'
    })

    const [getQuery, setQuery] = useState<string>('')

    // const sortedTasks = (
    //     (getFilterBy === 'status') ? [...tasks].sort((t1, t2) => {
    //         if (t1.status === 'Done' || t2.status === 'To Do') return 1
    //         if (t2.status === 'Done' || t1.status === 'To Do') return -1
    //         return 0
    //     })
    //     : (getFilterBy === 'priority') ? [...tasks].sort((t1, t2) => {
    //         if (t1.priority === t2.priority) return 0
    //         if (t1.priority === 'High' || t2.priority === 'Low') return -1
    //         if (t2.priority === 'High' || t1.priority === 'Low') return 1
    //         return 0
    //     })
    //     : [...tasks].sort((t1, t2) => {
    //         return category.indexOf(t1.category) > category.indexOf(t2.category)
    //     })
    // )

    const tasksByCat = (
        (getFilterBy === 'status') ? status.map((s) => {
            return {
                name: s,
                tasks: tasks.filter((t: Task) => t.status === s)
            }
        })
        : (getFilterBy === 'priority') ? [...priority].reverse().map((p) => {
            return {
                name: p,
                tasks: tasks.filter((t: Task) => t.priority === p)
            }
        })
        : category.map((c) => {
            return {
                name: c,
                tasks: tasks.filter((t: Task) => t.category === c)
            }
        })
    )
    // console.log(tasks, tasksByCat)

    useEffect(() => {
        localStorage.setItem('myFilterBy', JSON.stringify(getFilterBy))
    }, [getFilterBy])

    return (
        <>
            <header className={styles.header}>
                <Typography.Title level={2}><i>Менеджер задач!</i></Typography.Title>

                <div className={styles['sortby-controls']}>
                    <Typography.Text>Фильтровать по: </Typography.Text>

                    <Segmented value={getFilterBy} onChange={(v: FilterBy) => setFilterBy(v)}
                        options={[
                            { label: 'Статусу', value: 'status', icon: <BarsOutlined /> },
                            { label: 'Важности', value: 'priority', icon: <ExclamationCircleOutlined /> },
                            { label: 'Категории', value: 'category', icon: <AppstoreOutlined /> },
                        ]}
                    />
                </div>
            </header>

            <Divider orientation="center">
                <Typography.Text strong>Всего задач: {tasks.length}</Typography.Text>
            </Divider>

            <main className={styles.tasklists}>
                <Input.Search className={styles.search} variant='filled' placeholder='Поиск по тексту задач'
                    value={getQuery} onChange={(e) => setQuery(e.target.value)}
                    onSearch={() => dispatch(getTasks({ query: getQuery }))}
                    onBlur={() => dispatch(getTasks({ query: getQuery }))}
                />

                <Button type="dashed" className={styles['add-btn']} onClick={() => navigate('/task/new')}>
                    <PlusCircleOutlined /> Новая задача
                </Button>

                {/* В идеале эту логику вынести в отдельный компонент, но */}
                {/* по ТЗ нам можно использовать только 3 данных компонента */}
                {/* (аналогично с реализацией пикера типа фильтрации задач) */}
                {tasksByCat.map((c) => {
                    if (c.tasks.length > 0) {
                        return <TaskList listName={c.name} tasks={c.tasks} key={c.name} />
                    }
                })}
            </main>
        </>
    )
}

export default ListPage
