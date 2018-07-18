const axios = require('axios');

//Give Address of contract and get ABI
function getConracts(address) {
    return new Promise ((resolve, reject) => {
        axios.get(`http://api.etherscan.io/api?module=contract&action=getabi&address=${address}`)
        .then(response => {
            if (response.data.status != 1){
                //If response returned failed, reject with error Message
                reject(`ERROR, ${response.data.result}`);
                console.log(`ERROR, ${response.data.result}`)
                console.log('INFO, rejecting request')
                return
            } 
            else {
                //If response returned succsesfull save result(abi of address) as JSON object
                var abi = "";
                abi = JSON.parse(response.data.result);
                if (abi == '' && abi == null){
                    //If ABI is empty or undefiened reject with error
                    reject(`ERROR, No ABI returned or undefiened` );
                    console.log(`ERROR, No ABI returned or undefiened`)
                    console.log('INFO, rejecting request')
                    return
                } 
                else {
                    //If ABI is there return it
                    resolve(abi);
                    console.log(`INFO, Found ABI`)
                    return
                }     
            }      
        })
        .catch(error => {
            reject('ERROR cannot connect to etherscan api, check Network connection');
            console.log('ERROR, cannot connect to etherscan api');
            console.log('INFO, rejecting request')
        })         
    });
}

module.exports = getConracts;

