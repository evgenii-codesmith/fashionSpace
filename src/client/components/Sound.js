const Sound = require('react-sound').default;
import React from "react";

class Coldplay extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps) {
      return false;
  }

  render() {
    return (<Sound
      url="https://s1.vocaroo.com/media/download_temp/Vocaroo_s1rdGgP9ERN2.mp3"
      playStatus={Sound.status.PLAYING}
      playFromPosition={0 /* in milliseconds */}
      // autoLoad='true'
    />
  )
  }
}

export default Coldplay;