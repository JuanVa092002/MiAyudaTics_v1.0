/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css' {
  const content: string
  export default content
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module 'react-modal' {
  import type { ComponentType, ReactNode } from 'react'

  interface ModalProps {
    isOpen: boolean
    onRequestClose?: () => void
    children?: ReactNode
    className?: string
    overlayClassName?: string
    contentLabel?: string
    ariaHideApp?: boolean
  }

  const Modal: ComponentType<ModalProps>
  export default Modal
}
