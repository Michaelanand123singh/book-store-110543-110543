document.addEventListener('DOMContentLoaded', () => {

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu a');
  let focusableElements;
  let firstFocusableElement;
  let lastFocusableElement;

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
      menuToggle.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll'); // Prevent background scrolling

      if (mobileMenu.classList.contains('open')) {
        focusableElements = mobileMenu.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];

        firstFocusableElement.focus();

        mobileMenu.addEventListener('keydown', trapFocus);

      } else {
        mobileMenu.removeEventListener('keydown', trapFocus);
      }
    });

    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', false);
      mobileMenu.classList.remove('open');
      document.body.classList.remove('no-scroll');
      mobileMenu.removeEventListener('keydown', trapFocus);
      menuToggle.focus();
    };

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    function trapFocus(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    }
  }

  // Smooth Scroll and Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.querySelector('.back-to-top');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 50, // Adjust offset as needed
          behavior: 'smooth'
        });

        if (mobileMenu && mobileMenu.classList.contains('open')) {
          closeMenu();
        }

      }
    });
  });

  if (backToTopButton) {
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });
  }

  // Testimonial Slider
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll('.testimonial');
    const prevButton = testimonialSlider.querySelector('.prev-testimonial');
    const nextButton = testimonialSlider.querySelector('.next-testimonial');
    let currentSlide = 0;
    let intervalId;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    function startSlider() {
      intervalId = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    }

    function stopSlider() {
      clearInterval(intervalId);
    }

    if(slides.length > 0) {
        showSlide(currentSlide); // Initialize first slide
        startSlider(); // Start auto-advance
    }


    if (prevButton) {
      prevButton.addEventListener('click', () => {
        stopSlider();
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
        startSlider();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
      });
    }

    testimonialSlider.addEventListener('mouseenter', stopSlider);
    testimonialSlider.addEventListener('mouseleave', startSlider);
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true' || false;

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherHeader = otherItem.querySelector('.faq-header');
          const otherContent = otherItem.querySelector('.faq-content');
          otherHeader.setAttribute('aria-expanded', 'false');
          otherContent.style.display = 'none';
        }
      });

      header.setAttribute('aria-expanded', !isExpanded);
      content.style.display = isExpanded ? 'none' : 'block';
    });
  });

  // Email Capture Validation and Submission
  const emailForm = document.querySelector('#email-capture-form');

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('#email');
      const email = emailInput.value;

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      console.log('Submitting email:', email);
      // Simulate submission
      setTimeout(() => {
        alert('Email submitted successfully!');
        emailInput.value = '';
      }, 500);
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA click logging stub
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const utmParams = getUtmParams();
      console.log('CTA Clicked', {
        buttonText: button.textContent,
        utmParams: utmParams
      });
      //  Send this data to your analytics platform
    });
  });

  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    return {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent
    };
  }

});