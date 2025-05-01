const fromSelect = document.getElementById("fromCurrencySelect");
const toSelect = document.getElementById("toCurrencySelect");
const fromInput = document.getElementById("fromCurrency");
const toInput = document.getElementById("toCurrency");

let rates = {};
let isTypingFrom = true;

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
  currencyCodes.forEach(code => {
    const opt1 = document.createElement("option");
    opt1.value = code;
    opt1.textContent = code;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = code;
    opt2.textContent = code;
    toSelect.appendChild(opt2);
  });

  fromSelect.value = "USD";
  toSelect.value = "EUR";
}

function updateRateDisplay() {
  const from = fromSelect.value;
  const to = toSelect.value;
  if (rates[from] && rates[to]) {
    const rate = rates[to] / rates[from];
    document.getElementById("rateDisplay").textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
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

  updateRateDisplay();
}

fromSelect.addEventListener("change", () => {
  updateRateDisplay();
  convert();
});

toSelect.addEventListener("change", () => {
  updateRateDisplay();
  convert();
});

fromInput.addEventListener("input", () => {
  isTypingFrom = true;
  if (fromInput.value === "") {
    toInput.value = "0";
  }
  convert();
});

toInput.addEventListener("input", () => {
  isTypingFrom = false;
  if (toInput.value === "") {
    fromInput.value = "0";
  }
  convert();
});

fetchRates();
