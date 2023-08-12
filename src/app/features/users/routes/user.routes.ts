import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import Coin from '../../../models/Coin';
import { appEnv } from '../../../envs/app.env';

export const userRoutes = Router();

 //fazer login
  userRoutes.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username });
  
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(404).json({ error: 'Usuário ou senha incorretos.' });
    }

    if (!username) {
      return res.status(422).json({ msg: "O username é obrigatório!" });
    }

    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    try {
      const secret = "";
  
      const token = jwt.sign({ userId: user._id }, appEnv.key || secret, { expiresIn: '1h' });
      res.status(200).json({msg: "Autenticação realizada com sucesso!", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({msg: "Instabilidade no servidor, tente novamente mais tarde!"});
      
    }
  });

   //autenticação de usuário
  userRoutes.get('/protected', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Acesso autorizado.' });
  });
  
  function authenticateToken(req: Request, res: Response, next: Function) {
    const authHeader = req.headers.authorization;

    try {
          const secret = "";
    
    if (!authHeader) {
        throw new Error("Token is missing!");
      }
    
      const [, token] = authHeader.split(" ");
    
          jwt.verify(token, appEnv.key || secret) as { userId: string };
    
          next();
        } catch (error) {
          console.log(error);
          res.status(400).json({msg: "Token inválido!"});
          
        }
  }

  //Private Route
  userRoutes.get("/:id", authenticateToken, async (req: Request, res: Response) => {
    const id = req.params.id;

    const user = await User.findById(id, "-password");

    if(!user) {
      return res.status(404).json({msg: "Usuário não encontrado!"})
    }

    res.status(200).json({ user });
  });

//cadastrar usuário
userRoutes.post('/cadastro', async (req: Request, res: Response) => {
    const { username, password, confirmPassword } = req.body;
  
    const existingUser = await User.findOne({ username });
  
    if (existingUser) {
      return res.status(409).json({ error: ' O nome de usuário já existe.' });
    }

    if (!username) {
      return res.status(422).json({ msg: "O username é obrigatório!" });
    }

    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    if(password !== confirmPassword) {
      return res.status(422).json({ msg: "As senhas não coinscidem!" });
    }
  
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
  
    const newUser = new User({
      username,
      password: hashPassword,
    });

    try {
      await newUser.save();
      res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    } catch(error) {
      console.log(error);
      
      res.status(500).json({msg: "Instabilidade no servidor, tente novamente mais tarde!"});
    }
  });

//listar todos os usuários
userRoutes.get("/", async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
});

//listar usuário e suas moedas 
userRoutes.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Coin.find({ userId }).populate('userId');
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

//obter usuário pelo ID
userRoutes.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if(user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "Usuário não encontrado."});
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o usuário." });
    }
})
  
//atualizar usuário
userRoutes.put("/:id", async (req, res) => {
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
userRoutes.delete("/:id", async (req, res) => {
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