import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import shallowEqualScalar from 'react-redux/lib/utils/shallowEqualScalar'
import * as stnActions from '../actions/stnActions';

function mapParams (paramKeys, params) {
  return paramKeys.reduce((acc, key) => {
    return Object.assign({}, acc, { [key]: params[key] })
  }, {})
}

export default function fetchOnUpdate (paramKeys, fn) {

  return DecoratedComponent =>
  class FetchOnUpdateDecorator extends React.Component {

    static propTypes = {
      dispatch: PropTypes.func.isRequired
    }

    componentWillMount () {
      const actions = bindActionCreators(stnActions, this.props.dispatch)
      fn(mapParams(paramKeys, this.props.params), actions)
    }

    componentDidUpdate (prevProps) {
      const params = mapParams(paramKeys, this.props.params)
      const prevParams = mapParams(paramKeys, prevProps.params)
      const actions = bindActionCreators(stnActions, prevProps.dispatch)

      if (!shallowEqualScalar(params, prevParams))
        fn(params, actions)
    }

    render () {
      return (
        <DecoratedComponent {...this.props} />
      )
    }
  }
}
