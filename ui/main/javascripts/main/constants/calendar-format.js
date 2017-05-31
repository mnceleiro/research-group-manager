export const calendarFormat = {
  // dateFormat: "dd",
  dayFormat: (date, culture, localizer) =>
    localizer.format(date, "dddd", culture),

  weekdayFormat: (date, culture, localizer) => localizer.format(date, "dddd", culture),

  dayRangeHeaderFormat: ({ start, end }, culture, local) =>
    local.format(start, "LL", culture) + " - " + local.format(end, "LL", culture),

  dayHeaderFormat: (date, culture, localizer) =>
    localizer.format(date, "DDD", culture),

  monthHeaderFormat: (date, culture, localizer) => localizer.format(date, "LL", culture),
  agendaHeaderFormat: ({start, end}, culture, localizer) => localizer.format(start, "LL", culture) + " - " + localizer.format(end, "LL", culture)
}
