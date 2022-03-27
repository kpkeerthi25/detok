import React,{useState} from "react";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { v1 as uuidv4 } from 'uuid';
import { v1 } from "uuid";
import ReactPlayer from 'react-player'
import { createPost } from "../post/create-post";


const CreateIpfsLink = (props) => {
    const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

    const [fileUrl, setFileUrl] = useState(null)
    console.log(fileUrl)
    const [formInput, updateFormInput] = useState({version:'1.0.0',
    metadata_id:"",
    attributes:[],
    appId:"detok",
     name:"",content:"", media:[{item:"", type:"video/mp4"}] })
    
    
  
    async function onChange(e) {
      const file = e.target.files[0]
      try {
        const added = await client.add(
          file,
          {
            progress: (prog) => console.log(`received: ${prog}`)
          }
        )
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(url)
        let id = uuidv4();
        console.log("id",id)
        updateFormInput({...formInput,metadata_id:id})
        updateFormInput({...formInput,media:[{item:url, type:"video/mp4"}]})
        
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }
    const ipfsUpload = async(obj)=> {
      
      obj.metadata_id= uuidv4();
      console.log(JSON.stringify(obj))
      let data = {
      }
      data.content=JSON.stringify(obj)
      const added = await client.add(
        data,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
      createPost(url)
    }
     return (
        <div className="flex flex-row justify-center">
      <div
          className=" flex pb-12"
          style={{ margin: '0 auto' }}
        >
      <input 
          placeholder="Post Name"
          className="mt-8 border rounded p-4"
          style={{flex:1,display:"flex", width:"75%",marginLeft:"15px"}}
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Post content"
          className="mt-2 border rounded p-4"
          style={{flex:1,display:"flex", width:"75%",marginLeft:"15px"}}
          onChange={e => updateFormInput({ ...formInput, content: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          style={{flex:1,display:"flex", width:"75%",marginLeft:"15px"}}
          onChange={onChange}
        />
        {
          fileUrl && (
            <ReactPlayer url={fileUrl} controls={true}/>

          )
        }
        <button onClick={()=> ipfsUpload(formInput)}  className="font-bold mt-4 btn-primary btn mx-5 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Digital Asset
        </button>
        {/* {contractResponse && JSON.stringify(contractResponse)} */}
      </div>
    </div>
    )
}

export default CreateIpfsLink;