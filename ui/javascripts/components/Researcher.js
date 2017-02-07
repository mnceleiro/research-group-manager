import React from 'react';

class Researcher extends React.Component {
  constructor(props) {
    super(props)
    this.state = { researcher: null }
  }
  
  componentWillMount() {
    fetch('researchers/get/1')
      .then((resp) => {
        return resp.json()
      
      }).then((researcher) => {
        this.setState({ researcher: researcher})
      })
  }
  
	render() {
	  if (this.state.researcher == null) {
	    return (
        return <p className="text-center">Cargando investigador...</p>
      ) 
	  } else {
  		return(
  			<tr>
  			  <td>Marcos</td>
  			  <td>Nunez Celeiro</td>
  			  <td>29</td>
			  </tr>
  		)
	  }
	}
}