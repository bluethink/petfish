const graphql = require('graphql');
const Aquarium = require('../models/aquarium');
const Color = require('../models/color');
const Fish = require('../models/fish');
const { arrayToGraphQL } = require('graphql-compose-mongoose');
const { GraphQLJSONObject } = require('graphql-compose');

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
        color: {
            type: ColorType,
            resolve(parent,args){
                return Color.findById(parent.colorID);
            }
        },
    })
});

const AquariumType = new GraphQLObjectType({
    name: 'Aquarium',
    fields: () => ({
        id: { type: GraphQLID  },
        glasstype: { type: GraphQLString }, 
        size: { type: GraphQLString }, 
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
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
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
        },
        updateFish:{
            type:FishType,
            args:{
                species: { type: GraphQLString},
                finscount: { type: GraphQLInt},
                _id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: async(parent,args) => {
                let updateFish = {};

                if(args.species) {
                    updateFish.species = args.species;
                }

                if(args.finscount) {
                    updateFish.finscount = args.finscount;
                }
               
                const uFish= await Fish.findByIdAndUpdate(args._id, updateFish, {new: true});
                console.log(uFish);
                if(!uFish) {
                    throw new Error('Error');
                }
                return uFish;
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
                size: { type: new GraphQLNonNull(GraphQLString)},
                sizeunit : { type: new GraphQLNonNull(GraphQLString)},
                shape : { type: new GraphQLNonNull(GraphQLString)},
                fishes: { type: new GraphQLList(GraphQLString) }
            },
            resolve: async(parent,args) => {
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
        },
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});