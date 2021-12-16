/**
 * Created by Anubhaw.
 */

 var moment = require('moment');
 const replace = require('key-value-replace')
 
 module.exports = {
     genuid: function() {
         var result = '';
         var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
         var charactersLength = characters.length;
         for (var i = 0; i < 32; i++) {
             result += characters.charAt(Math.floor(Math.random() * charactersLength));
         }
         return result;
     },
 };