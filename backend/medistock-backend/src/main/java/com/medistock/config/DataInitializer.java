package com.medistock.config;

import com.medistock.entity.User;
import com.medistock.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Optional;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE medicines DROP CONSTRAINT IF EXISTS medicines_rack_id_fkey");
                jdbcTemplate.execute("ALTER TABLE medicines ALTER COLUMN rack_id TYPE VARCHAR(50) USING rack_id::varchar");
            } catch (Exception e) {
                System.out.println("Could not alter rack_id column to VARCHAR: " + e.getMessage());
            }

            // Force-update or create Admin
            Optional<User> adminOpt = userRepository.findByUsername("admin");
            if (adminOpt.isEmpty()) {
                userRepository.save(new User("admin", passwordEncoder.encode("admin123"), "ADMIN"));
            } else {
                User admin = adminOpt.get();
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
            }

            // Force-update or create Staff
            Optional<User> staffOpt = userRepository.findByUsername("staff");
            if (staffOpt.isEmpty()) {
                userRepository.save(new User("staff", passwordEncoder.encode("staff123"), "STAFF"));
            } else {
                User staff = staffOpt.get();
                staff.setPassword(passwordEncoder.encode("staff123"));
                staff.setRole("STAFF");
                userRepository.save(staff);
            }
        };
    }
}
