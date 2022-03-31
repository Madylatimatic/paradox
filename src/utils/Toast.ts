/* eslint-disable no-async-promise-executor */
const init = () => {
  // NO support in Web Animation API
  if (!document.body.animate) {
    return null
  }
  // create toast container
  const node = document.createElement('section')
  node.classList.add('toast-group')
  document.firstElementChild?.insertBefore(node, document.body)
  return node
}

const createToast = (text: string) => {
  // create toast content
  const node = document.createElement('output')
  node.innerText = text
  node.classList.add('toast')
  node.setAttribute('role', 'status')
  node.setAttribute('aria-live', 'polite')
  return node
}

const addToast = (toast: HTMLElement) => {
  Toaster.children.length && Toaster.animate ? flipToast(toast) : Toaster.appendChild(toast)
}

const Toast = (text: string) => {
  // fallback
  if (Toaster === null) {
    return Promise.resolve(alert(text))
  }
  const toast = createToast(text)
  addToast(toast)
  return new Promise<void>(async (resolve) => {
    await Promise.allSettled(toast.getAnimations().map((animation) => animation.finished))
    Toaster.removeChild(toast)
    resolve()
  })
}

// https://aerotwist.com/blog/flip-your-animations/
const flipToast = (toast: HTMLElement) => {
  // FIRST
  const first = Toaster.offsetHeight

  // add new child to change container size
  Toaster.appendChild(toast)

  // LAST
  const last = Toaster.offsetHeight

  // INVERT
  const invert = last - first

  // PLAY
  const animation = Toaster.animate(
    [{ transform: `translateY(${invert}px)` }, { transform: 'translateY(0)' }],
    {
      duration: 150,
      easing: 'ease-out'
    }
  )

  animation.startTime = document.timeline.currentTime
}

const Toaster = init()!
export default Toast
