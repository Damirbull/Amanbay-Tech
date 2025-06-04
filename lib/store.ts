import { configureStore } from '@reduxjs/toolkit'
import markupReducer from '@/slices/markupSlice';



export const makeStore = () => {
  return configureStore({
    reducer: {
      markup: markupReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']