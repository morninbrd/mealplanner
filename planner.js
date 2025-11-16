(function() {
  const STORAGE_KEY = "jsa-week-plan-v4";

  const DAYS = [
    { key: "mon", label: "Mon" },
    { key: "tue", label: "Tue" },
    { key: "wed", label: "Wed" },
    { key: "thu", label: "Thu" },
    { key: "fri", label: "Fri" },
    { key: "sat", label: "Sat" },
    { key: "sun", label: "Sun" }
  ];

  const OPTIONS = {
    dairy: ["","Cottage cheese — 3 oz","Plain non-fat yogurt — 4–6 oz","Skim milk — 8 oz","Hard cheese — 1 oz"],
    breakfastProtein: ["","Egg — 1","Egg substitute — 1/2 cup","Egg whites — 2","Cottage cheese — 3 oz","Beans — 4 oz","Chicken — 2 oz","Beef — 2 oz","Pork — 2 oz"],
    breakfastCereal: ["","Oatmeal — 1 oz dry","Oat bran — 1 oz","Grits — 1 oz","Cream of Rice — 1 oz","Cream of Buckwheat — 1 oz"],
    fruit: ["","Apple — 1 small","Orange — 1 small","Peach — 1 small","Pear — 1 small","Berries — 1/2 cup","Grapes — 1/2 cup","Pineapple — 1/2 cup"],
    protein: ["","Chicken — 3–4 oz","Turkey — 3–4 oz","Fish — 3–4 oz","Beef — 3–4 oz","Eggs — 2","Beans — 6 oz","Cottage cheese — 6 oz"],
    salad: ["","Lettuce — 6–8 oz","Mixed greens — 6–8 oz","Spinach — 6–8 oz","Cucumber — 6–8 oz","Broccoli — 6–8 oz","Tomatoes — 6–8 oz"],
    vegetable: ["","Broccoli — 6–8 oz","Carrots — 6–8 oz","Green beans — 6–8 oz","Zucchini — 6–8 oz","Squash — 6–8 oz"],
    grain: ["","Potato — 4 oz","Sweet potato — 4 oz","Brown rice — 1/2 cup","Quinoa — 1/2 cup"],
    fat: ["","Olive oil — 1 tbsp","Butter — 1 tbsp","Avocado — 2 oz","Nuts — 1/2 oz"]
  };

  const STRUCTURE = [
    {
      mealKey: "breakfast",
      mealLabel: "Breakfast",
      rows: [
        { rowKey: "bf_dairy", label: "Dairy", optionKey: "dairy" },
        { rowKey: "bf_protein", label: "Protein", optionKey: "breakfastProtein" },
        { rowKey: "bf_cereal", label: "Cereal", optionKey: "breakfastCereal" },
        { rowKey: "bf_fruit", label: "Fruit", optionKey: "fruit" },
        { rowKey: "bf_fat", label: "Fat", optionKey: "fat" }
      ]
    },
    {
      mealKey: "lunch",
      mealLabel: "Lunch",
      rows: [
        { rowKey: "ln_protein", label: "Protein", optionKey: "protein" },
        { rowKey: "ln_salad", label: "Salad (6–8 oz)", optionKey: "salad" },
        { rowKey: "ln_veg", label: "Vegetable (6–8 oz)", optionKey: "vegetable" },
        { rowKey: "ln_grain", label: "Grain", optionKey: "grain" },
        { rowKey: "ln_fat", label: "Fat", optionKey: "fat" }
      ]
    },
    {
      mealKey: "dinner",
      mealLabel: "Dinner",
      rows: [
        { rowKey: "dn_protein", label: "Protein", optionKey: "protein" },
        { rowKey: "dn_grain", label: "Grain", optionKey: "grain" },
        { rowKey: "dn_salad", label: "Salad (6–8 oz)", optionKey: "salad" },
        { rowKey: "dn_veg", label: "Vegetable (6–8 oz)", optionKey: "vegetable" },
        { rowKey: "dn_fat", label: "Fat", optionKey: "fat" }
      ]
    }
  ];

  function adherenceHTML(mealKey, dayKey) {
    return `
      <div class="jsa-adherence-container" id="adh-${mealKey}-${dayKey}">
        <div class="jsa-adherence-circle jsa-green" data-color="green" data-meal="${mealKey}" data-day="${dayKey}"></div>
        <div class="jsa-adherence-circle jsa-yellow" data-color="yellow" data-meal="${mealKey}" data-day="${dayKey}"></div>
        <div class="jsa-adherence-circle jsa-red" data-color="red" data-meal="${mealKey}" data-day="${dayKey}"></div>
      </div>
    `;
  }

  function buildTable() {
    const tbody = document.getElementById("jsa-week-body");
    tbody.innerHTML = "";

    STRUCTURE.forEach(meal => {
      const hr = document.createElement("tr");
      const hc = document.createElement("td");
      hc.colSpan = 8;
      hc.className = "jsa-wp-meal-header";
      hc.textContent = meal.mealLabel;
      hr.appendChild(hc);
      tbody.appendChild(hr);

      meal.rows.forEach(row => {
        const tr = document.createElement("tr");
        const firstTd = document.createElement("td");
        firstTd.innerHTML = `<span class="jsa-wp-cat-label">${row.label}</span>
                           <button class="jsa-wp-btn-copy" data-rowkey="${row.rowKey}">Copy Monday → All</button>`;
        tr.appendChild(firstTd);

        DAYS.forEach(day => {
          const td = document.createElement("td");
          const sel = document.createElement("select");
          sel.className = "jsa-wp-select";
          sel.id = `jsa-${row.rowKey}-${day.key}`;
          (OPTIONS[row.optionKey] || [""]).forEach(opt => {
            const o = document.createElement("option");
            o.value = opt;
            o.textContent = opt || "-- choose --";
            sel.appendChild(o);
          });
          td.appendChild(sel);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      const aRow = document.createElement("tr");
      const aCell = document.createElement("td");
      aCell.innerHTML = '<span class="jsa-wp-cat-label">Adherence</span>';
      aRow.appendChild(aCell);

      DAYS.forEach(day => {
        const td = document.createElement("td");
        td.innerHTML = adherenceHTML(meal.mealKey, day.key);
        aRow.appendChild(td);
      });
      tbody.appendChild(aRow);
    });
  }

  function getWeekData() {
    const data = {
      focus: {
        type: document.getElementById("jsa-focus-type").value,
        text: document.getElementById("jsa-focus-text").value
      },
      selections: {},
      adherence: {}
    };

    STRUCTURE.forEach(meal => {
      meal.rows.forEach(row => {
        data.selections[row.rowKey] = {};
        DAYS.forEach(day => {
          const el = document.getElementById(`jsa-${row.rowKey}-${day.key}`);
          data.selections[row.rowKey][day.key] = el ? el.value : "";
        });
      });

      data.adherence[meal.mealKey] = {};
      DAYS.forEach(day => {
        const container = document.getElementById(`adh-${meal.mealKey}-${day.key}`);
        const selected = container.querySelector(".jsa-adherence-circle.jsa-selected");
        data.adherence[meal.mealKey][day.key] = selected ? selected.dataset.color : "";
      });
    });

    return data;
  }

  function saveWeek() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getWeekData()));
    alert("Week saved!");
  }

  function loadWeek() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    document.getElementById("jsa-focus-type").value = data.focus?.type || "scripture";
    document.getElementById("jsa-focus-text").value = data.focus?.text || "";

    STRUCTURE.forEach(meal => {
      meal.rows.forEach(row => {
        DAYS.forEach(day => {
          const el = document.getElementById(`jsa-${row.rowKey}-${day.key}`);
          if (el && data.selections[row.rowKey]) {
            el.value = data.selections[row.rowKey][day.key] || "";
          }
        });
      });

      DAYS.forEach(day => {
        const container = document.getElementById(`adh-${meal.mealKey}-${day.key}`);
        if (!container) return;
        container.querySelectorAll(".jsa-adherence-circle")
          .forEach(c => c.classList.remove("jsa-selected"));
        const color = data.adherence[meal.mealKey][day.key];
        if (color) {
          const c = container.querySelector(`.jsa-adherence-circle[data-color="${color}"]`);
          if (c) c.classList.add("jsa-selected");
        }
      });
    });
  }

  function clearWeek() {
    if (!confirm("Clear everything for this week?")) return;
    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("jsa-focus-type").value = "scripture";
    document.getElementById("jsa-focus-text").value = "";

    STRUCTURE.forEach(meal => {
      meal.rows.forEach(row => {
        DAYS.forEach(day => {
          const el = document.getElementById(`jsa-${row.rowKey}-${day.key}`);
          if (el) el.value = "";
        });
      });
      DAYS.forEach(day => {
        const container = document.getElementById(`adh-${meal.mealKey}-${day.key}`);
        if (container) {
          container.querySelectorAll(".jsa-adherence-circle")
            .forEach(c => c.classList.remove("jsa-selected"));
        }
      });
    });
  }

  function setupCopyButtons() {
    document.getElementById("jsa-week-body")
      .addEventListener("click", e => {
        const btn = e.target.closest(".jsa-wp-btn-copy");
        if (!btn) return;

        const rowKey = btn.dataset.rowkey;
        const monValue = document.getElementById(`jsa-${rowKey}-mon`).value;

        DAYS.forEach(day => {
          if (day.key !== "mon") {
            const el = document.getElementById(`jsa-${rowKey}-${day.key}`);
            if (el) el.value = monValue;
          }
        });

        saveWeek();
      });
  }

  function setupAdherenceClicks() {
    document.getElementById("jsa-weekly-planner")
      .addEventListener("click", e => {
        const c = e.target.closest(".jsa-adherence-circle");
        if (!c) return;

        const meal = c.dataset.meal;
        const day = c.dataset.day;
        const parent = document.getElementById(`adh-${meal}-${day}`);

        parent.querySelectorAll(".jsa-adherence-circle")
          .forEach(x => x.classList.remove("jsa-selected"));

        c.classList.add("jsa-selected");
        saveWeek();
      });
  }

  function initPlanner() {
    buildTable();
    setupCopyButtons();
    setupAdherenceClicks();
    loadWeek();

    document.getElementById("jsa-save-week").addEventListener("click", saveWeek);
    document.getElementById("jsa-clear-week").addEventListener("click", clearWeek);
  }

  initPlanner();
})();
