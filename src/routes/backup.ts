// pages/api/backup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { backupData } from '../controller/backupController'; // Import your backup controller function
import express from 'express';

const backupRouter = express.Router();

backupRouter.route('/backupdata').get(backupData);
export default backupRouter;

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { method } = req;

//   switch (method) {
//     case 'GET':
//       // Handle the GET request for backup
//       await backupData(req, res);
//       break;
//     default:
//       res.status(405).end(); // Method Not Allowed
//       break;
//   }
// }
