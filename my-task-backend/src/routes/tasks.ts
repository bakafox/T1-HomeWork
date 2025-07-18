import type { Request, Response } from 'express'
import type { Task } from '../models/task'
import { readFileSync } from 'fs'
import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import { category, priority, status } from '../models/task'

const router = Router()

class Tasks {
    private tasks: Task[]
    private taskIds: number[]

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

const initialTasks = readFileSync(__dirname + '/../initialTasks.json')
const tasks = new Tasks(JSON.parse(initialTasks.toString()) ?? [])
// console.log(tasks)

const validateTask = [
    body('title').notEmpty().withMessage('Неверный заголовок задачи!'),
    body('category').notEmpty().isIn(category).withMessage('Неверная категория задачи!'),
    body('status').notEmpty().isIn(status).withMessage('Неверный статус задачи!'),
    body('priority').notEmpty().isIn(priority).withMessage('Неверный приоритет задачи!'),
]
const validateTaskId = [
    param('id').custom(i => tasks.getTaskIds().includes(Number.parseInt(i)))
        .withMessage('Неверный идентификатор задачи!'),
]

// Get /tasks получение всех задач
router.get('/', [], (req: Request, res: Response) => {
    res.json(tasks.getTasks())
})

// Get /tasks/:id получение задачи по ид
router.get('/:id', validateTaskId, (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const task = tasks.getTasks().find(
        t => t.id === Number.parseInt(req.params.id),
    )
    res.status(200).json(task)
})

// Post /tasks создание
router.post('/', validateTask, (req: Request, res: Response) => {
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
    res.status(201).json(newTask.id)
})

// Delete /tasks/:id удаление
router.delete('/:id', validateTaskId, (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const index = tasks.getTaskIds().findIndex(
        i => i === Number.parseInt(req.params.id),
    )

    const newTasks = tasks.getTasks()
    newTasks.splice(index, 1)
    tasks.setTasks(newTasks)
    res.status(200).send(req.params.id)
})

// Patch /tasks/:id обновление
router.patch('/:id', [...validateTask, ...validateTaskId], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const newTask = tasks.getTasks().find(
        t => t.id === Number.parseInt(req.params.id),
    )
    // console.log(newTask)

    newTask.title = req.body.title ?? newTask.title
    newTask.description = req.body.description ?? newTask.description
    newTask.category = req.body.category || newTask.category
    newTask.priority = req.body.priority || newTask.priority
    newTask.status = req.body.status || newTask.status

    const newTasks = tasks.getTasks().map(
        t => t.id === newTask.id ? newTask : t,
    )
    tasks.setTasks(newTasks)
    res.status(200).json(newTask)
})

export default router
