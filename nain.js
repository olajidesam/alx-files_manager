import dbClient from './utils/db';

const waitConnection = () => new Promise((resolve, reject) => {
  let i = 0;
  const repeatFct = async () => {
    await setTimeout(() => {
      i += 1;
      if (i >= 10) {
        reject(new Error('Rejected wait'));
      } else if (!dbClient.isAlive()) {
        repeatFct();
      } else {
        resolve();
      }
    }, 1000);
  };
