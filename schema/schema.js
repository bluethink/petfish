const graphql = require('graphql');
const Aquarium = require('../models/aquarium');
const Color = require('../models/color');
const Fish = require('../models/fish');
const { arrayToGraphQL } = require('graphql-compose-mongoose');
const { GraphQLJSONObject } = require('graphql-compose');
const validatorObj = require('../helper/validator');
const moment = require('moment');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt,GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;

const ColorType = new GraphQLObjectType({
    name: 'Color',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString }, 
        fish:{
            type: new GraphQLList(FishType),
            resolve(parent,args){
                return Fish.find({ ColorID: parent.id });
            }
        }
    })
});

const FishType = new GraphQLObjectType({
    name: 'Fish',
    fields: () => ({
        id: { type: GraphQLID  },
        species: { type: GraphQLString }, 
        finscount: { type: GraphQLInt }, 
        status: { type: GraphQLString }, 
        color: {
            type: ColorType,
            resolve(parent,args){
                return Color.findById(parent.colorID);
            }
        },
        created_at: { 
            type: GraphQLString,
            resolve(parent,args){
                return moment(parent.created_at).format("DD/MM/YYYY h:mm:ss");
            }
        },
        updated_at: { 
            type: GraphQLString,
            resolve(parent,args){
                return moment(parent.created_at).format("DD/MM/YYYY h:mm:ss");
            }
        },
    })
});

const AquariumType = new GraphQLObjectType({
    name: 'Aquarium',
    fields: () => ({
        id: { type: GraphQLID  },
        glasstype: { type: GraphQLString }, 
        size: { type: GraphQLInt }, 
        sizeunit:  { type: GraphQLString },
        shape:  { type: GraphQLString },
        fish: {
            type: new GraphQLList(FishType),
            resolve(parent,args){
                var fishObj = [];
                parent.fishes.forEach(element => {
                    fishObj.push(Fish.findById(element));
                });
                return fishObj;
            }
            
        },
        created_at: { 
            type: GraphQLString,
            resolve(parent,args){
                return moment(parent.created_at).format("DD/MM/YYYY h:mm:ss");
            }
        },
        updated_at: { 
            type: GraphQLString,
            resolve(parent,args){
                return moment(parent.created_at).format("DD/MM/YYYY h:mm:ss");
            }
        },
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        fish: {
            type: FishType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Fish.findById(args.id);
            }
        },
        fishes:{
            type: new GraphQLList(FishType),
            resolve(parent, args) {
                return Fish.find({});
            }
        },
        color:{
            type: ColorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Color.findById(args.id);
            }
        },
        colors:{
            type: new GraphQLList(ColorType),
            resolve(parent, args) {
                return Color.find({});
            }
        },
        aquarium: {
            type: AquariumType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Aquarium.findById(args.id);
            }
        },
        aquariums:{
            type: new GraphQLList(AquariumType),
            resolve(parent, args) {
                return Aquarium.find({});
            }
        }
    }
});

//Define Mutation for Object
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addFish:{
            type:FishType,
            args:{
                species: { type: new GraphQLNonNull(GraphQLString)},
                finscount: { type: new GraphQLNonNull(GraphQLInt)},
                colorID: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: async(parent,args) => {
                // Call Fish validator to validate Fish Data
                var validationResObj = validatorObj.validateFish(args);
                if(validationResObj.status){
                    throw new Error(validationResObj.msg);
                }else{
                    let fish = new Fish({
                        species:args.species,
                        finscount:args.finscount,
                        colorID:args.colorID
                    });
    
                    const newfish = await fish.save();
                    if(!newfish) {
                        throw new Error('Error');
                    }
                    return newfish;
                }
            }
        },

        updateFish:{
            type:FishType,
            args:{
                data: { type : GraphQLJSONObject},
                _id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: async(parent,args) => {
                let updateFish = {};
                // Call Fish validator to validate Fish Data
                var validationResObj = validatorObj.validateFish(args.data);

                if(validationResObj.status){
                    throw new Error(validationResObj.msg);
                }else{
                    if(typeof args.data.status != 'undefined'){
                        updateFish.status = args.data.status;
                    }
    
                    if(typeof args.data.finscount != 'undefined'){
                        updateFish.finscount = args.data.finscount;
                    }
    
                    if(typeof args.data.species != 'undefined'){
                        updateFish.species = args.data.species;
                    }

                    if(typeof args.data.colorID != 'undefined'){
                        updateFish.colorID = args.data.colorID;
                    }

                    updateFish.updated_at = new Date();

                    // Find FIsh in database and update the object values
                    const uFish= await Fish.findByIdAndUpdate(args._id, updateFish, {new: true});

                    if(!uFish) {
                        throw new Error('Error');
                    }
                    return uFish;
                }
            },
        },

        addColor: {
            type: ColorType,
            args: {
                //GraphQLNonNull make these field required
                name: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let color = new Color({
                    name: args.name,
                });
                return color.save();
            }
        },

        addAquarium:{
            type:AquariumType,
            args:{
                glasstype: { type: new GraphQLNonNull(GraphQLString)},
                size: { type: new GraphQLNonNull(GraphQLInt)},
                sizeunit : { type: new GraphQLNonNull(GraphQLString)},
                shape : { type: new GraphQLNonNull(GraphQLString)},
                fishes: { type: new GraphQLList(GraphQLString) }
            },
            resolve: async(parent,args) => {
                // Call Aquarium validator to validate post data
                var validationResObj = await validatorObj.validateAquarium(args);

                if(validationResObj.status){
                    throw new Error(validationResObj.msg);
                }else{
                    let aquarium = new Aquarium({
                        glasstype:args.glasstype,
                        size:args.size,
                        sizeunit:args.sizeunit,
                        shape:args.shape,
                        fishes:args.fishes
                    });
    
                    const newaquarium = await aquarium.save();
                    if(!newaquarium) {
                        throw new Error('Error');
                    }
                    return newaquarium;
                }
            }
        },
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});