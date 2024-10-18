import express from 'express';
import contactsRouter from './routes/contacts.js';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/contacts', contactsRouter);
app.use(cors());
app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
});
app.listen(80, function () {
  console.log('CORS-enables web server listening on port 80')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
