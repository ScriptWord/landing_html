export async function onRequest(context) {
  try {
    // Check for basic auth
    const authorization = context.request.headers.get("Authorization");
    if (!authorization || !isValidAuth(authorization)) {
      return new Response(JSON.stringify({ 
        success: false,
        message: "Unauthorized" 
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get request body
    const { id, status } = await context.request.json();
    
    // Validate inputs
    if (!id || !status) {
      return new Response(JSON.stringify({
        success: false,
        message: "Missing required fields: id and status"
      }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }
    
    // Valid statuses
    const validStatuses = ["new", "quoted", "accepted", "completed"];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid status value"
      }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }
    
    // Update database
    const stmt = context.env.DB.prepare(
      "UPDATE quote_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    );
    
    const result = await stmt.bind(status, id).run();
    
    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: "Status updated successfully"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: "Failed to update status"
      }), {
        headers: { "Content-Type": "application/json" },
        status: 500
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "An error occurred: " + error.message
    }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}

// Validate basic auth credentials
function isValidAuth(authorization) {
  // In a real app, use environment variables and secure storage
  const expectedAuth = "Basic " + btoa("admin:scriptword2023");
  return authorization === expectedAuth;
} 