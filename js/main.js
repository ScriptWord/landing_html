// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Process Steps Animation
    const processSteps = document.querySelectorAll('.process-step');
    
    if (processSteps.length > 0) {
        // Add animation when scrolling to the process section
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    processObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        processSteps.forEach(step => {
            processObserver.observe(step);
        });
    }

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for the sticky header
                    behavior: 'smooth'
                });
            }
        });
    });

    // WhatsApp Functionality
    const whatsappButtons = document.querySelectorAll('.whatsapp-button, .whatsapp-mini');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // You can replace this with your actual WhatsApp number and message
            const phoneNumber = button.getAttribute('href').split('wa.me/')[1];
            const message = 'Hello, I need help with translation services.';
            
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        });
    });

    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Quote Form File Upload Handling
    const fileInput = document.getElementById('file-upload');
    const fileInfo = document.querySelector('.file-info');
    
    if (fileInput && fileInfo) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                fileInfo.textContent = fileInput.files.length + ' file(s) selected';
            } else {
                fileInfo.textContent = 'No files selected';
            }
        });
    }
    
    // Quote Form Submission
    const quoteForm = document.getElementById('quote-request-form');
    const formMessage = document.querySelector('.form-message');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = quoteForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            try {
                const formData = new FormData(quoteForm);
                
                // Send form data to the Cloudflare Worker
                const response = await fetch('/api/submit-quote', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                // Display success or error message
                if (result.success) {
                    formMessage.textContent = 'Thank you! Your quote request has been submitted successfully.';
                    formMessage.style.color = '#4caf50';
                    quoteForm.reset();
                    document.querySelector('.file-info').textContent = 'No files selected';
                } else {
                    formMessage.textContent = result.message || 'There was an error submitting your request. Please try again.';
                    formMessage.style.color = '#f44336';
                }
            } catch (error) {
                console.error('Error:', error);
                formMessage.textContent = 'There was an error submitting your request. Please try again.';
                formMessage.style.color = '#f44336';
            } finally {
                formMessage.style.display = 'block';
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // Banner form quote button
    const bannerQuoteBtn = document.querySelector('.subscribe-form button');
    if (bannerQuoteBtn) {
        bannerQuoteBtn.addEventListener('click', function(e) {
            // Stop form submission if it's in a form
            e.preventDefault();
            
            // Scroll to the quote form section
            const quoteFormSection = document.getElementById('quote-form');
            if (quoteFormSection) {
                window.scrollTo({
                    top: quoteFormSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Focus on the first input field
                setTimeout(() => {
                    const firstInput = quoteFormSection.querySelector('input[name="name"]');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 1000);
            }
        });
    }
}); 