// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { appEnv } from '../../envs/app.env';

// // Chave secreta para assinar o token
// const secretKey = appEnv.key;

// interface AuthenticatedRequest extends Request {
//   userId: number; // Adicione a propriedade userId ao Request
// }

// export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ message: 'Token não fornecido' });
//   }

//   try {
//     // Verifica e decodifica o token
//     const decodedToken = jwt.verify(token, secretKey) as unknown as { userId: number };

//     // Adiciona o userId ao objeto Request para uso posterior
//     req.userId = decodedToken.userId;

//     next(); // Continua para a próxima middleware
//   } catch (error) {
//     res.status(401).json({ message: 'Token inválido' });
//   }
// };
