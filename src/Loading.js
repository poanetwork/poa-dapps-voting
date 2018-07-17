import React from 'react'
const styles = netId => {
  const core = {
    backgroundColor: 'rgba(35, 29, 115, 0.8)'
  }
  const sokol = {
    backgroundColor: 'rgba(47, 109, 99, 0.8)'
  }
  switch (netId) {
    case '77':
      return sokol
    case '99':
      return core
    default:
      return {}
  }
}
const Loading = ({ netId }) => (
  <div className="loading-container" style={styles(netId)}>
    <div className="loading">
      <div className="loading-i" />
      <div className="loading-i" />
      <div className="loading-i" />
      <div className="loading-i" />
      <div className="loading-i" />
      <div className="loading-i" />
    </div>
  </div>
)
export default Loading
