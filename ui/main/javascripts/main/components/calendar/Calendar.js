import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import BigCalendar from "react-big-calendar"
import moment from "moment"

import { fetchCongresses } from "../../actions/congress-actions"
import { fetchProjects } from "../../actions/project-actions"

import { calendarFormat } from "../../constants/calendar-format"
import { calendarMessages } from "../../constants/calendar-culture"

import { showNotificationBetweenDates, removeAll } from "../../utils/NotificationUtils"
import { LoadingModal } from "../html_extended/modals/Modal"

let views = ["month", "agenda", ]

export class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showNotifications: false,
    }
  }
  componentWillMount() {
    this.props.fetchProjects()
    this.props.fetchCongresses()
  }

  componentWillUnmount() {
    removeAll()
  }

  componentWillReceiveProps() {
    if (this.props.data.length > 0) {
      this.setState({
        ...this.state,
        showNotifications: !this.state.showNotifications
      })
    }
  }

  getCalendarArray(data) {
    let calendarArray = []
    data.forEach(x => {
      if (moment.utc(x.start).diff(moment.utc(x.end)) === 0) {
        calendarArray.push({
          "title": x.title,
          "titleOriginal": x.title,
          "start": x.start,
          "end": x.end,
          "entity": x.entity,
          "type": "normal"
        })
      } else {
        if (x.start !== null && moment(x.start).isValid()) {
          calendarArray.push({
            "title": "Inicio " + x.title,
            "titleOriginal": x.title,
            "start": x.start,
            "end": x.start,
            "entity": x.entity,
            "type": "start"
          })
        }
        if (x.end !== null && moment(x.end).isValid()) {
          calendarArray.push({
            "title": "Fin " + x.title,
            "titleOriginal": x.title,
            "start": x.end,
            "end": x.end,
            "entity": x.entity,
            "type": "end"
          })
        }
      }
    })
    let toret = calendarArray.sort((x,y) => {
      return moment.utc(x.start).diff(moment.utc(y.start))
    })

    return toret
  }

  render() {
    const data = this.props.data

    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

    if (data.length === 0 || this.props.isFetching) {
      return <LoadingModal isOpen={this.props.isFetching} />
    } else {
      // Divido fechas de inicio y fin
      let calendarArray = this.getCalendarArray(data)

      if (calendarArray.length > 0 && this.state.showNotifications) {

        calendarArray.slice(0, (calendarArray.length > 3 ? 3 : calendarArray.length)).map(x => {

          showNotificationBetweenDates(x.titleOriginal, x.entity, x.type, x.start)
        })
      }

      let defaultDate = calendarArray.length > 0 ? calendarArray[0].start : new Date()
      return (
        <div className="row">
          <div className="col-md-offset-1 col-md-9">
            <div className="table-responsive">
              <BigCalendar
                messages={calendarMessages}
                formats={calendarFormat}
                events={calendarArray}
                culture="es-ES"
                onSelectEvent={this.onSelectEvent}
                views={views}
                defaultView="month"
                defaultDate={defaultDate}
              />
            </div>
          </div>
        </div>
      )
    }
  }
}

Calendar.propTypes = {
  data: PropTypes.array,
  isFetching: PropTypes.bool,
  fetchProjects: PropTypes.func,
  fetchCongresses: PropTypes.func
}

let mapStateToProps = store => {
  return {
    isFetching: store.projectState.isFetching || store.congressState.isFetching,
    projects: store.projectState.projects,
    congresses: store.congressState.congresses,
    data: [
      ...store.projectState.projects.map(x => { x.entity = "project"; return x }),
      ...store.congressState.congresses.map(x => { x.entity = "congress"; return x })

    ].map(x => {
      const data = {
        "title": x.title,
        "entity": x.entity,
        "start": moment(x.startDate, "DD/MM/YYYY").toDate(),
        "end": moment(x.endDate, "DD/MM/YYYY").toDate(),
      }

      return data
    })
  }
}

let mapDispatchToProps = dispatch => {
  return {
    fetchProjects: () => {
      dispatch(fetchProjects())
    },
    fetchCongresses: () => {
      dispatch(fetchCongresses())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
