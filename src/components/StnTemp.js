import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router';
import fetchOnUpdate from '../decorators/fetchOnUpdate';
import * as stnActions from '../actions/stnActions';
import StnParameters from './StnParameters';
import StnChart from './StnChart';
import styles from './App.css';

@connect(state => ({
  station: state.station
}))
@fetchOnUpdate([ 'element', 'season', 'sid'], (params, actions) => {
  const { element, season, sid } = params
  if (element && season && sid) {
    actions.fetchStnResults(params);
  }
})
export default class StnTemp extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    children: PropTypes.any,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    console.log("StnTemp did mount");
    // let elem = React.findDOMNode(this);
    // const rect = elem.getClientRects()[0];
    // console.log("elem: "+rect.width+' '+rect.height);

  }

  updateParams(newParams) {
    const {element,season,sid} = {...this.props.params, ...newParams}
    const newurl = ['/StnTemp',element,season,sid].join('/');
    this.context.router.transitionTo(newurl);
  }

  render () {
    console.log('StnTemp render');
    return (
      <div className={styles.chart}>
        <div className={styles.chartInput}>
          <StnParameters
            className={styles.paramForm}
            shownElems={['maxt', 'mint', 'avgt']}
            update={::this.updateParams}
            {...this.props}
          />
          <div className={styles.miniMap} />
        </div>
        <StnChart
          className={styles.chartOutput}
          {...this.props}
        />
      </div>
    )
  }
}

