import type { Request, Response } from 'express'
import type { Task } from '../models/task'
import { readFileSync } from 'node:fs'
import { Router } from 'express'
import { category, priority, status } from '../models/task'
// eslint-disable-next-line ts/no-require-imports, perfectionist/sort-imports
const { body, param, validationResult } = require('express-validator')

const router = Router()

class Tasks {
    private tasks: Task[] = []
    private taskIds: number[] = []

    constructor(tasks: Task[]) {
        this.setTasks(tasks)
    }

    public getTasks(): Task[] {
        return [...this.tasks]
    }

    public getTaskIds(): number[] {
        return [...this.taskIds]
    }

    public setTasks(tt: Task[]): void {
        this.tasks = [...tt]
        this.taskIds = this.tasks.map((t: Task) => t.id)
    }
}

const initialTasks = readFileSync(`${__dirname}/../../initialTasks.json`)
const tasks = new Tasks(JSON.parse(initialTasks.toString()) ?? [])

const validateTask = [
    body('title').notEmpty().withMessage('Неверный заголовок задачи!'),
    body('category').notEmpty().isIn(category).withMessage('Неверная категория задачи!'),
    body('status').notEmpty().isIn(status).withMessage('Неверный статус задачи!'),
    body('priority').notEmpty().isIn(priority).withMessage('Неверный приоритет задачи!'),
]
const validateTaskId = [
    param('id').custom(
        (i: string) => tasks.getTaskIds().includes(Number.parseInt(i)),
    ).withMessage('Неверный идентификатор задачи!'),
]

// Get /tasks получение всех задач
router.get('/', [], (req: Request, res: Response): Response<Task[]> => {
    if (!req.query.q) {
        return res.status(200).json(tasks.getTasks())
    }

    const foundTasks = tasks.getTasks().filter(
        (t: Task) => t.title.includes(req.query.q?.toString() || '')
            || t.description?.includes(req.query.q?.toString() || ''),
    )
    return res.status(200).json(foundTasks)
})

// Get /tasks/:id получение задачи по ид
router.get('/:id', validateTaskId, (req: Request, res: Response): Response<Task> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const task = tasks.getTasks().find(
        t => t.id === Number.parseInt(req.params.id),
    )

    return res.status(200).json(task)
})

// Delete /tasks/:id удаление
router.delete('/:id', validateTaskId, (req: Request, res: Response): Response<Task> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const index = tasks.getTaskIds().findIndex(
        i => i === Number.parseInt(req.params.id),
    )

    const newTasks = tasks.getTasks()
    const deletedTask = newTasks.splice(index, 1)

    tasks.setTasks(newTasks)
    return res.status(200).send(deletedTask)
})

// Patch /tasks/:id обновление
router.patch('/:id', [...validateTask, ...validateTaskId], (req: Request, res: Response): Response<Task> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const newTask = tasks.getTasks().find(
        t => t.id === Number.parseInt(req.params.id),
    ) as Task
    // console.log(newTask)

    newTask.title = req.body.title ?? newTask.title
    newTask.description = req.body.description ?? newTask.description
    newTask.category = req.body.category || newTask.category
    newTask.priority = req.body.priority || newTask.priority
    newTask.status = req.body.status || newTask.status

    const newTasks: Task[] = tasks.getTasks().map(
        t => t.id === newTask!.id ? newTask : t,
    )

    tasks.setTasks(newTasks)
    return res.status(200).json(newTask)
})

// Post /tasks создание
router.post('/', validateTask, (req: Request, res: Response): Response<Task> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const gt = tasks.getTasks()

    const newTask: Task = {
        id: (gt.length > 0)
            ? gt[gt.length - 1].id + 1
            : 1, // С нуля обычные люди, в отличие от нас, не считают :)
        title: req.body.title,
        description: req.body.description ?? '',
        dateCreated: new Date(),
        category: req.body.category,
        priority: req.body.priority,
        status: req.body.status,
    }

    tasks.setTasks([...tasks.getTasks(), newTask])
    return res.status(201).json(newTask)
})

export default router
