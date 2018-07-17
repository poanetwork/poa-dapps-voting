import { observable, action } from 'mobx'

class ValidatorStore {
  @observable fullName
  @observable address
  @observable state
  @observable zipCode
  @observable licenseID
  @observable licenseExpiration

  constructor() {
    this.fullName = ''
    this.address = ''
    this.state = ''
    this.zipCode = ''
    this.licenseID = ''
    this.licenseExpiration = ''
  }

  @action('change validator metadata')
  changeValidatorMetadata = (e, field) => {
    this[field] = e ? (e.target ? e.target.value : e.value ? e.value : e) : ''
    console.log('validator metadata', field, this[field])
  }
}

const validatorStore = new ValidatorStore()

export default validatorStore
export { ValidatorStore }
