import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from './reducers/navigation'

export default configureStore({
  reducer: {
    navigation: navigationReducer,
  },
})