package models.entities

import java.util.Date

case class Project(id: Long, code: String, public: Boolean, financier: String, startDate: Date, endDate: Date, price: BigDecimal)