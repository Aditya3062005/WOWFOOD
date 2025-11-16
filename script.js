document.addEventListener('DOMContentLoaded', () => {
    // Get necessary elements from the HTML
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const orderForm = document.getElementById('orderForm');

    // 1. Mobile Menu Toggle (DOM Manipulation & Event Handling)
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked (better UX)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // 2. Smooth Scrolling (Event Handling)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Scroll to the target element defined in the href attribute
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Form Validation (Event Handling & DOM Manipulation)
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop the default form submission
            let isValid = true;

            // Simple validation function
            const validateField = (fieldId, errorId, message) => {
                const field = document.getElementById(fieldId);
                const errorElement = document.getElementById(errorId);

                // Check if field exists and if its trimmed value is empty
                if (field && field.value.trim() === '') {
                    errorElement.textContent = message;
                    isValid = false;
                } else if (field) {
                    errorElement.textContent = '';
                }
            };

            // Validate Name
            validateField('name', 'nameError', 'Please enter your name.');

            // Validate Email (Basic regex check)
            const emailField = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField) {
                if (!emailRegex.test(emailField.value.trim())) {
                    emailError.textContent = 'Please enter a valid email address.';
                    isValid = false;
                } else {
                    emailError.textContent = '';
                }
            }


            // Validate Order Details / Message
            validateField('order-details', 'orderDetailsError', 'Please provide order or reservation details.');

            if (isValid) {
                // Successful submission simulation (since no backend is attached)
                console.log('Form Submitted Successfully:', new FormData(orderForm));

                // Create and insert a success message (instead of using alert())
                const successMessage = document.createElement('div');
                successMessage.textContent = 'Success! Your inquiry has been sent.';
                successMessage.style.cssText = 'padding: 1rem; margin-top: 1rem; background-color: #10B981; color: white; border-radius: 0.5rem; text-align: center;';
                
                // Insert the message right after the form
                orderForm.parentNode.insertBefore(successMessage, orderForm.nextSibling);

                orderForm.reset(); // Clear the form
                
                // Remove success message after 5 seconds
                setTimeout(() => successMessage.remove(), 5000);
            }
        });
    }
});