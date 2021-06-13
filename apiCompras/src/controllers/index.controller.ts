import { Request, Response } from 'express';

export function indexStatus(req:Request, res:Response): Response {
    return res.json('Api Bee Delivery Funcionando - COMPRAS');
}
