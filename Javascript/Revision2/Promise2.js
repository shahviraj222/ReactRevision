// Promise.all() and AbortController

// Get the weather in Mumbai and the latest news."
// getweather and getnews are the funcitons

async function runAgent() {
  const weather = await getWeather();
  const news = await getNews();

  console.log(weather, news);
}

// total wait  =  getweather + getnews

// Solutions

const [weather1, news1] = Promise.all([getWeather(), getNews()]);

// Perfetly runing

function runTool(name, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(name + " completed");
    }, delay);
  });
}

async function runAgent() {
  const results = await Promise.all([
    runTool("Weather", 2000),
    runTool("News", 3000),
  ]);

  console.log(results);
}

runAgent();
