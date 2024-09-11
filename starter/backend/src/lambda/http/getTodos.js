import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { getUserId } from '../utils.mjs';
import { getTodos } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('Log for todos app');

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
          credentials: true
        })
    )
    .handler(async (event) => {
      logger.info('Get all todos');
      const userId = getUserId(event);
      const todoItems = await getTodos(userId);

      return {
        statusCode: 200,
        body: JSON.stringify({
          items: todoItems
        })
      };
    });