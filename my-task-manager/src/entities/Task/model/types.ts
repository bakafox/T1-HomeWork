// Мы делаем так, чтобы можно было экспортировать все возможные значения типов
// и использовать их в коде, например если нам надо сделать перебор значений
export const category = ["Bug", "Feature", "Documentation", "Refactor", "Test"]
export const status = ["To Do", "In Progress", "Done"]
export const priority = ["Low", "Medium", "High"]

export type Category = typeof category[number]
export type Status = typeof status[number]
export type Priority = typeof priority[number]

export interface Task {
    key: number,
    title: string,
    description?: string,
    category: Category,
    status: Status,
    priority: Priority
}
