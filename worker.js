/* eslint-disable import/no-named-as-default */
import { writeFile } from 'fs';
import { promisify } from 'util';
import Queue from 'bull/lib/queue';
import imgThumbnail from 'image-thumbnail';
import mongoDBCore from 'mongodb/lib/core';
import dbClient from './utils/db';
import Mailer from './utils/mailer';

const writeFileAsync = promisify(writeFile);
const fileQueue = new Queue('Thumbnail generation');
const userQueue = new Queue('Email sending');

const genThumbnail = async (filePath, size) => {
  const buff = await imgThumbnail(filePath, { width: size });
  console.log(`Generating thumbFile: ${filePath}, size: ${size}`);
