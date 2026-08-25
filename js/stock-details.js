/* =========================================================
   LADDU HUB
   INTERNAL LAPTOP DETAILS MODULE
   ========================================================= */

(function () {

  /* =======================================================
     LISTEN FOR DETAILS REQUEST
     ======================================================= */

  document.addEventListener(
    "laddu:laptop-details",
    (event) => {

      const laptopId =
        event.detail?.laptopId;


      if (!laptopId) {
        return;
      }


      openLaptopDetails(
        laptopId
      );

    }
  );


  /* =======================================================
     OPEN DETAILS
     ======================================================= */

  function openLaptopDetails(
    laptopId
  ) {

    if (
      !window.LadduStockData
    ) {
      return;
    }


    const laptop =
      window
        .LadduStockData
        .findLaptopById(
          laptopId
        );


    if (!laptop) {
      return;
    }


    closeExistingDetails();


    const overlay =
      document.createElement(
        "div"
      );


    overlay.className =
      "laptop-details-overlay";


    overlay.id =
      "laptopDetailsOverlay";


    overlay.innerHTML =
      createDetailsHTML(
        laptop
      );


    document.body.appendChild(
      overlay
    );


    document.body.style.overflow =
      "hidden";


    bindDetailsActions(
      overlay,
      laptop
    );

  }


  /* =======================================================
     DETAILS HTML
     ======================================================= */

  function createDetailsHTML(
    laptop
  ) {

    return `

      <div class="laptop-details-backdrop"></div>


      <section class="laptop-details-panel">

        <!-- HEADER -->

        <header class="laptop-details-header">

          <div>

            <p class="dashboard-kicker">
              INTERNAL LAPTOP PROFILE
            </p>


            <h2>
              ${escapeHTML(laptop.brand)}
              ${escapeHTML(laptop.model)}
            </h2>


            <div class="details-identity-line">

              <span>
                ${escapeHTML(
                  laptop.internalCode
                )}
              </span>

              <span>
                Serial:
                ${escapeHTML(
                  laptop.serialNumber
                )}
              </span>

              ${statusBadge(
                laptop.status
              )}

            </div>

          </div>


          <button
            class="modal-close-btn"
            id="closeLaptopDetails"
            type="button"
            aria-label="Close laptop details"
          >
            ×
          </button>

        </header>


        <!-- CONTENT -->

        <div class="laptop-details-content">


          <!-- QUICK ACTIONS -->

          <div class="details-action-bar">

            <button
              class="details-action primary"
              id="detailsEditLaptop"
              type="button"
            >
              Edit Laptop
            </button>


            <button
              class="details-action"
              id="detailsCustomerView"
              type="button"
            >
              Customer View
            </button>


            <button
              class="details-action success"
              id="detailsSellLaptop"
              type="button"
            >
              Sell Laptop
            </button>


            <button
              class="details-action warning"
              id="detailsStatusAction"
              type="button"
            >
              Return / Status
            </button>

          </div>


          <!-- CONFIGURATION -->

          ${detailsSection(
            "Configuration",
            [
              [
                "Processor",
                laptop.processor
              ],
              [
                "Generation",
                laptop.generation
              ],
              [
                "RAM",
                laptop.ram
              ],
              [
                "Storage",
                laptop.storage
              ],
              [
                "Graphics",
                laptop.graphics
              ],
              [
                "Display",
                laptop.display
              ],
              [
                "Touch",
                laptop.touch
              ],
              [
                "Battery Health",
                laptop.batteryHealth
              ]
            ]
          )}


          <!-- CONDITION -->

          ${detailsSection(
            "Condition & Stock",
            [
              [
                "Condition",
                laptop.condition
              ],
              [
                "Charger Received",
                laptop.chargerReceived
              ],
              [
                "Customer Price",
                formatMoney(
                  laptop.customerPrice
                )
              ],
              [
                "Current Status",
                statusLabel(
                  laptop.status
                )
              ]
            ]
          )}


          <!-- CUSTOMER VISIBLE NOTE -->

          ${
            laptop.visibleNote
              ? noteBox(
                  "Customer Visible Note",
                  laptop.visibleNote,
                  "visible"
                )
              : ""
          }


          <!-- INTERNAL INFORMATION -->

          ${detailsSection(
            "Internal Delivery Information",
            [
              [
                "Delivered By",
                laptop.deliveredBy
              ],
              [
                "Phone",
                laptop.deliveryPhone
              ],
              [
                "Received Date",
                laptop.receivedDate
              ],
              [
                "Carrying By",
                laptop.carryingBy
              ]
            ],
            true
          )}


          ${
            laptop.deliveryDetails
              ? noteBox(
                  "Delivery Details",
                  laptop.deliveryDetails,
                  "internal"
                )
              : ""
          }


          ${
            laptop.internalNote
              ? noteBox(
                  "Internal Note",
                  laptop.internalNote,
                  "internal"
                )
              : ""
          }


          <!-- PHOTOS -->

          ${photoSection(
            laptop.photos
          )}


          <!-- SYSTEM INFO -->

          <section class="details-section">

            <div class="details-section-heading">

              <div class="details-section-icon">
                i
              </div>

              <div>
                <h3>
                  Record Information
                </h3>

                <p>
                  Internal system information.
                </p>
              </div>

            </div>


            <div class="details-grid">

              ${detailItem(
                "Record ID",
                laptop.id
              )}

              ${detailItem(
                "Received",
                laptop.receivedDate
              )}

            </div>

          </section>

        </div>

      </section>

    `;

  }


  /* =======================================================
     DETAILS SECTION
     ======================================================= */

  function detailsSection(
    title,
    rows,
    internal = false
  ) {

    const content =
      rows
        .map(
          ([label, value]) =>
            detailItem(
              label,
              value || "—"
            )
        )
        .join("");


    return `

      <section
        class="details-section ${
          internal
            ? "internal-details-section"
            : ""
        }"
      >

        <div class="details-section-heading">

          <div class="details-section-icon">
            ${
              internal
                ? "⌁"
                : "◇"
            }
          </div>


          <div>

            <h3>
              ${escapeHTML(title)}
            </h3>

            <p>
              ${
                internal
                  ? "Private business information."
                  : "Laptop information."
              }
            </p>

          </div>

        </div>


        <div class="details-grid">

          ${content}

        </div>

      </section>

    `;

  }


  /* =======================================================
     DETAIL ITEM
     ======================================================= */

  function detailItem(
    label,
    value
  ) {

    return `

      <div class="details-item">

        <span>
          ${escapeHTML(label)}
        </span>

        <strong>
          ${escapeHTML(
            value || "—"
          )}
        </strong>

      </div>

    `;

  }


  /* =======================================================
     NOTE
     ======================================================= */

  function noteBox(
    title,
    text,
    type
  ) {

    return `

      <section
        class="details-note ${
          type === "internal"
            ? "internal-details-note"
            : ""
        }"
      >

        <span>
          ${escapeHTML(title)}
        </span>

        <p>
          ${escapeHTML(text)}
        </p>

      </section>

    `;

  }


  /* =======================================================
     PHOTOS
     ======================================================= */

  function photoSection(
    photos
  ) {

    if (
      !Array.isArray(photos) ||
      photos.length === 0
    ) {

      return `

        <section class="details-section">

          <div class="details-section-heading">

            <div class="details-section-icon">
              ▧
            </div>

            <div>

              <h3>
                Laptop Photos
              </h3>

              <p>
                No photos uploaded yet.
              </p>

            </div>

          </div>

        </section>

      `;

    }


    return `

      <section class="details-section">

        <div class="details-section-heading">

          <div class="details-section-icon">
            ▧
          </div>

          <div>

            <h3>
              Laptop Photos
            </h3>

            <p>
              Condition and stock photos.
            </p>

          </div>

        </div>


        <div class="details-photo-grid">

          ${photos
            .map(
              (photo) => `

                <img
                  src="${escapeAttribute(photo.url)}"
                  alt="Laptop photo"
                >

              `
            )
            .join("")}

        </div>

      </section>

    `;

  }


  /* =======================================================
     ACTIONS
     ======================================================= */

  function bindDetailsActions(
    overlay,
    laptop
  ) {

    overlay
      .querySelector(
        "#closeLaptopDetails"
      )
      ?.addEventListener(
        "click",
        closeLaptopDetails
      );


    overlay
      .querySelector(
        ".laptop-details-backdrop"
      )
      ?.addEventListener(
        "click",
        closeLaptopDetails
      );


    overlay
      .querySelector(
        "#detailsEditLaptop"
      )
      ?.addEventListener(
        "click",
        () => {

          alert(
            "Edit Laptop form is the next step."
          );

        }
      );


    overlay
      .querySelector(
        "#detailsCustomerView"
      )
      ?.addEventListener(
        "click",
        () => {

          document.dispatchEvent(
            new CustomEvent(
              "laddu:customer-view-request",
              {
                detail: {
                  laptopId:
                    laptop.id
                }
              }
            )
          );

        }
      );


    overlay
      .querySelector(
        "#detailsSellLaptop"
      )
      ?.addEventListener(
        "click",
        () => {

          alert(
            "Sales workflow will be connected next."
          );

        }
      );


    overlay
      .querySelector(
        "#detailsStatusAction"
      )
      ?.addEventListener(
        "click",
        () => {

          alert(
            "Return / Status workflow will be connected after Sales."
          );

        }
      );

  }


  /* =======================================================
     CLOSE
     ======================================================= */

  function closeLaptopDetails() {

    document
      .getElementById(
        "laptopDetailsOverlay"
      )
      ?.remove();


    document.body.style.overflow =
      "";

  }


  function closeExistingDetails() {

    document
      .getElementById(
        "laptopDetailsOverlay"
      )
      ?.remove();

  }


  /* =======================================================
     STATUS
     ======================================================= */

  function statusLabel(
    status
  ) {

    const map = {

      "in-stock":
        "In Stock",

      sold:
        "Sold",

      returned:
        "Returned",

      service:
        "In Service",

      missing:
        "Missing"

    };


    return (
      map[status] ||
      status ||
      "Unknown"
    );

  }


  function statusBadge(
    status
  ) {

    const label =
      statusLabel(status);


    const classMap = {

      "in-stock":
        "status-in",

      sold:
        "status-out",

      returned:
        "status-returned",

      service:
        "status-service",

      missing:
        "status-missing"

    };


    const className =
      classMap[status] ||
      "status-in";


    return `

      <span
        class="stock-status ${className}"
      >
        ${escapeHTML(label)}
      </span>

    `;

  }


  /* =======================================================
     MONEY
     ======================================================= */

  function formatMoney(value) {

    const number =
      Number(value) || 0;


    return (
      "৳" +
      new Intl.NumberFormat(
        "en-BD",
        {
          maximumFractionDigits:
            0
        }
      ).format(number)
    );

  }


  /* =======================================================
     ESCAPE
     ======================================================= */

  function escapeHTML(value) {

    const element =
      document.createElement(
        "div"
      );


    element.textContent =
      String(value ?? "");


    return element.innerHTML;

  }


  function escapeAttribute(
    value
  ) {

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