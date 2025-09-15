package com.spendif.spendif;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.spendif.spendif")
@EntityScan(basePackages = "com.spendif.spendif.models")
@EnableJpaRepositories(basePackages = "com.spendif.spendif.repositories")
public class SpendifApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpendifApplication.class, args);
    }
}
