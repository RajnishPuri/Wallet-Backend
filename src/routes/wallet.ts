import { addMoney } from "../controllers/addBalance";
import { sendMoney } from "../controllers/sendMoney";
import { checkBalance } from '../controllers/checkBalance';
import { getAccountNumber } from "../controllers/getAccountNumber";
import { sendrequestMoney } from "../controllers/requestMoney";
import express from "express";

export const walletRouter = express.Router();

walletRouter.post('/addMoney', addMoney as any);
walletRouter.post('/sendMoney', sendMoney as any);
walletRouter.get('/getBalance', checkBalance as any);
walletRouter.get('/getAccountNumber', getAccountNumber as any);
walletRouter.post('/sendRequestMoney', sendrequestMoney as any);

