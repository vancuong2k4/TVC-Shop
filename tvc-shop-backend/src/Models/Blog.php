<?php
class Blog {
    private $conn;
    private $table_name = "blogs";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $query = "SELECT b.id, b.title, b.slug, b.content, b.image_url, b.created_at, u.full_name as author_name 
                  FROM " . $this->table_name . " b
                  LEFT JOIN users u ON b.author_id = u.id
                  ORDER BY b.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT b.id, b.title, b.slug, b.content, b.image_url, b.created_at, u.full_name as author_name 
                  FROM " . $this->table_name . " b
                  LEFT JOIN users u ON b.author_id = u.id
                  WHERE b.id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function create($author_id, $title, $slug, $content, $image_url) {
        $query = "INSERT INTO " . $this->table_name . " (author_id, title, slug, content, image_url) VALUES (:author_id, :title, :slug, :content, :image_url)";
        $stmt = $this->conn->prepare($query);

        $title = htmlspecialchars(strip_tags($title));
        $slug = htmlspecialchars(strip_tags($slug));
        $image_url = htmlspecialchars(strip_tags($image_url));
        // Content might have HTML if using rich text, but we'll allow basic text or handle it safely in frontend.

        $stmt->bindParam(":author_id", $author_id);
        $stmt->bindParam(":title", $title);
        $stmt->bindParam(":slug", $slug);
        $stmt->bindParam(":content", $content);
        $stmt->bindParam(":image_url", $image_url);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
