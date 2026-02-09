const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-ico-lookup-contract",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const ico = url.searchParams.get("ico");
    const contract = req.headers.get("X-ICO-LOOKUP-CONTRACT") || "none";

    if (!ico) {
      return new Response(
        JSON.stringify({ error: "Missing 'ico' query parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate ICO format (should be numeric, 6-8 digits for Slovak companies)
    const icoRegex = /^\d{6,8}$/;
    if (!icoRegex.test(ico)) {
      return new Response(
        JSON.stringify({
          error: "Invalid ICO format",
          detail: `ICO '${ico}' must be 6-8 digits`,
          contract,
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For now, return mock company data for valid ICOs
    // This can be replaced with a real external API call later
    const companyData = {
      ico,
      contract,
      name: `Test Company ${ico}`,
      address: "Bratislava, Slovakia",
      status: "active",
      registered: "2020-01-15",
      legal_form: "s.r.o.",
      _meta: {
        source: "proxy-search-edge-function",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    return new Response(JSON.stringify(companyData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
