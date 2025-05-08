export async function onRequest(context) {
  try {
    // Check for basic auth (in a real app, use a more secure authentication method)
    const authorization = context.request.headers.get("Authorization");
    if (!authorization || !isValidAuth(authorization)) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Access"',
        },
      });
    }

    // Get submissions from database
    const submissions = await getSubmissions(context.env.DB);

    // Generate HTML
    const html = generateAdminPage(submissions);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html"
      }
    });
  } catch (error) {
    return new Response("Error: " + error.message, { status: 500 });
  }
}

// Validate basic auth credentials
function isValidAuth(authorization) {
  // In a real app, use environment variables and secure storage
  // This is just a simple example
  const expectedAuth = "Basic " + btoa("admin:scriptword2023");
  return authorization === expectedAuth;
}

// Get submissions from database
async function getSubmissions(db) {
  const { results } = await db
    .prepare("SELECT * FROM quote_requests ORDER BY created_at DESC")
    .all();
  return results;
}

// Generate admin page HTML
function generateAdminPage(submissions) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote Submissions - Admin</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
    <style>
      body { padding: 20px; }
      .card { margin-bottom: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1 class="mb-4">Quote Request Submissions</h1>
      
      ${submissions.length > 0 ? `
        <div class="row">
          ${submissions.map(submission => `
            <div class="col-md-6 col-lg-4">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">${submission.first_name} ${submission.last_name}</h5>
                  <span class="badge ${getStatusBadge(submission.status)}">${submission.status}</span>
                </div>
                <div class="card-body">
                  <p><strong>Name:</strong> ${submission.first_name} ${submission.last_name}</p>
                  <p><strong>Email:</strong> ${submission.email}</p>
                  <p><strong>Date:</strong> ${new Date(submission.created_at).toLocaleString()}</p>
                  <p><strong>Comments:</strong> ${submission.comments || 'None'}</p>
                  ${submission.document_list ? `
                    <p><strong>Documents:</strong> ${formatDocumentList(submission.document_list)}</p>
                  ` : ''}
                </div>
                <div class="card-footer">
                  <select class="form-select status-select" data-id="${submission.id}">
                    <option value="new" ${submission.status === 'new' ? 'selected' : ''}>New</option>
                    <option value="quoted" ${submission.status === 'quoted' ? 'selected' : ''}>Quoted</option>
                    <option value="accepted" ${submission.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                    <option value="completed" ${submission.status === 'completed' ? 'selected' : ''}>Completed</option>
                  </select>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : '<div class="alert alert-info">No submissions yet.</div>'}
    </div>
    
    <script>
      // In a real app, add functionality to update status
      document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
          const id = e.target.dataset.id;
          const status = e.target.value;
          try {
            const response = await fetch('/api/update-status', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': document.cookie.replace(/(?:(?:^|.*;\s*)auth\s*\=\s*([^;]*).*$)|^.*$/, "$1")
              },
              body: JSON.stringify({ id, status })
            });
            
            if (response.ok) {
              alert('Status updated successfully');
            } else {
              alert('Failed to update status');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating status');
          }
        });
      });
    </script>
  </body>
  </html>
  `;
}

// Helper function to get the right badge color for status
function getStatusBadge(status) {
  switch (status) {
    case 'new': return 'bg-primary';
    case 'quoted': return 'bg-warning';
    case 'accepted': return 'bg-success';
    case 'completed': return 'bg-dark';
    default: return 'bg-secondary';
  }
}

// Helper function to format document list
function formatDocumentList(documentListJson) {
  try {
    const documents = JSON.parse(documentListJson);
    return documents.map(doc => `<span class="badge bg-secondary me-1">${doc}</span>`).join(' ');
  } catch (e) {
    return documentListJson;
  }
} 