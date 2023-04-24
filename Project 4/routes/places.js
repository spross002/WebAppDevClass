const express = require('express');
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });
const router = express.Router();

router.get('/', async (req, res) => {
    const places = await req.db.findPlaces();
    res.json({ places: places });
});

router.put('/', async (req, res) => {
    const result = await geocoder.geocode(req.body.address)
    if(result.length > 0){
        console.log(`The location of ${req.body.label} is ${result[0].latitude}/${result[0].longitude}`)
    }

    const id = await req.db.createPlace(req.body.label, result[0].formattedAddress, result[0].latitude, result[0].longitude);

    res.json({ id: id,
              label: req.body.label,
              address: req.body.address,
              lat: result[0].latitude,
              lng: result[0].longitude         
    });
});

router.delete('/:id', async (req, res) => {
    await req.db.deletePlace(req.params.id);
    res.status(200).send();
})

module.exports = router;