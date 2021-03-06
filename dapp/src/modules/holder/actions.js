import _ from 'lodash'
import Promise from 'bluebird'
import { LOAD_MODULE, CALL_FUNC } from './actionTypes'
import { getContractByAbiName, listenAddress } from '../../utils/web3'
import { submit as submitContract, send as sendContract, call as callContract } from '../dao/actions'

export function loadModule(holderAddress) {
  return (dispatch) => {
    let payload = {
      address: holderAddress
    }
    getContractByAbiName('InsuranceHolder', holderAddress)
      .then(contract => (
        Promise.join(
          contract.call('token'),
          contract.call('holdDuration'),
          (token, holdDuration) => (
            {
              token,
              holdDuration: _.toNumber(holdDuration)
            }
          )
        )
      ))
      .then((holder) => {
        payload = {
          ...payload,
          ...holder
        }
      })
      .then(() => getContractByAbiName('TokenEmission', payload.token))
      .then(contract => (
        Promise.join(
          contract.call('decimals'),
          contract.call('symbol'),
          contract.call('balanceOf', [holderAddress]),
          (decimalsR, symbol, balance) => {
            const decimalsFormat = _.toNumber(decimalsR)
            let decimals = decimalsFormat
            if (decimals > 0) {
              decimals = Math.pow(10, decimals)
            } else {
              decimals = 1
            }
            return (_.toNumber(balance) / decimals).toFixed(decimalsFormat) + ' ' + symbol
          }
        )
      ))
      .then((balance) => {
        dispatch({
          type: LOAD_MODULE,
          payload: {
            ...payload,
            balance
          }
        })
        listenAddress(holderAddress, 'loadModule', (address) => {
          dispatch(loadModule(address))
        })
      })
  }
}

export function submit(address, action, form) {
  return (dispatch) => {
    dispatch(submitContract('FormHolder', address, 'InsuranceHolder', action, form))
  }
}

export function send(address, action, values) {
  return (dispatch) => {
    sendContract(dispatch, address, 'InsuranceHolder', action, values)
  }
}

function normalResultCall(contract, action, result) {
  if (action === 'record') {
    return '<div>' +
        'Метка времени: ' + result[0] + ' (UNIX time)<br />' +
        'Величина взноса: ' + result[1] + '<br />' +
        'Состояние взноса: ' + ((result[2]) ? 'был выведен' : 'находится на балансе контракта') +
      '</div>'
  }
  return result.toString()
}

export function call(address, action, form) {
  return (dispatch) => {
    let contract
    getContractByAbiName('InsuranceHolder', address)
      .then((result) => {
        contract = result
        return callContract(dispatch, 'FormHolderFunc', contract, action, form)
      })
      .then((result) => {
        dispatch({
          type: CALL_FUNC,
          payload: {
            address,
            action,
            input: form,
            output: normalResultCall(contract, action, result)
          }
        })
      })
  }
}
