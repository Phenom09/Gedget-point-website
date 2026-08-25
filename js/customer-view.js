/* =========================================================
   LADDU HUB
   PREMIUM CUSTOMER LAPTOP VIEW
   ========================================================= */

(function () {

  document.addEventListener(
    "laddu:customer-view-request",
    (event) => {

      const laptopId =
        event.detail?.laptopId;

      if (laptopId) {
        openCustomerView(laptopId);
      }

    }
  );


  /* =======================================================
     OPEN
     ======================================================= */

  function openCustomerView(laptopId) {

    if (!window.LadduStockData) {
      return;
    }


    const internal =
      window.LadduStockData
        .findLaptopById(laptopId);


    if (!internal) {
      return;
    }


    const laptop =
      createSafeRecord(internal);


    closeCustomerView();


    const screen =
      document.createElement("div");


    screen.id =
      "safeCustomerView";


    screen.className =
      "safe-customer-view premium-showcase";


    screen.innerHTML =
      createView(laptop);


    document.body.appendChild(screen);


    document.body.style.overflow =
      "hidden";


    screen
      .querySelector(
        "#customerBrandBack"
      )
      ?.addEventListener(
        "click",
        closeCustomerView
      );


    initialiseGallery(screen);

  }


  /* =======================================================
     CUSTOMER-SAFE DATA ONLY
     ======================================================= */

  function createSafeRecord(record) {

    return {

      brand:
        record.brand || "",

      model:
        record.model || "",

      serialNumber:
        record.serialNumber || "",

      processor:
        record.processor || "",

      generation:
        record.generation || "",

      ram:
        record.ram || "",

      storage:
        record.storage || "",

      graphics:
        record.graphics || "",

      display:
        record.display || "",

      touch:
        record.touch || "",

      batteryHealth:
        record.batteryHealth || "",

      condition:
        record.condition || "",

      charger:
        record.chargerReceived || "",

      bodyStatus:
        record.bodyStatus || "",

      displayStatus:
        record.displayStatus || "",

      keyboardStatus:
        record.keyboardStatus || "",

      warrantyDays:
        record.warrantyDays || "",

      visibleNote:
        record.visibleNote || "",

      photos:
        Array.isArray(record.photos)
          ? record.photos
              .filter(
                (photo) =>
                  Boolean(photo.url)
              )
              .map(
                (photo) => ({
                  url: photo.url
                })
              )
          : []

    };

  }


  /* =======================================================
     VIEW
     ======================================================= */

  function createView(laptop) {

    const highlights =
      createHighlights(laptop);


    const conditionCards =
      createConditionCards(laptop);


    return `

      <main class="safe-customer-shell premium-showcase-shell">

        <!-- TOP BRAND -->

        <header class="safe-customer-header">

          <button
            class="safe-customer-brand safe-brand-back"
            id="customerBrandBack"
            type="button"
            aria-label="Back"
          >
            Laddu <span>Hub</span>
          </button>

        </header>


        <section class="premium-showcase-content">


          <!-- HERO -->

          <div class="showcase-hero">

            <p class="showcase-eyebrow">
              PREMIUM USED LAPTOP
            </p>


            <h1>
              ${escapeHTML(laptop.brand)}
              ${escapeHTML(laptop.model)}
            </h1>


            ${
              laptop.serialNumber
                ? `
                  <p class="showcase-serial">
                    Serial Number:
                    <strong>
                      ${escapeHTML(laptop.serialNumber)}
                    </strong>
                  </p>
                `
                : ""
            }


            ${
              highlights
                ? `
                  <div class="showcase-highlight-line">
                    ${highlights}
                  </div>
                `
                : ""
            }

          </div>


          <!-- PHOTO GALLERY -->

          ${createGallery(laptop.photos)}


          <!-- QUICK CONDITION -->

          ${
            conditionCards
              ? `
                <section class="showcase-condition-grid">
                  ${conditionCards}
                </section>
              `
              : ""
          }


          <!-- CUSTOMER NOTE -->

          ${
            laptop.visibleNote
              ? `
                <section class="showcase-note">

                  <div class="showcase-note-icon">
                    ✓
                  </div>

                  <div>

                    <span>
                      CONDITION NOTE
                    </span>

                    <p>
                      ${escapeHTML(laptop.visibleNote)}
                    </p>

                  </div>

                </section>
              `
              : ""
          }


          <!-- SPECIFICATIONS -->

          ${createSpecificationSection(laptop)}


          <!-- WARRANTY -->

          ${createWarrantySection(laptop)}


          <!-- CLEAN END -->

          <div class="showcase-signature">
            <span>
              Laddu Hub
            </span>

            <p>
              Smart laptop information, beautifully presented.
            </p>
          </div>

        </section>

      </main>

    `;

  }


  /* =======================================================
     HIGHLIGHTS
     ======================================================= */

  function createHighlights(laptop) {

    const items = [

      laptop.processor,

      laptop.generation,

      laptop.ram
        ? `${laptop.ram} RAM`
        : "",

      laptop.storage,

      laptop.display

    ].filter(Boolean);


    return items
      .map(
        (item) => `
          <span>
            ${escapeHTML(item)}
          </span>
        `
      )
      .join("");

  }


  /* =======================================================
     CONDITION CARDS

     Blank / not checked values do not render.
     ======================================================= */

  function createConditionCards(
    laptop
  ) {

    const cards = [];


    if (laptop.condition) {

      cards.push(
        conditionCard(
          "Condition",
          laptop.condition,
          "✓"
        )
      );

    }


    if (laptop.charger) {

      cards.push(
        conditionCard(
          "Charger",
          laptop.charger === "Yes"
            ? "Included"
            : "Not Included",
          "⚡"
        )
      );

    }


    if (laptop.batteryHealth) {

      cards.push(
        conditionCard(
          "Battery Health",
          laptop.batteryHealth,
          "◉"
        )
      );

    }


    if (laptop.bodyStatus) {

      cards.push(
        conditionCard(
          "Body",
          laptop.bodyStatus,
          "◇"
        )
      );

    }


    if (laptop.displayStatus) {

      cards.push(
        conditionCard(
          "Display",
          laptop.displayStatus,
          "▣"
        )
      );

    }


    if (laptop.keyboardStatus) {

      cards.push(
        conditionCard(
          "Keyboard",
          laptop.keyboardStatus,
          "⌨"
        )
      );

    }


    return cards.join("");

  }


  function conditionCard(
    title,
    value,
    icon
  ) {

    return `

      <div class="showcase-condition-card">

        <div>
          ${icon}
        </div>

        <span>
          ${escapeHTML(title)}
        </span>

        <strong>
          ${escapeHTML(value)}
        </strong>

      </div>

    `;

  }


  /* =======================================================
     SPECIFICATION
     ======================================================= */

  function createSpecificationSection(
    laptop
  ) {

    const specifications = [

      ["Processor", laptop.processor],

      ["Generation", laptop.generation],

      ["RAM", laptop.ram],

      ["Storage", laptop.storage],

      ["Graphics", laptop.graphics],

      ["Display", laptop.display],

      [
        "Touch",
        laptop.touch
          ? laptop.touch
          : ""
      ]

    ].filter(
      ([, value]) =>
        Boolean(value)
    );


    if (
      specifications.length === 0
    ) {
      return "";
    }


    return `

      <section class="showcase-specification">

        <div class="showcase-section-heading">

          <p>
            DEVICE DETAILS
          </p>

          <h2>
            Laptop Specifications
          </h2>

          <span>
            Everything you need to know at a glance.
          </span>

        </div>


        <div class="showcase-spec-grid">

          ${specifications
            .map(
              ([label, value]) => `

                <div class="showcase-spec-item">

                  <span>
                    ${escapeHTML(label)}
                  </span>

                  <strong>
                    ${escapeHTML(value)}
                  </strong>

                </div>

              `
            )
            .join("")}

        </div>

      </section>

    `;

  }


  /* =======================================================
     WARRANTY
     ======================================================= */

  function createWarrantySection(
    laptop
  ) {

    if (!laptop.warrantyDays) {
      return "";
    }


    return `

      <section class="showcase-warranty">

        <div class="showcase-warranty-icon">
          ✓
        </div>


        <div class="showcase-warranty-content">

          <p>
            WARRANTY & SERVICE SUPPORT
          </p>

          <h2>
            Shop with added confidence
          </h2>


          <div class="warranty-benefit">

            <strong>
              ✓ ${escapeHTML(laptop.warrantyDays)}
              Days Complete Service Coverage
            </strong>

            <span>
              Covered issue হলে parts & service আমাদের পক্ষ থেকে।
            </span>

          </div>


          <div class="warranty-benefit">

            <strong>
              ✓ Up to 6 Months Service Support
            </strong>

            <span>
              Service charge covered. প্রয়োজনীয় parts-এর cost customer বহন করবেন।
            </span>

          </div>

        </div>

      </section>

    `;

  }


  /* =======================================================
     GALLERY
     ======================================================= */

  function createGallery(photos) {

    if (
      !photos ||
      photos.length === 0
    ) {

      return `

        <section class="showcase-photo-empty">

          <div>
            ◇
          </div>

          <span>
            Laptop Photo
          </span>

        </section>

      `;

    }


    return `

      <section class="showcase-gallery">

        <div class="showcase-main-photo">

          <img
            id="showcaseMainPhoto"
            src="${escapeAttribute(photos[0].url)}"
            alt="Laptop"
          >

        </div>


        ${
          photos.length > 1
            ? `
              <div class="showcase-thumbnails">

                ${photos
                  .map(
                    (photo, index) => `

                      <button
                        class="showcase-thumbnail ${
                          index === 0
                            ? "active"
                            : ""
                        }"
                        type="button"
                        data-photo="${escapeAttribute(photo.url)}"
                      >

                        <img
                          src="${escapeAttribute(photo.url)}"
                          alt=""
                        >

                      </button>

                    `
                  )
                  .join("")}

              </div>
            `
            : ""
        }

      </section>

    `;

  }


  function initialiseGallery(screen) {

    const main =
      screen.querySelector(
        "#showcaseMainPhoto"
      );


    if (!main) {
      return;
    }


    screen
      .querySelectorAll(
        ".showcase-thumbnail"
      )
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              main.src =
                button.dataset.photo;


              screen
                .querySelectorAll(
                  ".showcase-thumbnail"
                )
                .forEach(
                  (item) =>
                    item.classList.remove(
                      "active"
                    )
                );


              button.classList.add(
                "active"
              );

            }
          );

        }
      );

  }


  /* =======================================================
     CLOSE
     ======================================================= */

  function closeCustomerView() {

    document
      .getElementById(
        "safeCustomerView"
      )
      ?.remove();


    document.body.style.overflow =
      "";

  }


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        document.getElementById(
          "safeCustomerView"
        )
      ) {

        closeCustomerView();

      }

    }
  );


  /* =======================================================
     ESCAPE
     ======================================================= */

  function escapeHTML(value) {

    const element =
      document.createElement("div");


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

})();