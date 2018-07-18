const Web3 = require('web3');

//const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/YluGFjpmE6UtZnJk5s4M')); //Ropsten Net

async function getEvents(abi, address, eventFilter, age){
    var web3;
    try{
        web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/YluGFjpmE6UtZnJk5s4M'));   //Main Net
    }catch(e){
        console.log('ERROR, Cannot conncet to Mainnet');
        console.log('INFO, rejecting request');
        return data = {
            error: true,
            message: 'ERROR, Cannot conncet to Mainnet'
        };

    }
    //Look if eventFilter is found in the the ABI.name
    var found = false;
    for (var i = 0; i < abi.length; i++){
        if(abi[i].name == eventFilter) {
            found = true;
        }
    }
    if (found == true || eventFilter == 'allEvents'){
    //If found or all Events shall be found proceed
        const contract = new web3.eth.Contract(abi, address);
        //contract entety, used to interact with the real contract on the blockchain
        var blockNumber;
        try{
            blockNumber = await web3.eth.getBlockNumber();
        }catch(e){
            console.log('ERROR, Cannot get Newest Blocknumber check Network connection');
            console.log('INFO rejecting request')
            return data = {
                error: true,
                message: 'ERROR, Cannot get Newest Blocknumber check Network connection'
            };
        }
        //Getting the current Block number
        if (age > 18) {
            age = 18;
        }
        //If Lookup for a bigger spam as 18 hours, liklyly to timeout or overflow
        var data;
        //Used to return value
        const blocktime = 15;
        const startBlock = blockNumber - (age*60*60)/blocktime;
        //By assuming a Blocktime of 15 sec you can calculate the wished Blockrange 
        // by multiplying the wished hours into seconds and deviding ist by the blocktime
        //TODO EVENT
        try{
            await contract.getPastEvents(eventFilter, {
            fromBlock: startBlock,  
            toBlock: 'latest'
            }, function(error, events){
                if (error != null){
                    console.log('ERROR, ', error);
                    console.log('INFO, rejecting request')
                    //If there is an Error return it later
                    data = {
                        error: true,
                        message: error
                    };
                }
                else {
                //If there is no error return event list
                    console.log('INFO, found events')
                    data = {
                        error: false,
                        message: events
                    };
                }
            })
        }
        catch(e){
            //if there is an error return it
            if (eventFilter == 'allEvents'){
                console.log('ERROR, No Events found in given Event History');
                console.log('INFO, rejecting request')
                data = {
                    error: true,
                    message: `ERROR, No Events found in given Event History`
                }
            }
            else {
                console.log(`ERROR, Event ${eventFilter} is not found in given Event History`);
                console.log('INFO rejecting request')
                data = {
                    error: true,
                    message: `ERROR, Event ${eventFilter} is not found in given Event History`
                }
            }
            
        }
    }
    else if(found == false){
        //If not Found in ABI return
        console.log(`ERROR, Event ${eventFilter} is not in ABI`);
        console.log('INFO rejecting request')
        data = {
            error: true,
            message: `ERROR, Event ${eventFilter} not Found in ABI`
        }
    }
    return data;  
};

module.exports = getEvents;
