// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

const form = document.querySelector('.needs-validation');
    const textarea = document.getElementById('comment');
    
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            
            if (textarea.value.trim() === '') {
                textarea.classList.add('is-invalid');
            }
        } else {
            // Add loading state to button
            const submitBtn = form.querySelector('.btn-submit');
            submitBtn.innerHTML = 'Submitting...';
            submitBtn.disabled = true;
        }
        
        form.classList.add('was-validated');
    });
    
    // Remove invalid class when user starts typing
    textarea.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.classList.remove('is-invalid');
        }
    });
