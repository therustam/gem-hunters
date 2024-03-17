//hook.us api

export async function sendPostRequest(url, data) {
    try {
      
      console.log(data.cta_btn)
      const req=await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      
      console.log(req.status===200?"Successfull Payment POST Request sent to make.com for the following user":"Successfull Payment Request wasn't able to sent to make.com")
  
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  }