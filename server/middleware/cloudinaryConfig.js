const { config, uploader } = require('cloudinary');
const cloudinaryConfig = () => config({
   cloud_name: process.env.CLOUDNAME,
   api_key: process.env.CLOUDKEY,
   api_secret: process.env.CLOUDSECRET
});

module.exports = { cloudinaryConfig, uploader };