import React from 'react'
import * as models from 'src/models'

export default class Test extends React.Component {

  handleClick = () => {
    //eslint-disable-next-line
    console.log(models)
  }

  render () {
    return (
      <div>
        <div onClick={this.handleClick}>Test</div>
      </div>
    )
  }
}
