import java.sql.*;

public class CleanRegistrationsDB {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://localhost:3306/campus_events";
        String user = "root";
        String pass = "Nithin@123";
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            Statement stmt = conn.createStatement();
            
            System.out.println("Cleaning up registrations table constraints...");
            // Make registration_time nullable to satisfy the requirement
            String[] queries = {
                "ALTER TABLE registrations MODIFY registration_time DATETIME NULL",
                "ALTER TABLE registrations MODIFY registration_date DATETIME NULL"
            };
            for (String q : queries) {
                try {
                    stmt.execute(q);
                    System.out.println("Executed: " + q);
                } catch (Exception e) {
                    System.out.println("Error on: " + q + " - " + e.getMessage());
                }
            }
            System.out.println("Registrations table cleanup complete!");
        }
    }
}
