import { signedTypeData, getAddressFromSigner, splitSignature } from '../../ethers-service';
import { createPostTypedData } from './create-post-typed-data';
import { lensHub } from '../../lens-hub';

export const createPost = async (uri) => {
  // hard coded to make the code example clear
  const createPostRequest = {
    profileId: "0x036e",
    contentURI: uri,
    "collectModule": {
        "emptyCollectModule": true
    },
    referenceModule: {
        followerOnlyReferenceModule: false
    }
  };
        
  const result = await createPostTypedData(createPostRequest);
  const typedData = result.data.createPostTypedData.typedData;
  
  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log(signature)
  const { v, r, s } = splitSignature(signature);
  console.log(v,r,s)
  const tx = await lensHub.postWithSig({
    profileId: typedData.value.profileId,
    contentURI:typedData.value.contentURI,
    collectModule: typedData.value.collectModule,
    collectModuleData: typedData.value.collectModuleData,
    referenceModule: typedData.value.referenceModule,
    referenceModuleData: typedData.value.referenceModuleData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log(tx.hash);
  // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
  // you can look at how to know when its been indexed here: 
  //   - https://docs.lens.dev/docs/has-transaction-been-indexed
}