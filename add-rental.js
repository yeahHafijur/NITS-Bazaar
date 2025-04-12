let uploadedImage = null;

// Toggle image input type
const radioButtons = document.querySelectorAll('input[name="image-source"]');
const uploadSection = document.getElementById("upload-section");
const linkSection = document.getElementById("link-section");
const imageInput = document.getElementById("rental-image");
const imageLinkInput = document.getElementById("image-link");
const imagePreview = document.getElementById("image-preview");

// Set default to upload
radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "upload") {
      uploadSection.style.display = "block";
      linkSection.style.display = "none";
      imagePreview.style.backgroundImage = "";
      imagePreview.innerHTML = "<span>+ Upload Image</span>";
      uploadedImage = null;
    } else {
      uploadSection.style.display = "none";
      linkSection.style.display = "block";
      imagePreview.style.backgroundImage = "";
      imagePreview.innerHTML = "<span>Paste image link above</span>";
      uploadedImage = null;
    }
  });
});

// Handle file upload
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImage = e.target.result;
      imagePreview.style.backgroundImage = `url(${uploadedImage})`;
      imagePreview.innerHTML = '';
    };
    reader.readAsDataURL(file);
  }
});

// Handle pasted link preview
imageLinkInput?.addEventListener("input", function () {
  const url = this.value.trim();
  if (url.startsWith("http")) {
    uploadedImage = url;
    imagePreview.style.backgroundImage = `url(${uploadedImage})`;
    imagePreview.innerHTML = '';
  } else {
    uploadedImage = null;
    imagePreview.style.backgroundImage = '';
    imagePreview.innerHTML = '<span>Invalid link</span>';
  }
});

// Autofill saved contact
const contactInput = document.getElementById("item-contact");
const savedContact = localStorage.getItem("userContact");
if (savedContact) {
  contactInput.value = savedContact;
}

// Submit handler
document.getElementById("add-rental-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Please login before listing a rental.");
    window.location.href = "login.html";
    return;
  }

  const phone = contactInput.value.trim();
  if (!/^\d{10}$/.test(phone)) {
    alert("Enter a valid 10-digit phone number");
    return;
  }

  const finalImage = uploadedImage || "https://via.placeholder.com/300x200?text=No+Image";

  const newRental = {
    id: Date.now(),
    title: document.getElementById("item-title").value,
    desc: document.getElementById("item-desc").value,
    category: document.getElementById("item-category").value,
    rentalPrice: document.getElementById("rental-price").value,
    rentalPeriod: document.getElementById("rental-period").value,
    rentalDeposit: document.getElementById("rental-deposit").value || "0",
    contact: phone,
    image: finalImage,
    isRental: true,
    type: "rent",
    sold: false,
    owner: currentUser,
    user: currentUser,
    views: 0,
    date: new Date().toISOString()
  };

  try {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.push(newRental);
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("userContact", phone);
    document.getElementById("success-modal").style.display = "block";
  } catch (err) {
    alert("Error saving item: " + err.message);
  }
});

// Modal controls
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("success-modal").style.display = "none";
});

document.getElementById("view-item").addEventListener("click", () => {
  window.location.href = "rentals.html";
});

document.getElementById("add-another").addEventListener("click", () => {
  document.getElementById("add-rental-form").reset();
  uploadedImage = null;
  imagePreview.style.backgroundImage = "";
  imagePreview.innerHTML = "<span>+ Upload Image</span>";
  document.getElementById("success-modal").style.display = "none";
  // Reset to upload section
  document.querySelector('input[value="upload"]').checked = true;
  uploadSection.style.display = "block";
  linkSection.style.display = "none";
});
