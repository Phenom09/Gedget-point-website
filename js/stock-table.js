/* =========================================================
   LADDU HUB
   STOCK TABLE MODULE
   ========================================================= */

(function () {

  /* =======================================================
     STOCK PAGE READY
     ======================================================= */

  document.addEventListener(
    "laddu:stock-page-ready",
    initialiseStockTable
  );


  /* =======================================================
     STOCK DATA UPDATED
     ======================================================= */

  document.addEventListener(
    "laddu:stock-updated",
    renderStockTable
  );


  /* =======================================================
     INITIALISE
     ======================================================= */

  function initialiseStockTable() {

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


    search?.addEventListener(
      "input",
      renderStockTable
    );


    brandFilter?.addEventListener(
      "change",
      renderStockTable
    );


    statusFilter?.addEventListener(
      "change",
      renderStockTable
    );


    renderStockTable();

  }


  /* =======================================================
     RENDER TABLE
     ======================================================= */

  function renderStockTable() {

    const tableBody =
      document.getElementById(
        "laptopStockTableBody"
      );


    if (
      !tableBody ||
      !window.LadduStockData
    ) {
      return;
    }


    const allLaptops =
      window
        .LadduStockData
        .getAllLaptops();


    updateSummary(
      allLaptops
    );


    const filtered =
      filterLaptops(
        allLaptops
      );


    if (
      filtered.length === 0
    ) {

      tableBody.innerHTML =
        createEmptyState(
          allLaptops.length > 0
        );


      return;

    }


    tableBody.innerHTML =
      filtered
        .map(createRow)
        .join("");


    bindDetailButtons();

  }


  /* =======================================================
     FILTER
     ======================================================= */

  function filterLaptops(
    laptops
  ) {

    const search =
      valueOf(
        "laptopStockSearch"
      )
        .toLowerCase();


    const brand =
      valueOf(
        "stockBrandFilter"
      ) || "all";


    const status =
      valueOf(
        "laptopStatusFilter"
      ) || "all";


    return laptops.filter(
      (laptop) => {

        const text = [

          laptop.internalCode,
          laptop.serialNumber,

          laptop.brand,
          laptop.model,

          laptop.processor,
          laptop.generation,

          laptop.ram,
          laptop.storage,

          laptop.deliveredBy,
          laptop.deliveryPhone,

          laptop.carryingBy,
          laptop.receivedDate

        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


        const matchesSearch =
          !search ||
          text.includes(search);


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

  }


  /* =======================================================
     SUMMARY
     ======================================================= */

  function updateSummary(
    laptops
  ) {

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


  /* =======================================================
     TABLE ROW
     ======================================================= */

  function createRow(
    laptop
  ) {

    const configuration =
      buildConfiguration(
        laptop
      );


    const status =
      getStatusDisplay(
        laptop.status
      );


    return `

      <tr>

        <td>

          <div class="laptop-name-cell">

            <div class="laptop-thumbnail">
              ◇
            </div>


            <div class="laptop-name-copy">

              <strong>
                ${escapeHTML(laptop.brand)}
                ${escapeHTML(laptop.model)}
              </strong>

              <span>
                ${escapeHTML(
                  laptop.condition ||
                  "—"
                )}
              </span>

            </div>

          </div>

        </td>


        <td>

          <span class="laptop-code">
            ${escapeHTML(
              laptop.internalCode
            )}
          </span>

        </td>


        <td>

          <span class="serial-number">
            ${escapeHTML(
              laptop.serialNumber
            )}
          </span>

        </td>


        <td>

          <div
            class="configuration-cell"
            title="${escapeAttribute(configuration)}"
          >
            ${escapeHTML(
              configuration || "—"
            )}
          </div>

        </td>


        <td>

          <span class="battery-cell">
            ${escapeHTML(
              laptop.batteryHealth ||
              "—"
            )}
          </span>

        </td>


        <td>

          <span class="${
            laptop.chargerReceived ===
              "Yes"
              ? "charger-yes"
              : "charger-no"
          }">

            ${
              laptop.chargerReceived ===
                "Yes"
                ? "Yes"
                : "No"
            }

          </span>

        </td>


        <td>
          ${formatMoney(
            laptop.customerPrice
          )}
        </td>


        <td>

          <span
            class="stock-status ${status.className}"
          >
            ${status.label}
          </span>

        </td>


        <td>

          <button
            class="laptop-action-button stock-details-button"
            type="button"
            data-laptop-id="${escapeAttribute(laptop.id)}"
          >
            Details
          </button>

        </td>

      </tr>

    `;

  }


  /* =======================================================
     DETAILS BUTTON
     ======================================================= */

  function bindDetailButtons() {

    document
      .querySelectorAll(
        ".stock-details-button"
      )
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              const laptop =
                window
                  .LadduStockData
                  .findLaptopById(
                    button.dataset
                      .laptopId
                  );


              if (!laptop) {
                return;
              }


              document.dispatchEvent(
                new CustomEvent(
                  "laddu:laptop-details",
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

        }
      );

  }


  /* =======================================================
     EMPTY STATE
     ======================================================= */

  function createEmptyState(
    hasLaptops
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
                hasLaptops
                  ? "No matching laptops"
                  : "No laptops in stock yet"
              }

            </h3>


            <p>

              ${
                hasLaptops
                  ? "Try changing your search or filters."
                  : "Receive your first laptop to start tracking stock."
              }

            </p>

          </div>

        </td>

      </tr>

    `;

  }


  /* =======================================================
     CONFIGURATION
     ======================================================= */

  function buildConfiguration(
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


  /* =======================================================
     STATUS
     ======================================================= */

  function getStatusDisplay(
    status
  ) {

    const statuses = {

      "in-stock": {
        label:
          "In Stock",

        className:
          "status-in"
      },


      sold: {
        label:
          "Sold",

        className:
          "status-out"
      },


      returned: {
        label:
          "Returned",

        className:
          "status-returned"
      },


      service: {
        label:
          "In Service",

        className:
          "status-service"
      },


      missing: {
        label:
          "Missing",

        className:
          "status-missing"
      }

    };


    return (
      statuses[status] ||
      statuses["in-stock"]
    );

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
     BASIC DOM HELPERS
     ======================================================= */

  function valueOf(id) {

    return String(
      document
        .getElementById(id)
        ?.value || ""
    ).trim();

  }


  function setText(
    id,
    value
  ) {

    const element =
      document.getElementById(
        id
      );


    if (element) {

      element.textContent =
        String(value);

    }

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
