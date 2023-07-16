import express from "express";
import mongoose from "mongoose";
import Coin from "./models/Coin";

mongoose
  .connect(
    "mongodb+srv://silveiralukke:18021993tc@my-db.vpedswe.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    const app = express();
    app.use(express.json());
    const port = 3000;

    // Rota para listar todas as moedas
    app.get("/coins", async (req, res) => {
      try {
        const coins = await Coin.find();
        res.json(coins);
      } catch (error) {
        res.status(500).json({ error: "Erro ao buscar moedas." });
      }
    });

    // Rota para obter uma moeda pelo ID
    app.get("/coins/:id", async (req, res) => {
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
    app.post("/coins", async (req, res) => {
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
    app.put("/coins/:id", async (req, res) => {
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
    app.delete("/coins/:id", async (req, res) => {
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

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((error) => console.log(error));