import React, { PropTypes } from 'react';

export default class DownloadForm extends React.Component {

  static propTypes = {
    title: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
  };

  render() {
    const {title,rows} = this.props;
    const filename="maccc_dg_download.csv";

    return <form
          ref={(c) => this._form = c}
          method="post"
          action="https://adhoc.rcc-acis.org/maccc_dg_download"
          style={{display:"none"}} >
        <input type="hidden" name="filename" value={filename} />
        <input type="hidden" name="headers" value={JSON.stringify(title)} />
        <input type="hidden" name="rows" value={JSON.stringify(rows)} />
      </form>
  }
}
