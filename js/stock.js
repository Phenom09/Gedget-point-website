/* =========================================================
   LADDU HUB
   STOCK MODULE
   ========================================================= */

(function () {

  let stockInitialised = false;


  /* =======================================================
     FIND STOCK NAVIGATION BUTTON
     ======================================================= */

  function findStockNavigationButton() {

    const items =
      document.querySelectorAll(
        ".nav-item"
      );


    for (const item of items) {

      const spans =
        item.querySelectorAll(
          "span"
        );


      if (spans.length < 2) {
        continue;
      }


      const name =
        spans[1]
          .textContent
          .trim()
          .toLowerCase();


      if (name === "stock") {
        return item;
      }

    }


    return null;
  }


  /* =======================================================
     LOAD STOCK PAGE
     ======================================================= */

  async function loadStockModulePage() {

    const pageContent =
      document.getElementById(
        "pageContent"
      );


    if (!pageContent) {
      return;
    }


    hideDashboardHomeForStock();


    pageContent.style.display =
      "block";


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


      initialiseStockModule();
    
            document.dispatchEvent(
        new CustomEvent(
          "laddu:stock-page-ready"
        )
      );


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
            Please refresh Laddu Hub and try again.
          </p>

        </div>
      `;

    }

  }


  /* =======================================================
     HIDE DASHBOARD HOME
     ======================================================= */

  function hideDashboardHomeForStock() {

    const pageContent =
      document.getElementById(
        "pageContent"
      );


    if (!pageContent) {
      return;
    }


    let element =
      pageContent.nextElementSibling;


    while (element) {

      element.style.display =
        "none";


      element =
        element.nextElementSibling;

    }


    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

  }


  /* =======================================================
     INITIALISE STOCK PAGE
     ======================================================= */

  function initialiseStockModule() {

    stockInitialised = true;


    renderInitialLaptopCard();


    const receiveButton =
      document.getElementById(
        "receiveLaptopButton"
      );


    const emptyButton =
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


    const addAnotherButton =
      document.getElementById(
        "addAnotherLaptopButton"
      );


    receiveButton?.addEventListener(
      "click",
      openReceiveModal
    );


    emptyButton?.addEventListener(
      "click",
      openReceiveModal
    );


    closeButton?.addEventListener(
      "click",
      closeReceiveModal
    );


    cancelButton?.addEventListener(
      "click",
      closeReceiveModal
    );


    backdrop?.addEventListener(
      "click",
      closeReceiveModal
    );


    addAnotherButton?.addEventListener(
      "click",
      addLaptopCard
    );

  }


  /* =======================================================
     CREATE LAPTOP ENTRY CARD
     ======================================================= */

  function createLaptopEntryCard() {

    const card =
      document.createElement(
        "article"
      );


    card.className =
      "bulk-laptop-entry";


    card.innerHTML = `

      <div class="bulk-entry-header">

        <div>

          <span class="bulk-entry-number">
            LAPTOP 01
          </span>

          <strong class="bulk-entry-title">
            New Laptop
          </strong>

        </div>


        <button
          class="remove-laptop-entry hidden"
          type="button"
        >
          Remove
        </button>

      </div>


      <section class="bulk-entry-section">

        <div class="bulk-mini-heading">
          <span>◇</span>
          <strong>Identity</strong>
        </div>


        <div class="product-form-grid">

          <div class="product-field">

            <label>
              Internal Code
              <span>*</span>
            </label>

            <input
              class="entry-internal-code"
              type="text"
              placeholder="Example: BABU-20"
              required
            >

          </div>


          <div class="product-field">

            <label>
              Serial Number
              <span>*</span>
            </label>

            <input
              class="entry-serial-number"
              type="text"
              placeholder="Laptop serial number"
              required
            >

          </div>


          <div class="product-field">

            <label>
              Brand
              <span>*</span>
            </label>

            <select
              class="entry-brand"
              required
            >

              <option value="">
                Select brand
              </option>

              <option value="HP">
                HP
              </option>

              <option value="Dell">
                Dell
              </option>

              <option value="Lenovo">
                Lenovo
              </option>

              <option value="Microsoft Surface">
                Microsoft Surface
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          <div
            class="product-field hidden entry-other-brand-field"
          >

            <label>
              Brand Name
            </label>

            <input
              class="entry-other-brand"
              type="text"
              placeholder="Enter brand name"
            >

          </div>


          <div class="product-field">

            <label>
              Model
              <span>*</span>
            </label>

            <input
              class="entry-model"
              type="text"
              placeholder="Example: EliteBook 840 G8"
              required
            >

          </div>

        </div>

      </section>


      <section class="bulk-entry-section">

        <div class="bulk-mini-heading">
          <span>⚙</span>
          <strong>Configuration</strong>
        </div>


        <div class="product-form-grid">

          <div class="product-field">
            <label>Processor</label>

            <input
              class="entry-processor"
              type="text"
              placeholder="Core i5"
            >
          </div>


          <div class="product-field">
            <label>Generation</label>

            <input
              class="entry-generation"
              type="text"
              placeholder="11th Gen"
            >
          </div>


          <div class="product-field">
            <label>RAM</label>

            <input
              class="entry-ram"
              type="text"
              placeholder="16GB"
            >
          </div>


          <div class="product-field">
            <label>SSD / Storage</label>

            <input
              class="entry-storage"
              type="text"
              placeholder="512GB SSD"
            >
          </div>


          <div class="product-field">
            <label>Graphics</label>

            <input
              class="entry-graphics"
              type="text"
              placeholder="Intel Iris Xe"
            >
          </div>


          <div class="product-field">
            <label>Display</label>

            <input
              class="entry-display"
              type="text"
              placeholder='14" FHD'
            >
          </div>


          <div class="product-field">

            <label>Touch</label>

            <select class="entry-touch">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>

          </div>


          <div class="product-field">

            <label>Battery Health</label>

            <input
              class="entry-battery-health"
              type="text"
              placeholder="88%"
            >

          </div>

        </div>

      </section>


      <section class="bulk-entry-section">

        <div class="bulk-mini-heading">
          <span>✓</span>
          <strong>Condition & Charger</strong>
        </div>
        <div class="product-field">

  <label>
    Body
  </label>

  <select class="entry-body-status">

    <option value="">
      Not Checked
    </option>

    <option value="Original">
      Original
    </option>

    <option value="Changed">
      Changed
    </option>

  </select>

</div>


<div class="product-field">

  <label>
    Display
  </label>

  <select class="entry-display-status">

    <option value="">
      Not Checked
    </option>

    <option value="Original">
      Original
    </option>

    <option value="Changed">
      Changed
    </option>

  </select>

</div>


<div class="product-field">

  <label>
    Keyboard
  </label>

  <select class="entry-keyboard-status">

    <option value="">
      Not Checked
    </option>

    <option value="Original">
      Original
    </option>

    <option value="Changed">
      Changed
    </option>

  </select>

</div>


<div class="product-field">

  <label>
    Warranty
  </label>

  <select class="entry-warranty">

    <option value="">
      No Warranty Selected
    </option>

    <option value="7">
      7 Days
    </option>

    <option value="14">
      14 Days
    </option>

    <option value="15">
      15 Days
    </option>

  </select>

</div>



        <div class="product-form-grid">

          <div class="product-field">

            <label>Condition</label>

            <select class="entry-condition">
              <option>Excellent</option>
              <option>Good</option>
              <option>Average</option>
              <option>Has Issue</option>
            </select>

          </div>


          <div class="product-field">

            <label>
              Charger Received?
            </label>

            <select class="entry-charger">
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

          </div>


          <div class="product-field field-wide">

            <label>
              Customer Visible Condition Note
            </label>

            <textarea
              class="product-textarea entry-visible-note"
              placeholder="Visible condition note..."
            ></textarea>

          </div>


          <div class="product-field field-wide">

            <label>
              Internal Note
            </label>

            <textarea
              class="product-textarea internal-note-field entry-internal-note"
              placeholder="Private internal note..."
            ></textarea>

          </div>

        </div>

      </section>


      <section class="bulk-entry-section">

        <div class="bulk-mini-heading">
          <span>▧</span>
          <strong>Photos & Price</strong>
        </div>


        <div class="entry-photo-area">

          <input
            class="entry-photo-input"
            type="file"
            accept="image/*"
            multiple
            hidden
          >


          <button
            class="entry-photo-button"
            type="button"
          >

            <span>＋</span>

            <div>
              <strong>
                Upload Laptop Photos
              </strong>

              <small>
                Add condition or stock photos
              </small>
            </div>

          </button>


          <div
            class="photo-preview-grid entry-photo-preview"
          ></div>

        </div>


        <div class="product-form-grid bulk-price-grid">

          <div class="product-field">

            <label>
              Customer Price
            </label>


            <div class="money-input">

              <span>৳</span>

              <input
                class="entry-customer-price"
                type="number"
                min="0"
                placeholder="0"
              >

            </div>

          </div>

        </div>

      </section>

    `;


    initialiseLaptopCard(card);


    return card;

  }


  /* =======================================================
     INITIALISE ONE CARD
     ======================================================= */

  function initialiseLaptopCard(card) {

    const brand =
      card.querySelector(
        ".entry-brand"
      );


    const otherField =
      card.querySelector(
        ".entry-other-brand-field"
      );


    const otherInput =
      card.querySelector(
        ".entry-other-brand"
      );


    const model =
      card.querySelector(
        ".entry-model"
      );


    const title =
      card.querySelector(
        ".bulk-entry-title"
      );


    const remove =
      card.querySelector(
        ".remove-laptop-entry"
      );


    const photoButton =
      card.querySelector(
        ".entry-photo-button"
      );


    const photoInput =
      card.querySelector(
        ".entry-photo-input"
      );


    brand?.addEventListener(
      "change",
      () => {

        const other =
          brand.value === "Other";


        otherField?.classList.toggle(
          "hidden",
          !other
        );


        if (otherInput) {
          otherInput.required =
            other;
        }


        updateCardTitle();

      }
    );


    model?.addEventListener(
      "input",
      updateCardTitle
    );


    otherInput?.addEventListener(
      "input",
      updateCardTitle
    );


    remove?.addEventListener(
      "click",
      () => {

        card.remove();

        updateLaptopNumbers();

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

        previewPhotos(
          card,
          photoInput.files
        );

      }
    );


    function updateCardTitle() {

      let brandName =
        brand?.value || "";


      if (
        brandName === "Other"
      ) {
        brandName =
          otherInput?.value || "";
      }


      const modelName =
        model?.value || "";


      const name =
        `${brandName} ${modelName}`
          .trim();


      if (title) {
        title.textContent =
          name || "New Laptop";
      }

    }

  }


  /* =======================================================
     PHOTO PREVIEW
     ======================================================= */

  function previewPhotos(
    card,
    fileList
  ) {

    const preview =
      card.querySelector(
        ".entry-photo-preview"
      );


    if (!preview) {
      return;
    }


    preview.innerHTML = "";


    const files =
      Array.from(
        fileList || []
      ).slice(0, 6);


    files.forEach((file) => {

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        return;
      }


      const url =
        URL.createObjectURL(file);


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


      image.src = url;

      image.alt =
        "Laptop preview";


      image.onload = () => {
        URL.revokeObjectURL(url);
      };


      item.appendChild(image);

      preview.appendChild(item);

    });

  }


  /* =======================================================
     INITIAL CARD
     ======================================================= */

  function renderInitialLaptopCard() {

    const container =
      document.getElementById(
        "bulkLaptopEntries"
      );


    if (!container) {
      return;
    }


    container.innerHTML = "";


    container.appendChild(
      createLaptopEntryCard()
    );


    updateLaptopNumbers();

  }


  /* =======================================================
     ADD LAPTOP
     ======================================================= */

  function addLaptopCard() {

    const container =
      document.getElementById(
        "bulkLaptopEntries"
      );


    if (!container) {
      return;
    }


    container.appendChild(
      createLaptopEntryCard()
    );


    updateLaptopNumbers();


    container
      .lastElementChild
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }


  /* =======================================================
     NUMBERING
     ======================================================= */

  function updateLaptopNumbers() {

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


        const remove =
          card.querySelector(
            ".remove-laptop-entry"
          );


        if (number) {
          number.textContent =
            `LAPTOP ${String(
              index + 1
            ).padStart(2, "0")}`;
        }


        remove?.classList.toggle(
          "hidden",
          cards.length === 1
        );

      }
    );


    const count =
      cards.length;


    const countText =
      count === 1
        ? "1 Laptop"
        : `${count} Laptops`;


    const buttonText =
      count === 1
        ? "Receive 1 Laptop"
        : `Receive ${count} Laptops`;


    const countElement =
      document.getElementById(
        "bulkLaptopCount"
      );


    const submitText =
      document.getElementById(
        "receiveLaptopSubmitText"
      );


    if (countElement) {
      countElement.textContent =
        countText;
    }


    if (submitText) {
      submitText.textContent =
        buttonText;
    }

  }


  /* =======================================================
     MODAL
     ======================================================= */

  function openReceiveModal() {

    const modal =
      document.getElementById(
        "receiveLaptopModal"
      );


    if (!modal) {
      return;
    }


    renderInitialLaptopCard();


    const date =
      document.getElementById(
        "receivedDate"
      );


    if (date) {

      const today =
        new Date();


      const year =
        today.getFullYear();


      const month =
        String(
          today.getMonth() + 1
        ).padStart(2, "0");


      const day =
        String(
          today.getDate()
        ).padStart(2, "0");


      date.value =
        `${year}-${month}-${day}`;

    }


    modal.classList.remove(
      "hidden"
    );


    document.body.style.overflow =
      "hidden";

  }


  function closeReceiveModal() {

    document
      .getElementById(
        "receiveLaptopModal"
      )
      ?.classList.add(
        "hidden"
      );


    document.body.style.overflow =
      "";

  }


  /* =======================================================
     HOOK STOCK SIDEBAR
     ======================================================= */

  function hookStockNavigation() {

    const button =
      findStockNavigationButton();


    if (!button) {
      return;
    }


    /*
      Capture phase makes this module handle Stock before
      the old app.js navigation logic.
    */

    button.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        event.stopImmediatePropagation();


        document
          .querySelectorAll(
            ".nav-item"
          )
          .forEach(
            (item) => {
              item.classList.remove(
                "active"
              );
            }
          );


        button.classList.add(
          "active"
        );


        loadStockModulePage();

      },
      true
    );

  }


  /* =======================================================
     START MODULE
     ======================================================= */

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      hookStockNavigation();

    }
  );

})();