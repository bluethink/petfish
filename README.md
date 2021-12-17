# petfish
Assignment Project

#Installation Step
1. Take the clone
2. Execute npm install
3. Change the DB Detail in .env file
4. node ./bin/www
5. Open the URL http://localhost:3001


For Graphql - http://localhost:3001


Sample Graphql Queries
Fetch Fish

{
  colors{id, name}
}


ADD Fish

mutation{
  addFish(species:"",finscount:"", colorID:""){
    Species,finscount,status,color{
        id, name
    },created_at,updated_at
  }
}


Update Fish

mutation{
  updateFish(_id:"", data : {finscount:"2", status:false }){
    species,finscount,status,color{
        id, name
    },created_at,updated_at
  }
}

Fetch Fish

{
  fishes{
    id,species,finscount,status,color{
        id, name
    },created_at, updated_at
   }
}

ADD Aquarium

mutation{
  addAquarium(glasstype:"Plastic",size:"Small", sizeunit:"Litre",shape:"Rectangle",
    fishes:["",""]){
    glasstype,size,sizeunit,shape, fish{
      id,species,finscount,color{
        id,name
      }
    }
  }
}

Fetch Aquarium By id

{
  aquarium(id:""){
    glasstype,size,sizeunit,shape,fish{
      id,species,finscount,color{
        id,name
      }
    }
  }
}

Fetch Aquariums

{
  aquariums{
    glasstype,size,sizeunit,shape,fish{
      id,species,finscount,color{
        id,name
      }
    }
  }
}



