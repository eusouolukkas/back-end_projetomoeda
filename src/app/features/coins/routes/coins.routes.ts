import { Router } from "express";
import Coin from "../../../models/Coin";

export const coinsRoutes = Router();

 // Rota para listar todas as moedas
 coinsRoutes.get("/", async (req, res) => {
    try {
      const coins = await Coin.find();
      res.json(coins);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar moedas." });
    }
  });

  // Rota para obter uma moeda pelo ID
  coinsRoutes.get("/coins/:id", async (req, res) => {
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

// Rota para criar uma nova moeda
coinsRoutes.post("/", async (req, res) => {
    try {
        const { country, value, year, information, type } = req.body;
        const coin = new Coin({
            country,
            value,
            year,
            information,
            type,
          });
          await coin.save();
          res.status(201).json(coin);
    } catch (error) {
          res.status(500).json({ error: "Erro ao criar a moeda." });
        }
});

// Rota para atualizar uma moeda existente
coinsRoutes.put("/coins/:id", async (req, res) => {
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

      // Rota para excluir uma moeda
      coinsRoutes.delete("/coins/:id", async (req, res) => {
        try {
          const coin = await Coin.findByIdAndDelete(req.params.id);
          if (coin) {
            res.json(coin);
          } else {
            res.status(404).json({ error: "Moeda não encontrada." });
          }
        } catch (error) {
          res.status(500).json({ error: "Erro ao excluir a moeda." });
        }
      });