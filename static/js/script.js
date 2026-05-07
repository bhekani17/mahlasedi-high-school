// Embedded data for static site
const announcementsData = [
  {
    "id": 1,
    "title": "Term 2 Parent Meeting",
    "body": "Parents and guardians are invited to attend the Term 2 progress meeting in the school hall on Friday at 14:30.",
    "date_posted": "2026-04-28T09:00:00.000Z",
    "is_active": true
  },
  {
    "id": 2,
    "title": "Mid-Year Exam Timetable Released",
    "body": "The mid-year examination timetable for Grades 8 to 12 is now available. Learners should collect printed copies from class teachers.",
    "date_posted": "2026-04-20T08:30:00.000Z",
    "is_active": true
  },
  {
    "id": 3,
    "title": "Matric Study Camp Registration",
    "body": "Grade 12 learners can register for the June study camp by submitting consent forms to the academic office before 20 May.",
    "date_posted": "2026-04-12T10:15:00.000Z",
    "is_active": true
  }
];

const eventsData = [
  {
    "id": 1,
    "title": "Grade 12 Revision Bootcamp",
    "description": "Intensive revision support for core matric subjects.",
    "date": "2026-05-15",
    "location": "Main Hall"
  },
  {
    "id": 2,
    "title": "Inter-House Athletics",
    "description": "Annual athletics competition for all grade groups.",
    "date": "2026-05-22",
    "location": "Sports Field"
  },
  {
    "id": 3,
    "title": "Science Expo",
    "description": "Learners present innovation projects and experiments.",
    "date": "2026-06-03",
    "location": "Science Block"
  },
  {
    "id": 4,
    "title": "Career Guidance Day",
    "description": "University and industry representatives meet learners.",
    "date": "2026-03-14",
    "location": "Assembly Hall"
  }
];

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton) {
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Load home data
function loadHomeData() {
  // Load announcements
  const announcementsList = document.getElementById('announcements-list');
  if (announcementsList) {
    announcementsList.innerHTML = announcementsData.slice(0, 3).map(ann => `
      <div class="bg-white p-6 rounded-lg shadow-md">
        <span class="inline-block bg-primary text-white px-2 py-1 rounded text-sm font-semibold mb-2">Notice</span>
        <h3 class="text-xl font-bold mb-2">${ann.title}</h3>
        <p class="text-gray-600 text-sm">${ann.body.substring(0, 100)}...</p>
        <div class="text-gray-500 text-sm mt-4">
          <i class="fas fa-calendar-alt mr-1"></i>${new Date(ann.date_posted).toLocaleDateString()}
        </div>
      </div>
    `).join('');
  }

  // Load events
  const eventsList = document.getElementById('events-list');
  if (eventsList) {
    eventsList.innerHTML = eventsData.slice(0, 3).map(event => `
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <div class="bg-primary text-white rounded-lg p-3 text-center mr-4">
            <div class="text-2xl font-bold">${new Date(event.date).getDate()}</div>
            <div class="text-sm uppercase">${new Date(event.date).toLocaleDateString('en', { month: 'short' })}</div>
          </div>
          <div>
            <h3 class="text-xl font-bold">${event.title}</h3>
            ${event.location ? `<p class="text-gray-600 text-sm"><i class="fas fa-map-marker-alt mr-1"></i>${event.location}</p>` : ''}
          </div>
        </div>
        ${event.description ? `<p class="text-gray-600 text-sm">${event.description.substring(0, 80)}...</p>` : ''}
      </div>
    `).join('');
  }
}


// Form validation and character counter
function initializeForms() {
  // Character counter for textarea
  const messageTextarea = document.getElementById('message');
  const characterCounter = messageTextarea?.nextElementSibling?.querySelector('.character-counter');
  
  if (messageTextarea && characterCounter) {
    messageTextarea.addEventListener('input', function() {
      const currentLength = this.value.length;
      const maxLength = 500;
      characterCounter.textContent = `${currentLength} / ${maxLength}`;
      
      if (currentLength > maxLength) {
        characterCounter.classList.add('text-red-500');
        characterCounter.classList.remove('text-gray-400');
      } else {
        characterCounter.classList.remove('text-red-500');
        characterCounter.classList.add('text-gray-400');
      }
    });
  }

  // Form submission
  const contactForms = document.querySelectorAll('#contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');
      
      // Show loading state
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin-slow mr-2"></i>Sending...';
      submitButton.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check mr-2"></i>Message Sent!';
        submitButton.classList.add('form-success');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          form.reset();
          submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
          submitButton.classList.remove('form-success');
          submitButton.disabled = false;
          
          // Reset character counter
          if (characterCounter) {
            characterCounter.textContent = '0 / 500';
            characterCounter.classList.remove('text-red-500');
            characterCounter.classList.add('text-gray-400');
          }
        }, 3000);
      }, 1500);
    });
  });
}

// Mobile dropdown functionality
function initializeMobileDropdowns() {
  const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');
      
      // Close other dropdowns
      dropdownToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          const otherContent = otherToggle.nextElementSibling;
          const otherIcon = otherToggle.querySelector('i');
          otherContent.classList.add('hidden');
          otherIcon.classList.remove('fa-chevron-up');
          otherIcon.classList.add('fa-chevron-down');
        }
      });
      
      // Toggle current dropdown
      content.classList.toggle('hidden');
      
      // Rotate icon
      if (content.classList.contains('hidden')) {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      } else {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      }
    });
  });
}

// Desktop dropdown hover improvements
function initializeDesktopDropdowns() {
  const dropdowns = document.querySelectorAll('.relative.group');
  
  dropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('button');
    const menu = dropdown.querySelector('.absolute');
    
    // Add keyboard navigation
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menu.classList.toggle('opacity-0');
        menu.classList.toggle('invisible');
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        menu.classList.add('opacity-0');
        menu.classList.add('invisible');
      }
    });
  });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadHomeData();
  initializeForms();
  initializeMobileDropdowns();
  initializeDesktopDropdowns();
});
