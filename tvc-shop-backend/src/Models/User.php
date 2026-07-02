<?php
class User {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($email, $password, $full_name, $phone) {
        $query = "INSERT INTO " . $this->table_name . " (email, password, full_name, phone) VALUES (:email, :password, :full_name, :phone)";
        $stmt = $this->conn->prepare($query);

        $email = htmlspecialchars(strip_tags($email));
        $full_name = htmlspecialchars(strip_tags($full_name));
        $phone = htmlspecialchars(strip_tags($phone));
        // Mã hóa mật khẩu (Password Hash BCRYPT)
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $password_hash);
        $stmt->bindParam(":full_name", $full_name);
        $stmt->bindParam(":phone", $phone);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function emailExists($email) {
        $query = "SELECT id, email, password, full_name, role FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $email);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function getById($id) {
        $query = "SELECT id, email, full_name, phone, address, dob, gender, role, created_at FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function updateProfile($id, $data) {
        $query = "UPDATE " . $this->table_name . " SET full_name = :full_name, phone = :phone, address = :address, dob = :dob, gender = :gender";
        
        if (!empty($data->password)) {
            $query .= ", password = :password";
        }
        $query .= " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $full_name = htmlspecialchars(strip_tags($data->full_name));
        $phone = htmlspecialchars(strip_tags($data->phone));
        $address = htmlspecialchars(strip_tags($data->address));
        $dob = !empty($data->dob) ? $data->dob : null;
        $gender = !empty($data->gender) ? $data->gender : null;

        $stmt->bindParam(":full_name", $full_name);
        $stmt->bindParam(":phone", $phone);
        $stmt->bindParam(":address", $address);
        $stmt->bindParam(":dob", $dob);
        $stmt->bindParam(":gender", $gender);
        $stmt->bindParam(":id", $id);

        if (!empty($data->password)) {
            $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
            $stmt->bindParam(":password", $password_hash);
        }

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
