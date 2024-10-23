const express = require('express');
const Language = require('../models/language');
const Country = require('../models/country');
const Timezone = require('../models/timezone');
const DateFormat = require('../models/dateFormat'); // Import DateFormat model

const router = express.Router();

// ------------------------ Languages ------------------------ //

// GET request to fetch all languages
router.get('/languages', async (req, res) => {
    try {
        const languages = await Language.find();
        res.json(languages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load languages.' });
    }
});

// POST request to create a new language
router.post('/language/create', async (req, res) => {
    const { language } = req.body;

    if (!language) {
        return res.status(400).json({ error: 'Language is required.' });
    }

    try {
        const newLanguage = new Language({
            id: await Language.countDocuments() + 1,
            language,
        });

        const savedLanguage = await newLanguage.save();
        res.json({ message: 'Language created successfully!', language: savedLanguage });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create language.' });
    }
});

// PUT request to update a language by ID
router.put('/language/update/:id', async (req, res) => {
    const { id } = req.params;
    const { language } = req.body;

    if (!language) {
        return res.status(400).json({ error: 'Language is required.' });
    }

    try {
        const updatedLanguage = await Language.findOneAndUpdate(
            { id },
            { language },
            { new: true }
        );

        if (!updatedLanguage) {
            return res.status(404).json({ error: 'Language not found.' });
        }

        res.json({ message: 'Language updated successfully!', language: updatedLanguage });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update language.' });
    }
});

// DELETE request to delete a language by ID
router.delete('/language/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLanguage = await Language.findOneAndDelete({ id });

        if (!deletedLanguage) {
            return res.status(404).json({ error: 'Language not found.' });
        }

        res.json({ message: 'Language deleted successfully!', language: deletedLanguage });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete language.' });
    }
});

// ------------------------ Countries ------------------------ //

// GET request to fetch all countries
router.get('/countries', async (req, res) => {
    try {
        const countries = await Country.find();
        res.json(countries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load countries.' });
    }
});

// POST request to create a new country
router.post('/country/create', async (req, res) => {
    const { country } = req.body;

    if (!country) {
        return res.status(400).json({ error: 'Country is required.' });
    }

    try {
        const newCountry = new Country({
            id: await Country.countDocuments() + 1,
            country,
        });

        const savedCountry = await newCountry.save();
        res.json({ message: 'Country created successfully!', country: savedCountry });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create country.' });
    }
});

// PUT request to update a country by ID
router.put('/country/update/:id', async (req, res) => {
    const { id } = req.params;
    const { country } = req.body;

    if (!country) {
        return res.status(400).json({ error: 'Country is required.' });
    }

    try {
        const updatedCountry = await Country.findOneAndUpdate(
            { id },
            { country },
            { new: true }
        );

        if (!updatedCountry) {
            return res.status(404).json({ error: 'Country not found.' });
        }

        res.json({ message: 'Country updated successfully!', country: updatedCountry });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update country.' });
    }
});

// DELETE request to delete a country by ID
router.delete('/country/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCountry = await Country.findOneAndDelete({ id });

        if (!deletedCountry) {
            return res.status(404).json({ error: 'Country not found.' });
        }

        res.json({ message: 'Country deleted successfully!', country: deletedCountry });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete country.' });
    }
});

// ------------------------ Timezones ------------------------ //

// GET request to fetch all timezones
router.get('/timezones', async (req, res) => {
    try {
        const timezones = await Timezone.find();
        res.json(timezones);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load timezones.' });
    }
});

// POST request to create a new timezone
router.post('/timezone/create', async (req, res) => {
    const { timezone } = req.body;

    if (!timezone) {
        return res.status(400).json({ error: 'Timezone is required.' });
    }

    try {
        const newTimezone = new Timezone({
            id: await Timezone.countDocuments() + 1,
            timezone,
        });

        const savedTimezone = await newTimezone.save();
        res.json({ message: 'Timezone created successfully!', timezone: savedTimezone });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create timezone.' });
    }
});

// PUT request to update a timezone by ID
router.put('/timezone/update/:id', async (req, res) => {
    console.log("run")
    const { id } = req.params;
    const { timezone } = req.body;

    if (!timezone) {
        return res.status(400).json({ error: 'Timezone is required.' });
    }

    try {
        const updatedTimezone = await Timezone.findOneAndUpdate(
            { id },
            { timezone },
            { new: true }
        );

        if (!updatedTimezone) {
            return res.status(404).json({ error: 'Timezone not found.' });
        }

        res.json({ message: 'Timezone updated successfully!', timezone: updatedTimezone });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update timezone.' });
    }
});

// DELETE request to delete a timezone by ID
router.delete('/timezone/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTimezone = await Timezone.findOneAndDelete({ id });

        if (!deletedTimezone) {
            return res.status(404).json({ error: 'Timezone not found.' });
        }

        res.json({ message: 'Timezone deleted successfully!', timezone: deletedTimezone });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete timezone.' }); // Corrected here
    }
});

// ------------------------ Date Format ------------------------ //

// GET request to fetch all date formats from MongoDB
router.get('/date-formats', async (req, res) => {
    try {
        const dateFormats = await DateFormat.find();
        res.json(dateFormats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load date formats.' });
    }
});

// POST request to create a new date format
router.post('/date-format/create', async (req, res) => {
    const { format } = req.body;

    if (!format) {
        return res.status(400).json({ error: 'Format is required.' });
    }

    try {
        const newDateFormat = new DateFormat({
            id: await DateFormat.countDocuments() + 1,
            format,
        });

        const savedDateFormat = await newDateFormat.save();
        res.json({ message: 'Date format created successfully!', format: savedDateFormat });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create date format.' });
    }
});

// PUT request to update a date format by ID
router.put('/date-format/update/:id', async (req, res) => {
    const { id } = req.params;
    const { format } = req.body;

    if (!format) {
        return res.status(400).json({ error: 'Format is required.' });
    }

    try {
        const updatedDateFormat = await DateFormat.findOneAndUpdate(
            { id },
            { format },
            { new: true }
        );

        if (!updatedDateFormat) {
            return res.status(404).json({ error: 'Date format not found.' });
        }

        res.json({ message: 'Date format updated successfully!', format: updatedDateFormat });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update date format.' });
    }
});

// DELETE request to delete a date format by ID
router.delete('/date-format/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDateFormat = await DateFormat.findOneAndDelete({ id });

        if (!deletedDateFormat) {
            return res.status(404).json({ error: 'Date format not found.' });
        }

        res.json({ message: 'Date format deleted successfully!', format: deletedDateFormat });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete date format.' });
    }
});
 
module.exports = router;
