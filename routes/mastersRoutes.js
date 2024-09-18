const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/languages', (req, res) => {
    const filePath = path.join(__dirname, '../dataJSON/languages.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load languages.' });
      }
      res.json(JSON.parse(data));
    });
  });

  router.get('/countries', (req, res) => {
    const filePath = path.join(__dirname, '../dataJSON/countries.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load countries.' });
      }
      res.json(JSON.parse(data));
    });
  });

  router.get('/date-format', (req, res) => {
    const filePath = path.join(__dirname, '../dataJSON/dateFormat.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load date Format.' });
      }
      res.json(JSON.parse(data));
    });
  });
  router.get('/time-zones', (req, res) => {
    const filePath = path.join(__dirname, '../dataJSON/timeZones.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load time-zones.' });
      }
      res.json(JSON.parse(data));
    });
  });

module.exports = router;