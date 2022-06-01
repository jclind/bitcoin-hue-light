const lightId = 10

require('dotenv').config()
const axios = require('axios')

const controlLight = async (lightId, on, hue, sat, bri) => {
  try {
    return await axios.put(
      `http://${process.env.HUE_BRIDGE_IP}/api/${process.env.HUE_USERNAME}/lights/${lightId}/state`,
      { on, ...(sat && { sat }), ...(bri && { bri }), ...(hue && { hue }) }
    )
  } catch (err) {
    console.error(err)
  }
}
const setBitcoinLight = async () => {
  try {
    // Get current Bitcoin data
    const response = await axios.get(
      `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NOMICS_API_KEY}&ids=BTC&interval=1d`
    )

    const data = response.data[0]
    const percentChange = Number(data['1d'].price_change_pct) * 100

    const red = 1
    const green = 26706
    const brightness = 250

    // If percent change is positive, green light is shown otherwise red light is shown.
    // The higher the percentage, the higher the color saturation
    if (percentChange >= 0) {
      const sat = percentChange > 5 ? 250 : percentChange * 51
      controlLight(lightId, true, green, sat, brightness)
    } else {
      const sat =
        Math.abs(percentChange) > 5 ? 250 : Math.abs(percentChange) * 51
      controlLight(lightId, true, red, sat, brightness)
    }
  } catch (err) {
    console.log(err)
  }
}

const timeLoop = () => {
  setInterval(() => {
    setBitcoinLight()
  }, 30000)
}

timeLoop()
