import React from 'react'
import loadingImg from './loading.gif'

export const BaseLoader = () => {
  return (
    <div className={`ld-BaseLoader`}>
      <img className={`ld-BaseLoader_Image`} src={loadingImg} alt="" />
    </div>
  )
}
