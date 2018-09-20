import { observable } from 'mobx'

class BallotsStore {
  @observable ballotCards

  constructor() {
    this.ballotCards = []
  }
}

const ballotsStore = new BallotsStore()

export default ballotsStore
export { BallotsStore }
