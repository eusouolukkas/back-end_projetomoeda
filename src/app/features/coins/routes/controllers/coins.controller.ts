import { Request, Response } from "express";

export class CoinsController {
    public async list(req: Request, res: Response) {
        try {

        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: "Instabilidade no servidor!",
                error: error.toString(),
            });
        }
    }
}