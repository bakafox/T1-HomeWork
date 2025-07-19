// Мы делаем так, чтобы можно было экспортировать все возможные значения типов
// и использовать их в коде, например если нам надо сделать перебор значений
export const category = ['Bug', 'Feature', 'Documentation', 'Refactor', 'Test']
export type Category = typeof category[number]
export const priority = ['Low', 'Medium', 'High']
export type Priority = typeof priority[number]
export const status = ['To Do', 'In Progress', 'Done']
export type Status = typeof status[number]

export interface Task {
    id: number,
    title: string,
    description?: string,
    dateCreated?: Date,
    category: Category,
    priority: Priority,
    status: Status,
}
