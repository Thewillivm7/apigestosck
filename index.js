const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')


// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gestock'
});
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Route pour récupérer des données à partir de la base de données
app.get('/entree', (req, res) => {
  // const query = 'SELECT dateaction,article.desigantionarticle,nbarticle,totalaction FROM `action` INNER JOIN article on article.idarticle=action.idarticle WHERE motifaction=1 ORDER BY action.dateaction DESC;';
  const query = 'SELECT * FROM `action` INNER JOIN article on article.idarticle=action.idarticle WHERE motifaction=1 ORDER BY action.dateaction DESC;';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données.' });
    } else {
      res.json(results);
    }
  });
});
app.get('/sortie', (req, res) => {
    const query = 'SELECT dateaction,article.desigantionarticle,nbarticle,totalaction FROM `action` INNER JOIN article on article.idarticle=action.idarticle WHERE motifaction=2 ORDER BY action.dateaction DESC;';
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données.' });
      } else {
        res.json(results);
      }
    });
  });
  app.get('/stock', (req, res) => {
    const query = 'SELECT article.idarticle,article.desigantionarticle,article.stockalertearticle,SUM(CASE WHEN motifaction = 1 THEN nbarticle ELSE 0 END) - SUM(CASE WHEN motifaction = 2 THEN nbarticle ELSE 0 END) AS reste FROM action INNER JOIN article on article.idarticle=action.idarticle WHERE action.idarticle = action.idarticle GROUP BY action.idarticle';
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données.' });
      } else {
        res.json(results);
      }
    });
  });
  app.get('/article', (req, res) => {
    const query = 'SELECT idarticle,desigantionarticle FROM `article` WHERE 1';
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données.' });
      } else {
        res.json(results);
      }
    });
  });
  app.post('/newentree', (req, res) => {
    let query="INSERT INTO action SET ?";
    console.log(req.body);
    let donnee={
      idarticle: req.body.idarticle,
      nbarticle: req.body.nbarticle,
      motifaction:req.body.motifaction,
      totalaction:req.body.totalaction
  
    };
    console.log("test")

    // Validation rapide des données avant l'insertion
    if (!donnee.idarticle || !donnee.nbarticle || !donnee.motifaction || !donnee.totalaction) {
      return res.status(400).json({ msg: "Toutes les données doivent être fournies." });
  }
      // const newProduct = {content: req.body.content};
      connection.query(query,donnee,(error, results) => {
        if (error)res.json({msg:error});
        else {
          res.json({msg:"entrée bien ajouté"});
        }
      });
    });

    app.post('/newsortie', (req, res) => {
      let query="INSERT INTO action SET ?";
      console.log(req.body);
      let donnee={
        idarticle: req.body.idarticle,
        nbarticle: req.body.nbarticle,
        motifaction:req.body.motifaction,
        
    
      };
      // Validation rapide des données avant l'insertion
      if (!donnee.idarticle ||!donnee.motifaction || !donnee.nbarticle) {
        return res.status(400).json({ msg: "Toutes les données doivent être fournies." });
    }
        // const newProduct = {content: req.body.content};
        connection.query(query,donnee,(error, results) => {
          if (error)res.json({msg:error});
          else {
            res.json({msg:"sortie bien ajouté"});
          }
        });
      });

// Lancer le serveur
app.listen(3000,'0.0.0.0',() => {
  console.log('Serveur démarré sur le port 3000');
});
