import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation'
import * as Tweakpane from 'tweakpane'
import { addPanelEntry, navigate, selectPanel } from './nav'
import css from './index.css?inline'
import { storage } from '../lib/storage'

const style = document.createElement('style')
style.innerHTML = css
document.head.append(style)

export type Pane = Tweakpane.Pane | Tweakpane.FolderApi

let isVisible = true

const selectedPane = storage.get('selectedPane')

export let pane: Pane

export const state = {
  controlling: false,
}

export const createPane = (container?: HTMLElement) => {
  const newPane = new Tweakpane.Pane({ container })
  newPane.registerPlugin(EssentialsPlugin)
  newPane.registerPlugin(RotationPlugin)
  return newPane
}

export const addPane = (title: string, container) => {
  const newPane = createPane(container)

  addPanelEntry(title, newPane)

  if (selectedPane === title) {
    selectPanel(title)
  }

  return newPane
}

const setUncontrolled = () => {
  state.controlling = false
}

const setControlled = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  state.controlling = true
  target.addEventListener('mouseup', setUncontrolled, { once: true, passive: true })
}

// document.addEventListener('keypress', (event) => {
//   if (!event.shiftKey) {
//     return
//   }

//   switch (event.key.toLowerCase()) {
//   case 'a':
//     root.classList.toggle('visible', !isVisible)
//     isVisible = !isVisible
//     return

//   case '~':
//     navigate(-1)
//     return

//   case '!':
//     navigate(+1)
//   }
// })
