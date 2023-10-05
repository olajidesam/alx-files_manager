import sha1 from 'sha1';
import { v4 as uuid } from 'uuid';

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AuthController {
  static async getConnect(request, response) {
    const auth = request.header('Authorization') || '';
    const buff = Buffer.from(auth.replace('Basic ', ''), 'base64');
    const credentials = {
      email: buff.toString('utf-8').split(':')[0],
      password: buff.toString('utf-8').split(':')[1],
    };
    if (!credentials.email || !credentials.password) return response.status(401).send({ error: 'Unauthorized' });
    const user = await (await dbClient.usersCollection()).findOne({ email: credentials.email });
    if (!user) return response.status(401).send({ error: 'Unauthorized' });
    if (sha1(credentials.password) !== user.password) return response.status(401).send({ error: 'Unauthorized' });
    const token = uuid();
