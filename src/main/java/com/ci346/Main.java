package com.ci346;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
public class Main {

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}
	
	//Presentation Layer
	@Controller
	public class ViewController {
		@RequestMapping(value = "/")
		public String index() {
			return "index";
		}
	}
}