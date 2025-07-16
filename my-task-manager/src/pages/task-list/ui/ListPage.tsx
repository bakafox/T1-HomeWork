import styles from './ListPage.module.css'
import React from 'react'
import { useState, useEffect } from 'react'
import { category, status, priority } from '@entities/Task/model/types'
import { useNavigate } from "react-router";
import type { Task } from '@entities/Task/model/types'

import { useDispatch, useSelector } from 'react-redux'
import { createTask } from '@entities/Task/model/tasksSlice'
import type { RootState } from '@app/store'

import { Typography, Divider, Segmented, Button } from 'antd'
import { AppstoreOutlined, BarsOutlined, ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import TaskList from '@features/task-list/ui/TaskList'

type FilterBy = 'category' | 'status' | 'priority'

const ListPage: React.FC = () => {
    const tasks = useSelector(
        (state: RootState) => state.tasks.value
    )

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Пусть у нас таски сортируются либо по категориям,
    // либо по статусу выполнения, либо по приоритету:
    const [getFilterBy, setFilterBy] = useState<FilterBy>(() => {
        const lsFilterByJson: string | null = localStorage.getItem("myFilterBy")
        return lsFilterByJson ? JSON.parse(lsFilterByJson) : 'status'
    })

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

    // Не самое элегантное решение, но... работает жи...
    useEffect(() => {
        if (tasks.length <= 0) {
            const lsTasksJson: string | null = localStorage.getItem("myTasks")
            const lsTasks: Task[] = lsTasksJson ? JSON.parse(lsTasksJson)
            : [
                {
                    key: 1, title: 'Реализовать редактирование заданий',
                    category: 'Feature', status: 'Done', priority: 'High'
                },
                {
                    key: 2, title: 'Удалить неприличные выражения в комментариях к коду',
                    description: 'Маты это плохо!!! (хотя конкретно в этом коде их и не было)',
                    category: 'Refactor', status: 'In Progress', priority: 'Low'
                },
                {
                    key: 0, title: 'Реализовать тёмную тему (nuff said)',
                    category: 'Feature', status: 'To Do', priority: 'Medium'
                },
                {
                    key: 3, title: 'Возможность добавлять новые категории к задачам',
                    category: 'Feature', status: 'Done', priority: 'Medium'
                },
                {
                    key: 4, title: 'Возможность удаления и добавления заданий',
                    description: 'Оказалось, что не все клиенты довольны тем, что для добавления '
                    + 'нового задания нужно лезть в исходный код фронта. Надо что-то предпринять!',
                    category: 'Feature', status: 'To Do', priority: 'High'
                },
                {
                    key: 5, title: 'Протестировать на умной микроволновке в состоянии нагрузки',
                    category: 'Test', status: 'In Progress', priority: 'Medium'
                },
                {
                    key: 6, title: 'Написать README.MD к этой задаче',
                    category: 'Documentation', status: 'Done', priority: 'Low'
                },
                {
                    key: 7, title: 'Добавить возможность удаления и создания заданий',
                    category: 'Feature', status: 'Done', priority: 'High'
                },
                {
                    key: 8, title: 'Перестроить архитектуру в соответствие с FSD',
                    category: 'Feature', status: 'In Progress', priority: 'High'
                },
            ]
            
            lsTasks.forEach((t: Task) => {
                dispatch(createTask({ newTask: t }))
            })
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('myTasks', JSON.stringify(tasks))
    }, [tasks])

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
