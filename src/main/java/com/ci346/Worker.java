package com.ci346;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class Worker {
	
	@Id @GeneratedValue
	private Long worker_id;
	private String name, period, day;
	private Double startTime, endTime;

	private Worker() {}

	public Worker(String name, String day, String period, Double startTime, Double endTime) {
		this.setName(name);
		this.setDay(day);
		this.setStartTime(startTime);
		this.setEndTime(endTime);
		this.setPeriod(period);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	public String getDay() {
		return day;
	}

	public void setDay(String day) {
		this.day = day;
	}

	public Double getStartTime() {
		return startTime;
	}

	public void setStartTime(Double startTime) {
		this.startTime = startTime;
	}

	public Double getEndTime() {
		return endTime;
	}

	public void setEndTime(Double endTime) {
		this.endTime = endTime;
	}
}
