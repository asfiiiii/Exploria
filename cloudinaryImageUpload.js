const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');


cloudinary.config(
    {
        cloud_name: process.env.api_name,
        api_key: process.env.api_key,
        api_secret:process.env.api_secret

    }
)

const storage = new CloudinaryStorage(
    {
        cloudinary,
         
        params:{
            folder:"Yelpcamp",
        allowedFormats:['jpeg','png','jpg']
        }
    }
);

module.exports = {
    cloudinary,
    storage
}