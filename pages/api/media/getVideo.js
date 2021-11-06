const { getVideo } = require('../helpers/Scrapper');

export default async function handler(req, res) {
    const {url} = req.body;
    const videos = await getVideo(url);
    const response = {
        success: true,
        media: videos
    };
    
    res.status(200).json(response);
  }
  
