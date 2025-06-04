import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'

export interface Markup {
  id: string
  text: string
  x: number
  y: number
  width: number
  height: number
  bgColor: string
  textColor: string
  fontSize: number
  borderRadius: number
  borderWidth: number
  borderColor: string
}

interface MarkupState {
  markups: Markup[]
  activeMarkupId: string | null
}

const initialState: MarkupState = {
  markups: [],
  activeMarkupId: null,
}

const markupSlice = createSlice({
  name: 'markup',
  initialState,
  reducers: {
    addMarkup: {
      reducer(state, action: PayloadAction<Markup>) {
        state.markups.push(action.payload)
        localStorage.setItem('current-markups', JSON.stringify(state.markups))
      },
      prepare() {
        return {
          payload: {
            id: nanoid(),
            text: 'Новая маркировка',
            x: 100,
            y: 100,
            width: 200,
            height: 150,
            bgColor: '#ffffff',
            textColor: '#000000',
            fontSize: 16,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#cccccc',
          },
        }
      },
    },
    updateMarkup(state, action: PayloadAction<Partial<Markup> & { id: string }>) {
      const { id, ...rest } = action.payload;
      const markup = state.markups.find((m) => m.id === id);
      if (markup) {
        Object.assign(markup, rest);
        localStorage.setItem('current-markups', JSON.stringify(state.markups));
      }
    },
    removeMarkup(state, action: PayloadAction<string>) {
      state.markups = state.markups.filter((m) => m.id !== action.payload);
      localStorage.setItem('current-markups', JSON.stringify(state.markups));
    },
    setActiveMarkup(state, action: PayloadAction<string | null>) {
      state.activeMarkupId = action.payload
    },
    loadMarkups(state) {
      const saved = localStorage.getItem('current-markups')
      if (saved) {
        state.markups = JSON.parse(saved) as Markup[]
      }
    }
  },
})

export const {
  addMarkup,
  updateMarkup,
  removeMarkup,
  setActiveMarkup,
  loadMarkups,
} = markupSlice.actions
export default markupSlice.reducer