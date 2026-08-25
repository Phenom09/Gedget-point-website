/* =========================================================
   LADDU HUB
   STOCK SAVE MODULE
   ========================================================= */

(function () {

  let pendingDuplicateSave = null;


  /* =======================================================
     START / WATCH FOR STOCK PAGE
     ======================================================= */

  document.addEventListener(
    "submit",
    handleStockFormSubmit
  );


  /* =======================================================
     RECEIVE FORM SUBMIT
     ======================================================= */

  function handleStockFormSubmit(
    event
  ) {

    const form =
      event.target;


    if (
      !form ||
      form.id !==
        "receiveLaptopForm"
    ) {
      return;
    }


    event.preventDefault();


    clearMessage();


    if (
      !window.LadduStockData
    ) {

      showMessage(
        "Stock data system is not available. Please refresh the page.",
        "error"
      );

      return;

    }


    const delivery =
      readDelivery();


    if (
      !delivery.deliveredBy ||
      !delivery.receivedDate ||
      !delivery.carryingBy
    ) {

      showMessage(
        "Please complete Delivered By, Received Date and Carrying By.",
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


    if (
      cards.length === 0
    ) {

      showMessage(
        "Please add at least one laptop.",
        "error"
      );

      return;

    }


    const laptops =
      cards.map(
        readLaptopCard
      );


    const preparation =
      window
        .LadduStockData
        .prepareBulkSave(
          laptops
        );


    if (
      !preparation.ok
    ) {

      showMessage(
        preparation.message,
        "error"
      );

      return;

    }


    if (
      preparation.warnings.length >
        0
    ) {

      pendingDuplicateSave = {
        delivery,
        laptops
      };


      showDuplicateWarning(
        preparation.warnings
      );


      return;

    }


    commitSave(
      delivery,
      laptops,
      false
    );

  }


  /* =======================================================
     DELIVERY
     ======================================================= */

  function readDelivery() {

    return {

      deliveredBy:
        valueOf(
          "deliveredBy"
        ),

      deliveryPhone:
        valueOf(
          "deliveryPhone"
        ),

      receivedDate:
        valueOf(
          "receivedDate"
        ),

      carryingBy:
        valueOf(
          "carryingBy"
        ),

      details:
        valueOf(
          "deliveryDetails"
        )

    };

  }


  /* =======================================================
     READ LAPTOP CARD
     ======================================================= */

  function readLaptopCard(
    card
  ) {

    const selectedBrand =
      fieldValue(
        card,
        ".entry-brand"
      );


    const brand =
      selectedBrand === "Other"
        ? fieldValue(
            card,
            ".entry-other-brand"
          )
        : selectedBrand;


    const priceText =
      fieldValue(
        card,
        ".entry-customer-price"
      );


    const price =
      priceText
        ? Number(priceText)
        : 0;


    return {

      internalCode:
        fieldValue(
          card,
          ".entry-internal-code"
        ),

      serialNumber:
        fieldValue(
          card,
          ".entry-serial-number"
        ),

      brand,

      model:
        fieldValue(
          card,
          ".entry-model"
        ),

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
bodyStatus:
  fieldValue(
    card,
    ".entry-body-status"
  ),

displayStatus:
  fieldValue(
    card,
    ".entry-display-status"
  ),

keyboardStatus:
  fieldValue(
    card,
    ".entry-keyboard-status"
  ),

warrantyDays:
  fieldValue(
    card,
    ".entry-warranty"
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

      customerPrice:
        Number.isFinite(price)
          ? price
          : 0,

      /*
        Photo persistence will be connected to
        real cloud storage later.

        The current UI preview remains separate.
      */

      photos: []

    };

  }


  /* =======================================================
     DUPLICATE SERIAL WARNING
     ======================================================= */

  function showDuplicateWarning(
    warnings
  ) {

    const message =
      document.getElementById(
        "receiveLaptopMessage"
      );


    if (!message) {
      return;
    }


    const serials =
      [
        ...new Set(
          warnings.map(
            (warning) =>
              warning.serial
          )
        )
      ];


    message.className =
      "product-form-message error-message serial-warning-box";


    message.innerHTML = `

      <strong>
        ⚠ Serial Number Warning
      </strong>

      <span>
        The following serial number${
          serials.length > 1
            ? "s appear"
            : " appears"
        } more than once:
      </span>

      <b>
        ${serials
          .map(escapeHTML)
          .join(", ")}
      </b>

      <span>
        Check the existing record before continuing.
      </span>

      <div class="serial-warning-actions">

        <button
          id="cancelDuplicateSave"
          type="button"
        >
          Check Again
        </button>

        <button
          id="continueDuplicateSave"
          type="button"
        >
          Continue Anyway
        </button>

      </div>

    `;


    document
      .getElementById(
        "cancelDuplicateSave"
      )
      ?.addEventListener(
        "click",
        cancelDuplicateSave
      );


    document
      .getElementById(
        "continueDuplicateSave"
      )
      ?.addEventListener(
        "click",
        continueDuplicateSave
      );


    message.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  /* =======================================================
     DUPLICATE ACTIONS
     ======================================================= */

  function cancelDuplicateSave() {

    pendingDuplicateSave =
      null;


    showMessage(
      "Nothing was saved. Please check the serial number.",
      "error"
    );

  }


  function continueDuplicateSave() {

    if (
      !pendingDuplicateSave
    ) {
      return;
    }


    const {
      delivery,
      laptops
    } =
      pendingDuplicateSave;


    pendingDuplicateSave =
      null;


    commitSave(
      delivery,
      laptops,
      true
    );

  }


  /* =======================================================
     COMMIT SAVE
     ======================================================= */

  function commitSave(
    delivery,
    laptops,
    allowDuplicateSerial
  ) {

    const result =
      window
        .LadduStockData
        .saveBulk(
          delivery,
          laptops,
          {
            forceSerialDuplicates:
              allowDuplicateSerial
          }
        );


    if (!result.ok) {

      if (
        result
          .requiresConfirmation
      ) {

        pendingDuplicateSave = {
          delivery,
          laptops
        };


        showDuplicateWarning(
          result.warnings || []
        );


        return;

      }


      showMessage(
        result.message ||
          "The laptops could not be saved.",
        "error"
      );


      return;

    }


    showMessage(
      result.message,
      "success"
    );


    /*
      Notify other stock UI modules.
    */

    document.dispatchEvent(
      new CustomEvent(
        "laddu:stock-updated"
      )
    );


    setTimeout(() => {

      closeReceiveModal();

    }, 550);

  }


  /* =======================================================
     CLOSE MODAL

     Kept here so this module does not depend on
     private functions inside stock.js.
     ======================================================= */

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
     MESSAGE
     ======================================================= */

  function showMessage(
    text,
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
      text;


    element.className =
      type === "success"
        ? "product-form-message success-message"
        : "product-form-message error-message";


    element.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  function clearMessage() {

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


  /* =======================================================
     FIELD HELPERS
     ======================================================= */

  function valueOf(id) {

    const element =
      document.getElementById(
        id
      );


    return String(
      element?.value || ""
    ).trim();

  }


  function fieldValue(
    card,
    selector
  ) {

    const element =
      card.querySelector(
        selector
      );


    return String(
      element?.value || ""
    ).trim();

  }


  /* =======================================================
     SAFE HTML
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

})();