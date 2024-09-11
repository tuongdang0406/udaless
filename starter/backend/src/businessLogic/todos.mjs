import { uuid } from 'uuidv4';

import { TodosAccess } from '../dataLayer/todosAccess.mjs';
import { createLogger } from '../utils/logger.mjs';
import { commonAttachmentUtil } from '../fileStorage/attachmentUtils.mjs';

const loggerApp = createLogger('Todos app: Handle business logic');
const todosAccess = new TodosAccess();
const attachmentUtil = new commonAttachmentUtil();

export async function getTodos(userId) {
    loggerApp.info('Todos app: Get all todos for user');

    return todosAccess.getTodos(userId);
}

export async function createTodo(newTodo, userId) {
    loggerApp.info('Todos app: Create new todo');

    const todoId = uuid();
    const createdAt = new Date().toISOString();
    const attachmentImageUrl = await attachmentUtil.createAttachmentUrl(todoId);

    const newItem = {
        todoId,
        userId,
        attachmentUrl: attachmentImageUrl,
        createdAt: createdAt,
        done: false,
        ...newTodo
    };

    return await todosAccess.createTodo(newItem);
}

export async function updateTodo(userId, todoId, todoUpdate) {
    loggerApp.info('Todos app: Update todo');

    return await todosAccess.updateTodo(userId, todoId, todoUpdate);
}

export async function deleteTodo(todoId, userId) {
    loggerApp.info('Todos app: Delete todo');

    return await todosAccess.deleteTodo(todoId, userId);
}

export async function createAttachmentPresignedUrl(todoId) {
    loggerApp.info('Todos app: Create attachment url');

    return await attachmentUtil.createUploadUrl(todoId);
}
