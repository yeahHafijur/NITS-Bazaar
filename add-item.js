let uploadedImageData = null;

const imageInput = document.getElementById('item-image');
const imagePreview = document.getElementById('image-preview');
const imageLinkInput = document.getElementById('image-link');

const uploadSection = document.getElementById('upload-section');
const linkSection = document.getElementById('link-section');

// Handle upload preview
imageInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImageData = e.target.result;
      imagePreview.style.backgroundImage = `url(${uploadedImageData})`;
      imagePreview.innerHTML = '';
    };
    reader.readAsDataURL(file);
  }
});
// Toggle input mode
document.querySelectorAll('input[name="image-source"]').forEach(radio => {
  radio.addEventListener('change', function () {
    if (this.value === 'upload') {
      uploadSection.style.display = 'block';
      linkSection.style.display = 'none';
    } else {
      uploadSection.style.display = 'none';
      linkSection.style.display = 'block';
    }
  });
});

// Auto-fill saved contact
const contactInput = document.getElementById('item-contact');
const savedContact = localStorage.getItem('userContact');
if (savedContact) {
  contactInput.value = savedContact;
}

// ✅ Greeting user at top of form
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("currentUser");
  const greet = document.getElementById("greeting-msg");
  if (!user) {
    alert("You're not logged in. Please login first.");
    window.location.href = "login.html";
    return;
  }
  if (greet) {
    greet.textContent = `Logged in as: ${user}`;
  }
});

/// Submit logic
document.getElementById('add-item-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const phone = contactInput.value.trim();
  if (!/^\d{10}$/.test(phone)) {
    alert('Please enter a 10-digit phone number');
    return;
  }

  localStorage.setItem('userContact', phone);
  const currentUser = localStorage.getItem("currentUser");

  let finalImage = "https://via.placeholder.com/300x200?text=No+Image";
  const selectedSource = document.querySelector('input[name="image-source"]:checked').value;
  if (selectedSource === "upload") {
    finalImage = uploadedImageData || finalImage;
  } else {
    finalImage = imageLinkInput.value.trim() || finalImage;
  }

  const newItem = {
    id: Date.now().toString(),
    title: document.getElementById('item-title').value,
    desc: document.getElementById('item-desc').value,
    price: document.getElementById('item-price').value,
    category: document.getElementById('item-category').value,
    contact: phone,
    image: finalImage,
    type: "sell",
    isRental: false,
    status: "available",
    user: currentUser,
    date: new Date().toISOString()
  };

  const items = JSON.parse(localStorage.getItem("items")) || [];
  items.push(newItem);
  localStorage.setItem("items", JSON.stringify(items));
  document.getElementById("success-modal").style.display = "block";
});

// Modal controls
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("success-modal").style.display = "none";
});

document.getElementById("view-item").addEventListener("click", () => {
  window.location.href = "market.html";
});

document.getElementById("add-another").addEventListener("click", () => {
  document.getElementById("add-item-form").reset();
  uploadedImageData = null;
  imagePreview.style.backgroundImage = '';
  imagePreview.innerHTML = '<span>+ Upload Image</span>';
  document.getElementById("success-modal").style.display = "none";
});
