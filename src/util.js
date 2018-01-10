export function throttle(callback, wait=0, context = this) {
  let timeout = null
  let callbackArgs = null

  const later = () => {
    callback.apply(context, callbackArgs)
    timeout = null
  }

  function throttled() {
    if (!timeout) {
      callbackArgs = arguments
      timeout = setTimeout(later, wait)
    }
  }

  throttled.setWait = (newWait) => {
    wait = newWait;
  };

  return throttled;
}
