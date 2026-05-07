// Online Application Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('application-form');
    const submitButton = applicationForm.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('success-message');
    
    // Form field references
    const formFields = {
        schoolSection: document.querySelector('input[name="school-section"]:checked'),
        learnerFirstName: document.getElementById('learner-first-name'),
        learnerLastName: document.getElementById('learner-last-name'),
        learnerIdNumber: document.getElementById('learner-id-number'),
        learnerDateOfBirth: document.getElementById('learner-date-of-birth'),
        learnerGender: document.getElementById('learner-gender'),
        gradeApplying: document.getElementById('grade-applying'),
        parentFirstName: document.getElementById('parent-first-name'),
        parentLastName: document.getElementById('parent-last-name'),
        parentIdNumber: document.getElementById('parent-id-number'),
        relationship: document.getElementById('relationship'),
        parentEmail: document.getElementById('parent-email'),
        parentPhone: document.getElementById('parent-phone'),
        physicalAddress: document.getElementById('physical-address'),
        termsAccepted: document.getElementById('terms-accepted'),
        consentProcessed: document.getElementById('consent-processed'),
        feesUnderstood: document.getElementById('fees-understood')
    };

    // School section change handler
    document.querySelectorAll('input[name="school-section"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateGradeOptions(this.value);
            updateFeeDisplay(this.value);
        });
    });

    // Update grade options based on school section
    function updateGradeOptions(schoolSection) {
        const gradeSelect = document.getElementById('grade-applying');
        const currentValue = gradeSelect.value;
        
        gradeSelect.innerHTML = '<option value="">Select Grade</option>';
        
        if (schoolSection === 'primary') {
            for (let i = 0; i <= 7; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Grade ${i}`;
                gradeSelect.appendChild(option);
            }
        } else if (schoolSection === 'secondary') {
            for (let i = 8; i <= 12; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Grade ${i}`;
                gradeSelect.appendChild(option);
            }
        }
        
        // Restore selection if valid
        if (currentValue) {
            const option = gradeSelect.querySelector(`option[value="${currentValue}"]`);
            if (option) {
                gradeSelect.value = currentValue;
            }
        }
    }

    // Update fee display based on school section
    function updateFeeDisplay(schoolSection) {
        const feeInfo = document.querySelector('.fee-info');
        if (!feeInfo) return;
        
        let feeText = '';
        if (schoolSection === 'primary') {
            feeText = 'Monthly Fee: R700 (Grades 0-7)';
        } else if (schoolSection === 'secondary') {
            feeText = 'Monthly Fee: R1,100-R1,500 (Grades 8-12)';
        }
        
        feeInfo.textContent = feeText;
    }

    // File upload handlers
    const fileInputs = {
        birthCertificate: document.getElementById('birth-certificate'),
        schoolReport: document.getElementById('school-report'),
        parentId: document.getElementById('parent-id')
    };

    Object.keys(fileInputs).forEach(key => {
        const input = fileInputs[key];
        if (input) {
            input.addEventListener('change', function(e) {
                const fileName = e.target.files[0]?.name || '';
                const button = e.target.previousElementSibling;
                if (button && button.tagName === 'BUTTON') {
                    if (fileName) {
                        button.textContent = fileName;
                        button.classList.add('bg-green-600', 'hover:bg-green-700');
                        button.classList.remove('bg-secondary', 'hover:bg-blue-600');
                    } else {
                        button.textContent = 'Choose File';
                        button.classList.remove('bg-green-600', 'hover:bg-green-700');
                        button.classList.add('bg-secondary', 'hover:bg-blue-600');
                    }
                }
            });
        }
    });

    // Real-time validation
    Object.keys(formFields).forEach(key => {
        const field = formFields[key];
        if (field && field.type !== 'checkbox' && field.type !== 'radio') {
            field.addEventListener('blur', function() {
                validateField(field);
            });
            
            field.addEventListener('input', function() {
                // Clear error message on input
                const errorMsg = field.parentElement.querySelector('.form-error-message');
                if (errorMsg) {
                    errorMsg.classList.remove('show');
                }
                field.classList.remove('invalid');
            });
        }
    });

    // Field validation function
    function validateField(field) {
        const errorMsg = field.parentElement.querySelector('.form-error-message');
        let isValid = true;
        
        // Remove previous states
        field.classList.remove('valid', 'invalid');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            if (errorMsg) {
                errorMsg.classList.add('show');
            }
            field.classList.add('invalid');
            return false;
        }
        
        // Specific validations
        switch(field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value && !emailRegex.test(field.value)) {
                    isValid = false;
                    if (errorMsg) {
                        errorMsg.textContent = 'Please enter a valid email address';
                        errorMsg.classList.add('show');
                    }
                    field.classList.add('invalid');
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (field.value && !phoneRegex.test(field.value)) {
                    isValid = false;
                    if (errorMsg) {
                        errorMsg.textContent = 'Please enter a valid phone number';
                        errorMsg.classList.add('show');
                    }
                    field.classList.add('invalid');
                }
                break;
                
            case 'date':
                if (field.value) {
                    const date = new Date(field.value);
                    const today = new Date();
                    if (date > today) {
                        isValid = false;
                        if (errorMsg) {
                            errorMsg.textContent = 'Date of birth cannot be in the future';
                            errorMsg.classList.add('show');
                        }
                        field.classList.add('invalid');
                    }
                }
                break;
        }
        
        if (isValid && field.value.trim()) {
            field.classList.add('valid');
        }
        
        return isValid;
    }

    // ID number validation (South African)
    function validateSAIdNumber(idNumber) {
        // Basic SA ID validation (13 digits, numeric)
        if (!/^\d{13}$/.test(idNumber)) {
            return false;
        }
        
        // Check if valid date
        const year = parseInt(idNumber.substring(0, 2));
        const month = parseInt(idNumber.substring(2, 4));
        const day = parseInt(idNumber.substring(4, 6));
        
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return false;
        }
        
        return true;
    }

    // Form submission
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        
        // Check school section
        const schoolSection = document.querySelector('input[name="school-section"]:checked');
        if (!schoolSection) {
            alert('Please select whether you are applying for Primary or Secondary school');
            return;
        }
        
        // Validate required fields
        Object.keys(formFields).forEach(key => {
            const field = formFields[key];
            if (field && field.type !== 'checkbox') {
                const isValid = validateField(field);
                if (!isValid) {
                    isFormValid = false;
                }
            }
        });
        
        // Check checkboxes
        const requiredCheckboxes = ['termsAccepted', 'consentProcessed', 'feesUnderstood'];
        requiredCheckboxes.forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (!checkbox.checked) {
                isFormValid = false;
                alert('Please accept all terms and conditions');
                return;
            }
        });
        
        // Validate ID numbers
        const learnerId = formFields.learnerIdNumber.value;
        const parentId = formFields.parentIdNumber.value;
        
        if (learnerId && !validateSAIdNumber(learnerId)) {
            alert('Please enter a valid South African ID number for the learner');
            isFormValid = false;
        }
        
        if (parentId && !validateSAIdNumber(parentId)) {
            alert('Please enter a valid South African ID number for the parent/guardian');
            isFormValid = false;
        }
        
        // Check file uploads
        const requiredFiles = ['birthCertificate', 'parentId'];
        const missingFiles = [];
        
        requiredFiles.forEach(fileId => {
            const fileInput = document.getElementById(fileId);
            if (!fileInput.files || fileInput.files.length === 0) {
                missingFiles.push(fileId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));
            }
        });
        
        if (missingFiles.length > 0) {
            alert(`Please upload the following required documents: ${missingFiles.join(', ')}`);
            isFormValid = false;
        }
        
        if (!isFormValid) {
            // Scroll to first invalid field
            const firstInvalidField = applicationForm.querySelector('.invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
            return;
        }
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
        
        // Collect form data
        const formData = new FormData(applicationForm);
        const applicationData = {};
        
        // Add form fields to data object
        formData.forEach((value, key) => {
            applicationData[key] = value;
        });
        
        // Add file information
        requiredFiles.forEach(fileId => {
            const fileInput = document.getElementById(fileId);
            if (fileInput.files && fileInput.files.length > 0) {
                applicationData[fileId] = fileInput.files[0].name;
            }
        });
        
        // Simulate form submission (replace with actual submission)
        setTimeout(function() {
            // Hide loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Application';
            
            // Show success message
            successMessage.classList.remove('hidden');
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset form
            applicationForm.reset();
            
            // Reset file upload buttons
            Object.keys(fileInputs).forEach(key => {
                const input = fileInputs[key];
                if (input) {
                    const button = input.previousElementSibling;
                    if (button && button.tagName === 'BUTTON') {
                        button.textContent = 'Choose File';
                        button.classList.remove('bg-green-600', 'hover:bg-green-700');
                        button.classList.add('bg-secondary', 'hover:bg-blue-600');
                    }
                }
            });
            
            // Remove validation classes
            Object.keys(formFields).forEach(key => {
                const field = formFields[key];
                if (field) {
                    field.classList.remove('valid', 'invalid');
                }
            });
            
            // Hide success message after 10 seconds
            setTimeout(function() {
                successMessage.classList.add('hidden');
            }, 10000);
            
            // Log application data (in production, this would be sent to server)
            console.log('Application submitted successfully:', applicationData);
            
            // In a real application, you would send the data to a server here
            // Example: fetch('/api/submit-application', { method: 'POST', body: formData })
            
        }, 3000); // Simulate 3 second submission time
    });

    // Age validation based on grade
    document.getElementById('grade-applying').addEventListener('change', function() {
        const grade = parseInt(this.value);
        const dobInput = document.getElementById('learner-date-of-birth');
        const dob = new Date(dobInput.value);
        
        if (grade && !isNaN(dob.getTime())) {
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            // Check if age is appropriate for grade
            let expectedAge = grade + 6; // Grade 0 = 6 years old
            let ageDiff = Math.abs(age - expectedAge);
            
            if (ageDiff > 2) {
                const warning = document.createElement('div');
                warning.className = 'mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm';
                warning.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>Note: The learner's age (${age}) may not be typical for Grade ${grade}. Please verify the information is correct.`;
                
                // Remove existing warning
                const existingWarning = this.parentElement.querySelector('.bg-yellow-100');
                if (existingWarning) {
                    existingWarning.remove();
                }
                
                // Add new warning
                this.parentElement.appendChild(warning);
            } else {
                // Remove warning if exists
                const existingWarning = this.parentElement.querySelector('.bg-yellow-100');
                if (existingWarning) {
                    existingWarning.remove();
                }
            }
        }
    });

    // Date of birth change handler
    document.getElementById('learner-date-of-birth').addEventListener('change', function() {
        // Trigger grade validation
        const gradeSelect = document.getElementById('grade-applying');
        if (gradeSelect.value) {
            gradeSelect.dispatchEvent(new Event('change'));
        }
    });

    // Add error message elements to required fields
    function addErrorMessages() {
        const errorMessages = {
            'learner-first-name': 'Please enter the learner\'s first name',
            'learner-last-name': 'Please enter the learner\'s last name',
            'learner-id-number': 'Please enter a valid ID number',
            'learner-date-of-birth': 'Please enter the date of birth',
            'learner-gender': 'Please select the gender',
            'grade-applying': 'Please select the grade',
            'parent-first-name': 'Please enter the parent/guardian\'s first name',
            'parent-last-name': 'Please enter the parent/guardian\'s last name',
            'parent-id-number': 'Please enter a valid parent ID number',
            'relationship': 'Please select the relationship',
            'parent-email': 'Please enter a valid email address',
            'parent-phone': 'Please enter a valid phone number',
            'physical-address': 'Please enter the physical address'
        };
        
        Object.keys(errorMessages).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.parentElement.querySelector('.form-error-message')) {
                const errorMsg = document.createElement('span');
                errorMsg.className = 'form-error-message';
                errorMsg.textContent = errorMessages[fieldId];
                field.parentElement.appendChild(errorMsg);
            }
        });
    }
    
    // Initialize error messages
    addErrorMessages();

    console.log('Online application system loaded successfully');
});
