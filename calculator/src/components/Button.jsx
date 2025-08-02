import React from 'react'

const Button = (classname, onHandleClick, nameVal, value, calc) => {
  return (
    <>
      <button
      className={classname} onClick={onHandleClick} name={nameVal}>
        {value}
      </button>

    </>
  )
}

export default Button
