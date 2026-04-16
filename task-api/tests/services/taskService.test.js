const taskService = require('../../src/services/taskService');

describe('taskService', () => {
    beforeEach(() => {
        taskService._reset();
    });

    it('should create a task with default values', () => {
        const task = taskService.create({ title: 'Test Task' });
        expect(task.id).toBeDefined();
        expect(task.title).toBe('Test Task');
        expect(task.status).toBe('todo');
        expect(task.priority).toBe('medium');
        expect(task.description).toBe('');
        expect(task.dueDate).toBeNull();
        expect(task.completedAt).toBeNull();
        expect(task.createdAt).toBeDefined();
    });

    it('should create a task with provided values', () => {
        const task = taskService.create({
            title: 'Test',
            description: 'Desc',
            status: 'in_progress',
            priority: 'high',
            dueDate: '2025-01-01T00:00:00Z'
        });
        expect(task.description).toBe('Desc');
        expect(task.status).toBe('in_progress');
        expect(task.priority).toBe('high');
        expect(task.dueDate).toBe('2025-01-01T00:00:00Z');
    });

    it('getAll should return all tasks', () => {
        taskService.create({ title: 'T1' });
        taskService.create({ title: 'T2' });
        const tasks = taskService.getAll();
        expect(tasks.length).toBe(2);
    });

    it('findById should return the correct task', () => {
        const t = taskService.create({ title: 'T1' });
        const found = taskService.findById(t.id);
        expect(found.title).toBe('T1');
    });

    it('findById should return undefined if not found', () => {
        expect(taskService.findById('not-found')).toBeUndefined();
    });

    it('getByStatus should filter tasks by status', () => {
        taskService.create({ title: 'T1', status: 'todo' });
        taskService.create({ title: 'T2', status: 'done' });
        const tasks = taskService.getByStatus('todo');
        expect(tasks.length).toBe(1);
        expect(tasks[0].title).toBe('T1');
    });

    it('getPaginated should return a slice of tasks', () => {
        taskService.create({ title: 'T1' });
        taskService.create({ title: 'T2' });
        taskService.create({ title: 'T3' });
        const tasks = taskService.getPaginated(1, 2);
        expect(tasks.length).toBe(2);
        expect(tasks[0].title).toBe('T1');
        expect(tasks[1].title).toBe('T2');
    });

    it('getStats should return counts and overdue', () => {
        taskService.create({ title: 'T1', status: 'todo' });
        taskService.create({ title: 'T2', status: 'in_progress' });
        // Overdue task
        taskService.create({ title: 'T3', status: 'todo', dueDate: '2020-01-01T00:00:00Z' });

        // Invalid status to hit branch testing
        taskService.create({ title: 'T4', status: 'unknown' });

        const stats = taskService.getStats();
        expect(stats.todo).toBe(2);
        expect(stats.in_progress).toBe(1);
        expect(stats.done).toBe(0);
        expect(stats.overdue).toBe(1);
    });

    it('update should modify existing task fields', () => {
        const t = taskService.create({ title: 'T1' });
        const updated = taskService.update(t.id, { title: 'T2' });
        expect(updated.title).toBe('T2');
    });

    it('update should return null if task not found', () => {
        expect(taskService.update('123', {})).toBeNull();
    });

    it('remove should delete task and return true', () => {
        const t = taskService.create({ title: 'T1' });
        const removed = taskService.remove(t.id);
        expect(removed).toBe(true);
        expect(taskService.getAll().length).toBe(0);
    });

    it('remove should return false if task not found', () => {
        expect(taskService.remove('123')).toBe(false);
    });

    it('completeTask should mark task as done and set completedAt while retaining priority', () => {
        const t = taskService.create({ title: 'T1', priority: 'high' });
        const completed = taskService.completeTask(t.id);
        expect(completed.status).toBe('done');
        expect(completed.completedAt).not.toBeNull();
        expect(completed.priority).toBe('high');
    });

    it('completeTask should return null if task not found', () => {
        expect(taskService.completeTask('123')).toBeNull();
    });

    it('assignTask should add assignee to task', () => {
        const t = taskService.create({ title: 'T1' });
        const assigned = taskService.assignTask(t.id, 'John Doe');
        expect(assigned.assignee).toBe('John Doe');
    });

    it('assignTask should throw if task already assigned', () => {
        const t = taskService.create({ title: 'T1' });
        taskService.assignTask(t.id, 'John Doe');
        expect(() => {
            taskService.assignTask(t.id, 'Jane Doe');
        }).toThrow('Task is already assigned');
    });

    it('assignTask should return null if task not found', () => {
        expect(taskService.assignTask('123', 'John')).toBeNull();
    });
});
