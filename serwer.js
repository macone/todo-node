const express = require('express');
const { readFile, writeFile } = require('fs').promises;

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/app/:task/:id?', async (req, res) => {
  const { task, id } = req.params;
  const DBfile = await readFile('./db.json', 'utf8');
  let db = JSON.parse(DBfile) || [];
  let result;
  switch (task) {
    case 'add':
      db.push({
        task: req.body.task,
        id: db.length + 1,
        done: false,
        removed: false,
        ip: req.ip,
      });
      result = db.filter((e) => !e.removed && e.ip === req.ip);
      res.send({ success: true, db: result });
      break;

    case 'delete':
      // db = db.map((e) => e.id !== id);
      db = db.map((e) => {
        if (e.id === Number(id)) {
          e.removed = true;
        }
        return e;
      });
      result = db.filter((e) => !e.removed && e.ip === req.ip);
      res.send(JSON.stringify(result));
      break;

    case 'done':
      db = db.map((e) => {
        if (e.id === Number(id)) {
          e.done = true;
        }
        return e;
      });
      result = db.filter((e) => !e.removed && e.ip === req.ip);
      res.send(JSON.stringify(result));
      break;

    case 'undone':
      db = db.map((e) => {
        if (e.id === Number(id)) {
          e.done = false;
        }
        return e;
      });
      result = db.filter((e) => !e.removed && e.ip === req.ip);
      res.send(JSON.stringify(result));
      break;

    default:
      console.log('There is no task... please send /app/add, /app/delete/id, /app/done/id or /app/undone/id');
      res.send('There is no task... please send /app/add, /app/delete/id, /app/done/id or /app/undone/id');
  }
  writeFile('./db.json', JSON.stringify(db), 'utf8');
  res.end();
});

app.get('/app/', async (req, res) => {
  const DBfile = await readFile('./db.json', 'utf8');
  const db = JSON.parse(DBfile) || [];
  const result = db.filter((e) => !e.removed && e.ip === req.ip);
  res.send(result);
  res.end();
});

app.get('/getDB/', async (req, res) => {
  const DBfile = await readFile('./db.json', 'utf8');
  const db = JSON.parse(DBfile) || [];
  res.send(db);
  res.end();
});
app.listen(80);
