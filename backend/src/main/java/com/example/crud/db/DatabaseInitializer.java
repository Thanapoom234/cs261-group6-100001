package com.example.crud.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @EventListener(ContextRefreshedEvent.class)
    public void onApplicationEvent() {
        String[] alterStatements = {
                "ALTER TABLE requests ALTER COLUMN academic_year NVARCHAR(50);",
                "ALTER TABLE requests ALTER COLUMN address_number NVARCHAR(50);",
                "ALTER TABLE requests ALTER COLUMN advisor NVARCHAR(100);",
                "ALTER TABLE requests ALTER COLUMN comment NVARCHAR(255);",
                "ALTER TABLE requests ALTER COLUMN course_code NVARCHAR(20);",
                "ALTER TABLE requests ALTER COLUMN course_name NVARCHAR(255);",
                "ALTER TABLE requests ALTER COLUMN debt_amount NVARCHAR(50);",
                "ALTER TABLE requests ALTER COLUMN debt_status NVARCHAR(50);",
                "ALTER TABLE requests ALTER COLUMN district NVARCHAR(100);",
                "ALTER TABLE requests ALTER COLUMN first_name NVARCHAR(50);",
                "ALTER TABLE requests ALTER COLUMN last_name NVARCHAR(50);",
                "ALTER TABLE requests ALTER COLUMN major NVARCHAR(100);",
                "ALTER TABLE requests ALTER COLUMN parent_phone NVARCHAR(20);",
                "ALTER TABLE requests ALTER COLUMN province NVARCHAR(100);",
                "ALTER TABLE requests ALTER COLUMN recipient NVARCHAR(255);",
                "ALTER TABLE requests ALTER COLUMN request_type NVARCHAR(50);",
                "ALTER TABLE requests ALTER COLUMN section NVARCHAR(10);",
                "ALTER TABLE requests ALTER COLUMN semester NVARCHAR(10);",
                "ALTER TABLE requests ALTER COLUMN start_academic_year NVARCHAR(50);",
                "ALTER TABLE requests ALTER COLUMN start_semester NVARCHAR(10);",
                "ALTER TABLE requests ALTER COLUMN status NVARCHAR(50);",
                "ALTER TABLE requests ALTER COLUMN student_id NVARCHAR(20);",
                "ALTER TABLE requests ALTER COLUMN student_phone NVARCHAR(20);",
                "ALTER TABLE requests ALTER COLUMN sub_district NVARCHAR(100);",
                "ALTER TABLE requests ALTER COLUMN subject NVARCHAR(255);"
        };

        for (String sql : alterStatements) {
            try {
                jdbcTemplate.execute(sql);
            } catch (Exception e) {
                System.out.println("Error executing SQL: " + sql + " - " + e.getMessage());
            }
        }
    }
}
