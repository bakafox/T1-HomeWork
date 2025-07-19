import type { Request, Response, NextFunction } from 'express'
import express from 'express'
import taskRoutes from './routes/tasks'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/tasks', taskRoutes)

app.get('/{*any}', (req: Request, res: Response) => {
    res.status(404).send('Неверный запрос к API.')
})

app.listen(port, () => {
    console.info(`Server running at http://localhost:${port}`)
})
