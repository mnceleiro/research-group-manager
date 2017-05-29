import { connect } from "react-redux"
import { fetchAuthors as getAll, createAuthor as create, editAuthor as edit } from "../../actions/author-actions"
import { fetchResearchers } from "../../actions/researcher-actions"

import RGMMainTable from "../app_generic/RGMMainTable"

let mapStateToProps = store => {
  return {
    objects: store.authorState.authors.map(a => {
      const r = store.researcherState.researchers.find(r => r.id === a.researcherId)

      if (r) return Object.assign({}, a, { researcherDesc: r.firstName + " " + r.lastName})
      else return a

    }),
    table: store.authorState.table,
    entityTable: store.authorState.entityTableName,
    entityString: store.authorState.entityString,
    isFetching: store.authorState.isFetching || store.researcherState.isFetching
  }
}

let mapDispatchToProps = dispatch => {
  return {
    getAll: () => {
      dispatch(getAll())
    },
    getAllSecondary: () => {
      dispatch(fetchResearchers())
    },
    create: () => {
      dispatch(create())
    },
    onEdit: (id) => {
      dispatch(edit(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RGMMainTable)
