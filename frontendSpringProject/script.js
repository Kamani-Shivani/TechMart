// ============================================
// BACKEND API
// ============================================

const API_URL = "http://localhost:8080/api/products";

const AUTH = sessionStorage.getItem("auth");

if (!AUTH) {
    window.location.href = "login.html";
}

// ============================================
// VARIABLES
// ============================================

let allProducts = [];

let cart = [];

// Currently selected product
let selectedProduct = null;


// ============================================
// LOAD PRODUCTS FROM SPRING BOOT
// ============================================

function loadProducts() {

    // Show loading
    document
        .getElementById("loading")
        .classList
        .remove("d-none");

    // Hide error
    document
        .getElementById("errorMessage")
        .classList
        .add("d-none");
    
    // Hide Products heading and Refresh button
    document
        .getElementById("productsHeader")
        .classList
        .add("d-none");


    fetch(API_URL, {
        headers: {
            "Authorization": "Basic " + AUTH
        }
    })

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to connect to backend");
            }

            return response.json();

        })

        .then(products => {

            console.log("Products received:", products);

            allProducts = products;

            // Show Products heading and Refresh button
            document
                .getElementById("productsHeader")
                .classList
                .remove("d-none");

            displayProducts(products);

        })

        .catch(error => {

            console.error(error);

            // CLEAR ALL OLD PRODUCTS

            document
                .getElementById("productContainer")
                .innerHTML = "";

            // Hide "No products found"
            document
                .getElementById("noProducts")
                .classList
                .add("d-none");

            // Hide product details
            document
                .getElementById("productDetails")
                .classList
                .add("d-none");

            // Hide Products heading and Refresh button
            document
                .getElementById("productsHeader")
                .classList
                .add("d-none");

            // SHOW ERROR MESSAGE

            document.getElementById("errorMessage").innerHTML = `

                    <h5 class="text-danger">
                        Unable to load products
                    </h5>

                    <p class="text-light mb-0">
                        Make sure Spring Boot is running.
                    </p>

            `;

            document
                .getElementById("errorMessage")
                .classList
                .remove("d-none");

        })

        .finally(() => {

            document
                .getElementById("loading")
                .classList
                .add("d-none");

        });
}


// ============================================
// DISPLAY PRODUCTS
// ============================================

function displayProducts(products) {

    const container =
        document.getElementById("productContainer");

    const noProducts =
        document.getElementById("noProducts");


    // Clear previous products

    container.innerHTML = "";


    // No products

    if (products.length === 0) {

        noProducts.classList.remove("d-none");

        return;

    }


    noProducts.classList.add("d-none");


    // Create cards

    products.forEach(product => {

        const card = `

            <div class="col-12 col-sm-6 col-md-4 col-lg-3">

                <div class="card product-card bg-dark text-light border border-info shadow-sm"
                            onclick="showProductDetails(${product.id})"
                            style="cursor: pointer;">

                    <div class="card-body">

                        <!-- Product Image -->

                        <div class="text-center mb-3">

                            <img
                                src="${getProductImage(product)}"
                                alt="${product.name}"
                                class="product-image">

                        </div>


                        <!-- Product name -->

                        <h5 class="card-title text-uppercase text-info">

                            ${product.name}

                        </h5>


                        <!-- Brand -->

                        <p class="product-brand text-light">

                            by <i class="text-warning">${product.brand}</i>

                        </p>



                        <!-- Category -->

                        <span class="badge bg-info text-dark mb-2">

                            ${product.category}

                        </span>


                        <!-- Description -->

                        <p class="product-description text-light">

                            ${product.desc}

                        </p>


                        <!-- Price -->

                        <p class="product-price text-warning fw-bold">

                            ₹${product.price}

                        </p>


                        <!-- Availability -->

                        <p>

                            ${
                                product.available

                                ? '<span class="badge bg-success">Available</span>'

                                : '<span class="badge bg-danger">Out of Stock</span>'
                            }

                        </p>


                        <!-- Quantity -->

                        <p class="small text-light">

                            Quantity: ${product.quantity}

                        </p>


                        <!-- Add to cart -->

                        <button

                            class="btn btn-warning text-dark fw-bold w-100"

                            ${
                                !product.available
                                ? "disabled"
                                : ""
                            }

                             onclick="event.stopPropagation(); addToCart(${product.id})">

                            Add To Cart

                        </button>

                    </div>

                </div>

            </div>

        `;


        container.innerHTML += card;

    });

}


// ============================================
// PRODUCT ICON
// ============================================

function getProductIcon(category) {

    if (!category) {
        return "📦";
    }


    switch (category.toLowerCase()) {

        case "mobile":
            return "📱";

        case "laptop":
            return "💻";

        case "headphones":
            return "🎧";

        case "television":
            return "📺";

        default:
            return "📦";
    }

}


// ============================================
// PRODUCT IMAGE
// ============================================

function getProductImage(product) {

    return `http://localhost:8080/api/product/${product.id}/image`;

}



// ============================================
// SEARCH PRODUCTS
// ============================================

function searchProducts() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .trim();

    // If search box is empty, show all products
    if (keyword === "") {

        displayProducts(allProducts);

        return;
    }

    fetch(
        `http://localhost:8080/api/product/search?keyword=${encodeURIComponent(keyword)}`,
        {
            headers: {
                "Authorization": "Basic " + AUTH
            }
        }
    )

    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to search products");
        }

        return response.json();

    })

    .then(products => {

        console.log("Search results:", products);

        displayProducts(products);

    })

    .catch(error => {

        console.error("Search error:", error);

    });

}


// ============================================
// SHOW ADD PRODUCT PAGE
// ============================================

function showAddProduct(event) {

    event.preventDefault();


    // Hide products
    document
        .getElementById("productContainer")
        .style.display = "none";

    // Hide no products message
    document
        .getElementById("noProducts")
        .classList
        .add("d-none");

    // Hide product details
    document
        .getElementById("productDetails")
        .classList
        .add("d-none");


    // Hide products heading
    document
        .getElementById("productsHeader")
        .classList
        .add("d-none");


    // Hide error
    document
        .getElementById("errorMessage")
        .classList
        .add("d-none");


    // Show Add Product form
    document
        .getElementById("addProductSection")
        .classList
        .remove("d-none");

}



// ============================================
// ADD PRODUCT
// ============================================

document
    .getElementById("addProductForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        // ========================================
        // GET VALUES FROM FORM
        // ========================================

        const product = {

            name:
                document
                    .getElementById("productName")
                    .value,

            brand:
                document
                    .getElementById("productBrand")
                    .value,

            desc:
                document
                    .getElementById("productDescription")
                    .value,

            price:
                document
                    .getElementById("productPrice")
                    .value,

            category:
                document
                    .getElementById("productCategory")
                    .value,

            quantity:
                document
                    .getElementById("productQuantity")
                    .value,

            releaseDate:
                document
                    .getElementById("productReleaseDate")
                    .value,

            available:
                document
                    .getElementById("productAvailable")
                    .checked

        };


        // ========================================
        // GET IMAGE
        // ========================================

        const imageFile =
            document
                .getElementById("productImage")
                .files[0];


        console.log("Product to add:", product);
        console.log("Image:", imageFile);


        // ========================================
        // CREATE FORM DATA
        // ========================================

        const formData = new FormData();


        // Add product JSON

        formData.append(
            "product",
            new Blob(
                [JSON.stringify(product)],
                {
                    type: "application/json"
                }
            )
        );


        // Add image

        if (imageFile) {

            formData.append(
                "imageFile",
                imageFile
            );

        }


        // ========================================
        // SEND TO SPRING BOOT
        // ========================================

        fetch("http://localhost:8080/api/product", {

            method: "POST",

            headers: {
                "Authorization": "Basic " + AUTH
            },

            body: formData

        })

        .then(response => {

            if (!response.ok) {

                return response.text().then(error => {

                    throw new Error(error);

                });

            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Product added:",
                data
            );


            alert(
                "Product added successfully!"
            );


            // Clear form

            document
                .getElementById("addProductForm")
                .reset();


            // Hide Add Product form

            document
                .getElementById("addProductSection")
                .classList
                .add("d-none");


            // Show Products heading

            document
                .getElementById("productsHeader")
                .classList
                .remove("d-none");


            // Show products

            document
                .getElementById("productContainer")
                .style.display = "flex";


            // Reload products from backend

            loadProducts();

        })

        .catch(error => {

            console.error(
                "Add product error:",
                error
            );


            alert(
                "Unable to add product: " +
                error.message
            );

        });

    });



// ============================================
// UPDATE PRODUCT FORM SUBMIT
// ============================================

document
    .getElementById("updateProductForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        // ========================================
        // GET UPDATED PRODUCT DATA
        // ========================================

        const updatedProduct = {

            name:
                document
                    .getElementById("updateProductName")
                    .value,

            brand:
                document
                    .getElementById("updateProductBrand")
                    .value,

            desc:
                document
                    .getElementById("updateProductDescription")
                    .value,

            price:
                document
                    .getElementById("updateProductPrice")
                    .value,

            category:
                document
                    .getElementById("updateProductCategory")
                    .value,

            quantity:
                document
                    .getElementById("updateProductQuantity")
                    .value,

            releaseDate:
                selectedProduct.releaseDate,

            available:
                document
                    .getElementById("updateProductAvailable")
                    .checked

        };


        // ========================================
        // GET NEW IMAGE
        // ========================================

        const imageFile =
            document
                .getElementById("updateProductImage")
                .files[0];


        // ========================================
        // CREATE FORM DATA
        // ========================================

        const formData = new FormData();


        // Add JSON product

        formData.append(
            "product",
            new Blob(
                [JSON.stringify(updatedProduct)],
                {
                    type: "application/json"
                }
            )
        );


        // Add image ONLY if selected

        if (imageFile) {

            formData.append(
                "imageFile",
                imageFile
            );

        }


        // ========================================
        // SEND PUT REQUEST
        // ========================================

        fetch(
            `http://localhost:8080/api/product/${selectedProduct.id}`,
            {
                method: "PUT",

                headers: {
                    "Authorization": "Basic " + AUTH
                },

                body: formData
            }
        )

        .then(response => {

            if (!response.ok) {

                return response.text()
                    .then(error => {
                        throw new Error(error);
                    });

            }

            return response.text();

        })

        .then(data => {

            console.log(
                "Product updated:",
                data
            );


            alert(
                "Product updated successfully!"
            );


            // Reset form

            document
                .getElementById("updateProductForm")
                .reset();


            // Hide update form

            document
                .getElementById("updateProductSection")
                .classList
                .add("d-none");


            // Clear selected product

            selectedProduct = null;


            // Show products

            document
                .getElementById("productContainer")
                .style.display = "flex";


            // Reload products

            loadProducts();

        })

        .catch(error => {

            console.error(
                "Update error:",
                error
            );


            alert(
                "Unable to update product: " +
                error.message
            );

        });

    });
    


// ============================================
// FILTER BY CATEGORY
// ============================================

function filterCategory(category) {

    // Hide Add Product form
    document
        .getElementById("addProductSection")
        .classList
        .add("d-none");

    // Hide Product Details
    document
        .getElementById("productDetails")
        .classList
        .add("d-none");

    // Hide Error Message
    document
        .getElementById("errorMessage")
        .classList
        .add("d-none");

    // Show Products Header
    document
        .getElementById("productsHeader")
        .classList
        .remove("d-none");

    // Show Products
    document
        .getElementById("productContainer")
        .style.display = "flex";

    // Show all products
    if (category === "All") {

        displayProducts(allProducts);

        return;
    }

    // Filter by category
    const filteredProducts =
        allProducts.filter(product =>
            product.category &&
            product.category.toLowerCase() === category.toLowerCase()
        );

    displayProducts(filteredProducts);
}


// ============================================
// SHOW PRODUCT DETAILS
// ============================================

function showProductDetails(productId) {

    // SHOW LOADING

    document
        .getElementById("loading")
        .classList
        .remove("d-none");


    // CALL BACKEND FOR SELECTED PRODUCT

    fetch(`${API_URL}/${productId}`, {
        headers: {
                "Authorization": "Basic " + AUTH
            }
    })
        .then(response => {
            console.log("Product ID:", productId);
            console.log("API URL:", `${API_URL}/${productId}`);
            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error("Unable to load product details");
            }

            return response.json();

        })

        .then(product => {

            console.log("Product details received:", product);

            // Store the currently selected product
            selectedProduct = product;

            console.log("detailIcon:", document.getElementById("detailIcon"));
            console.log("detailName:", document.getElementById("detailName"));
            console.log("detailBrand:", document.getElementById("detailBrand"));
            console.log("detailId:", document.getElementById("detailId"));
            console.log("detailReleaseDate:", document.getElementById("detailReleaseDate"));
            console.log("detailCategory:", document.getElementById("detailCategory"));
            console.log("detailDescription:", document.getElementById("detailDescription"));
            console.log("detailPrice:", document.getElementById("detailPrice"));
            console.log("detailQuantity:", document.getElementById("detailQuantity"));
            console.log("detailAvailability:", document.getElementById("detailAvailability"));

            // DISPLAY PRODUCT INFORMATION

            // Product Image
            document
                .getElementById("detailImage")
                .src =
                getProductImage(product);

            document
                .getElementById("detailImage")
                .alt =
                product.name;


            // Product name
            document
                .getElementById("detailName")
                .innerText =
                product.name;


            // Brand
            document
                .getElementById("detailBrand")
                .innerHTML =
                `by <i>${product.brand}</i>`;


            // Product ID
            document
                .getElementById("detailId")
                .innerText =
                product.id;


            // Release Date
            document
                .getElementById("detailReleaseDate")
                .innerText =
                product.releaseDate;


            // Category
            document
                .getElementById("detailCategory")
                .innerText =
                product.category;


            // Description
            document
                .getElementById("detailDescription")
                .innerText =
                product.desc;


            // Price
            document
                .getElementById("detailPrice")
                .innerText =
                product.price;


            // Quantity
            document
                .getElementById("detailQuantity")
                .innerText =
                product.quantity;


            // ============================================
            // AVAILABILITY
            // ============================================

            const availability =
                document.getElementById("detailAvailability");


            if (product.available) {

                availability.innerHTML =
                    '<span class="badge bg-success">Available</span>';

            }
            else {

                availability.innerHTML =
                    '<span class="badge bg-danger">Out of Stock</span>';

            }


            // ============================================
            // HIDE PRODUCT LIST
            // ============================================

            document
                .getElementById("productContainer")
                .style.display =
                "none";


            // ============================================
            // SHOW PRODUCT DETAILS
            // ============================================

            document
                .getElementById("productDetails")
                .classList
                .remove("d-none");

        })


        // ============================================
        // HANDLE ERROR
        // ============================================

        .catch(error => {

            console.error("Product details error:", error);

            // CLEAR ALL PRODUCTS

            document
                .getElementById("productContainer")
                .innerHTML = "";

            document
                .getElementById("noProducts")
                .classList
                .add("d-none");

            // Hide product details
            document
                .getElementById("productDetails")
                .classList
                .add("d-none");
            
            // Hide Products heading and Refresh button
            document
                .getElementById("productsHeader")
                .classList
                .add("d-none");


            // SHOW ERROR MESSAGE

            document.getElementById("errorMessage").innerHTML = `
                    <h5 class="text-danger">
                        Unable to load products details
                    </h5>

                    <p class="text-light mb-0">
                        Make sure Spring Boot is running.
                    </p>
                `;

            document
                .getElementById("errorMessage")
                .classList
                .remove("d-none");

        })


        // ============================================
        // HIDE LOADING
        // ============================================

        .finally(() => {

            document
                .getElementById("loading")
                .classList
                .add("d-none");

        });

}


// ============================================
// SHOW UPDATE PRODUCT FORM
// ============================================

function updateProduct() {

    if (!selectedProduct) {
        return;
    }


    // Hide product details

    document
        .getElementById("productDetails")
        .classList
        .add("d-none");


    // Hide product list

    document
        .getElementById("productContainer")
        .style.display = "none";


    // Hide no products

    document
        .getElementById("noProducts")
        .classList
        .add("d-none");


    // Hide products header

    document
        .getElementById("productsHeader")
        .classList
        .add("d-none");


    // Show update form

    document
        .getElementById("updateProductSection")
        .classList
        .remove("d-none");


    // ========================================
    // FILL EXISTING PRODUCT DATA
    // ========================================

    document.getElementById("updateProductName").value =
        selectedProduct.name;

    document.getElementById("updateProductBrand").value =
        selectedProduct.brand;

    document.getElementById("updateProductDescription").value =
        selectedProduct.desc;

    document.getElementById("updateProductPrice").value =
        selectedProduct.price;

    document.getElementById("updateProductCategory").value =
        selectedProduct.category;

    document.getElementById("updateProductQuantity").value =
        selectedProduct.quantity;

    document.getElementById("updateProductAvailable").checked =
        selectedProduct.available;

}


// ============================================
// DELETE PRODUCT
// ============================================

function deleteProduct() {

    // Make sure a product is selected
    if (!selectedProduct) {
        return;
    }

    const productId = selectedProduct.id;

    // Confirm delete
    const confirmDelete =
        confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) {
        return;
    }

    // ============================================
    // DELETE FROM BACKEND
    // ============================================

    fetch(
        `http://localhost:8080/api/product/${productId}`,
        {
            method: "DELETE",

            headers: {
                "Authorization": "Basic " + AUTH
            }
        }
    )

    .then(response => {

        if (!response.ok) {

            return response.text()
                .then(error => {
                    throw new Error(error);
                });

        }

        return response.text();

    })

    .then(data => {

        console.log("Product deleted:", data);

        alert("Product deleted successfully!");

        // Remove product from frontend array
        allProducts =
            allProducts.filter(
                product => product.id !== productId
            );

        // Clear selected product
        selectedProduct = null;

        // Hide product details
        document
            .getElementById("productDetails")
            .classList
            .add("d-none");

        // Show products header
        document
            .getElementById("productsHeader")
            .classList
            .remove("d-none");

        // Show product container
        document
            .getElementById("productContainer")
            .style.display = "flex";

        // Display updated products
        displayProducts(allProducts);

        // Reload products from backend
        loadProducts();

    })

    .catch(error => {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Unable to delete product: " +
            error.message
        );

    });

}


// ============================================
// GO BACK TO PRODUCTS
// ============================================

function goBackToProducts() {

    // Hide product details

    document
        .getElementById("productDetails")
        .classList
        .add("d-none");


    // Hide Add Product form

    document
        .getElementById("addProductSection")
        .classList
        .add("d-none");


    // Hide Update Product form

    document
        .getElementById("updateProductSection")
        .classList
        .add("d-none");


    // Show products

    document
        .getElementById("productContainer")
        .style.display = "flex";


    // Show Products header

    document
        .getElementById("productsHeader")
        .classList
        .remove("d-none");


    // Hide error

    document
        .getElementById("errorMessage")
        .classList
        .add("d-none");


    // Display products

    displayProducts(allProducts);

}


// ============================================
// ADD TO CART
// ============================================

function addToCart(productId) {

    const product =
        allProducts.find(
            product => product.id === productId
        );


    if (!product) {
        return;
    }


    cart.push(product);


    updateCartCount();


    alert(product.name + " added to cart!");

}


// ============================================
// UPDATE CART COUNT
// ============================================

function updateCartCount() {

    document
        .getElementById("cartCount")
        .innerText = cart.length;

}


// ============================================
// SHOW CART
// ============================================

function showCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="text-center">

                <p>
                    Your cart is empty.
                </p>

            </div>

        `;

        cartTotal.innerText = "0";

    }


    else {

        let total = 0;


        cart.forEach(product => {

            total += Number(product.price);


            cartItems.innerHTML += `

                <div
                    class="d-flex justify-content-between
                           border-bottom pb-2 mb-2">

                    <span>
                        ${product.name}
                    </span>

                    <strong>
                        ₹${product.price}
                    </strong>

                </div>

            `;

        });


        cartTotal.innerText = total;

    }


    const modal =
        new bootstrap.Modal(
            document.getElementById("cartModal")
        );


    modal.show();

}


// ============================================
// CLEAR CART
// ============================================

function clearCart() {

    cart = [];

    updateCartCount();

    showCart();

}


// ============================================
// LOAD PRODUCTS WHEN PAGE OPENS
// ============================================

loadProducts();


// ================================
// Logout
// ================================
function logout() {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("username");

    window.location.href = "login.html";
}
