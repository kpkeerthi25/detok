import React, { useEffect,useState } from "react";
import ReactPlayer from "react-player";
import { searchPost} from "./search";
import LitJsSdk, { LIT_SVM_CHAINS } from 'lit-js-sdk'
import {changePosts,increment,decrement, changeRecom} from '../../features/counter/counterSlice'
import { useSelector, useDispatch } from "react-redux";
import * as faceapi from "face-api.js";
import { loadFaceDetectionModel } from "face-api.js";
import recommendationData from '../../data/recommendation.json'
// import lkeys from '../../data/lit_keys.json'

const DisplayPosts = (props) => {
    const minConfidence = 0.5;
    const faceBoundaries = true;
    const videoRef = React.createRef();
    const canvasRef = React.createRef();
    
      const [_faces, setFaces] = useState();
      let value = useSelector(state=>state.counter.value)
      let posts = useSelector((state) => state.counter.posts)
    let recommend = useSelector((state)=>state.counter.recommend)

    
    useEffect(async()=>{
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/");
        
        await faceapi.loadFaceLandmarkModel("/");
        await faceapi.loadFaceExpressionModel("/");
    },[])
      const loadModelsAndAll = async () => {
        // Load all needed models
        
        
        // get webcam running
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              facingMode: "user",
            },
          });
        } catch (err) {
          alert(
            "Sorry - Your Browser isn't allowing access to your webcam.  Try a different browser for this device?"
          );
          console.error("getUserMedia error", err);
        }
        videoRef.current.srcObject = stream;
        // Hanging the stream on a global, bc it kinda is a global
        // fight me
        window.streamStorage = stream;
        // hold until the camera loads
        return new Promise((resolve, _) => {
          videoRef.current.onloadedmetadata = () => {
            // Kick off right away
            detectFaceStuff();
            resolve();
          };
        });
      };
    
      const detectFaceStuff = async () => {
        const videoEl = videoRef.current;
        const canvas = canvasRef.current;
        const result = await faceapi
          .detectAllFaces(
            videoEl,
            new faceapi.SsdMobilenetv1Options({ minConfidence })
          )
          .withFaceExpressions();
        if (result && result.length > 0) {
          // Go turn all faces over minConfidence into strings
          const facialExpressions = result
            .map((r) => {
              if (r.detection.score > minConfidence)
                return Object.keys(r.expressions).reduce((a, b) =>
                  r.expressions[a] > r.expressions[b] ? a : b
                );
            })
            .toString();
    
          setFaces((oldFaces) => {
            // Update if changed
            if (facialExpressions !== oldFaces) {
              setEmotion(facialExpressions);
              if(facialExpressions=="happy"){
                  dispatch(changeRecom())
              }
              // update local
              return facialExpressions;
            } else {
              return oldFaces;
            }
          });
    
          // Display visual results
          // Might turn these off in the future, hence conditional
          if (faceBoundaries) {
            canvas.style.visibility = "visible";
            const dims = faceapi.matchDimensions(canvas, videoEl, true);
            const resizedResult = faceapi.resizeResults(result, dims);
            faceapi.draw.drawDetections(canvas, resizedResult);
            faceapi.draw.drawFaceExpressions(canvas, resizedResult, minConfidence);
          } else {
            canvas.style.visibility = "hidden";
          }
        }
    
        requestAnimationFrame(() => {
          // calm down when hidden!
          if (canvasRef.current) {
            detectFaceStuff();
          }
        });
      };
    
      async function setEmotion(emotion) {
        console.log("setting emotion to " + emotion);
        
      }
    
      useEffect(() => {
          loadModelsAndAll();
        // clean up the audience member
    
      }, [_faces]);
    
     
    const encrypt = async()=>{
        const lit = new LitJsSdk.LitNodeClient({
            alertWhenUnauthorized: false,
          });
        await lit.connect();
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: 'mumbai'})
        const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
            JSON.stringify(recommendationData)
          );
          console.log(encryptedString)
          const decryptedString = await LitJsSdk.decryptString(
            encryptedString, symmetricKey
          );
          console.log(decryptedString)
    }
    
    
    const dispatch = useDispatch();
    let request = {
        query: "detokCat",
        type: "PUBLICATION",
        limit: 10
      }
    useEffect(async()=>{
        let data = await searchPost(request);
        console.log("data");
        dispatch(changePosts(data.data.search.items))

    },[posts])
    // let data = await searchPost(request);
    
    return (
        <div>
 <h1>{posts.length}</h1>
 
 <div style={{display:"flex",flexDirection:"row", justifyContent:"center", alignItems:"center", textAlign:"center"}}>
 <button className="btn btn-primary" onClick={()=>{dispatch(decrement())}}>prev</button>
 <ReactPlayer style={{marginLeft:"50px",marginRight:"50px"}} url={posts.length>1?posts[value].metadata.media[0].original.url:""} width={"1080px"} height={"1000px"} controls={true}/>
 
 <button className="btn btn-primary" onClick={()=>{dispatch(increment())}}>next</button>
 </div>
 <button className="btn btn-primary" onClick={(()=>encrypt())}>update encrypted data</button>
 <section>
        <div id="captureContainer">
          <video
            ref={videoRef}
            id="inputVideo"
            className="captureBox"
            autoPlay
            muted
            playsInline
          ></video>
          <canvas  ref={canvasRef} className="captureBox" />
        </div>
      </section>
      
      <hr />
    </div>
       

        
    )
}

export default DisplayPosts;