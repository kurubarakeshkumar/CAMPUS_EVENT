import java.sql.*;

public class CheckDB {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://localhost:3306/campus_events";
        String user = "root";
        String pass = "Nithin@123";
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            DatabaseMetaData meta = conn.getMetaData();
            
            System.out.println("Columns in table 'registrations':");
            ResultSet rs2 = meta.getColumns("campus_events", null, "registrations", null);
            while (rs2.next()) {
                String name = rs2.getString("COLUMN_NAME");
                String type = rs2.getString("TYPE_NAME");
                String nullable = rs2.getString("IS_NULLABLE");
                System.out.println("- " + name + " (" + type + "), Nullable: " + nullable);
            }
        }
    }
}
