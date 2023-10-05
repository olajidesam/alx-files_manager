import fs from 'fs';
import mime from 'mime-types';
import mongoDBCore from 'mongodb/lib/core';
import Queue from 'bull/lib/queue';
import { v4 as uuid } from 'uuid';

import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const fileQueue = new Queue('fileQueue');

export default class FilesController {
  static async postUpload(request, response) {
    const token = request.header('X-Token');
    if (!token) return response.status(401).send({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return response.status(401).send({ error: 'Unauthorized' });

    const { name, type } = request.body;
