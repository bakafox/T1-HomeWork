import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import taskRoutes from './routes/tasks'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// https://community.render.com/t/no-access-control-allow-origin-header/12947/3
app.use((req, res, next) => {
    res.setHeader(
        'Access-Control-Allow-Origin',
        req.headers.origin || '*',
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE',
    )
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Content-Type-Options, Accept, Origin, '
        + 'X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers',
    )
    res.setHeader(
        'Access-Control-Allow-Credentials',
        'true',
    )
    next()
})

app.use('/tasks', taskRoutes)

app.get('/{*any}', (req: Request, res: Response) => {
    res.status(404).send('Неверный запрос к API.')
})

app.listen(port, () => {
    console.info(`Server running at http://localhost:${port}`)
})
