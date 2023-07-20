import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';

export const userRoutes = Router();

const SECRET_KEY = 'seu_segredo_aqui';

//listar todos os usuários
userRoutes.get("/", async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
});

//obter usuário pelo ID
userRoutes.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "Usuário não encontrado."});
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o usuário." });
    }
})

//cadastrar usuário
userRoutes.post('/cadastro', async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    const existingUser = await User.findOne({ username });
  
    if (existingUser) {
      return res.status(409).json({ error: ' O nome de usuário já existe.' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new User({
      username,
      password: hashedPassword,
    });
  
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  });

  //fazer login
  userRoutes.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username });
  
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }
  
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });

  //autenticação de usuário
  userRoutes.get('/protected', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Acesso autorizado.' });
  });
  
  function authenticateToken(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }
  
    jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido.' });
      }
  
      next();
    });
  }
  
//atualizar usuário
userRoutes.put("/user/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if(user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "Usuário não encontrado."});
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
});

//excluir usuário
userRoutes.delete("/user/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "Usuário não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir usuário." });
    }
  });