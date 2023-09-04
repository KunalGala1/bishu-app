import { convertToSlug } from './utils.js';
import { toastNotification } from './utils.js';
import { responseAction } from './actions.js';

const forms = document.querySelectorAll('form.handle-form-submission');

forms.forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Metadata
    const method = form.dataset.method.toLowerCase();
    const name = form.name;
    const action = form.action;
    const display = form.dataset.display;
    const sitemap = form.dataset.sitemap;

    /* ====================================================== */

    /* "Middleware" */

    // Update textarea values with TinyMCE content
    updateTextareaValues(form);

    // Update slugs
    const slug = updateSlugs(form);

    /* ====================================================== */

    /* Validation */
    if (!formValidation(form)) return;

    // Create form object
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    const promises = [];

    handleFileUploads(form, method, action, name, formObject, promises);
    if (sitemap) handleSitemap(formObject, name, slug, sitemap);

    Promise.all(promises)
      .then(async () => {
        const body = JSON.stringify(formObject);
        const res = await fetch(action, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
        const data = await res.json();
        console.log(data);

        /* ====================================================== */

        /* Responses */

        if (data.success) {
          // Flash Message
          const methodMessages = {
            post: 'created',
            put: 'updated',
            delete: 'deleted',
          };

          toastNotification(`${display} ${methodMessages[method.toLowerCase()]} successfully`, 'success');

          responseAction(name, e.submitter.dataset.responseAction || method, data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  });
});

// Update textarea values with TinyMCE content
const updateTextareaValues = form => {
  const textareas = form.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    const editor = tinymce.get(textarea.id);
    if (editor) {
      textarea.value = editor.getContent();
    }
  });
};

// Convert titles to slugs and update slug values
const updateSlugs = form => {
  const slug = form.querySelector('input[name="slug"]');
  if (slug) {
    const title = form.querySelector('input[role="slug-source"], input[name="title"], textarea[role="slug-source"], textarea[name="title"]');
    slug.value = convertToSlug(title.value);
    return slug.value;
  }
};

// Prepare Sitemap
const handleSitemap = (formObject, name, slug, sitemap) => {
  formObject.sitemap = {};
  formObject.sitemap.loc = JSON.parse(sitemap).loc + `${name}/${slug}`;
  formObject.sitemap.lastmod = new Date();
  formObject.sitemap.changefreq = JSON.parse(sitemap).changefreq;
  formObject.sitemap.priority = JSON.parse(sitemap).priority;
};

// File upload
const uploadFile = async (fileInput, formObject, alt) => {
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/upload', {
    method: 'post',
    body: formData,
  });
  const data = await res.json();
  formObject.file = data.file;
  formObject.file.alt = alt.value;
};

const persistFile = async (endpoint, formObject, nestedProperty, alt) => {
  const res = await fetch(endpoint, {
    method: 'GET',
  });
  const data = await res.json();
  const body = JSON.parse(accessNestedProperty(data, nestedProperty));
  formObject.file = body.file;
  formObject.file.alt = alt.value;
};

const handleFileUploads = (form, method, action, name, formObject, promises) => {
  const fileInputs = form.querySelectorAll('input[type="file"]');

  for (const fileInput of fileInputs) {
    const alt = document.querySelector(`[name="${fileInput.name}-alt"]`);
    if (method == 'post') {
      // upload file
      if (fileInput.files.length > 0) {
        promises.push(uploadFile(fileInput, formObject, alt));
      } else {
        alert('Please upload a file');
        return;
      }
    } else if (method == 'put') {
      if (fileInput.files.length > 0) {
        promises.push(uploadFile(fileInput, formObject, alt));
      } else {
        // No changes were made to the file input
        promises.push(persistFile(action, formObject, ['doc', 'body'], alt));
      }
    }
  }
};

const accessNestedProperty = (object, keys) => {
  return keys.reduce((nestedObj, key) => {
    if (nestedObj && nestedObj.hasOwnProperty(key)) {
      return nestedObj[key];
    }
    return undefined;
  }, object);
};

const formValidation = form => {
  let errors = [];

  const requiredFields = form.querySelectorAll('[data-required]');
  requiredFields.forEach(field => {
    if (field.value === '') {
      if (field.type === 'file') {
        if (field.parentNode.querySelector('.preview').classList.contains('active')) {
          return;
        }
      }

      errors.push('Please fill out all required fields');

      // Add error class
      if (field.type === 'file') {
        field.parentNode.querySelector('label').classList.add('error');
      } else {
        // Remove error class
        field.classList.add('error');
      }
    } else {
      if (field.type === 'file') {
        field.parentNode.querySelector('label').classList.remove('error');
      } else {
        field.classList.remove('error');
      }
    }
  });
  if (errors.length) {
    toastNotification(errors[0], 'danger');
    return false;
  } else {
    return true;
  }
};
