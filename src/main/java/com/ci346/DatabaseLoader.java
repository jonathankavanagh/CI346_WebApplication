package com.ci346;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {
	WorkerRepository workerRepository;
	
	@Autowired
	public DatabaseLoader(WorkerRepository repository) {
		this.workerRepository = repository;
	}

	@Override
	public void run(String... strings) throws Exception {
		this.workerRepository.save(new Worker("Joe Bloggs", "Monday", "Morning", 09.00, 12.00));
		this.workerRepository.save(new Worker("Paul Smith", "Tuesday", "Evening", 15.00, 18.00));
		this.workerRepository.save(new Worker("Ted Green", "Wednesday", "Night", 20.00, 23.00));
	}
}