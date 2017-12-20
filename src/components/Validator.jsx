import React from 'react';
import { inject, observer } from "mobx-react";
import Select from 'react-select';

@inject("validatorStore")
@observer
export class Validator extends React.Component {
  render() {
    const { validatorStore } = this.props;
    return (
      <div>
        <div className="hidden">
          <div className="left">
            <div className="form-el">
              <label for="full-name">Full Name</label>
              <input type="text" id="full-name" 
                value={validatorStore.fullName} 
                onChange={e => validatorStore.changeValidatorMetadata(e, "fullName")}
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label for="address">Address</label>
              <input type="text" id="address" 
                value={validatorStore.address} 
                onChange={e => validatorStore.changeValidatorMetadata(e, "address")}
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="left">
            <div className="form-el">
              <label for="us-state">State</label>
              <Select id="us-state"
                value={validatorStore.state}
                onChange={e => validatorStore.changeValidatorMetadata(e, "state")}
                options={[
                  { value: '', label: '' },
                  { value: "Alabama", label:  "Alabama" },
                  { value: "Alaska", label:  "Alaska" },
                  { value: "Arizona", label:  "Arizona" },
                  { value: "Arkanzas", label:  "Arkanzas" },
                  { value: "California", label:  "California" },
                  { value: "Colorado", label:  "Colorado" },
                  { value: "Connecticut", label:  "Connecticut" },
                  { value: "Delaware", label:  "Delaware" },
                  { value: "Florida", label:  "Florida" },
                  { value: "Georgia", label:  "Georgia" },
                  { value: "Hawaii", label:  "Hawaii" },
                  { value: "Idaho", label:  "Idaho" },
                  { value: "Illinois", label:  "Illinois" },
                  { value: "Indiana", label:  "Indiana" },
                  { value: "Iowa", label:  "Iowa" },
                  { value: "Kansas", label:  "Kansas" },
                  { value: "Kentucky", label:  "Kentucky" },
                  { value: "Louisianna", label:  "Louisianna" },
                  { value: "Maine", label:  "Maine" },
                  { value: "Maryland", label:  "Maryland" },
                  { value: "Massachusetts", label:  "Massachusetts" },
                  { value: "Michigan", label:  "Michigan" },
                  { value: "Minnesota", label:  "Minnesota" },
                  { value: "Mississippi", label:  "Mississippi" },
                  { value: "Missouri", label:  "Missouri" },
                  { value: "Montana", label:  "Montana" },
                  { value: "Nebraska", label:  "Nebraska" },
                  { value: "Nevada", label:  "Nevada" },
                  { value: "New Hampshire", label:  "New Hampshire" },
                  { value: "New Jersey", label:  "New Jersey" },
                  { value: "New Mexico", label:  "New Mexico" },
                  { value: "New York", label:  "New York" },
                  { value: "North Carolina", label:  "North Carolina" },
                  { value: "North Dakota", label:  "North Dakota" },
                  { value: "Ohio", label:  "Ohio" },
                  { value: "Oklahoma", label:  "Oklahoma" },
                  { value: "Oregon", label:  "Oregon" },
                  { value: "Pennsylvania", label:  "Pennsylvania" },
                  { value: "Rhode Island", label:  "Rhode Island" },
                  { value: "South California", label:  "South California" },
                  { value: "South Dakota", label:  "South Dakota" },
                  { value: "Tennessee", label:  "Tennessee" },
                  { value: "Texas", label:  "Texas" },
                  { value: "Utah", label:  "Utah" },
                  { value: "Vermont", label:  "Vermont" },
                  { value: "Virginia", label:  "Virginia" },
                  { value: "Washington", label:  "Washington" },
                  { value: "West Virginia", label:  "West Virginia" },
                  { value: "Wisconsin", label:  "Wisconsin" },
                  { value: "Wyomi", label:  "Wyomi" }
                ]}
              >
              </Select>
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label for="zip-code">Zip Code</label>
              <input type="number" id="zip-code" 
                value={validatorStore.zipCode} 
                onChange={e => validatorStore.changeValidatorMetadata(e, "zipCode")}
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="left">
            <div className="form-el">
              <label for="license-id">License ID</label>
              <input type="text" id="license-id" 
                value={validatorStore.licenseID} 
                onChange={e => validatorStore.changeValidatorMetadata(e, "licenseID")}
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label for="license-expiration">License Expiration</label>
              <input type="date" id="license-expiration" 
                value={validatorStore.licenseExpiration} 
                onChange={e => validatorStore.changeValidatorMetadata(e, "licenseExpiration")}
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}
