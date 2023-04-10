const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/yelpcamp');


mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology:true})    
.then(()=>{
    console.log("Mongoose Connected !!");

})
.catch(err=>
{
    console.log("ohh nooo Mongoose Erorrr!!");
    console.log(err); 
})

const sample = (array) => 
{
    return array[Math.floor(Math.random() * array.length)];
}


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 250; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: {
                   _id:"642ddc60cae2635a857f3c34",
                 email: 'asfarma2815@gmail.com',
                 username: 'asfar'
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                 type: 'Point',
                 coordinates: [cities[random1000].longitude,
                               cities[random1000].latitude
                              ]},
           location: `${cities[random1000].city}, ${cities[random1000].state}`,
           description:"  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, ab dolores. Eum alias eos tempora quaerat vero cupiditate est reiciendis? Unde, quam id nihil quis iusto excepturi maiores explicabo vel.",
           price,
           images:{
            url: 'https://res.cloudinary.com/dbfn18wm7/image/upload/v1678820703/Yelpcamp/ll4sloglw0demwchua3r.jpg',
            filename: 'Yelpcamp/ll4sloglw0demwchua3r'
           }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})