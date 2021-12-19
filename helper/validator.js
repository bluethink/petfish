const Aquarium = require('../models/aquarium');
const Color = require('../models/color');
const Fish = require('../models/fish');

module.exports = {
    // Validate Fish
    validateFish: function(args) {
        var res = { 'status' : false, 'msg' : '' };
        if (args.species == '') {
            res.status = true;
            res.msg = 'Species is mandatory';
        }
        return res;
    },

    validationHelper: function (args) {
        return new Promise((resolve) => {
            for (const map of args) {
                Fish.findById(map, function (err, docs) {
                    if (err){
                        console.log(err);
                        resolve(false);
                    }else{
                        if(parseInt(docs.finscount) > 2){
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    }
                });
            }
        });
    },

    validateAquarium: async function(args){
        var res = { 'status' : false, 'msg' : '' };
        var msg = '';
        if (typeof args.glasstype != 'undefined' && args.glasstype == '') {
            msg += ((msg == '') ? 'Glass type is mandatory' : ', Glass type is mandatory');
        }

        if (typeof args.size != 'undefined' && args.size < 1) {
            msg += ((msg == '') ? 'Size should not be 0' : ', Size should not be 0');
        }

        if (typeof args.sizeunit != 'undefined' &&  args.sizeunit ==  '') {
            msg += ((msg == '') ? 'Size unit is mandatory' : ', Size unit is mandatory');
        }

        if (typeof args.shape != 'undefined' &&  args.shape ==  '') {
            msg += ((msg == '') ? 'Shape is mandatory' : ', Shape is mandatory');
        }

        if (typeof args.fishes != 'undefined') {
            var guppiesId = '';
            var goldFishId = '';
            var guppiesId = await Fish.find({ 'species': 'Guppies' }, 'id', function (err, fish) {
                if (err) return handleError(err);
            });

            var goldFishId = await Fish.find({ 'species': 'Goldfish' }, 'id', function (err, fish) {
                if (err) return handleError(err);
            });

            // Gold and Guppies can not live in one aquarium
            var guppi = (guppiesId[0]._id).toString();
            var gold = (goldFishId[0]._id).toString();
            if(args.fishes.includes(guppi) && args.fishes.includes(gold)){
                msg += ((msg == '') ? 'Guppies and Gold can not move in one aquarium' : ', Guppies and Gold can not move in one aquarium');
            }
        }
        if (typeof args.sizeunit != 'undefined' && typeof args.size != 'undefined') {
            if(args.sizeunit == 'Litre' && args.size > 75){
                var valdmsg = await this.validationHelper(args.fishes);
                if(valdmsg){
                    msg += ((msg == '') ? 'Finscount can not be greater than two in 75 Litre Aquarium' : ', Finscount can not be greater than two in 75 Litre Aquarium');
                }
            }
        }
        if(msg != ''){
            res.status = true;
            res.msg = msg;
        }
        return res;
    }
};