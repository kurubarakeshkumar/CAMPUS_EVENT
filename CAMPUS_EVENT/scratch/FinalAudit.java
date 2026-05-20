import java.sql.*;

public class FinalAudit {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://localhost:3306/campus_events";
        String user = "root";
        String pass = "Nithin@123";
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            DatabaseMetaData meta = conn.getMetaData();
            String[] tables = {"users", "feedbacks"};
            for (String table : tables) {
                System.out.println("\nColumns in table '" + table + "':");
                ResultSet rs = meta.getColumns("campus_events", null, table, null);
                while (rs.next()) {
                    String name = rs.getString("COLUMN_NAME");
                    String type = rs.getString("TYPE_NAME");
                    String nullable = rs.getString("IS_NULLABLE");
                    System.out.println("- " + name + " (" + type + "), Nullable: " + nullable);
                }
            }
        }
    }
}
