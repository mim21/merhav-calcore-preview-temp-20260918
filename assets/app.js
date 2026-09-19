/* calcore renderer: search and filter behaviour (architecture 14.2). */
(function () {
  "use strict";
  var list = document.querySelector("[data-events]");
  if (!list) { return; }
  var entries = [];
  var items = list.querySelectorAll(".event");
  for (var i = 0; i < items.length; i += 1) {
    entries.push({ node: items[i], text: (items[i].textContent || "").toLowerCase() });
  }
  var query = document.getElementById("event-search-input");
  var selects = document.querySelectorAll("[data-filter]");
  var chips = document.querySelectorAll(".category-chip");

  function selected() {
    var active = [];
    for (var i = 0; i < selects.length; i += 1) {
      var value = selects[i].value.trim().toLowerCase();
      if (value) { active.push(value); }
    }
    return active;
  }

  function apply() {
    var needle = query ? query.value.trim().toLowerCase() : "";
    var active = selected();
    for (var i = 0; i < entries.length; i += 1) {
      var text = entries[i].text;
      var visible = !needle || text.indexOf(needle) !== -1;
      for (var j = 0; visible && j < active.length; j += 1) {
        visible = text.indexOf(active[j]) !== -1;
      }
      entries[i].node.hidden = !visible;
    }
    for (var k = 0; k < chips.length; k += 1) {
      var chip = chips[k];
      var target = document.querySelector(
        '[data-filter="' + chip.getAttribute("data-filter-key") + '"]'
      );
      var pressed = !!target &&
        target.value === chip.getAttribute("data-filter-value");
      chip.setAttribute("aria-pressed", pressed ? "true" : "false");
    }
  }

  if (query) { query.addEventListener("input", apply); }
  for (var s = 0; s < selects.length; s += 1) {
    selects[s].addEventListener("change", apply);
  }
  for (var c = 0; c < chips.length; c += 1) {
    chips[c].addEventListener("click", function (event) {
      var chip = event.currentTarget;
      var target = document.querySelector(
        '[data-filter="' + chip.getAttribute("data-filter-key") + '"]'
      );
      if (!target) { return; }
      var value = chip.getAttribute("data-filter-value");
      target.value = target.value === value ? "" : value;
      apply();
    });
  }
  apply();
})();
