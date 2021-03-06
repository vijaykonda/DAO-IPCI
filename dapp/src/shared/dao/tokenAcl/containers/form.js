import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import i18next from 'i18next'
import { submit } from '../../../../modules/tokenAcl/actions';
import Form from '../../../components/common/form';

function mapStateToProps(state, props) {
  if (props.action === 'transfer' || props.action === 'approve') {
    return {
      fields: ['address', 'value', 'isIpfs'],
      selects: {},
      labels: [i18next.t('tokenAcl:formAddress'), i18next.t('tokenAcl:formAmount')],
      placeholders: ['0x111111111111111', '1'],
      autocomplete: {
        address: true
      }
    }
  } else if (props.action === 'emission') {
    return {
      fields: ['value', 'isIpfs'],
      selects: {},
      labels: [i18next.t('tokenAcl:formAmount')],
      placeholders: ['10']
    }
  } else if (props.action === 'setPeriod') {
    return {
      fields: ['value'],
      selects: {},
      labels: [i18next.t('tokenAcl:formSetPeriod')],
      placeholders: ['10']
    }
  }
  return {}
}
function mapDispatchToProps(dispatch, props) {
  return {
    onSubmit: bindActionCreators(form => submit(props.address, props.action, form), dispatch)
  }
}
export default reduxForm({
  form: 'FormTokenAcl'
}, mapStateToProps, mapDispatchToProps)(Form)
