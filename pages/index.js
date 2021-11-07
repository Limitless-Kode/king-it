import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { saveAs } from 'file-saver'
import { SpinnerCircular } from 'spinners-react';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import {BsImages} from 'react-icons/bs'
import {HiOutlineVideoCamera} from 'react-icons/hi'
import ProgressIndicator from '../components/ProgressIndicator';

export default function Home() {
  const [fetchingMedia, setfetchingMedia] = useState(false);
  const [mediaUrl, setmediaUrl] = useState("https://")
  const [imageFiles, setimageFiles] = useState([])
  const [videoFiles, setVideoFiles] = useState([])
  const [isVideo, setIsVideo] = useState(false);

  const fetchImages = async (url) => {

    const isMobileURL = url.search("kingsch.at");

    if (isMobileURL >= 0) {
      const postArray = url.split("/");
      const postId = postArray[postArray.length - 1];

      // console.log(postId);

      url = `https://kingschat.online/post/${postId}`;
    }

    if (!(url.startsWith('https://') || url.startsWith('http://'))) {
      url = `https://${url}`;
    }

    setVideoFiles([]);
    if(mediaUrl.trim() == "") return;

    setfetchingMedia(true);


    const request = await fetch('https://kingitnow.com/api/getImage', {
      method: "POST",
      body: JSON.stringify({ "url": url }),
      headers: {
        "Content-Type" : "application/json"
      }
    });
    const response = await request.json();
    // console.log(response);
    setimageFiles(response['media']);
    setfetchingMedia(false);
  }

  const fetchVideo = async (url) => {
    
    const isMobileURL = url.search("kingsch.at");
    
    if (isMobileURL >= 0) {
      const postArray = url.split("/");
      const postId = postArray[postArray.length - 1];
      
      // console.log(postId);
      
      url = `https://kingschat.online/post/${postId}`;
    }
    
    if (!(url.startsWith('https://') || url.startsWith('http://'))) {
      url = `https://${url}`;
    }
    
    setimageFiles([]);
    if(mediaUrl.trim() == "") return;

    setfetchingMedia(true);
    // 
    const request = await fetch('https://kingitnow.com/api/getVideo', {
      method: "POST",
      body: JSON.stringify({ "url": url }),
      headers: {
        "Content-Type" : "application/json"
      }
    });
    const response = await request.json();
    console.log(response['media']);
    setVideoFiles(response['media']);
    setfetchingMedia(false);
  }
  const download = async (url) => {

    const file = await fetch(url);
    const reader = file.body.getReader();
    const contentLength = +file.headers.get('Content-Length');

    let receivedLength = 0; // received that many bytes at the moment
    let chunks = []; // array of received binary chunks (comprises the body)

    while(true) {
      const {done, value} = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;

      console.log(`Received ${receivedLength} of ${contentLength}`)
    }

    let blob = new Blob(chunks);
  
    // const fileBlog = await file.blob();
    const fileURL = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = fileURL;
    link.download = 'kingschat-downloader-' + new Date().getTime() + (isVideo ? '.mp4' : '.jpg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
      
  };

  return (
    <div className="">
      <Head>
        <title>KingsChat Downloader</title>
        <meta name="description" content="The first of it's kind online tool that unlocks the possibility to download beautiful images and videos from KingsChat into your gallery and enjoy them offline." />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex justify-center items-center flex-col text-center bg-blue-800 min-h-[100vh]">
          <div className="navigation absolute top-3 left-3">
            <div><Image src={require("/public/images/logo.png")} height="60px" width="60" alt="Alt"/></div>
            </div>
            <div className="w-10/12 sm:w-6/12">
                <h1 className="text-gray-50 text-xl sm:text-4xl font-bold mb-5 uppercase">
                  Download Kingschat Videos And Images Faster.
                </h1>

                <p className="text-sm sm:text-lg text-gray-50 mb-12 mt-3">
                  The first of it&apos;s kind online tool that unlocks the possibility to download beautiful images and
                  videos from KingsChat into your gallery and enjoy them offline.
            </p>
            
            <div className="flex items-center mb-4">
               <div className={`switch mr-2 ${isVideo ? 'justify-end' : 'justify-start'}`} onClick={()=> setIsVideo(!isVideo)}>
                <div className="switch_button">
                  {isVideo ? <HiOutlineVideoCamera /> : <BsImages />}
                </div>
              </div>
              <p className="text-white text-xs text-left">Please switch to the file type you want to download.</p>
            </div>
            {/* <div className="text-white text-left mt-1 text-sm">
              <p>Please switch to the file type you want to download.</p>
            </div> */}
            
            <div className="search">
              <input onChange={(evt) => setmediaUrl(evt.target.value)} value={mediaUrl} placeholder="Paste Link"
                className="text-gray-800 border-none rounded h-[50px] sm:h-full p-2 px-2 outline-none w-full mb-3 sm:mb-0 sm:bg-transparent" />
              <button onClick={() => isVideo ? fetchVideo(mediaUrl) : fetchImages(mediaUrl)} className="button">{
                fetchingMedia ? <SpinnerCircular color="white" thickness={ 200 } size={ 25 }/> : "King it Now"
              }</button>
            </div>

            
           
            
        </div>
        </div>

        {
          imageFiles.length > 0 ?
            <div className="sm:p-12 p-5 flex flex-wrap gap-5 justify-center">
            {
                  imageFiles.map(url =>
                      <div className="relative h-[30vh] w-[95vw] sm:w-[25vw] bg-red-400 rounded overflow-hidden" key={url}>
                        <Image src={url} alt="Image" className="object-cover pointer-events-none" layout="fill" />
                        <button onClick={() => download(url)} className="button-round absolute bottom-3 right-2">
                          <AiOutlineCloudDownload />
                        </button>
                      </div>
                  )
            }
            </div>
            : <div></div>
        }
        
        {
          videoFiles.length > 0 ?
            <div className="sm:p-12 p-5 flex flex-wrap gap-5 justify-center">
            {
                  videoFiles.map(url =>
                      <div className="relative sm:h-[60vh] sm:w-[60vw] w-[95vw] h-[35vh]  bg-black rounded overflow-hidden flx justify-center items-center" key={url}>
                        <video src={url} alt="Video" className="object-cover sm:h-[60vh] h-[35vh] m-auto" layout="fill" controls/>
                        <button onClick={() => download(url)} className="button-round absolute top-3 right-2">
                          <AiOutlineCloudDownload />
                        </button>
                      </div>
                  )
            }
            </div>
            : <div></div>
        }

        {/* <ProgressIndicator /> */}

      </main>
    </div>
  )
}
