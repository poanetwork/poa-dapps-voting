import React from 'react'
import xDaiLogo from './xdai.svg'
import poaLogo from './core.svg'
import sokolLogo from './sokol.svg'
import kovanLogo from './kovan.svg'

const getLogoSrc = networkBranch => {
  return (
    {
      core: poaLogo,
      sokol: sokolLogo,
      dai: xDaiLogo,
      kovan: kovanLogo
    }[networkBranch] || poaLogo
  )
}

export const Loading = ({ networkBranch }) => {
  return (
    <div className={`ld-Loading ld-Loading-${networkBranch}`}>
      <img className={`ld-Loading_Image ld-Loading_Image-${networkBranch}`} src={getLogoSrc(networkBranch)} alt="" />
      <div className="ld-Loading_Animation">
        <div className="ld-Loading_AnimationItem" />
        <div className="ld-Loading_AnimationItem" />
        <div className="ld-Loading_AnimationItem" />
        <div className="ld-Loading_AnimationItem" />
        <div className="ld-Loading_AnimationItem" />
        <div className="ld-Loading_AnimationItem" />
      </div>
    </div>
  )
}
