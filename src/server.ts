
import { Metric, MetricsHandler} from './metrics'
import express = require('express')
import bodyparser = require('body-parser')
import mongodb = require('mongodb')
var db: any;
const app= express()

// Initialize connection once
const MongoClient = mongodb.MongoClient // Create a new MongoClient
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
  if(err) throw err
  db = client.db('mydb')

  // Start the application after the database connection is ready
  const port: string = process.env.PORT || '8115'

  app.listen(port, (err: Error) => {
    if (err) {
      throw err
    }
    console.log(`server is listening on port ${port}`)
  })
});

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.post('/metrics', (req: any, res: any) => {
  if(req.body.value){
    const metric = new Metric(new Date().getTime().toString(), parseInt(req.body.value));
    console.log('Posted')
    new MetricsHandler(db).save(metric, (err: any, result: any) => {
      if (err)
        return res.status(500).json({error: err, result: result});
      res.status(201).json({error: err, result: true})
    })
  }else{
    return res.status(400).json({error: 'Wrong request parameter',});
  }
})

app.delete('/metrics', (req: any, res: any) => {
  if(req.body.value){
    console.log('Removed')
    new MetricsHandler(db).remove({value: req.body.value}, (err: any, result: any) => {
      if (err)
        return res.status(500).json({error: err, result: result});
      res.status(201).json({error: err, result: true})
    })
  }else{
    return res.status(400).json({error: 'Wrong request parameter',});
  }
})

app.get('/metrics', (req: any, res: any) => {
  if(req.body.value){
    console.log('Got')
    const metric = new Metric(new Date().getTime().toString(), parseInt(req.body.value));
    new MetricsHandler(db).getA(metric, (err: Error | null, result? : any) => {
      if (err) {
        throw err
      }
      res.json(result);
    })
  }else{
    console.log('GotAll')
    new MetricsHandler(db).getB((err: Error | null, result? : any) => {
      if (err) {
          throw err
        }
        res.json(result);
      })
  }
})
