import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js';    // this is for the default export from userSlice
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({user: userReducer})

const persistConfig={
  key:'root',
  storage,
  version:1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

// we want that the user dont get logged out when we refresh the page so we store its ingo on the local storage so we created a combined or rootreducer and persisted it in the local storage and passed that as reducer

export const store = configureStore({
  reducer: persistedReducer,  // previouusly we had reducer: {user: userReducer} 
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware({
    serializableCheck:false,
  }),
});


export const persistor= persistStore(store);