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
                  { value: 'Alabama', label: 'Alabama' },
                  { value: 'Florida', label: 'Florida' },
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
