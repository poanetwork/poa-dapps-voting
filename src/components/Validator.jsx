import React from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import { constants } from '../constants'

@inject('validatorStore', 'ballotStore')
@observer
export class Validator extends React.Component {
  onSelectAutocomplete = async data => {
    const { validatorStore } = this.props
    let place = await geocodeByAddress(data)
    console.log(place)
    let address_components = {
      postal_code: '',
      street_number: '',
      route: '',
      locality: '',
      administrative_area_level_1: ''
    }
    for (let i = 0; i < place[0].address_components.length; i++) {
      let address_component = place[0].address_components[i]
      let addressType = address_component.types[0]
      switch (addressType) {
        case 'postal_code':
          address_components.postal_code = address_component.short_name
          break
        case 'street_number':
          address_components.street_number = address_component.short_name
          break
        case 'route':
          address_components.route = address_component.short_name
          break
        case 'locality':
          address_components.locality = address_component.short_name
          break
        case 'administrative_area_level_1':
          address_components.administrative_area_level_1 = address_component.long_name
          break
        default:
          break
      }
      validatorStore.address = `${address_components.street_number} ${address_components.route} ${
        address_components.locality
      }`
      validatorStore.state = address_components.administrative_area_level_1
      validatorStore.zipCode = address_components.postal_code
    }
  }

  componentDidMount() {
    this.props.ballotStore.ballotKeys.miningKey = constants.NEW_MINING_KEY
  }

  componentWillUnmount() {
    const { ballotStore } = this.props
    if (JSON.stringify(ballotStore.ballotKeys.miningKey) === JSON.stringify(constants.NEW_MINING_KEY)) {
      ballotStore.ballotKeys.miningKey = ''
    }
  }

  render() {
    const { validatorStore } = this.props
    const inputProps = {
      value: validatorStore.address,
      onChange: e => validatorStore.changeValidatorMetadata(e, 'address'),
      id: 'address'
    }
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="custom-container">
        <strong>{formattedSuggestion.mainText}</strong> <small>{formattedSuggestion.secondaryText}</small>
      </div>
    )
    return (
      <div>
        <div className="hidden">
          <div className="left">
            <div className="form-el">
              <label htmlFor="full-name">Full Name</label>
              <input
                type="text"
                id="full-name"
                value={validatorStore.fullName}
                onChange={e => validatorStore.changeValidatorMetadata(e, 'fullName')}
              />
              <p className="hint">Proposed validator's full name. Example: Jefferson L. Flowers.</p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label htmlFor="address">Address</label>
              <PlacesAutocomplete
                onSelect={this.onSelectAutocomplete}
                inputProps={inputProps}
                autocompleteItem={AutocompleteItem}
              />
              <p className="hint">Proposed validator's registration address. Example: 110 Wall St., New York.</p>
            </div>
          </div>
          <div className="left">
            <div className="form-el">
              <label htmlFor="us-state">State</label>
              <Select
                id="us-state"
                value={validatorStore.state}
                onChange={e => validatorStore.changeValidatorMetadata(e, 'state')}
                options={[
                  { value: '', label: '' },
                  { value: 'Alabama', label: 'Alabama' },
                  { value: 'Alaska', label: 'Alaska' },
                  { value: 'Arizona', label: 'Arizona' },
                  { value: 'Arkanzas', label: 'Arkanzas' },
                  { value: 'California', label: 'California' },
                  { value: 'Colorado', label: 'Colorado' },
                  { value: 'Connecticut', label: 'Connecticut' },
                  { value: 'Delaware', label: 'Delaware' },
                  { value: 'Florida', label: 'Florida' },
                  { value: 'Georgia', label: 'Georgia' },
                  { value: 'Hawaii', label: 'Hawaii' },
                  { value: 'Idaho', label: 'Idaho' },
                  { value: 'Illinois', label: 'Illinois' },
                  { value: 'Indiana', label: 'Indiana' },
                  { value: 'Iowa', label: 'Iowa' },
                  { value: 'Kansas', label: 'Kansas' },
                  { value: 'Kentucky', label: 'Kentucky' },
                  { value: 'Louisianna', label: 'Louisianna' },
                  { value: 'Maine', label: 'Maine' },
                  { value: 'Maryland', label: 'Maryland' },
                  { value: 'Massachusetts', label: 'Massachusetts' },
                  { value: 'Michigan', label: 'Michigan' },
                  { value: 'Minnesota', label: 'Minnesota' },
                  { value: 'Mississippi', label: 'Mississippi' },
                  { value: 'Missouri', label: 'Missouri' },
                  { value: 'Montana', label: 'Montana' },
                  { value: 'Nebraska', label: 'Nebraska' },
                  { value: 'Nevada', label: 'Nevada' },
                  { value: 'New Hampshire', label: 'New Hampshire' },
                  { value: 'New Jersey', label: 'New Jersey' },
                  { value: 'New Mexico', label: 'New Mexico' },
                  { value: 'New York', label: 'New York' },
                  { value: 'North Carolina', label: 'North Carolina' },
                  { value: 'North Dakota', label: 'North Dakota' },
                  { value: 'Ohio', label: 'Ohio' },
                  { value: 'Oklahoma', label: 'Oklahoma' },
                  { value: 'Oregon', label: 'Oregon' },
                  { value: 'Pennsylvania', label: 'Pennsylvania' },
                  { value: 'Rhode Island', label: 'Rhode Island' },
                  { value: 'South California', label: 'South California' },
                  { value: 'South Dakota', label: 'South Dakota' },
                  { value: 'Tennessee', label: 'Tennessee' },
                  { value: 'Texas', label: 'Texas' },
                  { value: 'Utah', label: 'Utah' },
                  { value: 'Vermont', label: 'Vermont' },
                  { value: 'Virginia', label: 'Virginia' },
                  { value: 'Washington', label: 'Washington' },
                  { value: 'West Virginia', label: 'West Virginia' },
                  { value: 'Wisconsin', label: 'Wisconsin' },
                  { value: 'Wyoming', label: 'Wyoming' }
                ]}
              />
              <p className="hint">Proposed validator's US state. Example: New York.</p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label htmlFor="zip-code">Zip Code</label>
              <input
                type="text"
                id="zip-code"
                value={validatorStore.zipCode}
                onChange={e => validatorStore.changeValidatorMetadata(e, 'zipCode')}
              />
              <p className="hint">Proposed validator's postal code. Example: 10005.</p>
            </div>
          </div>
          <div className="left">
            <div className="form-el">
              <label htmlFor="license-id">License ID</label>
              <input
                type="text"
                id="license-id"
                value={validatorStore.licenseID}
                onChange={e => validatorStore.changeValidatorMetadata(e, 'licenseID')}
              />
              <p className="hint">Proposed validator's notary license ID. Example: 191947.</p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label htmlFor="license-expiration">License Expiration</label>
              <input
                type="date"
                id="license-expiration"
                value={validatorStore.licenseExpiration}
                onChange={e => validatorStore.changeValidatorMetadata(e, 'licenseExpiration')}
              />
              <p className="hint">When proposed validator's notary license is expired. Example: 11/10/2021.</p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    )
  }
}
