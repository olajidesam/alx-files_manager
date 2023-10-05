import mongoDBCore from 'mongodb/lib/core';
import Queue from 'bull/lib/queue';
import sha1 from 'sha1';

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const userQueue = new Queue('userQueue');

export default class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    console.log(email, password);
    if (!email) return response.status(400).send({ error: 'Missing email' });
    if (!password) return response.status(400).send({ error: 'Missing password' });
    const user = await (await dbClient.usersCollection()).findOne({ email });
    if (user) return response.status(400).send({ error: 'Already exist' });
    const shaOnePassword = sha1(password);
    const result = await (await dbClient.usersCollection())
