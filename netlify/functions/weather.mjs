export const config = { path: "/api/weather", method: ["GET"] };

const forecastUrl = "https://api.open-meteo.com/v1/forecast?latitude=53.5511&longitude=9.9937&current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=5";

export default async function weather() {
  try {
    const response = await fetch(forecastUrl, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Weather upstream unavailable");
    const payload = await response.json();
    if (!payload.current || !payload.daily) throw new Error("Invalid forecast");
    return Response.json({
      current: payload.current,
      daily: payload.daily,
      timezone: payload.timezone,
      city: "Hamburg",
      fetchedAt: new Date().toISOString(),
      stale: false,
    }, { headers: { "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=3600" } });
  } catch {
    return Response.json({ available: false, message: "The Hamburg forecast is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}