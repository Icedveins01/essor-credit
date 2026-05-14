import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q") || "";

    if (query.trim().length < 3) {
      return NextResponse.json([]);
    }

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&q=${encodeURIComponent(
      query.trim()
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "EssorCredit/1.0",
        "Accept-Language": "fr,en,de,es,it",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json([]);
    }

    const data = await response.json();

    const suggestions = Array.isArray(data)
      ? data.map((item: any) => ({
          label: item.display_name || "",
          name:
            item.name ||
            item.address?.road ||
            item.address?.pedestrian ||
            "",
          city:
            item.address?.city ||
            item.address?.town ||
            item.address?.village ||
            item.address?.municipality ||
            item.address?.county ||
            item.address?.state ||
            "",
          postcode: item.address?.postcode || "",
          country: item.address?.country || "",
          street:
            item.address?.road ||
            item.address?.pedestrian ||
            item.address?.suburb ||
            "",
          houseNumber: item.address?.house_number || "",
          lat: item.lat || "",
          lon: item.lon || "",
        }))
      : [];

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Erreur autocomplete mondial :", error);
    return NextResponse.json([], { status: 500 });
  }
}