import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { createLogger } from '../../utils/logger.mjs';
import { createTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

const logger = createLogger('Log for todos app');

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
          credentials: true
        })
    )
    .handler(async (event) => {
      logger.info('Create new todo');

      const newTodo = JSON.parse(event.body)
      const userId = getUserId(event);
      const newIitem = await createTodo(newTodo, userId);

      return {
        statusCode: 201,
        body: JSON.stringify({ item: newIitem })
      };
    });