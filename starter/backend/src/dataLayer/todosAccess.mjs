import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

import { createLogger } from '../utils/logger.mjs';

const awsService = new AWSXRay.captureAWS(AWS);
const documentClient = new awsService.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const todosName = process.env.INDEX_NAME;

const loggerApp = createLogger('Log for data layer');

export class TodosAccess {
    async getTodos(userId) {
        loggerApp.info('Data layer: Get todo list');

        const responseData = await documentClient
            .query({
                TableName: todosTable,
                IndexName: todosName,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();

        return responseData.Items;
    }

    async createTodo(newItem) {
        loggerApp.info('Data layer: Create todo item');

        const responseData = await documentClient.put({
            TableName: todosTable,
            Item: newItem
        }).promise();

        loggerApp.info(`Data layer: Create toto item: ${responseData}`);

        return newItem;
    }

    async updateTodo(userId, todoId, updateItem) {
        loggerApp.info('Data layer: Update todo item');

        await documentClient
            .update({
                TableName: todosTable,
                Key: {
                    todoId,
                    userId
                },
                UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeValues: {
                    ':name': updateItem.name,
                    ':dueDate': updateItem.dueDate,
                    ':done': updateItem.done
                },
                ExpressionAttributeNames: {
                    '#name': 'name'
                },
                ReturnValues: 'UPDATED_NEW'
            })
            .promise();

        return updateItem;
    }

    async deleteTodo(todoId, userId) {

        loggerApp.info('Data layer: Delete todo item');

        const responseData = await documentClient
            .delete({
                TableName: todosTable,
                Key: {
                    todoId,
                    userId
                }
            })
            .promise();

        loggerApp.info('Data layer: Todo item deleted', responseData);

        return responseData;
    }

    async updateTodoAttachmentUrl(todoId, userId, attachmentUrl) {
        loggerApp.info('Data layer: Update todo attachment url');

        await documentClient
            .update({
                TableName: todosTable,
                Key: {
                    todoId,
                    userId
                },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                    ':attachmentUrl': attachmentUrl
                }
            })
            .promise();
    }
}
