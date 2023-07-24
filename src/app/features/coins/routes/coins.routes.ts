import { Router } from "express";
import Coin from "../../../models/Coin";
import User from "../../../models/User";

export const coinsRoutes = Router();

 // Listar todas as moedas
 coinsRoutes.get("/", async (req, res) => {
    try {
      const coins = await Coin.find({});
      res.json(coins);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar moedas." });
    }
  });

  // Obter uma moeda pelo ID
  coinsRoutes.get("/:id", async (req, res) => {
    try {
      const coin = await Coin.findById(req.params.id);
      if (coin) {
        res.json(coin);
      } else {
        res.status(404).json({ error: "Moeda não encontrada." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar a moeda." });
    }
  });

// Criar uma moeda com o usuário
coinsRoutes.post("/", async (req, res) => {
    try {
        const { country, value, year, information, type, userId } = req.body;
        const coin = new Coin({
            country,
            value,
            year,
            information,
            type,
            userId
          });
          await coin.save();
          res.status(201).json(coin);
    } catch (error) {
          res.status(500).json({ error: "Erro ao criar a moeda." });
        }
});

// Atualizar moeda
coinsRoutes.put("/:id", async (req, res) => {
    try {
      const coin = await Coin.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (coin) {
        res.json(coin);
      } else {
        res.status(404).json({ error: "Moeda não encontrada." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar a moeda." });
    }
  });

      // Deletar uma moeda
      coinsRoutes.delete("/:id", async (req, res) => {
        const { id } = req.params;

        try {
          const coin = await Coin.findByIdAndDelete(id);

          if (coin) {
            res.json({message: "Moeda deletada com sucesso!"});
          } else {
            res.status(404).json({ error: "Moeda não encontrada." });
          }
        } catch (error) {
          res.status(500).json({ error: "Erro ao excluir a moeda." });
        }
      });

      coinsRoutes.delete('/:id', async (req, res) => {
        try {
          const coin = await Coin.findById(req.params.id);
          if (!coin) {
            return res.status(404).json({ error: 'Moeda não encontrada.' });
          }
      
          const user = await User.findById(req.user.id);
          if (!user || !coin.user.equals(user.id)) {
            return res.status(403).json({ error: 'Permissão negada. Você não tem permissão para excluir esta moeda.' });
          }
      
          await coin.deleteOne(coin.id);
          res.json({ message: 'Moeda excluída com sucesso.' });
        } catch (error) {
          res.status(500).json({ error: 'Erro ao excluir a moeda.' });
        }
      });