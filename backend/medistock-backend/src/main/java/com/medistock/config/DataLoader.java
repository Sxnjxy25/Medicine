package com.medistock.config;

import com.medistock.entity.User;
import com.medistock.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default admin if not exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println(">>> Default ADMIN user created (admin / admin123)");
            }

            // Create default staff if not exists
            if (userRepository.findByUsername("staff").isEmpty()) {
                User staff = new User();
                staff.setUsername("staff");
                staff.setPassword(passwordEncoder.encode("staff123"));
                staff.setRole("STAFF");
                userRepository.save(staff);
                System.out.println(">>> Default STAFF user created (staff / staff123)");
            }

            // Print all users currently in the database to verify
            System.out.println("==================================================");
            System.out.println("CURRENT USERS IN DATABASE:");
            userRepository.findAll().forEach(user -> {
                System.out.println(" - Username: " + user.getUsername() + " | Role: " + user.getRole() + " | Password (Hashed): " + user.getPassword());
            });
            System.out.println("==================================================");
        };
    }
}
