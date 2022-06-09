const express = require('express');
const router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require('fs');

// TODO : lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다.
router.post('/newMnemonic', async(req,res) => {
    let mnemonic
    try {
        mnemonic = lightwallet.keystore.generateRandomSeed()
        res.json({mnemonic})
    } catch(err){
        console.log(err);
    }
});


// TODO : 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
router.post('/newWallet', async(req, res) => {
    let password = req.body.password
    let mnemonic = req.body.mnemonic

    try {
        lightwallet.keystore.createVault(
            {
                password : password,
                seedPhrase : mnemonic,  // 계정 생성을 위한 니모닉
                hdPathString : "m/0'/0'/0'", 
            },
            function (err,ks){
                ks.keyFromPassword(
                    password,
                    function(err, pwDerivedKey){
                        ks.generateNewAddress(pwDerivedKey,1);
                        
                        let keystore = ks.serialize();
                        let addr = ks.getAddresses().toString();

                        fs.writeFile('wallet.json', keystore,
                        function(err,data){
                            if(err){
                                res.json({code:999, message:'fail'})
                            }  
                            else{
                                res.send({code:1, message:`success! wallet address :${addr}`})
                            }
                        }
                        )
                    }
                )
            }
        )
    }


    catch (exception){
        console.log(exception)
    }
});

module.exports = router;