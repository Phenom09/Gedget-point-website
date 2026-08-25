/* =========================================================
   LADDU HUB
   STOCK DATA ENGINE
   Prototype Memory Storage
   ========================================================= */

(function () {

  /* =======================================================
     PRIVATE LAPTOP DATA
     ======================================================= */

  const laptopRecords = [];


  /* =======================================================
     NORMALISE SERIAL
     ======================================================= */

  function normaliseSerial(value) {

    return String(value || "")
      .trim()
      .toLowerCase();

  }


  /* =======================================================
     GET ALL LAPTOPS
     ======================================================= */

  function getAllLaptops() {

    return [...laptopRecords];

  }


  /* =======================================================
     FIND LAPTOP BY SYSTEM ID
     ======================================================= */

  function findLaptopById(id) {

    return (
      laptopRecords.find(
        (laptop) =>
          laptop.id === id
      ) || null
    );

  }


  /* =======================================================
     FIND ALL MATCHING SERIALS

     We return an array because duplicate serials may be
     manually allowed after a warning.
     ======================================================= */

  function findBySerial(serial) {

    const key =
      normaliseSerial(serial);


    if (!key) {
      return [];
    }


    return laptopRecords.filter(
      (laptop) =>
        normaliseSerial(
          laptop.serialNumber
        ) === key
    );

  }


  /* =======================================================
     CHECK A NEW DELIVERY FOR SERIAL WARNINGS

     IMPORTANT:
     BABU / internal code can repeat.
     We do NOT validate duplicate BABU codes.
     ======================================================= */

  function checkSerialWarnings(
    newLaptops
  ) {

    const warnings = [];

    const serialsInDelivery =
      new Map();


    newLaptops.forEach(
      (laptop, index) => {

        const serial =
          String(
            laptop.serialNumber || ""
          ).trim();


        const serialKey =
          normaliseSerial(serial);


        if (!serialKey) {
          return;
        }


        /*
          Check against laptops already saved.
        */

        const existing =
          findBySerial(serial);


        if (existing.length > 0) {

          warnings.push({

            type:
              "existing-serial",

            serial,

            entryIndex: index,

            existingRecords:
              existing

          });

        }


        /*
          Check duplicate serial inside
          the current delivery.
        */

        if (
          serialsInDelivery.has(
            serialKey
          )
        ) {

          warnings.push({

            type:
              "delivery-duplicate",

            serial,

            entryIndex: index,

            firstEntryIndex:
              serialsInDelivery.get(
                serialKey
              )

          });

        } else {

          serialsInDelivery.set(
            serialKey,
            index
          );

        }

      }
    );


    return warnings;

  }


  /* =======================================================
     VALIDATE REQUIRED FIELDS

     Serial is required, but duplicate serial is NOT
     a hard validation error.
     ======================================================= */

  function validateRequiredFields(
    newLaptops
  ) {

    if (
      !Array.isArray(newLaptops) ||
      newLaptops.length === 0
    ) {

      return {

        ok: false,

        message:
          "Please add at least one laptop."

      };

    }


    for (
      let index = 0;
      index < newLaptops.length;
      index += 1
    ) {

      const laptop =
        newLaptops[index];


      const number =
        index + 1;


      const internalCode =
        String(
          laptop.internalCode || ""
        ).trim();


      const serialNumber =
        String(
          laptop.serialNumber || ""
        ).trim();


      const brand =
        String(
          laptop.brand || ""
        ).trim();


      const model =
        String(
          laptop.model || ""
        ).trim();


      if (!internalCode) {

        return {

          ok: false,

          message:
            `Laptop ${number}: Internal Code is required.`

        };

      }


      if (!serialNumber) {

        return {

          ok: false,

          message:
            `Laptop ${number}: Serial Number is required.`

        };

      }


      if (!brand) {

        return {

          ok: false,

          message:
            `Laptop ${number}: Brand is required.`

        };

      }


      if (!model) {

        return {

          ok: false,

          message:
            `Laptop ${number}: Model is required.`

        };

      }

    }


    return {

      ok: true,

      message: ""

    };

  }


  /* =======================================================
     PREPARE BULK SAVE

     This function checks required data and serial warnings
     BEFORE anything is stored.
     ======================================================= */

  function prepareBulkSave(
    newLaptops
  ) {

    const validation =
      validateRequiredFields(
        newLaptops
      );


    if (!validation.ok) {

      return validation;

    }


    const warnings =
      checkSerialWarnings(
        newLaptops
      );


    return {

      ok: true,

      warnings

    };

  }


  /* =======================================================
     COMMIT BULK SAVE

     forceSerialDuplicates:
     false → return warnings before saving
     true  → user approved Continue Anyway
   ======================================================= */

  function saveBulk(
    delivery,
    newLaptops,
    options = {}
  ) {

    const preparation =
      prepareBulkSave(
        newLaptops
      );


    if (!preparation.ok) {

      return preparation;

    }


    const allowDuplicates =
      options
        .forceSerialDuplicates ===
      true;


    if (
      preparation.warnings.length >
        0 &&
      !allowDuplicates
    ) {

      return {

        ok: false,

        requiresConfirmation:
          true,

        message:
          "One or more serial numbers may already exist.",

        warnings:
          preparation.warnings

      };

    }


    const deliveryId =
      createId();


    const createdAt =
      new Date().toISOString();


    const savedRecords = [];


    newLaptops.forEach(
      (laptop) => {

        const record = {

          ...laptop,

          id:
            createId(),

          deliveryId,

          deliveredBy:
            String(
              delivery.deliveredBy ||
              ""
            ).trim(),

          deliveryPhone:
            String(
              delivery.deliveryPhone ||
              ""
            ).trim(),

          receivedDate:
            String(
              delivery.receivedDate ||
              ""
            ).trim(),

          carryingBy:
            String(
              delivery.carryingBy ||
              ""
            ).trim(),

          deliveryDetails:
            String(
              delivery.details ||
              ""
            ).trim(),

          status:
            "in-stock",

          createdAt,

          events: [

            {

              type:
                "received",

              date:
                String(
                  delivery.receivedDate ||
                  ""
                ).trim(),

              createdAt

            }

          ]

        };


        laptopRecords.unshift(
          record
        );


        savedRecords.push(
          record
        );

      }
    );


    return {

      ok: true,

      records:
        savedRecords,

      warnings:
        preparation.warnings,

      message:
        savedRecords.length === 1
          ? "1 laptop received successfully."
          : `${savedRecords.length} laptops received successfully.`

    };

  }


  /* =======================================================
     UPDATE LAPTOP

     BABU code may become the same as another laptop.
     Serial changes are allowed, but caller can check
     warnings first.
     ======================================================= */

  function updateLaptop(
    id,
    changes
  ) {

    const laptop =
      findLaptopById(id);


    if (!laptop) {

      return {

        ok: false,

        message:
          "Laptop was not found."

      };

    }


    Object.assign(
      laptop,
      changes
    );


    return {

      ok: true,

      record:
        laptop

    };

  }


  /* =======================================================
     SET STATUS
     ======================================================= */

  function setLaptopStatus(
    id,
    status
  ) {

    const laptop =
      findLaptopById(id);


    if (!laptop) {

      return {

        ok: false,

        message:
          "Laptop was not found."

      };

    }


    laptop.status =
      status;


    return {

      ok: true,

      record:
        laptop

    };

  }


  /* =======================================================
     CREATE SYSTEM ID

     Database will later provide permanent IDs.
     ======================================================= */

  function createId() {

    if (
      window.crypto &&
      typeof window.crypto
        .randomUUID ===
        "function"
    ) {

      return window.crypto
        .randomUUID();

    }


    return (
      Date.now()
        .toString(36) +
      Math.random()
        .toString(36)
        .slice(2)
    );

  }


  /* =======================================================
     PUBLIC STOCK DATA API
     ======================================================= */

  window.LadduStockData = {

    getAllLaptops,

    findLaptopById,

    findBySerial,

    checkSerialWarnings,

    prepareBulkSave,

    saveBulk,

    updateLaptop,

    setLaptopStatus

  };

})();