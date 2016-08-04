/*
UploadApp App container (smart component) in charge of connecting React to the
store/state and transforming the state in a way that can be used by the
UploadAppButton component.
  -Renders UploadAppButton
*/
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { uploadCSV } from '../actions/expensesActions.js'
const Dropzone = require('react-dropzone');

export default class UploadApp extends Component {

  constructor(props){
    super(props)
    this.onDrop = this.onDrop.bind(this)
  }

  onDrop(files){
    files.forEach((file) => {
       this.props.uploadCSV(file);
       console.log('file sent through onDrop', file);
    });
  }

  render () {
    return (
      <div>
        <Dropzone className="dropzone" onDrop={this.onDrop}>
          <div> Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
      </div>
    );
  }
}

UploadApp.PropTypes = {
  uploadCSV: PropTypes.func.isRequired
}

export default connect(
  (state) => {
    const { expenses, isFetching } = state.expensesReducer
    return {
      expenses: expenses,
      isFetching: isFetching
    }
  },
  {
    uploadCSV: uploadCSV
  }
)(UploadApp)
