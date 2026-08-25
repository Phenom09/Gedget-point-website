/* =========================================================
   LADDU HUB
   APPLICATION LOGIC
   BUSINESS PROTOTYPE
   ========================================================= */


/* =========================================================
   DEMO ACCOUNT
   ========================================================= */

const DEMO_ACCOUNT = {
  username: "Shohrab",
  password: "1234",
  businessName: "Gadget Point",
  location: "Chattogram, BD"
};


/* =========================================================
   PROTOTYPE DATA

   Refresh করলে data reset হবে.
   Real database পরে যোগ হবে.
   ========================================================= */

let laptops = [];


/* =========================================================
   MAIN DOM
   ========================================================= */

const authPage =
  document.getElementById("authPage");

const dashboard =
  document.getElementById("dashboard");

const loginForm =
  document.getElementById("loginForm");

const signupForm =
  document.getElementById("signupForm");

const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const loginError =
  document.getElementById("error");

const signupMessage =
  document.getElementById("signupMessage");

const sidebar =
  document.getElementById("sidebar");

const menuButton =
  document.getElementById("menuButton");

const pageContent =
  document.getElementById("pageContent");

const globalSearchInput =
  document.querySelector(
    ".global-search input"
  );


/* =========================================================
   DASHBOARD HOME ELEMENTS
   ========================================================= */

const dashboardHomeElements = [];

if (pageContent) {
  let element =
    pageContent.nextElementSibling;

  while (element) {
    dashboardHomeElements.push(
      element
    );

    element =
      element.nextElementSibling;
  }
}


/* =========================================================
   LOGIN
   ========================================================= */

function login(event) {
  event.preventDefault();

  const username =
    usernameInput.value.trim();

  const password =
    passwordInput.value;

  hideLoginError();

  if (
    username === DEMO_ACCOUNT.username &&
    password === DEMO_ACCOUNT.password
  ) {
    updateDemoIdentity();
    showDashboard();
    return;
  }

  loginError.textContent =
    "Username or password is incorrect.";

  loginError.style.display =
    "block";

  passwordInput.focus();
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function showDashboard() {
  authPage.style.display = "none";
  dashboard.style.display = "block";

  document.body.classList.add(
    "dashboard-visible"
  );

  showDashboardHome();

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });
}


function showDashboardHome() {
  clearDynamicPage();

  dashboardHomeElements.forEach(
    (element) => {
      element.style.display = "";
    }
  );

  setActiveNavigation("Dashboard");

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
}


function hideDashboardHome() {
  dashboardHomeElements.forEach(
    (element) => {
      element.style.display = "none";
    }
  );
}


/* =========================================================
   BUSINESS IDENTITY
   ========================================================= */

function updateDemoIdentity() {
  setText(
    "sidebarBusinessName",
    DEMO_ACCOUNT.businessName
  );

  setText(
    "headerBusinessName",
    DEMO_ACCOUNT.businessName
  );
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {
  closeCustomerView();

  document.body.classList.remove(
    "dashboard-visible"
  );

  dashboard.style.display = "none";
  authPage.style.display = "";

  closeSidebar();
  clearDynamicPage();

  const form =
    document.querySelector(
      "#loginForm form"
    );

  if (form) {
    form.reset();
  }

  hideLoginError();
  showLogin();
  setActiveNavigation("Dashboard");

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

  usernameInput.focus();
}


/* =========================================================
   LOGIN HELPERS
   ========================================================= */

function hideLoginError() {
  loginError.style.display =
    "none";
}


function togglePassword() {
  const button =
    document.querySelector(
      ".show-password"
    );

  const hidden =
    passwordInput.type ===
      "password";

  passwordInput.type =
    hidden ? "text" : "password";

  if (button) {
    const label =
      hidden
        ? "Hide password"
        : "Show password";

    button.setAttribute(
      "aria-label",
      label
    );

    button.setAttribute(
      "title",
      label
    );
  }
}


function forgotPassword() {
  alert(
    "Password reset will be connected when secure authentication is added."
  );
}


/* =========================================================
   SIGN UP
   ========================================================= */

function showSignup() {
  hideLoginError();

  loginForm.classList.add("hidden");

  signupForm.classList.remove(
    "hidden"
  );

  signupMessage.textContent = "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function showLogin() {
  signupForm.classList.add("hidden");

  loginForm.classList.remove(
    "hidden"
  );

  signupMessage.textContent = "";
}


function createAccount(event) {
  event.preventDefault();

  const fullName =
    valueOf("fullName");

  const email =
    valueOf("email");

  const shopName =
    valueOf("shopName");

  const businessType =
    valueOf("businessType");

  const location =
    valueOf("location");

  const signupPassword =
    valueOf("signupPassword");

  const confirmPassword =
    valueOf("confirmPassword");

  const agreeTerms =
    document.getElementById(
      "agreeTerms"
    )?.checked;

  signupMessage.style.color =
    "#dc4c5a";

  if (
    !fullName ||
    !email ||
    !shopName ||
    !businessType ||
    !location ||
    !signupPassword ||
    !confirmPassword
  ) {
    signupMessage.textContent =
      "Please complete all fields.";

    return;
  }

  if (signupPassword.length < 6) {
    signupMessage.textContent =
      "Password must contain at least 6 characters.";

    return;
  }

  if (
    signupPassword !==
    confirmPassword
  ) {
    signupMessage.textContent =
      "The passwords do not match.";

    return;
  }

  if (!agreeTerms) {
    signupMessage.textContent =
      "Please agree to the Terms and Privacy Policy.";

    return;
  }

  signupMessage.style.color =
    "#18a968";

  signupMessage.textContent =
    "Demo validation successful. No real account has been created yet.";
}


/* =========================================================
   SIDEBAR
   ========================================================= */

function toggleSidebar() {
  sidebar?.classList.toggle(
    "mobile-open"
  );
}


function closeSidebar() {
  sidebar?.classList.remove(
    "mobile-open"
  );
}


menuButton?.addEventListener(
  "click",
  toggleSidebar
);


/* =========================================================
   NAVIGATION
   ========================================================= */

const navigationItems =
  document.querySelectorAll(
    ".nav-item"
  );


navigationItems.forEach((item) => {
  item.addEventListener(
    "click",
    async () => {
      const pageName =
        getNavigationName(item);

      setActiveNavigation(pageName);

      closeSidebar();

      if (
        pageName === "Dashboard"
      ) {
        showDashboardHome();
        return;
      }

      if (
        pageName === "Stock"
      ) {
        await loadStockPage();
        return;
      }

      if (
        pageName === "Products"
      ) {
        showComingSoonPage(
          "Products"
        );

        return;
      }

      showComingSoonPage(
        pageName
      );
    }
  );
});


function getNavigationName(item) {
  const spans =
    item.querySelectorAll("span");

  if (spans.length < 2) {
    return "";
  }

  return spans[1]
    .textContent
    .trim();
}


function setActiveNavigation(
  pageName
) {
  navigationItems.forEach(
    (item) => {
      item.classList.toggle(
        "active",
        getNavigationName(item) ===
          pageName
      );
    }
  );
}


/* =========================================================
   DYNAMIC PAGE
   ========================================================= */

function clearDynamicPage() {
  if (!pageContent) {
    return;
  }

  closeCustomerView();

  pageContent.innerHTML = "";

  pageContent.style.display =
    "none";
}


function prepareDynamicPage() {
  if (!pageContent) {
    return;
  }

  closeCustomerView();

  hideDashboardHome();

  pageContent.innerHTML = "";

  pageContent.style.display =
    "block";

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   STOCK PAGE
   ========================================================= */

async function loadStockPage() {
  if (!pageContent) {
    return;
  }

  prepareDynamicPage();

  pageContent.innerHTML = `
    <div class="page-loading">

      <div class="page-loading-spinner">
      </div>

      <p>
        Loading Laptop Stock...
      </p>

    </div>
  `;

  try {
    const response =
      await fetch(
        "pages/stock.html"
      );

    if (!response.ok) {
      throw new Error(
        "Stock page could not be loaded."
      );
    }

    pageContent.innerHTML =
      await response.text();

    initialiseStockPage();

  } catch (error) {
    console.error(error);

    pageContent.innerHTML = `
      <div class="page-error-state">

        <div class="page-error-icon">
          !
        </div>

        <h2>
          Laptop Stock couldn't load
        </h2>

        <p>
          Make sure Laddu Hub is running with Live Server.
        </p>

      </div>
    `;
  }
}


/* =========================================================
   STOCK INITIALISATION
   ========================================================= */

function initialiseStockPage() {
  const receiveButton =
    document.getElementById(
      "receiveLaptopButton"
    );

  const emptyReceiveButton =
    document.getElementById(
      "emptyReceiveLaptopButton"
    );

  const closeButton =
    document.getElementById(
      "closeReceiveLaptopModal"
    );

  const cancelButton =
    document.getElementById(
      "cancelReceiveLaptop"
    );

  const backdrop =
    document.getElementById(
      "receiveLaptopBackdrop"
    );

  const receiveForm =
    document.getElementById(
      "receiveLaptopForm"
    );

  const addAnotherButton =
    document.getElementById(
      "addAnotherLaptopButton"
    );

  const search =
    document.getElementById(
      "laptopStockSearch"
    );

  const brandFilter =
    document.getElementById(
      "stockBrandFilter"
    );

  const statusFilter =
    document.getElementById(
      "laptopStatusFilter"
    );

  const customerViewButton =
    document.getElementById(
      "openCustomerViewButton"
    );


  receiveButton?.addEventListener(
    "click",
    openReceiveLaptopModal
  );


  emptyReceiveButton?.addEventListener(
    "click",
    openReceiveLaptopModal
  );


  closeButton?.addEventListener(
    "click",
    closeReceiveLaptopModal
  );


  cancelButton?.addEventListener(
    "click",
    closeReceiveLaptopModal
  );


  backdrop?.addEventListener(
    "click",
    closeReceiveLaptopModal
  );


  receiveForm?.addEventListener(
    "submit",
    saveBulkLaptopDelivery
  );


  addAnotherButton?.addEventListener(
    "click",
    addAnotherLaptopEntry
  );


  search?.addEventListener(
    "input",
    renderLaptopStock
  );


  brandFilter?.addEventListener(
    "change",
    renderLaptopStock
  );


  statusFilter?.addEventListener(
    "change",
    renderLaptopStock
  );


  customerViewButton?.addEventListener(
    "click",
    openCustomerLaptopSelector
  );


  initialiseExistingEntryCards();

  renderLaptopStock();
}


/* =========================================================
   OPEN BULK RECEIVE
   ========================================================= */

function openReceiveLaptopModal() {
  const modal =
    document.getElementById(
      "receiveLaptopModal"
    );

  const form =
    document.getElementById(
      "receiveLaptopForm"
    );

  if (!modal || !form) {
    return;
  }


  form.reset();


  /*
    Return to exactly one clean laptop card.
  */

  resetBulkLaptopEntries();


  const receivedDate =
    document.getElementById(
      "receivedDate"
    );

  if (receivedDate) {
    receivedDate.value =
      getTodayDateInputValue();
  }


  clearReceiveMessage();

  updateBulkEntryUI();


  modal.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";


  setTimeout(() => {
    document.getElementById(
      "deliveredBy"
    )?.focus();
  }, 50);
}


function closeReceiveLaptopModal() {
  document
    .getElementById(
      "receiveLaptopModal"
    )
    ?.classList.add("hidden");

  document.body.style.overflow =
    "";
}


/* =========================================================
   RESET BULK ENTRIES
   ========================================================= */

function resetBulkLaptopEntries() {
  const container =
    document.getElementById(
      "bulkLaptopEntries"
    );

  if (!container) {
    return;
  }


  const firstCard =
    container.querySelector(
      ".bulk-laptop-entry"
    );


  if (!firstCard) {
    return;
  }


  /*
    Remove all extra cards.
  */

  container
    .querySelectorAll(
      ".bulk-laptop-entry"
    )
    .forEach(
      (card, index) => {
        if (index > 0) {
          revokeEntryPhotoURLs(
            card
          );

          card.remove();
        }
      }
    );


  resetEntryCard(firstCard);

  firstCard.dataset.entryId =
    "1";

  initialiseLaptopEntryCard(
    firstCard
  );
}


/* =========================================================
   ADD ANOTHER LAPTOP
   ========================================================= */

function addAnotherLaptopEntry() {
  const container =
    document.getElementById(
      "bulkLaptopEntries"
    );

  const firstCard =
    container?.querySelector(
      ".bulk-laptop-entry"
    );

  if (
    !container ||
    !firstCard
  ) {
    return;
  }


  const clone =
    firstCard.cloneNode(true);


  resetEntryCard(clone);


  clone.dataset.entryId =
    String(
      Date.now() +
      Math.random()
    );


  container.appendChild(clone);


  initialiseLaptopEntryCard(
    clone
  );


  updateBulkEntryUI();


  clone.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================================================
   INITIALISE EXISTING CARDS
   ========================================================= */

function initialiseExistingEntryCards() {
  document
    .querySelectorAll(
      ".bulk-laptop-entry"
    )
    .forEach(
      initialiseLaptopEntryCard
    );

  updateBulkEntryUI();
}


/* =========================================================
   ENTRY CARD EVENTS
   ========================================================= */

function initialiseLaptopEntryCard(
  card
) {
  if (!card) {
    return;
  }


  /*
    Avoid duplicate listeners.
  */

  if (
    card.dataset.initialised ===
      "true"
  ) {
    return;
  }


  card.dataset.initialised =
    "true";


  const removeButton =
    card.querySelector(
      ".remove-laptop-entry"
    );


  const brandSelect =
    card.querySelector(
      ".entry-brand"
    );


  const photoButton =
    card.querySelector(
      ".entry-photo-button"
    );


  const photoInput =
    card.querySelector(
      ".entry-photo-input"
    );


  removeButton?.addEventListener(
    "click",
    () => {
      removeLaptopEntry(card);
    }
  );


  brandSelect?.addEventListener(
    "change",
    () => {
      handleOtherBrand(card);
      updateEntryTitle(card);
    }
  );


  card
    .querySelector(
      ".entry-other-brand"
    )
    ?.addEventListener(
      "input",
      () => {
        updateEntryTitle(card);
      }
    );


  card
    .querySelector(
      ".entry-model"
    )
    ?.addEventListener(
      "input",
      () => {
        updateEntryTitle(card);
      }
    );


  photoButton?.addEventListener(
    "click",
    () => {
      photoInput?.click();
    }
  );


  photoInput?.addEventListener(
    "change",
    () => {
      handleEntryPhotos(card);
    }
  );


  handleOtherBrand(card);

  updateEntryTitle(card);
}


/* =========================================================
   REMOVE ENTRY
   ========================================================= */

function removeLaptopEntry(card) {
  const cards =
    document.querySelectorAll(
      ".bulk-laptop-entry"
    );


  if (cards.length <= 1) {
    return;
  }


  revokeEntryPhotoURLs(card);

  card.remove();

  updateBulkEntryUI();
}


/* =========================================================
   RESET ONE CARD
   ========================================================= */

function resetEntryCard(card) {
  if (!card) {
    return;
  }


  card.dataset.initialised =
    "false";


  card
    .querySelectorAll(
      "input"
    )
    .forEach((input) => {
      if (
        input.type === "file"
      ) {
        input.value = "";
      } else {
        input.value = "";
      }
    });


  card
    .querySelectorAll(
      "textarea"
    )
    .forEach((textarea) => {
      textarea.value = "";
    });


  card
    .querySelectorAll(
      "select"
    )
    .forEach((select) => {
      select.selectedIndex = 0;
    });


  const otherField =
    card.querySelector(
      ".entry-other-brand-field"
    );

  otherField?.classList.add(
    "hidden"
  );


  const otherInput =
    card.querySelector(
      ".entry-other-brand"
    );

  if (otherInput) {
    otherInput.required = false;
  }


  const preview =
    card.querySelector(
      ".entry-photo-preview"
    );

  if (preview) {
    preview.innerHTML = "";
  }


  card._photoRecords = [];


  const title =
    card.querySelector(
      ".bulk-entry-title"
    );

  if (title) {
    title.textContent =
      "New Laptop";
  }
}


/* =========================================================
   BULK ENTRY UI
   ========================================================= */

function updateBulkEntryUI() {
  const cards =
    Array.from(
      document.querySelectorAll(
        ".bulk-laptop-entry"
      )
    );


  cards.forEach(
    (card, index) => {
      const number =
        card.querySelector(
          ".bulk-entry-number"
        );

      const removeButton =
        card.querySelector(
          ".remove-laptop-entry"
        );


      if (number) {
        number.textContent =
          `LAPTOP ${String(
            index + 1
          ).padStart(2, "0")}`;
      }


      if (removeButton) {
        removeButton.classList.toggle(
          "hidden",
          cards.length === 1
        );
      }
    }
  );


  const count =
    cards.length;


  setText(
    "bulkLaptopCount",
    count === 1
      ? "1 Laptop"
      : `${count} Laptops`
  );


  setText(
    "receiveLaptopSubmitText",
    count === 1
      ? "Receive 1 Laptop"
      : `Receive ${count} Laptops`
  );
}


/* =========================================================
   OTHER BRAND
   ========================================================= */

function handleOtherBrand(card) {
  const brand =
    card.querySelector(
      ".entry-brand"
    )?.value;


  const field =
    card.querySelector(
      ".entry-other-brand-field"
    );


  const input =
    card.querySelector(
      ".entry-other-brand"
    );


  const isOther =
    brand === "Other";


  field?.classList.toggle(
    "hidden",
    !isOther
  );


  if (input) {
    input.required = isOther;

    if (!isOther) {
      input.value = "";
    }
  }
}


/* =========================================================
   ENTRY TITLE
   ========================================================= */

function updateEntryTitle(card) {
  const brand =
    getEntryBrand(card);


  const model =
    fieldValue(
      card,
      ".entry-model"
    );


  const title =
    card.querySelector(
      ".bulk-entry-title"
    );


  if (!title) {
    return;
  }


  title.textContent =
    [brand, model]
      .filter(Boolean)
      .join(" ") ||
    "New Laptop";
}


/* =========================================================
   ENTRY PHOTOS
   ========================================================= */

function handleEntryPhotos(card) {
  const input =
    card.querySelector(
      ".entry-photo-input"
    );


  if (!input) {
    return;
  }


  revokeEntryPhotoURLs(card);


  const files =
    Array.from(
      input.files || []
    )
      .filter(
        (file) =>
          file.type.startsWith(
            "image/"
          )
      )
      .slice(0, 6);


  card._photoRecords =
    files.map(
      (file) => ({
        file,
        url:
          URL.createObjectURL(
            file
          )
      })
    );


  renderEntryPhotos(card);
}


function renderEntryPhotos(card) {
  const preview =
    card.querySelector(
      ".entry-photo-preview"
    );


  if (!preview) {
    return;
  }


  preview.innerHTML = "";


  const records =
    card._photoRecords || [];


  records.forEach(
    (record, index) => {
      const item =
        document.createElement(
          "div"
        );

      item.className =
        "photo-preview-item";


      const image =
        document.createElement(
          "img"
        );

      image.src = record.url;

      image.alt =
        "Laptop preview";


      const remove =
        document.createElement(
          "button"
        );

      remove.type = "button";

      remove.className =
        "photo-remove-btn";

      remove.textContent = "×";


      remove.addEventListener(
        "click",
        () => {
          URL.revokeObjectURL(
            record.url
          );

          records.splice(
            index,
            1
          );

          renderEntryPhotos(
            card
          );
        }
      );


      item.append(
        image,
        remove
      );

      preview.appendChild(
        item
      );
    }
  );
}


function revokeEntryPhotoURLs(card) {
  const records =
    card?._photoRecords || [];


  records.forEach(
    (record) => {
      if (record.url) {
        URL.revokeObjectURL(
          record.url
        );
      }
    }
  );


  if (card) {
    card._photoRecords = [];
  }
}


/* =========================================================
   SAVE BULK DELIVERY
   ========================================================= */

function saveBulkLaptopDelivery(
  event
) {
  event.preventDefault();

  clearReceiveMessage();


  const delivery = {
    deliveredBy:
      valueOf("deliveredBy"),

    deliveryPhone:
      valueOf("deliveryPhone"),

    receivedDate:
      valueOf("receivedDate"),

    carryingBy:
      valueOf("carryingBy"),

    details:
      valueOf("deliveryDetails")
  };


  if (
    !delivery.deliveredBy ||
    !delivery.receivedDate ||
    !delivery.carryingBy
  ) {
    showReceiveMessage(
      "Please complete the required delivery information.",
      "error"
    );

    return;
  }


  const cards =
    Array.from(
      document.querySelectorAll(
        ".bulk-laptop-entry"
      )
    );


  if (cards.length === 0) {
    showReceiveMessage(
      "Please add at least one laptop.",
      "error"
    );

    return;
  }


  const pendingLaptops = [];


  for (
    let index = 0;
    index < cards.length;
    index += 1
  ) {
    const result =
      readLaptopEntry(
        cards[index],
        index
      );


    if (!result.ok) {
      showReceiveMessage(
        result.message,
        "error"
      );

      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      return;
    }


    pendingLaptops.push(
      result.laptop
    );
  }


  const duplicateMessage =
    validateBulkDuplicates(
      pendingLaptops
    );


  if (duplicateMessage) {
    showReceiveMessage(
      duplicateMessage,
      "error"
    );

    return;
  }


  const deliveryId =
    createPrototypeId();


  const now =
    new Date().toISOString();


    pendingLaptops.forEach(
    (laptop) => {
      laptops.unshift({
        ...laptop,

        id: createPrototypeId(),

        deliveryId,

        deliveredBy:
          delivery.deliveredBy,

        deliveryPhone:
          delivery.deliveryPhone,

        receivedDate:
          delivery.receivedDate,

        carryingBy:
          delivery.carryingBy,

        deliveryDetails:
          delivery.details,

        status: "in-stock",

        createdAt: now
      });
    }
  );


  const count =
    pendingLaptops.length;


  showReceiveMessage(
    count === 1
      ? "1 laptop received successfully."
      : `${count} laptops received successfully.`,
    "success"
  );


  renderLaptopStock();


  setTimeout(() => {
    closeReceiveLaptopModal();
  }, 500);
}


/* =========================================================
   READ ONE LAPTOP CARD
   ========================================================= */

function readLaptopEntry(
  card,
  index
) {
  const number =
    index + 1;


  const internalCode =
    fieldValue(
      card,
      ".entry-internal-code"
    );


  const serialNumber =
    fieldValue(
      card,
      ".entry-serial-number"
    );


  const brand =
    getEntryBrand(card);


  const model =
    fieldValue(
      card,
      ".entry-model"
    );


  if (
    !internalCode ||
    !serialNumber ||
    !brand ||
    !model
  ) {
    return {
      ok: false,

      message:
        `Laptop ${number}: Code, Serial Number, Brand and Model are required.`
    };
  }


  const customerPriceText =
    fieldValue(
      card,
      ".entry-customer-price"
    );


  const customerPrice =
    customerPriceText
      ? Number(customerPriceText)
      : 0;


  if (
    !Number.isFinite(customerPrice) ||
    customerPrice < 0
  ) {
    return {
      ok: false,

      message:
        `Laptop ${number}: Enter a valid customer price.`
    };
  }


  const photos =
    (card._photoRecords || [])
      .map(
        (record) => ({
          name:
            record.file?.name ||
            "Laptop photo",

          url: record.url
        })
      );


  /*
    Keep the saved prototype photo URLs alive.
  */

  card._photoRecords = [];


  return {
    ok: true,

    laptop: {
      internalCode,
      serialNumber,
      brand,
      model,

      processor:
        fieldValue(
          card,
          ".entry-processor"
        ),

      generation:
        fieldValue(
          card,
          ".entry-generation"
        ),

      ram:
        fieldValue(
          card,
          ".entry-ram"
        ),

      storage:
        fieldValue(
          card,
          ".entry-storage"
        ),

      graphics:
        fieldValue(
          card,
          ".entry-graphics"
        ),

      display:
        fieldValue(
          card,
          ".entry-display"
        ),

      touch:
        fieldValue(
          card,
          ".entry-touch"
        ),

      batteryHealth:
        fieldValue(
          card,
          ".entry-battery-health"
        ),

      condition:
        fieldValue(
          card,
          ".entry-condition"
        ),

      chargerReceived:
        fieldValue(
          card,
          ".entry-charger"
        ),

      visibleNote:
        fieldValue(
          card,
          ".entry-visible-note"
        ),

      internalNote:
        fieldValue(
          card,
          ".entry-internal-note"
        ),

      customerPrice,

      photos,

      events: []
    }
  };
}


/* =========================================================
   BRAND VALUE
   ========================================================= */

function getEntryBrand(card) {
  const selectedBrand =
    fieldValue(
      card,
      ".entry-brand"
    );


  if (
    selectedBrand === "Other"
  ) {
    return fieldValue(
      card,
      ".entry-other-brand"
    );
  }


  return selectedBrand;
}


/* =========================================================
   DUPLICATE VALIDATION
   ========================================================= */

function validateBulkDuplicates(
  pending
) {
  const existingCodes =
    new Set(
      laptops.map(
        (laptop) =>
          normaliseKey(
            laptop.internalCode
          )
      )
    );


  const existingSerials =
    new Set(
      laptops.map(
        (laptop) =>
          normaliseKey(
            laptop.serialNumber
          )
      )
    );


  const newCodes =
    new Set();


  const newSerials =
    new Set();


  for (const laptop of pending) {
    const code =
      normaliseKey(
        laptop.internalCode
      );


    const serial =
      normaliseKey(
        laptop.serialNumber
      );


    if (
      existingCodes.has(code)
    ) {
      return (
        `Internal code ${laptop.internalCode} already exists.`
      );
    }


    if (
      existingSerials.has(serial)
    ) {
      return (
        `Serial number ${laptop.serialNumber} already exists.`
      );
    }


    if (
      newCodes.has(code)
    ) {
      return (
        `Internal code ${laptop.internalCode} is duplicated in this delivery.`
      );
    }


    if (
      newSerials.has(serial)
    ) {
      return (
        `Serial number ${laptop.serialNumber} is duplicated in this delivery.`
      );
    }


    newCodes.add(code);

    newSerials.add(serial);
  }


  return "";
}


/* =========================================================
   RECEIVE MESSAGE
   ========================================================= */

function showReceiveMessage(
  message,
  type
) {
  const element =
    document.getElementById(
      "receiveLaptopMessage"
    );


  if (!element) {
    return;
  }


  element.textContent =
    message;


  element.className =
    type === "success"
      ? "product-form-message success-message"
      : "product-form-message error-message";
}


function clearReceiveMessage() {
  const element =
    document.getElementById(
      "receiveLaptopMessage"
    );


  if (!element) {
    return;
  }


  element.textContent = "";

  element.className =
    "product-form-message";
}


/* =========================================================
   RENDER STOCK
   ========================================================= */

function renderLaptopStock() {
  const tableBody =
    document.getElementById(
      "laptopStockTableBody"
    );


  if (!tableBody) {
    return;
  }


  const search =
    valueOf(
      "laptopStockSearch"
    ).toLowerCase();


  const brand =
    valueOf(
      "stockBrandFilter"
    ) || "all";


  const status =
    valueOf(
      "laptopStatusFilter"
    ) || "all";


  const filtered =
    laptops.filter(
      (laptop) => {
        const searchText = [
          laptop.internalCode,
          laptop.serialNumber,
          laptop.brand,
          laptop.model,
          laptop.processor,
          laptop.generation,
          laptop.ram,
          laptop.storage,
          laptop.deliveredBy,
          laptop.carryingBy,
          laptop.receivedDate
        ]
          .join(" ")
          .toLowerCase();


        const matchesSearch =
          !search ||
          searchText.includes(search);


        const matchesBrand =
          brand === "all" ||
          laptop.brand === brand;


        const matchesStatus =
          status === "all" ||
          laptop.status === status;


        return (
          matchesSearch &&
          matchesBrand &&
          matchesStatus
        );
      }
    );


  updateStockSummary();


  if (
    filtered.length === 0
  ) {
    tableBody.innerHTML =
      createLaptopEmptyState(
        laptops.length > 0
      );


    document
      .getElementById(
        "emptyReceiveLaptopButton"
      )
      ?.addEventListener(
        "click",
        openReceiveLaptopModal
      );


    return;
  }


  tableBody.innerHTML =
    filtered
      .map(createLaptopRowHTML)
      .join("");


  bindLaptopRowButtons();
}


/* =========================================================
   STOCK ROW
   ========================================================= */

function createLaptopRowHTML(
  laptop
) {
  const configuration =
    buildConfigurationText(
      laptop
    );


  const firstPhoto =
    laptop.photos?.[0]?.url;


  return `
    <tr>

      <td>

        <div class="laptop-name-cell">

          <div class="laptop-thumbnail">

            ${
              firstPhoto
                ? `
                  <img
                    src="${escapeAttribute(firstPhoto)}"
                    alt=""
                  >
                `
                : "◇"
            }

          </div>


          <div class="laptop-name-copy">

            <strong>
              ${escapeHTML(laptop.brand)}
              ${escapeHTML(laptop.model)}
            </strong>

            <span>
              ${escapeHTML(laptop.condition || "—")}
            </span>

          </div>

        </div>

      </td>


      <td>
        <span class="laptop-code">
          ${escapeHTML(laptop.internalCode)}
        </span>
      </td>


      <td>
        <span class="serial-number">
          ${escapeHTML(laptop.serialNumber)}
        </span>
      </td>


      <td>

        <div
          class="configuration-cell"
          title="${escapeAttribute(configuration)}"
        >
          ${escapeHTML(configuration || "—")}
        </div>

      </td>


      <td>
        <span class="battery-cell">
          ${escapeHTML(laptop.batteryHealth || "—")}
        </span>
      </td>


      <td>

        <span class="${
          laptop.chargerReceived === "Yes"
            ? "charger-yes"
            : "charger-no"
        }">

          ${
            laptop.chargerReceived === "Yes"
              ? "Yes"
              : "No"
          }

        </span>

      </td>


      <td>
        ${formatMoney(laptop.customerPrice)}
      </td>


      <td>
        ${createLaptopStatusHTML(laptop.status)}
      </td>


      <td>

        <button
          class="laptop-action-button stock-view-details"
          type="button"
          data-laptop-id="${escapeAttribute(laptop.id)}"
        >
          Details
        </button>

      </td>

    </tr>
  `;
}


/* =========================================================
   EMPTY STOCK
   ========================================================= */

function createLaptopEmptyState(
  filteredEmpty
) {
  return `
    <tr class="empty-product-row">

      <td colspan="9">

        <div class="products-empty-state">

          <div class="products-empty-icon">
            ◇
          </div>

          <h3>
            ${
              filteredEmpty
                ? "No matching laptops"
                : "No laptops in stock yet"
            }
          </h3>

          <p>
            ${
              filteredEmpty
                ? "Try changing your search or filters."
                : "Receive your first delivery to start individual laptop tracking."
            }
          </p>

          ${
            !filteredEmpty
              ? `
                <button
                  class="empty-add-btn"
                  id="emptyReceiveLaptopButton"
                  type="button"
                >
                  ＋ Receive First Laptop
                </button>
              `
              : ""
          }

        </div>

      </td>

    </tr>
  `;
}


/* =========================================================
   STOCK SUMMARY
   ========================================================= */

function updateStockSummary() {
  const inStock =
    laptops.filter(
      (laptop) =>
        laptop.status ===
          "in-stock"
    ).length;


  const returned =
    laptops.filter(
      (laptop) =>
        laptop.status ===
          "returned"
    ).length;


  const service =
    laptops.filter(
      (laptop) =>
        laptop.status ===
          "service"
    ).length;


  setText(
    "stockTotalCount",
    inStock
  );

  setText(
    "readyForSaleCount",
    inStock
  );

  setText(
    "returnedStockCount",
    returned
  );

  setText(
    "serviceStockCount",
    service
  );
}


/* =========================================================
   STATUS
   ========================================================= */

function createLaptopStatusHTML(
  status
) {
  const map = {
    "in-stock": [
      "In Stock",
      "status-in"
    ],

    sold: [
      "Sold",
      "status-out"
    ],

    returned: [
      "Returned",
      "status-returned"
    ],

    service: [
      "In Service",
      "status-service"
    ],

    missing: [
      "Missing",
      "status-missing"
    ]
  };


  const [
    label,
    className
  ] =
    map[status] ||
    map["in-stock"];


  return `
    <span class="stock-status ${className}">
      ${label}
    </span>
  `;
}


/* =========================================================
   DETAILS
   ========================================================= */

function bindLaptopRowButtons() {
  document
    .querySelectorAll(
      ".stock-view-details"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          showLaptopQuickDetails(
            button.dataset.laptopId
          );
        }
      );
    });
}


function showLaptopQuickDetails(
  laptopId
) {
  const laptop =
    laptops.find(
      (item) =>
        item.id === laptopId
    );


  if (!laptop) {
    return;
  }


  const openCustomer =
    confirm(
      `${laptop.brand} ${laptop.model}\n\n` +
      `Code: ${laptop.internalCode}\n` +
      `Serial: ${laptop.serialNumber}\n` +
      `Delivered By: ${laptop.deliveredBy}\n` +
      `Carrying By: ${laptop.carryingBy}\n` +
      `Received: ${laptop.receivedDate}\n\n` +
      `Press OK for Customer View.\n` +
      `Cancel to stay here.`
    );


  if (openCustomer) {
    openCustomerLaptopView(
      laptop.id
    );
  }
}


/* =========================================================
   CUSTOMER VIEW
   ========================================================= */

function openCustomerLaptopSelector() {
  const available =
    laptops.filter(
      (laptop) =>
        laptop.status ===
          "in-stock"
    );


  if (
    available.length === 0
  ) {
    alert(
      "There is no in-stock laptop to show."
    );

    return;
  }


  if (
    available.length === 1
  ) {
    openCustomerLaptopView(
      available[0].id
    );

    return;
  }


  const list =
    available
      .map(
        (laptop, index) =>
          `${index + 1}. ${laptop.brand} ${laptop.model} — ${laptop.serialNumber}`
      )
      .join("\n");


  const answer =
    prompt(
      `Select laptop number:\n\n${list}`
    );


  const index =
    Number(answer) - 1;


  if (
    Number.isInteger(index) &&
    available[index]
  ) {
    openCustomerLaptopView(
      available[index].id
    );
  }
}


function openCustomerLaptopView(
  laptopId
) {
  const laptop =
    laptops.find(
      (item) =>
        item.id === laptopId
    );


  const screen =
    document.getElementById(
      "customerViewScreen"
    );


  if (
    !laptop ||
    !screen
  ) {
    return;
  }


  screen.innerHTML = `
    <div class="customer-view-shell">

      <div class="customer-view-brand">
        Laddu <span>Hub</span>
      </div>


      <div style="
        width: min(720px, 100%);
        margin: 45px auto;
      ">

        <p class="dashboard-kicker">
          LAPTOP DETAILS
        </p>


        <h1 style="
          margin-bottom: 8px;
          font-size: 30px;
          letter-spacing: -1px;
        ">
          ${escapeHTML(laptop.brand)}
          ${escapeHTML(laptop.model)}
        </h1>


        <p style="
          color: #7b8498;
          font-size: 11px;
          line-height: 1.7;
        ">
          ${escapeHTML(buildConfigurationText(laptop) || "Laptop details")}
        </p>


        <div style="
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-top: 25px;
        ">

          ${customerInfoCard(
            "Battery Health",
            laptop.batteryHealth ||
              "—"
          )}

          ${customerInfoCard(
            "Condition",
            laptop.condition ||
              "—"
          )}

          ${customerInfoCard(
            "Charger",
            laptop.chargerReceived ===
              "Yes"
              ? "Included"
              : "Not Included"
          )}

          ${customerInfoCard(
            "Price",
            formatMoney(
              laptop.customerPrice
            )
          )}

        </div>


        ${
          laptop.visibleNote
            ? `
              <div style="
                margin-top: 20px;
                padding: 16px;
                border-radius: 12px;
                background: #f7f8fc;
              ">

                <strong style="
                  display: block;
                  margin-bottom: 5px;
                  font-size: 10px;
                ">
                  Condition Note
                </strong>

                <p style="
                  color: #707b90;
                  font-size: 10px;
                  line-height: 1.6;
                ">
                  ${escapeHTML(laptop.visibleNote)}
                </p>

              </div>
            `
            : ""
        }


        ${createCustomerPhotosHTML(
          laptop.photos
        )}


        <button
          type="button"
          onclick="closeCustomerView()"
          style="
            margin-top: 28px;
            padding: 10px 15px;
            border: 1px solid #e4e7ef;
            border-radius: 10px;
            background: white;
            color: #8a93a5;
            font-size: 9px;
          "
        >
          Back
        </button>

      </div>

    </div>
  `;


  screen.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";
}


function customerInfoCard(
  title,
  value
) {
  return `
    <div style="
      padding: 16px;
      border: 1px solid #e7eaf2;
      border-radius: 13px;
      background: white;
    ">

      <span style="
        display: block;
        color: #8a93a5;
        font-size: 8px;
        font-weight: 800;
        text-transform: uppercase;
      ">
        ${escapeHTML(title)}
      </span>

      <strong style="
        display: block;
        margin-top: 5px;
        color: #14213d;
        font-size: 13px;
      ">
        ${escapeHTML(value)}
      </strong>

    </div>
  `;
}


function createCustomerPhotosHTML(
  photos
) {
  if (
    !photos ||
    photos.length === 0
  ) {
    return "";
  }


  return `
    <div style="
      display: grid;
      grid-template-columns:
        repeat(auto-fit, minmax(140px, 1fr));
      gap: 10px;
      margin-top: 20px;
    ">

      ${photos
        .map(
          (photo) => `
            <img
              src="${escapeAttribute(photo.url)}"
              alt="Laptop"
              style="
                width: 100%;
                height: 160px;
                object-fit: cover;
                border-radius: 12px;
                border: 1px solid #e7eaf2;
              "
            >
          `
        )
        .join("")}

    </div>
  `;
}


function closeCustomerView() {
  const screen =
    document.getElementById(
      "customerViewScreen"
    );


  screen?.classList.add(
    "hidden"
  );


  document.body.style.overflow =
    "";
}


/* =========================================================
   CONFIGURATION
   ========================================================= */

function buildConfigurationText(
  laptop
) {
  return [
    laptop.processor,
    laptop.generation,
    laptop.ram,
    laptop.storage,
    laptop.graphics,
    laptop.display,
    laptop.touch === "Yes"
      ? "Touch"
      : ""
  ]
    .filter(Boolean)
    .join(" • ");
}


/* =========================================================
   TEMPORARY PAGE
   ========================================================= */

function showComingSoonPage(
  pageName
) {
  prepareDynamicPage();


  pageContent.innerHTML = `
    <section class="temporary-app-page">

      <div class="temporary-page-icon">
        LH
      </div>

      <p class="dashboard-kicker">
        LADDU HUB
      </p>

      <h1>
        ${escapeHTML(pageName)}
      </h1>

      <p>
        This section will be built according to your laptop business workflow.
      </p>

      <button
        type="button"
        onclick="showDashboardHome()"
      >
        Back to Dashboard
      </button>

    </section>
  `;
}


/* =========================================================
   FIELD HELPERS
   ========================================================= */

function valueOf(id) {
  const element =
    document.getElementById(id);


  if (!element) {
    return "";
  }


  return String(
    element.value || ""
  ).trim();
}


function fieldValue(
  parent,
  selector
) {
  const element =
    parent.querySelector(
      selector
    );


  if (!element) {
    return "";
  }


  return String(
    element.value || ""
  ).trim();
}


function setText(
  id,
  value
) {
  const element =
    document.getElementById(id);


  if (element) {
    element.textContent =
      String(value);
  }
}


function normaliseKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}


/* =========================================================
   HELPERS
   ========================================================= */

function formatMoney(value) {
  const number =
    Number(value) || 0;


  return (
    "৳" +
    new Intl.NumberFormat(
      "en-BD",
      {
        maximumFractionDigits: 0
      }
    ).format(number)
  );
}


function getTodayDateInputValue() {
  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  return `${year}-${month}-${day}`;
}


function createPrototypeId() {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }


  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2)
  );
}


function escapeHTML(value) {
  const element =
    document.createElement(
      "div"
    );


  element.textContent =
    String(value ?? "");


  return element.innerHTML;
}


function escapeAttribute(value) {
  return escapeHTML(value)
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#39;"
    );
}


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {
    const key =
      typeof event.key ===
        "string"
        ? event.key.toLowerCase()
        : "";


    if (
      (event.ctrlKey ||
        event.metaKey) &&
      key === "k"
    ) {
      event.preventDefault();

      globalSearchInput?.focus();
    }


    if (
      key === "escape"
    ) {
      const customerScreen =
        document.getElementById(
          "customerViewScreen"
        );


      if (
        customerScreen &&
        !customerScreen
          .classList
          .contains("hidden")
      ) {
        closeCustomerView();

        return;
      }


      const receiveModal =
        document.getElementById(
          "receiveLaptopModal"
        );


      if (
        receiveModal &&
        !receiveModal
          .classList
          .contains("hidden")
      ) {
        closeReceiveLaptopModal();

        return;
      }


      closeSidebar();
    }
  }
);


/* =========================================================
   LOGIN INPUT
   ========================================================= */

usernameInput.addEventListener(
  "input",
  hideLoginError
);


passwordInput.addEventListener(
  "input",
  hideLoginError
);


/* =========================================================
   INITIAL APP
   ========================================================= */

function initialiseApp() {
  document.body.classList.remove(
    "dashboard-visible"
  );

    dashboard.style.display =
    "none";

  authPage.style.display = "";

  clearDynamicPage();

  updateDemoIdentity();

  hideLoginError();

  setActiveNavigation(
    "Dashboard"
  );
}


initialiseApp();
