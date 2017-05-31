// import React, { Component } from "react"
// import PropTypes from "prop-types"
// import Select from "react-select"
//
// export class AuthorModalForm extends Component {
//   constructor(props) {
//     super(props)
//
//     const invalidResearcherIds = this.props.authors.filter(a => a.researcherId).map(a => a.researcherId)
//
//     this.state = {
//       authors: this.props.authors,
//       author: this.props.author,
//       roles: this.props.roles,
//       researchers: this.props.researchers.filter(r => !invalidResearcherIds.find(invResId => invResId === r.id))
//     }
//
//   }
//
//   handleChange(e) {
//     let author = this.state.author
//     if (e === null) {
//       author["researcherId"] = null
//       author["researcherDesc"] = null
//
//       this.setState({...this.state, author: author})
//
//     } else if (e.target) {
//       author[e.target.name] = e.target.value
//       this.setState({ ...this.state, author: author })
//
//     } else {
//       author[e.field] = e.value
//       this.setState({ ...this.state, author: author })
//     }
//   }
// // <input type="text" className="form-control" id="email" name="email" placeholder="Email" onChange={this.handleChange.bind(this, "email")} />
//
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.author) {
//       const invalidResearcherIds = this.props.authors.filter(a => a.researcherId && (nextProps.author.researcherId !== a.researcherId)).map(a => a.researcherId)
//       this.setState({
//         ...this.state,
//         author: nextProps.author,
//         researchers: this.props.researchers.filter(r => !invalidResearcherIds.find(invResId => invResId === r.id))
//       })
//     }
//   }
//
//   render() {
//     const author = this.state.author
//     const roles = this.state.roles.map(x => { return { "id": x.id, "label": x.description, value: x.id, "field": "role", clearableValue: false } })
//     const researchers = this.state.researchers.map(x => { return { "id": x.id, "label": x.firstName + " " + x.lastName, value: x.id, "field": "researcherId" } })
//
//     return (
//       <div className="modal fade" id="myModal" role="dialog" aria-labelledby="myModalLabel">
//         <div className="modal-dialog" role="document">
//           <div className="modal-content">
//             <div className="modal-header">
//               <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//               <h4 className="modal-title" id="myModalLabel">Editar autor</h4>
//             </div>
//             <div className="modal-body">
//               <div className="project-form">
//                 <div className="row">
//                   <form className="form-horizontal">
//                     <div className="form-group">
//                       <label className="control-label col-md-2" htmlFor="email">Email:</label>
//                       <div className="col-md-9">
//                         <Select
//                           id="author"
//                           name="author"
//                           disabled
//                           options={this.props.authors.map(x => { return { "label": x.email, value: x.id } })}
//                           value={ author && {value: author.id, "label": author.email}}
//                           onChange={this.handleChange.bind(this)} />
//                       </div>
//                     </div>
//
//                     <div className="form-group">
//                       <label className="control-label col-md-2" htmlFor="signature">Autor:</label>
//                       <div className="col-md-9">
//                         <input type="text" className="form-control" id="signature" name="signature" placeholder="Autor" onChange={this.handleChange.bind(this)} value={(author && author.signature) || ""} />
//                       </div>
//                     </div>
//
//                     <div className="form-group">
//                       <label className="control-label col-md-2" htmlFor="role">Rol:</label>
//                       <div className="col-md-9">
//                         <Select
//                           id="role"
//                           clearable={false}
//                           name="role"
//                           options={roles}
//                           value={author && roles.find(x => x.id === author.role)}
//                           onChange={this.handleChange.bind(this)}
//                         />
//                       </div>
//                     </div>
//
//                     <div className="form-group">
//                       <label className="control-label col-md-2" htmlFor="researcher">Asociar:</label>
//                       <div className="col-md-9">
//                         <Select
//                           id="role"
//                           name="role"
//                           options={researchers}
//                           value={author && researchers.find(x => x.id === author.researcherId)}
//                           onChange={this.handleChange.bind(this)}
//                         />
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-default" data-dismiss="modal">Cancelar</button>
//               <button type="button" className="btn btn-primary" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onSaveAuthor(this.state.author)}>Guardar</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }
//
// AuthorModalForm.propTypes = {
//   author: PropTypes.object,
//
//   roles: PropTypes.array,
//   researchers: PropTypes.array,
//   authors: PropTypes.array,
//
//   onSaveAuthor: PropTypes.func
// }
