const express = require('express');
const router = express.Router();
const getContracts = require('../functions/getContracts');
const getEvents = require('../functions/getEvents');

router.get('/:id/:eventFilter/:age', async (req, res) => {
    console.log('INFO, incoming request');
    //Validate send data
    const address = req.params.id;
    const eventFilter = req.params.eventFilter;
    const age = req.params.age;
    //Getting Data from url
    if (address[0] != '0' && address[1] != 'x'){
    //Check if address hexadezimal
        res.status(400).send('ERROR, address is not a hexa number');
        console.log('INPUT ERROR, address is not a hexa number');
        console.log('INFO, rejecting request');
        return
    }
    if (Number(age) != age){
        //Check if address hexadezimal
            res.status(400).send('ERROR, Age is not a Number');
            console.log('INPUT ERROR, address is not a hexa number');
            console.log('INFO, rejecting request');
            return
        }

    try{
        const abi = await getContracts(address);
        //get ABI from address
        const events = await getEvents(abi, address, eventFilter, age);
        //get events from abi, address, eventfilter, age
        if (events.error == false){
        //if events return no error result
            res.status(200).send(events.message);
            console.log(`INFO, Accepting request, sending ${events.message.length+1} Events`);
            return
        }
        else if (events.error == true){        
        //if events return error return error
            res.status(400).send(events.message);
            console.log('ERROR,', events.message);
            console.log('INFO, rejecting request');
            return
        }
    } catch(e){
        res.status(400).send(e);
        console.log('ERROR,', e);
        console.log('INFO, rejecting request');
        return
    }

    
});

module.exports = router;