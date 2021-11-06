const { getImage, getVideo } = require('../helpers/Scrapper');


export default async function handler(req, res) {
    
    const {url} = req.body;
    const image = await getImage(url);
    const response = {
        success: true,
        media: image
    };

    res.status(200).json(response);
  }
  
