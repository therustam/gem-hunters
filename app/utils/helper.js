//hook.us api

export async function sendPostRequest(url, data) {
    // console.log("🚀 ~ sendPostRequest ~ data:", data)
    try {
      
      const req=await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  }