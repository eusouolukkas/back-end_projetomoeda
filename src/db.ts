import express from 'express';
import mongoose from 'mongoose';

export const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL || '')
  .then(() => {
    const PORT = process.env.PORT;

    app.use(express.json());

    app.listen(PORT, () => console.log(`Rodando na porta ${ PORT }`));
  })
  .catch((error) => console.log(error));