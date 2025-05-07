const fromSelect = document.getElementById("fromCurrencySelect");
const toSelect = document.getElementById("toCurrencySelect");
const fromInput = document.getElementById("fromCurrency");
const toInput = document.getElementById("toCurrency");

let rates = {};
let isTypingFrom = true;

const getImageURL = (currencyCode) => {
  const flag = "https://wise.com/public-resources/assets/flags/rectangle/{currencyCode}.png";
  return flag.replace("{currencyCode}", currencyCode.toLowerCase());
};

async function fetchRates() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    rates = data.rates;
    populateSelects(Object.keys(rates));
    updateRateDisplay();
    convert();
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

function populateSelects(currencyCodes) {
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  currencyCodes.forEach(currencyCode => {
    const flagUrl = getImageURL(currencyCode);
    const optionText = `${currencyCode} `;
    
    const opt1 = document.createElement("option");
    opt1.value = currencyCode;
    opt1.textContent = optionText;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = currencyCode;
    opt2.textContent = optionText;
    toSelect.appendChild(opt2);
  });

  fromSelect.value = "USD";
  toSelect.value = "EUR";

  loadFlag(fromSelect);
  loadFlag(toSelect);
}

function updateRateDisplay() {
  const rateDisplay = document.getElementById("rateDisplay");
  if (rateDisplay) {
    rateDisplay.remove();
  }
}

function convert() {
  const from = fromSelect.value;
  const to = toSelect.value;
  const fromAmount = parseFloat(fromInput.value);
  const toAmount = parseFloat(toInput.value);

  if (isTypingFrom && !isNaN(fromAmount)) {
    const usd = fromAmount / rates[from];
    const result = usd * rates[to];
    toInput.value = result.toFixed(2);
  } else if (!isTypingFrom && !isNaN(toAmount)) {
    const usd = toAmount / rates[to];
    const result = usd * rates[from];
    fromInput.value = result.toFixed(2);
  }

  if (toInput.value <0 || toInput.value <0) {
    fromInput.value = 0;
    toInput.value = 0;
  }
  if (toInput.value <0 || toInput.value <0) {
    fromInput.value = 0;
    toInput.value = 0;
  }

  updateRateDisplay();
}

function loadFlag(selectElement) {
  const flagContainer = selectElement === fromSelect ? document.getElementById("fromFlag") : document.getElementById("toFlag");
  const currencyCode = selectElement.value;
  const flagUrl = getImageURL(currencyCode);
  flagContainer.src = flagUrl;
}

fromSelect.addEventListener("change", () => {
  loadFlag(fromSelect);
  updateRateDisplay();
  convert();
});

toSelect.addEventListener("change", () => {
  loadFlag(toSelect);
  updateRateDisplay();
  convert();
});

fromInput.addEventListener("input", () => {
  isTypingFrom = true;
  if (fromInput.value === "") {
    toInput.value = 0;
  }
  convert();
});

toInput.addEventListener("input", () => {
  isTypingFrom = false;
  if (toInput.value === "") {
    fromInput.value = 0;
  }
  convert();
});

fetchRates();