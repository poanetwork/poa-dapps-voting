import React from 'react'

const styles = netId => {
  const core = {
    backgroundColor: 'rgba(78,44,137, 0.9)'
  }
  const sokol = {
    backgroundColor: 'rgba(47, 109, 99, 0.8)'
  }

  switch (netId) {
    case '77':
    case '79':
      return sokol
    case '99':
    case '100':
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
