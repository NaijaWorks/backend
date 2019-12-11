const express = require('express');
const router = express.Router();
const r = require('./responses');
const { multerUploads, dataUri } = require('../middleware/multer');
const { cloudinaryConfig, uploader } = require('../middleware/cloudinaryConfig');
cloudinaryConfig(router);

router.post('/v1/upload', multerUploads, async (req, res) => {
   try {
      if (req.file) {
         const file = dataUri(req).content;
         const { url } = await uploader.upload(file);
         res.status(201).json({
            message: r.uploadSuccess,
            image: url
         })
      } else {
         res.status(400).json(r.missing);
      }
   } catch (error) {
      res.status(500).json(error.message);
   }
})