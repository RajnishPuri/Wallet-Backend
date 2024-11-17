import { addMoney } from "../controllers/addBalance";
import { sendMoney } from "../controllers/sendMoney";
import { checkBalance } from '../controllers/checkBalance';
import { getAccountNumber } from "../controllers/getAccountNumber";
import { sendrequestMoney, completeRequestMoney } from "../controllers/requestMoney";
import { getAllRequestMoney } from "../controllers/getAllRequestMoney";
import { getAllTransactions } from "../controllers/showAllTransactions";
import { getUserDetails } from "../controllers/getUserDetails";

import express from "express";

export const walletRouter = express.Router();

walletRouter.post('/addMoney', addMoney as any);
walletRouter.post('/sendMoney', sendMoney as any);
walletRouter.get('/getBalance', checkBalance as any);
walletRouter.get('/getAccountNumber', getAccountNumber as any);
walletRouter.post('/sendRequestMoney', sendrequestMoney as any);
walletRouter.post('/completeRequestMoney', completeRequestMoney as any);
walletRouter.get('/allRequestMoney', getAllRequestMoney as any);
walletRouter.get('/allTransactins', getAllTransactions as any);
walletRouter.get('/getUserDetails', getUserDetails as any);

