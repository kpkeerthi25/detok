import React from 'react'
import { Route, BrowserRouter as Router, Link, Routes } from 'react-router-dom'
import { apolloClient } from '../../apollo-client'
import { gql } from '@apollo/client'
import { MoralisProvider, useMoralis } from 'react-moralis'
import Moralis from 'moralis'
import CustomNavbar from '../common/Navbar.js'
import { lensAuthenticate } from '../../lensAuthenticate'
import { generateChallenge } from '../../generate-challenge'
import { getAddress, signText } from '../../ethers-service';
import { useSelector,useDispatch } from 'react-redux'
import {changeAccessToken,changeAuth,changeAddress,changeRefreshToken,changeRecom} from "../../features/counter/counterSlice"
import { createPost } from '../post/create-post'
import CreateIpfsLink from '../common/create-ipfs-link'
import DisplayPosts from '../display-posts/displayPosts'
import ReactPlayer from 'react-player'

const Home = () => {

const isAuthenticated = useSelector((state)=>state.counter.isAuthenticated);
const address = useSelector((state)=>state.counter.address);
const dispatch = useDispatch();
  
  const login = async () => {
    // await Moralis.enableWeb3()
    // const user1 = await authenticate()
    // console.log(user1)
    // const address = await user1.get('ethAddress')
    // console.log(address)
    // const challengeResponse = await generateChallenge(address)
    // console.log(challengeResponse.data.challenge.text)
    // // sign the text with the wallet
    // const signature = await Moralis.authenticate({signingMessage:challengeResponse.data.challenge.text})
    // console.log(signature.attributes.authData.moralisEth.signature)
    // console.log(signature)
    // const accessTokens = await lensAuthenticate(address, signature.attributes.authData.moralisEth.signature)
    // console.log(accessTokens)
    const address = await getAddress();
  
  // we request a challenge from the server
  const challengeResponse = await generateChallenge(address);
  
  // sign the text with the wallet
  const signature = await signText(challengeResponse.data.challenge.text)
  
  const accessTokens = await lensAuthenticate(address, signature);
  console.log(accessTokens);
  localStorage.setItem('auth_token',accessTokens.data.authenticate.accessToken)
  dispatch(changeAccessToken(accessTokens.data.authenticate.accessToken));
  dispatch(changeAddress(address));
  dispatch(changeRefreshToken(accessTokens.data.authenticate.refreshToken));
  dispatch(changeAuth(true));
  }
  const logout = ()=> {
    dispatch(changeAccessToken(""));
    dispatch(changeAddress(""));
    dispatch(changeRefreshToken(""));
    dispatch(changeAuth(false));
    localStorage.removeItem("auth_token")
  }
  return (
    <div>
      <div>
        <CustomNavbar
          logout={logout}
          login={login}
          
        />
      </div>

      <div>
        <Router>
          <div>
            <nav className="px-3 " style={{ marginBottom: '30px' }}>
              <div className="flex mt-4 ">
                <Link to={{ pathname: '/' }}>
                  <a className="mx-4 text-info ">Home</a>
                </Link>
                <Link to={{ pathname: '/create' }}>
                  <a className="mx-4 text-info">CreatePost</a>
                </Link>
                
              </div>
            </nav>
            <hr></hr>
          </div>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  // <MyNfts add={user.get('ethAddress')} />
                  <DisplayPosts/>
                //   <div>
                //     <h1>logged</h1>{' '}
                //     <button className='btn btn-primary' onClick={()=>createPost()}>post</button>
                //   </div>
                ) : (
                  <div>
                    <h1>not logged in</h1>{' '}
                  </div>
                )
              }
            />
            <Route
                path="/create"
                element={
                  isAuthenticated ? (
                    <CreateIpfsLink />
                  ) : (
                    <div>
                      <h1>not logged in</h1>{' '}
                    </div>
                  )
                }
              />
              
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default Home
