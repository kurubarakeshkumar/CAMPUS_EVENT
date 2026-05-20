import java.sql.*;

public class CleanDB {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://localhost:3306/campus_events";
        String user = "root";
        String pass = "Nithin@123";
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            Statement stmt = conn.createStatement();
            
            // Drop redundant duplicate columns
            System.out.println("Dropping redundant columns...");
            String[] toDrop = {
                "event_department", "event_description", "event_title", 
                "event_venue", "event_type", "location", "type"
            };
            for (String col : toDrop) {
                try {
                    stmt.execute("ALTER TABLE events DROP COLUMN " + col);
                    System.out.println("Dropped: " + col);
                } catch (Exception e) {
                    System.out.println("Skip (missing or error): " + col);
                }
            }
            
            // Re-add standard columns if missing and make them nullable
            System.out.println("Updating standard columns to be nullable...");
            String[] queries = {
                "ALTER TABLE events MODIFY title VARCHAR(255) NULL",
                "ALTER TABLE events MODIFY department VARCHAR(255) NULL",
                "ALTER TABLE events MODIFY description TEXT NULL",
                "ALTER TABLE events MODIFY venue VARCHAR(255) NULL",
                "ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type VARCHAR(255) NULL",
                "ALTER TABLE events MODIFY event_type VARCHAR(255) NULL"
            };
            for (String q : queries) {
                try {
                    stmt.execute(q);
                    System.out.println("Executed: " + q);
                } catch (Exception e) {
                    System.out.println("Error on: " + q + " - " + e.getMessage());
                }
            }
            System.out.println("Database cleanup complete!");
        }
    }
}
