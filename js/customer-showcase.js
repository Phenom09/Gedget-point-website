/* LADDU HUB — PREMIUM CUSTOMER SHOWCASE */

(function () {

  document.addEventListener(
    "laddu:customer-view-request",
    function (event) {

      const id =
        event.detail?.laptopId;

      if (
        !id ||
        !window.LadduStockData
      ) {
        return;
      }

      /*
        Prevent the old customer-view.js
        from opening another view.
      */

      event.stopImmediatePropagation();

      const record =
        window.LadduStockData
          .findLaptopById(id);

      if (!record) {
        return;
      }

      openShowcase(
        createSafeData(record)
      );

    },
    true
  );


  function createSafeData(record) {

    return {
      brand: clean(record.brand),
      model: clean(record.model),
      serial: clean(record.serialNumber),

      processor: clean(record.processor),
      generation: clean(record.generation),
      ram: clean(record.ram),
      storage: clean(record.storage),
      graphics: clean(record.graphics),
      display: clean(record.display),
      touch: clean(record.touch),

      battery: clean(record.batteryHealth),
      condition: clean(record.condition),
      charger: clean(record.chargerReceived),

      body: clean(record.bodyStatus),
      displayStatus:
        clean(record.displayStatus),
      keyboard:
        clean(record.keyboardStatus),

      warranty:
        clean(record.warrantyDays),

      note:
        clean(record.visibleNote),

      photos:
        Array.isArray(record.photos)
          ? record.photos
              .filter(photo => photo?.url)
              .map(photo => ({
                url: String(photo.url)
              }))
          : []
    };

  }


  function openShowcase(laptop) {

    closeShowcase();

    const screen =
      document.createElement("div");

    screen.id =
      "premiumCustomerShowcase";

    screen.className =
      "premium-customer-showcase";

    screen.innerHTML =
      showcaseHTML(laptop);

    document.body.appendChild(
      screen
    );

    document.body.style.overflow =
      "hidden";

    screen
      .querySelector(
        "#showcaseBack"
      )
      ?.addEventListener(
        "click",
        closeShowcase
      );

    bindGallery(screen);

  }


  function showcaseHTML(laptop) {

    const name =
      [laptop.brand, laptop.model]
        .filter(Boolean)
        .join(" ");

    const conditions =
      conditionCards(laptop);

    const specs =
      specificationCards(laptop);

    return `
      <main class="showcase-shell">

        <header class="showcase-header">

          <button
            id="showcaseBack"
            class="showcase-brand-button"
            type="button"
            aria-label="Back"
          >
            <span class="showcase-brand-mark">
              LH
            </span>

            <span class="showcase-brand-name">
              Laddu <strong>Hub</strong>
            </span>
          </button>

          <span class="showcase-header-caption">
            Premium Laptop Collection
          </span>

        </header>


        <div class="showcase-content">

          <section class="showcase-title">

            <span class="showcase-eyebrow">
              PREMIUM USED LAPTOP
            </span>

            <h1>
              ${html(name || "Laptop")}
            </h1>

            ${
              laptop.serial
                ? `
                  <p class="showcase-serial">
                    Serial Number
                    <strong>
                      ${html(laptop.serial)}
                    </strong>
                  </p>
                `
                : ""
            }

          </section>


          ${galleryHTML(laptop.photos)}


          ${highlightHTML(laptop)}


          ${
            conditions
              ? `
                <section class="showcase-section">

                  <div class="showcase-section-heading">
                    <span>CONDITION OVERVIEW</span>
                    <h2>
                      Condition at a glance
                    </h2>
                  </div>

                  <div class="showcase-condition-grid">
                    ${conditions}
                  </div>

                </section>
              `
              : ""
          }


          ${
            specs
              ? `
                <section class="showcase-section">

                  <div class="showcase-section-heading">
                    <span>SPECIFICATIONS</span>
                    <h2>
                      Device details
                    </h2>
                  </div>

                  <div class="showcase-spec-grid">
                    ${specs}
                  </div>

                </section>
              `
              : ""
          }


          ${
            laptop.note
              ? `
                <section class="showcase-note-card">

                  <div class="showcase-note-icon">
                    ✓
                  </div>

                  <div>
                    <span>CONDITION NOTE</span>

                    <p>
                      ${html(laptop.note)}
                    </p>
                  </div>

                </section>
              `
              : ""
          }


          ${warrantyHTML(
            laptop.warranty
          )}

        </div>


        <footer class="showcase-footer">
          <span>Laddu Hub</span>
          <span>
            Laptop details & condition overview
          </span>
        </footer>

      </main>
    `;

  }


  function galleryHTML(photos) {

    if (!photos.length) {

      return `
        <section class="showcase-photo-placeholder">

          <div>
            ◇
          </div>

          <strong>
            Laptop Photo
          </strong>

        </section>
      `;

    }

    return `
      <section class="showcase-gallery">

        <div class="showcase-main-photo">

          <img
            id="showcaseMainImage"
            src="${attr(photos[0].url)}"
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
                        type="button"
                        class="showcase-thumbnail ${
                          index === 0
                            ? "active"
                            : ""
                        }"
                        data-url="${attr(
                          photo.url
                        )}"
                      >
                        <img
                          src="${attr(
                            photo.url
                          )}"
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


  function highlightHTML(laptop) {

    const highlights = [
      [
        "Processor",
        join(
          laptop.processor,
          laptop.generation
        )
      ],
      ["Memory", laptop.ram],
      ["Storage", laptop.storage],
      ["Display", laptop.display]
    ].filter(item => item[1]);

    if (!highlights.length) {
      return "";
    }

    return `
      <section class="showcase-section">

        <div class="showcase-section-heading">
          <span>KEY HIGHLIGHTS</span>
          <h2>
            Quick laptop overview
          </h2>
        </div>

        <div class="showcase-highlight-grid">

          ${highlights
            .map(
              item => `
                <div class="showcase-highlight">
                  <span>
                    ${html(item[0])}
                  </span>

                  <strong>
                    ${html(item[1])}
                  </strong>
                </div>
              `
            )
            .join("")}

        </div>

      </section>
    `;

  }


  function conditionCards(laptop) {

    const items = [];

    if (laptop.condition) {
      items.push([
        "Overall Condition",
        laptop.condition
      ]);
    }

    if (laptop.charger) {
      items.push([
        "Charger",
        laptop.charger === "Yes"
          ? "Included"
          : "Not Included"
      ]);
    }

    /*
      Battery is completely hidden
      when it was not entered.
    */

    if (laptop.battery) {
      items.push([
        "Battery Health",
        laptop.battery
      ]);
    }

    addOptionalCondition(
      items,
      "Body",
      laptop.body
    );

    addOptionalCondition(
      items,
      "Display",
      laptop.displayStatus
    );

    addOptionalCondition(
      items,
      "Keyboard",
      laptop.keyboard
    );

    return items
      .map(
        item => `
          <div class="showcase-condition-card">

            <span>
              ${html(item[0])}
            </span>

            <strong>
              ${html(item[1])}
            </strong>

          </div>
        `
      )
      .join("");

  }


  function addOptionalCondition(
    list,
    label,
    value
  ) {

    if (
      !value ||
      value === "Not Checked"
    ) {
      return;
    }

    list.push([
      label,
      value
    ]);

  }


  function specificationCards(
    laptop
  ) {

    const specs = [
      ["Model", laptop.model],
      ["Serial Number", laptop.serial],
      ["Processor", laptop.processor],
      ["Generation", laptop.generation],
      ["RAM", laptop.ram],
      ["Storage", laptop.storage],
      ["Graphics", laptop.graphics],
      ["Display", laptop.display],
      ["Touch", laptop.touch]
    ].filter(item => item[1]);

    return specs
      .map(
        item => `
          <div class="showcase-spec-item">

            <span>
              ${html(item[0])}
            </span>

            <strong>
              ${html(item[1])}
            </strong>

          </div>
        `
      )
      .join("");

  }


  function warrantyHTML(days) {

    if (!days) {
      return "";
    }

    return `
      <section class="showcase-warranty">

        <div class="showcase-warranty-icon">
          ✓
        </div>

        <div class="showcase-warranty-content">

          <span class="showcase-warranty-label">
            WARRANTY & SERVICE SUPPORT
          </span>

          <h2>
            Service support included
          </h2>

          <div class="showcase-warranty-item">

            <strong>
              ✓ ${html(days)}
              Days Complete Service Coverage
            </strong>

            <p>
              Covered issue হলে parts &amp; service
              আমাদের পক্ষ থেকে।
            </p>

          </div>

          <div class="showcase-warranty-item">

            <strong>
              ✓ Up to 6 Months Service Support
            </strong>

            <p>
              Service charge covered.
              প্রয়োজনীয় parts-এর cost customer
              বহন করবেন।
            </p>

          </div>

        </div>

      </section>
    `;

  }


  function bindGallery(screen) {

    const main =
      screen.querySelector(
        "#showcaseMainImage"
      );

    screen
      .querySelectorAll(
        ".showcase-thumbnail"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          function () {

            if (main) {
              main.src =
                button.dataset.url || "";
            }

            screen
              .querySelectorAll(
                ".showcase-thumbnail"
              )
              .forEach(item => {
                item.classList.remove(
                  "active"
                );
              });

            button.classList.add(
              "active"
            );

          }
        );

      });

  }


  function closeShowcase() {

    document
      .getElementById(
        "premiumCustomerShowcase"
      )
      ?.remove();

    document.body.style.overflow =
      "";

  }


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        document.getElementById(
          "premiumCustomerShowcase"
        )
      ) {
        closeShowcase();
      }

    }
  );


  function clean(value) {
    return String(
      value ?? ""
    ).trim();
  }


  function join(a, b) {
    return [a, b]
      .filter(Boolean)
      .join(" • ");
  }


  function html(value) {

    const element =
      document.createElement("div");

    element.textContent =
      String(value ?? "");

    return element.innerHTML;

  }


  function attr(value) {

    return html(value)
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