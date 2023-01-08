import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";

export const createConnection = (room, password) => (yDoc, startAwareness) => {
  const indexeddbProvider = new IndexeddbPersistence(room, yDoc, {
    password
  });
  const provider = new WebrtcProvider(room, yDoc);
  return () => {
    provider.destroy();
    indexeddbProvider.destroy();
  };
};

// import { WebrtcProvider } from "y-webrtc";
// const ID = +new Date();
// export const connectMembers = (yDoc, startAwareness) => {
//   console.log("connect ", yDoc.guid);
//   const provider = new WebrtcProvider(yDoc.guid, yDoc);
//   provider.awareness.setLocalState({
//     ID,
//     elementIndex: null
//   });
//   const stopAwareness = startAwareness(provider);
//   return () => {
//     console.log("disconnect", yDoc.guid);
//     stopAwareness();
//     provider.destroy();
//   };
// };
