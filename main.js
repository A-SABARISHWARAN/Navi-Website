// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Add scroll animation to elements
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-left, .slide-in-right, .zoom-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    // Initial animation check
    animateOnScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const timing = performance.getEntriesByType('navigation')[0];
            if (timing) {
                console.log(`Page loaded in ${timing.domContentLoadedEventEnd - timing.fetchStart}ms`);
                
                // Report to backend if needed
                if (timing.loadEventEnd - timing.fetchStart > 2000) {
                    console.warn('Page load exceeded 2-second target');
                }
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading state to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-loading')) return;
            
            // Only show loading for forms
            if (this.type === 'submit' || this.getAttribute('type') === 'submit') {
                const originalText = this.innerHTML;
                this.classList.add('btn-loading');
                this.innerHTML = `
                    <span class="loading"></span>
                    <span style="margin-left: 8px">Processing...</span>
                `;
                
                // Reset after 3 seconds if still loading
                setTimeout(() => {
                    this.classList.remove('btn-loading');
                    this.innerHTML = originalText;
                }, 3000);
            }
        });
    });
    
    // Initialize rover animation
    const initRoverAnimation = () => {
        const rover = document.querySelector('.rover-body');
        if (rover) {
            // Pause animation when not in viewport for performance
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        rover.style.animationPlayState = 'running';
                    } else {
                        rover.style.animationPlayState = 'paused';
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(rover);
        }
    };
    
    initRoverAnimation();
    
    // Accessibility improvements
    document.addEventListener('keydown', (e) => {
        // Close menu on escape
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        }
        
        // Focus trap for mobile menu
        if (navMenu && navMenu.classList.contains('active')) {
            const focusableElements = navMenu.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
    });
    
    // Add focus styles for keyboard navigation
    document.querySelectorAll('a, button, input, textarea').forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', () => {
            element.classList.remove('keyboard-focus');
        });
    });
});

// Performance monitoring utility
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
    }
    
    mark(name) {
        this.metrics[name] = performance.now() - this.startTime;
    }
    
    getMetrics() {
        return this.metrics;
    }
    
    report() {
        console.log('Performance Metrics:', this.metrics);
        
        // Report to backend if needed
        if (this.metrics.loadComplete > 2000) {
            this.sendWarning('Slow load time');
        }
    }
    
    sendWarning(message) {
        // Implement warning reporting logic
        console.warn(`Performance Warning: ${message}`);
    }
}

// Initialize performance monitoring
window.perfMonitor = new PerformanceMonitor();