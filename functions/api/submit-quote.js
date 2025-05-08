/**
 * Cloudflare Worker to handle quote form submissions
 */
export async function onRequest(context) {
  try {
    // Get the form data
    const formData = await context.request.formData();
    
    // Extract values from the form
    const firstName = formData.get('first_name') || '';
    const lastName = formData.get('last_name') || '';
    const email = formData.get('email') || '';
    const comments = formData.get('comments') || '';
    
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'First name, last name, and email are required' 
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 400
      });
    }
    
    // Get document list if any
    const files = formData.getAll('files');
    const documentList = files.length > 0 ? JSON.stringify(files.map(file => file.name)) : '';
    
    // Insert into database
    const stmt = context.env.DB.prepare(
      `INSERT INTO quote_requests (first_name, last_name, email, comments, document_list) 
       VALUES (?, ?, ?, ?, ?)`
    );
    
    await stmt.bind(firstName, lastName, email, comments, documentList).run();
    
    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Quote request submitted successfully'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    // Log the error on the server
    console.error('Error submitting quote request:', error);
    
    // Return error response
    return new Response(JSON.stringify({
      success: false,
      message: 'An error occurred while processing your request'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
} 