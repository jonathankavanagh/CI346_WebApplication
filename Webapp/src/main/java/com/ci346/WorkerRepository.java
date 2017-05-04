package com.ci346;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface WorkerRepository extends PagingAndSortingRepository<Worker, Long> {}