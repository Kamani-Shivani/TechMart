# 🛒 TechMart
### Secure Full-Stack Product Management & Shopping System

TechMart is a secure full-stack product management and shopping web application built using Java, Spring Boot, and modern frontend technologies.

## 🚀 Features

- 🔐 User Login & Logout using Spring Security
- 📦 View all available products
- 🔍 Search products by name, description, brand, and category
- ➕ Add new products
- ✏️ Update existing products
- 🗑️ Delete products
- 🖼️ Upload and display product images
- 📄 View individual product details
- 🛒 Shopping Cart functionality
- 🔄 Frontend and backend communication using REST APIs
- 🗄️ Store product data using H2 Database
- 🔗 JPA/Hibernate for database operations

## 🛠️ Technologies Used

**Frontend:** HTML, CSS, JavaScript, Bootstrap  
**Backend:** Java, Spring Boot, REST APIs, Spring Security  
**Database:** H2  
**ORM:** JPA/Hibernate  
**Tools:** Maven, Postman, IntelliJ IDEA, VS Code

## 📂 Project Structure

```text
TechMart/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── css/
│   ├── js/
│   └── images/
│
└── backend/
    ├── src/
    ├── pom.xml
    └── ...
```
## REST API Operations
| Method | Endpoint                  | Purpose               |
| ------ | ------------------------- | --------------------- |
| GET    | `/api/products`           | Get all products      |
| GET    | `/api/products/{id}`      | Get product by ID     |
| POST   | `/api/product`            | Add a product         |
| PUT    | `/api/product/{id}`       | Update a product      |
| DELETE | `/api/product/{id}`       | Delete a product      |
| GET    | `/api/product/search`     | Search products       |
| GET    | `/api/product/{id}/image` | Display product image |

## 🔐 Security
Spring Security is used to protect the application's backend APIs.
Users must log in through the frontend before accessing the protected product operations.

## 🗄️ Product Information

Each product contains information such as:

- Product name
- Brand
- Description
- Price
- Category
- Release date
- Availability
- Quantity
- Product image
  
## ▶️ How to Run
Backend
- Open the `backend` folder in IntelliJ IDEA.
- Make sure Maven dependencies are loaded.
- Run the Spring Boot application.
- The backend runs on `http://localhost:8080`.

Frontend
- Open the `frontend` folder in VS Code.
- Run `login.html` using Live Server.
- Login to access the application.
- Use the product management and shopping features.
  
## 🧪 API Testing

The REST APIs are tested using Postman, including:

- GET
- POST
- PUT
- DELETE
- Search
- Image retrieval

## 📚 Key Concepts Used
- Spring Boot REST API development
- Spring Security
- CRUD operations
- JPA/Hibernate
- H2 Database
- Multipart file and image handling
- REST API integration
- Frontend-backend communication
- Maven
- Postman API testing

## 👩‍💻 Author
Kamani Shivani
